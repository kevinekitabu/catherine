import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { feedbackService } from '../lib/supabase';

interface FeedbackFormProps {
  blogPostId?: string;
  blogPostTitle?: string;
  onFeedbackSubmitted?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  blogPostId, 
  blogPostTitle, 
  onFeedbackSubmitted 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 FORM SUBMIT TRIGGERED!');
    console.log('📝 Current form data:', JSON.stringify(formData, null, 2));
    console.log('📍 Blog post ID:', blogPostId);
    
    setIsSubmitting(true);
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      console.log('❌ Validation failed: Missing required fields');
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }


    console.log('✅ Form validation passed, proceeding with submission...');

    try {
      const feedbackData = {
        blog_post_id: blogPostId || null,
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        rating: formData.rating,
        feedback_type: blogPostId ? 'post' : 'site'
      };
      
      console.log('💾 Calling feedbackService.createFeedback with:', JSON.stringify(feedbackData, null, 2));
      
      const result = await feedbackService.createFeedback(feedbackData);
      console.log('🎉 SUCCESS! Feedback saved with result:', JSON.stringify(result, null, 2));
      
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '', rating: 5 });
      
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (error: any) {
      console.error('❌ Error submitting feedback:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Full error object:', JSON.stringify(error, null, 2));
      
      if (error.message) {
        setError(`Failed to submit feedback: ${error.message}`);
      } else {
        setError('Failed to submit feedback. Please try again or contact support.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Thank you for your feedback!
        </h3>
        <p className="text-green-700 mb-4">
          Your feedback has been submitted and will be reviewed before being published.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Submit another feedback
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
      <div className="flex items-center mb-4">
        <MessageCircle className="w-5 h-5 text-emerald-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          {blogPostId ? `Feedback for "${blogPostTitle}"` : 'Leave Feedback for the Site'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Feedback *
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            placeholder={blogPostId ? "Share your thoughts about this blog post..." : "Share your thoughts about the site..."}
            required
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={(e) => {
            console.log('🖱️ SUBMIT BUTTON CLICKED!');
            console.log('🔍 Form element:', e.currentTarget.form);
            console.log('🔍 Is submitting:', isSubmitting);
          }}
        >
          <Send className="w-5 h-5 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;