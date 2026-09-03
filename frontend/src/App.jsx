import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001/api';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error('Could not load users');
      setUsers(await response.json());
    } catch (requestError) {
      setError(`${requestError.message}. Is the backend running on port 3001?`);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function resetForm() {
    setForm({ name: '', email: '' });
    setEditingId(null);
  }

  async function saveUser(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    const isEditing = Boolean(editingId);
    const response = await fetch(`${API_URL}/users${isEditing ? `/${editingId}` : ''}`, {
      method: isEditing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || 'Could not save user');
      return;
    }
    setUsers(isEditing ? users.map((user) => (user._id === editingId ? data : user)) : [data, ...users]);
    setMessage(isEditing ? 'User updated.' : 'User created.');
    resetForm();
  }

  async function deleteUser(id) {
    if (!window.confirm('Delete this user?')) return;
    const response = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      setError('Could not delete user');
      return;
    }
    setUsers(users.filter((user) => user._id !== id));
    setMessage('User deleted.');
  }

  return (
    <main className="page">
      <header>
        <p className="eyebrow">MongoDB user records</p>
        <h1>Simple user CRUD</h1>
        <p className="intro">Create, view, edit, and remove users through your backend API.</p>
      </header>
      <section className="layout">
        <form className="panel form" onSubmit={saveUser}>
          <h2>{editingId ? 'Edit user' : 'Add user'}</h2>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required minLength="2" />
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <button type="submit">{editingId ? 'Update user' : 'Create user'}</button>
          {editingId && <button className="secondary" type="button" onClick={resetForm}>Cancel</button>}
        </form>
        <section className="panel">
          <div className="list-header"><h2>Users ({users.length})</h2><button className="secondary" onClick={loadUsers}>Refresh</button></div>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
          {!loading && !error && users.length === 0 && <p>No users found.</p>}
          <div className="users">
            {users.map((user) => (
              <article className="user" key={user._id}>
                <div><strong>{user.name}</strong><span>{user.email}</span></div>
                <div className="actions"><button className="secondary" onClick={() => { setEditingId(user._id); setForm({ name: user.name, email: user.email }); }}>Edit</button><button className="delete" onClick={() => deleteUser(user._id)}>Delete</button></div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
