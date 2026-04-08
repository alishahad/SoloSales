import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen bg-surface items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.onboarding_completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (user.onboarding_completed && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  // If we are on the onboarding page, we don't want the full dashboard layout
  if (location.pathname === '/onboarding') {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-surface selection:bg-primary-container selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant/20 flex-col hidden md:flex">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-outline-variant/20">
          <span className="text-xl font-headline font-bold text-white tracking-tight">SoloSales.OS</span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-primary-container/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-white'}`}>
            <span className="material-symbols-outlined text-[20px]" data-icon="dashboard">dashboard</span>
            Dashboard
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-bold uppercase tracking-wider text-outline">Your Projects</p>
          </div>
          {/* We will need to fetch projects here or pass them down, for now we just link to dashboard */}
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-white transition-colors group">
            <span className="w-2 h-2 rounded-full bg-tertiary group-hover:scale-125 transition-transform"></span>
            View All Projects
          </Link>
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-outline-variant/20">
          <Link to="/settings" className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-surface-container transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold text-sm">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.email}</p>
              <p className="text-xs text-on-surface-variant truncate">Founder Plan</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]" data-icon="settings">settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-surface-container-lowest border-b border-outline-variant/20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-on-surface-variant hover:text-white">
              <span className="material-symbols-outlined" data-icon="menu">menu</span>
            </button>
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]" data-icon="search">search</span>
              <input type="text" placeholder="Search leads, projects..." className="bg-surface-container border border-outline-variant/30 text-white text-sm rounded-md pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"/>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-white relative">
              <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button onClick={logout} className="text-on-surface-variant hover:text-white" title="Logout">
              <span className="material-symbols-outlined" data-icon="logout">logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-surface custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
