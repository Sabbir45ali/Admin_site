import React, { useState, useEffect } from 'react';
import { getServices, addService, updateService, deleteService } from '../services/api';
import { Plus, Trash2, Edit } from 'lucide-react';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [newService, setNewService] = useState({ name: '', duration: '', price: '', image: '' });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    setLoading(true);
    getServices().then(data => {
      setServices(data);
      setLoading(false);
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = newService.image;

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'services');
      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const cloudData = await cloudRes.json();
      imageUrl = cloudData.secure_url;
    }

    if (editingServiceId) {
      await updateService(editingServiceId, { ...newService, price: newService.price, image: imageUrl });
    } else {
      await addService({ ...newService, price: newService.price, image: imageUrl });
    }

    setIsAdding(false);
    setEditingServiceId(null);
    setNewService({ name: '', duration: '', price: '', image: '' });
    setImageFile(null);
    setUploading(false);
    fetchServices();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await deleteService(id);
      fetchServices();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Services Management</h2>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) {
              setEditingServiceId(null);
              setNewService({ name: '', duration: '', price: '', image: '' });
            }
          }}
          className="btn-primary flex items-center shadow-sm"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-5 h-5 mr-1" /> Add Service</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-primary animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold mb-4 text-gray-800">{editingServiceId ? 'Edit Service' : 'Add New Service'}</h3>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
              <input required type="text" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary" placeholder="e.g. Bridal Makeup" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input required type="text" value={newService.duration} onChange={e => setNewService({ ...newService, duration: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary" placeholder="e.g. 60 mins" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (₹)</label>
              <input required type="text" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary" placeholder="e.g. 500 - 1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Image</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full border border-gray-300 rounded-md px-4 py-1.5 focus:ring-primary focus:border-primary text-sm file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" disabled={uploading} className={`btn-primary shadow-sm hover:shadow ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {uploading ? 'Uploading & Saving...' : 'Save Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <Skeleton height={192} className="w-full rounded-none" />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton width={140} height={20} />
                    <Skeleton width={50} height={28} borderRadius={6} />
                  </div>
                  <Skeleton width={100} height={16} className="mt-6" />
                </div>
              </div>
            ))}
          </SkeletonTheme>
        ) : services.map(service => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-100 relative overflow-hidden">
              {service.image ? (
                <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/40 font-bold border-b border-primary/10">No Image</div>
              )}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setNewService({ name: service.name, duration: service.duration, price: service.price, image: service.image });
                    setEditingServiceId(service.id);
                    setIsAdding(true);
                    setImageFile(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-1.5 bg-white text-gray-600 rounded-md shadow hover:text-primary transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(service.id)} className="p-1.5 bg-white text-red-600 rounded-md shadow hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800 text-lg leading-tight pr-2">{service.name}</h3>
                <span className="font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md text-sm">₹{service.price}</span>
              </div>
              <p className="text-sm text-gray-500 mt-auto flex items-center pt-3 border-t border-gray-50">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs mr-2">Duration</span> {service.duration}
              </p>
            </div>
          </div>
        ))}

        {services.length === 0 && !isAdding && (
          <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-xl border border-gray-100 border-dashed">
            <p className="text-lg font-medium text-gray-600 mb-2">No services yet</p>
            <p className="text-sm">Click "Add Service" to create your first offering.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Services;
