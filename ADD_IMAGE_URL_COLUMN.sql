-- Add image_url column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Drop existing function to recreate with new return type
DROP FUNCTION IF EXISTS search_posts(text);

-- Create new search_posts function with image_url
CREATE FUNCTION search_posts(search_query TEXT)
RETURNS TABLE(
  id UUID,
  author_id UUID,
  title TEXT,
  slug TEXT,
  content TEXT,
  excerpt TEXT,
  image_url TEXT,
  status TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  display_name TEXT,
  avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.author_id,
    p.title,
    p.slug,
    p.content,
    p.excerpt,
    p.image_url,
    p.status,
    p.published_at,
    p.created_at,
    p.updated_at,
    pr.display_name,
    pr.avatar_url
  FROM posts p
  LEFT JOIN profiles pr ON p.author_id = pr.id
  WHERE p.status = 'published'
    AND (
      p.title ILIKE '%' || search_query || '%'
      OR p.excerpt ILIKE '%' || search_query || '%'
      OR p.content ILIKE '%' || search_query || '%'
    )
  ORDER BY
    CASE WHEN p.title ILIKE search_query THEN 0 ELSE 1 END,
    p.published_at DESC;
END;
$$ LANGUAGE plpgsql;
