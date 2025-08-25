import React, { useEffect, useState } from "react";
import { useAuth } from "../store/Auth";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminUserDetails = () => {
  const { Authorizationtoken } = useAuth();
  const { id } = useParams();
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:2000/api/admin/users/${id}`, {
        method: "GET",
        headers: {
          Authorization: Authorizationtoken,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        toast.error(data.message || "Failed to fetch user details.");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("An error occurred while fetching user details.");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center text-gray-600">
        Loading user details...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded shadow-md">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">User Details</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Username</h2>
          <p className="text-gray-900">{user.username}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700">Email</h2>
          <p className="text-gray-900">{user.email}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700">Phone</h2>
          <p className="text-gray-900">{user.phone}</p>
        </div>

        {user.role && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Role</h2>
            <p className="text-gray-900">{user.role}</p>
          </div>
        )}

        {user.createdAt && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Created At</h2>
            <p className="text-gray-900">{new Date(user.createdAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetails;
