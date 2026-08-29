/* TODO:
 * Figure out how to make saving work
 */
import { useEffect, useState } from 'react'
import {Bookmark} from 'lucide-react'
import MCQ from '../components/McqQuestion.jsx'
import Written from "../components/WrittenQuestion.jsx";
import FilterCard from "../components/FilterCard.jsx";
import '../styles/SavedQuestions.css'

const SavedQuestions = () => {
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
        <div className="saved-questions">
            <div className="heading-div">
                <Bookmark size={22} className="bookmark-icon"/>
                <h2 className="heading-text">সংরক্ষিত প্রশ্নাবলি</h2>
            </div>
            <p className="description-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, aperiam.</p>

            <FilterCard />

            {questions.map((question, index) => {
                // TODO: uncomment this line
                // if(question.saved)
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

export default SavedQuestions
