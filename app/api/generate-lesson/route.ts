import { type NextRequest, NextResponse } from "next/server"
import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"

const LessonSchema = z.object({
  title: z.string(),
  content: z.string(),
  keyPoints: z.array(z.string()),
  exercises: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      correctAnswer: z.number(),
      explanation: z.string(),
    }),
  ),
})

export async function POST(request: NextRequest) {
  try {
    const { subject, topic, learningStyle, difficultyLevel } = await request.json()

    if (!subject || !topic || !learningStyle || !difficultyLevel) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const prompt = `Create an educational lesson about ${topic} in ${subject} for a ${learningStyle} learner at difficulty level ${difficultyLevel}.

Learning Style Guidelines:
- Visual: Include diagrams, charts, visual examples, step-by-step breakdowns
- Auditory: Include verbal explanations, discussions, audio cues, rhythmic patterns
- Kinesthetic: Include hands-on activities, physical examples, interactive elements

Create a comprehensive lesson with 3-5 multiple choice exercises.`

    const result = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: LessonSchema,
      prompt,
    })

    return NextResponse.json({ lesson: result.object })
  } catch (error) {
    console.error("Error generating lesson:", error)
    return NextResponse.json({ error: "Failed to generate lesson" }, { status: 500 })
  }
}
