import { type NextRequest, NextResponse } from "next/server"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user progress data
    const { data: userProgress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)

    // Get user profile
    const { data: userProfile } = await supabase.from("users").select("difficulty_level").eq("id", userId).single()

    const prompt = `Analyze this student's learning progress and provide recommendations:

Progress Data: ${JSON.stringify(userProgress)}
Current Difficulty Level: ${userProfile?.difficulty_level || 1}

Provide analysis on:
1. Learning patterns and strengths
2. Areas needing improvement
3. Recommended next steps
4. Difficulty adjustment suggestions
5. Study schedule recommendations`

    const result = await generateText({
      model: google("gemini-2.0-flash"),
      prompt,
    })

    return NextResponse.json({ analysis: result.text })
  } catch (error) {
    console.error("Error analyzing performance:", error)
    return NextResponse.json({ error: "Failed to analyze performance" }, { status: 500 })
  }
}
