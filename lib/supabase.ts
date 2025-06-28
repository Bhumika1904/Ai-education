import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string
  email: string
  name: string
  learning_style: "visual" | "auditory" | "kinesthetic"
  difficulty_level: number
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  name: string
  description: string
  icon: string
  created_at: string
}

export interface Lesson {
  id: string
  subject_id: string
  title: string
  content: string
  difficulty_level: number
  learning_style: string
  estimated_duration: number
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  score: number | null
  time_spent: number | null
  completed_at: string | null
  created_at: string
}
