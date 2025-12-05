import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./faculty.css";

export default function Faculty() {
  const [facultyList, setFacultyList] = useState([]);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");   // 🔥 ADDED PHONE
  const [newDept, setNewDept] = useState("");
  const [newSubjects, setNewSubjects] = useState("");

  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState(""); // 🔥 EDIT PHONE
  const [editDept, setEditDept] = useState("");
  const [editSubjects, setEditSubjects] = useState("");

  // Fetch faculty data
  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "faculty");
      const snapshot = await getDocs(colRef);
      setFacultyList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  // Add Faculty
  const addFaculty = async () => {
    if (!newName || !newEmail || !newDept || !newPhone)
      return alert("Fill all fields");

    const subjectsArray = newSubjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await addDoc(collection(db, "faculty"), {
      name: newName,
      email: newEmail,
      phone: newPhone, // 🔥 SAVE PHONE
      department: newDept,
      subjects: subjectsArray,
    });

    alert("Faculty Added!");
    window.location.reload();
  };

  // Delete Faculty
  const removeFaculty = async (id) => {
    await deleteDoc(doc(db, "faculty", id));
    alert("Deleted!");
    window.location.reload();
  };

  // Start Editing
  const startEditing = (faculty) => {
    setEditingId(faculty.id);
    setEditName(faculty.name);
    setEditEmail(faculty.email);
    setEditPhone(faculty.phone || ""); // 🔥 EDIT PHONE FILL
    setEditDept(faculty.department || "");
    setEditSubjects(faculty.subjects ? faculty.subjects.join(", ") : "");
  };

  // Update Faculty
  const updateFaculty = async (id) => {
    if (!editName || !editEmail || !editDept || !editPhone)
      return alert("Fill all fields");

    const subjectsArray = editSubjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await updateDoc(doc(db, "faculty", id), {
      name: editName,
      email: editEmail,
      phone: editPhone, // 🔥 UPDATE PHONE
      department: editDept,
      subjects: subjectsArray,
    });

    alert("Updated!");
    setEditingId(null);
    window.location.reload();
  };

  // Search & Filter
  const filteredFaculty = facultyList
    .filter(
      (f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.email.toLowerCase().includes(search.toLowerCase()) ||
        (f.phone && f.phone.includes(search)) || // 🔥 SEARCH BY PHONE
        (f.subjects &&
          f.subjects.some((sub) =>
            sub.toLowerCase().includes(search.toLowerCase())
          ))
    )
    .filter((f) => (filterDept === "" ? true : f.department === filterDept));

  // Unique Departments
  const departments = [
    ...new Set(facultyList.map((f) => f.department).filter(Boolean)),
  ];

  return (
    <div className="faculty-container">
      <h1 className="title">Faculty Dashboard</h1>

      {/* Add Faculty */}
      <div className="add-box">
        <input
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <input
          placeholder="Phone Number"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
        />
        <input
          placeholder="Department"
          value={newDept}
          onChange={(e) => setNewDept(e.target.value)}
        />
        <input
          placeholder="Subjects (comma separated)"
          value={newSubjects}
          onChange={(e) => setNewSubjects(e.target.value)}
        />
        <button onClick={addFaculty}>Add</button>
      </div>

      {/* Search & Filter */}
      <div className="search-filter-box">
        <input
          placeholder="Search by name, email, phone or subject"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept, idx) => (
            <option key={idx} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Faculty Table */}
      <table className="faculty-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th> {/* 🔥 PHONE ADDED */}
            <th>Department</th>
            <th>Subjects</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredFaculty.map((f, i) => (
            <tr key={f.id}>
              <td>{i + 1}</td>

              {editingId === f.id ? (
                <>
                  <td>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={editDept}
                      onChange={(e) => setEditDept(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={editSubjects}
                      onChange={(e) => setEditSubjects(e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={() => updateFaculty(f.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{f.name}</td>
                  <td>{f.email}</td>
                  <td>{f.phone}</td> {/* 🔥 SHOW PHONE */}
                  <td>{f.department}</td>
                  <td>{f.subjects ? f.subjects.join(", ") : ""}</td>
                  <td>
                    <button onClick={() => startEditing(f)}>Edit</button>
                    <button
                      className="delete-btn"
                      onClick={() => removeFaculty(f.id)}
                    >
                      ✖
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
