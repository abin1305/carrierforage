import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, Priority, TaskCategory, TaskStatus } from '../../types';
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit2,
  Filter,
  LayoutGrid,
  List as ListIcon,
  X,
} from 'lucide-react';

const CATEGORIES: { id: TaskCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'learning', label: 'Learning' },
  { id: 'aptitude', label: 'Aptitude' },
  { id: 'coding', label: 'Coding' },
  { id: 'placement', label: 'Placement' },
  { id: 'interview', label: 'Interview' },
];

export const TaskManager: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    isDarkMode,
    searchTerm,
  } = useApp();

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'coding' as TaskCategory,
    priority: 'high' as Priority,
    deadline: new Date().toISOString().split('T')[0],
    status: 'pending' as TaskStatus,
    estimatedMinutes: 60,
  });

  const filteredTasks = tasks.filter((t) => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      t.title.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term) ||
      t.category.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      description: '',
      category: 'coding',
      priority: 'high',
      deadline: new Date().toISOString().split('T')[0],
      status: 'pending',
      estimatedMinutes: 60,
    });
    setEditingTask(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (t: Task) => {
    setEditingTask(t);
    setFormData({
      title: t.title,
      description: t.description,
      category: t.category,
      priority: t.priority,
      deadline: t.deadline,
      status: t.status,
      estimatedMinutes: t.estimatedMinutes,
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }
    setShowAddModal(false);
  };

  const cardBg = isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-xs';

  const columns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'pending', label: 'To Do / Pending', color: 'border-slate-500 text-slate-400' },
    { status: 'in_progress', label: 'In Progress', color: 'border-indigo-500 text-indigo-400' },
    { status: 'completed', label: 'Completed', color: 'border-emerald-500 text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            Daily Task & Placement Milestone Manager
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize daily sprint goals across coding, aptitude, learning, and upcoming interview deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center border border-slate-700 bg-slate-800/80 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded cursor-pointer ${
                viewMode === 'board' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Board view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded cursor-pointer ${
                viewMode === 'list' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="List view"
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="add-task-open-modal-btn"
            onClick={handleOpenAdd}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer border ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Kanban Board View */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);
            return (
              <div
                key={col.status}
                className={`p-4 rounded-xl border flex flex-col space-y-3 min-h-[500px] ${
                  isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-inherit">
                  <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      id={`task-card-${t.id}`}
                      className={`p-3.5 rounded-xl border text-xs space-y-2.5 transition-all hover:border-slate-600 ${cardBg}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400">
                          {t.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(t)}
                            className="p-1 text-slate-400 hover:text-white cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteTask(t.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-semibold text-slate-100 text-xs leading-snug">{t.title}</h3>
                      {t.description && <p className="text-slate-400 text-[11px] line-clamp-2">{t.description}</p>}

                      <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {t.deadline}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                            t.priority === 'urgent'
                              ? 'bg-rose-500/20 text-rose-400'
                              : t.priority === 'high'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-slate-700/40 text-slate-400'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>

                      {/* Move to next stage button */}
                      <div className="pt-1 flex items-center justify-between">
                        <button
                          onClick={() => toggleTaskComplete(t.id)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.status === 'completed' ? 'Reopen' : 'Mark Done'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className={`rounded-xl border divide-y divide-inherit ${cardBg}`}>
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTaskComplete(t.id)}
                  className={`mt-0.5 cursor-pointer ${
                    t.status === 'completed' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <div>
                  <h3
                    className={`font-semibold text-sm ${
                      t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-100'
                    }`}
                  >
                    {t.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                    <span className="capitalize text-indigo-400 font-medium">{t.category}</span>
                    <span>• Due {t.deadline}</span>
                    <span className="uppercase font-bold text-amber-400">{t.priority}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={t.status}
                  onChange={(e) => updateTask(t.id, { status: e.target.value as any })}
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 outline-none text-[11px]"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteTask(t.id)}
                  className="p-1.5 rounded bg-slate-700 hover:bg-rose-600 text-slate-300 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      {showAddModal && (
        <div
          id="task-create-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-sm text-slate-100">
                {editingTask ? 'Edit Task' : 'Create Placement Task'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve 5 Graph problems on LeetCode"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Details, problem IDs, or syllabus topics..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none"
                  >
                    <option value="coding">Coding</option>
                    <option value="aptitude">Aptitude</option>
                    <option value="placement">Placement</option>
                    <option value="interview">Interview</option>
                    <option value="learning">Learning</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none"
                  >
                  </input>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
