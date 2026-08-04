import React from 'react';
import {Bookmark, Flag, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Search, HelpCircle, Eye, EyeOff, AlertTriangle, Star} from 'lucide-react'

function Written({question, current, total}) {
    return (
        <div className="question-card">
            <div className="queston-card-info">
                <div className="question-info-count">প্রশ্ন {current}/{total}</div>
                <div className="question-info-taglike">importance</div>
                <div className="question-info-taglike">লিখিত প্রশ্ন</div>
                <Bookmark size={22}/>
                <Flag size={22}/>
            </div>

            <div className="question-statement-container">
                <span className="question-statement">{question.questionText}</span>
                <span className="question-image">{question.questionimage}</span>
            </div>

            <div className="question-occurances">
                {question.appearances.map((object) =>
                    <div key={object.id} className="appearance-tag">
                        {object.university} {object.year}
                    </div>
                )}
            </div>

            <div className="divider"></div>
            <div className="explaination-card">
                {question.answerText}
                {question.answerImage}
            </div>
        </div>
    );
}

export default Written;