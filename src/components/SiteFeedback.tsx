import React from 'react';
import { MessageCircle } from 'lucide-react';
import FeedbackForm from './FeedbackForm';
import FeedbackDisplay from './FeedbackDisplay';

interface SiteFeedbackProps {
  onFeedbackSubmitted?: () => void;
}

const SiteFeedback: React.FC<SiteFeedbackProps> = ({ onFeedbackSubmitted }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Share Your Feedback
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your thoughts and suggestions help us improve. Let us know what you think about the site!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Feedback Form */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Leave Your Feedback</h3>
          <FeedbackForm onFeedbackSubmitted={onFeedbackSubmitted} />
        </div>
        
        {/* Recent Feedback */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Feedback</h3>
          <FeedbackDisplay limit={10} />
        </div>
      </div>
    </div>
  );
};

export default SiteFeedback;