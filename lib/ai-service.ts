import { google } from "@ai-sdk/google"
import { generateText, generateObject } from "ai"
import { z } from "zod"

// Schema for lesson generation
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

export class AIEducationService {
  // Generate personalized lesson content
  static async generateLesson(
    subject: string,
    topic: string,
    learningStyle: "visual" | "auditory" | "kinesthetic",
    difficultyLevel: number,
  ) {
    const prompt = `Create an educational lesson about ${topic} in ${subject} for a ${learningStyle} learner at difficulty level ${difficultyLevel} (1-5 scale).

Learning Style Guidelines:
- Visual: Include diagrams, charts, visual examples, step-by-step breakdowns
- Auditory: Include verbal explanations, discussions, audio cues, rhythmic patterns
- Kinesthetic: Include hands-on activities, physical examples, interactive elements

Difficulty Level ${difficultyLevel}:
${
  difficultyLevel === 1
    ? "Beginner - Basic concepts with simple examples"
    : difficultyLevel === 2
      ? "Elementary - Fundamental concepts with guided practice"
      : difficultyLevel === 3
        ? "Intermediate - Standard concepts with moderate complexity"
        : difficultyLevel === 4
          ? "Advanced - Complex concepts with challenging applications"
          : "Expert - Sophisticated concepts with real-world applications"
}

Create a comprehensive lesson with 3-5 multiple choice exercises.`

    try {
      const result = await generateObject({
        model: google("gemini-2.0-flash"),
        schema: LessonSchema,
        prompt,
      })

      return result.object
    } catch (error) {
      console.error("Error generating lesson:", error)
      throw new Error("Failed to generate lesson content")
    }
  }

  // Analyze user performance and provide recommendations
  static async analyzePerformance(userProgress: any[], currentDifficulty: number) {
    const prompt = `Analyze this student's learning progress and provide recommendations:

Progress Data: ${JSON.stringify(userProgress)}
Current Difficulty Level: ${currentDifficulty}

Provide analysis on:
1. Learning patterns and strengths
2. Areas needing improvement
3. Recommended next steps
4. Difficulty adjustment suggestions
5. Study schedule recommendations`

    try {
      const result = await generateText({
        model: google("gemini-2.0-flash"),
        prompt,
      })

      return result.text
    } catch (error) {
      console.error("Error analyzing performance:", error)
      throw new Error("Failed to analyze performance")
    }
  }

  // Generate personalized study plan
  static async generateStudyPlan(
    subjects: string[],
    learningStyle: string,
    availableTime: number, // minutes per day
    goals: string[],
  ) {
    const prompt = `Create a personalized study plan for a ${learningStyle} learner with ${availableTime} minutes available per day.

Subjects to cover: ${subjects.join(", ")}
Learning goals: ${goals.join(", ")}

Create a weekly study schedule with:
1. Daily time allocation for each subject
2. Specific learning activities suited for ${learningStyle} learning
3. Progress milestones
4. Review and assessment periods`

    try {
      const result = await generateText({
        model: google("gemini-2.0-flash"),
        prompt,
      })

      return result.text
    } catch (error) {
      console.error("Error generating study plan:", error)
      throw new Error("Failed to generate study plan")
    }
  }
}
