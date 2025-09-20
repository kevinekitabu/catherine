/*
  # Add image support to blog posts

  1. Schema Changes
    - Add `thumbnail_url` column for blog post thumbnails
    - Add `images` JSONB column to store multiple images with metadata
    - Update RLS policies to handle image fields

  2. Storage Setup
    - Instructions for creating blog-images bucket
    - Public access for image serving
*/

-- Add image columns to blog_posts table
DO $$
BEGIN
  -- Add thumbnail_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'thumbnail_url'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN thumbnail_url text;
  END IF;

  -- Add images JSONB column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'images'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN images jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Create blog-images storage bucket (run this in Supabase Dashboard if bucket doesn't exist)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- RLS policies for image access
CREATE POLICY "Anyone can view blog images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update blog images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images');