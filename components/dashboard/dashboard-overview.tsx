"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Trophy, TrendingUp, Brain } from "lucide-react"
import { supabase, type User, type Subject, type UserProgress } from "@/lib/supabase"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DashboardData {
  user: User | null
  subjects: Subject[]
  recentProgress: UserProgress[]
  weeklyStats: any[]
  totalLessonsCompleted: number
  averageScore: number
  currentStreak: number
}

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData>({
    user: null,
    subjects: [],
    recentProgress: [],
    weeklyStats: [],
    totalLessonsCompleted: 0,
    averageScore: 0,
    currentStreak: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()
      const { data: subjects } = await supabase.from("subjects").select("*")

      const { data: recentProgress } = await supabase
        .from("user_progress")
        .select(`
          *,
          lessons (
            title,
            subject_id,
            subjects (name)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      const { data: progressStats } = await supabase
        .from("user_progress")
        .select("score, completed, created_at")
        .eq("user_id", user.id)
        .eq("completed", true)

      const totalCompleted = progressStats?.length || 0
      const averageScore = progressStats?.length
        ? progressStats.reduce((sum, p) => sum + (p.score || 0), 0) / progressStats.length
        : 0

      const weeklyStats = generateWeeklyStats(progressStats || [])

      setData({
        user: userProfile,
        subjects: subjects || [],
        recentProgress: recentProgress || [],
        weeklyStats,
        totalLessonsCompleted: totalCompleted,
        averageScore: Math.round(averageScore),
        currentStreak: 5,
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateWeeklyStats = (progress: any[]) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return days.map((day) => ({
      day,
      lessons: Math.floor(Math.random() * 5) + 1,
      score: Math.floor(Math.random() * 40) + 60,
    }))
  }

  const handleContinueLearning = (subjectName: string) => {
    const subjectSlug = subjectName.toLowerCase().replace(/\s+/g, '-')
    router.push(`/learn/${subjectSlug}`)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {data.user?.name}!</h1>
          <p className="text-gray-600">Ready to continue your learning journey? Let's make today count!</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {data.user?.learning_style} Learner
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalLessonsCompleted}</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageScore}%</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.currentStreak} days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
          <CardDescription>Your learning activity over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="lessons" fill="#3b82f6" name="Lessons Completed" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subjects Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.subjects.map((subject) => (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  {subject.name}
                </CardTitle>
                <CardDescription>{subject.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>65%</span> {/* Replace with actual progress if available */}
                  </div>
                  <Progress value={65} />
                  <Button
                    className="w-full mt-4"
                    size="sm"
                    onClick={() => handleContinueLearning(subject.name)}
                  >
                    Continue Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest learning sessions and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentProgress.slice(0, 5).map((progress: any) => (
              <div key={progress.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{progress.lessons?.title}</p>
                    <p className="text-sm text-gray-600">{progress.lessons?.subjects?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{progress.score}%</p>
                  <p className="text-sm text-gray-600">
                    {new Date(progress.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
