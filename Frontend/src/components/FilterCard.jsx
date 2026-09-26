import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import MCQ from './McqQuestion.jsx';
import Written from './WrittenQuestion.jsx';
import axios from '../services/axios.js';
import '../styles/FilterCard.css';

const ALL = '';
const PAGE_SIZE = '10';

const QUESTION_TYPES = { mcq: MCQ, written: Written };

// Loads a taxonomy option list (public endpoints), reusing the same handling everywhere
const loadOptions = (url, setData) => {
    axios
        .get(url)
        .then((res) => setData(res.data?.data || []))
        .catch(console.error);
};

export default function FilterCard({ saved = false, emptyMessage = 'কোনো প্রশ্ন পাওয়া যায়নি', questionTypes = QUESTION_TYPES, questionProps = {}, refreshKey = 0,}) {
    const navigate = useNavigate();

    const [modules, setModules] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [years, setYears] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [topics, setTopics] = useState([]);

    const [filters, setFilters] = useState({
        moduleId: '',
        subjectId: '',
        chapterId: '',
        topicId: '',
        universityId: '',
        year: '',
    });
    const [questions, setQuestions] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [savingIds, setSavingIds] = useState(() => new Set());

    useEffect(() => {
        loadOptions('/api/taxonomy/modules', setModules);
    }, []);

    useEffect(() => {
        loadOptions('/api/taxonomy/universities', setUniversities);
    }, []);

    useEffect(() => {
        loadOptions('/api/taxonomy/years', setYears);
    }, []);

    useEffect(() => {
        if (!filters.moduleId) return;
        loadOptions(`/api/taxonomy/subjects?moduleId=${filters.moduleId}`, setSubjects);
    }, [filters.moduleId]);

    useEffect(() => {
        if (!filters.subjectId) return;
        loadOptions(`/api/taxonomy/chapters?subjectId=${filters.subjectId}`, setChapters);
    }, [filters.subjectId]);

    useEffect(() => {
        if (!filters.chapterId) return;
        loadOptions(`/api/taxonomy/topics?chapterId=${filters.chapterId}`, setTopics);
    }, [filters.chapterId]);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/questions', {
                    params: {
                        ...(saved ? { saved: true } : {}),
                        moduleId: filters.moduleId,
                        subject: filters.subjectId,
                        chapter: filters.chapterId,
                        topic: filters.topicId,
                        university: filters.universityId,
                        year: filters.year,
                        page,
                        limit: PAGE_SIZE,
                    },
                });
                setQuestions(res.data?.data?.questions ?? []);
                setPagination(res.data?.data?.pagination ?? null);
                setError(null);
            } catch (err) {
                setQuestions([]);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [filters, page, saved, refreshKey]);

    // Reset to the first page whenever a filter changes
    const updateFilters = (updater) => {
        setPage(1);
        setFilters(updater);
    };

    const handleModuleChange = (e) => {
        const value = e.target.value;
        setSubjects([]);
        setChapters([]);
        setTopics([]);
        updateFilters((prev) => ({
            ...prev,
            moduleId: value,
            subjectId: ALL,
            chapterId: ALL,
            topicId: ALL,
        }));
    };

    const handleSubjectChange = (e) => {
        const value = e.target.value;
        setChapters([]);
        setTopics([]);
        updateFilters((prev) => ({
            ...prev,
            subjectId: value,
            chapterId: ALL,
            topicId: ALL,
        }));
    };

    const handleChapterChange = (e) => {
        const value = e.target.value;
        setTopics([]);
        updateFilters((prev) => ({
            ...prev,
            chapterId: value,
            topicId: ALL,
        }));
    };

    const handleTopicChange = (e) => {
        updateFilters((prev) => ({ ...prev, topicId: e.target.value }));
    };

    const handleExamChange = (e) => {
        updateFilters((prev) => ({ ...prev, universityId: e.target.value }));
    };

    const handleYearChange = (e) => {
        updateFilters((prev) => ({ ...prev, year: e.target.value }));
    };

    const handleToggleSave = async (question) => {
        if (savingIds.has(question._id)) return;
        setSavingIds((prev) => new Set(prev).add(question._id));

        try {
            if (question.saved) {
                await axios.delete(`/api/questions/${question._id}/save`);
                // on the saved page the question disappears; elsewhere it just flips back
                if (saved) {
                    const total = pagination.total - 1;
                    const totalPages = Math.max(1, Math.ceil(total / pagination.limit));
                    setPagination({
                        ...pagination,
                        total,
                        totalPages,
                        hasNextPage: pagination.page < totalPages,
                    });
                    if (pagination.page > totalPages) setPage(totalPages);
                    setQuestions((prev) => prev.filter((q) => q._id !== question._id));
                } else {
                    setQuestions((prev) =>
                        prev.map((q) => (q._id === question._id ? { ...q, saved: false } : q))
                    );
                }
            } else {
                await axios.post(`/api/questions/${question._id}/save`);
                setQuestions((prev) =>
                    prev.map((q) => (q._id === question._id ? { ...q, saved: true } : q))
                );
            }
        } catch (err) {
            if (err.response?.status === 401) navigate('/signin');
        } finally {
            setSavingIds((prev) => {
                const next = new Set(prev);
                next.delete(question._id);
                return next;
            });
        }
    };

    return (
        <>
            <div className="filters-div">
                <div className="title">প্রশ্ন ফিল্টার ও অনুসন্ধান</div>
                <div className="divider"></div>

                <div className="all-filter-categories">
                    <div className="filter-grid-child">
                        <label htmlFor="module">প্রস্তুতির ধরণ</label>
                        <select id="module" value={filters.moduleId} onChange={handleModuleChange}>
                            <option value={ALL}>সকল ধরণ</option>
                            {modules.map((module) => (
                                <option key={module._id} value={module._id}>{module.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-grid-child">
                        <label htmlFor="exam">পরীক্ষা</label>
                        <select id="exam" value={filters.universityId} onChange={handleExamChange}>
                            <option value={ALL}>সকল পরীক্ষা</option>
                            {universities.map((university) => (
                                <option key={university._id} value={university._id}>{university.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-grid-child">
                        <label htmlFor="year">সাল</label>
                        <select id="year" value={filters.year} onChange={handleYearChange}>
                            <option value={ALL}>সকল শিক্ষাবর্ষ</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-grid-child">
                        <label htmlFor="subject">বিষয়</label>
                        <select id="subject" value={filters.subjectId} onChange={handleSubjectChange} disabled={!filters.moduleId}>
                            <option value={ALL}>সকল বিষয়</option>
                            {subjects.map((subject) => (
                                <option key={subject._id} value={subject._id}>{subject.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-grid-child">
                        <label htmlFor="chapter">অধ্যায়</label>
                        <select id="chapter" value={filters.chapterId} onChange={handleChapterChange} disabled={!filters.subjectId}>
                            <option value={ALL}>সকল অধ্যায়</option>
                            {chapters.map((chapter) => (
                                <option key={chapter._id} value={chapter._id}>{chapter.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-grid-child">
                        <label htmlFor="topic">টপিক</label>
                        <select id="topic" value={filters.topicId} onChange={handleTopicChange} disabled={!filters.chapterId}>
                            <option value={ALL}>সকল টপিক</option>
                            {topics.map((topic) => (
                                <option key={topic._id} value={topic._id}>{topic.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="results-area">
                {loading ? (
                    <div className="results-loading">Loading...</div>
                ) : error ? (
                    <div className="results-error">Error: {error}</div>
                ) : questions.length === 0 ? (
                    <div className="no-results">{emptyMessage}</div>
                ) : (
                    <>
                        {questions.map((question, index) => {
                            const QuestionComponent = questionTypes[question.type];
                            if (!QuestionComponent) return null;

                            const globalNumber = (pagination.page - 1) * pagination.limit + index + 1;

                            return (
                                <QuestionComponent
                                    key={question._id}
                                    question={question}
                                    current={globalNumber}
                                    total={pagination.total}
                                    isSaved={question.saved}
                                    isSaving={savingIds.has(question._id)}
                                    onToggleSave={() => handleToggleSave(question)}
                                    {...questionProps}
                                />
                            );
                        })}

                        {pagination && (
                            <div className="next-prev-ques">
                                <button
                                    className="prev-button pagination-action"
                                    onClick={() => setPage((prev) => prev - 1)}
                                    disabled={!pagination.hasPreviousPage}
                                >
                                    <ArrowLeft size={15} /> পূর্ববর্তী প্রশ্ন
                                </button>

                                <span className="pagination-info">
                                    পৃষ্ঠা {pagination.page} / {pagination.totalPages}
                                </span>

                                <button
                                    className="next-button pagination-action"
                                    onClick={() => setPage((prev) => prev + 1)}
                                    disabled={!pagination.hasNextPage}
                                >
                                    পরবর্তী প্রশ্ন <ArrowRight size={15} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}