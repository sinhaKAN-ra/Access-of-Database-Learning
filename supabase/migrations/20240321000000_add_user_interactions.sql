-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    database_id UUID REFERENCES databases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    database_id UUID REFERENCES databases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(database_id, user_id)
);

-- Create user_submitted_use_cases table
CREATE TABLE IF NOT EXISTS user_submitted_use_cases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    database_id UUID REFERENCES databases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_submitted_use_cases ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Anyone can view comments"
    ON comments FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create comments"
    ON comments FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their own comments"
    ON comments FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
    ON comments FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Ratings policies
CREATE POLICY "Anyone can view ratings"
    ON ratings FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create ratings"
    ON ratings FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their own ratings"
    ON ratings FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Use cases policies
CREATE POLICY "Anyone can view approved use cases"
    ON user_submitted_use_cases FOR SELECT
    USING (status = 'approved');

CREATE POLICY "Authenticated users can submit use cases"
    ON user_submitted_use_cases FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their own use cases"
    ON user_submitted_use_cases FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create functions to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at
    BEFORE UPDATE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_use_cases_updated_at
    BEFORE UPDATE ON user_submitted_use_cases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 