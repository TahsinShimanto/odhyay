import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import axios from "../services/axios.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import "../styles/AdminTaxonomy.css";

const TABS = [
  {
    key: "module",
    label: "মডিউল",
    endpoint: "modules",
    placeholder: "মডিউলের নাম লিখুন",
  },
  {
    key: "university",
    label: "বিশ্ববিদ্যালয়",
    endpoint: "universities",
    placeholder: "বিশ্ববিদ্যালয় নাম লিখুন",
  },
  {
    key: "subject",
    label: "বিষয়",
    endpoint: "subjects",
    placeholder: "বিষয়ের নাম লিখুন",
    parent: "module",
  },
  {
    key: "chapter",
    label: "অধ্যায়",
    endpoint: "chapters",
    placeholder: "অধ্যায়ের নাম লিখুন",
    parent: "subject",
  },
  {
    key: "topic",
    label: "টপিক",
    endpoint: "topics",
    placeholder: "টপিকের নাম লিখুন",
    parent: "chapter",
  },
];

const AdminTaxonomy = () => {
  const [activeTab, setActiveTab] = useState("module");

  const [modules, setModules] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);

  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");

  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  

  const tab = TABS.find((t) => t.key === activeTab);
  useEffect(() => {
    axios
      .get("/api/taxonomy/modules")
      .then((res) => setModules(res.data.data))
      .catch(() => {});

    axios
    .get("/api/taxonomy/universities")
    .then((res) => setUniversities(res.data.data))
    .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedModuleId) {
      setSubjects([]);
      return;
    }
    axios
      .get("/api/taxonomy/subjects", { params: { moduleId: selectedModuleId } })
      .then((res) => setSubjects(res.data.data))
      .catch(() => {});
  }, [selectedModuleId]);

  useEffect(() => {
    if (!selectedSubjectId) {
      setChapters([]);
      return;
    }
    axios
      .get("/api/taxonomy/chapters", {
        params: { subjectId: selectedSubjectId },
      })
      .then((res) => setChapters(res.data.data))
      .catch(() => {});
  }, [selectedSubjectId]);

  useEffect(() => {
    if (!selectedChapterId) {
      setTopics([]);
      return;
    }
    axios
      .get("/api/taxonomy/topics", { params: { chapterId: selectedChapterId } })
      .then((res) => setTopics(res.data.data))
      .catch(() => {});
  }, [selectedChapterId]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setNewName("");
    setNewSlug("");
    setError("");
  };
  let list = modules;
  if (activeTab === "university") list = universities;
  if (activeTab === "subject") list = subjects;
  if (activeTab === "chapter") list = chapters;
  if (activeTab === "topic") list = topics;

  const canCreate =
    !tab.parent ||
    (tab.parent === "module" && selectedModuleId) ||
    (tab.parent === "subject" && selectedSubjectId) ||
    (tab.parent === "chapter" && selectedChapterId);

  const handleCreate = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name || !canCreate) return;
    if (activeTab === "university" && !newSlug.trim()) return;

    const body = { name };
    if (tab.parent === "module") body.moduleId = selectedModuleId;
    if (tab.parent === "subject") body.subjectId = selectedSubjectId;
    if (tab.parent === "chapter") body.chapterId = selectedChapterId;
    if (activeTab === "university") body.slug = newSlug.trim();

    try {
      const res = await axios.post(`/api/taxonomy/${tab.endpoint}`, body);
      const created = res.data.data; // <-- unwrap the envelope
      if (activeTab === "module") setModules([...modules, created]);
      if (activeTab === "university") setUniversities([...universities, created]);
      if (activeTab === "subject") setSubjects([...subjects, created]);
      if (activeTab === "chapter") setChapters([...chapters, created]);
      if (activeTab === "topic") setTopics([...topics, created]);
      setNewName("");
      setNewSlug("");
    } catch {
      setError("তৈরি করা যায়নি, আবার চেষ্টা করুন");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/taxonomy/${tab.endpoint}/${deleteId}`);
      if (activeTab === "module")
        setModules(modules.filter((m) => m._id !== deleteId));
      if (activeTab === "university")
        setUniversities(universities.filter((u) => u._id !== deleteId));
      if (activeTab === "subject")
        setSubjects(subjects.filter((s) => s._id !== deleteId));
      if (activeTab === "chapter")
        setChapters(chapters.filter((c) => c._id !== deleteId));
      if (activeTab === "topic")
        setTopics(topics.filter((t) => t._id !== deleteId));
    } catch {
      setError("মুছে ফেলা যায়নি, আবার চেষ্টা করুন");
    }
    setDeleting(false);
    setDeleteId(null);
  };
  return (
    <div className="taxonomy-container">
      <div className="taxonomy-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={
              activeTab === t.key ? "taxonomy-tab active" : "taxonomy-tab"
            }
            onClick={() => handleTabChange(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {(tab.parent === "module" ||
        tab.parent === "subject" ||
        tab.parent === "chapter") && (
        <div className="taxonomy-parent-selects">
          <select
            value={selectedModuleId}
            onChange={(e) => {
              setSelectedModuleId(e.target.value);
              setSelectedSubjectId("");
              setSelectedChapterId("");
            }}
          >
            <option value="">মডিউল নির্বাচন করুন</option>
            {modules.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>

          {(tab.parent === "subject" || tab.parent === "chapter") && (
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setSelectedChapterId("");
              }}
              disabled={!selectedModuleId}
            >
              <option value="">বিষয় নির্বাচন করুন</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}

          {tab.parent === "chapter" && (
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              disabled={!selectedSubjectId}
            >
              <option value="">অধ্যায় নির্বাচন করুন</option>
              {chapters.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <form className="taxonomy-create-row" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder={tab.placeholder}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={!canCreate}
        />
        {activeTab === "university" && (
          <input
            type="text"
            placeholder="স্ল্যাগ (যেমন: DU, BUET)"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
          />
        )}
        <button type="submit" disabled={!canCreate || (activeTab === "university" && !newSlug.trim())}>
          <Plus size={16} />
          যোগ করুন
        </button>
      </form>

      {error && <p className="taxonomy-error">{error}</p>}

      {!canCreate && tab.parent && (
        <p className="taxonomy-hint">তালিকা দেখতে উপরে থেকে নির্বাচন করুন</p>
      )}

      {canCreate && (
        <div className="taxonomy-list">
          {list.length === 0 ? (
            <p className="taxonomy-hint">এখনো কিছু যোগ করা হয়নি</p>
          ) : (
            list.map((item) => (
              <div className="taxonomy-list-row" key={item._id}>
                <span>{item.name}</span>
                <button
                  type="button"
                  className="taxonomy-delete-btn"
                  onClick={() => setDeleteId(item._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {deleteId && (
        <ConfirmDialog
          message="আপনি কি নিশ্চিত এটি মুছে ফেলতে চান?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          busy={deleting}
        />
      )}
    </div>
  );
};

export default AdminTaxonomy;
