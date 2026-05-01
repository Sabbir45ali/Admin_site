import React, { useState, useEffect } from 'react';
import { getLookbook, addLookbookEntry, deleteLookbookEntry } from '../services/api';
import { Trash2, Plus } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config';

const Lookbook = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', desc: '', beforeImage: '', afterImage: '' });
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchLookbook = async () => {
    setLoading(true);
    try {
      const data = await getLookbook();
      setEntries(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLookbook();
  }, []);

  const uploadImage = async (file) => {
    if (!file) return '';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'lookbook');
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const beforeUrl = await uploadImage(beforeFile);
      const afterUrl = await uploadImage(afterFile);

      await addLookbookEntry({ 
        ...newEntry, 
        beforeImage: beforeUrl, 
        afterImage: afterUrl 
      });

      setIsAdding(false);
      setNewEntry({ title: '', desc: '', beforeImage: '', afterImage: '' });
      setBeforeFile(null);
      setAfterFile(null);
      fetchLookbook();
    } catch (e) {
      console.error(e);
      alert('Failed to upload entry');
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this lookbook entry?')) {
      await deleteLookbookEntry(id);
      fetchLookbook();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Lookbook Management</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary flex items-center shadow-sm"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-5 h-5 mr-1" /> Add Entry</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-primary animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Add New Lookbook Entry</h3>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input required type="text" value={newEntry.title} onChange={e => setNewEntry({ ...newEntry, title: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary" placeholder="e.g. Bridal Transformation" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input required type="text" value={newEntry.desc} onChange={e => setNewEntry({ ...newEntry, desc: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary" placeholder="e.g. Full Glam Makeup" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Before Image (Required)</label>
              <input required type="file" accept="image/*" onChange={e => setBeforeFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">After Image (Required)</label>
              <input required type="file" accept="image/*" onChange={e => setAfterFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" disabled={uploading || !beforeFile || !afterFile} className={`btn-primary shadow-sm hover:shadow ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {uploading ? 'Uploading...' : 'Save Entry'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Skeleton height={200} className="w-full rounded-none" />
                <div className="p-4"><Skeleton width={140} height={20} /></div>
              </div>
            ))}
          </SkeletonTheme>
        ) : entries.length > 0 ? (
          entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="flex h-48 relative">
                <div className="w-1/2 relative bg-gray-100">
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm z-10">Before</div>
                  {entry.beforeImage && <img src={entry.beforeImage} alt="Before" className="w-full h-full object-cover" />}
                </div>
                <div className="w-1/2 relative bg-gray-200 border-l-2 border-white">
                  <div className="absolute top-2 right-2 bg-primary text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-sm z-10">After</div>
                  {entry.afterImage && <img src={entry.afterImage} alt="After" className="w-full h-full object-cover" />}
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{entry.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{entry.desc}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
            <p className="text-gray-500 font-medium">No lookbook entries found.</p>
            <p className="text-sm text-gray-400 mt-1">Add a new before & after entry to showcase your work.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lookbook;
