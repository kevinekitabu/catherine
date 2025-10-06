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
    console.log('🔍 Environment NODE_ENV:', process.env.NODE_ENV);

    const feedbackData = {
      blog_post_id: blogPostId ?? undefined,
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
      rating: formData.rating,
      feedback_type: (blogPostId ? 'post' : 'site') as 'post' | 'site'
    };

    // Start both actions concurrently
    const dbPromise = feedbackService.createFeedback(feedbackData);
    
    // Check if we're in development and try to use the email server
    const emailServerUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3001/send-feedback-email'
      : '/send-feedback-email'; // In production, this would be handled by your server
    
    console.log('📧 Attempting to send email to:', emailServerUrl);
    
    const emailPromise = fetch(emailServerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: feedbackData.name,
        email: feedbackData.email,
        message: feedbackData.message,
        rating: feedbackData.rating,
        blogPostId: feedbackData.blog_post_id,
        blogPostTitle: blogPostTitle || undefined,
      }),
    }).then(async (r) => {
      console.log('📧 Email response status:', r.status);
      
      let responseData;
      try {
        responseData = await r.json();
        console.log('📧 Email response data:', responseData);
      } catch (jsonError) {
        console.error('❌ Failed to parse email response as JSON:', jsonError);
        throw new Error('Invalid response format from email server');
      }
      
      if (!r.ok) {
        console.error('❌ Email request failed with status:', r.status);
        throw new Error(responseData.error || r.statusText || 'Email server error');
      }
      
      if (!responseData.success) {
        console.error('❌ Email sending failed:', responseData.error);
        throw new Error(responseData.error || 'Email sending failed');
      }
      
      console.log('✅ Email sent successfully:', responseData.emailId);
      return responseData;
    }).catch((error) => {
      console.error('❌ Email promise failed:', error);
      
      // Handle specific browser/extension errors
      if (error.message && error.message.includes('tab with id')) {
        console.warn('⚠️ Browser extension error detected, email may still work');
        return null;
      }
      
      // If it's a network error (server not running), log it but don't throw
      if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('ECONNREFUSED') || error.name === 'TypeError') {
        console.warn('⚠️ Email server appears to be offline, continuing with database save only');
        return null; // Don't throw, just return null to indicate email failed
      }
      
      throw error; // Re-throw other errors
    });

    // Wait for both to settle
    const [dbResult, emailResult] = await Promise.allSettled([dbPromise, emailPromise]);

  const dbSuccess = dbResult.status === 'fulfilled';
  const emailSuccess = emailResult.status === 'fulfilled';
    let combinedError = '';

    if (!dbSuccess) {
      combinedError += 'Saving feedback failed. ';
      console.warn('DB save failed:', dbResult);
    }
    if (!emailSuccess) {
      combinedError += 'Sending admin email failed.';
      console.warn('Email send failed:', emailResult);
    }

    // Show success if either succeeded
    if (dbSuccess || emailSuccess) {
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '', rating: 5 });
      if (dbSuccess && onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    }
    // Show errors for whichever failed
    setError(combinedError.trim());
    setIsSubmitting(false);
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