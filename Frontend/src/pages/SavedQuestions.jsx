import FilterCard from '../components/FilterCard.jsx';
import '../styles/SavedQuestions.css'

const SavedQuestions = () => {
    return (
        <div className="saved-questions">
            <FilterCard saved emptyMessage="আপনি এখনো কোনো প্রশ্ন সংরক্ষণ করেননি" />
        </div>
      )
}

export default SavedQuestions