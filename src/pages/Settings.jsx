import React from 'react';
import { Save, Building2, Ticket, Link } from 'lucide-react';

const Settings = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-3xl mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">System Settings</h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-5 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-primary" />
            Parlour Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Parlour Name</label>
              <input type="text" defaultValue="Ruksana's Beauty Parlour" className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:ring-primary focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
              <input type="email" defaultValue="admin@beauty.com" className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:ring-primary focus:border-primary transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <input type="text" defaultValue="123 Main Street, City" className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:ring-primary focus:border-primary transition-colors" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-5 flex items-center">
            <Ticket className="w-5 h-5 mr-2 text-primary" />
            Loyalty Program Rules
          </h3>
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Points awarded per booking</label>
              <input type="number" defaultValue="10" className="w-full sm:w-48 border border-gray-300 rounded-md px-3 py-2.5 focus:ring-primary focus:border-primary transition-colors" />
              <p className="text-xs text-gray-500 mt-2">These points are automatically added when an appointment is marked as Confirmed.</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-5 flex items-center">
            <Link className="w-5 h-5 mr-2 text-primary" />
            Integrations
          </h3>
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-800">Client App Sync</p>
                <p className="text-sm text-gray-500 mt-1">Real-time synchronization of Appointments, Services, and Offers with the client-facing application.</p>
              </div>
              <div className="px-4 py-2 bg-green-100 text-green-800 text-sm font-bold rounded-lg border border-green-200 shadow-sm flex items-center whitespace-nowrap">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Connected API
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button className="btn-primary flex items-center px-6 py-2.5 text-base shadow-sm hover:shadow" onClick={() => alert('Settings saved successfully! (Mock)')}>
            <Save className="w-5 h-5 mr-2" /> Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
export default Settings;
