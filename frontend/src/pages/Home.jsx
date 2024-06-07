import { useState, useEffect } from 'react';
import api from '../api';
import Note from '../components/Note'
import '../styles/Home.css'

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    try {
      const res = await api.get('/api/notes/');
      console.log(res);
      setNotes(res.data);
    } catch (error) {
      alert(error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const res = await api.delete(`/api/notes/delete/${id}/`);
      console.log(res);
      if (res.status === 204) {
        alert('Note deleted!');
        getNotes();
      } else {
        alert('Failed to delete note.');
      }
    } catch (error) {
      alert(error);
    }
  };

  const createNote = async (e) => {
    e.preventDefault();

    try {
      const payload = { content, title };
      const res = await api.post('/api/notes/', payload);

      if (res.status === 201) {
        alert('Note created!');
        getNotes();
      } else {
        alert('Failed to make note.');
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <div>
        <h2>Notes</h2>
        {notes.map((note) => <Note note={note} onDelete={deleteNote} key={note.id} />)}
      </div>
      <h2>Create a Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <input type="submit" value="Submit"></input>
      </form>
    </div>
  );
}

export default Home;
