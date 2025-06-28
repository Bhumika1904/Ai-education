-- Users table for authentication and profiles
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  learning_style VARCHAR(50) DEFAULT 'visual',
  difficulty_level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subjects table
CREATE TABLE subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lessons table
CREATE TABLE lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  difficulty_level INTEGER NOT NULL,
  learning_style VARCHAR(50) NOT NULL,
  estimated_duration INTEGER, -- in minutes
  created_at TIMESTAMP DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  lesson_id UUID REFERENCES lessons(id),
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  time_spent INTEGER, -- in seconds
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Learning analytics
CREATE TABLE learning_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  session_duration INTEGER,
  lessons_completed INTEGER,
  average_score DECIMAL(5,2),
  learning_streak INTEGER,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample subjects
INSERT INTO subjects (name, description, icon) VALUES
('Mathematics', 'Learn fundamental and advanced mathematical concepts', 'calculator'),
('Science', 'Explore physics, chemistry, and biology', 'microscope'),
('Programming', 'Master coding and software development', 'code'),
('Language Arts', 'Improve reading, writing, and communication skills', 'book-open');
