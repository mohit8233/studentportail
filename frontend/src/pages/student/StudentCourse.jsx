import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const StudentCourses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");

      setCourses(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <h1 className="text-4xl font-black">
            My Courses
          </h1>

          <p className="mt-2 text-indigo-100">
            Explore your enrolled courses
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course._id}
              className="rounded-3xl bg-white p-6 shadow-lg"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-2xl font-black text-indigo-700">
                {course.courseName?.charAt(0)}
              </div>

              <h2 className="mt-5 text-2xl font-black text-gray-800">
                {course.courseName}
              </h2>

              <p className="mt-3 text-gray-500">
                Duration : {course.duration}
              </p>

              <p className="mt-2 font-bold text-indigo-700">
                ₹{course.fees}
              </p>

              <button
                onClick={() =>
                  navigate(`/student/courses/${course._id}`)
                }
                className="mt-6 w-full rounded-2xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700"
              >
                View Subjects
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default StudentCourses;