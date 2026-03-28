import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { fetchApi } from '../../api';
import { Copy, Download, Edit2, Check, X } from 'lucide-react';
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
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (assets.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No assets generated yet</h3>
        <p className="mt-1 text-sm text-gray-500">Go back to the Project Details tab and click "Generate Assets".</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {assets.map((asset) => (
        <div key={asset.id} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 flex flex-col h-[500px]">
          <div className="px-4 py-4 sm:px-6 flex justify-between items-center border-b border-gray-200 bg-gray-50 shrink-0">
            <h3 className="text-base font-semibold text-gray-900">
              {ASSET_LABELS[asset.type] || asset.type}
            </h3>
            <div className="flex space-x-1">
              {editingId === asset.id ? (
                <>
                  <button
                    onClick={() => saveEdit(asset.id)}
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    title="Save changes"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Cancel editing"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEditing(asset)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="Edit content"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(asset.content)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(asset.type, asset.content)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="Download Markdown"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {editingId === asset.id ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-full min-h-[300px] p-4 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-none"
              />
            ) : (
              <div className="prose prose-sm prose-indigo max-w-none">
                <ReactMarkdown>{asset.content}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
