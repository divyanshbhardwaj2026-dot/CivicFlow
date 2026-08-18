import { Category, Complaint } from '../../src/types';
import { db } from '../db';

export interface SimilarityResult {
  is_duplicate: boolean;
  similarity_score: number;
  related_complaints: Complaint[];
  matched_cluster_id?: string | null;
}

export class DuplicateDetectionService {
  static findSimilarComplaints(
    description: string,
    category: Category,
    cityId?: string,
    location?: string
  ): SimilarityResult {
    const existing = db.getComplaints();
    const queryWords = description.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const related: { complaint: Complaint; score: number }[] = [];

    for (const c of existing) {
      let score = 0;

      // Same category match (+0.4)
      if (c.category === category) {
        score += 0.4;
      }

      // Same city match (+0.25)
      if (cityId && (c.city_id === cityId || c.city_name.toLowerCase().includes(cityId.toLowerCase()))) {
        score += 0.25;
      }

      // Location keyword match (+0.2)
      if (location && c.location.toLowerCase().includes(location.toLowerCase().slice(0, 5))) {
        score += 0.2;
      }

      // Text word overlap
      const cWords = (c.description + ' ' + c.normalized_text).toLowerCase();
      let overlapCount = 0;
      for (const w of queryWords) {
        if (cWords.includes(w)) {
          overlapCount++;
        }
      }
      if (queryWords.length > 0) {
        score += Math.min(0.25, (overlapCount / queryWords.length) * 0.25);
      }

      if (score >= 0.6) {
        related.push({ complaint: c, score });
      }
    }

    // Sort by similarity score descending
    related.sort((a, b) => b.score - a.score);

    const topRelated = related.slice(0, 5).map(r => r.complaint);
    const highestScore = related.length > 0 ? related[0].score : 0;
    const isDuplicate = highestScore >= 0.92;

    // Check if any matched complaint belongs to a cluster
    const clusterMatch = topRelated.find(c => c.cluster_id)?.cluster_id || null;

    return {
      is_duplicate: isDuplicate,
      similarity_score: Number(highestScore.toFixed(2)),
      related_complaints: topRelated,
      matched_cluster_id: clusterMatch,
    };
  }
}
