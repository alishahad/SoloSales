import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api';
import toast from 'react-hot-toast';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'My First Project',
    industry: '',
    target_customer: '',
    deal_size: '',
    geography: 'US',
    target_roles: '',
    sales_motion: '',
    current_stage: '',
    blocking_problem: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const newProject = await fetchApi('/api/projects', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      await updateUser({ onboarding_completed: 1 });
      toast.success('Project created successfully!');
      navigate(`/projects/${newProject.id}`);
    } catch (error: any) {
      console.error('Failed to save onboarding data', error);
      toast.error('Failed to save onboarding data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Welcome to SoloSales.OS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Step {step} of 3: Let's set up your first project.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                    What kind of product are you building?
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="industry"
                      name="industry"
                      required
                      rows={2}
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="e.g. B2B SaaS for HR teams to manage employee feedback"
                      value={formData.industry}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="target_customer" className="block text-sm font-medium text-gray-700">
                    Who are your target customers?
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="target_customer"
                      name="target_customer"
                      required
                      rows={2}
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="e.g. Mid-market tech companies, specifically HR Directors"
                      value={formData.target_customer}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label htmlFor="target_roles" className="block text-sm font-medium text-gray-700">
                    Target Roles
                  </label>
                  <div className="mt-1">
                    <input
                      id="target_roles"
                      name="target_roles"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="e.g. VP of HR, HR Director"
                      value={formData.target_roles}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="deal_size" className="block text-sm font-medium text-gray-700">
                    Average deal size
                  </label>
                  <div className="mt-1">
                    <select
                      id="deal_size"
                      name="deal_size"
                      required
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      value={formData.deal_size}
                      onChange={handleChange}
                    >
                      <option value="">Select a range</option>
                      <option value="< $1k / yr">&lt; $1k / yr</option>
                      <option value="$1k - $5k / yr">$1k - $5k / yr</option>
                      <option value="$5k - $25k / yr">$5k - $25k / yr</option>
                      <option value="$25k+ / yr">$25k+ / yr</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="geography" className="block text-sm font-medium text-gray-700">
                    Primary Region
                  </label>
                  <div className="mt-1">
                    <select
                      id="geography"
                      name="geography"
                      required
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      value={formData.geography}
                      onChange={handleChange}
                    >
                      <option value="US">United States</option>
                      <option value="EU">Europe</option>
                      <option value="MENA">MENA</option>
                      <option value="APAC">APAC</option>
                      <option value="Global">Global</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label htmlFor="sales_motion" className="block text-sm font-medium text-gray-700">
                    Sales Motion
                  </label>
                  <div className="mt-1">
                    <select
                      id="sales_motion"
                      name="sales_motion"
                      required
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      value={formData.sales_motion}
                      onChange={handleChange}
                    >
                      <option value="">Select motion</option>
                      <option value="Inbound">Inbound</option>
                      <option value="Outbound">Outbound</option>
                      <option value="Product-Led">Product-Led</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="current_stage" className="block text-sm font-medium text-gray-700">
                    Current Stage
                  </label>
                  <div className="mt-1">
                    <select
                      id="current_stage"
                      name="current_stage"
                      required
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      value={formData.current_stage}
                      onChange={handleChange}
                    >
                      <option value="">Select stage</option>
                      <option value="Idea">Idea</option>
                      <option value="MVP">MVP</option>
                      <option value="Early Revenue">Early Revenue</option>
                      <option value="Scaling">Scaling</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="blocking_problem" className="block text-sm font-medium text-gray-700">
                    Biggest Blocking Problem
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="blocking_problem"
                      name="blocking_problem"
                      required
                      rows={2}
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="e.g. Not enough leads, low conversion rate"
                      value={formData.blocking_problem}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Setting up...' : step === 3 ? 'Complete Setup' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
