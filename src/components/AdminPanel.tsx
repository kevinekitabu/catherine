import React, { useState } from 'react';
import { Settings, FileText, MessageCircle, X } from 'lucide-react';
import BlogManager from './BlogManager';
import FeedbackManager from './FeedbackManager';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'blog' | 'feedback'>('blog');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBlogPostsChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <Settings className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center px-6 py-4 font-medium transition-colors ${
              activeTab === 'blog'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-5 h-5 mr-2" />
            Blog Management
          </button>
          
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center px-6 py-4 font-medium transition-colors ${
              activeTab === 'feedback'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Feedback Management
          </button>
        </div>

        <div className="overflow-hidden">
          {activeTab === 'blog' && (
            <div className="p-6 max-h-[calc(95vh-140px)] overflow-y-auto">
              <BlogManager 
                onClose={() => {}} 
                onBlogPostsChange={handleBlogPostsChange}
              />
            </div>
          )}
          
          {activeTab === 'feedback' && (
            <div className="p-6 max-h-[calc(95vh-140px)] overflow-y-auto">
              <FeedbackManager onClose={() => {}} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;