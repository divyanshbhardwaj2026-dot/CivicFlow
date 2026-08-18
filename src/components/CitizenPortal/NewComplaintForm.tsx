import React, { useState } from 'react';
import { Send, Sparkles, MapPin, Mic, Image as ImageIcon, CheckCircle, AlertCircle, ArrowLeft, Languages, Building2, Upload, Trash2, ShieldAlert } from 'lucide-react';
import { City, Complaint, AIProcessingStep, Category } from '../../types';
import { AIProcessingSteps } from './AIProcessingSteps';
import { api } from '../../lib/api';

interface NewComplaintFormProps {
  cities: City[];
  onComplaintSubmitted: (complaint: Complaint) => void;
  onCancel: () => void;
  currentUserId?: string;
  currentUserName?: string;
}

export const NewComplaintForm: React.FC<NewComplaintFormProps> = ({
  cities,
  onComplaintSubmitted,
  onCancel,
  currentUserId,
  currentUserName,
}) => {
  const [description, setDescription] = useState('');
  const [city, setCity] = useState(cities[0]?.name || 'New Delhi');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<string>('auto');
  const [language, setLanguage] = useState('auto');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const samplePrompts = [
    {
      label: 'Hindi: Water Outage',
      text: 'मेरे इलाके में तीन दिन से पानी नहीं आ रहा है, टैंकर के लिए बहुत परेशानी हो रही है।',
      city: 'Bengaluru',
      location: 'Bellandur Green Glen Sector 150',
      category: 'WATER_SUPPLY',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Hindi: Garbage Dump',
      text: 'चार दिन से सड़क किनारे कूड़ा नहीं उठा है, बदबू फैल रही है और मच्छर पैदा हो रहे हैं।',
      city: 'New Delhi',
      location: 'Block 4 Market, Karol Bagh',
      category: 'WASTE_MANAGEMENT',
      image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'English: Open Manhole / Hazard',
      text: 'Dangerous open manhole directly outside primary school gate. Children could fall in anytime!',
      city: 'New Delhi',
      location: 'Gate #2, St. Xavier School, Rohini Sector 9',
      category: 'DRAINAGE',
      image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'English: Dark Streetlights',
      text: 'Streetlights from pole 12 to 24 are dark on 100ft road. Walking at night feels unsafe.',
      city: 'Bengaluru',
      location: '100ft Road Indiranagar near 12th Main',
      category: 'STREET_LIGHTING',
      image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const presetPhotos = [
    { label: 'Pothole / Road', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80' },
    { label: 'Garbage Dump', url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80' },
    { label: 'Water Leak', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&auto=format&fit=crop&q=80' },
    { label: 'Dark Streetlight', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80' },
  ];

  const [steps, setSteps] = useState<AIProcessingStep[]>([
    { id: '1', label: 'Language Understanding & Normalization', status: 'pending' },
    { id: '2', label: 'Civic Category Classification', status: 'pending' },
    { id: '3', label: 'Urgency & Severity Priority Assessment', status: 'pending' },
    { id: '4', label: 'Municipal Department & Officer Routing', status: 'pending' },
    { id: '5', label: 'Duplicate Detection & Incident Clustering', status: 'pending' },
  ]);

  const loadSample = (sample: typeof samplePrompts[0]) => {
    setDescription(sample.text);
    setCity(sample.city);
    setLocation(sample.location);
    if (sample.category) setCategory(sample.category);
    if (sample.image) setImageUrl(sample.image);
    setError(null);
  };

  const handleVoiceToggle = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setDescription('मेरे इलाके में पानी की पाइपलाइन फट गई है और सारा पानी सड़क पर बह रहा है।');
      setLocation('Main Market Crossroad, Sector 5');
      setCategory('WATER_SUPPLY');
      setImageUrl('https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&auto=format&fit=crop&q=80');
    }, 1600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setImageUrl(fakeUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please write or speak your grievance description.');
      return;
    }
    if (!location.trim()) {
      setError('Please provide a specific landmark or street location.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setCurrentStepIdx(0);

    // Progressive step transitions
    const step1 = setTimeout(() => {
      setCurrentStepIdx(1);
      setSteps(s => s.map((item, i) => (i === 0 ? { ...item, status: 'completed', result: '✓ Language Normalized' } : item)));
    }, 400);

    const step2 = setTimeout(() => {
      setCurrentStepIdx(2);
      setSteps(s => s.map((item, i) => (i === 1 ? { ...item, status: 'completed', result: '✓ Classified' } : item)));
    }, 850);

    const step3 = setTimeout(() => {
      setCurrentStepIdx(3);
      setSteps(s => s.map((item, i) => (i === 2 ? { ...item, status: 'completed', result: '✓ Priority Assessed' } : item)));
    }, 1300);

    const step4 = setTimeout(() => {
      setCurrentStepIdx(4);
      setSteps(s => s.map((item, i) => (i === 3 ? { ...item, status: 'completed', result: '✓ Department & Officer Assigned' } : item)));
    }, 1750);

    try {
      const createdComplaint = await api.submitComplaint({
        description,
        city,
        location,
        category: category === 'auto' ? undefined : category,
        language: language === 'auto' ? undefined : language,
        citizen_id: currentUserId || 'usr-citizen-1',
        citizen_name: currentUserName || 'Aarav Sharma',
        citizen_phone: '+91 98111 22334',
        image_url: imageUrl || undefined,
        attachments: imageUrl ? [imageUrl] : [],
      });

      setTimeout(() => {
        setSteps(s => s.map((item, i) => (i === 4 ? { ...item, status: 'completed', result: '✓ Routing & Triangulation Complete' } : item)));
        setTimeout(() => {
          setIsSubmitting(false);
          onComplaintSubmitted(createdComplaint);
        }, 400);
      }, 2100);
    } catch (err: any) {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(step4);
      setIsSubmitting(false);
      setError(err.message || 'Failed to submit grievance');
    }
  };

  return (
    <div id="new-complaint-section" className="max-w-3xl mx-auto p-4 sm:p-6 text-slate-900 font-sans">
      {/* Header back button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dossier</span>
        </button>
        <div className="text-xs text-blue-800 font-bold bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
          Official Grievance Registration Form
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">File a Civic Problem</h2>
            <p className="text-xs text-slate-500">Write naturally in Hindi, English, or your regional language. Our AI engine automatically triages and routes to the correct department.</p>
          </div>
        </div>

        {/* Quick Sample Chips for Presentation */}
        <div className="mb-5 p-3.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-bold text-slate-700 block mb-2">⚡ Quick Test Scenarios (Click to Load):</span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadSample(s)}
                className="text-[11px] px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 hover:border-blue-300 font-medium transition-colors shadow-2xs cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSubmitting ? (
          <AIProcessingSteps steps={steps} currentStepIndex={currentStepIdx} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Grievance Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Grievance Description <span className="text-rose-600">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleVoiceToggle}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border font-semibold transition-all cursor-pointer ${
                      isRecording
                        ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5 text-rose-600" />
                    <span>{isRecording ? 'Recording...' : 'Voice Input'}</span>
                  </button>
                </div>
              </div>

              <textarea
                id="complaint-description-input"
                rows={4}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the issue in your own words (e.g. 'मेरे इलाके में चार दिन से कूड़ा नहीं उठा है' or 'Water supply pipeline rupture in Sector 5')..."
                className="w-full p-3.5 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 placeholder-slate-400 outline-none transition-all resize-y"
              />
            </div>

            {/* Category and Language Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Category / Issue Domain
                </label>
                <select
                  id="complaint-category-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 outline-none transition-all"
                >
                  <option value="auto">✨ Auto-Detect by AI Engine</option>
                  <option value="ROADS">Roads, Potholes & Footpaths (PWD)</option>
                  <option value="WASTE_MANAGEMENT">Garbage & Sanitation (SWM)</option>
                  <option value="WATER_SUPPLY">Water Supply & Pipeline (Water Board)</option>
                  <option value="DRAINAGE">Drainage & Sewage Overflow (Sewerage)</option>
                  <option value="STREET_LIGHTING">Streetlights & Lighting (Electrical)</option>
                  <option value="ELECTRICITY">Power Grid & Hanging Cables</option>
                  <option value="ENCROACHMENT">Footpath Encroachment & Transit</option>
                  <option value="PUBLIC_INFRASTRUCTURE">Civic Infrastructure & Safety</option>
                  <option value="OTHER">Other Civic Matter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Input Language
                </label>
                <select
                  id="complaint-language-select"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 outline-none transition-all"
                >
                  <option value="auto">✨ Auto-Detect (Hindi / English / Regional)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="English">English</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Bengali">Bengali (বাংলা)</option>
                </select>
              </div>
            </div>

            {/* City and Location Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  City / Municipal Corporation <span className="text-rose-600">*</span>
                </label>
                <select
                  id="complaint-city-select"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 outline-none transition-all"
                >
                  {cities.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Specific Landmark / Street / Ward <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="complaint-location-input"
                    type="text"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Block 4 Market, near St. Xavier School"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Supporting Photo Attachment */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold text-slate-700">Supporting Photo / Evidence Attachment</span>
                </div>
                <span className="text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded">Optional</span>
              </div>

              {imageUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-white p-2 flex items-center gap-3">
                  <img
                    src={imageUrl}
                    alt="Complaint evidence preview"
                    className="w-20 h-16 object-cover rounded-md border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 text-xs text-slate-600 truncate">
                    <span className="font-semibold text-slate-900 block">Photo attached</span>
                    <span className="text-[11px] text-slate-500">Ready to transmit with complaint payload</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImageUrl(null)}
                    className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-[10px] text-slate-500 block w-full">Quick attach sample photo:</span>
                    {presetPhotos.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(p.url)}
                        className="text-[11px] px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                      >
                        + {p.label}
                      </button>
                    ))}
                  </div>

                  <label className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dashed border-slate-300 bg-white hover:bg-slate-50 text-xs text-slate-600 font-semibold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload image from device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                id="btn-submit-complaint"
                type="submit"
                className="w-full py-3 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Grievance to AI Engine & Routing System</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

