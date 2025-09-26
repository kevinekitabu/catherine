import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Save, Eye, EyeOff, Upload, Image, Trash } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import { blogService, BlogPost } from '../lib/supabase';

interface BlogManagerProps {
  onClose: () => void;
  onBlogPostsChange: () => void;
}

const BlogManager: React.FC<BlogManagerProps> = ({ onClose, onBlogPostsChange }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    tags: '',
    //read_time: '5 min read',
    status: 'draft' as 'draft' | 'published',
    featured: false,
    thumbnail_url: ''
  });
  const [formError, setFormError] = useState('');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [blogImages, setBlogImages] = useState<Array<{id: string, url: string, alt: string, caption?: string}>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load blog posts when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadBlogPosts();
    }
  }, [isAuthenticated]);

  const loadBlogPosts = async () => {
    try {
      const posts = await blogService.getAllBlogPosts();
      setBlogPosts(posts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    try {
      await blogService.signIn(email, password);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Auth error:', error);
      setAuthError('Invalid login credentials. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      slug: '',
      tags: '',
     // read_time: '5 min read',
      status: 'draft',
      featured: false,
      thumbnail_url: ''
    });
    setBlogImages([]);
    setShowForm(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      slug: post.slug,
      tags: post.tags?.join(', ') || '',
     // read_time: post.read_time || '5 min read',
      status: post.status as 'draft' | 'published',
      featured: post.featured || false,
      thumbnail_url: post.thumbnail_url || ''
    });
    setBlogImages(post.images || []);
    setShowForm(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      await blogService.deleteBlogPost(postId);
      await loadBlogPosts();
      onBlogPostsChange();
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  // Ref to textarea for cursor position
  const contentTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleImageUpload = async (file: File, isThumbnail: boolean) => {
    setUploadingImage(true);
    try {
      const imageUrl = await blogService.uploadBlogImage(file);
      if (isThumbnail) {
        setFormData(prev => ({ ...prev, thumbnail_url: imageUrl }));
      } else {
        const imageId = Date.now().toString();
        const newImage = {
          id: imageId,
          url: imageUrl,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          caption: ''
        };
        setBlogImages(prev => [...prev, newImage]);
        // Insert at cursor position
        const imageMarkdown = `\n\n![${newImage.alt}](${imageUrl})\n\n`;
        setFormData(prev => {
          const textarea = contentTextareaRef.current;
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const before = prev.content.slice(0, start);
            const after = prev.content.slice(end);
            // Set new content and move cursor after inserted image
            setTimeout(() => {
              textarea.focus();
              textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
            }, 0);
            return {
              ...prev,
              content: before + imageMarkdown + after
            };
          } else {
            // fallback: append to end
            return {
              ...prev,
              content: prev.content + imageMarkdown
            };
          }
        });
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      if (error.message && error.message.includes('Bucket not found')) {
        setFormError('Storage bucket not found. Please create a "blog-images" bucket in your Supabase Storage dashboard first.');
      } else {
        setFormError('Failed to upload image. Please try again.');
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setBlogImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setFormError('Title and content are required');
      setIsSubmitting(false);
      return;
    }

    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim(),
        slug: formData.slug.trim(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
       // read_time: formData.read_time,
        status: formData.status,
        featured: formData.featured,
        thumbnail_url: formData.thumbnail_url || undefined,
        images: blogImages,
        published_date: new Date().toISOString(), 
      };

      if (editingPost) {
        await blogService.updateBlogPost(editingPost.id, postData);
      } else {
        await blogService.createBlogPost(postData);
      }

      setShowForm(false);
      await loadBlogPosts();
      onBlogPostsChange();
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      setFormError(error.message || 'Failed to save blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Super Admin Login</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Setup Instructions */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">First Time Setup?</h3>
            <p className="text-sm text-blue-700">
              Create a user account in your Supabase project's Authentication section first, 
              then use those credentials here.
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">Authentication Failed</p>
                <p className="text-sm text-red-600 mt-1">{authError}</p>
                <p className="text-sm text-red-600 mt-2">
                  Make sure you've created a user in your Supabase Authentication dashboard first.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Blog Manager</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {!showForm ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">All Blog Posts</h3>
                <button
                  onClick={handleCreatePost}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Post
                </button>
              </div>

              {blogPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No blog posts yet.</p>
                  <button
                    onClick={handleCreatePost}
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Post
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{post.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              post.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {post.status}
                            </span>
                            {post.featured && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{post.excerpt}</p>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span>{new Date(post.published_date).toLocaleDateString()}</span>
                            <span>{post.read_time}</span>
                            <span>{post.tags?.length || 0} tags</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Enter blog post title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="url-friendly-slug"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="Brief description of the blog post"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image
                  </label>
                  <div className="mb-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Setup Required:</strong> Create a "blog-images" bucket in your Supabase Storage dashboard first.
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {formData.thumbnail_url ? (
                      <div className="relative">
                        <img 
                          src={formData.thumbnail_url} 
                          alt="Thumbnail" 
                          className="w-32 h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, thumbnail_url: '' }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, true);
                        }}
                        className="hidden"
                      />
                      <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingImage ? 'Uploading...' : 'Upload Thumbnail'}
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <div className="mb-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, false);
                        }}
                        className="hidden"
                      />
                      <div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-lg hover:bg-emerald-200 transition-colors">
                        <Image className="w-4 h-4 mr-1" />
                        Add Image
                      </div>
                    </label>
                  </div>
                  <textarea
                    ref={contentTextareaRef}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="Write your blog post content here... Use markdown syntax for formatting. Images will be inserted automatically when uploaded."
                    required
                  />
                </div>

                {blogImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Uploaded Images
                    </label>
                    <div className="mb-4">
                      {/* Carousel for up to 3 images */}
                      <ImageCarousel images={blogImages} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {blogImages.map((image) => (
                        <div key={image.id} className="relative">
                          <img 
                            src={image.url} 
                            alt={image.alt}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(image.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Read Time
                    </label>
                    <input
                      type="text"
                     // value={formData.read_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, read_time: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="5 min read"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                    Featured Post
                  </label>
                </div>

                {formError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{formError}</p>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {isSubmitting ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogManager;