/*
  # Add thumbnail_url column to blog_posts table

  1. Changes
    - Add `thumbnail_url` column to `blog_posts` table if it doesn't exist
    - Add `images` jsonb column for storing multiple images
    - Ensure columns have proper defaults

  2. Notes
    - Uses IF NOT EXISTS to prevent errors if columns already exist
    - Safe to run multiple times
*/

-- Add thumbnail_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'thumbnail_url'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN thumbnail_url text;
  END IF;
END $$;

-- Add images column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'images'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN images jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;