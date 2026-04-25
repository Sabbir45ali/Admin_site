import React, { useState, useEffect } from 'react';
import { getOffers, addOffer, deleteOffer } from '../services/api';
import { Plus, Trash2, Tag, CalendarClock } from 'lucide-react';
import { format } from 'date-fns';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newOffer, setNewOffer] = useState({ title: '', description: '', validTill: '', image: '' });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = () => {
    setLoading(true);
    getOffers().then(data => {
      setOffers(data);
      setLoading(false);
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = newOffer.image;

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'offers');
      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const cloudData = await cloudRes.json();
      imageUrl = cloudData.secure_url;
    }

    await addOffer({
      ...newOffer,
      image: imageUrl,
      validTill: new Date(newOffer.validTill).toISOString()
    });
    setIsAdding(false);
    setNewOffer({ title: '', description: '', validTill: '', image: '' });
    setImageFile(null);
    setUploading(false);
    fetchOffers();
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this promotional offer?')) {
      await deleteOffer(id);
      fetchOffers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Promotions & Offers</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary flex items-center shadow-sm">
          {isAdding ? 'Cancel' : <><Plus className="w-5 h-5 mr-1" /> Create Offer</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-primary form-animate-in">
          <h3 className="text-lg font-bold mb-4 text-gray-800">New Promotional Offer</h3>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
              <input required type="text" value={newOffer.title} onChange={e => setNewOffer({ ...newOffer, title: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary" placeholder="e.g. 20% Off Facials" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
              <input required type="date" value={newOffer.validTill} onChange={e => setNewOffer({ ...newOffer, validTill: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
              <textarea required rows="2" value={newOffer.description} onChange={e => setNewOffer({ ...newOffer, description: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary" placeholder="Offer details, terms, and conditions..."></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer Image (Optional)</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full border border-gray-300 rounded-md px-4 py-1.5 focus:ring-primary focus:border-primary text-sm file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" disabled={uploading} className={`btn-primary shadow-sm hover:shadow ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {uploading ? 'Publishing...' : 'Publish Offer'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                <div className="flex items-start mb-4">
                  <Skeleton width={64} height={64} borderRadius={12} className="mr-4" />
                  <div className="flex-1">
                    <Skeleton width={140} height={20} className="mb-2" />
                    <Skeleton width={80} height={16} borderRadius={8} />
                  </div>
                </div>
                <Skeleton count={2} className="mb-6" />
                <div className="mt-auto border-t border-gray-100 pt-4">
                  <Skeleton width={160} height={16} />
                </div>
              </div>
            ))}
          </SkeletonTheme>
        ) : offers.map(offer => {
          const isValid = new Date(offer.validTill) >= new Date();
          return (
            <div key={offer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative flex flex-col group hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(offer.id)} className="text-gray-400 hover:text-red-500 bg-red-50 p-1.5 rounded-md transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-start mb-4 pr-10">
                {offer.image ? (
                  <div className="w-16 h-16 rounded-xl mr-4 flex-shrink-0 overflow-hidden shadow-sm">
                    <img src={offer.image} className="w-full h-full object-cover" alt="offer" />
                  </div>
                ) : (
                  <div className={`p-3 rounded-xl mr-4 flex-shrink-0 ${isValid ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                    <Tag className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1.5">{offer.title}</h3>
                  <div className={`text-xs inline-flex items-center px-2 py-0.5 rounded-full font-medium ${isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {isValid ? 'Active Now' : 'Expired'}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-6 flex-1 leading-relaxed">{offer.description}</p>
              <div className="flex items-center text-sm font-medium text-gray-500 bg-gray-50 -mx-6 -mb-6 px-6 py-3 border-t border-gray-100">
                <CalendarClock className="w-4 h-4 mr-2 opacity-70" />
                Valid till: <span className="text-gray-700 ml-1 ml-auto">{format(new Date(offer.validTill), 'MMM d, yyyy')}</span>
              </div>
            </div>
          );
        })}
        {offers.length === 0 && !isAdding && (
          <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-xl border border-gray-100 border-dashed">
            <p className="text-lg font-medium text-gray-600 mb-2">No active offers</p>
            <p className="text-sm">Create a new offer to attract more clients.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Offers;
