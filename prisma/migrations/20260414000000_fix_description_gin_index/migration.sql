-- Drop the btree index on description (too large for btree)
DROP INDEX IF EXISTS "description_search_idx";

-- Create a GIN index for full-text search on description
CREATE INDEX "description_search_idx" ON "Vacancy" USING GIN (to_tsvector('russian', COALESCE("description", '')));
