import { useEffect, useState } from 'react'
import MCQ from '../components/McqQuestion.jsx'
import Written from "../components/WrittenQuestion.jsx";
import FilterCard from "../components/FilterCard.jsx";
import '../styles/QuestionSolving.css'

const QuestionSolving = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    subjectId: '',
    chapterId: '',
    topicId: '',
    module: '',
  })

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.subjectId) params.set('subject', filters.subjectId)
        if (filters.chapterId) params.set('chapter', filters.chapterId)
        if (filters.topicId) params.set('topic', filters.topicId)
        if (filters.module) params.set('module', filters.module)
        params.set('limit', '40')

        const res = await fetch(`/api/questions?${params}`)
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const data = await res.json()
        setQuestions(data.data.questions)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [filters])

  if (loading) return <div className="question-bank">Loading...</div>
  if (error) return <div className="question-bank">Error: {error}</div>

  return (
        <div className="question-bank">

          <FilterCard filters={filters} setFilters={setFilters} />

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
                        total={questions.length}
                    />
                )

              default:
                return null
            }
          })}
        </div>
  )
}

export default QuestionSolving
