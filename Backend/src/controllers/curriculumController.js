import Subject from "../models/Subject.js";
import Chapter from "../models/Chapters.js";
import Topic from "../models/Topics.js";

export const getCurriculum = async (req, res) => {
    try {
        const subjects = await Subject.find({ isActive: true })
            .select("name slug")
            .sort({ name: 1 })
            .lean();

        const chapters = await Chapter.find({ isActive: true })
            .select("name slug subjectId")
            .sort({ name: 1 })
            .lean();

        const topics = await Topic.find({ isActive: true })
            .select("name slug chapterId")
            .sort({ name: 1 })
            .lean();

        const curriculum = subjects.map((subject) => {
            const subjectChapters = chapters
                .filter((chapter) =>
                    chapter.subjectId.toString() === subject._id.toString()
                )
                .map((chapter) => {
                    const chapterTopics = topics
                        .filter((topic) =>
                            topic.chapterId.toString() === chapter._id.toString()
                        )
                        .map((topic) => ({
                            _id: topic._id,
                            name: topic.name,
                            slug: topic.slug,
                        }));

                    return {
                        _id: chapter._id,
                        name: chapter.name,
                        slug: chapter.slug,
                        topics: chapterTopics,
                    };
                });

            return {
                _id: subject._id,
                name: subject.name,
                slug: subject.slug,
                chapters: subjectChapters,
            };
        });

        return res.status(200).json({ data: curriculum });

    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch Curriculum"
        });
    }
};