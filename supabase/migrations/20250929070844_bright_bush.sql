/*
  # Create feedback system for blog posts

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key)
      - `blog_post_id` (uuid, foreign key to blog_posts, nullable for site feedback)
      - `name` (text, user's name)
      - `email` (text, user's email)
      - `message` (text, feedback content)
      - `rating` (integer, 1-5 stars)
      - `feedback_type` (text, 'site' or 'post')
      - `status` (text, 'pending', 'approved', 'rejected')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `feedback` table
    - Add policy for public to create feedback
    - Add policy for public to read approved feedback
    - Add policy for authenticated users to manage all feedback

  3. Functions
    - Add trigger to update `updated_at` timestamp
*/

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback_type text NOT NULL CHECK (feedback_type IN ('site', 'post')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create feedback"
  ON feedback
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read approved feedback"
  ON feedback
  FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Authenticated users can manage all feedback"
  ON feedback
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_blog_post_id ON feedback(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);