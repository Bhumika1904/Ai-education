// components/test-supabase.tsx
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function TestSupabase() {
  const [status, setStatus] = useState("Testing...")

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Test 1: Basic connection
      const { data, error } = await supabase.from('subjects').select('count')
      
      if (error) {
        setStatus(`Connection Error: ${error.message}`)
        return
      }

      // Test 2: Auth status
      const { data: { user } } = await supabase.auth.getUser()
      
      setStatus(`✅ Connection successful! User: ${user ? user.email : 'Not logged in'}`)
      
    } catch (error) {
      setStatus(`❌ Error: ${error}`)
    }
  }

  return (
    <div className="p-4 border rounded">
      <h3>Supabase Connection Test</h3>
      <p>{status}</p>
      <button onClick={testConnection} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Test Again
      </button>
    </div>
  )
}