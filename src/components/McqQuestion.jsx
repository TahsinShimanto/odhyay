import React from 'react';
import {Bookmark, ShieldAlert, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Search, HelpCircle, Eye, EyeOff, AlertTriangle, Star} from 'lucide-react'
import '../styles/McqQuestion.css'

function MCQ({question, current, total}) {
    return (
        <div className="question-card">
            <div className="question-card-info">
                <div className="question-info-count">প্রশ্ন {current}/{total}</div>
                <div className="question-info-importance">{question.importance}</div>
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
                <div className="explaination-card">
                    {question.explanationText}
                    {question.explanationImage}
                </div>
            </div>
        </div>
    );
}

export default MCQ;