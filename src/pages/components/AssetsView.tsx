import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { fetchApi } from '../../api';
import toast from 'react-hot-toast';

interface Asset {
  id: number;
  type: string;
  content: string;
}

interface AssetsViewProps {
  project: any;
}

const ASSET_LABELS: Record<string, string> = {
  icp: 'Ideal Customer Profile',
  email_sequence: 'Email Sequences',
  linkedin_dm: 'LinkedIn Scripts',
  discovery_script: 'Discovery Call Script',
  objection_handling: 'Objection Handling',
};

export default function AssetsView({ project }: AssetsViewProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (project.assets) {
      setAssets(project.assets);
      setLoading(false);
    } else {
      const fetchAssets = async () => {
        try {
          const fetchedAssets = await fetchApi(`/api/projects/${project.id}/assets`);
          setAssets(fetchedAssets);
        } catch (error) {
          console.error('Failed to fetch assets', error);
          toast.error('Failed to load assets');
        } finally {
          setLoading(false);
        }
      };
      fetchAssets();
    }
  }, [project]);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const handleDownload = (type: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${type}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const startEditing = (asset: Asset) => {
    setEditingId(asset.id);
    setEditContent(asset.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = async (assetId: number) => {
    try {
      await fetchApi(`/api/assets/${assetId}`, {
        method: 'PUT',
        body: JSON.stringify({ content: editContent }),
      });
      setAssets(assets.map(a => a.id === assetId ? { ...a, content: editContent } : a));
      setEditingId(null);
      toast.success('Asset saved successfully');
    } catch (error: any) {
      console.error('Failed to save asset', error);
      toast.error('Failed to save changes: ' + error.message);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  if (assets.length === 0) {
    return (
      <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
        <div className="mx-auto h-12 w-12 bg-primary-container/10 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-primary" data-icon="description">description</span>
        </div>
        <h3 className="mt-2 text-sm font-semibold text-white">No assets generated yet</h3>
        <p className="mt-1 text-sm text-on-surface-variant max-w-sm mx-auto">
          Go back to the Setup & Context tab and click "Generate Assets".
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {assets.map((asset) => (
        <div key={asset.id} className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col h-[500px]">
          <div className="px-6 py-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest shrink-0">
            <h3 className="text-base font-bold text-white">
              {ASSET_LABELS[asset.type] || asset.type}
            </h3>
            <div className="flex gap-2">
              {editingId === asset.id ? (
                <>
                  <button
                    onClick={() => saveEdit(asset.id)}
                    className="w-8 h-8 rounded-md bg-tertiary/20 flex items-center justify-center text-tertiary hover:bg-tertiary/30 transition-all"
                    title="Save changes"
                  >
                    <span className="material-symbols-outlined text-[16px]" data-icon="check">check</span>
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="w-8 h-8 rounded-md bg-error/20 flex items-center justify-center text-error hover:bg-error/30 transition-all"
                    title="Cancel editing"
                  >
                    <span className="material-symbols-outlined text-[16px]" data-icon="close">close</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEditing(asset)}
                    className="w-8 h-8 rounded-md bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-all"
                    title="Edit content"
                  >
                    <span className="material-symbols-outlined text-[16px]" data-icon="edit">edit</span>
                  </button>
                  <button
                    onClick={() => handleCopy(asset.content)}
                    className="w-8 h-8 rounded-md bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-all"
                    title="Copy to clipboard"
                  >
                    <span className="material-symbols-outlined text-[16px]" data-icon="content_copy">content_copy</span>
                  </button>
                  <button
                    onClick={() => handleDownload(asset.type, asset.content)}
                    className="w-8 h-8 rounded-md bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-all"
                    title="Download Markdown"
                  >
                    <span className="material-symbols-outlined text-[16px]" data-icon="download">download</span>
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            {editingId === asset.id ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-full min-h-[300px] p-4 bg-surface-container border border-primary/50 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-mono text-sm resize-none"
              />
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{asset.content}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
