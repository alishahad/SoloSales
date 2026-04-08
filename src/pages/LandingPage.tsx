import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="selection:bg-primary-container selection:text-white min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-[#0b1326]/70 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(7,0,108,0.15)]">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tight text-white">SoloSales.OS</span>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-[#8b949e] hover:text-white transition-colors">Dashboard</Link>
            <Link to="/dashboard" className="text-[#8b949e] hover:text-white transition-colors">Projects</Link>
            <Link to="/settings" className="text-[#8b949e] hover:text-white transition-colors">Settings</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-2 mr-4">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-white" data-icon="notifications">notifications</span>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-white" data-icon="help">help</span>
          </div>
          <Link to="/login" className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-5 py-2 rounded-md font-semibold text-sm hover:brightness-110 active:scale-95 transition-all">
            Login
          </Link>
        </div>
      </nav>
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex flex-col items-center justify-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-container/5 rounded-full blur-[80px]"></div>
          </div>
          <div className="relative z-10 max-w-5xl w-full text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.05em] text-primary">Now in Private Beta</span>
            </div>
            <h1 className="font-headline text-[3.5rem] md:text-[5rem] font-extrabold leading-[1.1] tracking-tight text-white mb-6">
              Scale your outbound <br/><span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">sales with AI</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
              SoloSales.OS is the digital atelier for solo founders. Curate your pipeline, automate personalized outreach, and close deals while you sleep.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto px-8 py-4 rounded-md bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg hover:brightness-110 shadow-lg shadow-primary-container/20 transition-all">
                Start for Free
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 rounded-md border border-outline-variant/30 text-white font-medium hover:bg-surface-bright transition-all">
                Book a Demo
              </button>
            </div>
          </div>
          {/* Hero Image/Dashboard Preview */}
          <div className="relative z-10 mt-20 max-w-6xl w-full mx-auto px-4">
            <div className="glass-panel rounded-xl border border-outline-variant/15 p-2 shadow-2xl">
              <img className="rounded-lg w-full h-auto object-cover opacity-90" alt="modern minimalist sales dashboard interface showing dark blue UI with clean charts and data cards in a sophisticated glassmorphism style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuQg30wrjbslYSpzDFxdo0Yclt3BHUpRE09bVuOZKHsmdreqtM_DKBpyTyWDZ01vbiXK82Bt-dWwmDzjesHAcIWSLIrL4bfxrPAvJXWv7xguDd_GsmzVLMQLhbtECHNKyXTf7CjZvZz5pWbZxFlpb3DZOsQv6YVCVxHtv7rbUHAFkJg_87yjwpZx06JA1kNKIhClAO_qDETWjWl5wSDljK1iCi83UMWMzxkf7leKR1lLrlCV0ILY3kDGNLGg3J9BNkSdJKBCrGeB4"/>
            </div>
          </div>
        </section>
        
        {/* Features Bento Grid */}
        <section className="py-24 px-8 max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-white mb-4">Crafted for Efficiency</h2>
            <p className="text-on-surface-variant max-w-xl">Intelligent tools designed to eliminate the friction of modern sales outbound.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Feature 1 */}
            <div className="md:col-span-8 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between min-h-[400px] border border-outline-variant/10 group hover:border-primary/20 transition-all">
              <div>
                <div className="w-12 h-12 rounded-lg bg-primary-container/20 flex items-center justify-center mb-6 text-primary">
                  <span className="material-symbols-outlined" data-icon="auto_awesome">auto_awesome</span>
                </div>
                <h3 className="text-2xl font-headline font-bold text-white mb-3">AI Email Generation</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-md">Our neural engine analyzes prospect profiles to generate hyper-personalized outreach emails that bypass spam filters and command attention.</p>
              </div>
              <div className="mt-8 rounded-lg overflow-hidden border border-outline-variant/10 bg-surface-container shadow-inner">
                <img className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" alt="close-up of a futuristic laptop screen displaying a clean AI writing assistant interface with minimalist typography and soft blue glows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2JRY_vRAh4HmNqqpTNExNaWdjZTJjoC6qa5APM9lMVlVYB9HLKDeSBLt31H92Y6yaz48V6CzlTGissy5z7IcTuk_ynVeDbm9-x7spwkxD5KCioJodopDPYFjtp2KLKRV2YVD-bBW8llkuN2mCmIV-OcH7iXSrPeOi4_XDYPwVszWK_vZIgESrL0h8TxFKgDqI5cn5be5L91sqyffzEbNXUQO82svF7V2oGqY8Wu-uy03nkHdLGKb36haZ7z8f8bgQIWVKZ7l0TqU"/>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="md:col-span-4 bg-surface-container-high rounded-xl p-8 border border-outline-variant/10 group hover:border-primary/20 transition-all">
              <div className="w-12 h-12 rounded-lg bg-tertiary/20 flex items-center justify-center mb-6 text-tertiary">
                <span className="material-symbols-outlined" data-icon="forum">forum</span>
              </div>
              <h3 className="text-2xl font-headline font-bold text-white mb-3">LinkedIn Scripts</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">Short, punchy, and human-sounding connection requests designed for high-conversion networking.</p>
              <div className="space-y-3">
                <div className="p-3 bg-surface-container-lowest rounded-md border border-outline-variant/5 text-xs text-on-surface-variant">"Hey [Name], I noticed your work at..."</div>
                <div className="p-3 bg-surface-container-lowest rounded-md border border-outline-variant/5 text-xs text-on-surface-variant opacity-60">"Loved your recent post on..."</div>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="md:col-span-4 bg-surface-container-high rounded-xl p-8 border border-outline-variant/10 group hover:border-primary/20 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary-container/20 flex items-center justify-center mb-6 text-primary">
                <span className="material-symbols-outlined" data-icon="view_kanban">view_kanban</span>
              </div>
              <h3 className="text-2xl font-headline font-bold text-white mb-3">Kanban Lead Tracking</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Visualize your funnel with a beautiful, responsive board that makes managing 100+ leads feel effortless.</p>
            </div>
            {/* Feature 4 */}
            <div className="md:col-span-8 bg-surface-container-low rounded-xl p-8 flex items-center gap-8 border border-outline-variant/10 group hover:border-primary/20 transition-all">
              <div className="flex-1">
                <h3 className="text-2xl font-headline font-bold text-white mb-3">The "Founder Pulse"</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Real-time engagement tracking that tells you exactly when to follow up for maximum impact.</p>
                <div className="h-24 w-full bg-surface-container-highest rounded-md overflow-hidden relative">
                  {/* Chart placeholder */}
                  <div className="absolute inset-0 flex items-end gap-1 px-4 py-2">
                    <div className="flex-1 bg-primary/40 h-[20%] rounded-t-sm"></div>
                    <div className="flex-1 bg-primary/40 h-[40%] rounded-t-sm"></div>
                    <div className="flex-1 bg-primary/40 h-[30%] rounded-t-sm"></div>
                    <div className="flex-1 bg-primary/60 h-[70%] rounded-t-sm"></div>
                    <div className="flex-1 bg-primary h-[100%] rounded-t-sm"></div>
                    <div className="flex-1 bg-primary/50 h-[50%] rounded-t-sm"></div>
                    <div className="flex-1 bg-primary/30 h-[20%] rounded-t-sm"></div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block w-48 h-48 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                <img className="w-full h-full object-cover" alt="abstract digital waves and data points representing smart intelligence and connectivity in a dark atmospheric setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB--7W9LONskIAyAu8k2LHhTE2Fi2msoLH79sHs0w0I-BDEC53HdXP742tL6uzdFg03j8bMaGZAOyL_hqq45RoPzmx03OtwbFj9sKillWhHLFLlUIITicMdqhY8mIKPK9yBpmWge8XMr2C4zzJcBihTOkCxfaZ0OoZZq2Ox5A4VBKtWjzWuu7EKslijs7IVU-_LSXtbDDbs8YK3K8B7HcM5OLdl9c3un7zytfm7AgQ8g74u8t-aB8Lv-MOycB2qVIsj2hWo4A58_G0"/>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section className="py-24 bg-surface-container-lowest relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-white mb-4">Invest in your Growth</h2>
              <p className="text-on-surface-variant">Simple, transparent pricing for founders at every stage.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              {/* Tier 1 */}
              <div className="bg-surface p-8 rounded-xl border border-outline-variant/10 hover:border-outline-variant/30 transition-all">
                <div className="mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Solo</span>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-white">$29</span>
                    <span className="text-on-surface-variant text-sm ml-2">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10 text-sm text-on-surface-variant">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg" data-icon="check_circle">check_circle</span>
                    500 AI-generated emails
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg" data-icon="check_circle">check_circle</span>
                    Basic Kanban board
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg" data-icon="check_circle">check_circle</span>
                    LinkedIn integration
                  </li>
                </ul>
                <button className="w-full py-3 rounded-md border border-outline-variant text-white font-semibold hover:bg-surface-container transition-all">
                  Get Started
                </button>
              </div>
              {/* Tier 2 - Featured */}
              <div className="bg-surface-container-high p-8 rounded-xl border-2 border-primary shadow-2xl shadow-primary/10 relative transform md:scale-105 z-20">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-[0.6875rem] font-bold uppercase tracking-wider">Most Popular</div>
                <div className="mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Pro</span>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-5xl font-bold text-white">$79</span>
                    <span className="text-on-surface-variant text-sm ml-2">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10 text-sm text-on-surface">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg" data-icon="check_circle">check_circle</span>
                    2,500 AI-generated emails
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg" data-icon="check_circle">check_circle</span>
                    Founder Pulse tracking
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg" data-icon="check_circle">check_circle</span>
                    Advanced CRM Sync
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg" data-icon="check_circle">check_circle</span>
                    Multi-account management
                  </li>
                </ul>
                <button className="w-full py-4 rounded-md bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-lg hover:brightness-110 transition-all">
                  Claim Pro Access
                </button>
              </div>
              {/* Tier 3 */}
              <div className="bg-surface p-8 rounded-xl border border-outline-variant/10 hover:border-outline-variant/30 transition-all">
                <div className="mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Scale</span>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-white">$149</span>
                    <span className="text-on-surface-variant text-sm ml-2">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10 text-sm text-on-surface-variant">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg" data-icon="check_circle">check_circle</span>
                    Unlimited AI-generation
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg" data-icon="check_circle">check_circle</span>
                    Custom neural models
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg" data-icon="check_circle">check_circle</span>
                    Dedicated account manager
                  </li>
                </ul>
                <button className="w-full py-3 rounded-md border border-outline-variant text-white font-semibold hover:bg-surface-container transition-all">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 px-8 text-center">
          <div className="max-w-3xl mx-auto glass-panel p-12 rounded-2xl border border-outline-variant/10 shadow-2xl">
            <h2 className="text-4xl font-headline font-extrabold text-white mb-6 leading-tight">Ready to build your <br/>sales empire?</h2>
            <p className="text-on-surface-variant mb-10">Join 1,200+ solo founders using AI to scale their outbound today.</p>
            <Link to="/signup" className="inline-block px-10 py-4 rounded-md bg-white text-surface font-bold text-lg hover:bg-on-surface-variant transition-all">
              Get Started Instantly
            </Link>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#0b1326] border-t border-[#4F46E5]/15">
        <div className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
          <div className="mb-8 md:mb-0">
            <div className="text-md font-bold text-white mb-2">SoloSales.OS</div>
            <p className="text-[0.875rem] text-[#8b949e]">© 2024 SoloSales.OS. Built for Solo Founders.</p>
          </div>
          <div className="flex gap-8 text-[0.875rem]">
            <a className="text-[#8b949e] hover:text-white transition-colors" href="#">Privacy Policy</a>
            <a className="text-[#8b949e] hover:text-white transition-colors" href="#">Terms of Service</a>
            <a className="text-[#8b949e] hover:text-white transition-colors" href="#">Twitter</a>
            <a className="text-[#8b949e] hover:text-white transition-colors" href="#">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
