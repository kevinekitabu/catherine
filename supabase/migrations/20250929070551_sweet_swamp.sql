/*
  # Create feedback system for blog posts

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key)
      - `blog_post_id` (uuid, foreign key to blog_posts, nullable for site feedback)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `rating` (integer, 1-5 scale)
      - `feedback_type` (text, 'site' or 'post')
      - `status` (text, 'pending', 'approved', 'rejected')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `feedback` table
    - Add policy for public to create feedback
    - Add policy for authenticated users to read all feedback
    - Add policy for public to read approved feedback

  3. Indexes
    - Index on blog_post_id for faster queries
    - Index on feedback_type for filtering
    - Index on status for moderation
*/

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  feedback_type text NOT NULL DEFAULT 'site' CHECK (feedback_type IN ('site', 'post')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can create feedback"
  ON feedback
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can read approved feedback"
  ON feedback
  FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Authenticated users can read all feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update feedback status"
  ON feedback
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_feedback_blog_post_id ON feedback(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_feedback_updated_at();