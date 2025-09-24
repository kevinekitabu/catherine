import React, { useState, useEffect } from 'react';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Add a CSS class for social icon size
const socialIconClass = 'bi social-icon';

import { Play, ExternalLink, Menu, X, ArrowRight } from 'lucide-react';
import BlogManager from './components/BlogManager';
import { blogService, BlogPost } from './lib/supabase';
import { youtubeService, YouTubeVideo } from './lib/youtube';

// SidePanel Component
const SidePanel = ({ blogPosts, videos }: { blogPosts: BlogPost[], videos: YouTubeVideo[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [commentData, setCommentData] = useState({
    name: '',
    email: '',
    comment: ''
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle comment submission logic here
    console.log('Comment submitted:', commentData);
    // Reset form
    setCommentData({ name: '', email: '', comment: '' });
    alert('Thank you for your comment!');
  };

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full lg:w-80 space-y-8">
      {/* Search Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
        <div className="flex items-center mb-4">
          <i className="bi bi-search text-emerald-600 text-lg mr-3"></i>
          <h3 className="text-lg font-bold text-gray-900">Search</h3>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <i className="bi bi-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      {/* About Me Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
        <div className="flex items-center mb-4">
          <i className="bi bi-person-circle text-emerald-600 text-lg mr-3"></i>
          <h3 className="text-lg font-bold text-gray-900">About Catherine</h3>
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
          Media professional with 25+ years experience, former Head of TV at KTN, 
          and host of What's Your Story Africa podcast.
        </p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-full py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Read More
        </button>
      </div>

      {/* Recent Posts Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
        <div className="flex items-center mb-4">
          <i className="bi bi-file-earmark-text text-emerald-600 text-lg mr-3"></i>
          <h3 className="text-lg font-bold text-gray-900">Recent Posts</h3>
        </div>
        <div className="space-y-4">
          {filteredPosts.slice(0, 3).map((post, index) => (
            <div key={post.id} className="flex items-center space-x-3 group cursor-pointer">
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
          ))}
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
          <h3 className="text-lg font-bold text-gray-900">Leave a Comment</h3>
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
            value={commentData.comment}
            onChange={(e) => setCommentData({...commentData, comment: e.target.value})}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Submit Comment
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
  const [currentView, setCurrentView] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBlogManager, setShowBlogManager] = useState(false);
  const [publishedBlogPosts, setPublishedBlogPosts] = useState<BlogPost[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);

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
      console.log('🔄 Loading published blog posts...');
      // First, process any new files from storage
      await blogService.processBlogFromStorage();
      console.log('✅ Storage processing completed');
      // Then load published posts
      const posts = await blogService.getPublishedPosts();
      console.log('📚 Loaded posts with thumbnails:');
      posts.forEach((post, index) => {
        console.log(`  ${index}: "${post.title}" - thumbnail_url: ${post.thumbnail_url || 'null (will use default)'}`);
        // Test the specific URL you provided
        if (post.thumbnail_url === 'https://huknolxcluaeizvemtnb.supabase.co/storage/v1/object/public/blog-images/1757667632856-66w2e3wzevh.JPG') {
          console.log('🎯 Found the specific URL you mentioned!');
          // Test if we can fetch it
          fetch(post.thumbnail_url, { method: 'HEAD' })
            .then(response => {
              console.log('🌐 URL fetch test result:', response.status, response.statusText);
              console.log('📋 Response headers:', [...response.headers.entries()]);
            })
            .catch(error => {
              console.log('❌ URL fetch test failed:', error);
            });
        }
      });
      setPublishedBlogPosts(posts);
    } catch (error) {
      console.error('❌ Error loading blog posts:', error);
    }
  };

  const handleBlogPostClick = (post: BlogPost) => {
    setCurrentView(`blog-${post.slug}`);
  };

  const renderHome = () => (
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
              
              {/* Hero Title */}
              <div className="mb-6 animate-elegant-slideUp">
                <img 
                  src="/img/logo/story.jpeg"
                  alt="What's Your Story Africa Logo"
                  className="w-full max-w-md mx-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const textFallback = document.createElement('span');
                    textFallback.textContent = "What's Your Story Africa";
                    textFallback.className = "text-4xl md:text-6xl font-semibold leading-tight text-emerald-700";
                    target.parentNode?.appendChild(textFallback);
                  }}
                />
              </div>
              
              <p className="hero-paragraph text-lg md:text-l text-gray-600 mb-10 leading-relaxed tracking-wide animate-elegant-slideUp" style={{ animationDelay: '0.2s' }}>
                This space holds my collection of work: stories, reflections, and the experiences that have shaped
                my 25-year journey in media and communications, including my most recent role as Head of TV at Kenya Television Network.
              </p>
              
              <p className="hero-paragraph text-lg md:text-l text-gray-600 mb-10 leading-relaxed tracking-wide animate-elegant-slideUp" style={{ animationDelay: '0.2s' }}>
                At its core, this is a space to connect freely, honor our shared humanity, and celebrate the power of stories. Whether through my podcast What's Your Story Africa, my writings, or the paths I've walked in media, I sincerely
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
                <p className="text-sm text-gray-600 font-medium">Catherine</p>
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
          </div>

          {videosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-2xl h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {youtubeVideos.map((video) => (
                <div key={video.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-40 object-cover bg-gray-100 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 text-emerald-600 ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {video.guestName}
                      </h3>
                      <a 
                        href={video.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                      >
                        Watch Now
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a 
              href="https://www.youtube.com/@WhatsYourStoryAfrica" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-full hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Play className="w-5 h-5 mr-2" />
              View All Episodes
            </a>
          </div>
        </div>
      </section>
    </div>
  );

  const renderCatherine = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Catherine's Image - Centered */}
        <div className="flex justify-center items-center mb-16">
          <div className="w-full max-w-6xl animate-elegant-slideUp" style={{ animationDelay: '0.4s' }}>
            <div className="text-center mb-6">
              <p className="text-lg text-gray-700 font-medium"></p>
              <p className="text-sm text-gray-500">From the Heart of Africa – Preserved for Generations</p>
            </div>
            
            {/* Image Carousel */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
              <div className="flex animate-carousel space-x-6">
                {/* First set of images */}
                <div className="flex space-x-6 flex-shrink-0">
                  <img 
                    src="/img/catherine/IMG_3363.jpg"
                    alt="Catherine Mwangi speaking at an event"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                   <img 
                    src="/img/catherine/_TWL0019.JPG"
                    alt="Catherine Mwangi speaking at an event"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/DSC_0480.jpg"
                    alt="Catherine Mwangi in the studio"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/_TWL2723.JPG"
                    alt="Catherine Mwangi interviewing a guest"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/IMG_0013.JPG"
                    alt="Catherine Mwangi at a conference"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/sg-70.JPG"
                    alt="Catherine Mwangi with community leaders"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/20220622_103037.jpg"
                    alt="Catherine Mwangi behind the scenes"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/20220719_193352.jpg"
                    alt="Catherine Mwangi behind the scenes"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/_TWL0006.JPG"
                    alt="Catherine Mwangi behind the scenes"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/_TWL0019.JPG"
                    alt="Catherine Mwangi behind the scenes"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/_TWL2723.JPG"
                    alt="Catherine Mwangi behind the scenes"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/_TWL8636.JPG"
                    alt="Catherine Mwangi behind the scenes"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/_TWM0198.JPG"
                    alt="Catherine Mwangi behind the scenes"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/_TWM0760.JPG"
                    alt="Catherine Mwangi behind the scenes"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/DSC_0480.jpg"
                    alt="Catherine Mwangi behind the scenes"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/DSC_5436.JPG"
                    alt="Catherine Mwangi behind the scenes"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/IMG_20160613_093604.jpg"
                    alt="Catherine Mwangi behind the scenes"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/ktn-74.JPG"
                    alt="Catherine Mwangi behind the scenes"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/IMG-20220716-WA0066.jpg"
                    alt="Catherine Mwangi behind the scenes"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/IMG-20220715-WA0145.jpg"
                    alt="Catherine Mwangi behind the scenes"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                </div>
                {/* Duplicate set for seamless loop */}
                <div className="flex space-x-6 flex-shrink-0">
                  <img 
                    src="/img/catherine/catherine-1.jpg"
                    alt="Catherine Mwangi speaking at an event"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/catherine-2.jpg"
                    alt="Catherine Mwangi in the studio"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/catherine-3.jpg"
                    alt="Catherine Mwangi interviewing a guest"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/catherine-4.jpg"
                    alt="Catherine Mwangi at a conference"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/_TWLOO6.JPG"
                    alt="Catherine Mwangi with community leaders"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                  <img 
                    src="/img/catherine/catherine-6.jpg"
                    alt="Catherine Mwangi behind the scenes"
                    className="w-48 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400";
                    }}
                  />
                </div>
              </div>
              
              {/* Gradient overlays for smooth edges */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-emerald-50 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-teal-50 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
        
        {/* About Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-12 border border-white/50 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 leading-snug">About Catherine</h2>
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p className="text-lg md:text-l mb-6 leading-relaxed tracking-wide">
              For more than 25 years, my life has been woven into the fabric of storytelling. 
              My career in media began as an intern at Kenya Television Network (KTN). 
              Those early days laid the foundation for everything that followed: curiosity, resilience, 
              and a deep respect for the power of storytelling. Over the years, I explored different paths 
              across leading media houses in East Africa, honing my craft and expanding my understanding of
              how media shapes societies.
            </p>
            <p className="text-lg md:text-l mb-6 leading-relaxed tracking-wide">
              In 2013, I experienced a full-circle moment: returning to KTN as Head of TV, 
              exactly where my journey had begun. Storytelling, for me, has never been just a career; 
              it's a calling. Leading three television channels was both a privilege and a responsibility. 
              It meant curating content that informed and inspired, managing large teams of creatives and 
              on-screen talent, and making strategic decisions that impacted millions of viewers.
              More importantly, it meant mentoring hundreds of professionals, creating opportunities for thousands, 
              and leaving a legacy of excellence and purpose-driven storytelling.
            </p>
            <p className="text-lg md:text-l mb-6 leading-relaxed tracking-wide">
              My work has taken me beyond Kenya to global stages across Africa, the Middle East, and Europe, 
              where I have moderated high-level panels, conducted thought-provoking interviews, 
              and facilitated cross-cultural dialogues. These experiences affirmed for me that stories, 
              when told with authenticity, transcend borders and awaken our shared humanity. 
              Whether in front of the camera, behind it, or on international platforms, my focus has remained the same: 
              to create spaces where stories can be told with dignity and heard with empathy.
            </p>
            <p className="text-lg md:text-l mb-6 leading-relaxed tracking-wide">
              Today, I continue this mission through <strong>What's Your Story Africa</strong>, 
              a platform that began as a television show and has since evolved into a podcast and community.
            </p>
            <p className="text-lg md:text-l mb-6 leading-relaxed tracking-wide">
              Beyond the cameras, lights, and mics, I have dedicated myself to mentoring the next generation of storytellers and communicators. 
              Whether it's guiding young people finding their voice, equipping professionals with tools to speak with confidence, 
              or coaching TV presenters, podcasters, and leaders to sharpen their craft, I see mentorship as legacy work. 
              My goal is not just to prepare others for careers in media, but to help them step into their purpose, 
              so they can shape conversations and communities with clarity and courage.
            </p>
            <p className="text-lg md:text-l leading-relaxed tracking-wide">
              Alongside this, I have embraced life coaching as a way to walk with people through their personal journeys, 
              especially those navigating the defining years of 25–35, as well as parents who entrust me to mentor their teenage daughters. 
              Over the years, many have sought me out as a sounding board for life's transitions, 
              and I now honor that trust by offering structured coaching. 
              Whether through one-on-one sessions, organizational storytelling workshops, or the What's Your Story Africa community, 
              my mission is the same: restore dignity to storytelling, amplify unheard voices, 
              and help people step fully into their story — for legacy, for posterity, and for impact.
            </p>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Reflections</h2>
          {publishedBlogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        console.log('❌ Failed to load thumbnail:', post.thumbnail_url || 'no thumbnail_url');
                        console.log('📝 Post title:', post.title);
                        console.log('🔄 Falling back to default thumbnail');
                        target.src = getDefaultThumbnail(index);
                      }}
                      onLoad={() => {
                        if (post.thumbnail_url) {
                          console.log('✅ Successfully loaded custom thumbnail:', post.thumbnail_url);
                          console.log('📝 For post:', post.title);
                        } else {
                          console.log('✅ Successfully loaded default thumbnail for:', post.title);
                        }
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>{new Date(post.published_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                      <span className="mx-2">•</span>
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
                  <p>• Other fields auto-populate with defaults</p>
                  
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
                onClick={async () => {
                  try {
                    await blogService.syncThumbnailsFromStorage();
                    await loadPublishedBlogPosts();
                  } catch (error) {
                    console.error('Error syncing thumbnails:', error);
                  }
                }}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors mr-4"
              >
                Sync Thumbnails
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
          
          {/* Blog Management Button */}
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
      </div>
    </div>
  );

  const renderBlogPost = (post: BlogPost) => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <article className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/50 shadow-xl">
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
              <span>{new Date(post.published_date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              <span>•</span>
              <span>{post.read_time}</span>
            </div>
            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: post.content
                .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full rounded-lg shadow-lg my-6" />')
                .replace(/\n/g, '<br />')
            }}
          />
          {/* Blog Outro Section */}
          <div className="mt-12 mb-8 p-6 bg-gradient-to-br from-emerald-50 to-white/80 rounded-2xl border border-emerald-100 shadow">
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-4">
              Catherine's experience in media and communications spans 25 years, most recently as Head of TV at Kenya Television Network. Today, she pours her heart into What's Your Story Africa - a podcast that reminds us of the power within every human story.
            </p>
           
          </div>

              {/* Comments Section */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">Leave a Comment</h4>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
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

          {/* Side Panel for blog posts */}
          <div className="lg:col-span-1">
            <SidePanel blogPosts={publishedBlogPosts} videos={youtubeVideos} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderConnect = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Let's Connect
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a story to share or want to collaborate? I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Send Me Email */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="bi bi-envelope-fill text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Send Me Email</h3>
              <p className="text-emerald-100 mb-6">
                Have a story to share or want to collaborate? Reach out directly!
              </p>
              <p className="text-sm text-emerald-200 mb-6">
                catherine@whatsyourstoryafrica.com
              </p>
              <a
                href="mailto:catherine@whatsyourstoryafrica.com"
                className="block w-full px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                Send Email
              </a>
            </div>
          </div>

          {/* Column 2: Newsletter */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="bi bi-newspaper text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Newsletter</h3>
              <p className="text-blue-100 mb-6">
                Get the latest African stories and podcast episodes delivered to your inbox
              </p>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Column 3: Partnerships */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="bi bi-handshake text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Partnerships</h3>
              <p className="text-purple-100 mb-6">
                Partner with us to amplify your message to engaged African audiences
              </p>
              <ul className="text-left text-purple-100 space-y-2 mb-6">
                <li>• Podcast sponsorships</li>
                <li>• Content partnerships</li>
                <li>• Brand collaborations</li>
                <li>• Event partnerships</li>
              </ul>
              <a
                href="mailto:partnerships@whatsyourstoryafrica.com"
                className="block w-full px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                Partner With Us
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Social Media Links Row */}
      <div className="mt-16 flex flex-col items-center">
        <p className="text-xs text-gray-500 mb-3">Connect on Socials</p>
        <div className="flex items-center space-x-4">
          <a 
            href="https://linkedin.com/in/catherinemwangitv" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-9 h-9 bg-white/20 backdrop-blur-sm text-emerald-700 rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
            aria-label="Connect on LinkedIn"
            title="LinkedIn"
          >
            <i className="bi bi-linkedin"></i>
          </a>
          <a 
            href="https://tiktok.com/@cathmwangi" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-9 h-9 bg-white/20 backdrop-blur-sm text-emerald-700 rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
            aria-label="Follow on TikTok"
            title="TikTok"
          >
            <i className="bi bi-tiktok"></i>
          </a>
          <a 
            href="https://facebook.com/CatherineMwangiKE" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-9 h-9 bg-white/20 backdrop-blur-sm text-emerald-700 rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
            aria-label="Follow on Facebook"
            title="Facebook"
          >
            <i className="bi bi-facebook"></i>
          </a>
          <a 
            href="https://instagram.com/cathmwangi" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-9 h-9 bg-white/20 backdrop-blur-sm text-emerald-700 rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
            aria-label="Follow on Instagram"
            title="Instagram"
          >
            <i className="bi bi-instagram"></i>
          </a>
          <a 
            href="https://x.com/CathMwangi" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-9 h-9 bg-white/20 backdrop-blur-sm text-emerald-700 rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
            aria-label="Follow on X (Twitter)"
            title="X (Twitter)"
          >
            <i className="bi bi-twitter-x"></i>
          </a>
          <a 
            href="https://www.youtube.com/@WhatsYourStoryAfrica" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-9 h-9 bg-white/20 backdrop-blur-sm text-emerald-700 rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
            aria-label="Subscribe on YouTube"
            title="YouTube"
          >
            <i className="bi bi-youtube"></i>
          </a>
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
              onClick={() => setCurrentView('home')}
              className="flex items-center justify-center lg:justify-start"
            >
              <img 
                src="/img/logo/wysa-logo.png" 
                alt="What's Your Story Africa Logo" 
                className="h-16 w-auto max-w-[250px] object-contain transition-opacity duration-300 hover:opacity-80 brightness-0 invert"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const textFallback = document.createElement('span');
                  textFallback.textContent = "What's Your Story Africa";
                  textFallback.className = "text-lg font-bold text-white hover:text-emerald-100 transition-colors";
                  target.parentNode?.appendChild(textFallback);
                }}
              />
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              For Legacy & Posterity
            </h2>
            <p className="text-base text-emerald-100 mb-4">
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
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              <button 
                onClick={() => setCurrentView('home')}
                className="text-xl font-bold text-gray-900 hover:text-emerald-600 transition-colors"
              >
                What's Your Story Africa
              </button>
              <div className="flex items-center space-x-8">
                <button 
                  onClick={() => setCurrentView('catherine')}
                  className="font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  About Catherine
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
              onClick={() => setCurrentView('home')}
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
                About Catherine
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
                About Catherine
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
        {currentView === 'home' && renderHome()}
        {currentView === 'catherine' && renderCatherine()}
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