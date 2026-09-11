/* TODO:
* checking the correctness of mcq
* supporting latex symbols
* supporting images
*/

import { useState } from 'react';
import {Bookmark, ShieldAlert, Eye, Star} from 'lucide-react'
import '../styles/McqQuestion.css'

function MCQ({question, current, total, saved}) {
    const [showExplaination, setShowExplaination] = useState(false);

    const importanceStars = { low: 1, medium: 2, high: 3 }[question.importance] || 0;

    return (
        <div className="question-card">
            <div className="question-card-info">
                <div className="question-info-count">প্রশ্ন {current}/{total}</div>
                <div className="question-info-importance">
                    {Array.from({ length: importanceStars }).map((_, index) => (
                        <Star
                            key={index}
                            size={14}
                            className="star"
                        />
                    ))}
                </div>
                <div className="question-info-type">নির্বাচনী প্রশ্ন</div>
                <button className="question-info-save" onClick={saved}><Bookmark className="save-fill" size={16}/></button>
                <button className="question-info-flag"><ShieldAlert className="flag-fill" size={16}/></button>
            </div>

            <div className="question-card-main">
                <div className="question-statement-container">
                    <span className="question-statement">{question.questionText}</span>
                    {question.questionImage && <img className="question-statement-image" src={question.questionImage} alt="" />}
                </div>

                <div className="question-occurrences">
                    {question.appearances.map((object, index) =>
                        <div key={index} className="appearance-tag">
                            <span className="bullet"></span> {object.university} {object.year}
                        </div>
                    )}
                </div>

                <div className="question-options-container">
                    {question.options.map((option, index) =>
                    <div key={index} className="single-option-div">
                        <div className="option-count">{index+1}</div>
                        <span className="option-text">{option.text}</span>
                        {option.image && <img className="option-image" src={option.image} alt="" />}
                    </div>
                )}
                </div>

                <div className="divider"></div>

                <div className={(!showExplaination) ? "hidden-explanation-card" : "revealed-explanation-card"} onClick={() => setShowExplaination(true)}>
                    {showExplaination ? (
                        <>
                            <div className="hide-explanation-button" onClick={(e) => { e.stopPropagation(); setShowExplaination(false)}}>ব্যাখ্যা লুকান</div>
                            {question.answerOrExplanationText && <div className="explanation-text">{question.answerOrExplanationText}</div>}
                            {question.answerOrExplanationImage && <img className="explanation-image" src={question.answerOrExplanationImage} alt="" />}
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