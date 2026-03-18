import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export default function ManageBlogs() {
    const toast = useToast();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBlog, setEditingBlog] = useState(null);
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
            summary: '',
            content: '',
            tags: '',
            color: '#ffffff'
        };
    }

    useEffect(() => {
        fetchBlogs();
    }, []);

    async function fetchBlogs() {
        setLoading(true);
        const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
        if (error) console.error('Error fetching blogs:', error);
        else setBlogs(data);
        setLoading(false);
    }

    function handleAdd() {
        setEditingBlog(null);
        setFormData(getInitialFormState());
        setIsFormOpen(true);
    }

    function handleEdit(blog) {
        setEditingBlog(blog);

        const sanitizedBlog = { ...blog };
        Object.keys(sanitizedBlog).forEach(key => {
            if (sanitizedBlog[key] === null) {
                sanitizedBlog[key] = '';
            }
        });

        setFormData({
            ...sanitizedBlog,
            tags: blog.tags ? blog.tags.join(', ') : ''
        });
        setIsFormOpen(true);
    }

    async function confirmDelete() {
        if (!deletingId) return;
        const { error } = await supabase.from('blogs').delete().eq('id', deletingId);
        if (error) toast.error('Error deleting blog.');
        else fetchBlogs();
        setDeletingId(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log('HandleSubmit (Blogs) triggered');

        try {
            const getTags = (str) => (str || '').split(',').map(s => s.trim()).filter(Boolean);

            const formattedData = {
                ...formData,
                tags: getTags(formData.tags)
            };

            console.log('Formatted blog data:', formattedData);
            setPendingSaveData(formattedData);
            setShowSaveConfirm(true);
        } catch (err) {
            console.error('Error in handleSubmit (Blogs):', err);
            toast.error('Form processing error: ' + (err.message || JSON.stringify(err)));
        }
    }

    async function executeSave() {
        console.log('ExecuteSave (Blogs) triggered. PendingData:', pendingSaveData);
        if (!pendingSaveData || saving) {
            console.warn('Save aborted: pendingSaveData is null or already saving');
            return;
        }
        setSaving(true);

        const payload = { ...pendingSaveData };
        delete payload.id;
        delete payload.created_at;

        console.log('Sending blog payload to Supabase:', payload);

        try {
            if (editingBlog) {
                console.log('Updating existing blog:', editingBlog.id);
                const { data, error } = await supabase.from('blogs').update(payload).eq('id', editingBlog.id).select();
                if (error) throw error;
                console.log('Blog update success:', data);
            } else {
                console.log('Inserting new blog');
                const { data, error } = await supabase.from('blogs').insert([payload]).select();
                if (error) throw error;
                console.log('Blog insert success:', data);
            }

            setIsFormOpen(false);
            setShowSaveConfirm(false);
            fetchBlogs();
            toast.success('Blog post saved successfully!');
        } catch (error) {
            console.error('Supabase save error (Blogs):', error);
            toast.error('Database Error: ' + (error.message || JSON.stringify(error)));
        } finally {
            setSaving(false);
            setPendingSaveData(null);
        }
    }

    return (
        <div className="w-full max-w-[1200px] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text)' }}>Manage Blogs</h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 font-bold border-2 transition-transform hover:-translate-y-1 hover:translate-x-1"
                    style={{ background: '#a8e6cf', borderColor: 'var(--border)', boxShadow: 'var(--shadow)', color: '#000' }}
                >
                    <Plus size={20} /> Add Post
                </button>
            </div>

            {loading ? (
                <div>Loading blogs...</div>
            ) : (
                <div className="grid gap-4">
                    {blogs.map(blog => (
                        <div key={blog.id} className="p-4 border-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}>
                            <div className="w-full sm:w-auto">
                                <h3 className="font-bold text-lg sm:text-xl break-words">{blog.title}</h3>
                                <span className="text-sm opacity-70">{blog.date}</span>
                            </div>
                            <div className="flex gap-2 self-end sm:self-auto shrink-0">
                                <button onClick={() => handleEdit(blog)} className="p-2 bg-blue-100 border-2" style={{ borderColor: 'var(--border)', color: '#000' }}><Edit2 size={18} /></button>
                                <button onClick={() => setDeletingId(blog.id)} className="p-2 bg-red-100 border-2" style={{ borderColor: 'var(--border)', color: '#000' }}><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 overflow-y-auto flex items-start justify-center p-4 pt-24 pb-12 z-50">
                    <div className="bg-white p-6 w-full max-w-2xl border-4" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                        <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                            {editingBlog ? 'Edit Post' : 'New Post'}
                        </h3>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Title</label>
                                <input required className="w-full p-2 border-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Date</label>
                                <input required className="w-full p-2 border-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                            <div>
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Summary</label>
                                <textarea required className="w-full p-2 border-2 h-20" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} />
                            </div>
                            <div>
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Content (Markdown)</label>
                                <textarea required className="w-full p-2 border-2 h-48 font-mono" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
                            </div>
                            <div>
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Tags (comma separated)</label>
                                <input className="w-full p-2 border-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }} value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="React, Node, CSS" />
                            </div>
                            <div>
                                <label className="block mb-1 font-bold" style={{ color: 'var(--text)' }}>Accent Color (Hex)</label>
                                <input required type="color" className="w-full h-11 p-1 border-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }} value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} />
                            </div>

                            <div className="flex justify-end gap-4 mt-4">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2 font-bold border-2" style={{ background: '#ccc', borderColor: '#000', color: '#000' }}>Cancel</button>
                                <button type="submit" className="px-6 py-2 font-bold border-2" style={{ background: '#66d9ef', borderColor: '#000', color: '#000' }}>Save Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deletingId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
                    <div className="bg-white p-8 border-4 text-center max-w-sm w-full" style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
                        <h3 className="text-xl font-bold mb-6">Are you sure you want to delete this post?</h3>
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
                        <h3 className="text-xl font-bold mb-6">Are you sure you want to save this post?</h3>
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
