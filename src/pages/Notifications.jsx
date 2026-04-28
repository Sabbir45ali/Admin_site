import React, { useState, useEffect } from 'react';
import { sendNotification, getNotifications, sendMassEmail } from '../services/api';
import { Send, Bell, Image as ImageIcon, Users, CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { format } from 'date-fns';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('push'); // 'push' or 'email'
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [pushData, setPushData] = useState({
    title: '',
    body: '',
    imageUrl: '',
    targetUserIds: [], // Empty means all users
  });

  const [emailData, setEmailData] = useState({
    subject: '',
    body: '',
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load notification history');
    } finally {
      setLoading(false);
    }
  };

  const handleSendPush = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!pushData.title || !pushData.body) {
      setError('Title and Body are required.');
      return;
    }

    setSending(true);
    try {
      const result = await sendNotification(pushData);
      setSuccess(`Push sent! Success: ${result.successCount}, Failed: ${result.failureCount}`);
      setPushData({ title: '', body: '', imageUrl: '', targetUserIds: [] });
      fetchNotifications();
    } catch (err) {
      setError(err.message || 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!emailData.subject || !emailData.body) {
      setError('Subject and Body are required.');
      return;
    }

    setSending(true);
    try {
      const result = await sendMassEmail(emailData);
      setSuccess(`Emails sent! Success: ${result.successCount}, Failed: ${result.failureCount}`);
      setEmailData({ subject: '', body: '' });
      // We aren't displaying email history right now, so no fetch is strictly needed
    } catch (err) {
      setError(err.message || 'Failed to send mass email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" /> Broadcasting
        </h2>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button
          className={`pb-3 px-2 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'push' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => { setActiveTab('push'); setError(''); setSuccess(''); }}
        >
          <Bell className="w-4 h-4" /> Push Notifications
        </button>
        <button
          className={`pb-3 px-2 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'email' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => { setActiveTab('email'); setError(''); setSuccess(''); }}
        >
          <Mail className="w-4 h-4" /> Push Emails
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-700 rounded-lg text-sm flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Notification Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {activeTab === 'push' ? (
              <>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" /> Send New Push
                </h3>
                <form onSubmit={handleSendPush} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 50% Off Weekend Special!"
                      value={pushData.title}
                      onChange={(e) => setPushData({ ...pushData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Message Body *</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="e.g., Book your appointment this weekend to get..."
                      value={pushData.body}
                      onChange={(e) => setPushData({ ...pushData, body: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" /> Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={pushData.imageUrl}
                      onChange={(e) => setPushData({ ...pushData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Users className="w-4 h-4" /> Target Audience
                    </label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                      <span className="font-semibold text-primary">All subscribed users</span> (Bulk send)
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className={`w-full py-2.5 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                      sending ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 hover:shadow-lg active:scale-95'
                    }`}
                  >
                    {sending ? 'Sending...' : <><Send className="w-4 h-4" /> Send Notification</>}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" /> Send Mass Email
                </h3>
                <form onSubmit={handleSendEmail} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Exciting News from Ruksana's Parlour!"
                      value={emailData.subject}
                      onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Body *</label>
                    <textarea
                      required
                      rows="6"
                      placeholder="e.g., Dear Clients, we are thrilled to announce..."
                      value={emailData.body}
                      onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" /> Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/banner.jpg"
                      value={emailData.imageUrl || ''}
                      onChange={(e) => setEmailData({ ...emailData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Button Text (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g., Book Now"
                        value={emailData.buttonText || ''}
                        onChange={(e) => setEmailData({ ...emailData, buttonText: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Button Link (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://ruksanasparlour.com/book"
                        value={emailData.buttonUrl || ''}
                        onChange={(e) => setEmailData({ ...emailData, buttonUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Users className="w-4 h-4" /> Target Audience
                    </label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                      <span className="font-semibold text-primary">All registered users</span> (Mass Blast)
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className={`w-full py-2.5 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                      sending ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 hover:shadow-lg active:scale-95'
                    }`}
                  >
                    {sending ? 'Sending...' : <><Send className="w-4 h-4" /> Send Email Blast</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Notification History */}
        {activeTab === 'push' && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-12rem)] flex flex-col">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
                <h3 className="text-lg font-bold text-gray-800">Push History</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5">
                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No notifications sent yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors"></div>
                        
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-800 text-lg">{notif.title}</h4>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                            {format(new Date(notif.sentAt), 'MMM d, yyyy • h:mm a')}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">{notif.body}</p>
                        
                        {notif.imageUrl && (
                          <div className="mb-3 rounded-lg overflow-hidden border border-gray-100 h-32 w-48 relative">
                            <img src={notif.imageUrl} alt="Notification visual" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs font-semibold">
                          <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-1 rounded-md">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered: {notif.successCount}
                          </span>
                          {notif.failureCount > 0 && (
                            <span className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-1 rounded-md">
                              <AlertCircle className="w-3.5 h-3.5" /> Failed: {notif.failureCount}
                            </span>
                          )}
                          <span className="text-gray-400">
                            Target: {notif.targetUserIds?.length > 0 ? `${notif.targetUserIds.length} specific user(s)` : 'All Users'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
