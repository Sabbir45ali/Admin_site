import React, { useState, useEffect } from 'react';
import { getReviews, approveReview, deleteReview } from '../services/api';
import { Star, Check, X, Trash2, MessageSquare, ShieldCheck, ShieldAlert } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { format } from 'date-fns';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, currentStatus) => {
    try {
      await approveReview(id, !currentStatus);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved: !currentStatus } : r));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Client Reviews</h2>
          <p className="text-gray-500 text-sm">Manage and moderate client feedback</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={40} height={40} />
                    <div>
                      <Skeleton width={120} height={16} className="mb-1" />
                      <Skeleton width={80} height={12} />
                    </div>
                  </div>
                  <Skeleton width={80} height={20} borderRadius={10} />
                </div>
                <Skeleton count={2} height={14} className="mb-4" />
                <div className="flex justify-end gap-2">
                  <Skeleton width={80} height={32} borderRadius={8} />
                  <Skeleton width={32} height={32} borderRadius={8} />
                </div>
              </div>
            ))}
          </SkeletonTheme>
        ) : reviews.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-800 font-bold text-lg">No reviews yet</h3>
            <p className="text-gray-500">Reviews submitted by clients will appear here for moderation.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-full font-bold">
                    {review.userName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{review.userName}</h4>
                    <p className="text-xs text-gray-500">{review.serviceName} • {format(new Date(review.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${review.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {review.isApproved ? (
                    <><ShieldCheck className="w-3 h-3 mr-1" /> Public</>
                  ) : (
                    <><ShieldAlert className="w-3 h-3 mr-1" /> Pending</>
                  )}
                </div>
              </div>

              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                  />
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                "{review.comment || 'No comment provided.'}"
              </p>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
                <button
                  onClick={() => handleApprove(review.id, review.isApproved)}
                  className={`flex items-center px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${review.isApproved
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                    }`}
                >
                  {review.isApproved ? <><X className="w-3.5 h-3.5 mr-1.5" /> Unapprove</> : <><Check className="w-3.5 h-3.5 mr-1.5" /> Approve</>}
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
