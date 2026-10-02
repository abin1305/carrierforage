import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Resource, ResourceCategory } from '../../types';
import {
  BookOpen,
  Plus,
  Video,
  FileText,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  Edit2,
  Trash2,
  Search,
  Filter,
  Layers,
  Sparkles,
  FileUp,
  X,
  Play,
} from 'lucide-react';

const CATEGORIES: { id: ResourceCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'web_dev', label: 'Web Development' },
  { id: 'data_science', label: 'Data Science' },
  { id: 'power_bi', label: 'Power BI' },
  { id: 'cloud_computing', label: 'Cloud Computing' },
  { id: 'ai_ml', label: 'AI & Machine Learning' },
  { id: 'cyber_security', label: 'Cyber Security' },
];

export const Resources: React.FC = () => {
  const {
    resources,
    addResource,
    updateResource,
    deleteResource,
    toggleResourceComplete,
    toggleResourceBookmark,
    isDarkMode,
    searchTerm,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'web_dev' as ResourceCategory,
    subCategory: 'React',
    type: 'video' as Resource['type'],
    url: '',
    fileSimulatedName: '',
    duration: '',
    notes: '',
  });

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
      const matchesType = filterType === 'all' || res.type === filterType;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        res.title.toLowerCase().includes(term) ||
        res.description.toLowerCase().includes(term) ||
        res.subCategory.toLowerCase().includes(term) ||
        res.notes.toLowerCase().includes(term);

      return matchesCategory && matchesType && matchesSearch;
    });
  }, [resources, selectedCategory, filterType, searchTerm]);

  const completedCount = resources.filter((r) => r.isCompleted).length;
  const totalCount = resources.length;
  const progressPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      description: '',
      category: 'web_dev',
      subCategory: 'React',
      type: 'video',
      url: '',
      fileSimulatedName: '',
      duration: '45m',
      notes: '',
    });
    setEditingResource(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (res: Resource) => {
    setEditingResource(res);
    setFormData({
      title: res.title,
      description: res.description,
      category: res.category,
      subCategory: res.subCategory,
      type: res.type,
      url: res.url,
      fileSimulatedName: res.fileSimulatedName || '',
      duration: res.duration || '',
      notes: res.notes,
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingResource) {
      updateResource(editingResource.id, {
        ...formData,
      });
    } else {
      addResource({
        ...formData,
        isCompleted: false,
        isBookmarked: false,
      });
    }

    setShowAddModal(false);
  };

  const cardBg = isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-xs';

  return (
    <div className="space-y-6">
      {/* Header & Metric Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Curated Learning Resources
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Organized placement syllabus, technical guides, video lectures, and PDF cheat sheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-right hidden sm:block">
            <span className="text-slate-400">Completion: </span>
            <span className="font-bold text-emerald-400">{progressPercent}%</span>
            <span className="text-slate-500"> ({completedCount}/{totalCount})</span>
          </div>
          <button
            id="add-resource-modal-trigger-btn"
            onClick={handleOpenAdd}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Resource</span>
          </button>
        </div>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            id={`resource-cat-tab-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === cat.id
                ? isDarkMode
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : isDarkMode
                ? 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-white'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Type Filter & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Filter format:</span>
          {['all', 'video', 'pdf', 'article', 'course', 'github'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2 py-0.5 rounded capitalize cursor-pointer ${
                filterType === t
                  ? 'bg-indigo-500/20 text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="text-slate-400">
          Showing {filteredResources.length} of {resources.length} resources
        </span>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.length === 0 ? (
          <div className={`col-span-full p-12 text-center rounded-xl border ${cardBg}`}>
            <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No resources match your filters</p>
            <p className="text-xs text-slate-400 mt-1">Try switching categories or add a new resource.</p>
          </div>
        ) : (
          filteredResources.map((res) => (
            <div
              key={res.id}
              id={`resource-card-${res.id}`}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all hover:border-slate-600 ${cardBg}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {res.subCategory}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      id={`bookmark-resource-btn-${res.id}`}
                      onClick={() => toggleResourceBookmark(res.id)}
                      className={`p-1 rounded hover:bg-slate-700/50 cursor-pointer ${
                        res.isBookmarked ? 'text-amber-400' : 'text-slate-400'
                      }`}
                      title={res.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${res.isBookmarked ? 'fill-amber-400' : ''}`} />
                    </button>
                    <button
                      id={`edit-resource-btn-${res.id}`}
                      onClick={() => handleOpenEdit(res)}
                      className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`delete-resource-btn-${res.id}`}
                      onClick={() => deleteResource(res.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-sm text-slate-100 line-clamp-1">{res.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{res.description}</p>

                {res.fileSimulatedName && (
                  <div className="mt-2 flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/60 text-[11px] text-cyan-400 border border-cyan-500/20">
                    <FileText className="w-3 h-3 shrink-0" />
                    <span className="truncate">{res.fileSimulatedName}</span>
                  </div>
                )}

                {res.notes && (
                  <div className="mt-2.5 p-2 rounded bg-slate-900/40 border border-slate-700/40 text-[11px] text-slate-300">
                    <span className="font-semibold text-slate-400 block mb-0.5">Notes:</span>
                    <p className="line-clamp-2">{res.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    id={`toggle-complete-res-${res.id}`}
                    onClick={() => toggleResourceComplete(res.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer transition-colors ${
                      res.isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                        : 'bg-slate-700/30 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{res.isCompleted ? 'Completed' : 'Mark Done'}</span>
                  </button>
                </div>

                {res.type === 'video' && res.url ? (
                  <button
                    id={`preview-video-btn-${res.id}`}
                    onClick={() => setActiveVideoModal(res.url)}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" /> Watch
                  </button>
                ) : res.url ? (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Resource Modal */}
      {showAddModal && (
        <div
          id="resource-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div
            id="resource-modal-content"
            className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 ${
              isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-inherit mb-4">
              <h2 className="text-base font-bold">
                {editingResource ? 'Edit Learning Resource' : 'Add New Resource'}
              </h2>
              <button
                id="close-resource-modal-btn"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold block mb-1">Resource Title *</label>
                <input
                  id="resource-form-title"
                  type="text"
                  required
                  placeholder="e.g. Master React 19 Hooks and Concurrency"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    id="resource-form-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ResourceCategory })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-100 outline-none focus:border-indigo-500"
                  >
                    <option value="web_dev">Web Development</option>
                    <option value="data_science">Data Science</option>
                    <option value="power_bi">Power BI</option>
                    <option value="cloud_computing">Cloud Computing</option>
                    <option value="ai_ml">AI & Machine Learning</option>
                    <option value="cyber_security">Cyber Security</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Sub-Category (Topic)</label>
                  <input
                    id="resource-form-subcategory"
                    type="text"
                    placeholder="e.g. Next.js, Python, AWS"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Type / Format</label>
                  <select
                    id="resource-form-type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Resource['type'] })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-100 outline-none focus:border-indigo-500"
                  >
                    <option value="video">YouTube / Video</option>
                    <option value="pdf">PDF / Document</option>
                    <option value="article">Article / Documentation</option>
                    <option value="course">Online Course</option>
                    <option value="github">GitHub Repository</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Est. Duration / Reading Time</label>
                  <input
                    id="resource-form-duration"
                    type="text"
                    placeholder="e.g. 1h 30m, 45 mins"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">External Link / YouTube URL</label>
                <input
                  id="resource-form-url"
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or doc link"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">PDF File Name (Simulated Upload)</label>
                <div className="flex items-center gap-2">
                  <input
                    id="resource-form-pdf-name"
                    type="text"
                    placeholder="e.g. React_Concurrency_Placement_Guide.pdf"
                    value={formData.fileSimulatedName}
                    onChange={(e) => setFormData({ ...formData, fileSimulatedName: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-100 outline-none focus:border-indigo-500"
                  />
                  <label
                    className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer flex items-center gap-1 whitespace-nowrap"
                  >
                    <FileUp className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({ ...formData, fileSimulatedName: file.name });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Key Notes & Takeaways</label>
                <textarea
                  id="resource-form-notes"
                  rows={2}
                  placeholder="Important interview questions or concepts to remember from this..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-100 outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-inherit flex items-center justify-end gap-2">
                <button
                  type="button"
                  id="cancel-resource-form-btn"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-resource-form-btn"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 font-semibold cursor-pointer"
                >
                  {editingResource ? 'Update Resource' : 'Save Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* YouTube / Video Preview Modal */}
      {activeVideoModal && (
        <div
          id="video-preview-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="font-semibold text-sm text-slate-200">Video Resource Stream</span>
              <button
                id="close-video-modal-btn"
                onClick={() => setActiveVideoModal(null)}
                className="text-slate-400 hover:text-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoModal.includes('v=') ? activeVideoModal.split('v=')[1]?.split('&')[0] : '8pDqJVdNa44'}`}
                title="Learning Resource"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
