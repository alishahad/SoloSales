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
      
      await fetchApi(`/api/projects/${project.id}/generate`, {
        method: 'POST',
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
    <div className="space-y-8 divide-y divide-gray-200 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-xl font-semibold leading-6 text-gray-900">Project Details</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tell us about your product and market so we can generate the best sales assets for you.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            
            <div className="sm:col-span-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Project Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry & Product Description
              </label>
              <div className="mt-1">
                <textarea
                  id="industry"
                  name="industry"
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="e.g. B2B SaaS for construction companies to manage inventory..."
                  value={formData.industry}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="target_customer" className="block text-sm font-medium text-gray-700">
                Target Customer Segment
              </label>
              <div className="mt-1">
                <textarea
                  id="target_customer"
                  name="target_customer"
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="e.g. Mid-sized general contractors with $10M-50M revenue..."
                  value={formData.target_customer}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="deal_size" className="block text-sm font-medium text-gray-700">
                Typical Deal Size / Pricing
              </label>
              <div className="mt-1">
                <select
                  name="deal_size"
                  id="deal_size"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="geography" className="block text-sm font-medium text-gray-700">
                Geography
              </label>
              <div className="mt-1">
                <select
                  name="geography"
                  id="geography"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="target_roles" className="block text-sm font-medium text-gray-700">
                Target Roles
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="target_roles"
                  id="target_roles"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="e.g. CTO, VP of Operations, Project Managers"
                  value={formData.target_roles}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="sales_motion" className="block text-sm font-medium text-gray-700">
                Sales Motion
              </label>
              <div className="mt-1">
                <select
                  name="sales_motion"
                  id="sales_motion"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="current_stage" className="block text-sm font-medium text-gray-700">
                Current Stage
              </label>
              <div className="mt-1">
                <select
                  name="current_stage"
                  id="current_stage"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="blocking_problem" className="block text-sm font-medium text-gray-700">
                Biggest Blocking Problem
              </label>
              <div className="mt-1">
                <textarea
                  id="blocking_problem"
                  name="blocking_problem"
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="e.g. Not getting replies, don't know who to contact..."
                  value={formData.blocking_problem}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || generating}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || generating}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {generating ? 'Generating Assets...' : 'Generate Assets'}
          </button>
        </div>
      </div>
    </div>
  );
}
