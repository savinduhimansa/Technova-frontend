import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from "jspdf-autotable";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const AdminStaffPage = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [newStaff, setNewStaff] = useState({
    staffId: '',
    name: '',
    role: '',
    email: '',
    age: '',
    password: '',
    address: '',
    isDisable: false
  });
  const [editingStaff, setEditingStaff] = useState(null);
  const [togglingStaffId, setTogglingStaffId] = useState(null);
  const [loggedInStaff, setLoggedInStaff] = useState([]);
  const [newlyCreatedStaff, setNewlyCreatedStaff] = useState([]);

  const fetchStaffMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/staff', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allStaff = response.data.staffMembers;

      const loggedIn = allStaff.filter(staff => staff.lastLogin);
      const newlyCreated = allStaff.filter(staff => !staff.lastLogin);

      setLoggedInStaff(loggedIn);
      setNewlyCreatedStaff(newlyCreated);
      setStaffMembers(allStaff);

      toast.success("Staff data loaded successfully.");
    } catch (error) {
      console.error("Failed to fetch staff data:", error);
      toast.error("Failed to load staff data.");
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const handleAddInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStaff(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingStaff(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditClick = (staff) => {
    setEditingStaff(staff);
  };

  const handleToggleAccountStatus = async (staffId) => {
    if (togglingStaffId) return;

    setTogglingStaffId(staffId);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5001/api/staff/toggle-status/${staffId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      fetchStaffMembers();
    } catch (error) {
      console.error("Failed to toggle staff status:", error);
      toast.error(error.response?.data?.message || "Failed to toggle account status.");
    } finally {
      setTogglingStaffId(null);
    }
  };

  const addStaff = async (e) => {
    e.preventDefault();
    if (newStaff.age < 18) {
      toast.error("Staff member must be 18 years or older.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5001/api/staff/add',
        newStaff,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Staff member added successfully!");
      fetchStaffMembers();
      setNewStaff({
        staffId: '', name: '', role: '', email: '', age: '', password: '', address: '', isDisable: false
      });
    } catch (error) {
      console.error("Failed to add staff:", error);
      toast.error(error.response?.data?.message || "Failed to add staff member.");
    }
  };

  const editStaff = async (e) => {
    e.preventDefault();
    if (!editingStaff) return;
    if (editingStaff.age < 18) {
      toast.error("Staff member must be 18 years or older.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5001/api/staff/${editingStaff._id}`,
        editingStaff,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Staff member updated successfully!");
      fetchStaffMembers();
      setEditingStaff(null);
    } catch (error) {
      console.error("Failed to update staff:", error);
      toast.error(error.response?.data?.message || "Failed to update staff member.");
    }
  };

  // This function will handle the actual API call and toast feedback
  const confirmDeleteStaff = async (staffId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5001/api/staff/${staffId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Staff member deleted successfully!");
      fetchStaffMembers();
    } catch (error) {
      console.error("Failed to delete staff:", error);
      toast.error(error.response?.data?.message || "Failed to delete staff member.");
    }
  };

  const deleteStaff = (staffId) => {
    toast((t) => (
      <div className="custom-toast-content bg-white border border-[#BFDBFE] text-[#1E3A8A] rounded-xl p-4 shadow">
        <p className="text-sm">Are you sure you want to delete this staff member? This action cannot be undone.</p>
        <div className="toast-buttons mt-3 flex gap-2 justify-end">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              confirmDeleteStaff(staffId);
            }}
            className="toast-btn-yes rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] text-white px-3 py-1.5 text-sm font-semibold transition"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="toast-btn-no rounded-lg border border-[#BFDBFE] text-[#1E40AF] px-3 py-1.5 text-sm font-semibold hover:bg-[#EFF6FF] transition"
          >
            No
          </button>
        </div>
      </div>
    ), {
      duration: 99999,
      style: { minWidth: '350px' },
    });
  };

  const handleClearForm = () => {
    setNewStaff({
      staffId: '', name: '', role: '', email: '', age: '', password: '', address: '', isDisable: false
    });
  };

  //download pdf

  const downloadPdf = (staffToDownload, title) => {
    const doc = new jsPDF();
    doc.text(title, 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Name', 'Role', 'Email', 'Age', 'Address', 'Status', 'Last Login']],
      body: staffToDownload.map(staff => [
        staff.staffId,
        staff.name,
        staff.role,
        staff.email,
        staff.age,
        staff.address,
        staff.isDisable ? 'Deactivated' : 'Active',
        staff.lastLogin ? new Date(staff.lastLogin).toLocaleString() : 'N/A'
      ]),
    });
    doc.save(`${title.toLowerCase().replace(/ /g, '-')}.pdf`);
  };

  const renderStaffTable = (staffToRender) => (
    <div className="table-responsive overflow-x-auto rounded-xl border border-[#BFDBFE] bg-[#DBEAFE] shadow-sm">
      <table className="staff-table w-full text-sm text-left">
        <thead className="bg-[#BFDBFE] text-[#1E40AF]">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Age</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffToRender.map(staff => (
            <tr key={staff._id} className="border-b border-[#BFDBFE] hover:bg-[#EFF6FF]">
              <td className="px-4 py-2 text-[#1E3A8A]">{staff.staffId}</td>
              <td className="px-4 py-2 text-[#1E3A8A]">{staff.name}</td>
              <td className="px-4 py-2 text-[#1E3A8A]">{staff.role}</td>
              <td className="px-4 py-2 text-[#1E3A8A]">{staff.email}</td>
              <td className="px-4 py-2 text-[#1E3A8A]">{staff.age}</td>
              <td className="px-4 py-2 text-[#1E3A8A]">{staff.address}</td>
              <td className="px-4 py-2">
                {staff.isDisable ? (
                  <span className="deactivated-status inline-flex items-center rounded-full bg-[#EF4444]/10 text-[#EF4444] px-2.5 py-0.5 text-xs border border-[#EF4444]/40">
                    Deactivated
                  </span>
                ) : (
                  <span className="active-status inline-flex items-center rounded-full bg-[#22C55E]/10 text-[#22C55E] px-2.5 py-0.5 text-xs border border-[#22C55E]/40">
                    Active
                  </span>
                )}
              </td>
              <td className="px-4 py-2">
                <button className="edit-btn inline-flex items-center justify-center rounded-lg border border-[#BFDBFE] text-[#1E40AF] px-2.5 py-1.5 mr-2 hover:bg-[#EFF6FF]"
                onClick={() => handleEditClick(staff)}  
                >
                  <FaEdit />
                </button>
                <button
                  className={`${staff.isDisable ? 'activate' : 'deactivate'} inline-flex items-center justify-center rounded-lg px-2.5 py-1.5 mr-2 text-white ${staff.isDisable ? 'bg-[#22C55E] hover:bg-[#16A34A]' : 'bg-[#3B82F6] hover:bg-[#1E40AF]'} transition`}
                  onClick={() => handleToggleAccountStatus(staff._id)}
                  disabled={togglingStaffId === staff._id}>
                  {staff.isDisable ? 'Activate' : 'Deactivate'}
                </button>
                <button
                  className="delete-btn inline-flex items-center justify-center rounded-lg bg-[#EF4444] hover:bg-[#DC2626] px-2.5 py-1.5 text-white transition"
                  onClick={() => deleteStaff(staff._id)}
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
    <div className="admin-staff-container min-h-screen bg-gradient-to-br from-[#DBEAFE] via-[#E0ECFF] to-white text-[#1E3A8A] p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#1E40AF]">Add New Staff</h2>

      <form
        className="staff-form grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-white border border-[#BFDBFE] p-4 rounded-xl shadow-sm"
        onSubmit={addStaff}
      >
        <input
          type="text"
          name="staffId"
          placeholder="Staff ID"
          value={newStaff.staffId}
          onChange={handleAddInputChange}
          required
          className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newStaff.name}
          onChange={handleAddInputChange}
          required
          className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
        />
        <select
          name="role"
          value={newStaff.role}
          onChange={handleAddInputChange}
          required
          className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
        >
          <option value="" disabled>Select a role</option>
          <option value="productManager">Product Manager</option>
          <option value="inventoryManager">Inventory Manager</option>
          <option value="technician">Technician</option>
          <option value="salesManager">Sales Manager</option>
        </select>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newStaff.email}
          onChange={handleAddInputChange}
          required
          className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={newStaff.age}
          onChange={handleAddInputChange}
          required
          className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={newStaff.password}
          onChange={handleAddInputChange}
          required
          className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={newStaff.address}
          onChange={handleAddInputChange}
          required
          className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] md:col-span-2 lg:col-span-1"
        />
        <div className="col-span-full flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white shadow transition"
          >
            Add Staff
          </button>
          <button
            type="button"
            onClick={handleClearForm}
            className="rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] px-4 py-2 text-sm font-semibold transition"
          >
            Clear Form
          </button>
        </div>
      </form>

      <hr className="border-[#BFDBFE]" />

      {editingStaff && (
        <>
          <h2 className="text-2xl font-bold text-[#1E40AF]">Edit Staff Member</h2>
          <form
            className="staff-form grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-white border border-[#BFDBFE] p-4 rounded-xl shadow-sm"
            onSubmit={editStaff}
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={editingStaff.name}
              onChange={handleEditInputChange}
              required
              className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={editingStaff.role}
              onChange={handleEditInputChange}
              required
              className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={editingStaff.email}
              onChange={handleEditInputChange}
              required
              className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={editingStaff.age}
              onChange={handleEditInputChange}
              required
              className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={editingStaff.address}
              onChange={handleEditInputChange}
              required
              className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
            />
            <label className="flex items-center gap-2 text-sm text-[#1E3A8A]">
              Is Disabled:
              <input
                type="checkbox"
                name="isDisable"
                checked={editingStaff.isDisable}
                onChange={handleEditInputChange}
                className="h-4 w-4 accent-[#3B82F6]"
              />
            </label>
            <div className="col-span-full flex gap-3">
              <button
                type="submit"
                className="rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white shadow transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] px-4 py-2 text-sm font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
          <hr className="border-[#BFDBFE]" />
        </>
      )}

      <h2 className="text-xl font-semibold text-[#1E40AF]">Logged-In Staff</h2>
      <button
        className="download-btn rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white shadow transition mb-3"
        onClick={() => downloadPdf(loggedInStaff, 'Logged-In Staff Report')}
      >
        Download Logged-In Staff PDF
      </button>
      {loggedInStaff.length > 0 ? (
        renderStaffTable(loggedInStaff)
      ) : (
        <p className="text-[#1E3A8A]">No staff members have logged in yet.</p>
      )}
      <hr className="border-[#BFDBFE]" />

      <h2 className="text-xl font-semibold text-[#1E40AF]">Newly Created Staff (Never Logged In)</h2>
      <button
        className="download-btn rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white shadow transition mb-3"
        onClick={() => downloadPdf(newlyCreatedStaff, 'Newly Created Staff Report')}
      >
        Download New Staff PDF
      </button>
      {newlyCreatedStaff.length > 0 ? (
        renderStaffTable(newlyCreatedStaff)
      ) : (
        <p className="text-[#1E3A8A]">No new staff accounts have been created recently.</p>
      )}
    </div>
  );
};

export default AdminStaffPage;
