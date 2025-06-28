"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Brain, Clock, ArrowRight, RotateCcw } from 'lucide-react'

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

interface AILessonGeneratorProps {
  subject: string
  topic: string
  onBack: () => void
}

export function AILessonGenerator({ subject, topic, onBack }: AILessonGeneratorProps) {
  const [lesson, setLesson] = useState<LessonContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<'generate' | 'learn' | 'exercise' | 'complete'>('generate')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const generateLesson = async () => {
    setLoading(true)
    
    try {
      // Simulate AI lesson generation with realistic content
      await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate API call
      
      const mockLesson: LessonContent = {
        title: `${topic} in ${subject}`,
        content: `Welcome to your personalized lesson on ${topic}!

${topic} is a fundamental concept in ${subject} that forms the building blocks for more advanced topics. 

In this lesson, you'll learn:
• Core concepts and terminology
• Practical applications and examples
• Step-by-step problem-solving approaches
• Real-world use cases

Let's start with the basics and build your understanding progressively. This content is tailored for visual learners with interactive examples and clear explanations.

Key Concept: ${topic} involves understanding how different elements work together to create solutions. Think of it like building blocks - each piece has a specific purpose and fits together in a logical way.

Example: Imagine you're giving directions to a friend. You need to be clear, specific, and break down the journey into simple steps. This is exactly how ${topic} works - breaking complex problems into manageable pieces.`,
        
        keyPoints: [
          `${topic} is essential for understanding ${subject}`,
          "Break complex problems into smaller, manageable parts",
          "Practice with real examples to reinforce learning",
          "Apply logical thinking and step-by-step approaches",
          "Build confidence through hands-on practice"
        ],
        
        exercises: [
          {
            question: `What is the main purpose of ${topic} in ${subject}?`,
            options: [
              "To make things more complicated",
              "To break down complex problems into manageable parts",
              "To avoid using logic",
              "To memorize facts without understanding"
            ],
            correctAnswer: 1,
            explanation: `${topic} helps us break down complex problems into smaller, more manageable parts that we can solve step by step.`
          },
          {
            question: `Which approach is most effective when learning ${topic}?`,
            options: [
              "Memorizing without practicing",
              "Skipping the basics",
              "Practicing with real examples and building understanding progressively",
              "Learning everything at once"
            ],
            correctAnswer: 2,
            explanation: "The most effective approach is to practice with real examples and build understanding progressively, starting with basics."
          },
          {
            question: `How does ${topic} relate to problem-solving?`,
            options: [
              "It makes problems harder to solve",
              "It provides a systematic approach to finding solutions",
              "It's not related to problem-solving",
              "It only works for simple problems"
            ],
            correctAnswer: 1,
            explanation: `${topic} provides a systematic, logical approach to finding solutions by breaking problems down into steps.`
          }
        ]
      }
      
      setLesson(mockLesson)
      setCurrentStep('learn')
      
    } catch (error) {
      console.error('Error generating lesson:', error)
      alert('Failed to generate lesson. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const startExercises = () => {
    setCurrentStep('exercise')
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
    setCurrentStep('complete')
  }

  const resetLesson = () => {
    setLesson(null)
    setCurrentStep('generate')
    setCurrentExercise(0)
    setSelectedAnswers([])
    setShowResults(false)
    setScore(0)
  }

  // Generate Lesson Step
  if (currentStep === 'generate') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Brain className="h-16 w-16 mx-auto mb-4 text-blue-600" />
          <CardTitle className="text-2xl">{topic}</CardTitle>
          <CardDescription>Subject: {subject}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Ready to start your AI-powered personalized lesson?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900">Personalized Content</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Adapted for your learning style
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900">Interactive Exercises</h3>
                <p className="text-sm text-green-700 mt-1">
                  Practice with immediate feedback
                </p>
              </div>
            </div>
          </div>

          <Button 
            onClick={generateLesson} 
            disabled={loading}
            size="lg" 
            className="w-full"
          >
            {loading ? (
              <>
                <Brain className="h-5 w-5 mr-2 animate-pulse" />
                Generating Your Lesson...
              </>
            ) : (
              <>
                <Brain className="h-5 w-5 mr-2" />
                Generate AI Lesson
              </>
            )}
          </Button>

          <Button variant="outline" onClick={onBack} className="w-full">
            Back to Topics
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Loading State
  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Brain className="h-16 w-16 animate-pulse mx-auto mb-4 text-blue-600" />
          <h3 className="text-xl font-semibold mb-2">Generating Your Personalized Lesson</h3>
          <p className="text-gray-600 mb-4">AI is creating content tailored to your learning style...</p>
          <Progress value={66} className="w-full" />
        </CardContent>
      </Card>
    )
  }

  // Learning Content Step
  if (currentStep === 'learn' && lesson) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            {lesson.title}
          </CardTitle>
          <CardDescription>AI-Generated Personalized Content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            {lesson.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-blue-900">Key Points to Remember:</h3>
            <ul className="space-y-2">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            <Button onClick={startExercises} className="flex-1">
              <ArrowRight className="h-4 w-4 mr-2" />
              Start Practice Exercises
            </Button>
            <Button variant="outline" onClick={onBack}>
              Back to Topics
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Exercise Step
  if (currentStep === 'exercise' && lesson && !showResults) {
    const exercise = lesson.exercises[currentExercise]
    const progress = ((currentExercise + 1) / lesson.exercises.length) * 100

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Practice Exercise {currentExercise + 1}</CardTitle>
            <Badge variant="secondary">{currentExercise + 1} of {lesson.exercises.length}</Badge>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{exercise.question}</h3>
            
            <RadioGroup
              value={selectedAnswers[currentExercise]?.toString()}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            >
              {exercise.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
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
            {currentExercise < lesson.exercises.length - 1 ? 'Next Question' : 'Complete Lesson'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Results Step
  if (currentStep === 'complete' && lesson && showResults) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mb-4">
            {score >= 70 ? (
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 mx-auto text-orange-500" />
            )}
          </div>
          <CardTitle>Lesson Complete!</CardTitle>
          <CardDescription>You scored {score}% on the exercises</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{score}%</div>
            <Progress value={score} className="w-full max-w-md mx-auto" />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Answers</h3>
            {lesson.exercises.map((exercise, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <p className="font-medium mb-2">{exercise.question}</p>
                <div className="space-y-1">
                  {exercise.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-2 rounded text-sm ${
                        optionIndex === exercise.correctAnswer
                          ? "bg-green-100 border border-green-300"
                          : selectedAnswers[index] === optionIndex
                            ? "bg-red-100 border border-red-300"
                            : "bg-gray-50"
                      }`}
                    >
                      {option}
                      {optionIndex === exercise.correctAnswer && (
                        <CheckCircle className="inline h-4 w-4 ml-2 text-green-600" />
                      )}
                      {selectedAnswers[index] === optionIndex && optionIndex !== exercise.correctAnswer && (
                        <XCircle className="inline h-4 w-4 ml-2 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2 italic">{exercise.explanation}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button onClick={resetLesson} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Another Lesson
            </Button>
            <Button onClick={onBack} className="flex-1">
              Back to Topics
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}