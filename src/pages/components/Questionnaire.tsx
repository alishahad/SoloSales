import { useState } from 'react';
import { fetchApi } from '../../api';
import toast from 'react-hot-toast';

interface QuestionnaireProps {
  project: any;
  onUpdate: (data: any) => void;
  onGenerate: () => void;
}

export default function Questionnaire({ project, onUpdate, onGenerate }: QuestionnaireProps) {
  const [formData, setFormData] = useState({
    name: project.name || '',
    industry: project.industry || '',
    target_customer: project.target_customer || '',
    deal_size: project.deal_size || '',
    geography: project.geography || '',
    target_roles: project.target_roles || '',
    sales_motion: project.sales_motion || '',
    current_stage: project.current_stage || '',
    blocking_problem: project.blocking_problem || '',
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetchApi(`/api/projects/${project.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      onUpdate(formData);
      toast.success('Project saved successfully');
    } catch (error: any) {
      console.error('Failed to save project', error);
      toast.error('Failed to save project: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await handleSave(); // Save first
      
      const { GoogleGenAI } = await import('@google/genai');
      // @ts-ignore
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'placeholder' });
      
      const prompt = `
        Act as a world-class, elite outbound sales strategist. Your goal is to generate a comprehensive, highly-tailored, and actionable outbound sales system for the following company. 
        
        Company Context:
        - Industry & Product: ${formData.industry}
        - Target Customer Segment: ${formData.target_customer}
        - Typical Deal Size: ${formData.deal_size}
        - Geography: ${formData.geography}
        - Target Buyer Roles: ${formData.target_roles}
        - Primary Sales Motion: ${formData.sales_motion}
        - Current Company Stage: ${formData.current_stage}
        - Biggest Blocking Problem: ${formData.blocking_problem}

        Please generate the following 5 assets in a structured JSON format. The content must be highly specific to the provided context, avoiding generic advice. Use persuasive, modern sales copywriting techniques.

        1. "icp": A detailed Ideal Customer Profile summary (1-2 personas). Include their pain points, goals, and why they need this specific product.
        2. "email_sequence": 3 outbound email sequences (4 emails each: Initial outreach, Value add, Breakup/Follow-up). Use compelling subject lines and clear CTAs.
        3. "linkedin_dm": 5 LinkedIn DM scripts for connection requests and follow-ups. Keep them conversational, non-salesy, and focused on starting a dialogue.
        4. "discovery_script": A discovery call script with a clear structure (Rapport, Qualification, Pain discovery, Next steps) and specific, open-ended key questions.
        5. "objection_handling": A cheatsheet for 5 common objections (e.g., price, timing, competitor) with specific, empathetic, and pivoting responses.

        Return ONLY valid JSON with keys: "icp", "email_sequence", "linkedin_dm", "discovery_script", "objection_handling".
        The values should be formatted as Markdown strings.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from Gemini");
      
      const generatedAssets = JSON.parse(text);

      await fetchApi(`/api/projects/${project.id}/assets`, {
        method: 'POST',
        body: JSON.stringify(generatedAssets)
      });

      toast.success('Assets generated successfully!');
      onGenerate();
    } catch (error: any) {
      console.error('Failed to generate assets', error);
      toast.error('Failed to generate assets: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
      <div className="px-6 py-5 border-b border-outline-variant/10">
        <h2 className="text-lg font-headline font-bold text-white">Project Details</h2>
        <p className="text-sm text-on-surface-variant mt-1">Tell us about your product and market so we can generate the best sales assets for you.</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-on-surface-variant mb-2">Project Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="industry" className="block text-sm font-medium text-on-surface-variant mb-2">Industry & Product Description</label>
            <textarea
              id="industry"
              name="industry"
              rows={3}
              className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
              placeholder="e.g. B2B SaaS for construction companies to manage inventory..."
              value={formData.industry}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="target_customer" className="block text-sm font-medium text-on-surface-variant mb-2">Target Customer Segment</label>
            <textarea
              id="target_customer"
              name="target_customer"
              rows={2}
              className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
              placeholder="e.g. Mid-sized general contractors with $10M-50M revenue..."
              value={formData.target_customer}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="deal_size" className="block text-sm font-medium text-on-surface-variant mb-2">Typical Deal Size / Pricing</label>
            <select
              name="deal_size"
              id="deal_size"
              className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              value={formData.deal_size}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              <option value="< $1k / yr">&lt; $1k / yr</option>
              <option value="$1k - $5k / yr">$1k - $5k / yr</option>
              <option value="$5k - $25k / yr">$5k - $25k / yr</option>
              <option value="$25k+ / yr">$25k+ / yr</option>
            </select>
          </div>

          <div>
            <label htmlFor="geography" className="block text-sm font-medium text-on-surface-variant mb-2">Geography</label>
            <select
              name="geography"
              id="geography"
              className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              value={formData.geography}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              <option value="US">United States</option>
              <option value="EU">Europe</option>
              <option value="MENA">MENA</option>
              <option value="APAC">APAC</option>
              <option value="Global">Global</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="target_roles" className="block text-sm font-medium text-on-surface-variant mb-2">Target Roles</label>
            <input
              type="text"
              name="target_roles"
              id="target_roles"
              className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
              placeholder="e.g. CTO, VP of Operations, Project Managers"
              value={formData.target_roles}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="sales_motion" className="block text-sm font-medium text-on-surface-variant mb-2">Sales Motion</label>
            <select
              name="sales_motion"
              id="sales_motion"
              className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              value={formData.sales_motion}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              <option value="Inbound">Inbound</option>
              <option value="Outbound">Outbound</option>
              <option value="Product-Led Growth">Product-Led Growth</option>
              <option value="Partner/Channel">Partner/Channel</option>
            </select>
          </div>

          <div>
            <label htmlFor="current_stage" className="block text-sm font-medium text-on-surface-variant mb-2">Current Stage</label>
            <select
              name="current_stage"
              id="current_stage"
              className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              value={formData.current_stage}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              <option value="Idea/Pre-revenue">Idea/Pre-revenue</option>
              <option value="Early Customers (<10)">Early Customers (&lt;10)</option>
              <option value="Scaling (10-100)">Scaling (10-100)</option>
              <option value="Established (100+)">Established (100+)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="blocking_problem" className="block text-sm font-medium text-on-surface-variant mb-2">Biggest Blocking Problem</label>
            <textarea
              id="blocking_problem"
              name="blocking_problem"
              rows={2}
              className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
              placeholder="e.g. Not getting replies, don't know who to contact..."
              value={formData.blocking_problem}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant/10 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading || generating}
          className="px-6 py-2 rounded-md bg-surface-container border border-outline-variant/30 text-white font-medium text-sm hover:bg-surface-container-high transition-all disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Draft'}
        </button>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || generating}
          className="flex items-center gap-2 px-6 py-2 rounded-md bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary-container/20 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]" data-icon="auto_awesome">auto_awesome</span>
          {generating ? 'Generating...' : 'Generate Assets'}
        </button>
      </div>
    </section>
  );
}
