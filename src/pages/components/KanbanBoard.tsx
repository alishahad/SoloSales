import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { fetchApi } from '../../api';
import toast from 'react-hot-toast';

const COLUMNS = ['To Contact', 'Contacted', 'Discovery Call', 'Proposal Sent', 'Won', 'Lost'];

interface Lead {
  id: number;
  company_name: string;
  contact_name: string;
  role: string;
  email: string;
  value: string;
  status: string;
  notes: string;
}

interface KanbanBoardProps {
  project: any;
}

function SortableItem({ lead, onDelete }: { lead: Lead; onDelete: (id: number) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: lead.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/20 hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing group mb-3 relative"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-white text-sm">{lead.company_name}</h4>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent drag start
            onDelete(lead.id);
          }}
          className="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete lead"
        >
          <span className="material-symbols-outlined text-[16px]" data-icon="delete">delete</span>
        </button>
      </div>
      <p className="text-xs text-on-surface-variant mb-3">{lead.contact_name} {lead.role ? `• ${lead.role}` : ''}</p>
      
      {(lead.email || lead.value) && (
        <div className="flex items-center gap-4 text-xs">
          {lead.email && (
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]" data-icon="mail">mail</span>
              <span className="truncate max-w-[120px]">{lead.email}</span>
            </div>
          )}
          {lead.value && (
            <div className="flex items-center gap-1 text-tertiary font-medium">
              <span className="material-symbols-outlined text-[14px]" data-icon="payments">payments</span>
              <span>{lead.value}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DroppableColumn({ id, leads, onDelete }: { id: string; leads: Lead[]; onDelete: (id: number) => void }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl w-[320px] flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center shrink-0">
        <h3 className="font-bold text-sm text-white uppercase tracking-wider">{id}</h3>
        <span className="bg-surface-container text-on-surface-variant py-0.5 px-2 rounded-full text-xs font-medium border border-outline-variant/20">
          {leads.length}
        </span>
      </div>
      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        <SortableContext items={leads.map((l) => l.id.toString())} strategy={verticalListSortingStrategy}>
          <div className="min-h-[100px] h-full">
            {leads.map((lead) => (
              <SortableItem key={lead.id} lead={lead} onDelete={onDelete} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export default function KanbanBoard({ project }: KanbanBoardProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newLead, setNewLead] = useState({ company_name: '', contact_name: '', role: '', email: '', value: '', notes: '' });
  const [leadToDelete, setLeadToDelete] = useState<number | null>(null);
  
  // Filtering state
  const [filterCompany, setFilterCompany] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require 5px movement before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (project.leads) {
      setLeads(project.leads);
    }
  }, [project]);

  const filteredLeads = leads.filter(lead => {
    const matchesCompany = lead.company_name.toLowerCase().includes(filterCompany.toLowerCase());
    const matchesStatus = filterStatus ? lead.status === filterStatus : true;
    return matchesCompany && matchesStatus;
  });

  const handleExportCSV = () => {
    if (leads.length === 0) {
      toast.error('No leads to export');
      return;
    }

    const headers = ['Company Name', 'Contact Name', 'Role', 'Email', 'Value', 'Status', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        `"${lead.company_name.replace(/"/g, '""')}"`,
        `"${lead.contact_name.replace(/"/g, '""')}"`,
        `"${lead.role?.replace(/"/g, '""') || ''}"`,
        `"${lead.email?.replace(/"/g, '""') || ''}"`,
        `"${lead.value?.replace(/"/g, '""') || ''}"`,
        `"${lead.status}"`,
        `"${lead.notes?.replace(/"/g, '""') || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${project.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeLeadId = parseInt(active.id as string, 10);
    const overId = over.id; // Could be a column ID or another lead ID

    // Find the lead being dragged
    const activeLead = leads.find((l) => l.id === activeLeadId);
    if (!activeLead) return;

    let newStatus = activeLead.status;

    // If dropped over a column
    if (COLUMNS.includes(overId as string)) {
      newStatus = overId as string;
    } else {
      // If dropped over another lead, find that lead's status
      const overLeadId = parseInt(overId as string, 10);
      const overLead = leads.find((l) => l.id === overLeadId);
      if (overLead) {
        newStatus = overLead.status;
      }
    }

    if (newStatus !== activeLead.status) {
      // Optimistic update
      setLeads((prev) =>
        prev.map((l) => (l.id === activeLeadId ? { ...l, status: newStatus } : l))
      );

      // API call
      try {
        await fetchApi(`/api/leads/${activeLeadId}`, {
          method: 'PUT',
          body: JSON.stringify({ status: newStatus }),
        });
      } catch (error: any) {
        console.error('Failed to update lead status', error);
        toast.error('Failed to update lead status: ' + error.message);
        // Revert on error
        setLeads((prev) =>
          prev.map((l) => (l.id === activeLeadId ? { ...l, status: activeLead.status } : l))
        );
      }
    }
    
    setActiveId(null);
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addedLead = await fetchApi('/api/leads', {
        method: 'POST',
        body: JSON.stringify({ ...newLead, project_id: project.id, status: 'To Contact' }),
      });
      
      setLeads([...leads, addedLead]);
      setIsAdding(false);
      setNewLead({ company_name: '', contact_name: '', role: '', email: '', value: '', notes: '' });
      toast.success('Lead added successfully');
    } catch (error: any) {
      console.error('Failed to add lead', error);
      toast.error('Failed to add lead: ' + error.message);
    }
  };

  const handleDeleteLead = async () => {
    if (leadToDelete === null) return;
    const id = leadToDelete;
    
    try {
      await fetchApi(`/api/leads/${id}`, { method: 'DELETE' });
      setLeads(leads.filter((l) => l.id !== id));
      toast.success('Lead deleted');
    } catch (error: any) {
      console.error('Failed to delete lead', error);
      toast.error('Failed to delete lead: ' + error.message);
    } finally {
      setLeadToDelete(null);
    }
  };

  const confirmDelete = (id: number) => {
    setLeadToDelete(id);
  };

  return (
    <div className="h-[calc(100vh-16rem)] flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-xl font-headline font-bold text-white">Pipeline</h2>
          <p className="text-sm text-on-surface-variant mt-1">Track your outbound deals</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]" data-icon="search">search</span>
            <input
              type="text"
              placeholder="Filter by company..."
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md pl-10 pr-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm appearance-none"
          >
            <option value="">All Statuses</option>
            {COLUMNS.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-surface-container border border-outline-variant/30 text-white font-medium text-sm hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="download">download</span>
            Export CSV
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-on-primary font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="add">add</span>
            Add Lead
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="mb-6 bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Add New Lead</h3>
            <button onClick={() => setIsAdding(false)} className="text-outline hover:text-white transition-colors">
              <span className="material-symbols-outlined" data-icon="close">close</span>
            </button>
          </div>
          <form onSubmit={handleAddLead} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-on-surface-variant mb-2">Company Name *</label>
              <input
                type="text"
                required
                className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
                value={newLead.company_name}
                onChange={(e) => setNewLead({ ...newLead, company_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">Contact Name</label>
              <input
                type="text"
                className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
                value={newLead.contact_name}
                onChange={(e) => setNewLead({ ...newLead, contact_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">Role</label>
              <input
                type="text"
                className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
                value={newLead.role}
                onChange={(e) => setNewLead({ ...newLead, role: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">Email</label>
              <input
                type="email"
                className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
                value={newLead.email}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">Deal Value</label>
              <input
                type="text"
                placeholder="e.g. $10,000"
                className="w-full bg-surface-container border border-outline-variant/30 text-white rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
                value={newLead.value}
                onChange={(e) => setNewLead({ ...newLead, value: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-2 rounded-md bg-surface-container border border-outline-variant/30 text-white font-medium text-sm hover:bg-surface-container-high transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-md bg-primary text-on-primary font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20"
              >
                Save Lead
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-x-auto custom-scrollbar pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 min-w-max h-full">
            {COLUMNS.map((columnId) => (
              <DroppableColumn
                key={columnId}
                id={columnId}
                leads={filteredLeads.filter((l) => l.status === columnId)}
                onDelete={confirmDelete}
              />
            ))}
          </div>
          <DragOverlay>
            {activeId ? (
              <div className="bg-surface-container-low p-4 rounded-lg border border-primary shadow-xl opacity-90 rotate-3 cursor-grabbing w-[280px]">
                <div className="font-bold text-white text-sm">
                  {leads.find(l => l.id.toString() === activeId)?.company_name || 'Dragging...'}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Delete Confirmation Modal */}
      {leadToDelete !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-white mb-2">Delete Lead</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Are you sure you want to delete this lead? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setLeadToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-white bg-surface-container border border-outline-variant/30 rounded-md hover:bg-surface-container-high transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLead}
                className="px-4 py-2 text-sm font-bold text-white bg-error rounded-md hover:brightness-110 transition-all shadow-lg shadow-error/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}