/* TODO:
 * add functionality for the remaining filters
 */

import { useEffect, useState } from 'react';
import '../styles/FilterCard.css';

const ALL = '';

export default function FilterCard({ filters, setFilters }) {
    const [subjects, setSubjects] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        fetch('/api/taxonomy/subjects')
            .then((res) => res.json())
            .then((data) => setSubjects(data.data || []))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!filters.subjectId) {
            setChapters([]);
            setTopics([]);
            return;
        }

        fetch(`/api/taxonomy/chapters?subjectId=${filters.subjectId}`)
            .then((res) => res.json())
            .then((data) => setChapters(data.data || []))
            .catch(console.error);
    }, [filters.subjectId]);

    useEffect(() => {
        if (!filters.chapterId) {
            setTopics([]);
            return;
        }

        fetch(`/api/taxonomy/topics?chapterId=${filters.chapterId}`)
            .then((res) => res.json())
            .then((data) => setTopics(data.data || []))
            .catch(console.error);
    }, [filters.chapterId]);

    const handleSubjectChange = (e) => {
        const value = e.target.value;
        setFilters((prev) => ({
            ...prev,
            subjectId: value,
            chapterId: ALL,
            topicId: ALL,
        }));
    };

    const handleChapterChange = (e) => {
        const value = e.target.value;
        setFilters((prev) => ({
            ...prev,
            chapterId: value,
            topicId: ALL,
        }));
    };

    const handleTopicChange = (e) => {
        setFilters((prev) => ({ ...prev, topicId: e.target.value }));
    };

    const handleModuleChange = (e) => {
        setFilters((prev) => ({ ...prev, module: e.target.value }));
    };




    return (
        <div className="filters-div">
            <div className="title">প্রশ্ন ফিল্টার ও অনুসন্ধান</div>
            <div className="divider"></div>

            <div className="all-filter-categories">
                <div className="filter-grid-child">
                    <label htmlFor="module">প্রস্তুতির ধরণ</label>
                    <select id="module" value={filters.module} onChange={handleModuleChange}>
                        <option value="">সকল ধরণ</option>
                        <option>Engineering University Preparation</option>
                        <option>Medical Preparation</option>
                        <option>Varsity Preparation</option>
                    </select>
                </div>

                <div className="filter-grid-child">
                    <label htmlFor="exam">পরীক্ষা</label>
                    <select id="exam">
                        <option>সকল পরীক্ষা</option>
                        <option>ঢাকা বিশ্ববিদ্যালয় ভর্তি পরীক্ষা</option>
                        <option>চট্টগ্রাম বিশ্ববিদ্যালয় ভর্তি পরীক্ষা</option>
                        <option>রাজশাহী বিশ্ববিদ্যালয় ভর্তি পরীক্ষা</option>
                    </select>
                </div>

                <div className="filter-grid-child">
                    <label htmlFor="year">সাল</label>
                    <select id="year">
                        <option>সকল শিক্ষাবর্ষ</option>
                        <option>2025</option>
                        <option>2024</option>
                        <option>2023</option>
                    </select>
                </div>

                <div className="filter-grid-child">
                    <label htmlFor="subject">বিষয়</label>
                    <select id="subject" value={filters.subjectId} onChange={handleSubjectChange}>
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