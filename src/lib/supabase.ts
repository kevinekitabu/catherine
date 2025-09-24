import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  slug: string;
  published_date: string;
  read_time?: string;
  tags?: string[];
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  thumbnail_url?: string;
  images?: Array<{
    id: string;
    url: string;
    alt: string;
    caption?: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

export const blogService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getAllBlogPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    console.log('🔄 Creating blog post with data:', post);
    console.log('📸 Thumbnail URL being saved:', post.thumbnail_url);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();
    
    if (error) {
      console.error(' Error creating blog post:', error);
      throw error;
    }
    
    console.log(' Blog post created successfully:', data);
    return data;
  },

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    console.log('🔄 Updating blog post with data:', updates);
    console.log('📸 Thumbnail URL being updated:', updates.thumbnail_url);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(' Error updating blog post:', error);
      throw error;
    }
    
    console.log(' Blog post updated successfully:', data);
    return data;
  },

  async deleteBlogPost(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getPublishedPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Storage-based blog management
  async uploadBlogFile(file: File): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('blog-files')
      .upload(fileName, file);
    
    if (error) throw error;
    return fileName;
  },

  async uploadBlogImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file);
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName);
    
    return publicUrl;
  },

  async deleteBlogImage(fileName: string): Promise<void> {
    const { error } = await supabase.storage
      .from('blog-images')
      .remove([fileName]);
    
    if (error) throw error;
  },
  async processBlogFromStorage(): Promise<void> {
    console.log('🔍 Starting storage processing...');
    try {
      // First, let's check if the blog_posts table exists
      const { data: tableCheck, error: tableError } = await supabase
        .from('blog_posts')
        .select('count')
        .limit(1);
      
      if (tableError) {
        console.error('❌ blog_posts table does not exist or is not accessible:', tableError);
        throw new Error('Database table blog_posts is not set up. Please run the migration first.');
      }
      
      console.log('✅ blog_posts table is accessible');
      
      // List all files in the blog-files bucket
      const { data: files, error: listError } = await supabase.storage
        .from('blog-files')
        .list();
      
      if (listError) {
        console.error('❌ Error listing files:', listError);
        throw listError;
      }
      
      console.log('📁 Found files:', files);
      
      for (const file of files || []) {
        console.log('📄 Processing file:', file.name);
        
        // Check if this file has already been processed
        const { data: existingPost } = await supabase
          .from('blog_posts')
          .select('id')
          .eq('slug', file.name.replace(/\.[^/.]+$/, ""))
          .single();
        
        console.log('🔍 Existing post check:', existingPost);
        
        if (!existingPost) {
          console.log('✨ Processing new file:', file.name);
          
          // Download and process the file
          const { data: fileData, error: downloadError } = await supabase.storage
            .from('blog-files')
            .download(file.name);
          
          if (downloadError) {
            console.error('❌ Error downloading file:', downloadError);
            continue;
          }
          
          const content = await fileData.text();
          console.log('📝 File content length:', content.length);
          
          const lines = content.split('\n');
          const title = lines[0]?.replace(/^#\s*/, '') || file.name.replace(/\.[^/.]+$/, "");
          const excerpt = lines.find(line => line.trim() && !line.startsWith('#'))?.substring(0, 200) || '';
          
          const blogPost = {
            title,
            content,
            excerpt,
            author: 'Catherine Mwangi',
            slug: file.name.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            published_date: new Date().toISOString().split('T')[0],
            read_time: `${Math.ceil(content.split(' ').length / 200)} min read`,
            tags: [],
            featured: false,
            status: 'published'
          };
          
          console.log('📝 Creating blog post:', blogPost);
          
          // Create blog post from file
          const createdPost = await this.createBlogPost(blogPost);
          console.log('✅ Created blog post:', createdPost);
          
          // Delete the processed file
          const { error: deleteError } = await supabase.storage
            .from('blog-files')
            .remove([file.name]);
            
          if (deleteError) {
            console.error('⚠️ Error deleting processed file:', deleteError);
          } else {
            console.log('🗑️ Deleted processed file:', file.name);
          }
        } else {
          console.log('⏭️ File already processed:', file.name);
        }
      }
      
      console.log('✅ Storage processing completed');
    } catch (error) {
      console.error('❌ Error processing blog files from storage:', error);
      throw error;
    }
  },

  // New function to sync thumbnails from storage
  async syncThumbnailsFromStorage(): Promise<void> {
    console.log('🖼️ Starting thumbnail sync from storage...');
    try {
      // Get all blog posts
      const { data: posts, error: postsError } = await supabase
        .from('blog_posts')
        .select('*');
      
      if (postsError) {
        console.error('❌ Error fetching blog posts:', postsError);
        throw postsError;
      }
      
      console.log(`📚 Found ${posts?.length || 0} blog posts`);
      
      // Get all images from blog-images bucket
      const { data: images, error: imagesError } = await supabase.storage
        .from('blog-images')
        .list();
      
      if (imagesError) {
        console.error('❌ Error listing images:', imagesError);
        console.log('💡 Make sure the blog-images bucket exists and is public');
        return;
      }
      
      console.log(`🖼️ Found ${images?.length || 0} images in storage`);
      
      if (!images || images.length === 0) {
        console.log('⚠️ No images found in blog-images bucket');
        return;
      }
      
      // For each post without a thumbnail, try to find a matching image
      for (const post of posts || []) {
        console.log(`🔍 Checking post: "${post.title}" - current thumbnail: ${post.thumbnail_url || 'null'}`);
        
        if (!post.thumbnail_url && images.length > 0) {
          // Just assign the first available image for now
          const imageToAssign = images[0];
          
          // Get the public URL for this image
          const { data: { publicUrl } } = supabase.storage
            .from('blog-images')
            .getPublicUrl(imageToAssign.name);
          
          console.log(`🖼️ Assigning thumbnail to "${post.title}": ${publicUrl}`);
          
          // Update the post with the thumbnail URL
          const { error: updateError } = await supabase
            .from('blog_posts')
            .update({ thumbnail_url: publicUrl })
            .eq('id', post.id);
          
          if (updateError) {
            console.error(`❌ Error updating thumbnail for "${post.title}":`, updateError);
            console.error('Full error:', updateError);
          } else {
            console.log(`✅ Updated thumbnail for "${post.title}"`);
            // Remove the assigned image from the list so each post gets a different one
            images.shift();
          }
        } else {
          console.log(`✅ Post "${post.title}" already has thumbnail or no images available`);
        }
      }
      
      console.log('✅ Thumbnail sync completed');
    } catch (error) {
      console.error('❌ Error syncing thumbnails:', error);
    }
  },

  // Function to manually assign a specific thumbnail to a post
  async assignThumbnailToPost(postId: string, imageName: string): Promise<void> {
    try {
      // Get the public URL for the image
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(imageName);
      
      // Update the post
      const { error } = await supabase
        .from('blog_posts')
        .update({ thumbnail_url: publicUrl })
        .eq('id', postId);
      
      if (error) throw error;
      
      console.log(`✅ Assigned thumbnail ${imageName} to post ${postId}`);
    } catch (error) {
      console.error('❌ Error assigning thumbnail:', error);
      throw error;
    }
  }
};