import { GoogleGenAI, Type } from '@google/genai';
import { Category, Priority, AIAnalysis } from '../../src/types';

export interface AIProviderInput {
  complaint: string;
  city?: string;
  location?: string;
  language?: string;
}

export abstract class AIProvider {
  abstract analyze(input: AIProviderInput): Promise<AIAnalysis>;
}

export class MockAIProvider extends AIProvider {
  async analyze(input: AIProviderInput): Promise<AIAnalysis> {
    const text = input.complaint.toLowerCase();
    const rawText = input.complaint;

    // Detect language
    let detectedLang = 'English';
    const isHindi = /[\u0900-\u097F]/.test(rawText);
    const isMarathi = isHindi && /(आहे|नाही|पाणी|कचरा|रस्ता)/.test(rawText);
    if (isHindi) {
      detectedLang = isMarathi ? 'Marathi (मराठी)' : 'Hindi (हिंदी)';
    }

    // Determine category
    let category = Category.OTHER;
    let subcategory = 'General Municipal Grievance';
    let suggestedDept = 'Citizen Redressal Cell';
    let suggestedAction = 'Dispatch field surveyor to assess citizen request.';
    let priority = Priority.MEDIUM;
    let severity = 0.6;

    if (text.includes('पानी') || text.includes('water') || text.includes('tanker') || text.includes('leakage') || text.includes('pipeline') || text.includes('paani') || text.includes('supply')) {
      category = Category.WATER_SUPPLY;
      subcategory = 'Water Supply Disruption & Pipeline Breakdown';
      suggestedDept = 'Municipal Water Supply & Sewerage Board';
      priority = (text.includes('3 day') || text.includes('4 day') || text.includes('teen din') || text.includes('चार दिन') || text.includes('zero') || text.includes('urgent') || text.includes('no water')) ? Priority.CRITICAL : Priority.HIGH;
      severity = priority === Priority.CRITICAL ? 0.94 : 0.78;
      suggestedAction = 'Inspect feeder supply valve & dispatch emergency municipal water tankers to affected residential blocks.';
    } else if (text.includes('कूड़ा') || text.includes('garbage') || text.includes('waste') || text.includes('dustbin') || text.includes('kachra') || text.includes('gandagi') || text.includes('dump') || text.includes('trash')) {
      category = Category.WASTE_MANAGEMENT;
      subcategory = 'Solid Waste Accumulation & Uncleaned Dump';
      suggestedDept = 'Solid Waste Management & Sanitation Dept';
      priority = (text.includes('rotting') || text.includes('smell') || text.includes('rain') || text.includes('badboo') || text.includes('days') || text.includes('din')) ? Priority.HIGH : Priority.MEDIUM;
      severity = 0.82;
      suggestedAction = 'Dispatch compactor vehicle #DL-04 and 4-member sanitation crew for immediate spot clearance and disinfectant spray.';
    } else if (text.includes('pothole') || text.includes('road') || text.includes('sadak') || text.includes('गड्ढा') || text.includes('accident') || text.includes('asphalt') || text.includes('crater') || text.includes('traffic')) {
      category = Category.ROADS;
      subcategory = 'Pothole & Damaged Road Surface';
      suggestedDept = 'Public Works & Roads Engineering Division';
      priority = (text.includes('accident') || text.includes('deep') || text.includes('fatal') || text.includes('heavy') || text.includes('danger')) ? Priority.HIGH : Priority.MEDIUM;
      severity = 0.84;
      suggestedAction = 'Mobilize cold-mix bitumen patching team with roller compactor during night traffic window (11pm-4am).';
    } else if (text.includes('light') || text.includes('batti') || text.includes('streetlight') || text.includes('dark') || text.includes('अंधेरा') || text.includes('बिजली') || text.includes('lamp')) {
      category = Category.STREET_LIGHTING;
      subcategory = 'Streetlight Outage & Dark Stretch';
      suggestedDept = 'Municipal Lighting & Electrical Services';
      priority = (text.includes('women') || text.includes('safety') || text.includes('unsafe') || text.includes('multiple') || text.includes('road')) ? Priority.HIGH : Priority.MEDIUM;
      severity = 0.76;
      suggestedAction = 'Inspect feeder pillar, check timer relay switch, and replace damaged LED fixtures.';
    } else if (text.includes('drain') || text.includes('drainage') || text.includes('sewer') || text.includes('naali') || text.includes('manhole') || text.includes('gutter') || text.includes('overflow') || text.includes('सीवर')) {
      category = Category.DRAINAGE;
      subcategory = text.includes('manhole') ? 'Open Manhole Hazard' : 'Sewage Overflow & Drain Blockage';
      suggestedDept = 'Municipal Water Supply & Sewerage Board';
      priority = text.includes('manhole') || text.includes('school') ? Priority.CRITICAL : Priority.HIGH;
      severity = text.includes('manhole') ? 0.98 : 0.83;
      suggestedAction = text.includes('manhole')
        ? 'Emergency barricade placement within 30 minutes; install reinforced cast-iron manhole cover immediately.'
        : 'Deploy high-pressure hydraulic jetting truck and suction unit to clear clogged arterial sewer line.';
    } else if (text.includes('encroach') || text.includes('footpath') || text.includes('kabza') || text.includes('hawker') || text.includes('illegal')) {
      category = Category.ENCROACHMENT;
      subcategory = 'Footpath Obstruction & Unauthorized Stalls';
      suggestedDept = 'Urban Transit & Traffic Operations';
      priority = Priority.MEDIUM;
      severity = 0.58;
      suggestedAction = 'Issue 24-hour clearance notice followed by joint zonal municipal enforcement inspection.';
    } else if (text.includes('bus') || text.includes('metro') || text.includes('transit') || text.includes('auto') || text.includes('traffic')) {
      category = Category.PUBLIC_TRANSPORT;
      subcategory = 'Transit Route / Bus Stop Facility Issue';
      suggestedDept = 'Urban Transit & Traffic Operations';
      priority = Priority.MEDIUM;
      severity = 0.62;
      suggestedAction = 'Coordinate with zonal transport depot master for schedule audit and shelter maintenance.';
    }

    // Normalized text translation
    let normalized = rawText;
    if (isHindi) {
      if (text.includes('पानी') || text.includes('paani')) {
        normalized = 'Citizen reports acute water supply shortage and dry taps in locality requiring immediate municipal water tanker relief.';
      } else if (text.includes('कूड़ा') || text.includes('kachra')) {
        normalized = 'Uncollected garbage pile accumulated for several days causing severe health risk and unbearable stench.';
      } else if (text.includes('सीवर') || text.includes('नाली') || text.includes('drain')) {
        normalized = 'Overflowing sewage drain flooding public road with contaminated water.';
      } else {
        normalized = `[Translated from ${detectedLang}]: ${rawText}`;
      }
    }

    // Extract duration
    let duration = '2-4 days';
    const durationMatch = rawText.match(/(\d+)\s*(days|day|दिन|हफ्ते|weeks|hours|घंटे)/i);
    if (durationMatch) {
      duration = `${durationMatch[1]} ${durationMatch[2]}`;
    }

    return {
      language: detectedLang,
      original_language: detectedLang,
      normalized_text: normalized,
      category,
      subcategory,
      priority,
      severity_score: severity,
      city: input.city || 'Detected City',
      location: input.location || 'Local Area Sector',
      duration,
      affected_population_estimate: priority === Priority.CRITICAL ? '500+ residents' : '50-100 residents',
      department: suggestedDept,
      suggested_action: suggestedAction,
      confidence: 0.95,
    };
  }
}

export class GeminiProvider extends AIProvider {
  private ai: GoogleGenAI | null = null;

  constructor() {
    super();
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 5) {
      this.ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }

  async analyze(input: AIProviderInput): Promise<AIAnalysis> {
    if (!this.ai) {
      // Fallback to Mock Provider when GEMINI_API_KEY is not set
      const mock = new MockAIProvider();
      return mock.analyze(input);
    }

    try {
      const prompt = `You are CivicFlow AI, an intelligent multilingual civic grievance classification and triage engine for smart municipal corporations.
Analyze the following citizen complaint and return a structured JSON response.

Input Complaint: "${input.complaint}"
Specified City: "${input.city || 'Unknown'}"
Specified Location: "${input.location || 'Unknown'}"

Allowed Categories:
- WATER_SUPPLY
- WASTE_MANAGEMENT
- ROADS
- STREET_LIGHTING
- DRAINAGE
- ELECTRICITY
- PUBLIC_TRANSPORT
- SANITATION
- ENCROACHMENT
- PUBLIC_INFRASTRUCTURE
- OTHER

Allowed Priorities:
- CRITICAL (immediate public safety hazard, live open manholes, zero water supply across entire neighborhood for multiple days, major flooding)
- HIGH (deep potholes on arterial roads, uncollected garbage piles over multiple days, dark street stretches affecting safety)
- MEDIUM (minor potholes, broken signage, park benches, encroached footpaths)
- LOW (cosmetic issues, minor paint/aesthetic requests)

Instructions:
1. Detect original language (e.g. Hindi, English, Marathi, Tamil, Bengali, etc.).
2. Translate/normalize text into clear professional English summary.
3. Classify strictly into one of the Allowed Categories.
4. Set Priority strictly from Allowed Priorities.
5. Provide a severity score between 0.0 and 1.0.
6. Provide concrete actionable recommendation for municipal officer dispatch.
7. Return confidence score (0.0 to 1.0).`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              language: { type: Type.STRING, description: 'Detected language name' },
              normalized_text: { type: Type.STRING, description: 'Normalized English summary of grievance' },
              category: { type: Type.STRING, description: 'Category enum value' },
              subcategory: { type: Type.STRING, description: 'Specific subcategory issue' },
              priority: { type: Type.STRING, description: 'CRITICAL, HIGH, MEDIUM, or LOW' },
              severity_score: { type: Type.NUMBER, description: 'Severity score 0 to 1' },
              city: { type: Type.STRING, description: 'City name' },
              location: { type: Type.STRING, description: 'Specific neighborhood or ward' },
              duration: { type: Type.STRING, description: 'Estimated or stated duration' },
              affected_population_estimate: { type: Type.STRING, description: 'Estimated population impacted' },
              department: { type: Type.STRING, description: 'Responsible municipal department' },
              suggested_action: { type: Type.STRING, description: 'Actionable dispatch recommendation for municipal staff' },
              confidence: { type: Type.NUMBER, description: 'Model confidence score 0 to 1' },
            },
            required: ['language', 'normalized_text', 'category', 'priority', 'severity_score', 'suggested_action', 'confidence'],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      const parsed = JSON.parse(text);

      // Validate Category enum
      let category = Category.OTHER;
      if (Object.values(Category).includes(parsed.category as Category)) {
        category = parsed.category as Category;
      }

      // Validate Priority enum
      let priority = Priority.MEDIUM;
      if (Object.values(Priority).includes(parsed.priority as Priority)) {
        priority = parsed.priority as Priority;
      }

      return {
        language: parsed.language || 'English',
        original_language: parsed.language || 'English',
        normalized_text: parsed.normalized_text || input.complaint,
        category,
        subcategory: parsed.subcategory || null,
        priority,
        severity_score: typeof parsed.severity_score === 'number' ? Math.min(1, Math.max(0, parsed.severity_score)) : 0.7,
        city: parsed.city || input.city || 'City',
        location: parsed.location || input.location || 'Local Area',
        duration: parsed.duration || null,
        affected_population_estimate: parsed.affected_population_estimate || null,
        department: parsed.department || 'Municipal Services',
        suggested_action: parsed.suggested_action || 'Review and dispatch field unit.',
        confidence: typeof parsed.confidence === 'number' ? Math.min(1, Math.max(0, parsed.confidence)) : 0.94,
      };
    } catch (err) {
      console.warn('GeminiProvider analysis failed, utilizing intelligent MockAIProvider fallback:', err);
      const mock = new MockAIProvider();
      return mock.analyze(input);
    }
  }
}

export function getAIProvider(): AIProvider {
  const providerMode = process.env.AI_PROVIDER || 'gemini';
  if (providerMode === 'mock') {
    return new MockAIProvider();
  }
  return new GeminiProvider();
}
