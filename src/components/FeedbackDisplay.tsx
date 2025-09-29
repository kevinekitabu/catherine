import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Calendar, User } from 'lucide-react';
import { feedbackService, Feedback } from '../lib/supabase';
import { format } from 'date-fns';

interface FeedbackDisplayProps {
  blogPostId?: string;
  limit?: number;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ blogPostId, limit }) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, [blogPostId]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      let data: Feedback[];
      
      if (blogPostId) {
        data = await feedbackService.getFeedbackForPost(blogPostId);
      } else {
        data = await feedbackService.getSiteFeedback();
      }
      
      if (limit) {
        data = data.slice(0, limit);
      }
      
      setFeedback(data);
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-gray-200 pb-4">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg text-center">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Feedback Yet</h3>
        <p className="text-gray-600">
          {blogPostId 
            ? "Be the first to leave feedback for this post!" 
            : "Be the first to leave feedback for the site!"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
      <div className="flex items-center mb-6">
        <MessageCircle className="w-5 h-5 text-emerald-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          {blogPostId ? 'Reader Feedback' : 'Site Feedback'} ({feedback.length})
        </h3>
      </div>

      <div className="space-y-6">
        {feedback.map((item) => (
          <div key={item.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(item.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              {renderStars(item.rating)}
            </div>
            
            <p className="text-gray-700 leading-relaxed">{item.message}</p>
          </div>
        ))}
      </div>

      {limit && feedback.length >= limit && (
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Showing {limit} most recent feedback entries
          </p>
        </div>
      )}
    </div>
  );
};

export default FeedbackDisplay;