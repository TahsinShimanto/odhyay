import { useEffect, useState } from 'react';
import '../styles/FilterCard.css';

const ALL = '';

export default function FilterCard({ filters = {}, setFilters = () => {} }) {
    const [modules, setModules] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [years, setYears] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        fetch('/api/taxonomy/modules')
            .then((res) => res.json())
            .then((data) => setModules(data.data || []))
            .catch(console.error);
    }, []);

    useEffect(() => {
        fetch('/api/taxonomy/universities')
            .then((res) => res.json())
            .then((data) => setUniversities(data.data || []))
            .catch(console.error);
    }, []);

    useEffect(() => {
        fetch('/api/taxonomy/years')
            .then((res) => res.json())
            .then((data) => setYears(data.data || []))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!filters.moduleId) return;

        fetch(`/api/taxonomy/subjects?moduleId=${filters.moduleId}`)
            .then((res) => res.json())
            .then((data) => setSubjects(data.data || []))
            .catch(console.error);
    }, [filters.moduleId]);

    useEffect(() => {
        if (!filters.subjectId) return;

        fetch(`/api/taxonomy/chapters?subjectId=${filters.subjectId}`)
            .then((res) => res.json())
            .then((data) => setChapters(data.data || []))
            .catch(console.error);
    }, [filters.subjectId]);

    useEffect(() => {
        if (!filters.chapterId) return;

        fetch(`/api/taxonomy/topics?chapterId=${filters.chapterId}`)
            .then((res) => res.json())
            .then((data) => setTopics(data.data || []))
            .catch(console.error);
    }, [filters.chapterId]);

    const handleModuleChange = (e) => {
        const value = e.target.value;
        setSubjects([]);
        setChapters([]);
        setTopics([]);
        setFilters((prev) => ({
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
        setFilters((prev) => ({
            ...prev,
            subjectId: value,
            chapterId: ALL,
            topicId: ALL,
        }));
    };

    const handleChapterChange = (e) => {
        const value = e.target.value;
        setTopics([]);
        setFilters((prev) => ({
            ...prev,
            chapterId: value,
            topicId: ALL,
        }));
    };

    const handleTopicChange = (e) => {
        setFilters((prev) => ({ ...prev, topicId: e.target.value }));
    };

    const handleExamChange = (e) => {
        setFilters((prev) => ({ ...prev, universityId: e.target.value }));
    };

    const handleYearChange = (e) => {
        setFilters((prev) => ({ ...prev, year: e.target.value }));
    };

    return (
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
    )
}