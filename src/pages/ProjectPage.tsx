import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchApi } from '../api';
import Questionnaire from './components/Questionnaire';
import AssetsView from './components/AssetsView';
import KanbanBoard from './components/KanbanBoard';
import toast from 'react-hot-toast';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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

  const handleExport = async () => {
    if (!project) return;
    try {
      const zip = new JSZip();
      
      // 1. Summary Markdown
      let summary = `# Project: ${project.name}\n\n`;
      summary += `**Industry:** ${project.industry || 'N/A'}\n`;
      summary += `**Target Customer:** ${project.target_customer || 'N/A'}\n`;
      summary += `**Deal Size:** ${project.deal_size || 'N/A'}\n`;
      summary += `**Geography:** ${project.geography || 'N/A'}\n`;
      summary += `**Target Roles:** ${project.target_roles || 'N/A'}\n`;
      summary += `**Sales Motion:** ${project.sales_motion || 'N/A'}\n`;
      summary += `**Current Stage:** ${project.current_stage || 'N/A'}\n`;
      summary += `**Blocking Problem:** ${project.blocking_problem || 'N/A'}\n\n`;
      
      summary += `## Statistics\n`;
      summary += `- Total Assets: ${project.assets?.length || 0}\n`;
      summary += `- Total Leads: ${project.leads?.length || 0}\n`;
      
      zip.file('SUMMARY.md', summary);

      // 2. Assets Folder
      if (project.assets && project.assets.length > 0) {
        const assetsFolder = zip.folder('Assets');
        project.assets.forEach((asset: any) => {
          assetsFolder?.file(`${asset.type}.md`, asset.content || '');
        });
      }

      // 3. Leads Folder (CSV)
      if (project.leads && project.leads.length > 0) {
        const leadsFolder = zip.folder('Leads');
        let csvContent = 'Company Name,Contact Name,Role,Email,Value,Status,Notes\n';
        project.leads.forEach((lead: any) => {
          const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
          csvContent += `${escapeCsv(lead.company_name)},${escapeCsv(lead.contact_name)},${escapeCsv(lead.role)},${escapeCsv(lead.email)},${escapeCsv(lead.value)},${escapeCsv(lead.status)},${escapeCsv(lead.notes)}\n`;
        });
        leadsFolder?.file('leads.csv', csvContent);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${project.name.replace(/\s+/g, '_')}_export.zip`);
      toast.success('Project data exported successfully!');
    } catch (error) {
      console.error('Export failed', error);
      toast.error('Failed to export project data');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
  if (!project) return <div>Project not found</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:text-white hover:border-outline-variant/50 transition-all">
            <span className="material-symbols-outlined text-[20px]" data-icon="arrow_back">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-headline font-bold text-white tracking-tight">{project.name}</h1>
            <p className="text-on-surface-variant mt-1">Configure your AI parameters and generate assets.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/30 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-surface-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="download">download</span>
            Export Assets
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-outline-variant/20 mb-8">
        <button 
          onClick={() => setActiveTab('questionnaire')}
          className={`pb-4 text-sm font-medium transition-colors ${activeTab === 'questionnaire' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-white'}`}
        >
          Setup & Context
        </button>
        <button 
          onClick={() => setActiveTab('assets')}
          className={`pb-4 text-sm font-medium transition-colors ${activeTab === 'assets' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-white'}`}
        >
          Generated Assets
        </button>
        <button 
          onClick={() => setActiveTab('pipeline')}
          className={`pb-4 text-sm font-medium transition-colors ${activeTab === 'pipeline' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-white'}`}
        >
          Pipeline
        </button>
      </div>

      <div>
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
    </div>
  );
}
