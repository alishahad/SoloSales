import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api';
import { Plus, Folder, ArrowRight, Users, Clock } from 'lucide-react';
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
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your outbound sales systems</p>
        </div>
        <button
          onClick={handleCreateProject}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </header>

      <main>
        {projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="mx-auto h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Folder className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No projects yet</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
              Get started by creating a new project to generate your sales assets and track leads.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateProject}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <Plus className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
                Create Project
              </button>
            </div>
          </div>
        ) : (
          <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <li key={project.id} className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all group">
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.industry || 'No industry defined'}</p>
                  
                  <div className="mt-auto pt-6 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{project.lead_count || 0} leads</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Updated {formatDate(project.updated_at)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="-mt-px flex divide-x divide-gray-200">
                    <div className="flex w-0 flex-1">
                      <Link
                        to={`/projects/${project.id}`}
                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-2 rounded-bl-xl rounded-br-xl border border-transparent py-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                      >
                        Open Project
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
