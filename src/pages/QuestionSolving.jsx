/* TODO:
 * Make the filters work
 */
import React, { useEffect, useState } from 'react'
import MCQ from '../components/McqQuestion.jsx'
import Written from "../components/WrittenQuestion.jsx";
import '../styles/QuestionSolving.css'

const QuestionSolving = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/questions')
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
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
          <div className="filters-div">
            <div className="title">প্রশ্ন ফিল্টার ও অনুসন্ধান</div>
            <div className="divider"></div>

              <div className="all-filter-categories">
                <div className="filter-grid-child">
                  <label htmlFor="module">প্রস্তুতির ধরণ</label>
                  <select id="module">
                    <option>Engineering University Preparation</option>
                    <option>Medical Preparation</option>
                    <option>Varsity Preparation</option>
                  </select>
                </div>

                <div className="filter-grid-child">
                  <label htmlFor="exam">পরীক্ষা</label>
                  <select id="exam">
                    <option>সকল পরীক্ষা</option>
                    <option>ঢাকা বিশ্ববিদ্যালয় ভর্তি পরীক্ষা</option>
                    <option>চট্টগ্রাম বিশ্ববিদ্যালয় ভর্তি পরীক্ষা</option>
                    <option>রাজশাহী বিশ্ববিদ্যালয় ভর্তি পরীক্ষা</option>
                  </select>
                </div>

                <div className="filter-grid-child">
                  <label htmlFor="subject">বিষয়</label>
                  <select id="subject">
                    <option>সকল বিষয়</option>
                    <option>পদার্থবিজ্ঞান</option>
                    <option>রসায়ন</option>
                    <option>উচ্চতর গণিত</option>
                    <option>জীববিজ্ঞান</option>
                  </select>
                </div>

                <div className="filter-grid-child">
                  <label htmlFor="chapter">অধ্যায়</label>
                  <select id="chapter">
                    <option>সকল অধ্যায়</option>
                    <option>Chapter 1</option>
                    <option>Chapter 2</option>
                    <option>Chapter 3</option>
                  </select>
                </div>

                <div className="filter-grid-child">
                  <label htmlFor="topic">টপিক</label>
                  <select id="topic">
                    <option>সকল টপিক</option>
                    <option>Topic 1</option>
                    <option>Topic 2</option>
                    <option>Topic 3</option>
                  </select>
                </div>

                <div className="filter-grid-child">
                  <label htmlFor="year">সাল</label>
                  <select id="year">
                    <option>সকল শিক্ষাবর্ষ</option>
                    <option>2025</option>
                    <option>2024</option>
                    <option>2023</option>
                  </select>
                </div>
            </div>

          </div>

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