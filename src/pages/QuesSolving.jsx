import { useEffect, useState } from 'react'
import MCQ from '../components/McqQuestion.jsx'
import Written from "../components/WrittenQuestion.jsx";

import '../styles/QuestionSolving.css'
import '../styles/McqQuestion.css'
import '../styles/WrittenQuestion.css'

const QuesSolving = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/questions')

        if (!res.ok)
          throw new Error(`Request failed: ${res.status}`)

        const data = await res.json()
        setQuestions(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  if (loading) return <div className="question-bank">Loading...</div>
  if (error) return <div className="question-bank">Error: {error}</div>

  return (
      <div className="question-bank">

        {questions.map((question, index) => {
          switch (question.type) {
            case 'mcq':
              return (
                  <MCQ
                      key={question._id}
                      question={question}
                      current={index + 1}
                      total={questions.length}
                  />
              )

            case 'written':
              return (
                  <Written
                      key={question._id}
                      question={question}
                      current={index + 1}
                      total={question.length}
                  />
              )

            default:
              return null
          }
        })}
      </div>
  )
}

export default QuesSolving