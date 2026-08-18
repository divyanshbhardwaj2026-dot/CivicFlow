import { Category, Department, Officer } from '../../src/types';
import { db } from '../db';

export interface RoutingDecision {
  department: Department;
  officer?: Officer;
  sla_hours: number;
  sla_deadline: string;
  administrator_id?: string;
  administrator_name?: string;
  jurisdiction_id?: string;
  jurisdiction_name?: string;
}

export class RoutingEngine {
  /**
   * Automatically classifies and routes complaints to the appropriate department,
   * jurisdiction, and administrator/officer based on category, keywords, and location.
   */
  static routeComplaint(
    category: Category,
    cityId?: string,
    wardId?: string,
    descriptionText?: string,
    locationText?: string
  ): RoutingDecision {
    const text = `${descriptionText || ''} ${locationText || ''}`.toLowerCase();
    let resolvedCategory = category;

    // Advanced keyword heuristics if category was generic or other
    if (resolvedCategory === Category.OTHER || !resolvedCategory) {
      if (text.includes('pothole') || text.includes('road') || text.includes('asphalt') || text.includes('gaddha') || text.includes('sadak') || text.includes('footpath')) {
        resolvedCategory = Category.ROADS;
      } else if (text.includes('garbage') || text.includes('kooda') || text.includes('trash') || text.includes('waste') || text.includes('sanitation') || text.includes('kachra') || text.includes('smell')) {
        resolvedCategory = Category.WASTE_MANAGEMENT;
      } else if (text.includes('water') || text.includes('paani') || text.includes('pipeline') || text.includes('tanker') || text.includes('jal') || text.includes('leak')) {
        resolvedCategory = Category.WATER_SUPPLY;
      } else if (text.includes('drain') || text.includes('manhole') || text.includes('sewage') || text.includes('naali') || text.includes('overflow')) {
        resolvedCategory = Category.DRAINAGE;
      } else if (text.includes('streetlight') || text.includes('light') || text.includes('bijli') || text.includes('wire') || text.includes('pole') || text.includes('dark')) {
        resolvedCategory = Category.STREET_LIGHTING;
      } else if (text.includes('encroach') || text.includes('traffic') || text.includes('hawker') || text.includes('stall') || text.includes('bus')) {
        resolvedCategory = Category.ENCROACHMENT;
      }
    }

    const departments = db.getDepartments(cityId);

    // Find department that matches category mapping
    let matchedDept = departments.find(d => d.category_mapping.includes(resolvedCategory));

    if (!matchedDept && departments.length > 0) {
      matchedDept = departments[0];
    }

    if (!matchedDept) {
      matchedDept = {
        id: 'dept-gen',
        name: 'Municipal Grievance Redressal Cell',
        code: 'GEN_CIVIC',
        city_id: cityId || 'city-1',
        category_mapping: [resolvedCategory],
        head_officer: 'Commissioner Office Grievance Cell',
        contact_email: 'grievance.hq@civicflow.gov',
        created_at: new Date().toISOString(),
      };
    }

    // Determine jurisdiction (Ward or City)
    const wards = db.getWards(cityId);
    let matchedWard = wards.find(w => w.id === wardId);
    if (!matchedWard && locationText) {
      matchedWard = wards.find(w => locationText.toLowerCase().includes(w.name.toLowerCase().split('-')[1]?.trim().toLowerCase() || '---'));
    }
    if (!matchedWard && wards.length > 0) {
      matchedWard = wards[0];
    }

    const jurisdiction_id = matchedWard ? matchedWard.id : cityId || 'city-1';
    const jurisdiction_name = matchedWard ? matchedWard.name : 'Municipal Corporation Zonal HQ';

    // Find available officer/administrator with lowest workload in this department/city/ward
    const officers = db.getOfficers(matchedDept.id, cityId);
    let matchedOfficer: Officer | undefined;

    if (officers.length > 0) {
      // Sort by workload ascending
      const sortedOfficers = [...officers].sort((a, b) => a.workload - b.workload);
      // Try to find ward-specific officer first
      if (matchedWard) {
        matchedOfficer = sortedOfficers.find(o => o.ward_id === matchedWard?.id) || sortedOfficers[0];
      } else {
        matchedOfficer = sortedOfficers[0];
      }
    }

    // SLA estimation based on category
    let sla_hours = 48;
    switch (resolvedCategory) {
      case Category.DRAINAGE:
      case Category.WATER_SUPPLY:
        sla_hours = 24;
        break;
      case Category.WASTE_MANAGEMENT:
        sla_hours = 12;
        break;
      case Category.ROADS:
        sla_hours = 48;
        break;
      case Category.STREET_LIGHTING:
        sla_hours = 24;
        break;
      case Category.ELECTRICITY:
        sla_hours = 12;
        break;
      default:
        sla_hours = 48;
        break;
    }

    const sla_deadline = new Date(Date.now() + sla_hours * 3600 * 1000).toISOString();

    return {
      department: matchedDept,
      officer: matchedOfficer,
      sla_hours,
      sla_deadline,
      administrator_id: matchedOfficer?.id || matchedDept.head_officer || 'admin-zonal-1',
      administrator_name: matchedOfficer?.name || matchedDept.head_officer || 'Department Zonal In-Charge',
      jurisdiction_id,
      jurisdiction_name,
    };
  }
}

