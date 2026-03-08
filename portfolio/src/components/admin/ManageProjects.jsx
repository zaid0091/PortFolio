import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const ensureAbsoluteUrl = (url) => {
    if (!url) return url;
    // Handle protocol-relative URLs (//example.com)
    if (url.startsWith('//')) {
        return `https:${url}`;
    }
    // Add https:// to relative URLs
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

export default function ManageProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProject, setEditingProject] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState(getInitialFormState());
    const [deletingId, setDeletingId] = useState(null);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [pendingSaveData, setPendingSaveData] = useState(null);
    const [saving, setSaving] = useState(false);

    function getInitialFormState() {
        return {
            title: '',
            date: '',
            description: '',
            icon: 'fas fa-code',
            icon_bg: '#ffffff',
            tags: '',
            bullets: '',
            github_url: '',
            live_url: '',
            detail_overview: '',
            detail_problem: '',
            detail_solution: '',
            detail_tech: '',
            detail_features: '',
            detail_lessons: ''
        };
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        setLoading(true);
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (error) console.error('Error fetching projects:', error);
        else setProjects(data);
        setLoading(false);
    }

    function handleAdd() {
        setEditingProject(null);
        setFormData(getInitialFormState());
        setIsFormOpen(true);
    }

    function handleEdit(project) {
        setEditingProject(project);

        // Remove nulls so React doesn't complain about controlled/uncontrolled inputs
        const sanitizedProject = { ...project };
        Object.keys(sanitizedProject).forEach(key => {
            if (sanitizedProject[key] === null) {
                sanitizedProject[key] = '';
            }
        });

        setFormData({
            ...sanitizedProject,
            tags: project.tags ? project.tags.join(', ') : '',
            bullets: project.bullets ? project.bullets.join('\n') : '',
            detail_tech: project.detail_tech ? project.detail_tech.join('\n') : '',
            detail_features: project.detail_features ? project.detail_features.join('\n') : ''
        });
        setIsFormOpen(true);
    }

    async function confirmDelete() {
        if (!deletingId) return;
        const { error } = await supabase.from('projects').delete().eq('id', deletingId);
        if (error) alert('Error deleting project');
        else fetchProjects();
        setDeletingId(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log('HandleSubmit triggered');

        try {
            // Parse arrays with safety guards
            const getArray = (str) => {
                const items = (str || '').split('\n').map(s => s.trim()).filter(Boolean);
                const original = (str || '').split('\n').length;
                if (items.length < original) {
                    console.warn(`Warning: ${original - items.length} empty lines were removed from array field`);
                }
                return items;
            };
            const getTags = (str) => (str || '').split(',').map(s => s.trim()).filter(Boolean);

            const formattedData = {
                ...formData,
                tags: getTags(formData.tags),
                bullets: getArray(formData.bullets),
                detail_tech: getArray(formData.detail_tech),
                detail_features: getArray(formData.detail_features),
                github_url: ensureAbsoluteUrl(formData.github_url),
                live_url: ensureAbsoluteUrl(formData.live_url)
            };

            console.log('Formatted data:', formattedData);
            setPendingSaveData(formattedData);
            setShowSaveConfirm(true);
        } catch (err) {
            console.error('Error in handleSubmit:', err);
            alert('Form processing error: ' + (err.message || JSON.stringify(err)));
        }
    }

    async function executeSave() {
        console.log('ExecuteSave triggered. PendingData:', pendingSaveData);
        if (!pendingSaveData || saving) {
            console.warn('Save aborted: pendingSaveData is null or already saving');
            return;
        }
        setSaving(true);

        // Cleanup data for Supabase (remove id and created_at from payload)
        const payload = { ...pendingSaveData };
        delete payload.id;
        delete payload.created_at;

        console.log('Sending payload to Supabase:', payload);

        try {
            if (editingProject) {
                console.log('Updating existing project:', editingProject.id);
                const { data, error } = await supabase.from('projects').update(payload).eq('id', editingProject.id).select();
                if (error) throw error;
                console.log('Update success:', data);
            } else {
                console.log('Inserting new project');
                const { data, error } = await supabase.from('projects').insert([payload]).select();
                if (error) throw error;
                console.log('Insert success:', data);
            }

            setIsFormOpen(false);
            setShowSaveConfirm(false);
            fetchProjects();
            alert('Success! Project saved.');
        } catch (error) {
            console.error('Supabase save error:', error);
            alert('Database Error: ' + (error.message || JSON.stringify(error)));
        } finally {
            setSaving(false);
            setPendingSaveData(null);
        }
    }

    return (
        <div className="w-full max-w-[1200px] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text)' }}>Manage Projects</h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 font-bold border-2 transition-transform hover:-translate-y-1 hover:translate-x-1"
                    style={{ background: '#a8e6cf', borderColor: 'var(--border)', boxShadow: 'var(--shadow)', color: '#000' }}
                >
                    <Plus size={20} /> Add Project
                </button>
            </div>

            {loading ? (
                <div>Loading projects...</div>
            ) : (
                <div className="grid gap-4">
                    {projects.map(project => (
                        <div key={project.id} className="p-4 border-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}>
                            <div className="w-full sm:w-auto">
                                <h3 className="font-bold text-lg sm:text-xl break-words">{project.title}</h3>
                                <p className="opacity-70 text-sm sm:text-base line-clamp-2">{project.description}</p>
                            </div>
                            <div className="flex gap-2 self-end sm:self-auto shrink-0">
                                <button onClick={() => handleEdit(project)} className="p-2 bg-blue-100 border-2" style={{ borderColor: 'var(--border)', color: '#000' }}><Edit2 size={18} /></button>
                                <button onClick={() => setDeletingId(project.id)} className="p-2 bg-red-100 border-2" style={{ borderColor: 'var(--border)', color: '#000' }}><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 overflow-y-auto flex items-start justify-center p-4 pt-24 pb-12 z-50">
                    <div className="bg-white p-6 w-full max-w-3xl border-4" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                        <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                            {editingProject ? 'Edit Project' : 'New Project'}
                        </h3>

                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Title</label>
                                <input required className="w-full p-2 border-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Date</label>
                                <input required className="w-full p-2 border-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                            <div className="col-span-2">
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Short Description</label>
                                <textarea required className="w-full p-2 border-2 h-20" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Icon (FontAwesome class)</label>
                                <input required className="w-full p-2 border-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Icon BG Color (Hex)</label>
                                <input required type="color" className="w-full h-11 p-1 border-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }} value={formData.icon_bg} onChange={e => setFormData({ ...formData, icon_bg: e.target.value })} />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>GitHub URL</label>
                                <input className="w-full p-2 border-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.github_url} onChange={e => setFormData({ ...formData, github_url: e.target.value })} />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Live Demo URL</label>
                                <input className="w-full p-2 border-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.live_url} onChange={e => setFormData({ ...formData, live_url: e.target.value })} />
                            </div>

                            <div className="col-span-2">
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Tags (comma separated)</label>
                                <input className="w-full p-2 border-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="React, Node, CSS" />
                            </div>

                            <div className="col-span-2">
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Bullets (one per line)</label>
                                <textarea className="w-full p-2 border-2 h-24" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.bullets} onChange={e => setFormData({ ...formData, bullets: e.target.value })} />
                            </div>

                            <div className="col-span-2">
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Detail Overview</label>
                                <textarea className="w-full p-2 border-2 h-24" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.detail_overview} onChange={e => setFormData({ ...formData, detail_overview: e.target.value })} />
                            </div>

                            <div className="col-span-2">
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Detail Problem</label>
                                <textarea className="w-full p-2 border-2 h-24" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.detail_problem} onChange={e => setFormData({ ...formData, detail_problem: e.target.value })} />
                            </div>

                            <div className="col-span-2">
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Detail Solution</label>
                                <textarea className="w-full p-2 border-2 h-24" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.detail_solution} onChange={e => setFormData({ ...formData, detail_solution: e.target.value })} />
                            </div>

                            <div className="col-span-2">
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Detail Tech (one per line)</label>
                                <textarea className="w-full p-2 border-2 h-24" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.detail_tech} onChange={e => setFormData({ ...formData, detail_tech: e.target.value })} />
                            </div>

                            <div className="col-span-2">
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Detail Features (one per line)</label>
                                <textarea className="w-full p-2 border-2 h-24" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.detail_features} onChange={e => setFormData({ ...formData, detail_features: e.target.value })} />
                            </div>

                            <div className="col-span-2">
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Detail Lessons</label>
                                <textarea className="w-full p-2 border-2 h-24" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.detail_lessons} onChange={e => setFormData({ ...formData, detail_lessons: e.target.value })} />
                            </div>

                            <div className="col-span-2 flex justify-end gap-4 mt-4">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2 font-bold border-2" style={{ background: '#ccc', borderColor: '#000', color: '#000' }}>Cancel</button>
                                <button type="submit" className="px-6 py-2 font-bold border-2" style={{ background: '#66d9ef', borderColor: '#000', color: '#000' }}>Save Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deletingId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
                    <div className="bg-white p-8 border-4 text-center max-w-sm w-full" style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
                        <h3 className="text-xl font-bold mb-6">Are you sure you want to delete this project?</h3>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setDeletingId(null)}
                                className="px-6 py-2 font-bold border-2 transition-transform hover:translate-x-1 hover:translate-y-1"
                                style={{ background: '#ccc', borderColor: 'var(--border)', color: '#000' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-6 py-2 font-bold border-2 transition-transform hover:-translate-y-1 hover:translate-x-1"
                                style={{ background: '#ff6b6b', borderColor: 'var(--border)', color: '#000', boxShadow: 'var(--shadow)' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSaveConfirm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
                    <div className="bg-white p-8 border-4 text-center max-w-sm w-full" style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
                        <h3 className="text-xl font-bold mb-6">Are you sure you want to save this project?</h3>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowSaveConfirm(false)}
                                className="px-6 py-2 font-bold border-2 transition-transform hover:translate-x-1 hover:translate-y-1"
                                style={{ background: '#ccc', borderColor: 'var(--border)', color: '#000' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeSave}
                                disabled={saving}
                                className="px-6 py-2 font-bold border-2 transition-transform hover:-translate-y-1 hover:translate-x-1"
                                style={{ background: '#66d9ef', borderColor: 'var(--border)', color: '#000', boxShadow: 'var(--shadow)' }}
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
