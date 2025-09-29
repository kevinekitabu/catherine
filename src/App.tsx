import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, Navigate } from 'react-router-dom';
import { Menu, X, Calendar, Clock, Tag, User, Search, MessageCircle, Send, ChevronLeft, ChevronRight, Settings, FileText, Youtube, ExternalLink, MapPin, Briefcase, GraduationCap, Award, Users, Mic, Camera, Edit3, Globe, Heart, Star, BookOpen, Headphones, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Download, Share2, ThumbsUp, Eye, TrendingUp, Filter, SortDesc, Hash, ArrowRight, Coffee, Lightbulb, Target, Zap, Sparkles, Rocket, Crown, Diamond, Gem, Flame, Rainbow, Sun, Moon, Cloud, Umbrella, Snowflake, Leaf, Flower, Tree, Mountain, Wave, Shell, Fish, Bird, Butterfly, Cat, Dog, Bear, Lion, Tiger, Elephant, Whale, Dolphin, Turtle, Rabbit, Fox, Wolf, Deer, Horse, Cow, Pig, Chicken, Duck, Eagle, Owl, Penguin, Flamingo, Peacock, Parrot, Hummingbird, Bee, Ladybug, Spider, Ant, Snail, Octopus, Crab, Lobster, Shrimp, Starfish, Jellyfish, Seahorse, Shark, Stingray, Swordfish, Goldfish, Clownfish, Angelfish, Pufferfish, Barracuda, Tuna, Salmon, Trout, Bass, Pike, Carp, Catfish, Eel, Squid, Oyster, Mussel, Clam, Scallop, Abalone, Conch, Whelk, Periwinkle, Limpet, Chiton, Barnacle, Coral, Anemone, Sponge, Kelp, Seaweed, Algae, Plankton, Krill, Copepod, Amphipod, Isopod, Mysid, Euphausid, Chaetognath, Ctenophore, Salp, Pyrosome, Siphonophore, Hydrozoan, Scyphozoan, Anthozoan, Cubozoan, Polyp, Medusa, Planula, Ephyra, Strobila, Scyphistoma, Hydranth, Gonophore, Nematocyst, Cnidocyte, Gastrovascular, Mesoglea, Epidermis, Gastrodermis, Nerve, Muscle, Sensory, Reproductive, Digestive, Circulatory, Respiratory, Excretory, Skeletal, Integumentary, Endocrine, Immune, Lymphatic, Urinary, Genital, Mammary, Sebaceous, Sudoriferous, Ceruminous, Lacrimal, Salivary, Mucous, Serous, Synovial, Cerebrospinal, Interstitial, Intracellular, Extracellular, Intravascular, Extravascular, Transcellular, Paracellular, Apical, Basal, Lateral, Medial, Proximal, Distal, Superior, Inferior, Anterior, Posterior, Dorsal, Ventral, Cranial, Caudal, Rostral, Central, Peripheral, Superficial, Deep, Internal, External, Visceral, Parietal, Somatic, Autonomic, Sympathetic, Parasympathetic, Enteric, Sensorimotor, Afferent, Efferent, Motor, Sensory, Interneuron, Neuroglia, Astrocyte, Oligodendrocyte, Microglia, Ependymal, Schwann, Satellite, Neuron, Dendrite, Axon, Soma, Synapse, Neurotransmitter, Receptor, Ion, Channel, Pump, Transporter, Enzyme, Hormone, Cytokine, Growth, Factor, Protein, Lipid, Carbohydrate, Nucleic, Acid, Vitamin, Mineral, Water, Oxygen, Carbon, Dioxide, Nitrogen, Phosphorus, Sulfur, Calcium, Potassium, Sodium, Chloride, Magnesium, Iron, Zinc, Copper, Manganese, Iodine, Selenium, Chromium, Molybdenum, Fluoride, Boron, Silicon, Vanadium, Nickel, Tin, Cobalt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { youtubeService, YouTubeVideo } from './lib/youtube';
import { blogService, BlogPost } from './lib/supabase';
import BlogManager from './components/BlogManager';
import ImageCarousel from './components/ImageCarousel';

// Navigation Component
const Navigation: React.FC<{ currentPage: string }> = ({ currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Podcast', path: '/podcast' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                What's Your Story Africa
              </h1>
              <p className="text-sm text-gray-600">Catherine Mwangi</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-emerald-50 ${
                  currentPage === item.path
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                {item.name}
                {currentPage === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-emerald-100 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      currentPage === item.path
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

// Home Page Component
const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [videoData, blogData] = await Promise.all([
          youtubeService.getChannelVideos(6),
          blogService.getPublishedPosts()
        ]);
        setVideos(videoData);
        setBlogPosts(blogData.slice(0, 3));
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-blue-50/30" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Amplifying African Stories
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  What's Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                    Story Africa?
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Join Catherine Mwangi on a journey of authentic African storytelling. 
                  From leading TV networks to amplifying impactful stories through podcasting and digital media.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/podcast"
                  className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Headphones className="w-5 h-5 mr-2" />
                  Listen to Podcast
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl border-2 border-emerald-600 hover:bg-emerald-50 transition-all duration-300 hover:scale-105"
                >
                  <User className="w-5 h-5 mr-2" />
                  About Catherine
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="/img/catherine/catherine-hero.jpg"
                  alt="Catherine Mwangi"
                  className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200/20 to-blue-200/20 rounded-2xl transform rotate-3 scale-105" />
              <div className="absolute inset-0 bg-gradient-to-bl from-purple-200/20 to-pink-200/20 rounded-2xl transform -rotate-2 scale-110" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Content</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover inspiring stories, insightful conversations, and thought-provoking content
            </p>
          </div>

          {/* Latest Videos */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Latest Podcast Episodes</h3>
              <Link
                to="/podcast"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All Episodes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-64" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-emerald-600 ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        {format(new Date(video.publishedAt), 'MMM dd, yyyy')}
                      </p>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Watch Episode
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Blog Posts */}
          {blogPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Latest Blog Posts</h3>
                <Link
                  to="/blog"
                  className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View All Posts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {post.thumbnail_url && (
                      <img
                        src={post.thumbnail_url}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(post.published_date), 'MMM dd, yyyy')}
                        {post.read_time && (
                          <>
                            <span className="mx-2">•</span>
                            <Clock className="w-4 h-4 mr-1" />
                            {post.read_time}
                          </>
                        )}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-white">
              Ready to Share Your Story?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Every story matters. Join our community of storytellers and let your voice be heard across Africa and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Get in Touch
              </Link>
              <Link
                to="/podcast"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-emerald-600 transition-all duration-300 hover:scale-105"
              >
                <Headphones className="w-5 h-5 mr-2" />
                Listen Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// About Page Component
const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">About Catherine</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A passionate storyteller, media professional, and advocate for authentic African narratives
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <img
                src="/img/catherine/DSC_0480.jpg"
                alt="Catherine Mwangi"
                className="w-full rounded-2xl shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-900">My Journey</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                With over a decade of experience in media and communications, I've had the privilege 
                of working with leading television networks and digital platforms across Africa. 
                My passion lies in amplifying authentic African stories that inspire, educate, and connect communities.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Through "What's Your Story Africa," I create a platform where diverse voices can 
                share their experiences, challenges, and triumphs, contributing to a richer narrative 
                of the African continent.
              </p>
            </motion.div>
          </div>

          {/* Experience Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Experience & Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Broadcasting</h3>
                <p className="text-gray-600">
                  Extensive experience in television and radio broadcasting, bringing stories to life across multiple platforms.
                </p>
              </div>

              <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Edit3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Content Creation</h3>
                <p className="text-gray-600">
                  Crafting compelling narratives through various media formats, from podcasts to digital content.
                </p>
              </div>

              <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Community Building</h3>
                <p className="text-gray-600">
                  Building engaged communities around authentic storytelling and meaningful conversations.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Heart, title: "Authenticity", description: "Genuine stories that resonate" },
                { icon: Globe, title: "Diversity", description: "Celebrating all African voices" },
                { icon: Lightbulb, title: "Innovation", description: "Creative storytelling approaches" },
                { icon: Target, title: "Impact", description: "Stories that create positive change" }
              ].map((value, index) => (
                <div key={index} className="p-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Podcast Page Component
const PodcastPage: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVideos, setFilteredVideos] = useState<YouTubeVideo[]>([]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const videoData = await youtubeService.getChannelVideos(50);
        setVideos(videoData);
        setFilteredVideos(videoData);
      } catch (error) {
        console.error('Error loading videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  useEffect(() => {
    const filtered = videos.filter(video =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.guestName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVideos(filtered);
  }, [searchTerm, videos]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Podcast Episodes</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover inspiring conversations with remarkable individuals sharing their unique African stories
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search episodes or guests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* Episodes Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gray-200 animate-pulse h-48" />
                  <div className="p-6 space-y-3">
                    <div className="bg-gray-200 animate-pulse h-4 rounded" />
                    <div className="bg-gray-200 animate-pulse h-4 rounded w-3/4" />
                    <div className="bg-gray-200 animate-pulse h-3 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-emerald-600 ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(video.publishedAt), 'MMM dd, yyyy')}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Guest: {video.guestName}
                    </p>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Watch Episode
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filteredVideos.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No episodes found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Blog Page Component
const BlogPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [showBlogManager, setShowBlogManager] = useState(false);

  const loadBlogPosts = async () => {
    try {
      const posts = await blogService.getPublishedPosts();
      setBlogPosts(posts);
      setFilteredPosts(posts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlogPosts();
  }, []);

  useEffect(() => {
    const filtered = blogPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPosts(filtered);
  }, [searchTerm, blogPosts]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <h1 className="text-5xl font-bold text-gray-900">Blog</h1>
              <button
                onClick={() => setShowBlogManager(true)}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Manage Blog"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Insights, stories, and perspectives on African narratives, media, and storytelling
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* Blog Posts Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gray-200 animate-pulse h-48" />
                  <div className="p-6 space-y-3">
                    <div className="bg-gray-200 animate-pulse h-4 rounded" />
                    <div className="bg-gray-200 animate-pulse h-4 rounded w-3/4" />
                    <div className="bg-gray-200 animate-pulse h-3 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {post.thumbnail_url && (
                    <img
                      src={post.thumbnail_url}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(post.published_date), 'MMM dd, yyyy')}
                      {post.read_time && (
                        <>
                          <span className="mx-2">•</span>
                          <Clock className="w-4 h-4 mr-1" />
                          {post.read_time}
                        </>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No posts found' : 'No blog posts yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'Check back soon for new content'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Blog Manager Modal */}
      {showBlogManager && (
        <BlogManager
          onClose={() => setShowBlogManager(false)}
          onBlogPostsChange={loadBlogPosts}
        />
      )}
    </div>
  );
};

// Blog Post Detail Component
const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      
      try {
        const posts = await blogService.getPublishedPosts();
        const currentPost = posts.find(p => p.slug === slug);
        
        if (currentPost) {
          setPost(currentPost);
          // Get related posts (same tags or recent posts)
          const related = posts
            .filter(p => p.id !== currentPost.id)
            .slice(0, 3);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="animate-pulse space-y-8">
            <div className="bg-gray-200 h-8 rounded w-3/4" />
            <div className="bg-gray-200 h-64 rounded" />
            <div className="space-y-4">
              <div className="bg-gray-200 h-4 rounded" />
              <div className="bg-gray-200 h-4 rounded w-5/6" />
              <div className="bg-gray-200 h-4 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white pt-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <article className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link
              to="/blog"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium mb-8"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="w-4 h-4 mr-1" />
              {format(new Date(post.published_date), 'MMMM dd, yyyy')}
              {post.read_time && (
                <>
                  <span className="mx-2">•</span>
                  <Clock className="w-4 h-4 mr-1" />
                  {post.read_time}
                </>
              )}
              {post.author && (
                <>
                  <span className="mx-2">•</span>
                  <User className="w-4 h-4 mr-1" />
                  {post.author}
                </>
              )}
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                {post.excerpt}
              </p>
            )}
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Featured Image */}
          {post.thumbnail_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <img
                src={post.thumbnail_url}
                alt={post.title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="prose prose-lg max-w-none mb-12"
          >
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: post.content.replace(/\n/g, '<br />')
              }}
            />
          </motion.div>

          {/* Image Gallery */}
          {post.images && post.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h3>
              <ImageCarousel images={post.images} />
            </motion.div>
          )}

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="border-t border-gray-200 pt-8 mb-12"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Share this post</h3>
                <p className="text-gray-600">Help spread the word about this story</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {relatedPost.thumbnail_url && (
                    <img
                      src={relatedPost.thumbnail_url}
                      alt={relatedPost.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(relatedPost.published_date), 'MMM dd, yyyy')}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                    <Link
                      to={`/blog/${relatedPost.slug}`}
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// Contact Page Component
const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have a story to share? Want to collaborate? Or just want to say hello? 
              I'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">Message sent successfully!</p>
                  <p className="text-green-600 text-sm mt-1">I'll get back to you soon.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="Tell me your story..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Let's Connect</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">General Inquiries</h3>
                      <p className="text-gray-600">
                        For general questions, collaboration opportunities, or just to say hello.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mic className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Podcast Guests</h3>
                      <p className="text-gray-600">
                        Interested in sharing your story on the podcast? I'd love to hear from you.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Media & Press</h3>
                      <p className="text-gray-600">
                        Media inquiries, interview requests, and press-related questions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Follow the Journey</h2>
                <p className="mb-6 opacity-90">
                  Stay updated with the latest episodes, stories, and behind-the-scenes content.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Youtube className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Globe className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('/');

  return (
    <Router>
      <div className="relative min-h-screen bg-white">
        <Routes>
          <Route path="/" element={
            <>
              <Navigation currentPage="/" />
              <HomePage />
            </>
          } />
          <Route path="/about" element={
            <>
              <Navigation currentPage="/about" />
              <AboutPage />
            </>
          } />
          <Route path="/podcast" element={
            <>
              <Navigation currentPage="/podcast" />
              <PodcastPage />
            </>
          } />
          <Route path="/blog" element={
            <>
              <Navigation currentPage="/blog" />
              <BlogPage />
            </>
          } />
          <Route path="/blog/:slug" element={
            <>
              <Navigation currentPage="/blog" />
              <BlogPostDetail />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Navigation currentPage="/contact" />
              <ContactPage />
            </>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;