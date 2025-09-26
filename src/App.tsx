import React, { useState, useEffect } from 'react';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Add a CSS class for social icon size
const socialIconClass = 'bi social-icon';

import { Play, ExternalLink, Menu, X, ArrowRight } from 'lucide-react';
import BlogManager from './components/BlogManager';
import ImageCarousel from './components/ImageCarousel';
import { blogService, BlogPost } from './lib/supabase';
import { youtubeService, YouTubeVideo } from './lib/youtube';

// SidePanel Component
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
    feedback: ''
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle comment submission logic here
    console.log('Feedback submitted:', commentData);
    // Reset form
    setCommentData({ name: '', email: '', feedback: '' });
    alert('Thank you for your feedback!');
  };

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedPosts = searchQuery ? filteredPosts : blogPosts.slice(0, 3);

  return (
    <div className="w-full lg:w-80 space-y-8">
   {/* Search Section */}
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
            target.src = "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=300";
          }}
        />
        <p className="text-gray-600 text-sm text-center mb-3">
          Storytelling is my magnificent obsession.
        </p>
        <button 
          onClick={onReadMore}
          className="w-full py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Read More
        </button>
      </div>

      {/* Mentorship Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
        <div className="flex items-center mb-4">
          <i className="bi bi-people-fill text-emerald-600 text-lg mr-3"></i>
          <h3 className="text-lg font-bold text-gray-900">Mentorship</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4">
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
            href="https://calendly.com/catherine-wysa/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-colors text-center"
          >
            Book A Call
          </a>
        </div>
      </div>

      {/* Recent Posts Section */}
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
                  src={post.thumbnail_url || `https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=75`}
                  alt={post.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.published_date).toLocaleDateString()}
                  </p>
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

      {/* What to Watch Section */}
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
                  <p className="text-xs text-gray-500">YouTube</p>
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
          <h3 className="text-lg font-bold text-gray-900">Feedback</h3>
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
            placeholder="Your Feedback"
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

// Next Button Component
const NextButton = () => {
  return (
    <div className="text-center mt-8 pt-6 border-t border-gray-200">
      <button className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105">
        Next Post
        <ArrowRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState('catherine'); // Changed default to 'catherine'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBlogManager, setShowBlogManager] = useState(false);
  const [publishedBlogPosts, setPublishedBlogPosts] = useState<BlogPost[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [carouselPosition, setCarouselPosition] = useState(0);

  // Default thumbnail images for blog posts
  const getDefaultThumbnail = (index: number) => {
    const defaultThumbnails = [
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
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

  const handleBlogPostClick = (post: BlogPost) => {
    setCurrentView(`blog-${post.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadMoreClick = () => {
    setCurrentView('podcasts'); // Changed to 'podcasts'
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSidePanelReadMore = () => {
    setCurrentView('podcasts'); // Changed to 'podcasts'
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // NEW FUNCTION: Handle mentorship read more click
  const handleMentorshipReadMore = () => {
    setCurrentView('connect');
    // Scroll after a short delay to allow the page to render
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

  // Render About Catherine (now the landing page)
  const renderCatherine = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Main content grid with side panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content - spans 3 columns on large screens */}
          <div className="lg:col-span-3">
            {/* Catherine's Image - Centered */}
            <div className="flex justify-center items-center mb-16">
              <div className="w-full max-w-6xl animate-elegant-slideUp" style={{ animationDelay: '0.4s' }}>
                <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full text-emerald-700 font-medium mb-8 animate-elegant-fadeIn text-sm tracking-wide">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-gentle-pulse"></span>
                From the Heart of Africa - Preserved for Generations
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
                            target.src = "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
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
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-12 border border-white/50 shadow-xl">
              <div className="prose prose-lg text-gray-600 max-w-none">
                <p className="text-lg md:text-l mb-6 leading-relaxed tracking-wide">
                  For more than 25 years, my life has been woven into the fabric of storytelling. 
                  My career in media began as an intern at Kenya Television Network (KTN). 
                  Those early days laid the foundation for everything that followed: curiosity, resilience, 
                  and a deep respect for the power of storytelling.
                </p>
                <p className="text-lg md:text-l mb-6 leading-relaxed tracking-wide">
                  In 2013, I experienced a full-circle moment: returning to KTN as Head of TV, 
                  exactly where my journey had begun. Storytelling, for me, has never been just a career; 
                  it's a calling. Leading three television channels was both a privilege and a responsibility.
                </p>
                <p className="text-lg md:text-l mb-6 leading-relaxed tracking-wide">
                  My work has taken me beyond Kenya to global stages across Africa, the Middle East, and Europe, 
                  where I have moderated high-level panels, conducted thought-provoking interviews, 
                  and facilitated cross-cultural dialogues.
                </p>
                <p className="text-lg md:text-l mb-6 leading-relaxed tracking-wide">
                  Today, I continue this mission through <strong>What's Your Story Africa</strong>, 
                  a platform that began as a television show and has since evolved into a podcast and community.
                </p>
                <p className="text-lg md:text-l mb-6 leading-relaxed tracking-wide">
                  Beyond the cameras, lights, and mics, I have dedicated myself to mentoring the next generation of storytellers and communicators.
                </p>
                <p className="text-lg md:text-l leading-relaxed tracking-wide">
                  Alongside this, I have embraced life coaching as a way to walk with people through their personal journeys, 
                  especially those navigating the defining years of 25–35, as well as parents who entrust me to mentor their teenage daughters.
                </p>
              </div>
            </div>

           {/* Blog Posts */}
<div className="mb-12">
  <h2 className="text-3xl font-bold text-gray-900 mb-8">Reflections</h2>
  {publishedBlogPosts.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {publishedBlogPosts.map((post, index) => (
        <article 
          key={post.id}
          className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
          onClick={() => handleBlogPostClick(post)}
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
            <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-emerald-600 transition-colors">
              {post.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {post.excerpt}
            </p>
            <span className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
              Read More →
            </span>
          </div>
        </article>
      ))}
    </div>
  ) : (
    <div className="text-center py-12">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3">📝 How to Add Blog Posts</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Method 1 - Storage Upload:</strong></p>
          <p>• Go to Supabase Dashboard → Storage → blog-files bucket</p>
          <p>• Upload .txt, .md, or .docx files</p>
          <p>• Files are automatically converted to blog posts</p>
          
          <p className="mt-4"><strong>Method 2 - Direct Database:</strong></p>
          <p>• Go to Supabase Dashboard → Database → blog_posts table</p>
          <p>• Click "Insert" → "Insert row"</p>
          <p>• Fill in: title, content, slug, status='published'</p>
          
          <p className="mt-4"><strong>Method 3 - Blog Manager:</strong></p>
          <p>• Use the "Create Your First Post" button below</p>
        </div>
      </div>
      <button
        onClick={loadPublishedBlogPosts}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mr-4"
      >
        Check for New Files
      </button>
      <button
        onClick={() => setShowBlogManager(true)}
        className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
      >
        Create Your First Post
        <ArrowRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  )}
  
  {publishedBlogPosts.length > 0 && (
    <div className="mt-12 text-center">
      <button
        onClick={() => setShowBlogManager(true)}
        className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
      >
        Manage Blog Posts
        <ArrowRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  )}
</div>

            {/* Comments Section with Next Button */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl mb-8">
              <h4 className="text-xl font-semibold mb-6">Leave a Feedback</h4>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <textarea
                  placeholder="Your Feedback"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={4}
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Submit 
                </button>
              </form>
              
              {/* Next Button */}
              <NextButton />
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
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
              
              <p className="hero-paragraph text-lg md:text-l text-gray-600 mb-10 leading-relaxed tracking-wide animate-elegant-slideUp" style={{ animationDelay: '0.2s' }}>
                This space holds my collection of work: stories, reflections, and the experiences that have shaped
                my 25-year journey in media and communications, including my most recent role as Head of TV at Kenya Television Network.
              </p>
              
              <p className="hero-paragraph text-lg md:text-l text-gray-600 mb-10 leading-relaxed tracking-wide animate-elegant-slideUp" style={{ animationDelay: '0.2s' }}>
                At its core, this is a space to connect freely, honor our shared humanity, and celebrate the power of stories. Whether through my podcast  , or th'What's Your Story Africa,' my writingse paths I've walked in media, I sincerely
                hope that you feel seen, heard, inspired, and elevated as we share our experiences with clarity and heart.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 animate-elegant-slideUp" style={{ animationDelay: '0.6s' }}>
                <a 
                  href="https://www.youtube.com/@WhatsYourStoryAfrica" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-full hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  Watch Latest Episodes
                </a>
                <button 
                  onClick={() => setCurrentView('connect')}
                  className="group inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-emerald-200 text-emerald-700 font-semibold rounded-full hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 hover:scale-105"
                >
                  Share Your Story
                  <ExternalLink className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
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
                    target.src = "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent rounded-3xl"></div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500 rounded-full opacity-20 animate-gentle-pulse"></div>
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-teal-500 rounded-full opacity-30 animate-float"></div>
              </div>
              <div className="hidden lg:block text-center mt-4">
                <p className="text-sm text-gray-600 font-medium"></p>
                <p className="text-xs text-gray-500">From the Heart of Africa – Preserved for Generations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Videos Section */}
      <section className="py-24 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12"></div>
          
          {videosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-xl h-52 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      <h3 className="text-base font-semibold text-gray-900 flex-1 pr-3 line-clamp-2 leading-tight">
                        {cleanName}
                      </h3>
                      <a 
                        href={video.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors text-sm font-medium whitespace-nowrap flex-shrink-0 ml-2"
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

          <div className="text-center mt-16">
            <a 
              href="https://www.youtube.com/@WhatsYourStoryAfrica" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105"
            >
              <Play className="w-4 h-4 mr-2" />
              View All Episodes on YouTube
            </a>
          </div>
        </div>
      </section>
    </div>
  );

  const renderBlogPost = (post: BlogPost) => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            <article className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/50 shadow-xl">
              {/* Thumbnail always at the top if present */}
              {post.thumbnail_url && (
                <div className="w-full h-64 md:h-80 overflow-hidden rounded-2xl mb-8">
                  <img 
                    src={post.thumbnail_url} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {post.title}
                </h1>
                <div className="flex items-center text-gray-600 text-sm space-x-4 mb-6">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{post.read_time}</span>
                </div>
                {post.excerpt && (
                  <p className="text-xl text-gray-600 leading-relaxed">
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
                    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: firstHalf.replace(/\n/g, '<br />') }} />
                    {post.images && post.images.length > 0 && (
                      <div className="my-8 flex justify-center">
                        <ImageCarousel images={post.images} />
                      </div>
                    )}
                    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: secondHalf.replace(/\n/g, '<br />') }} />
                  </>
                );
              })()}
              
              <div className="mt-12 mb-5 p-6 bg-gradient-to-br ">
                <p className="text-l text-black-700 leading-relaxed text-center mb-4">
                  Catherine's experience in media and communications spans 25 years, most recently as Head of TV at Kenya Television Network. Today, she pours her heart into What's Your Story Africa - a podcast that reminds us of the power within every human story.
                </p>
              </div>

              {/* Comments Section */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">Leave a Feedback</h4>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="email"
                    placeholder="Your Feedback"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <textarea
                    placeholder="Your Comment"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows={4}
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Submit
                  </button>
                </form>
              </div>

              {/* Next Button */}
              <NextButton />
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

  const renderConnect = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
           <div className="inline-flex items-center px-8 py-5 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full text-emerald-700 font-medium mb-8 animate-elegant-fadeIn text-sm tracking-wide">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-gentle-pulse"></span>
                Here are ways to connect with me. together, we go further.
              </div>

            {/* Three Green Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {/* Left Box - Forest Green */}
              <div className="bg-gradient-to-br from-[#228B22] to-[#1e6e1e] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-center h-full flex flex-col">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="bi bi-heart-fill text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Your Story Matters</h3>
                  <p className="text-white mb-6 flex-grow">
                    Your story is your greatest asset. Share it, or nominate someone you know.
                  </p>
                  <a
                    href="mailto:catherine@whatsyourstoryafrica.com?subject=Story Submission/Nomination"
                    className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 text-sm"
                  >
                    Inquire Here
                  </a>
                </div>
              </div>

              {/* Middle Box - Pine Green */}
              <div className="bg-gradient-to-br from-[#01796F] to-[#006d64] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-center h-full flex flex-col">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="bi bi-people-fill text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Join Our Community</h3>
                  <p className="text-white mb-6 flex-grow">
                    Would you like to receive the latest podcasts, newsletters, and upcoming events directly to your inbox?
                  </p>
                  <button
                    onClick={() => document.getElementById('newsletter-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 text-sm"
                  >
                    Count Me In
                  </button>
                </div>
              </div>

              {/* Right Box - Bottle Green */}
              <div className="bg-gradient-to-br from-[#006A4E] to-[#00563f] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-center h-full flex flex-col">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="bi bi-infinity  text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Let's Co-Create</h3>
                  <p className="text-white mb-6 flex-grow">
                    Would you like to explore partnership, investment or sponsorship opportunities? We're in the era of collaborations.
                  </p>
                  <a
                    href="mailto:partnerships@whatsyourstoryafrica.com?subject=Partnership Inquiry"
                    className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 text-sm"
                  >
                    Yes, Let's Partner!
                  </a>
                </div>
              </div>
            </div>

            {/* Newsletter Form Section */}
            <div id="newsletter-form" className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-20 border border-white/50 shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Stay Connected</h3>
                <p className="text-gray-600">Join our community and never miss an update</p>
              </div>
              <form className="max-w-md mx-auto space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300"
                >
                  Subscribe for Free
                </button>
              </form>
            </div>

            {/* Mentorship Section - ADDED ID */}
            <div id="mentorship-section" className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/50 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text--900 mb-4">
                  MENTORSHIP
                </h2>
                <p className="text-xl text-gray-600 italic">
                  Guiding Voices. Shaping Futures. Building Legacies.
                </p>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <p className="text-lg leading-relaxed">
                  Mentorship is not about copying a voice; it's about finding yours, refining it, and learning to share it powerfully with the world.
                </p>

                <p className="text-lg leading-relaxed">
                  For over two decades, I've lived at the heart of media; leading national conversations, moderating panels with Industry leaders, and interviewing people from all walks of life.
                </p>

                <p className="text-lg leading-relaxed">
                  As we restart our mentorship courses, I am especially interested in the young people who have just finished high school and are asking 'what next'.
                </p>

                <div className="text-center my-8">
                  <a
                    href="mailto:catherine@whatsyourstoryafrica.com?subject=Mentorship Inquiry"
                    className="inline-flex items-center px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105"
                  >
                    Reach Out
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </a>
                </div>

                <p className="text-lg leading-relaxed">
                  My other interest is in those who simply want someone to talk to. I cannot tell you how many people I have met, and all they want to do is talk to someone, without bias/judgment.
                </p>

                <div className="text-center my-8">
                  <a
                    href="https://calendly.com/catherine-wysa/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-all duration-300 hover:scale-105"
                  >
                    Book A Call
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </a>
                </div>
              </div>

              <div className="mt-12 text-center">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Ready to Begin Your Journey?</h4>
                  <p className="text-gray-600 mb-6">
                    Whether you're seeking guidance, collaboration, or simply a conversation, I'm here to listen and support your growth.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="mailto:catherine@whatsyourstoryafrica.com"
                      className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300"
                    >
                      Send Email
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                    <a
                      href="https://calendly.com/catherine-wysa/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-600 hover:text-white transition-all duration-300"
                    >
                      Schedule Call
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
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

  // Footer component
  const Footer = () => (
    <footer className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="text-center lg:text-left">
            <button 
              onClick={() => setCurrentView('catherine')} // Changed to 'catherine'
              className="flex items-center justify-center lg:justify-start"
            >
              <img 
                src="/img/logo/wysa-logo.png" 
                alt="What's Your Story Africa Logo" 
                className="h-20 w-auto max-w-[300px] object-contain transition-opacity duration-300 hover:opacity-80"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold !text-white mb-3">
              For Legacy & Posterity
            </h2>
            <p className="text-base text-white mb-4">
              Share Your Own Story
            </p>
            <button 
              onClick={() => setCurrentView('connect')}
              className="inline-flex items-center px-5 py-2.5 bg-white text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Get In Touch
              <ExternalLink className="w-5 h-5 ml-2" />
            </button>
          </div>

          <div className="flex items-center justify-center lg:justify-end space-x-4">
            <div className="flex items-center space-x-3">
              <a 
                href="https://linkedin.com/in/catherinemwangitv" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a 
                href="https://tiktok.com/@cathmwangi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
              >
                <i className="bi bi-tiktok"></i>
              </a>
              <a 
                href="https://facebook.com/CatherineMwangiKE" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a 
                href="https://instagram.com/cathmwangi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a 
                href="https://x.com/CathMwangi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
              >
                <i className="bi bi-twitter-x"></i>
              </a>
              <a 
                href="https://www.youtube.com/@WhatsYourStoryAfrica" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
              >
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );

  if (viewingBlogPost) {
    return (
      <div className="relative min-h-screen bg-white">
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              <button 
                onClick={() => setCurrentView('catherine')} // Changed to 'catherine'
                className="flex items-center"
              >
                <img 
                  src="/img/logo/wysa-logo.png" 
                  alt="What's Your Story Africa Logo" 
                  className="h-20 w-auto max-w-[300px] object-contain transition-opacity duration-300 hover:opacity-80"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </button>

              <div className="flex items-center space-x-8">
                <button 
                  onClick={() => setCurrentView('podcasts')} // Changed to 'podcasts'
                  className="font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Podcasts
                </button>
                <button 
                  onClick={() => setCurrentView('connect')}
                  className="font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Let's Connect
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="pt-20">
          {renderBlogPost(viewingBlogPost)}
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <button 
              onClick={() => setCurrentView('catherine')} // Changed to 'catherine'
              className="flex items-center"
            >
              <img 
                src="/img/logo/wysa-logo.png" 
                alt="What's Your Story Africa Logo" 
                className="h-20 w-auto max-w-[300px] object-contain transition-opacity duration-300 hover:opacity-80"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </button>

            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setCurrentView('catherine')}
                className={`font-medium transition-colors ${
                  currentView === 'catherine' 
                    ? 'text-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentView('podcasts')} // New Podcasts button
                className={`font-medium transition-colors ${
                  currentView === 'podcasts' 
                    ? 'text-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Podcasts
              </button>
              <button 
                onClick={() => setCurrentView('connect')}
                className={`font-medium transition-colors ${
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
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="px-6 py-4 space-y-4">
              <button 
                onClick={() => {
                  setCurrentView('catherine');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left font-medium transition-colors ${
                  currentView === 'catherine' 
                    ? 'text-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => {
                  setCurrentView('podcasts'); // New Podcasts button
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left font-medium transition-colors ${
                  currentView === 'podcasts' 
                    ? 'text-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Podcasts
              </button>
              <button 
                onClick={() => {
                  setCurrentView('connect');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left font-medium transition-colors ${
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

      <main className="pt-20">
        {currentView === 'catherine' && renderCatherine()}
        {currentView === 'podcasts' && renderPodcasts()}
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