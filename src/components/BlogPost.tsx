import React from 'react';
import { Calendar, Clock, Tag, User } from 'lucide-react';
import { BlogPost as BlogPostType } from '../lib/supabase';
import { format } from 'date-fns';
import ImageCarousel from './ImageCarousel';
import FeedbackForm from './FeedbackForm';
import FeedbackDisplay from './FeedbackDisplay';

interface BlogPostProps {
  post: BlogPostType;
  onFeedbackSubmitted?: () => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ post, onFeedbackSubmitted }) => {
  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        // Handle headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mb-4 mt-6">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mb-3 mt-5">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold mb-2 mt-4">{line.substring(4)}</h3>;
        }
        
        // Handle images
        const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (imageMatch) {
          return (
            <div key={index} className="my-6">
              <img 
                src={imageMatch[2]} 
                alt={imageMatch[1]} 
                className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
              />
              {imageMatch[1] && (
                <p className="text-center text-sm text-gray-600 mt-2 italic">{imageMatch[1]}</p>
              )}
            </div>
          );
        }
        
        // Handle bold text
        line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Handle italic text
        line = line.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        
        // Handle empty lines
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        // Regular paragraphs
        return (
          <p 
            key={index} 
            className="mb-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: line }}
          />
        );
      });
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        {post.thumbnail_url && (
          <div className="mb-6">
            <img 
              src={post.thumbnail_url} 
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>
        )}
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>
        
        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>{post.author || 'Catherine Mwangi'}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{format(new Date(post.published_date), 'MMMM d, yyyy')}</span>
          </div>
          
          {post.read_time && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{post.read_time}</span>
            </div>
          )}
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 mb-6">
            <Tag className="w-4 h-4 text-emerald-600" />
            {post.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-12">
        {formatContent(post.content)}
      </div>

      {/* Image Carousel */}
      {post.images && post.images.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h3>
          <ImageCarousel images={post.images} />
        </div>
      )}

      {/* Feedback Section */}
      <div className="border-t border-gray-200 pt-12 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <div>
            <FeedbackForm 
              blogPostId={post.id}
              blogPostTitle={post.title}
              onFeedbackSubmitted={onFeedbackSubmitted}
            />
          </div>
          
          {/* Feedback Display */}
          <div>
            <FeedbackDisplay blogPostId={post.id} limit={5} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;