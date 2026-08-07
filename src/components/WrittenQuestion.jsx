import { useState } from 'react';
import { Bookmark, ShieldAlert, Eye, Star } from 'lucide-react'
import '../styles/WrittenQuestion.css'

function Written({question, current, total}) {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <div className="question-card">
            <div className="question-card-info">
                <div className="question-info-count">প্রশ্ন {current}/{total}</div>
                <div className="question-info-importance">
                    {Array.from({ length: question.importance }).map((_, index) => (
                        <Star
                            key={index}
                            size={14}
                            className="star"
                        />
                    ))}
                </div>
                <div className="question-info-type">নির্বাচনী প্রশ্ন</div>
                <button className="question-info-save"><Bookmark className="save-fill" size={16}/></button>
                <button className="question-info-flag"><ShieldAlert className="flag-fill" size={16}/></button>
            </div>

            <div className="question-card-main">
                <div className="question-statement-container">
                    <span className="question-statement">{question.questionText}</span>
                    <span className="question-image">{question.questionimage}</span>
                </div>

                <div className="question-occurrences">
                    {question.appearances.map((object) =>
                        <div key={object.id} className="appearance-tag">
                            <span className="bullet"></span> {object.university} {object.year}
                        </div>
                    )}
                </div>

                <div className={(!showAnswer) ? "hidden-answer-card" : "revealed-answer-card"} onClick={() => setShowAnswer(true)}>
                    {showAnswer ? (
                        <>
                            <div className="hide-answer-button" onClick={(e) => { e.stopPropagation(); setShowAnswer(false)}}>উত্তর লুকান</div>
                            <div>{question.answerText}</div>
                            <div>{question.answerImage}</div>
                        </>

                    ) : (
                        <>
                            <Eye size={16}/>
                            <div>উত্তর দেখুন</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Written;