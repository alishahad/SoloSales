import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchApi } from '../api';
import Questionnaire from './components/Questionnaire';
import AssetsView from './components/AssetsView';
import KanbanBoard from './components/KanbanBoard';
import { ArrowLeft, Settings, FileText, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'questionnaire' | 'assets' | 'pipeline'>('questionnaire');

  const fetchProjectData = async () => {
    try {
      const data = await fetchApi(`/api/projects/${id}`);
      setProject(data);
      if (data.assets && data.assets.length > 0 && activeTab === 'questionnaire') {
        setActiveTab('assets');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleUpdateProject = (updatedData: any) => {
    setProject((prev: any) => ({ ...prev, ...updatedData }));
  };

  const handleGenerate = async () => {
    await fetchProjectData();
    setActiveTab('assets');
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );
  if (!project) return <div>Project not found</div>;

  const tabs = [
    { id: 'questionnaire', name: 'Project Details', icon: Settings },
    { id: 'assets', name: 'Sales Assets', icon: FileText },
    { id: 'pipeline', name: 'Pipeline', icon: LayoutDashboard },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <header className="bg-white border-b border-gray-200 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center gap-4 mb-4">
              <Link to="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 truncate">{project.name}</h1>
            </div>
            
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
                      ${activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'questionnaire' && (
            <Questionnaire project={project} onUpdate={handleUpdateProject} onGenerate={handleGenerate} />
          )}
          {activeTab === 'assets' && (
            <AssetsView project={project} />
          )}
          {activeTab === 'pipeline' && (
            <KanbanBoard project={project} />
          )}
        </div>
      </main>
    </div>
  );
}
