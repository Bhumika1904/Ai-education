"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

interface Question {
  id: number
  question: string
  options: {
    text: string
    style: "visual" | "auditory" | "kinesthetic"
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "When learning something new, I prefer to:",
    options: [
      { text: "See diagrams, charts, or visual examples", style: "visual" },
      { text: "Listen to explanations or discussions", style: "auditory" },
      { text: "Try it hands-on or practice immediately", style: "kinesthetic" },
    ],
  },
  {
    id: 2,
    question: "When I need to remember information, I:",
    options: [
      { text: "Create mental pictures or write notes", style: "visual" },
      { text: "Repeat it out loud or discuss it", style: "auditory" },
      { text: "Associate it with physical movements or actions", style: "kinesthetic" },
    ],
  },
  {
    id: 3,
    question: "In a classroom, I learn best when:",
    options: [
      { text: "The teacher uses slides, boards, or visual aids", style: "visual" },
      { text: "The teacher explains concepts verbally", style: "auditory" },
      { text: "There are interactive activities or experiments", style: "kinesthetic" },
    ],
  },
  {
    id: 4,
    question: "When solving problems, I tend to:",
    options: [
      { text: "Draw diagrams or make lists", style: "visual" },
      { text: "Talk through the problem", style: "auditory" },
      { text: "Try different approaches physically", style: "kinesthetic" },
    ],
  },
  {
    id: 5,
    question: "I concentrate best when:",
    options: [
      { text: "My workspace is organized and visually clean", style: "visual" },
      { text: "There's background music or I can discuss ideas", style: "auditory" },
      { text: "I can move around or fidget while thinking", style: "kinesthetic" },
    ],
  },
]

interface LearningStyleQuizProps {
  onComplete: (style: "visual" | "auditory" | "kinesthetic") => void
}

export function LearningStyleQuiz({ onComplete }: LearningStyleQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState("")

  const handleNext = () => {
    if (selectedAnswer) {
      const newAnswers = [...answers, selectedAnswer]
      setAnswers(newAnswers)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer("")
      } else {
        // Calculate learning style
        const styles = { visual: 0, auditory: 0, kinesthetic: 0 }
        newAnswers.forEach((answer) => {
          const option = questions
            .find((q) => q.options.some((opt) => opt.text === answer))
            ?.options.find((opt) => opt.text === answer)
          if (option) {
            styles[option.style]++
          }
        })

        const dominantStyle = Object.entries(styles).reduce((a, b) =>
          styles[a[0] as keyof typeof styles] > styles[b[0] as keyof typeof styles] ? a : b,
        )[0] as "visual" | "auditory" | "kinesthetic"

        onComplete(dominantStyle)
      }
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Learning Style Assessment</CardTitle>
        <CardDescription>Help us understand how you learn best so we can personalize your experience</CardDescription>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">
            Question {currentQuestion + 1} of {questions.length}
          </h3>
          <p className="text-gray-700 mb-6">{questions[currentQuestion].question}</p>

          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
            {questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option.text} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button onClick={handleNext} disabled={!selectedAnswer} className="w-full">
          {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Assessment"}
        </Button>
      </CardContent>
    </Card>
  )
}
