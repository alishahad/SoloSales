import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api';
import toast from 'react-hot-toast';

interface Project {
  id: number;
  name: string;
  industry: string;
  lead_count?: number;
  updated_at: string;
  created_at: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'updated_at' | 'name'>('updated_at');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    fetchApi('/api/projects')
      .then(setProjects)
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load projects');
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleCreateProject = async () => {
    const name = prompt('Enter project name:');
    if (!name) return;

    try {
      const newProject = await fetchApi('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      setProjects([newProject, ...projects]);
      toast.success('Project created');
      navigate(`/projects/${newProject.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create project');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  }, [projects, searchQuery, sortBy]);

  const totalLeads = projects.reduce((sum, p) => sum + (p.lead_count || 0), 0);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-on-surface-variant mt-1">Welcome back, Founder. Here's your pipeline overview.</p>
        </div>
        <button 
          onClick={handleCreateProject}
          className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary px-5 py-2.5 rounded-md font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary-container/20"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="add">add</span>
          New Project
        </button>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        {/* Stat 1: Total Leads */}
        <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 relative overflow-hidden group hover:border-primary/30 transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" data-icon="group">group</span>
            </div>
            <h3 className="text-sm font-medium text-on-surface-variant">Total Leads</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-headline font-bold text-white">{totalLeads}</span>
          </div>
        </div>
        {/* Stat 2: Active Projects */}
        <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 relative overflow-hidden group hover:border-tertiary/30 transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-tertiary/5 rounded-full blur-xl group-hover:bg-tertiary/10 transition-all"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-tertiary/20 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined" data-icon="folder_open">folder_open</span>
            </div>
            <h3 className="text-sm font-medium text-on-surface-variant">Active Projects</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-headline font-bold text-white">{projects.length}</span>
          </div>
        </div>
        {/* Stat 3: Emails Generated */}
        <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 relative overflow-hidden group hover:border-secondary/30 transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary/5 rounded-full blur-xl group-hover:bg-secondary/10 transition-all"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined" data-icon="auto_awesome">auto_awesome</span>
            </div>
            <h3 className="text-sm font-medium text-on-surface-variant">AI Emails Generated</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-headline font-bold text-white">0</span>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-headline font-bold text-white">Recent Projects</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]" data-icon="search">search</span>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-container border border-outline-variant/30 text-white text-sm rounded-md pl-9 pr-3 py-1.5 w-48 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
              />
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
            <div className="mx-auto h-12 w-12 bg-primary-container/10 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary" data-icon="folder_open">folder_open</span>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-white">No projects yet</h3>
            <p className="mt-1 text-sm text-on-surface-variant max-w-sm mx-auto">
              Get started by creating a new project to generate your sales assets and track leads.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateProject}
                className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary px-4 py-2 rounded-md font-semibold text-sm hover:brightness-110 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]" data-icon="add">add</span>
                Create Project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden group hover:border-primary/30 transition-all flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface">
                      <span className="material-symbols-outlined text-[24px]" data-icon="rocket_launch">rocket_launch</span>
                    </div>
                    <button className="text-outline hover:text-white transition-colors">
                      <span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{project.name}</h3>
                  <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">{project.industry || 'No industry defined'}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Leads</span>
                      <span className="text-white font-medium">{project.lead_count || 0}</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min(100, (project.lead_count || 0) * 2)}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant/10 flex justify-between items-center">
                  <span className="text-xs text-outline">Updated {formatDate(project.updated_at)}</span>
                  <Link to={`/projects/${project.id}`} className="text-sm font-medium text-primary hover:text-primary-fixed transition-colors flex items-center gap-1">
                    Open Project
                    <span className="material-symbols-outlined text-[16px]" data-icon="arrow_forward">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
