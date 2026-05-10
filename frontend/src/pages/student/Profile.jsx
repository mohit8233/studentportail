import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    setLoading(true);

    api
      .get("/students/me")
      .then((res) => {
        setProfile(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to load profile");
        setProfile(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="text-center py-10 text-red-500">
        Profile not found
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Name:</label>
            <p className="text-gray-700">{profile.userId?.name}</p>
          </div>

          <div>
            <label className="font-semibold">Email:</label>
            <p className="text-gray-700">{profile.userId?.email}</p>
          </div>

          <div>
            <label className="font-semibold">Phone:</label>
            <p className="text-gray-700">
              {profile.userId?.phone || "Not provided"}
            </p>
          </div>

          <div>
            <label className="font-semibold">Roll Number:</label>
            <p className="text-gray-700">{profile.rollNumber}</p>
          </div>

          <div>
            <label className="font-semibold">Course:</label>
            <p className="text-gray-700">
              {profile.course?.courseName || profile.course || "N/A"}
            </p>
          </div>

          <div>
            <label className="font-semibold">Batch:</label>
            <p className="text-gray-700">{profile.batch}</p>
          </div>

          <div>
            <label className="font-semibold">Attendance:</label>
            <p className="text-gray-700">
              {profile.attendance ? profile.attendance.toFixed(2) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;