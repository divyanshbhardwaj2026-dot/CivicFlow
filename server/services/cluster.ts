import { Category, Priority, Complaint, ComplaintCluster } from '../../src/types';
import { db } from '../db';
import { eventBus } from '../events';

export class IncidentClusterService {
  static evaluateAndCluster(complaint: Complaint): { cluster?: ComplaintCluster; isNewCluster: boolean } {
    // Check if complaint can be added to an existing cluster in the same city + category + location vicinity
    const clusters = db.getClusters().filter(cl => cl.status === 'ACTIVE');

    let matchedCluster = clusters.find(cl => {
      const sameCategory = cl.category === complaint.category;
      const sameCity = cl.city_id === complaint.city_id || cl.city_name.toLowerCase() === complaint.city_name.toLowerCase();
      const locMatch = cl.location.toLowerCase().includes(complaint.location.toLowerCase().slice(0, 6)) ||
                       complaint.location.toLowerCase().includes(cl.location.toLowerCase().slice(0, 6));
      return sameCategory && sameCity && locMatch;
    });

    if (matchedCluster) {
      // Append to existing cluster
      const updatedMembers = Array.from(new Set([...matchedCluster.member_complaint_ids, complaint.id]));
      const newCount = matchedCluster.complaint_count + 1;
      const updated = db.updateCluster(matchedCluster.id, {
        complaint_count: newCount,
        member_complaint_ids: updatedMembers,
        last_reported_at: new Date().toISOString(),
        spike_percentage: Math.round(matchedCluster.spike_percentage + 15),
      });

      // Update complaint's cluster_id
      db.updateComplaint(complaint.id, { cluster_id: matchedCluster.id });

      if (updated) {
        eventBus.emitEvent({
          type: 'CLUSTER_DETECTED',
          timestamp: new Date().toISOString(),
          cluster: updated,
          message: `🚨 Incident Cluster Updated: ${updated.title} now has ${newCount} linked complaints!`,
        });
      }

      return { cluster: updated || matchedCluster, isNewCluster: false };
    }

    // Check if related complaints threshold has been met to form a NEW cluster (threshold >= 3 related complaints)
    const allComplaints = db.getComplaints({
      city_id: complaint.city_id,
      category: complaint.category,
    });

    const nearbyRelated = allComplaints.filter(c =>
      c.location.toLowerCase().includes(complaint.location.toLowerCase().slice(0, 5)) ||
      complaint.location.toLowerCase().includes(c.location.toLowerCase().slice(0, 5))
    );

    if (nearbyRelated.length >= 3) {
      const newClusterId = `cl-${Date.now()}`;
      const title = `${complaint.location} ${complaint.category.replace('_', ' ')} Concentrated Civic Incident`;
      const newCluster: ComplaintCluster = {
        id: newClusterId,
        title,
        category: complaint.category,
        city_id: complaint.city_id,
        city_name: complaint.city_name,
        ward_id: complaint.ward_id,
        ward_name: complaint.ward_name,
        location: complaint.location,
        latitude: complaint.latitude,
        longitude: complaint.longitude,
        complaint_count: nearbyRelated.length,
        priority: complaint.priority === Priority.CRITICAL ? Priority.CRITICAL : Priority.HIGH,
        confidence: 0.94,
        status: 'ACTIVE',
        recommended_action: `Mobilize emergency municipal inspection squad to ${complaint.location} to resolve acute multi-citizen incident.`,
        member_complaint_ids: nearbyRelated.map(c => c.id),
        spike_percentage: 240,
        first_reported_at: nearbyRelated[nearbyRelated.length - 1].created_at,
        last_reported_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      db.addCluster(newCluster);

      // Associate cluster_id to complaints
      for (const c of nearbyRelated) {
        db.updateComplaint(c.id, { cluster_id: newClusterId });
      }

      eventBus.emitEvent({
        type: 'CLUSTER_DETECTED',
        timestamp: new Date().toISOString(),
        cluster: newCluster,
        message: `🚨 New Civic Incident Cluster Formed: ${newCluster.title} (${nearbyRelated.length} citizen reports linked)`,
      });

      return { cluster: newCluster, isNewCluster: true };
    }

    return { cluster: undefined, isNewCluster: false };
  }
}
