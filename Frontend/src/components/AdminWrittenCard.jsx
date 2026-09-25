import '../styles/AdminQuestionCard.css'
import { EditIcon, Trash2 } from 'lucide-react';

const AdminWrittenCard = ({ question, current, total, onEdit, onDelete, deletingId }) => {
  return (
    <div className="admin-question-card">
      <div className="admin-question-header">
        <span className="admin-question-count">
          প্রশ্ন {current} / {total}
        </span>
        <div className="admin-question-actions">
          <button onClick={() => onEdit(question)}><EditIcon size={16}/></button>
          <button className="delete-btn" onClick={() => onDelete(question)} disabled={deletingId === question._id}>
            {deletingId === question._id ? '...' : (<Trash2 size={16}/>)}
          </button>
        </div>
      </div>

      {question.questionImage?.url && (
        <img
          className="admin-question-image"
          src={question.questionImage.url}
          alt=""
        />
      )}
      <p className="admin-question-text">{question.questionText}</p>

      {question.answerOrExplanationText && (
        <div className="admin-answer">
          <strong>উত্তর:</strong>
          <p>{question.answerOrExplanationText}</p>
        </div>
      )}
      {question.answerOrExplanationImage?.url && (
        <img
          className="admin-answer-image"
          src={question.answerOrExplanationImage.url}
          alt=""
        />
      )}
    </div>
  );
};

export default AdminWrittenCard;
