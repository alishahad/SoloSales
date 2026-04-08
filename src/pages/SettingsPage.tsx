import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('success')) {
      toast.success('Subscription successful! You are now on the Pro plan.');
      // Remove query param
      navigate('/settings', { replace: true });
    }
    if (query.get('canceled')) {
      toast.error('Subscription checkout was canceled.');
      navigate('/settings', { replace: true });
    }
  }, [location, navigate]);

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const response = await fetchApi('/api/checkout', { method: 'POST' });
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error('Failed to initiate checkout: ' + (error.message || 'Unknown error'));
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await fetchApi('/api/users/password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      toast.success('Password updated successfully.');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Failed to update password', error);
      toast.error(error.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt('Please enter your password to confirm account deletion:');
    if (!password) return;

    if (!confirm('Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.')) {
      return;
    }

    try {
      await fetchApi('/api/users/account', {
        method: 'DELETE',
        body: JSON.stringify({ password }),
      });
      
      await logout();
      navigate('/');
      toast.success('Account deleted successfully.');
    } catch (error: any) {
      console.error('Failed to delete account', error);
      toast.error(error.message || 'Failed to delete account.');
    }
  };

  const [generatingLogo, setGeneratingLogo] = useState(false);

  const handleGenerateLogo = async () => {
    setGeneratingLogo(true);
    try {
      const { GoogleGenAI } = await import('@google/genai');
      // @ts-ignore
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'placeholder' });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: 'A clean, modern, professional logo for a B2B SaaS application called SoloSales.OS. The logo should feature a stylized "S" or a target/growth chart motif, using a color palette of deep indigo and vibrant purple. Minimalist, flat vector style, white background.' }
          ]
        }
      });

      let base64Image = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }

      if (!base64Image) throw new Error('No image generated');

      await fetchApi('/api/generate-logo', {
        method: 'POST',
        body: JSON.stringify({ base64Image })
      });

      toast.success('Logo generated and saved successfully! Refresh to see changes.');
    } catch (error: any) {
      console.error('Failed to generate logo:', error);
      toast.error('Failed to generate logo: ' + error.message);
    } finally {
      setGeneratingLogo(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Settings</h1>
        <p className="text-on-surface-variant mt-1">Manage your account, billing, and integrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Settings Navigation */}
        <div className="md:col-span-3">
          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors text-left ${activeTab === 'profile' ? 'bg-primary-container/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-white'}`}
            >
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('billing')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors text-left ${activeTab === 'billing' ? 'bg-primary-container/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-white'}`}
            >
              Billing
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors text-left ${activeTab === 'security' ? 'bg-primary-container/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-white'}`}
            >
              Security
            </button>
            <button 
              onClick={() => setActiveTab('app')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors text-left ${activeTab === 'app' ? 'bg-primary-container/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-white'}`}
            >
              App Settings
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-9 space-y-8">
          {activeTab === 'profile' && (
            <section className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
              <div className="px-6 py-5 border-b border-outline-variant/10">
                <h2 className="text-lg font-headline font-bold text-white">Profile Settings</h2>
                <p className="text-sm text-on-surface-variant mt-1">Update your personal information and email.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-headline font-bold text-2xl">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-on-surface-variant mb-2">Email Address</label>
                    <input type="email" value={user?.email || ''} readOnly className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all opacity-70 cursor-not-allowed"/>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'billing' && (
            <section className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
              <div className="px-6 py-5 border-b border-outline-variant/10">
                <h2 className="text-lg font-headline font-bold text-white">Billing & Subscription</h2>
                <p className="text-sm text-on-surface-variant mt-1">Manage your subscription plan and billing details.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-surface-container rounded-md p-4 border border-outline-variant/30 flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium mb-1">Current Plan: <span className="uppercase text-primary">{user?.plan || 'free'}</span></h3>
                    <p className="text-sm text-on-surface-variant">
                      {user?.plan === 'pro' 
                        ? 'You have access to all premium features.' 
                        : 'Upgrade to Pro to unlock unlimited projects, AI generation, and premium support.'}
                    </p>
                  </div>
                  {user?.plan !== 'pro' && (
                    <button
                      onClick={handleUpgrade}
                      disabled={checkoutLoading}
                      className="px-6 py-2 rounded-md bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {checkoutLoading ? 'Processing...' : 'Upgrade to Pro'}
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'security' && (
            <section className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
              <div className="px-6 py-5 border-b border-outline-variant/10">
                <h2 className="text-lg font-headline font-bold text-white">Security</h2>
                <p className="text-sm text-on-surface-variant mt-1">Update your password and secure your account.</p>
              </div>
              <div className="p-6">
                <form className="space-y-4" onSubmit={handlePasswordChange}>
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-2">Current Password</label>
                    <input
                      type="password"
                      required
                      className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-2">New Password</label>
                    <input
                      type="password"
                      required
                      className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 rounded-md bg-primary text-on-primary font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}

          {activeTab === 'app' && (
            <section className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
              <div className="px-6 py-5 border-b border-outline-variant/10">
                <h2 className="text-lg font-headline font-bold text-white">Application Settings</h2>
                <p className="text-sm text-on-surface-variant mt-1">Configure global application behavior.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-2">Generate App Logo</h3>
                  <p className="text-sm text-on-surface-variant mb-4">Use AI to generate a new logo for your application. This will update the logo shown in the navigation bar.</p>
                  <button
                    type="button"
                    onClick={handleGenerateLogo}
                    disabled={generatingLogo}
                    className="px-4 py-2 rounded-md bg-surface-container border border-outline-variant/30 text-white font-medium text-sm hover:bg-surface-container-high transition-all disabled:opacity-50"
                  >
                    {generatingLogo ? 'Generating...' : 'Generate New Logo'}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Danger Zone - Always visible at the bottom */}
          <section className="bg-surface-container-low rounded-xl border border-error/30 overflow-hidden mt-8">
            <div className="px-6 py-5 border-b border-error/20">
              <h2 className="text-lg font-headline font-bold text-error">Danger Zone</h2>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">Delete Account</h3>
                <p className="text-sm text-on-surface-variant">Permanently delete your account and all data.</p>
              </div>
              <button 
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-md bg-error/10 text-error border border-error/20 font-medium text-sm hover:bg-error hover:text-on-error transition-all"
              >
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}