"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Brain, ArrowRight, RotateCcw, ArrowLeft, Sparkles } from "lucide-react"

interface Exercise {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface LessonContent {
  title: string
  content: string
  keyPoints: string[]
  exercises: Exercise[]
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()

  const [lesson, setLesson] = useState<LessonContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<"generate" | "learn" | "exercise" | "complete">("generate")
  const [currentExercise, setCurrentExercise] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const subjectSlug = params.subject as string
  const topicSlug = params.topic as string

  const subjectName =
    subjectSlug
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "Subject"

  const topicName =
    topicSlug
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "Topic"

  const handleBackToTopics = () => {
    router.push(`/learn/${subjectSlug}`)
  }

  const generateLesson = async () => {
    setLoading(true)

    try {
      // For now, let's use mock data since API might not be working
      // You can replace this with real API call later
      await new Promise((resolve) => setTimeout(resolve, 3000)) // Simulate API call

      const mockLesson: LessonContent = {
        title: `${topicName} in ${subjectName}`,
        content: `Welcome to your personalized lesson on ${topicName}!

${topicName} is a fundamental concept in ${subjectName} that forms the building blocks for more advanced topics.

In this lesson, you'll learn:
• Core concepts and terminology
• Practical applications and examples  
• Step-by-step problem-solving approaches
• Real-world use cases

Let's start with the basics and build your understanding progressively. This content is tailored for visual learners with interactive examples and clear explanations.

Key Concept: ${topicName} involves understanding how different elements work together to create solutions. Think of it like building blocks - each piece has a specific purpose and fits together in a logical way.

Example: When learning ${topicName}, it's important to start with simple examples and gradually work up to more complex scenarios. This helps build confidence and ensures a solid foundation.`,

        keyPoints: [
          `${topicName} is essential for understanding ${subjectName}`,
          "Break complex problems into smaller, manageable parts",
          "Practice with real examples to reinforce learning",
          "Apply logical thinking and step-by-step approaches",
          "Build confidence through hands-on practice",
        ],

        exercises: [
          {
            question: `What is the main purpose of ${topicName} in ${subjectName}?`,
            options: [
              "To make things more complicated",
              "To break down complex problems into manageable parts",
              "To avoid using logic",
              "To memorize facts without understanding",
            ],
            correctAnswer: 1,
            explanation: `${topicName} helps us break down complex problems into smaller, more manageable parts that we can solve step by step.`,
          },
          {
            question: `Which approach is most effective when learning ${topicName}?`,
            options: [
              "Memorizing without practicing",
              "Skipping the basics",
              "Practicing with real examples and building understanding progressively",
              "Learning everything at once",
            ],
            correctAnswer: 2,
            explanation:
              "The most effective approach is to practice with real examples and build understanding progressively, starting with basics.",
          },
          {
            question: `How does ${topicName} relate to problem-solving?`,
            options: [
              "It makes problems harder to solve",
              "It provides a systematic approach to finding solutions",
              "It's not related to problem-solving",
              "It only works for simple problems",
            ],
            correctAnswer: 1,
            explanation: `${topicName} provides a systematic, logical approach to finding solutions by breaking problems down into steps.`,
          },
        ],
      }

      setLesson(mockLesson)
      setCurrentStep("learn")
    } catch (error) {
      console.error("Error generating lesson:", error)
      alert("Failed to generate lesson. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const startExercises = () => {
    setCurrentStep("exercise")
    setCurrentExercise(0)
    setSelectedAnswers([])
    setShowResults(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentExercise] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const nextExercise = () => {
    if (currentExercise < (lesson?.exercises.length || 0) - 1) {
      setCurrentExercise(currentExercise + 1)
    } else {
      calculateResults()
    }
  }

  const calculateResults = () => {
    if (!lesson) return

    let correct = 0
    selectedAnswers.forEach((answer, index) => {
      if (answer === lesson.exercises[index].correctAnswer) {
        correct++
      }
    })

    const finalScore = Math.round((correct / lesson.exercises.length) * 100)
    setScore(finalScore)
    setShowResults(true)
    setCurrentStep("complete")
  }

  const resetLesson = () => {
    setLesson(null)
    setCurrentStep("generate")
    setCurrentExercise(0)
    setSelectedAnswers([])
    setShowResults(false)
    setScore(0)
  }

  // Generate Lesson Step
  if (currentStep === "generate") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button variant="outline" onClick={handleBackToTopics} className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {subjectName}
          </Button>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="relative">
                <Brain className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                <Sparkles className="h-6 w-6 absolute top-0 right-1/2 transform translate-x-8 text-yellow-500" />
              </div>
              <CardTitle className="text-2xl">{topicName}</CardTitle>
              <CardDescription>Subject: {subjectName} • AI-Powered Learning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-6">Ready to start your AI-powered personalized lesson?</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900">Personalized Content</h3>
                    <p className="text-sm text-blue-700 mt-1">Adapted for visual learners</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900">Interactive Exercises</h3>
                    <p className="text-sm text-green-700 mt-1">Practice with immediate feedback</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={generateLesson}
                disabled={loading}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? (
                  <>
                    <Brain className="h-5 w-5 mr-2 animate-pulse" />
                    AI is Creating Your Lesson...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate AI Lesson
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={handleBackToTopics} className="w-full bg-transparent">
                Back to Topics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="relative">
                <Brain className="h-16 w-16 animate-pulse mx-auto mb-4 text-blue-600" />
                <Sparkles className="h-6 w-6 absolute top-2 right-1/2 transform translate-x-8 text-yellow-500 animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI is Creating Your Lesson</h3>
              <p className="text-gray-600 mb-4">Generating personalized content for visual learners...</p>
              <Progress value={75} className="w-full" />
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Learning Content Step
  if (currentStep === "learn" && lesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button variant="outline" onClick={handleBackToTopics} className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {subjectName}
          </Button>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                {lesson.title}
              </CardTitle>
              <CardDescription>AI-Generated Content • Personalized for visual learners</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                {lesson.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold mb-3 text-blue-900 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Key Points to Remember:
                </h3>
                <ul className="space-y-3">
                  {lesson.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={startExercises}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Start Practice Exercises ({lesson.exercises.length} questions)
                </Button>
                <Button variant="outline" onClick={handleBackToTopics}>
                  Back to Topics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Exercise Step
  if (currentStep === "exercise" && lesson && !showResults) {
    const exercise = lesson.exercises[currentExercise]
    const progress = ((currentExercise + 1) / lesson.exercises.length) * 100

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Practice Exercise {currentExercise + 1}</CardTitle>
                <Badge variant="secondary">
                  {currentExercise + 1} of {lesson.exercises.length}
                </Badge>
              </div>
              <Progress value={progress} className="w-full" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">{exercise.question}</h3>

                <RadioGroup
                  value={selectedAnswers[currentExercise]?.toString()}
                  onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
                >
                  {exercise.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1 text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button
                onClick={nextExercise}
                disabled={selectedAnswers[currentExercise] === undefined}
                className="w-full"
              >
                {currentExercise < lesson.exercises.length - 1 ? "Next Question" : "Complete Lesson"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Results Step
  if (currentStep === "complete" && lesson && showResults) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <div className="mb-4">
                {score >= 70 ? (
                  <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
                ) : (
                  <XCircle className="h-16 w-16 mx-auto text-orange-500" />
                )}
              </div>
              <CardTitle>Lesson Complete!</CardTitle>
              <CardDescription>You scored {score}% • AI-Powered Learning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{score}%</div>
                <Progress value={score} className="w-full max-w-md mx-auto" />
                <p className="text-sm text-gray-600 mt-2">
                  {score >= 90
                    ? "Excellent work! 🎉"
                    : score >= 70
                      ? "Good job! Keep practicing! 👍"
                      : "Keep learning, you're improving! 💪"}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Review Your Answers</h3>
                {lesson.exercises.map((exercise, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <p className="font-medium mb-3">{exercise.question}</p>
                    <div className="space-y-2">
                      {exercise.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded text-sm ${
                            optionIndex === exercise.correctAnswer
                              ? "bg-green-100 border border-green-300"
                              : selectedAnswers[index] === optionIndex
                                ? "bg-red-100 border border-red-300"
                                : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {optionIndex === exercise.correctAnswer && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            {selectedAnswers[index] === optionIndex && optionIndex !== exercise.correctAnswer && (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                      <p className="text-sm text-blue-800">
                        <strong>Explanation:</strong> {exercise.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button onClick={resetLesson} variant="outline" className="flex-1 bg-transparent">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Generate New Lesson
                </Button>
                <Button onClick={handleBackToTopics} className="flex-1">
                  Back to Topics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}
