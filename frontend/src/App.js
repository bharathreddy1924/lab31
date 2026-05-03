import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "/api";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");

  const [posts, setPosts] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // ===== USER CRUD =====
  const fetchUsers = useCallback(async ()=> {
    const res = await axios.get(`${API}/user`);
    setUsers(res.data);
  }, []);

  const addUser = async ()=> {
    await axios.post(`${API}/user`, {name});
    setName("");
    fetchUsers();
  };

  const deleteUser = async(id)=> {
    await axios.delete(`${API}/user/${id}`);
    fetchUsers();
  };

  // ===== ONE TO MANY =====
  const addPost = async ()=> {
    await axios.post(`${API}/post`, {
      title: postTitle,
      userId: selectedUser
    });
    setPostTitle("");
    fetchPosts();
  };

  const fetchPosts = useCallback(async ()=> {
    const res = await axios.get(`${API}/post`);
    setPosts(res.data);
  }, []);

  // ===== MANY TO MANY =====
  const addStudent = async ()=> {
    await axios.post(`${API}/student`, {name: studentName});
    setStudentName("");
    fetchStudents();
  };

  const addCourse = async ()=> {
    await axios.post(`${API}/course`, {title: courseName});
    setCourseName("");
    fetchCourses();
  };

  const enroll = async ()=> {
    await axios.post(`${API}/enroll`, {
      studentId: selectedStudent,
      courseId: selectedCourse
    });
    fetchStudents();
    fetchCourses();
  };

  const fetchStudents = useCallback(async ()=> {
    const res = await axios.get(`${API}/student`);
    setStudents(res.data);
  }, []);

  const fetchCourses = useCallback(async ()=> {
    const res = await axios.get(`${API}/course`);
    setCourses(res.data);
  }, []);

  useEffect(()=>{
    fetchUsers();
    fetchPosts();
    fetchStudents();
    fetchCourses();
  }, [fetchUsers, fetchPosts, fetchStudents, fetchCourses]);

  return (
    <div style={{padding:"20px"}}>

      <h1>🚀 MERN CRUD + Relationships</h1>

      {/* USER CRUD */}
      <h2>👤 User CRUD</h2>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name"/>
      <button onClick={addUser}>Add</button>

      {users.map(u=>(
        <div key={u._id}>
          {u.name}
          <button onClick={()=>deleteUser(u._id)}>Delete</button>
        </div>
      ))}

      {/* ONE TO MANY */}
      <h2>🧠 One-to-Many (User → Posts)</h2>

      <select onChange={(e)=>setSelectedUser(e.target.value)}>
        <option>Select User</option>
        {users.map(u=>(
          <option key={u._id} value={u._id}>{u.name}</option>
        ))}
      </select>

      <input placeholder="Post Title" onChange={(e)=>setPostTitle(e.target.value)} />
      <button onClick={addPost}>Add Post</button>

      {posts.map(p=>(
        <div key={p._id}>
          {p.title} → {p.userId?.name}
        </div>
      ))}

      {/* MANY TO MANY */}
      <h2>🔗 Many-to-Many (Students ↔ Courses)</h2>

      <input placeholder="Student Name" onChange={(e)=>setStudentName(e.target.value)} />
      <button onClick={addStudent}>Add Student</button>

      <input placeholder="Course Name" onChange={(e)=>setCourseName(e.target.value)} />
      <button onClick={addCourse}>Add Course</button>

      <br/><br/>

      <select onChange={(e)=>setSelectedStudent(e.target.value)}>
        <option>Select Student</option>
        {students.map(s=>(
          <option key={s._id} value={s._id}>{s.name}</option>
        ))}
      </select>

      <select onChange={(e)=>setSelectedCourse(e.target.value)}>
        <option>Select Course</option>
        {courses.map(c=>(
          <option key={c._id} value={c._id}>{c.title}</option>
        ))}
      </select>

      <button onClick={enroll}>Enroll</button>

      <h3>Students</h3>
      {students.map(s=>(
        <div key={s._id}>
          {s.name} → {s.courses.map(c=>c.title).join(", ")}
        </div>
      ))}

      <h3>Courses</h3>
      {courses.map(c=>(
        <div key={c._id}>
          {c.title} → {c.students.map(s=>s.name).join(", ")}
        </div>
      ))}

    </div>
  );
}

export default App;
