import React, { useState } from "react";

function StudentDetailsForm() {
  const [form, setForm] = useState({
    id: "",
    rollNo: "",
    firstName: "",
    middleName: "",
    lastName: "",
    experience: "",
    skills: [],
    education: "",
    description: "",
    activated: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "skills") {
      setForm({ ...form, skills: value.split(",").map((s) => s.trim()) });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted! (UI only)");
  };

  return (
<form className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6" onSubmit={handleSubmit}>
      {/* Title and Subtitle Enhancement */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#262E3E] mb-2">Student Details</h2>
        <p className="text-gray-600">Please fill out your information below.</p>
      </div>
      {/* ...existing form fields... */}
      <div>
        <label className="block text-sm font-medium text-gray-800">ID</label>
        <input name="id" value={form.id} onChange={handleChange} className="w-full border rounded p-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-800">Roll No</label>
        <input name="rollNo" type="number" value={form.rollNo} onChange={handleChange} className="w-full border rounded p-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-800">First Name</label>
        <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full border rounded p-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-800">Middle Name</label>
        <input name="middleName" value={form.middleName} onChange={handleChange} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-800">Last Name</label>
        <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full border rounded p-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-800">Experience</label>
        <input name="experience" value={form.experience} onChange={handleChange} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-800">Skills (comma separated)</label>
        <input name="skills" value={form.skills.join(", ")} onChange={handleChange} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-800">Education</label>
        <input name="education" value={form.education} onChange={handleChange} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-800">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded p-2" />
      </div>
      <div className="flex items-center">
        <input name="activated" type="checkbox" checked={form.activated} onChange={handleChange} className="mr-2" />
        <label className="text-sm font-medium text-gray-800">Activated</label>
      </div>
      <button type="submit" className="w-full bg-[#262E3E] text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition">
        Submit
      </button>
    </form>
  );
}

export default StudentDetailsForm;