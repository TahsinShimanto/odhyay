import { useState } from 'react';
import {Bookmark, ShieldAlert, Eye, Star} from 'lucide-react'
import '../styles/McqQuestion.css'

function MCQ({question, current, total}) {
    const [showExplaination, setShowExplaination] = useState(false);
    const getStars = (question) => {
        switch(question.importance) {
            case "low":
                return 1;
            case "medium":
                return 2;
            case "high":
                return 3;
            default:
                return 0;
        }
    }

    return (
        <div className="question-card">
            <div className="question-card-info">
                <div className="question-info-count">প্রশ্ন {current}/{total}</div>
                <div className="question-info-importance">
                    {Array.from({ length: getStars(question) }, (_, index) => (
                        <Star key={index} className="star" size={16} />
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

                <div className="question-options-container">
                    {question.options.map((option, index) =>
                    <div key={option.id} className="single-option-div">
                        <div className="option-count">{index+1}</div>
                        <span className="option-text">{option.text}</span>
                        <span className="option-image">{option.image}</span>
                    </div>
                )}
                </div>

                <div className="divider"></div>

                <div className={(!showExplaination) ? "hidden-explanation-card" : "revealed-explanation-card"} onClick={() => setShowExplaination(true)}>
                    {showExplaination ? (
                        <>
                            <div className="hide-explanation-button" onClick={(e) => { e.stopPropagation(); setShowExplaination(false)}}>ব্যাখ্যা লুকান</div>
                            <div>{question.explanationText}</div>
                            <div>{question.explanationImage}</div>
                        </>

                    ) : (
                        <>
                            <Eye size={16}/>
                            <div>ব্যাখ্যা দেখুন</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MCQ;