import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from "jspdf-autotable";
import { FaEdit } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    password: '',
    phone: '',
    isDisable: false,
    isEmailVerified: false
  });
  const [editingUser, setEditingUser] = useState(null);
  const [togglingUserId, setTogglingUserId] = useState(null);

  const [loggedInUsers, setLoggedInUsers] = useState([]);
  const [newlyCreatedUsers, setNewlyCreatedUsers] = useState([]);

  // NEW: Admin users list
  const [adminUsers, setAdminUsers] = useState([]);

  const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5001/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const allUsers = response.data.users;
    const isAdmin = (role) => String(role || '').toLowerCase() === 'admin';

    // Split once
    const admins = allUsers.filter(u => isAdmin(u.role));
    const nonAdmins = allUsers.filter(u => !isAdmin(u.role));

    // Exclude admins from these two tables
    const loggedIn = nonAdmins.filter(u => u.lastLogin);
    const newlyCreated = nonAdmins.filter(u => !u.lastLogin);

    setLoggedInUsers(loggedIn);
    setNewlyCreatedUsers(newlyCreated);
    setAdminUsers(admins);
    setUsers(allUsers);

    toast.success("User data loaded successfully.");
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    toast.error("Failed to load user data.");
  }
};
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingUser(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5001/api/user/add',
        newUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User added successfully!");
      fetchUsers();
      setNewUser({
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        role: 'user',
        password: '',
        phone: '',
        isDisable: false,
        isEmailVerified: false
      });
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error(error.response?.data?.message || "Failed to add user.");
    }
  };

  const editUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5001/api/user/${editingUser._id}`,
        editingUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User updated successfully!");
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(error.response?.data?.message || "Failed to update user.");
    }
  };

  const deleteUser = (userId) => {
    toast((t) => (
      <div className="bg-white border border-[#BFDBFE] text-[#1E3A8A] rounded-xl p-4 shadow">
        <p className="text-sm">Are you sure you want to delete this user? This action cannot be undone.</p>
        <div className="mt-3 flex justify-center gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              confirmDelete(userId);
            }}
            className="rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-3 py-1.5 text-sm font-semibold text-white transition"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] px-3 py-1.5 text-sm font-semibold transition"
          >
            No
          </button>
        </div>
      </div>
    ), { duration: 99999, style: { minWidth: '350px' } });
  };

  const confirmDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5001/api/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleClearForm = () => {
    setNewUser({
      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      role: 'user',
      password: '',
      phone: '',
      isDisable: false,
      isEmailVerified: false
    });
  };

  const downloadPdf = (users, title) => {
    const doc = new jsPDF();
    doc.text(title, 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['ID', 'First Name', 'Last Name', 'Email', 'Role', 'Phone', 'Disabled', 'Email Verified', 'Last Login']],
      body: users.map(user => [
        user.userId,
        user.firstName,
        user.lastName,
        user.email,
        user.role,
        user.phone || 'N/A',
        user.isDisable ? 'Yes' : 'No',
        user.isEmailVerified ? 'Yes' : 'No',
        user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'
      ]),
    });
    doc.save(`${title.toLowerCase().replace(/ /g, '-')}.pdf`);
  };

  const handleToggleAccountStatus = async (userId) => {
    if (togglingUserId) return;

    setTogglingUserId(userId);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5001/api/user/toggle-status/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      fetchUsers();
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast.error(error.response?.data?.message || "Failed to toggle account status.");
    } finally {
      setTogglingUserId(null);
    }
  };

  const renderUserTable = (usersToRender) => (
    <div className="table-responsive overflow-x-auto rounded-xl border border-[#BFDBFE] bg-[#DBEAFE] shadow-sm">
      <table className="user-table w-full text-sm text-left">
        <thead className="bg-[#BFDBFE] text-[#1E40AF]">
          <tr>
            <th className="px-4 py-2">User ID</th>
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Is Email Verified</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersToRender.map(user => (
            <tr key={user._id} className="border-b border-[#BFDBFE] hover:bg-[#EFF6FF]">
              <td className="px-4 py-2 text-[#1E3A8A]">{user.userId}</td>
              <td className="px-4 py-2 text-[#1E3A8A]">{user.firstName}</td>
              <td className="px-4 py-2 text-[#1E3A8A]">{user.lastName}</td>
              <td className="px-4 py-2 text-[#1E3A8A]">{user.email}</td>
              <td className="px-4 py-2 text-[#1E3A8A]">{user.role}</td>
              <td className="px-4 py-2 text-[#1E3A8A]">{user.phone}</td>
              <td className="px-4 py-2">
                {user.isDisable ? (
                  <span className="inline-flex items-center rounded-full bg-[#EF4444]/10 text-[#EF4444] px-2.5 py-0.5 text-xs border border-[#EF4444]/40">
                    Deactivated
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-[#22C55E]/10 text-[#22C55E] px-2.5 py-0.5 text-xs border border-[#22C55E]/40">
                    Active
                  </span>
                )}
              </td>
              <td className="px-4 py-2 text-[#1E3A8A]">{user.isEmailVerified ? 'Yes' : 'No'}</td>
              <td className="actions px-4 py-2 whitespace-nowrap">
                <button
                  className="inline-flex items-center justify-center rounded-lg border border-[#BFDBFE] text-[#1E40AF] px-2.5 py-1.5 mr-2 hover:bg-[#EFF6FF]"
                  onClick={() => setEditingUser(user)}
                >
                  <FaEdit />
                </button>
                <button
                  className={`${user.isDisable ? 'activate' : 'deactivate'} inline-flex items-center justify-center rounded-lg px-2.5 py-1.5 mr-2 text-white ${user.isDisable ? 'bg-[#22C55E] hover:bg-[#16A34A]' : 'bg-[#3B82F6] hover:bg-[#1E40AF]'} transition`}
                  onClick={() => handleToggleAccountStatus(user._id)}
                  disabled={togglingUserId === user._id}
                >
                  {user.isDisable ? 'Activate' : 'Deactivate'}
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-lg bg-[#EF4444] hover:bg-[#DC2626] px-2.5 py-1.5 text-white transition"
                  onClick={() => deleteUser(user._id)}
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="admin-user-container min-h-screen bg-gradient-to-br from-[#DBEAFE] via-[#E0ECFF] to-white text-[#1E3A8A] p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#1E40AF]">Add New User</h2>

      <form
        key="add-user-form"
        onSubmit={addUser}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-white border border-[#BFDBFE] p-4 rounded-xl shadow-sm"
      >
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={newUser.userId}
          onChange={handleAddInputChange}
          required
          className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={newUser.firstName}
          onChange={handleAddInputChange}
          required
          className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={newUser.lastName}
          onChange={handleAddInputChange}
          required
          className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleAddInputChange}
          required
          className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
        />
        <select
          name="role"
          value={newUser.role}
          onChange={handleAddInputChange}
          required
          className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
        >
          <option value="" disabled>Select a role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={newUser.password}
          onChange={handleAddInputChange}
          required
          className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={newUser.phone}
          onChange={handleAddInputChange}
          className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
        />
        <label className="flex items-center gap-2 text-sm text-[#1E3A8A]">
          Is Disabled:
          <input type="checkbox" name="isDisable" checked={newUser.isDisable} onChange={handleAddInputChange} className="h-4 w-4 accent-[#3B82F6]" />
        </label>
        <label className="flex items-center gap-2 text-sm text-[#1E3A8A]">
          Is Email Verified:
          <input type="checkbox" name="isEmailVerified" checked={newUser.isEmailVerified} onChange={handleAddInputChange} className="h-4 w-4 accent-[#3B82F6]" />
        </label>
        <div className="col-span-full flex gap-3">
          <button type="submit" className="rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white shadow transition">Add User</button>
          <button type="button" onClick={handleClearForm} className="rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] px-4 py-2 text-sm font-semibold transition">Clear Form</button>
        </div>
      </form>

      <hr className="border-[#BFDBFE]" />

      {editingUser && (
        <>
          <h2 className="text-2xl font-bold text-[#1E40AF]">Edit User</h2>
          <form
            key="edit-user-form"
            onSubmit={editUser}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-white border border-[#BFDBFE] p-4 rounded-xl shadow-sm"
          >
            <input type="text" name="userId" placeholder="User ID" value={editingUser.userId} onChange={handleEditInputChange} required className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]" />
            <input type="text" name="firstName" placeholder="First Name" value={editingUser.firstName} onChange={handleEditInputChange} required className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]" />
            <input type="text" name="lastName" placeholder="Last Name" value={editingUser.lastName} onChange={handleEditInputChange} required className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]" />
            <input type="email" name="email" placeholder="Email" value={editingUser.email} onChange={handleEditInputChange} required className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]" />
            <select name="role" value={editingUser.role} onChange={handleEditInputChange} required className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <input type="text" name="phone" placeholder="Phone" value={editingUser.phone} onChange={handleEditInputChange} className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]" />
            <label className="flex items-center gap-2 text-sm text-[#1E3A8A]">
              Is Disabled:
              <input type="checkbox" name="isDisable" checked={editingUser.isDisable} onChange={handleEditInputChange} className="h-4 w-4 accent-[#3B82F6]" />
            </label>
            <label className="flex items-center gap-2 text-sm text-[#1E3A8A]">
              Is Email Verified:
              <input type="checkbox" name="isEmailVerified" checked={editingUser.isEmailVerified} onChange={handleEditInputChange} className="h-4 w-4 accent-[#3B82F6]" />
            </label>
            <div className="col-span-full flex gap-3">
              <button type="submit" className="rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white shadow transition">Save Changes</button>
              <button type="button" onClick={() => setEditingUser(null)} className="rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] px-4 py-2 text-sm font-semibold transition">Cancel</button>
            </div>
          </form>
          <hr className="border-[#BFDBFE]" />
        </>
      )}

      <h2 className="text-xl font-semibold text-[#1E40AF]">Logged-In Accounts</h2>
      <button
        className="rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white shadow transition mb-3"
        onClick={() => downloadPdf(loggedInUsers, 'Logged-In Accounts')}
      >
        Download Logged-In Users PDF
      </button>
      {loggedInUsers.length > 0 ? (
        renderUserTable(loggedInUsers)
      ) : (
        <p className="text-[#1E3A8A]">No users have logged in yet.</p>
      )}

      <hr className="border-[#BFDBFE]" />

      <h2 className="text-xl font-semibold text-[#1E40AF]">Newly Created Accounts (Never Logged In)</h2>
      <button
        className="rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white shadow transition mb-3"
        onClick={() => downloadPdf(newlyCreatedUsers, 'Newly Created Accounts')}
      >
        Download New Users PDF
      </button>
      {newlyCreatedUsers.length > 0 ? (
        renderUserTable(newlyCreatedUsers)
      ) : (
        <p className="text-[#1E3A8A]">No new accounts have been created recently.</p>
      )}

      <hr className="border-[#BFDBFE]" />

      {/* NEW: Admin-only table */}
      <h2 className="text-xl font-semibold text-[#1E40AF]">Admin Accounts</h2>
      <button
        className="rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white shadow transition mb-3"
        onClick={() => downloadPdf(adminUsers, 'Admin Accounts')}
      >
        Download Admin Users PDF
      </button>
      {adminUsers.length > 0 ? (
        renderUserTable(adminUsers)
      ) : (
        <p className="text-[#1E3A8A]">No admin accounts found.</p>
      )}
    </div>
  );
};

export default AdminUserPage;
