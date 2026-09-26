/* TODO:
* supporting latex symbols
*/

import { useState } from 'react';
import {Bookmark, ShieldAlert, Eye, Star} from 'lucide-react'
import '../styles/McqQuestion.css'

function MCQ({question, current, total, isSaved = false, isSaving = false, onToggleSave}) {
    const [showExplaination, setShowExplaination] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const importanceStars = { low: 1, medium: 2, high: 3 }[question.importance] || 0;

    // after answering, further clicks are ignored and the answer is revealed
    const answered = selectedIndex !== null;

    const handleSelect = (index) => {
        if (answered) return;
        setSelectedIndex(index);
    };

    const optionClass = (option, index) => {
        if (!answered) return "single-option-div";
        if (option.isCorrect) return "single-option-div correct";
        if (index === selectedIndex) return "single-option-div wrong";
        return "single-option-div";
    };

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
                <button
                    className={`question-info-save ${isSaved ? "saved" : ""}`}
                    onClick={onToggleSave}
                    disabled={isSaving}
                    aria-pressed={isSaved}
                    aria-label="সংরক্ষণ"
                >
                    <Bookmark className="save-fill" size={16}/>
                </button>
                <button className="question-info-flag"><ShieldAlert className="flag-fill" size={16}/></button>
            </div>

            <div className="question-card-main">
                <div className="question-statement-container">
                    <span className="question-statement">{question.questionText}</span>
                    {question.questionImage?.url && <img className="question-statement-image" src={question.questionImage.url} alt="" />}
                </div>

                <div className="question-occurrences">
                    {question.appearances.map((object, index) =>
                        <div key={index} className="appearance-tag">
                            <span className="bullet"></span> {object.university?.slug || object.university} {object.year}
                        </div>
                    )}
                </div>

                <div className="question-options-container">
                    {question.options.map((option, index) =>
                    <div
                        key={index}
                        className={optionClass(option, index)}
                        onClick={() => handleSelect(index)}
                    >
                        <div className="option-count">{index+1}</div>
                        <span className="option-text">{option.text}</span>
                        {option.image?.url && <img className="option-image" src={option.image.url} alt="" />}
                    </div>
                )}
                </div>

                <div className="divider"></div>

                <div className={(!showExplaination) ? "hidden-explanation-card" : "revealed-explanation-card"} onClick={() => setShowExplaination(true)}>
                    {showExplaination ? (
                        <>
                            <div className="hide-explanation-button" onClick={(e) => { e.stopPropagation(); setShowExplaination(false)}}>ব্যাখ্যা লুকান</div>
                            {question.answerOrExplanationText && <div className="explanation-text">{question.answerOrExplanationText}</div>}
                            {question.answerOrExplanationImage?.url && <img className="explanation-image" src={question.answerOrExplanationImage.url} alt="" />}
                        </>

                    ) : (
                        <>
                            <Eye size={16}/>
                            <div className="toggle-label">ব্যাখ্যা দেখুন</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MCQ;