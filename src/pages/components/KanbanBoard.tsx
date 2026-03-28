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
import { Plus, MoreHorizontal, Trash, DollarSign, Mail } from 'lucide-react';
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
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3 cursor-grab active:cursor-grabbing group relative hover:border-indigo-300 transition-colors"
    >
      <div className="font-semibold text-gray-900">{lead.company_name}</div>
      <div className="text-sm text-gray-600 mt-1">{lead.contact_name} {lead.role ? `• ${lead.role}` : ''}</div>
      
      {(lead.email || lead.value) && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-1">
          {lead.email && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Mail className="h-3 w-3" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          {lead.value && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <DollarSign className="h-3 w-3" />
              <span>{lead.value}</span>
            </div>
          )}
        </div>
      )}
      
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent drag start
          if (confirm('Delete lead?')) onDelete(lead.id);
        }}
        className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
        title="Delete lead"
      >
        <Trash className="h-4 w-4" />
      </button>
    </div>
  );
}

function DroppableColumn({ id, leads, onDelete }: { id: string; leads: Lead[]; onDelete: (id: number) => void }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="bg-gray-50/80 p-4 rounded-xl min-w-[280px] w-[280px] flex-shrink-0 border border-gray-200/60 flex flex-col h-[calc(100vh-16rem)]">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">{id}</h3>
        <span className="bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-xs font-medium">
          {leads.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
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

  const handleDeleteLead = async (id: number) => {
    try {
      await fetchApi(`/api/leads/${id}`, { method: 'DELETE' });
      setLeads(leads.filter((l) => l.id !== id));
      toast.success('Lead deleted');
    } catch (error: any) {
      console.error('Failed to delete lead', error);
      toast.error('Failed to delete lead: ' + error.message);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Pipeline</h2>
          <p className="text-sm text-gray-500 mt-1">Track your outbound deals</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Lead
        </button>
      </div>

      {isAdding && (
        <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Add New Lead</h3>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-500">
              <Trash className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleAddLead} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Company Name *</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={newLead.company_name}
                onChange={(e) => setNewLead({ ...newLead, company_name: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Contact Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={newLead.contact_name}
                onChange={(e) => setNewLead({ ...newLead, contact_name: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={newLead.role}
                onChange={(e) => setNewLead({ ...newLead, role: e.target.value })}
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={newLead.email}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Deal Value</label>
              <input
                type="text"
                placeholder="e.g. $10,000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={newLead.value}
                onChange={(e) => setNewLead({ ...newLead, value: e.target.value })}
              />
            </div>
            <div className="sm:col-span-6 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 text-sm font-medium shadow-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium shadow-sm transition-colors"
              >
                Save Lead
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-hidden flex flex-col">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-4 flex-1 items-start">
            {COLUMNS.map((columnId) => (
              <DroppableColumn
                key={columnId}
                id={columnId}
                leads={leads.filter((l) => l.status === columnId)}
                onDelete={handleDeleteLead}
              />
            ))}
          </div>
          <DragOverlay>
            {activeId ? (
              <div className="bg-white p-4 rounded-xl shadow-xl border border-indigo-300 opacity-90 rotate-3 cursor-grabbing w-[280px]">
                <div className="font-semibold text-gray-900">
                  {leads.find(l => l.id.toString() === activeId)?.company_name || 'Dragging...'}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}