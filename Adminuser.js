import React, { useEffect, useState } from 'react';
import { useAuth } from '../store/Auth';
import { Link } from 'react-router-dom';

const AdminUser = () => {
  const { Authorizationtoken } = useAuth();
  const [users, setUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:2000/api/admin/users", {
        method: "GET",
        headers: {
          Authorization: Authorizationtoken,
        },
      });

      const data = await response.json();
      console.log(`data of users ${data}`);
      setUsers(data);
    } catch (error) {
      console.error("Error in fetching users:", error);
    }
  }




  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:2000/api/admin/users/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: Authorizationtoken,
        },
      });

      const data = await response.json();
      console.log(`User After Delete ${data}`);

      if (response.ok) {
        getAllUsers();
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 bg-indigo-500 text-white">S.No</th>
            <th className="px-4 py-2 bg-indigo-500 text-white">Username</th>
            <th className="px-4 py-2 bg-indigo-500 text-white">Email</th>
            <th className="px-4 py-2 bg-indigo-500 text-white">Registration number</th>
            <th className="px-4 py-2 bg-indigo-500 text-white">Update</th>
            <th className="px-4 py-2 bg-indigo-500 text-white">Delete</th>
          </tr>
        </thead>
        <tbody>
          {users && users.map((curuser, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-4 py-2 text-black">{index + 1}</td>
              <td className="px-4 py-2 text-black">{curuser.username}</td>
              <td className="px-4 py-2 text-black">{curuser.email}</td>
              <td className="px-4 py-2 text-black">{curuser.phone}</td>
              <td className="px-4 py-2">
                <button className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                  <Link to={`/admin/update/${curuser._id}`}> USER Details</Link>
                </button>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => deleteUser(curuser._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default AdminUser;
