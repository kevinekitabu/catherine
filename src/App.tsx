import React, { useState, useEffect } from 'react';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
// Add a CSS class for social icon size
const socialIconClass = 'bi social-icon';

import { Play, ExternalLink, Menu, X, ArrowRight } from 'lucide-react';
import BlogManager from './components/BlogManager';
import { blogService, BlogPost } from './lib/supabase';
import { youtubeService, YouTubeVideo } from './lib/youtube';

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
        const videos = await youtubeService.getChannelVideos(9); // Get all 9 videos
        setYoutubeVideos(videos);
      } catch (error) {
        console.error('Error loading YouTube videos:', error);
        // Fallback videos will be used automatically
        setYoutubeVideos(youtubeService.getFallbackVideos());
      } finally {
        setVideosLoading(false);
      }
    };

    loadYouTubeVideos();
    loadPublishedBlogPosts(); // Load blog posts on app start
  }, []);

  // Load YouTube videos on component mount
  useEffect(() => {
    const loadYouTubeVideos = async () => {
      try {
        setVideosLoading(true);
        const videos = await youtubeService.getChannelVideos(12); // Get latest 12 videos
        setYoutubeVideos(videos);
      } catch (error) {
        console.error('Error loading YouTube videos:', error);
        // Fallback videos will be used automatically
        setYoutubeVideos(youtubeService.getFallbackVideos());
      } finally {
        setVideosLoading(false);
      }
    };

    loadYouTubeVideos();
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

  const renderHome = () => (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full text-emerald-700 font-medium mb-8 animate-elegant-fadeIn">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-gentle-pulse"></span>
                The Storytelling Gateway to Africa
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-elegant-slideUp">
                
                <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                  What's Your Story Africa
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed animate-elegant-slideUp" style={{ animationDelay: '0.2s' }}>
                Join Catherine Mwangi on a transformative journey through authentic African narratives. 
                From boardrooms to communities, we amplify the voices that shape our continent's future.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 animate-elegant-slideUp" style={{ animationDelay: '0.6s' }}>
                <a 
                  href="https://www.youtube.com/@WhatsYourStoryAfrica" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-full hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
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

            {/* Right Image - Catherine's Photo */}
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
                    // Fallback to Pexels image if local image not found
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

      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Logo */}
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

            {/* Main Content - Center */}
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

            {/* Social Media Links */}
            <div className="flex items-center justify-center lg:justify-end space-x-4">
              <div className="text-center lg:text-right mb-4 lg:mb-0">
                <p className="text-xs text-emerald-100 mb-2"></p>
              </div>
              <div className="flex items-center space-x-3">
                <a 
                  href="https://linkedin.com/in/catherinemwangitv" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
                  aria-label="Connect on LinkedIn"
                  title="LinkedIn"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
                <a 
                  href="https://tiktok.com/@cathmwangi" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
                  aria-label="Follow on TikTok"
                  title="TikTok"
                >
                  <i className="bi bi-tiktok"></i>
                </a>
                <a 
                  href="https://facebook.com/CatherineMwangiKE" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
                  aria-label="Follow on Facebook"
                  title="Facebook"
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a 
                  href="https://instagram.com/cathmwangi" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
                  aria-label="Follow on Instagram"
                  title="Instagram"
                >
                  <i className="bi bi-instagram"></i>
                </a>
                <a 
                  href="https://x.com/CathMwangi" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
                  aria-label="Follow on X (Twitter)"
                  title="X (Twitter)"
                >
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a 
                  href="https://www.youtube.com/@WhatsYourStoryAfrica" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 social-icon"
                  aria-label="Subscribe on YouTube"
                  title="YouTube"
                >
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>
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
                    src="/img/catherine/catherine-5.jpg"
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
                    src="/img/catherine/catherine-5.jpg"
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About Catherine</h2>
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p className="mb-6">
              Catherine Mwangi is a seasoned media professional with over a decade of experience in television, 
              digital media, and storytelling. Her journey from leading TV networks to creating impactful 
              podcasts has been driven by a passion for amplifying authentic African narratives.
            </p>
            <p className="mb-6">
              Through "What's Your Story Africa," Catherine creates a platform where diverse voices across 
              the continent can share their experiences, challenges, and triumphs. Her work focuses on 
              highlighting stories that inspire, educate, and drive positive change in communities.
            </p>
            <p>
              With a background in journalism and digital content creation, Catherine brings a unique 
              perspective to storytelling that bridges traditional media with modern digital platforms, 
              ensuring African stories reach global audiences.
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
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              If this blog resonated with you, share your thoughts, reflections, or lived experiences in the comments or reach out directly; I believe every story has the power to teach and inspire. And if you'd like to share your journey, I'd be honored to host you on our Podcast What's Your Story Africa. Simply leave your details on the contact page. Together, let's inspire change and remind the world of the power of stories well told - now and for generations to come.
            </p>
          </div>
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <button
              onClick={() => setCurrentView('catherine')}
              className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              ← Back to Catherine Mwangi
            </button>
          </footer>
        </article>
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

  const handleBlogPostClick = (post: BlogPost) => {
    setCurrentView(`blog-${post.slug}`);
  };

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
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* Custom Cursor */}
      <div 
        className="fixed w-4 h-4 bg-emerald-500 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-150 ease-out"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transform: 'scale(1)',
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
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
                  const textFallback = document.createElement('span');
                  textFallback.textContent = "What's Your Story Africa";
                  textFallback.className = "text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors";
                  target.parentNode?.appendChild(textFallback);
                }}
              />
            </button>

            {/* Desktop Navigation */}
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

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-emerald-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
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

      {/* Main Content */}
      <main className="pt-20">
        {currentView === 'home' && renderHome()}
        {currentView === 'catherine' && renderCatherine()}
        {currentView === 'connect' && renderConnect()}
      </main>
      
      {/* Blog Manager Modal */}
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