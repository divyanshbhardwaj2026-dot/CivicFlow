import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { getAIProvider } from './server/ai/provider';
import { RoutingEngine } from './server/services/routing';
import { DuplicateDetectionService } from './server/services/duplicate';
import { IncidentClusterService } from './server/services/cluster';
import { AnalyticsService } from './server/services/analytics';
import { eventBus } from './server/events';
import { Category, Priority, ComplaintStatus, Role, Complaint } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Request logger
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
    next();
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString(), platform: 'CivicFlow AI' });
  });

  // ----------------------------------------------------
  // AUTHENTICATION ROUTES
  // ----------------------------------------------------
  app.post('/api/v1/auth/login', (req: Request, res: Response) => {
    const { email, password, portal } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Email is required' } });
    }

    let user = db.getUserByEmail(email);

    // If logging in as citizen and user doesn't exist, auto-create for seamless prototype experience
    if (!user) {
      if (portal === 'admin') {
        // Create demo admin if email matches admin pattern
        user = db.addUser({
          id: `usr-admin-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: Role.CITY_ADMIN,
          city_id: 'city-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } else {
        user = db.addUser({
          id: `usr-cit-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: Role.CITIZEN,
          city_id: 'city-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    // Role check: citizen cannot access admin portal unless assigned
    if (portal === 'admin' && user.role === Role.CITIZEN) {
      return res.status(403).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Citizen credentials cannot access Administrator Command Centre' },
      });
    }

    res.json({
      success: true,
      data: {
        user,
        token: `jwt-mock-${user.id}-${Date.now()}`,
        expires_at: new Date(Date.now() + 86400000).toISOString(),
      },
    });
  });

  app.post('/api/v1/auth/register', (req: Request, res: Response) => {
    const { name, email, phone, city_id, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Name and email are required' } });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, error: { code: 'USER_EXISTS', message: 'Account with this email already exists' } });
    }

    const newUser = db.addUser({
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      city_id: city_id || 'city-1',
      role: role === 'admin' ? Role.DEPARTMENT_ADMIN : Role.CITIZEN,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    res.json({
      success: true,
      data: {
        user: newUser,
        token: `jwt-mock-${newUser.id}-${Date.now()}`,
      },
    });
  });

  app.post('/api/v1/auth/logout', (req: Request, res: Response) => {
    res.json({ success: true, data: { message: 'Logged out successfully' } });
  });

  // ----------------------------------------------------
  // REAL-TIME SSE EVENT STREAM
  // ----------------------------------------------------
  app.get('/api/v1/events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    eventBus.addClient(res);

    // Send initial handshake
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: new Date().toISOString(), message: 'Connected to CivicFlow Realtime Broadcast' })}\n\n`);

    req.on('close', () => {
      eventBus.removeClient(res);
    });
  });

  // ----------------------------------------------------
  // AI ANALYSIS ENDPOINT
  // ----------------------------------------------------
  app.post('/api/v1/ai/analyze', async (req: Request, res: Response) => {
    try {
      const { complaint, city, location, language } = req.body;
      if (!complaint || typeof complaint !== 'string' || complaint.trim().length === 0) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Complaint description is required' } });
      }

      const aiProvider = getAIProvider();
      const analysis = await aiProvider.analyze({ complaint, city, location, language });

      res.json({ success: true, data: analysis });
    } catch (err: any) {
      console.error('Error in /api/v1/ai/analyze:', err);
      res.status(500).json({ success: false, error: { code: 'AI_PROVIDER_ERROR', message: err.message || 'AI analysis failed' } });
    }
  });

  // ----------------------------------------------------
  // COMPLAINT SUBMISSION & PIPELINE
  // ----------------------------------------------------
  app.post('/api/v1/complaints', async (req: Request, res: Response) => {
    try {
      const {
        description,
        city,
        location,
        language,
        citizen_id,
        citizen_name,
        citizen_email,
        citizen_phone,
        image_url,
        attachments,
        category: manualCategory,
      } = req.body;

      if (!description || description.trim().length === 0) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Complaint description cannot be empty.' } });
      }

      // Step 1: Execute AI Pipeline
      const aiProvider = getAIProvider();
      const aiResult = await aiProvider.analyze({
        complaint: description,
        city: city || 'New Delhi',
        location: location || 'Main Sector',
        language,
      });

      const effectiveCategory = (manualCategory && manualCategory !== 'auto' ? manualCategory : aiResult.category) as Category;

      // Find matching city & ward from db
      const cities = db.getCities();
      const matchedCity = cities.find(c => c.name.toLowerCase() === (city || aiResult.city).toLowerCase()) || cities[0];
      const wards = db.getWards(matchedCity.id);
      let matchedWard = wards.find(w => location && location.toLowerCase().includes(w.name.toLowerCase().split('-')[1]?.trim().toLowerCase() || '---'));
      if (!matchedWard && wards.length > 0) {
        matchedWard = wards[0];
      }

      // Step 2: Route to Department & Officer via Intelligent Routing Engine
      const routingDecision = RoutingEngine.routeComplaint(
        effectiveCategory,
        matchedCity.id,
        matchedWard?.id,
        description,
        location || aiResult.location
      );

      // Step 3: Duplicate & Similarity Detection
      const simResult = DuplicateDetectionService.findSimilarComplaints(description, effectiveCategory, matchedCity.id, location);

      // Generate formatted unique complaint ID (e.g. CF-2026-00428)
      const existingComplaints = db.getComplaints();
      const nextNum = 421 + existingComplaints.length;
      const complaintId = `CF-2026-${String(nextNum).padStart(5, '0')}`;

      const initialTimeline = [
        {
          id: `h-${Date.now()}-1`,
          complaint_id: complaintId,
          old_status: ComplaintStatus.SUBMITTED,
          new_status: ComplaintStatus.CLASSIFIED,
          changed_by: 'CivicFlow AI Engine',
          timestamp: new Date().toISOString(),
          comment: `Auto-classified: ${effectiveCategory} (${(aiResult.confidence * 100).toFixed(0)}% confidence). Priority: ${aiResult.priority}`,
        },
        {
          id: `h-${Date.now()}-2`,
          complaint_id: complaintId,
          old_status: ComplaintStatus.CLASSIFIED,
          new_status: ComplaintStatus.ROUTED,
          changed_by: 'CivicFlow Routing Engine',
          timestamp: new Date().toISOString(),
          comment: `Auto-routed to ${routingDecision.department.name} (${routingDecision.jurisdiction_name || 'Zonal Division'}). SLA Target: ${routingDecision.sla_hours}h`,
        },
        {
          id: `h-${Date.now()}-3`,
          complaint_id: complaintId,
          old_status: ComplaintStatus.ROUTED,
          new_status: ComplaintStatus.ASSIGNED,
          changed_by: 'Supervisory Dispatcher',
          timestamp: new Date().toISOString(),
          comment: routingDecision.officer
            ? `Assigned to Field Officer ${routingDecision.officer.name} (${routingDecision.officer.designation})`
            : `Assigned to ${routingDecision.department.head_officer || 'Department Zonal In-Charge'}`,
        },
      ];

      const newComplaint: Complaint = {
        id: complaintId,
        citizen_id: citizen_id || 'usr-citizen-1',
        citizen_name: citizen_name || 'Aarav Sharma',
        citizen_email: citizen_email || 'citizen@civicflow.gov',
        citizen_phone: citizen_phone || '+91 98111 22334',
        description,
        original_language: aiResult.language,
        normalized_text: aiResult.normalized_text,
        category: effectiveCategory,
        subcategory: aiResult.subcategory || 'General Civic Grievance',
        priority: aiResult.priority,
        severity_score: aiResult.severity_score,
        city_id: matchedCity.id,
        city_name: matchedCity.name,
        ward_id: matchedWard?.id,
        ward_name: matchedWard?.name,
        location: location || aiResult.location,
        latitude: matchedCity.lat + (Math.random() * 0.04 - 0.02),
        longitude: matchedCity.lng + (Math.random() * 0.04 - 0.02),
        duration: aiResult.duration || '1-3 days',
        image_url: image_url || null,
        attachments: attachments || (image_url ? [image_url] : []),
        department_id: routingDecision.department.id,
        department_name: routingDecision.department.name,
        departmentId: routingDecision.department.id,
        assigned_officer_id: routingDecision.officer?.id || null,
        assigned_officer_name: routingDecision.officer?.name || null,
        administrator_id: routingDecision.administrator_id,
        administratorId: routingDecision.administrator_id,
        jurisdiction_id: routingDecision.jurisdiction_id,
        jurisdictionId: routingDecision.jurisdiction_id,
        status: ComplaintStatus.ASSIGNED,
        ai_confidence: aiResult.confidence,
        suggested_action: aiResult.suggested_action,
        sla_hours: routingDecision.sla_hours,
        sla_deadline: routingDecision.sla_deadline,
        cluster_id: simResult.matched_cluster_id || null,
        related_complaints_count: simResult.related_complaints.length,
        comments: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        history: initialTimeline,
        timeline: initialTimeline,
      };

      // Persist complaint
      db.addComplaint(newComplaint);

      // Step 4: Incident Clustering
      const clusterResult = IncidentClusterService.evaluateAndCluster(newComplaint);

      // Step 5: Broadcast Real-Time Event to connected Administrator Command Centers & Citizens
      const eventPayload = {
        type: 'complaint_created',
        data: newComplaint,
        timestamp: new Date().toISOString(),
        complaint: newComplaint,
        cluster: clusterResult.cluster,
        message: `🚨 New ${newComplaint.priority} Complaint: ${newComplaint.category.replace('_', ' ')} in ${newComplaint.city_name} (${newComplaint.location}) auto-routed to ${newComplaint.department_name}`,
      };
      eventBus.emitEvent(eventPayload);

      res.status(201).json({
        success: true,
        data: newComplaint,
      });
    } catch (err: any) {
      console.error('Error in POST /api/v1/complaints:', err);
      res.status(500).json({ success: false, error: { code: 'DATABASE_ERROR', message: err.message || 'Failed to submit complaint' } });
    }
  });

  // ----------------------------------------------------
  // COMPLAINTS LIST & DETAILS
  // ----------------------------------------------------
  app.get('/api/v1/complaints', (req: Request, res: Response) => {
    const { citizen_id, city_id, category, department_id, priority, status, search, cluster_id } = req.query;

    const complaints = db.getComplaints({
      citizen_id: citizen_id as string,
      city_id: city_id as string,
      category: category as string,
      department_id: department_id as string,
      priority: priority as string,
      status: status as string,
      search: search as string,
      cluster_id: cluster_id as string,
    });

    res.json({
      success: true,
      data: {
        complaints,
        total: complaints.length,
      },
    });
  });

  app.get('/api/v1/complaints/:id', (req: Request, res: Response) => {
    const complaint = db.getComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Complaint not found' } });
    }
    res.json({ success: true, data: complaint });
  });

  app.patch('/api/v1/complaints/:id', (req: Request, res: Response) => {
    const { status, priority, department_id, assigned_officer_id, assigned_officer_name, changed_by, comment } = req.body;
    
    // Look up officer name if not provided
    let officerName = assigned_officer_name;
    if (assigned_officer_id && !officerName) {
      const allOfficers = db.getOfficers();
      const found = allOfficers.find(o => o.id === assigned_officer_id);
      if (found) officerName = found.name;
    }

    const updated = db.updateComplaint(
      req.params.id,
      {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(department_id && { department_id }),
        ...(assigned_officer_id && { assigned_officer_id }),
        ...(officerName && { assigned_officer_name: officerName }),
      },
      changed_by || officerName || 'Administrator',
      comment
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Complaint not found' } });
    }

    const eventPayload = {
      type: 'complaint_updated',
      data: updated,
      timestamp: new Date().toISOString(),
      complaint: updated,
      message: `Complaint #${updated.id} status updated to ${updated.status.replace('_', ' ')}`,
    };
    eventBus.emitEvent(eventPayload);

    res.json({ success: true, data: updated });
  });

  // Comments / Updates endpoint (Citizen <-> Admin interactive messaging)
  app.post('/api/v1/complaints/:id/comments', (req: Request, res: Response) => {
    const { author_id, author_name, author_role, text, is_internal } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Comment text is required' } });
    }

    const updated = db.addCommentToComplaint(req.params.id, {
      author_id: author_id || 'usr-anon',
      author_name: author_name || 'Civic Participant',
      author_role: author_role || 'CITIZEN',
      text: text.trim(),
      is_internal: !!is_internal,
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Complaint not found' } });
    }

    eventBus.emitEvent({
      type: 'complaint_updated',
      data: updated,
      timestamp: new Date().toISOString(),
      complaint: updated,
      message: `New message on #${updated.id} from ${author_name || 'Civic Participant'}`,
    });

    res.json({ success: true, data: updated });
  });

  app.post('/api/v1/complaints/:id/assign', (req: Request, res: Response) => {
    const { officer_id, officer_name, department_id, changed_by } = req.body;
    const updated = db.updateComplaint(
      req.params.id,
      {
        assigned_officer_id: officer_id,
        assigned_officer_name: officer_name,
        ...(department_id && { department_id }),
        status: ComplaintStatus.ASSIGNED,
      },
      changed_by || 'Supervisory Admin',
      `Assigned to Field Officer ${officer_name}`
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Complaint not found' } });
    }

    eventBus.emitEvent({
      type: 'complaint_updated',
      data: updated,
      timestamp: new Date().toISOString(),
      complaint: updated,
      message: `Officer ${officer_name} assigned to Complaint #${updated.id}`,
    });

    res.json({ success: true, data: updated });
  });

  app.post('/api/v1/complaints/:id/resolve', (req: Request, res: Response) => {
    const { resolution_notes, resolved_by, before_image_url, after_image_url, action_taken, crew_dispatch_id } = req.body;
    
    const resolutionEvidence = {
      notes: resolution_notes || 'All reported civic issues have been addressed on-ground by the field crew.',
      resolved_by: resolved_by || 'Department Field Engineer',
      resolved_at: new Date().toISOString(),
      before_image_url: before_image_url || null,
      after_image_url: after_image_url || null,
      action_taken: action_taken || 'Repaired and verified on-site by field team.',
      crew_dispatch_id: crew_dispatch_id || `CRW-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    const updated = db.updateComplaint(
      req.params.id,
      {
        status: ComplaintStatus.RESOLVED,
        resolved_at: new Date().toISOString(),
        resolution_evidence: resolutionEvidence,
      },
      resolved_by || 'Department Field Engineer',
      `Resolved: ${resolution_notes || 'Field team completed remediation.'}`
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Complaint not found' } });
    }

    eventBus.emitEvent({
      type: 'complaint_updated',
      data: updated,
      timestamp: new Date().toISOString(),
      complaint: updated,
      message: `✅ Complaint #${updated.id} was marked RESOLVED: ${resolution_notes || 'Action completed successfully.'}`,
    });

    res.json({ success: true, data: updated });
  });

  app.post('/api/v1/complaints/:id/reassign', (req: Request, res: Response) => {
    const { department_id, department_name, officer_id, officer_name, reason, changed_by } = req.body;
    
    const updated = db.updateComplaint(
      req.params.id,
      {
        ...(department_id && { department_id, departmentId: department_id }),
        ...(department_name && { department_name }),
        ...(officer_id && { assigned_officer_id: officer_id, assigned_officer_name: officer_name }),
        status: ComplaintStatus.ROUTED,
      },
      changed_by || 'Department Administrator',
      `Transferred: ${reason || 'Jurisdiction or departmental reassignment'}`
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Complaint not found' } });
    }

    eventBus.emitEvent({
      type: 'complaint_updated',
      data: updated,
      timestamp: new Date().toISOString(),
      complaint: updated,
      message: `Complaint #${updated.id} transferred to ${department_name || 'new department'}`,
    });

    res.json({ success: true, data: updated });
  });

  app.post('/api/v1/complaints/:id/feedback', (req: Request, res: Response) => {
    const { rating, comment } = req.body;
    const complaint = db.getComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Complaint not found' } });
    }

    const feedback = {
      id: `fb-${Date.now()}`,
      complaint_id: complaint.id,
      rating: Number(rating) || 5,
      comment: comment || '',
      created_at: new Date().toISOString(),
    };

    const updated = db.updateComplaint(complaint.id, { feedback });

    res.json({ success: true, data: updated });
  });

  // ----------------------------------------------------
  // CLUSTERS & HOTSPOTS
  // ----------------------------------------------------
  app.get('/api/v1/clusters', (req: Request, res: Response) => {
    const clusters = db.getClusters();
    res.json({ success: true, data: clusters });
  });

  app.get('/api/v1/clusters/:id', (req: Request, res: Response) => {
    const cluster = db.getClusterById(req.params.id);
    if (!cluster) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Cluster not found' } });
    }
    const memberComplaints = db.getComplaints().filter(c => cluster.member_complaint_ids.includes(c.id));
    res.json({ success: true, data: { cluster, member_complaints: memberComplaints } });
  });

  app.get('/api/v1/dashboard/hotspots', (req: Request, res: Response) => {
    const hotspots = db.getHotspots();
    res.json({ success: true, data: hotspots });
  });

  // ----------------------------------------------------
  // DASHBOARD & ANALYTICS
  // ----------------------------------------------------
  app.get('/api/v1/dashboard/summary', (req: Request, res: Response) => {
    const summary = AnalyticsService.getDashboardSummary();
    res.json({ success: true, data: summary });
  });

  app.get('/api/v1/dashboard/categories', (req: Request, res: Response) => {
    const categories = AnalyticsService.getCategoryMetrics();
    res.json({ success: true, data: categories });
  });

  app.get('/api/v1/dashboard/cities', (req: Request, res: Response) => {
    const cities = AnalyticsService.getCityMetrics();
    res.json({ success: true, data: cities });
  });

  app.get('/api/v1/dashboard/departments', (req: Request, res: Response) => {
    const departments = AnalyticsService.getDepartmentMetrics();
    res.json({ success: true, data: departments });
  });

  app.get('/api/v1/dashboard/trends', (req: Request, res: Response) => {
    const trends = AnalyticsService.getTrendMetrics();
    res.json({ success: true, data: trends });
  });

  // ----------------------------------------------------
  // REFERENCE ENTITY ENDPOINTS
  // ----------------------------------------------------
  app.get('/api/v1/cities', (req: Request, res: Response) => {
    res.json({ success: true, data: db.getCities() });
  });

  app.get('/api/v1/wards', (req: Request, res: Response) => {
    const { city_id } = req.query;
    res.json({ success: true, data: db.getWards(city_id as string) });
  });

  app.get('/api/v1/departments', (req: Request, res: Response) => {
    const { city_id } = req.query;
    res.json({ success: true, data: db.getDepartments(city_id as string) });
  });

  app.get('/api/v1/officers', (req: Request, res: Response) => {
    const { department_id, city_id } = req.query;
    res.json({ success: true, data: db.getOfficers(department_id as string, city_id as string) });
  });

  // ----------------------------------------------------
  // DEV-ONLY COMPLAINT SIMULATOR FOR HACKATHON LIVE DEMO
  // ----------------------------------------------------
  app.post('/api/v1/dev/simulate-complaint', async (req: Request, res: Response) => {
    const sampleComplaints = [
      {
        description: 'Sector 5 Main Road par water pipeline burst ho gaya hai, sadak par flood jaisa paani bhar raha hai.',
        city: 'New Delhi',
        location: 'Sector 5 Main Avenue',
        language: 'Hindi (हिंदी)',
      },
      {
        description: 'Massive open garbage dump burning behind Block B Market Indiranagar causing severe toxic smoke.',
        city: 'Bengaluru',
        location: 'Indiranagar Block B Market',
        language: 'English',
      },
      {
        description: 'High voltage electrical wire hanging dangerously low over bus stand near SV Road.',
        city: 'Mumbai',
        location: 'SV Road Bus Stand',
        language: 'English',
      },
      {
        description: 'तीन दिन से हमारे मोहल्ले में नल में बिल्कुल पानी नहीं आ रहा है, टैंकर माफिया पैसे लूट रहे हैं।',
        city: 'Bengaluru',
        location: 'Bellandur Green Glen Sector 150',
        language: 'Hindi (हिंदी)',
      },
    ];

    const pick = sampleComplaints[Math.floor(Math.random() * sampleComplaints.length)];

    // Trigger standard submission pipeline
    const aiProvider = getAIProvider();
    const aiResult = await aiProvider.analyze({
      complaint: pick.description,
      city: pick.city,
      location: pick.location,
    });

    const cities = db.getCities();
    const matchedCity = cities.find(c => c.name.toLowerCase() === pick.city.toLowerCase()) || cities[0];
    const routingDecision = RoutingEngine.routeComplaint(aiResult.category, matchedCity.id);
    const simResult = DuplicateDetectionService.findSimilarComplaints(pick.description, aiResult.category, matchedCity.id, pick.location);

    const existingComplaints = db.getComplaints();
    const nextNum = 421 + existingComplaints.length;
    const complaintId = `CF-2026-${String(nextNum).padStart(5, '0')}`;

    const simComplaint: Complaint = {
      id: complaintId,
      citizen_id: `usr-cit-${Date.now()}`,
      citizen_name: 'Live Citizen Reporter',
      citizen_email: 'live.citizen@civicflow.gov',
      citizen_phone: '+91 99887 76655',
      description: pick.description,
      original_language: aiResult.language,
      normalized_text: aiResult.normalized_text,
      category: aiResult.category,
      subcategory: aiResult.subcategory || 'Urgent Civic Alert',
      priority: aiResult.priority,
      severity_score: aiResult.severity_score,
      city_id: matchedCity.id,
      city_name: matchedCity.name,
      location: pick.location,
      latitude: matchedCity.lat + (Math.random() * 0.03 - 0.015),
      longitude: matchedCity.lng + (Math.random() * 0.03 - 0.015),
      duration: aiResult.duration || 'Today',
      department_id: routingDecision.department.id,
      department_name: routingDecision.department.name,
      assigned_officer_id: routingDecision.officer?.id || null,
      assigned_officer_name: routingDecision.officer?.name || null,
      status: ComplaintStatus.ASSIGNED,
      ai_confidence: aiResult.confidence,
      suggested_action: aiResult.suggested_action,
      cluster_id: simResult.matched_cluster_id || null,
      related_complaints_count: simResult.related_complaints.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.addComplaint(simComplaint);
    const clusterResult = IncidentClusterService.evaluateAndCluster(simComplaint);

    eventBus.emitEvent({
      type: 'NEW_COMPLAINT',
      timestamp: new Date().toISOString(),
      complaint: simComplaint,
      cluster: clusterResult.cluster,
      message: `🔔 [LIVE SIMULATOR] New ${simComplaint.priority} Grievance: ${simComplaint.category.replace('_', ' ')} in ${simComplaint.city_name}`,
    });

    res.json({
      success: true,
      message: 'Simulated citizen complaint injected successfully',
      data: simComplaint,
    });
  });

  // ----------------------------------------------------
  // VITE DEV MIDDLEWARE / STATIC PRODUCTION SERVING
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CivicFlow AI Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup failure:', err);
  process.exit(1);
});
