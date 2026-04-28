import React, { useState, useEffect } from 'react';
import { Save, Building2, Ticket, Link, Info, Loader } from 'lucide-react';
import { getLoyaltySettings, updateLoyaltySettings } from '../services/api';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getLoyaltySettings().then(data => {
      // Clean up legacy platinum tier if it exists in the database
      if (data?.tiers?.platinum) {
        delete data.tiers.platinum;
      }

      // Default template if backend is empty
      if (!data || !data.tiers) {
        setSettings({
          tiers: {
            member: { name: 'Member', maxPoints: 50, perk: 'Basic Member Benefits' },
            silver: { name: 'Silver Client', maxPoints: 100, perk: '5% off all services' },
            gold: { name: 'Gold Client', maxPoints: Infinity, perk: '10% off & Priority Booking' }
          }
        });
      } else {
        setSettings(data);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await updateLoyaltySettings(settings);
      setMessage('Loyalty configuration saved successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save settings.');
    }
    setSaving(false);
  };

  const handleTierChange = (tierKey, field, value) => {
    setSettings(prev => ({
      ...prev,
      tiers: {
        ...prev.tiers,
        [tierKey]: {
          ...prev.tiers[tierKey],
          [field]: field === 'maxPoints' ? Number(value) : value
        }
      }
    }));
  };

  if (loading) {
    return (
      <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-4xl mb-8">
          <Skeleton width={200} height={28} className="mb-8" />
          <div className="space-y-10">
            <div>
              <Skeleton width={180} height={24} className="mb-5" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Skeleton height={60} />
                <Skeleton height={60} />
              </div>
            </div>
            <div>
              <Skeleton width={180} height={24} className="mb-5" />
              <Skeleton width="100%" height={20} className="mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <Skeleton key={i} height={280} className="rounded-xl" />)}
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  if (!settings || !settings.tiers) return <div className="p-10 text-center text-red-500 font-bold bg-red-50 rounded-xl my-10 max-w-lg mx-auto">Error: Failed to load configurations from the server. Check your network or API.</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-4xl mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">System Settings</h2>

      {message && (
        <div className={`p-4 rounded-xl mb-6 font-medium text-sm ${message.includes('succ') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="space-y-10">

        {/* Basic Info (Mocks) */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-5 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-primary" />
            Parlour Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 opacity-70 cursor-not-allowed">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Parlour Name</label>
              <input type="text" disabled defaultValue="Ruk's Glow House" className="w-full border border-gray-300 rounded-md px-3 py-2.5 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
              <input type="email" disabled defaultValue="admin@beauty.com" className="w-full border border-gray-300 rounded-md px-3 py-2.5 bg-gray-50" />
            </div>
          </div>
        </div>

        {/* Dynamic Loyalty Tiers */}
        <div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-5">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Ticket className="w-5 h-5 mr-2 text-primary" />
              Loyalty Program Tiers
            </h3>
            <span className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Live API</span>
          </div>

          <p className="text-sm text-gray-500 mb-6 flex items-start">
            <Info className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
            Configure the required maximum points for a client to stay in a tier, and define the perks they receive. Any points accumulated beyond the silver threshold enter Gold status permanently.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['member', 'silver', 'gold'].map((tierKey, index) => {
              const tier = settings.tiers[tierKey];
              if (!tier) return null;

              const isMaxTier = tierKey === 'gold';

              return (
                <div key={tierKey} className={`p-4 rounded-xl border-2 transition-all ${index === 0 ? 'bg-gray-50 border-gray-200' : index === 1 ? 'bg-slate-50 border-slate-200' : index === 2 ? 'bg-yellow-50/50 border-yellow-200' : 'bg-gradient-to-tr from-gray-900 to-gray-800 border-gray-900 shadow-xl'}`}>

                  <div className="mb-4">
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isMaxTier ? 'text-gray-400' : 'text-gray-500'}`}>Tier Name</label>
                    <input
                      type="text"
                      value={tier.name}
                      onChange={e => handleTierChange(tierKey, 'name', e.target.value)}
                      className={`w-full text-sm font-bold border rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 ${isMaxTier ? 'bg-gray-800 border-gray-600 text-white focus:ring-yellow-500' : 'bg-white border-gray-300 text-gray-800 focus:ring-primary'}`}
                    />
                  </div>

                  <div className="mb-4">
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isMaxTier ? 'text-gray-400' : 'text-gray-500'}`}>{isMaxTier ? 'Minimum Points' : 'Point Ceiling (Max)'}</label>
                    <input
                      type="number"
                      disabled={isMaxTier}
                      value={isMaxTier ? '1001' : tier.maxPoints}
                      onChange={e => handleTierChange(tierKey, 'maxPoints', e.target.value)}
                      className={`w-full text-sm font-black border rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 ${isMaxTier ? 'bg-gray-800 border-transparent text-yellow-400 opacity-80 cursor-not-allowed' : 'bg-white border-gray-300 text-primary focus:ring-primary'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isMaxTier ? 'text-gray-400' : 'text-gray-500'}`}>Tier Perk / Reward</label>
                    <textarea
                      rows={3}
                      value={tier.perk}
                      onChange={e => handleTierChange(tierKey, 'perk', e.target.value)}
                      className={`w-full text-xs font-medium border rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 resize-none ${isMaxTier ? 'bg-gray-800 border-gray-600 text-gray-300 focus:ring-yellow-500' : 'bg-white border-gray-300 text-gray-600 focus:ring-primary'}`}
                    />
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex justify-end">
          <button disabled={saving} className={`btn-primary flex items-center px-10 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95 ${saving && 'opacity-70'}`} onClick={handleSave}>
            {saving ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            {saving ? 'Saving...' : 'Save Loyalty Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Settings;
