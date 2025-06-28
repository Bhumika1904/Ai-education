"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Brain, BookOpen } from "lucide-react"

export default function SubjectPage() {
  const params = useParams()
  const router = useRouter()

  const subjectSlug = params.subject as string

  const subjectName = subjectSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  const handleTopicClick = (topicSlug: string) => {
    router.push(`/learn/${subjectSlug}/${topicSlug}`)
  }

  // Sample topics for each subject
  const topics = {
    mathematics: [
      {
        slug: "basic-arithmetic",
        name: "Basic Arithmetic",
        description: "Addition, subtraction, multiplication, and division",
      },
      { slug: "fractions", name: "Fractions", description: "Working with fractions and decimals" },
      { slug: "algebra-basics", name: "Algebra Basics", description: "Introduction to variables and equations" },
      { slug: "geometry", name: "Geometry", description: "Shapes, angles, and measurements" },
    ],
    science: [
      { slug: "scientific-method", name: "Scientific Method", description: "How to conduct experiments and research" },
      { slug: "matter-and-energy", name: "Matter and Energy", description: "States of matter and energy types" },
      { slug: "living-systems", name: "Living Systems", description: "Cells, organisms, and life processes" },
      { slug: "earth-and-space", name: "Earth and Space", description: "Our planet and the universe" },
    ],
    programming: [
      { slug: "programming-basics", name: "Programming Basics", description: "Introduction to coding concepts" },
      { slug: "variables-and-data", name: "Variables and Data", description: "Storing and using information" },
      { slug: "control-structures", name: "Control Structures", description: "Loops, conditions, and decision making" },
      { slug: "functions", name: "Functions", description: "Creating reusable code blocks" },
    ],
    "language-arts": [
      {
        slug: "reading-comprehension",
        name: "Reading Comprehension",
        description: "Understanding and analyzing texts",
      },
      { slug: "writing-skills", name: "Writing Skills", description: "Grammar, structure, and composition" },
      { slug: "vocabulary", name: "Vocabulary", description: "Building word knowledge and usage" },
      { slug: "literature", name: "Literature", description: "Exploring stories, poems, and plays" },
    ],
  }

  const currentTopics = topics[subjectSlug as keyof typeof topics] || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={handleBackToDashboard} className="mb-6 bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{subjectName}</h1>
          <p className="text-gray-600">Choose a topic to start your AI-powered personalized lesson</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTopics.map((topic) => (
            <Card
              key={topic.slug}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleTopicClick(topic.slug)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                  <Brain className="h-5 w-5" />
                  {topic.name}
                </CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <BookOpen className="h-4 w-4" />
                    <span>AI-Generated Content</span>
                  </div>
                  <Button size="sm" className="group-hover:bg-blue-600 transition-colors">
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {currentTopics.length === 0 && (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <Brain className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Topics Available</h3>
              <p className="text-gray-600 mb-4">Topics for {subjectName} are coming soon!</p>
              <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
