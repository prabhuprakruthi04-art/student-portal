import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./students.css";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Filter state
  const [filters, setFilters] = useState({
    name: "",
    department: "",
    semester: "",
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const initialForm = {
    name: "",
    email: "",
    phone: "",
    department: "",
    semester: "1",
    photoPreview: "",
  };
  const [form, setForm] = useState(initialForm);

  // Fetch students from Firestore
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "students"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setStudents(data);
    } catch (err) {
      console.error("Fetch students error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Open modal for Add
  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const openEditModal = (student) => {
    setIsEditing(true);
    setEditingId(student.id);
    setForm({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      department: student.department || "",
      semester: student.semester ? String(student.semester) : "1",
      photoPreview: student.photo || "",
    });
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Handle photo selection
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((p) => ({ ...p, photoPreview: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Save (add or update)
  const handleSave = async (e) => {
    e.preventDefault();

    const { name, email, phone, department, semester, photoPreview } = form;
    if (!name || !email || !phone || !department || !semester) {
      alert("Fill all fields");
      return;
    }

    try {
      if (isEditing && editingId) {
        const updateData = { name, email, phone, department, semester };
        if (photoPreview) updateData.photo = photoPreview;
        await updateDoc(doc(db, "students", editingId), updateData);
      } else {
        await addDoc(collection(db, "students"), {
          name,
          email,
          phone,
          department,
          semester,
          photo: photoPreview || "",
        });
      }

      setIsModalOpen(false);
      setForm(initialForm);
      fetchStudents();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    await deleteDoc(doc(db, "students", id));
    fetchStudents();
  };

  /* 🔥 FILTER LOGIC */
  const filteredStudents = students.filter((s) => {
    return (
      s.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      (filters.department === "" || s.department === filters.department) &&
      (filters.semester === "" || String(s.semester) === filters.semester)
    );
  });

  return (
    <div className="stud-container clean-ui">
      <div className="topbar">
        <h1 className="page-title">Students List</h1>
        <button className="add-btn" onClick={openAddModal}>
          + Add Student
        </button>
      </div>

      {/* 🔥 FILTER UI */}
      <div className="filter-row">
        <input
          type="text"
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="filter-input"
        />

        <select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          className="filter-select"
        >
          <option value="">All Dept</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
        </select>

        <select
          value={filters.semester}
          onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
          className="filter-select"
        >
          <option value="">All Sem</option>
          <option value="1">1</option><option value="2">2</option>
          <option value="3">3</option><option value="4">4</option>
          <option value="5">5</option><option value="6">6</option>
          <option value="7">7</option><option value="8">8</option>
        </select>
      </div>

      <div className="table-area">
        {loading ? (
          <p>Loading...</p>
        ) : filteredStudents.length === 0 ? (
          <p>No matching students.</p>
        ) : (
          <table className="stud-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td className="photo-cell">
                    {s.photo ? (
                      <img src={s.photo} alt={s.name} className="square-pic" />
                    ) : (
                      <div className="square-placeholder">—</div>
                    )}
                  </td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{s.department}</td>
                  <td>{s.semester}</td>
                  <td>
                    <button className="edit-btn" onClick={() => openEditModal(s)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ---------- Modal ---------- */}
      {isModalOpen && (
        <div className="modal-backdrop" onMouseDown={() => setIsModalOpen(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <h2>{isEditing ? "Edit Student" : "Add Student"}</h2>

            <form onSubmit={handleSave} className="modal-form">
              <label>
                Name
                <input name="name" value={form.name} onChange={handleChange} />
              </label>

              <label>
                Email
                <input name="email" value={form.email} onChange={handleChange} />
              </label>

              <label>
                Phone
                <input name="phone" value={form.phone} onChange={handleChange} />
              </label>

              <label>
                Department
                <input name="department" value={form.department} onChange={handleChange} />
              </label>

              <label>
                Semester
                <select name="semester" value={form.semester} onChange={handleChange}>
                  <option value="1">1</option><option value="2">2</option>
                  <option value="3">3</option><option value="4">4</option>
                  <option value="5">5</option><option value="6">6</option>
                  <option value="7">7</option><option value="8">8</option>
                </select>
              </label>

              <label>
                Photo (square)
                <input type="file" accept="image/*" onChange={handlePhoto} />
              </label>

              <div className="preview-row">
                {form.photoPreview ? (
                  <img src={form.photoPreview} alt="preview" className="square-pic" />
                ) : (
                  <div className="square-placeholder">Preview</div>
                )}
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {isEditing ? "Save Changes" : "Add Student"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
