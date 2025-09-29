/*
  # Create feedback system for blog posts and site

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key)
      - `blog_post_id` (uuid, foreign key to blog_posts, nullable for site feedback)
      - `name` (text, required)
      - `email` (text, required)
      - `message` (text, required)
      - `rating` (integer, 1-5, required)
      - `feedback_type` (text, 'site' or 'post', required)
      - `status` (text, 'pending', 'approved', 'rejected', default 'pending')
      - `created_at` (timestamp with timezone, default now())
      - `updated_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `feedback` table
    - Add policy for public to create feedback (INSERT)
    - Add policy for public to read approved feedback (SELECT)
    - Add policy for authenticated users to manage all feedback (ALL)

  3. Indexes
    - Index on blog_post_id for fast lookups
    - Index on status for filtering
    - Index on feedback_type for filtering
    - Index on created_at for ordering

  4. Triggers
    - Auto-update updated_at column on changes
*/

-- Drop table if it exists (to start fresh)
DROP TABLE IF EXISTS feedback CASCADE;

-- Create the feedback table
CREATE TABLE feedback (
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

-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
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

-- Create indexes for better performance
CREATE INDEX feedback_blog_post_id_idx ON feedback(blog_post_id);
CREATE INDEX feedback_status_idx ON feedback(status);
CREATE INDEX feedback_type_idx ON feedback(feedback_type);
CREATE INDEX feedback_created_at_idx ON feedback(created_at DESC);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some test data to verify everything works
INSERT INTO feedback (name, email, message, rating, feedback_type, status) VALUES
('Test User', 'test@example.com', 'This is a test site feedback', 5, 'site', 'approved'),
('Jane Doe', 'jane@example.com', 'Great website design!', 4, 'site', 'approved');

-- Verify the table was created successfully
SELECT 'Feedback table created successfully!' as result;
SELECT COUNT(*) as test_records_count FROM feedback;