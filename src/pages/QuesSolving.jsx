import { useEffect, useState } from 'react'
import '../styles/QuestionSolving.css'

const QuesSolving = () => {
  const [questions ,setQuestions] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuestions = async () => {
      
    }
  })

  return (
    <div className="question-bank">

    </div>
  )
}

export default QuesSolving
