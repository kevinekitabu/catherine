import React, { useState, useEffect } from 'react';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import { FaXTwitter } from "react-icons/fa6";

// Add a CSS class for social icon size
const socialIconClass = 'bi social-icon';

import { Play, ExternalLink, Menu, X, ArrowRight, BookOpen, Users, Calendar } from 'lucide-react';
import BlogManager from './components/BlogManager';
import ImageCarousel from './components/ImageCarousel';
import { blogService, BlogPost } from './lib/supabase';
import { youtubeService, YouTubeVideo } from './lib/youtube';

// Update URL when navigating between pages - Clean path-based URLs
const updatePageURL = (view: string) => {
  let newPath = '/';
  
  if (view === 'podcasts') {
    newPath = '/podcasts';
  } else if (view === 'connect') {
    newPath = '/connect';
  } else if (view === 'coaching') {
    newPath = '/coaching';
  } else if (view.startsWith('blog-')) {
    const slug = view.replace('blog-', '');
    newPath = `/blog/${slug}`;
  }
  
  // Only update if the path is actually changing
  if (window.location.pathname !== newPath) {
    window.history.pushState({}, '', newPath);
    console.log('URL updated to:', newPath);
  }
};

// Social Share Buttons Component - FIXED: Share buttons now show on mobile
const SocialShareButtons = ({ post, url }: { post: BlogPost, url: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shareUrl = encodeURIComponent(url);
  const title = encodeURIComponent(post.title);
  const excerpt = encodeURIComponent(post.excerpt || '');

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?text=${title}&url=${shareUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${title}%20${shareUrl}`
  };

  const handleShare = (platform: string, link: string) => {
    window.open(link, '_blank', 'width=600,height=400');
    setIsExpanded(false);
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        {/* Share toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <i className="bi bi-share-fill mr-2"></i>
          Share
        </button>

        {/* Expanded social buttons */}
        {isExpanded && (
          <div className="flex space-x-2 ml-2">
            <button
              onClick={() => handleShare('x', shareLinks.x)}
              className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              title="Share on X"
            >
              <FaXTwitter className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleShare('facebook', shareLinks.facebook)}
              className="w-10 h-10 bg-[#4267B2] text-white rounded-full flex items-center justify-center hover:bg-[#365899] transition-colors"
              title="Share on Facebook"
            >
              <i className="bi bi-facebook"></i>
            </button>
            <button
              onClick={() => handleShare('linkedin', shareLinks.linkedin)}
              className="w-10 h-10 bg-[#0077b5] text-white rounded-full flex items-center justify-center hover:bg-[#00669c] transition-colors"
              title="Share on LinkedIn"
            >
              <i className="bi bi-linkedin"></i>
            </button>
            <button
              onClick={() => handleShare('whatsapp', shareLinks.whatsapp)}
              className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:bg-[#20bd5a] transition-colors"
              title="Share on WhatsApp"
            >
              <i className="bi bi-whatsapp"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// SidePanel Component - UPDATED: Added Coaching Section
const SidePanel = ({ blogPosts, videos, onReadMore, onPostClick, onMentorshipReadMore }: { 
  blogPosts: BlogPost[], 
  videos: YouTubeVideo[],
  onReadMore: () => void,
  onPostClick: (post: BlogPost) => void,
  onMentorshipReadMore: () => void
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [commentData, setCommentData] = useState({
    name: '',
    email: '',
    feedback: '',
    rating: 5
  });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Feedback form submitted:', commentData);
    setIsSubmittingFeedback(true);
    
    try {
      // Simulate feedback submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Feedback submitted successfully');
      alert('Thank you for your feedback!');
      
      // Reset form
      setCommentData({ name: '', email: '', feedback: '', rating: 5 });
      setFeedbackSubmitted(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => setFeedbackSubmitted(false), 3000);
      
    } catch (error) {
      console.error('❌ Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedPosts = searchQuery ? filteredPosts : blogPosts.slice(0, 3);

  return (
    <div className="w-full lg:w-80 space-y-8">
      {/* Search replaced by the logo Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
        <h1 className="hero-title text-4xl md:text-6xl mb-4 font-semibold leading-tight animate-elegant-slideUp">
          <img
            src="/img/logo/logobig.png"
            alt="What's Your Story Africa Logo"
            className="mx-auto h-6 md:h-8 w-auto object-contain drop-shadow-lg rounded-2xl"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </h1>
      </div>

      {/* About Me Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
        <div className="flex items-center mb-4">
          <i className="bi bi-person-circle text-emerald-600 text-lg mr-3"></i>
          <h3 className="text-lg font-bold text-gray-900">Podcasts</h3>
        </div>
        <img 
          src="/img/catherine/catherine-hero.jpg"
          alt="Catherine Mwangi"
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-emerald-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.pexels.com/photos-3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=300";
          }}
        />
      
        {/* FIXED: Storytelling Gateway label - full width on mobile */}
        <p className="text-gray-800 text-sm text-center mb-3">
          Storytelling is my magnificent obsession.
        </p>

        <button 
          onClick={onReadMore}
          className="w-full py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Read More
        </button>
      </div>

      {/* Coaching Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
        <div className="flex items-center mb-4">
          <i className="bi bi-mortarboard-fill text-emerald-600 text-lg mr-3"></i>
          <h3 className="text-lg font-bold text-gray-900">Storytelling Course</h3>
        </div>
        <p className="text-gray-800 text-sm mb-4">
          3-Day Intensive Course for aspiring storytellers aged 16-30. Transform your curiosity into impact.
        </p>
        <button
          onClick={() => window.location.href = '/coaching'}
          className="w-full py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Learn More
        </button>
      </div>

      {/* Mentorship Section - UPDATED: Fixed Calendly link */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
        <div className="flex items-center mb-4">
          <i className="bi bi-people-fill text-emerald-600 text-lg mr-3"></i>
          <h3 className="text-lg font-bold text-gray-900">Mentorship</h3>
        </div>
        <p className="text-gray-800 text-sm mb-4">
          Guiding Voices. Shaping Futures. Building Legacies. Mentorship is not about copying a voice; it's about finding yours.
        </p>
        <div className="space-y-3">
          <button
            onClick={onMentorshipReadMore}
            className="block w-full py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors text-center"
          >
            Read More
          </button>
          <a
            href="https://calendly.com/catherine-whatsyourstoryafrica"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-colors text-center"
          >
            Book A Call
          </a>
        </div>
      </div>

      {/* Recent Posts Section - UPDATED: Removed dates */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
        <div className="flex items-center mb-4">
          <i className="bi bi-file-earmark-text text-emerald-600 text-lg mr-3"></i>
          <h3 className="text-lg font-bold text-gray-900">
            {searchQuery ? 'Search Results' : 'Reflections'}
          </h3>
        </div>
        <div className="space-y-4">
          {displayedPosts.length > 0 ? (
            displayedPosts.map((post, index) => (
              <div 
                key={post.id} 
                className="flex items-center space-x-3 group cursor-pointer"
                onClick={() => onPostClick(post)}
              >
                <img 
                  src={post.thumbnail_url || `https://images.pexels.com/photos-3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=75`}
                  alt={post.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </p>
                  {/* REMOVED: Date display */}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No posts found matching your search.
            </p>
          )}
        </div>
      </div>

      {/* What to Watch Section - UPDATED: Removed YouTube label */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
        <div className="flex items-center mb-4">
          <i className="bi bi-play-circle text-emerald-600 text-lg mr-3"></i>
          <h3 className="text-lg font-bold text-gray-900">What to Watch</h3>
        </div>
        <div className="space-y-4">
          {videos.slice(0, 3).map((video, index) => {
            const cleanName = video.guestName?.replace(/What's Your Story Africa[:\-\s]*/gi, '') || 'Latest Episode';
            return (
              <a 
                key={video.id || index}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 group"
              >
                <img 
                  src={video.thumbnail}
                  alt={cleanName}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
                    {cleanName}
                  </p>
                  {/* REMOVED: YouTube label line */}
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Leave a Comment Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
        <div className="flex items-center mb-4">
          <i className="bi bi-chat-dots text-emerald-600 text-lg mr-3"></i>
          <h3 className="text-lg font-bold text-gray-900">Share Your Comments</h3>
        </div>
        <form onSubmit={handleCommentSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your Name"
            value={commentData.name}
            onChange={(e) => setCommentData({...commentData, name: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={commentData.email}
            onChange={(e) => setCommentData({...commentData, email: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            required
          />
          <textarea
            placeholder="Your Comment"
            value={commentData.feedback}
            onChange={(e) => setCommentData({...commentData, feedback: e.target.value})}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Submit 
          </button>
        </form>
      </div>
    </div>
  );
};

// Next Button Component - UPDATED: Added functionality
const NextButton = ({ onNext, currentPost, allPosts }: { 
  onNext: () => void, 
  currentPost: BlogPost, 
  allPosts: BlogPost[] 
}) => {
  const currentIndex = allPosts.findIndex(post => post.id === currentPost.id);
  const hasNext = currentIndex < allPosts.length - 1;

  if (!hasNext) return null; // Don't show button if there's no next post

  return (
    <div className="text-center mt-8 pt-6 border-t border-gray-200">
      <button 
        onClick={onNext}
        className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105"
      >
        Next Post
        <ArrowRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState('catherine');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBlogManager, setShowBlogManager] = useState(false);
  const [publishedBlogPosts, setPublishedBlogPosts] = useState<BlogPost[]>([]);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [carouselPosition, setCarouselPosition] = useState(0);
  const [waitlistEmail, setWaitlistEmail] = useState('');

  // Handle URL changes based on current view
  useEffect(() => {
    updatePageURL(currentView);
  }, [currentView]);

  // Handle browser back/forward buttons and initial load
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      console.log('URL changed to:', path);
      
      if (path === '/podcasts') {
        setCurrentView('podcasts');
      } else if (path === '/connect') {
        setCurrentView('connect');
      } else if (path === '/coaching') {
        setCurrentView('coaching');
      } else if (path.startsWith('/blog/')) {
        const slug = path.replace('/blog/', '');
        setCurrentView(`blog-${slug}`);
      } else {
        setCurrentView('catherine');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Handle initial page load based on current URL
    handlePopState();
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Default thumbnail images for blog posts
  const getDefaultThumbnail = (index: number) => {
    const defaultThumbnails = [
      'https://images.pexels.com/photos-3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      'https://images.pexels.com/photos-1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      'https://images.pexels.com/photos-1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      'https://images.pexels.com/photos-3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      'https://images.pexels.com/photos-1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      'https://images.pexels.com/photos-3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
    ];
    return defaultThumbnails[index % defaultThumbnails.length];
  };

  // Carousel images array with fallbacks
  const carouselImages = [
    "/img/catherine/IMG_3363.jpg",
    "/img/catherine/_TWL0019.JPG",
    "/img/catherine/DSC_0480.jpg",
    "/img/catherine/_TWL2723.JPG",
    "/img/catherine/IMG_0013.JPG",
    "/img/catherine/sg-70.JPG"
  ];

  // Carousel animation effect
  useEffect(() => {
    const carouselInterval = setInterval(() => {
      setCarouselPosition(prev => {
        const imageWidth = 192; // w-48 = 192px
        const gap = 24; // space-x-6 = 24px
        const totalWidth = imageWidth + gap;
        const newPosition = prev - totalWidth;
        
        // Reset position when we've moved through all original images
        if (newPosition <= -carouselImages.length * totalWidth) {
          return 0;
        }
        return newPosition;
      });
    }, 3000); // Move every 3 seconds

    return () => clearInterval(carouselInterval);
  }, [carouselImages.length]);

  // Load YouTube videos on component mount
  useEffect(() => {
    const loadYouTubeVideos = async () => {
      try {
        setVideosLoading(true);
        const videos = await youtubeService.getChannelVideos(9);
        setYoutubeVideos(videos);
      } catch (error) {
        console.error('Error loading YouTube videos:', error);
        setYoutubeVideos(youtubeService.getFallbackVideos());
      } finally {
        setVideosLoading(false);
      }
    };

    loadYouTubeVideos();
    loadPublishedBlogPosts();
  }, []);

  const loadPublishedBlogPosts = async () => {
    try {
      console.log('Loading published blog posts...');
      await blogService.processBlogFromStorage();
      console.log('Storage processing completed');
      const posts = await blogService.getPublishedPosts();
      console.log('Loaded posts with thumbnails:');
      posts.forEach((post, index) => {
        console.log(`  ${index}: "${post.title}" - thumbnail_url: ${post.thumbnail_url || 'null (will use default)'}`);
      });
      setPublishedBlogPosts(posts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    }
  };

  const handleFeedbackSubmitted = () => {
    setFeedbackSubmitted(true);
    alert('Thank you for your feedback!');
    // Reset the alert after 3 seconds
    setTimeout(() => setFeedbackSubmitted(false), 3000);
  };

  const renderFeedbackSection = () => (
    <section className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">We Value Your Feedback</h2>
        {/* <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} /> */}
      </div>
    </section>
  );

  const handleBlogPostClick = (post: BlogPost) => {
    setCurrentView(`blog-${post.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // UPDATED: Function to handle next post navigation
  const handleNextPost = (currentPost: BlogPost) => {
    const currentIndex = publishedBlogPosts.findIndex(post => post.id === currentPost.id);
    if (currentIndex < publishedBlogPosts.length - 1) {
      const nextPost = publishedBlogPosts[currentIndex + 1];
      setCurrentView(`blog-${nextPost.slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReadMoreClick = () => {
    setCurrentView('podcasts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSidePanelReadMore = () => {
    setCurrentView('podcasts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMentorshipReadMore = () => {
    setCurrentView('connect');
    setTimeout(() => {
      const mentorshipSection = document.getElementById('mentorship-section');
      if (mentorshipSection) {
        mentorshipSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Handle waitlist submission
  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) {
      alert('Please enter your email address');
      return;
    }

    const subject = encodeURIComponent("Waitlist Signup - 3-Day Storytelling Intensive");
    const body = encodeURIComponent(
      `Hello Catherine,\n\nI would like to join the waitlist for the 3-Day Storytelling Intensive Course.\n\nEmail: ${waitlistEmail}\n\nPlease notify me when the next cohort is available.`
    );

    const mailtoLink = `mailto:catherine@whatsyourstoryafrica.com?subject=${subject}&body=${body}`;
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=catherine@whatsyourstoryafrica.com&su=${subject}&body=${body}`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = mailtoLink;
    } else {
      window.open(gmailLink, "_blank");
    }

    alert('Thank you for joining the waitlist! We will contact you when the next cohort opens.');
    setWaitlistEmail('');
  };

  // Handle ebook download
  const handleEbookDownload = (ebookTitle: string) => {
    const subject = encodeURIComponent(`Ebook Download Request - ${ebookTitle}`);
    const body = encodeURIComponent(
      `Hello Catherine,\n\nI would like to download the ebook: "${ebookTitle}"\n\nPlease send me the download link.\n\nThank you!`
    );

    const mailtoLink = `mailto:catherine@whatsyourstoryafrica.com?subject=${subject}&body=${body}`;
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=catherine@whatsyourstoryafrica.com&su=${subject}&body=${body}`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = mailtoLink;
    } else {
      window.open(gmailLink, "_blank");
    }

    alert(`Thank you for your interest in "${ebookTitle}"! We will send you the download link shortly.`);
  };

  // Render About Catherine (now the landing page)
  const renderCatherine = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Main content grid with side panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content - spans 3 columns on large screens */}
          <div className="lg:col-span-3">
            {/* Catherine's Image - Centered */}
            <div className="flex justify-center items-center mb-8">
              <div className="w-full max-w-6xl animate-elegant-slideUp" style={{ animationDelay: '0.4s' }}>
                {/* UPDATED: Heart of Africa with reduced gap */}
                <div className="flex justify-center w-full mb-4">
                  <div className="inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full text-emerald-700 font-medium animate-elegant-fadeIn text-sm tracking-wide">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-gentle-pulse"></span>
                    From The Heart of Africa
                  </div>
                </div>
                
                {/* Image Carousel */}
                <div className="relative carousel-wrapper rounded-3xl shadow-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4 overflow-hidden">
                  <div 
                    className="flex carousel-track transition-transform duration-1000 ease-in-out"
                    style={{ 
                      transform: `translateX(${carouselPosition}px)`,
                      gap: '24px'
                    }}
                  >
                    {[...carouselImages, ...carouselImages].map((src, index) => (
                      <div key={index} className="flex-shrink-0">
                        <img 
                          src={src}
                          alt="Catherine Mwangi"
                          className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.pexels.com/photos-3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-emerald-50 to-transparent pointer-events-none"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-teal-50 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
            
            {/* About Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-12 mb-8 border border-white/50 shadow-xl">
              <div className="prose prose-lg max-w-none">
                <p className="text-base text-gray-800 mb-6 leading-relaxed tracking-wide">
                  For more than 25 years, my life has been woven into the fabric of storytelling. 
                  My career in media began as an intern at Kenya Television Network (KTN). 
                  Those early days laid the foundation for everything that followed: curiosity, resilience, 
                  and a deep respect for the power of storytelling.
                </p>
                <p className="text-base text-gray-800 mb-6 leading-relaxed tracking-wide">
                  In 2013, I experienced a full-circle moment: returning to KTN as Head of TV, 
                  exactly where my journey had begun. Storytelling, for me, has never been just a career; 
                  it's a calling. Leading three television channels was both a privilege and a responsibility.
                </p>
                <p className="text-base text-gray-800 mb-6 leading-relaxed tracking-wide">
                  My work has taken me beyond Kenya to global stages across Africa, the Middle East, and Europe, 
                  where I have moderated high-level panels, conducted thought-provoking interviews, 
                  and facilitated cross-cultural dialogues.
                </p>
                <p className="text-base text-gray-800 mb-6 leading-relaxed tracking-wide">
                  Today, I continue this mission through <strong>What's Your Story Africa</strong>, 
                  a platform that began as a television show and has since evolved into a podcast and community.
                </p>
                <p className="text-base text-gray-800 mb-6 leading-relaxed tracking-wide">
                  Beyond the cameras, lights, and mics, I have dedicated myself to mentoring the next generation of storytellers and communicators.
                </p>
                <p className="text-base text-gray-800 leading-relaxed tracking-wide">
                  Alongside this, I have embraced life coaching as a way to walk with people through their personal journeys, 
                  especially those navigating the defining years of 25–35, as well as parents who entrust me to mentor their teenage daughters.
                  Over the years, many have sought me out as a sounding board for life's transitions, and I now 
                  honor that trust by offering structured coaching. Whether through one-on-one sessions, 
                  organizational storytelling workshops, or the What's Your Story Africa community, my mission 
                  is the same: <strong>restore dignity to storytelling, amplify unheard voices, and help people step fully
                   into their story - for legacy, for posterity, and for impact.</strong>
                </p>
              </div>
            </div>

            {/* Blog Posts - UPDATED: Removed Create Post button */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reflections</h2>
              {publishedBlogPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {publishedBlogPosts.map((post, index) => (
                    <article 
                      key={post.id}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="w-full h-48 overflow-hidden bg-gray-100">
                        <img 
                          src={post.thumbnail_url || getDefaultThumbnail(index)}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getDefaultThumbnail(index);
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span>{post.read_time}</span>
                        </div>
                        <h3 
                          className="text-xl font-bold text-gray-900 mb-3 hover:text-emerald-600 transition-colors cursor-pointer"
                          onClick={() => handleBlogPostClick(post)}
                        >
                          {post.title}
                        </h3>
                        <p className="text-gray-700 mb-4 text-sm">
                          {post.excerpt}
                        </p>
                        <div className="flex justify-between items-center">
                          <span 
                            className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors cursor-pointer text-sm"
                            onClick={() => handleBlogPostClick(post)}
                          >
                            Read More →
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-3 text-sm">📝 How to Add Blog Posts</h3>
                    <div className="text-xs text-blue-700 space-y-2">
                      <p><strong>Method 1 - Storage Upload:</strong></p>
                      <p>• Go to Supabase Dashboard → Storage → blog-files bucket</p>
                      <p>• Upload .txt, .md, or .docx files</p>
                      <p>• Files are automatically converted to blog posts</p>
                      
                      <p className="mt-4"><strong>Method 2 - Direct Database:</strong></p>
                      <p>• Go to Supabase Dashboard → Database → blog_posts table</p>
                      <p>• Click "Insert" → "Insert row"</p>
                      <p>• Fill in: title, content, slug, status='published'</p>
                    </div>
                  </div>
                  <button
                    onClick={loadPublishedBlogPosts}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Check for New Files
                  </button>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/50 shadow-xl mb-6">
              <h4 className="text-lg font-semibold mb-6 text-gray-900">Share Your Comments</h4>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
                <textarea
                  placeholder="Your Comment"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  rows={4}
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                >
                  Submit 
                </button>
              </form>
            </div>
          </div>

          {/* Side Panel - spans 1 column on large screens, hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <SidePanel 
              blogPosts={publishedBlogPosts} 
              videos={youtubeVideos}
              onReadMore={handleSidePanelReadMore}
              onMentorshipReadMore={handleMentorshipReadMore}
              onPostClick={handleBlogPostClick}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render Podcasts (previously the home page)
  const renderPodcasts = () => (
    <div className="min-h-screen">
      {/* Hero Section */}
      {/* FIXED: Added pt-20 md:pt-0 to push content down on mobile */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50 overflow-hidden pt-20 md:pt-0">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left Content */}
   <div className="text-left">
              <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full text-emerald-700 font-medium mb-8 animate-elegant-fadeIn text-sm tracking-wide">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-gentle-pulse"></span>
                The Storytelling Gateway to Africa
              </div>


              
              <h1 className="hero-title text-4xl md:text-6xl mb-4 font-semibold leading-tight animate-elegant-slideUp">
                <img
                  src="/img/logo/logobig.png"
                  alt="What's Your Story Africa Logo"
                  className="mx-auto h-6 md:h-8 w-auto object-contain drop-shadow-lg rounded-2xl"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </h1>
              
              <p className="hero-paragraph text-base text-gray-800 mb-6 md:mb-8 leading-relaxed tracking-wide animate-elegant-slideUp" style={{ animationDelay: '0.2s' }}>
                This space holds my collection of work: stories, reflections, and the experiences that have shaped
                my 25-year journey in media and communications, including my most recent role as Head of TV at Kenya Television Network.
              </p>
              
              <p className="hero-paragraph text-base text-gray-800 mb-6 md:mb-8 leading-relaxed tracking-wide animate-elegant-slideUp" style={{ animationDelay: '0.2s' }}>
                At its core, this is a space to connect freely, honor our shared humanity, and celebrate the power of stories. Whether through my podcast 'What's Your Story Africa,' my writing, or the paths I've walked in media, I sincerely
                hope that you feel seen, heard, inspired, and elevated as we share our experiences with clarity and heart.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 animate-elegant-slideUp" style={{ animationDelay: '0.6s' }}>
                <a 
                  href="https://www.youtube.com/@WhatsYourStoryAfrica" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-full hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 text-sm"
                >
                  <Play className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 group-hover:scale-110 transition-transform" />
                  Watch Latest Episodes
                </a>
                <button 
                  onClick={() => setCurrentView('connect')}
                  className="group inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-white/80 backdrop-blur-sm border-2 border-emerald-200 text-emerald-800 font-semibold rounded-full hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 hover:scale-105 text-sm"
                >
                  Share Your Story
                  <ExternalLink className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-elegant-slideUp" style={{ animationDelay: '0.4s' }}>
              <div className="text-center mb-4 lg:hidden">
                {/* <p className="text-sm text-gray-600 font-medium">Catherine</p> */}
              </div>
              <div className="relative">
                <img 
                  src="/img/catherine/catherine-hero.jpg"
                  alt="Catherine Mwangi - Host of What's Your Story Africa"
                  className="w-full max-w-md mx-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.pexels.com/photos-3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent rounded-3xl"></div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500 rounded-full opacity-20 animate-gentle-pulse"></div>
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-teal-500 rounded-full opacity-30 animate-float"></div>
              </div>
              <div className="hidden lg:block text-center mt-4">
                <p className="text-sm text-gray-600 font-medium"></p>
                <p className="text-xs text-gray-500">From the Heart of Africa. Preserved for Generations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Videos Section */}
      <section className="py-16 md:py-24 bg-white mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8 md:mb-12"></div>
          
          {videosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-xl h-52 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {youtubeVideos.map((video, index) => {
                const uniqueKey = video.id ? `${video.id}-${index}` : `video-${index}`;
                const rawName = video.guestName || video.title || 'Guest Speaker';
                const cleanName = rawName
                  .replace(/What's Your Story Africa[:\-\s]*/gi, '')
                  .replace(/Whats Your Story Africa[:\-\s]*/gi, '')
                  .replace(/WYSA[:\-\s]*/gi, '')
                  .replace(/Episode[:\-\s]*\d*[:\-\s]*/gi, '')
                  .replace(/^[:\-\s]+/, '')
                  .trim();

                return (
                  <div key={uniqueKey} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="relative">
                      <img 
                        src={video.thumbnail} 
                        alt={`${cleanName} - What's Your Story Africa`}
                        className="w-full h-48 object-cover bg-gray-100 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-5 h-5 text-emerald-600 ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between min-h-[60px]">
                      <h3 className="text-sm font-semibold text-gray-900 flex-1 pr-3 line-clamp-2 leading-tight">
                        {cleanName}
                      </h3>
                      <a 
                        href={video.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors text-xs font-medium whitespace-nowrap flex-shrink-0 ml-2"
                      >
                        Watch
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12 md:mt-16">
            <a 
              href="https://www.youtube.com/@WhatsYourStoryAfrica" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105 text-sm"
            >
              <Play className="w-4 h-4 mr-2" />
              View All Episodes on YouTube
            </a>
          </div>
        </div>
      </section>
    </div>
  );

  // Render Coaching Section - WITH WORKING BUTTONS
const renderCoaching = () => {
  // Function to handle enrollment
  const handleEnrollNow = () => {
    // Scroll to waitlist section or open enrollment modal
    const waitlistSection = document.getElementById('waitlist-section');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Alternatively, you can redirect to enrollment page:
    // window.location.href = '/enroll';
  };

  // Function to handle Read More - Catherine
  const handleReadMore = () => {
    // Redirect to Catherine's page
    window.location.href = '/catherine';
    // Or if you have a different route:
    // window.location.href = '/about-catherine';
    // Or open a modal:
    // openCatherineModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-emerald-50/20 relative overflow-hidden">
      {/* Clean background with subtle gradients - Mobile optimized */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-emerald-100/30 to-teal-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-tr from-amber-100/20 to-orange-100/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header - Mobile Optimized */}
      <div className="relative pt-12 md:pt-16 pb-8 md:pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-6 md:mb-8">
            <img 
              src="/img/logo/logobig.png"
              alt="What's Your Story Africa"
              className="h-16 md:h-20 mx-auto mb-4 md:mb-6 filter drop-shadow-lg"
            />
          </div>
          
          <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-white/80 backdrop-blur-sm rounded-full border border-emerald-200 shadow-sm mb-6 md:mb-8">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full mr-2 md:mr-3 animate-pulse"></div>
            <span className="text-emerald-700 text-xs md:text-sm font-medium tracking-widest uppercase">Transformative Storytelling</span>
          </div>

          <h1 className="text-3xl md:text-6xl font-light text-gray-900 mb-4 md:mb-6 leading-tight">
            Unleash Your
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">African Narrative</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Master the art of storytelling and shape Africa's next generation of voices. 
            Transform your ideas into legacy.
          </p>

          {/* CTA Button - NOW WORKING */}
          <div className="flex justify-center items-center mb-8 md:mb-12 px-4">
            <button 
              onClick={handleEnrollNow}
              className="w-full max-w-sm md:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-base md:text-lg cursor-pointer"
            >
              Enroll Now - KES 20,000
            </button>
          </div>

          {/* Stats - Mobile Optimized */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-md mx-auto px-4">
            {[
              { number: '3', label: 'Days Intensive' },
              { number: '25+', label: 'Years Experience' },
              { number: '16-30', label: 'Age Range' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl md:text-2xl font-light text-emerald-600 mb-1 md:mb-2">{stat.number}</div>
                <div className="text-gray-500 text-xs md:text-sm uppercase tracking-widest leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          
          {/* Left Column - Content */}
          <div className="space-y-6 md:space-y-8">
            {/* About Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 border border-white shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
              <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-4 md:mb-6">About the Program</h2>
              <p className="text-gray-700 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                Are you naturally curious, engaging, and able to spark meaningful conversations? 
                This intensive 3-day program transforms your innate storytelling abilities into 
                powerful tools for change.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                Under the guidance of media veteran Catherine, you'll learn to craft compelling 
                narratives that resonate across generations and shape Africa's future.
              </p>
            </div>

            {/* Curriculum */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 border border-white shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
              <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-4 md:mb-6">What You'll Learn</h2>
              <div className="space-y-3 md:space-y-4">
                {[
                  "Storytelling structures and narrative techniques",
                  "Identifying and developing your unique niche",
                  "Building authentic personal branding",
                  "Monetizing storytelling expertise",
                  "Podcasting for legacy and impact",
                  "Practical implementation sessions"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 md:space-x-4 group">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1 group-hover:bg-emerald-200 transition-colors duration-300">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300 text-sm md:text-base flex-1">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* For Parents */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl md:rounded-2xl p-6 md:p-8 border border-amber-200 shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg md:text-xl font-semibold text-amber-800 mb-3 md:mb-4">For Parents & Guardians</h3>
              <p className="text-gray-700 mb-3 md:mb-4 text-sm md:text-base">
                Does your child have a curious mind, bold ideas, and a gift for conversation?
              </p>
              <p className="text-gray-700 text-sm md:text-base">
                This program channels their creative energy into meaningful storytelling that 
                can shape their future and our continent's narrative.
              </p>
            </div>
          </div>

          {/* Right Column - Catherine & Details */}
          <div className="space-y-6 md:space-y-8">
            {/* Catherine Section - Mobile Optimized WITH WORKING READ MORE */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 border border-white shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
              <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-emerald-200 overflow-hidden shadow-lg">
                    <img 
                      src="/img/catherine/catherine-hero.jpg"
                      alt="Catherine"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="inline-block bg-emerald-100 px-3 py-1 rounded-full mb-3 border border-emerald-200">
                    <span className="text-emerald-700 text-xs md:text-sm font-medium">25+ Years Experience</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-2">Catherine</h3>
                  <p className="text-gray-700 mb-3 md:mb-4 text-sm md:text-base">
                    Former Head of Television at KTN, bringing decades of media leadership 
                    across East Africa to mentor emerging storytellers.
                  </p>
                  <p className="text-emerald-600 italic mb-3 md:mb-4 text-sm md:text-base">
                    "The future of our continent lies in the authentic voices of our youth."
                  </p>
                  {/* Read More Button - NOW WORKING */}
                  <button 
                    onClick={handleReadMore}
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center justify-center md:justify-start space-x-1 group mx-auto md:mx-0 cursor-pointer"
                  >
                    <span>Read full bio</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Program Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 border border-white shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
              <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-4 md:mb-6">Program Details</h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between py-2 md:py-3 border-b border-gray-200">
                  <span className="text-gray-600 text-sm md:text-base">Location</span>
                  <span className="text-gray-900 font-medium text-sm md:text-base">Nairobi, Kenya</span>
                </div>
                <div className="flex items-center justify-between py-2 md:py-3 border-b border-gray-200">
                  <span className="text-gray-600 text-sm md:text-base">Date</span>
                  <span className="text-gray-900 font-medium text-sm md:text-base">Nov 13-15, 2024</span>
                </div>
                <div className="flex items-center justify-between py-2 md:py-3 border-b border-gray-200">
                  <span className="text-gray-600 text-sm md:text-base">Duration</span>
                  <span className="text-gray-900 font-medium text-sm md:text-base">3 Days Intensive</span>
                </div>
                <div className="flex items-center justify-between py-2 md:py-3">
                  <span className="text-gray-600 text-sm md:text-base">Age Range</span>
                  <span className="text-gray-900 font-medium text-sm md:text-base">16-30 Years</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl md:rounded-2xl p-6 md:p-8 border border-emerald-200 shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
              <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-4 md:mb-6">Investment</h3>
              <div className="space-y-3 md:space-y-4">
                <div className="bg-white/80 rounded-lg md:rounded-xl p-4 md:p-6 border border-emerald-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-gray-900 font-semibold text-base md:text-lg">Early Registration</h4>
                      <p className="text-emerald-600 text-xs md:text-sm">Before November 1st</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl md:text-2xl font-light text-emerald-600">KES 20,000</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-gray-900 font-semibold text-base md:text-lg">Standard Enrollment</h4>
                      <p className="text-gray-500 text-xs md:text-sm">After November 1st</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl md:text-2xl font-light text-gray-900">KES 25,000</div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-amber-200">
                  <p className="text-amber-700 text-xs md:text-sm text-center">
                    🎯 Group enrollment discounts available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Waitlist Section - Mobile Optimized WITH ID FOR SCROLLING */}
        <div id="waitlist-section" className="mt-12 md:mt-20">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl md:rounded-2xl p-6 md:p-12 border border-emerald-400 shadow-xl md:shadow-2xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 bg-white/20 rounded-full mb-4 md:mb-6 backdrop-blur-sm">
                <span className="text-white text-xs md:text-sm font-medium tracking-widest">LIMITED AVAILABILITY</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-light text-white mb-3 md:mb-4">
                Join the Waitlist
              </h3>
              
              <p className="text-white/90 mb-6 md:mb-8 max-w-md mx-auto text-base md:text-lg">
                Secure your priority access for our next cohort. 
              </p>
              
              <div className="flex flex-col gap-3 justify-center items-center max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg placeholder-white/70 text-white focus:outline-none focus:border-white/50 backdrop-blur-sm text-sm md:text-base"
                />
                <button className="w-full px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base cursor-pointer">
                  Join Waitlist
                </button>
              </div>
              
              <p className="mt-4 md:mt-6 text-white/80 text-xs md:text-sm">
                What's Your Story Africa • Cultivating African Voices
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

  const renderBlogPost = (post: BlogPost) => {
    // Get current URL for sharing
    const currentUrl = window.location.href;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main content */}
            <div className="lg:col-span-3">
              <article className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 border border-white/50 shadow-xl">
                {/* Thumbnail always at the top if present */}
                {post.thumbnail_url && (
                  <div className="w-full h-48 sm:h-64 md:h-80 overflow-hidden rounded-2xl mb-6">
                    <img 
                      src={post.thumbnail_url} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <header className="mb-6">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {post.title}
                  </h1>
                  <div className="flex items-center text-gray-600 text-sm space-x-4 mb-4">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.read_time}</span>
                  </div>
                  {post.excerpt && (
                    <p className="text-base text-gray-800 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </header>

                {/* Split content in half and insert carousel in the middle */}
                {(() => {
                  const content = post.content
                    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
                      if (post.images && post.images.some(img => img.url === url)) {
                        return '';
                      }
                      return match;
                    });
                  const paragraphs = content.split(/\n{2,}/);
                  const half = Math.ceil(paragraphs.length / 2);
                  const firstHalf = paragraphs.slice(0, half).join('\n\n');
                  const secondHalf = paragraphs.slice(half).join('\n\n');
                  return (
                    <>
                      <div className="prose prose-base max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: firstHalf.replace(/\n/g, '<br />') }} />
                      {post.images && post.images.length > 0 && (
                        <div className="my-6 flex justify-center">
                          <ImageCarousel images={post.images} />
                        </div>
                      )}
                      <div className="prose prose-base max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: secondHalf.replace(/\n/g, '<br />') }} />
                    </>
                  );
                })()}
                
                <div className="mt-8 mb-4 p-4 sm:p-6 bg-gradient-to-br">
                  <p className="text-base text-gray-800 leading-relaxed text-center mb-4">
                    Catherine's experience in media and communications spans 25 years, most recently as Head of TV at Kenya Television Network. Today, she pours her heart into What's Your Story Africa - a podcast that reminds us of the power within every human story.
                  </p>
                </div>

                {/* FIXED: Social Sharing Buttons - Now show on both desktop and mobile */}
                <SocialShareButtons post={post} url={currentUrl} />

                {/* Comments Section */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900">Share Your Comment</h4>
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                    />
                    <textarea
                      placeholder="Your Comment"
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                      rows={4}
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                    >
                      Submit
                    </button>
                  </form>
                </div>

                {/* UPDATED: Next Button with functionality */}
                <NextButton 
                  onNext={() => handleNextPost(post)} 
                  currentPost={post} 
                  allPosts={publishedBlogPosts} 
                />
              </article>
            </div>

            {/* Side Panel for blog posts - hidden on mobile */}
            <div className="hidden lg:block lg:col-span-1">
              <SidePanel 
                blogPosts={publishedBlogPosts} 
                videos={youtubeVideos}
                onReadMore={handleSidePanelReadMore}
                onMentorshipReadMore={handleMentorshipReadMore}
                onPostClick={handleBlogPostClick}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderConnect = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* UPDATED: Together we go further with reduced gap */}
            <div className="flex justify-center w-full mb-4">
              <div className="inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full text-emerald-700 font-medium animate-elegant-fadeIn text-sm tracking-wide">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-gentle-pulse"></span>
                Together, We Go Further
              </div>
            </div>

            {/* Three Green Boxes - FIXED: Email buttons now working properly */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Left Box - Forest Green */}
              <div className="bg-gradient-to-br from-[#228B22] to-[#1e6e1e] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-center h-full flex flex-col">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="bi bi-heart-fill text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Your Story Matters</h3>
                  <p className="text-white mb-6 flex-grow text-sm">
                    Your story is your greatest asset. Share it, or nominate someone you know.
                  </p>

                  <button
                    onClick={() => {
                      const email = "catherine@whatsyourstoryafrica.com";
                      const subject = encodeURIComponent("Story Submission/Nomination");
                      const body = encodeURIComponent("Hello Catherine, I'd like to share a story...");

                      const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
                      const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

                      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                      if (isMobile) {
                        // On phone → open default email app
                        window.location.href = mailtoLink;
                      } else {
                        // On desktop → open Gmail web
                        window.open(gmailLink, "_blank");
                      }
                    }}
                    className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 text-xs text-center"
                  >
                    Inquire Here
                  </button>
                </div>
              </div>

              {/* Middle Box - Pine Green */}
              <div className="bg-gradient-to-br from-[#01796F] to-[#006d64] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-center h-full flex flex-col">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="bi bi-people-fill text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Join Our Community</h3>
                  <p className="text-white mb-6 flex-grow text-sm">
                    Would you like to receive the latest podcasts, newsletters, and upcoming events directly to your inbox?
                  </p>
                  <button
                    onClick={() => document.getElementById('newsletter-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 text-xs"
                  >
                    Count Me In
                  </button>
                </div>
              </div>

              {/* Right Box - Bottle Green */}
              <div className="bg-gradient-to-br from-[#006A4E] to-[#00563f] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-center h-full flex flex-col">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="bi bi-infinity text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Let's Co-Create</h3>
                  <p className="text-white mb-6 flex-grow text-sm">
                    Would you like to explore partnership, investment or sponsorship opportunities? We're in the era of collaborations.
                  </p>

                  <button
                    onClick={() => {
                      const email = "catherine@whatsyourstoryafrica.com";
                      const subject = encodeURIComponent("Partnership Inquiry");
                      const body = encodeURIComponent(
                        "Hello, I'm interested in exploring partnership opportunities with What's Your Story Africa..."
                      );

                      const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
                      const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

                      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                      if (isMobile) {
                        // On phones → open default email app (iOS Mail, Gmail App, etc.)
                        window.location.href = mailtoLink;
                      } else {
                        // On desktop → open Gmail Web
                        window.open(gmailLink, "_blank");
                      }
                    }}
                    className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 text-xs text-center"
                  >
                    Yes, Let's Partner!
                  </button>
                </div>
              </div>
            </div>

            {/* Newsletter Form Section */}
            <div
              id="newsletter-form"
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-12 mb-12 border border-white/50 shadow-xl"
            >
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Stay Connected</h3>
                <p className="text-gray-600 text-sm">Join our community and never miss an update</p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <input
                  type="email"
                  id="subscriber-email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  required
                />

                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const emailInput = document.getElementById("subscriber-email") as HTMLInputElement;
                    if (!emailInput.value) {
                      alert("Please enter your email first.");
                      return;
                    }

                    const userEmail = emailInput.value;
                    const subject = encodeURIComponent("Newsletter Subscription");
                    const body = encodeURIComponent(
                      `Hello Catherine,\n\nPlease add me to your newsletter.\n\nSubscriber: ${userEmail}`
                    );

                    const mailtoLink = `mailto:catherine@whatsyourstoryafrica.com?subject=${subject}&body=${body}`;
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=catherine@whatsyourstoryafrica.com&su=${subject}&body=${body}`;

                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                    if (isMobile) {
                      // On phones → open native email app
                      window.location.href = mailtoLink;
                    } else {
                      // On desktop → open Gmail Web
                      window.open(gmailUrl, "_blank");
                    }
                  }}
                  className="block w-full px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300 text-center text-sm"
                >
                  Subscribe for Free
                </a>
              </div>
            </div>

            {/* Mentorship Section - UPDATED: Fixed Calendly links */}
            <div id="mentorship-section" className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-12 border border-white/50 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  MENTORSHIP
                </h2>
                <p className="text-lg text-gray-800 italic">
                  Guiding Voices. Shaping Futures. Building Legacies.
                </p>
              </div>

              <div className="prose prose-base max-w-none text-gray-800 space-y-6">
                <p className="text-base leading-relaxed">
                  Mentorship is not about copying a voice; it's about finding yours, refining it, and learning to share it powerfully with the world.
                </p>

                <p className="text-base leading-relaxed">
                  For over two decades, I've lived at the heart of media; leading national conversations, moderating panels with Industry leaders, and interviewing people from all walks of life.
                </p>

                <p className="text-base leading-relaxed">
                  As we restart our mentorship courses, I am especially interested in the young people who have just finished high school and are asking 'what next'.
                </p>

                <div className="text-center my-8">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();

                      const subject = encodeURIComponent("Mentorship Inquiry");
                      const body = encodeURIComponent(
                        "Hello Catherine,\n\nI would like to learn more about your mentorship program..."
                      );

                      const mailtoLink = `mailto:catherine@whatsyourstoryafrica.com?subject=${subject}&body=${body}`;
                      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=catherine@whatsyourstoryafrica.com&su=${subject}&body=${body}`;

                      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                      if (isMobile) {
                        // On phones → open native email app (Mail, Gmail app, Outlook, etc.)
                        window.location.href = mailtoLink;
                      } else {
                        // On desktop/laptop → open Gmail web in a new tab
                        window.open(gmailUrl, "_blank");
                      }
                    }}
                    className="inline-flex items-center px-6 md:px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105 text-sm"
                  >
                    Reach Out
                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                  </a>
                </div>

                <p className="text-base leading-relaxed">
                  My other interest is in those who simply want someone to talk to. I cannot tell you how many people I have met, and all they want to do is talk to someone, without bias/judgment.
                </p>

                <div className="text-center my-8">
                  <a
                    href="https://calendly.com/catherine-whatsyourstoryafrica"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 md:px-8 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-all duration-300 hover:scale-105 text-sm"
                  >
                    Book A Call
                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                  </a>
                </div>
              </div>

              <div className="mt-8 md:mt-12 text-center">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 md:p-8 border border-emerald-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Ready to Begin Your Journey?</h4>
                  <p className="text-gray-700 mb-6 text-sm">
                    Whether you're seeking guidance, collaboration, or simply a conversation, I'm here to listen and support your growth.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel - hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <SidePanel 
              blogPosts={publishedBlogPosts} 
              videos={youtubeVideos}
              onReadMore={handleSidePanelReadMore}
              onMentorshipReadMore={handleMentorshipReadMore}
              onPostClick={handleBlogPostClick}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Check if we're viewing a specific blog post
  const viewingBlogPost = publishedBlogPosts.find(post => 
    currentView.startsWith('blog-') && currentView === `blog-${post.slug}`
  );

  // Footer component - UPDATED: Completely removed Manage Blog Posts button
  const Footer = () => (
    <footer className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-center">
          <div className="text-center lg:text-left">
            <button 
              onClick={() => setCurrentView('catherine')}
              className="flex items-center justify-center lg:justify-start"
            >
              <img 
                src="/img/logo/wysa-logo.png" 
                alt="What's Your Story Africa Logo" 
                className="h-16 md:h-20 w-auto max-w-[200px] md:max-w-[300px] object-contain transition-opacity duration-300 hover:opacity-80"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold !text-white mb-3">
              For Legacy & Posterity
            </h2>
            <p className="text-sm text-white mb-4">
              Share Your Own Story
            </p>
            <button
              onClick={(e) => {
                e.preventDefault();

                const subject = encodeURIComponent("General Inquiry");
                const body = encodeURIComponent(
                  "Hello Catherine,\n\nI'd like to get in touch regarding..."
                );

                const mailtoLink = `mailto:catherine@whatsyourstoryafrica.com?subject=${subject}&body=${body}`;
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=catherine@whatsyourstoryafrica.com&su=${subject}&body=${body}`;

                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                if (isMobile) {
                  window.location.href = mailtoLink; // opens native email app
                } else {
                  window.open(gmailUrl, "_blank"); // opens Gmail web
                }
              }}
              className="inline-flex items-center px-5 py-2.5 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm"
            >
              Get In Touch
              <ExternalLink className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </button>
          </div>

          <div className="flex items-center justify-center lg:justify-end space-x-3 md:space-x-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <a 
                href="https://linkedin.com/in/catherinemwangitv" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 md:w-9 md:h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
              >
                <i className="bi bi-linkedin text-sm md:text-base"></i>
              </a>
              <a 
                href="https://tiktok.com/@cathmwangi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 md:w-9 md:h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
              >
                <i className="bi bi-tiktok text-sm md:text-base"></i>
              </a>
              <a 
                href="https://facebook.com/CatherineMwangiKE" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 md:w-9 md:h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
              >
                <i className="bi bi-facebook text-sm md:text-base"></i>
              </a>
              <a 
                href="https://instagram.com/cathmwangi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 md:w-9 md:h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
              >
                <i className="bi bi-instagram text-sm md:text-base"></i>
              </a>
              <a 
                href="https://x.com/CathMwangi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 md:w-9 md:h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
              >
                <i className="bi bi-twitter-x text-sm md:text-base"></i>
              </a>
              <a 
                href="https://www.youtube.com/@WhatsYourStoryAfrica" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 md:w-9 md:h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
              >
                <i className="bi bi-youtube text-sm md:text-base"></i>
              </a>
            </div>
          </div>
        </div>
        
        {/* REMOVED: Entire Manage Blog Posts button section */}
      </div>
    </footer>
  );

  if (viewingBlogPost) {
    return (
      <div className="relative min-h-screen bg-white">
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <button 
                onClick={() => setCurrentView('catherine')}
                className="flex items-center"
              >
                <img 
                  src="/img/logo/wysa-logo.png" 
                  alt="What's Your Story Africa Logo" 
                  className="h-12 sm:h-16 lg:h-20 w-auto max-w-[200px] sm:max-w-[300px] object-contain transition-opacity duration-300 hover:opacity-80"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </button>

              <div className="flex items-center space-x-6 md:space-x-8">
                <button 
                  onClick={() => setCurrentView('podcasts')}
                  className="font-medium text-gray-700 hover:text-emerald-600 transition-colors text-sm"
                >
                  Podcasts
                </button>
                <button 
                  onClick={() => setCurrentView('coaching')}
                  className="font-medium text-gray-700 hover:text-emerald-600 transition-colors text-sm"
                >
                  Coaching
                </button>
                <button 
                  onClick={() => setCurrentView('connect')}
                  className="font-medium text-gray-700 hover:text-emerald-600 transition-colors text-sm"
                >
                  Let's Connect
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="pt-16 sm:pt-20">
          {renderBlogPost(viewingBlogPost)}
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <button 
              onClick={() => setCurrentView('catherine')}
              className="flex items-center"
            >
              <img 
                src="/img/logo/wysa-logo.png" 
                alt="What's Your Story Africa Logo" 
                className="h-12 sm:h-16 lg:h-20 w-auto max-w-[200px] sm:max-w-[300px] object-contain transition-opacity duration-300 hover:opacity-80"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </button>

            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setCurrentView('catherine')}
                className={`font-medium transition-colors text-sm ${
                  currentView === 'catherine' 
                    ? 'text-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentView('podcasts')}
                className={`font-medium transition-colors text-sm ${
                  currentView === 'podcasts' 
                    ? 'text-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Podcasts
              </button>
              <button 
                onClick={() => setCurrentView('coaching')}
                className={`font-medium transition-colors text-sm ${
                  currentView === 'coaching' 
                    ? 'text-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Coaching
              </button>
              <button 
                onClick={() => setCurrentView('connect')}
                className={`font-medium transition-colors text-sm ${
                  currentView === 'connect' 
                    ? 'text-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Let's Connect
              </button>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-emerald-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="px-4 sm:px-6 py-4 space-y-4">
              <button 
                onClick={() => {
                  setCurrentView('catherine');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left font-medium transition-colors text-sm ${
                  currentView === 'catherine' 
                    ? 'text-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => {
                  setCurrentView('podcasts');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left font-medium transition-colors text-sm ${
                  currentView === 'podcasts' 
                    ? 'text-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Podcasts
              </button>
              <button 
                onClick={() => {
                  setCurrentView('coaching');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left font-medium transition-colors text-sm ${
                  currentView === 'coaching' 
                    ? 'text-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Coaching
              </button>
              <button 
                onClick={() => {
                  setCurrentView('connect');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left font-medium transition-colors text-sm ${
                  currentView === 'connect' 
                    ? 'text-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Let's Connect
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16 sm:pt-20">
        {currentView === 'catherine' && renderCatherine()}
        {currentView === 'podcasts' && renderPodcasts()}
        {currentView === 'coaching' && renderCoaching()}
        {currentView === 'connect' && renderConnect()}
      </main>
      

      <Footer />
      
      {showBlogManager && (
        <BlogManager 
          onClose={() => setShowBlogManager(false)} 
          onBlogPostsChange={loadPublishedBlogPosts}
        />
      )}
    </div>
  );
};

export default App;