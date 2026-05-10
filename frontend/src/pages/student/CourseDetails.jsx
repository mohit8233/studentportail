import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";


const CourseDetails = () => {
  const { courseId } = useParams();

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState({});
  const [openSubject, setOpenSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await api.get(`/subjects/course/${courseId}`);

      setSubjects(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenTopics = async (subjectId) => {
    if (openSubject === subjectId) {
      setOpenSubject(null);
      return;
    }

    try {
      const res = await api.get(`/topics/subject/${subjectId}`);

      setTopics((prev) => ({
        ...prev,
        [subjectId]: res.data.data || [],
      }));

      setOpenSubject(subjectId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-4 md:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-xl">
          <h1 className="text-3xl md:text-5xl font-black">
            Career in Full Stack Web Development
          </h1>

          <p className="mt-4 text-lg text-indigo-100">
            Complete MERN Stack + DSA + Projects Course
          </p>
        </div>

        {/* Subjects */}
        <div className="mt-8 space-y-5">
          {subjects.map((subject, index) => (
            <div
              key={subject._id}
              className="overflow-hidden rounded-3xl bg-white shadow-lg border border-gray-100"
            >

              {/* Subject Header */}
              <button
                onClick={() => handleOpenTopics(subject._id)}
                className="flex w-full items-center justify-between p-6 text-left hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-5">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-black text-indigo-700">
                    {index + 1}
                  </div>

                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-gray-800">
                      {subject.subjectName}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {subject.teacherName || "Admin"} •{" "}
                      {subject.time || "Flexible"}
                    </p>
                  </div>
                </div>

                <div className="text-3xl font-bold text-indigo-600">
                  {openSubject === subject._id ? "-" : "+"}
                </div>
              </button>

              {/* Topics */}
              {openSubject === subject._id && (
                <div className="border-t bg-gray-50 px-6 py-5">
                  <div className="space-y-4">

                    {(topics[subject._id] || []).map((topic, i) => (
                      <div
                        key={topic._id}
                        className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm border border-gray-100"
                      >
                        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                          {i + 1}
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {topic.topicName}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {topic.description}
                          </p>
                        </div>
                      </div>
                    ))}

                    {(topics[subject._id] || []).length === 0 && (
                      <div className="rounded-2xl bg-white p-6 text-center text-gray-500">
                        No topics found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CourseDetails;