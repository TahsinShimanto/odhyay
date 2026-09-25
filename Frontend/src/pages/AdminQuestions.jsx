import { useState, useCallback } from 'react';
import axios from '../services/axios.js';
import FilterCard from '../components/FilterCard.jsx';
import AdminQuestionForm from '../components/AdminQuestionForm.jsx';
import AdminMcqCard from '../components/AdminMcqCard.jsx';
import AdminWrittenCard from '../components/AdminWrittenCard.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import '../styles/AdminQuestions.css';

const ADMIN_TYPES = { mcq: AdminMcqCard, written: AdminWrittenCard };

const AdminQuestions = () => {
    const [editingQuestion, setEditingQuestion] = useState(null); 
    const [refreshKey, setRefreshKey] = useState(0);
    const [pendingDelete, setPendingDelete] = useState(null); 
    const [deletingId, setDeletingId] = useState(null);        

    const bumpRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

    const confirmDelete = async () => {
        const question = pendingDelete;
        if (!question) return;

        setDeletingId(question._id);
        try {
            await axios.delete(`/api/questions/${question._id}`);
            bumpRefresh();
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
            setPendingDelete(null);
        }
    };

    const closeForm = (didSave) => {
        setEditingQuestion(null);
        if (didSave) bumpRefresh();
    };

    return (
        <div className="admin-question-page">
            <div className="admin-question-page-header">
                <h2>প্রশ্ন ব্যবস্থাপনা</h2>
                <button className="add-question-btn" onClick={() => setEditingQuestion('new')}>
                    + প্রশ্ন যোগ করুন
                </button>
            </div>

            <FilterCard
                questionTypes={ADMIN_TYPES}
                refreshKey={refreshKey}
                questionProps={{
                    onEdit: setEditingQuestion,
                    onDelete: setPendingDelete, 
                    deletingId,
                }}
                emptyMessage="কোনো প্রশ্ন নেই"
            />

            {editingQuestion && (
                <AdminQuestionForm
                    question={editingQuestion === 'new' ? null : editingQuestion}
                    onClose={closeForm}
                />
            )}

            {pendingDelete && (
                <ConfirmDialog
                    message="প্রশ্নটি মুছে ফেলতে চান?"
                    onConfirm={confirmDelete}
                    onCancel={() => setPendingDelete(null)}
                    busy={deletingId === pendingDelete._id}
                />
            )}
        </div>
    );
};

export default AdminQuestions;