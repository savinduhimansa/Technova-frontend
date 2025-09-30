import React, { useEffect, useState } from "react";
import axios from "axios";

// Options same as add build form
const options = {
  cpu: ["Intel i9", "Intel i7", "Intel i5", "AMD Ryzen 9", "AMD Ryzen 7", "AMD Ryzen 5"],
  motherboard: ["ASUS ROG Strix Z690", "MSI B550 Tomahawk", "Gigabyte X570 Aorus Elite"],
  ram: ["Corsair Vengeance 16GB", "G.Skill TridentZ 32GB", "Kingston Fury 16GB"],
  gpu: ["NVIDIA RTX 4090", "NVIDIA RTX 4070", "AMD Radeon RX 7900XT", "AMD Radeon RX 6800"],
  case: ["NZXT H510", "Corsair iCUE 4000X", "Cooler Master MasterBox TD500"],
  ssd: ["Samsung 980 Pro 1TB", "WD Black SN850X 1TB", "Crucial P5 Plus 1TB"],
  hdd: ["Seagate Barracuda 2TB", "WD Blue 2TB", "Toshiba X300 4TB"],
  psu: ["Corsair RM850x", "EVGA SuperNOVA 750W", "Seasonic Focus GX-650W"],
  fans: ["Noctua NF-A12", "Corsair LL120", "Cooler Master SickleFlow"]
};

export default function MyPCRequest() {
  const [builds, setBuilds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/builds/");
        setBuilds(res.data);
      } catch (err) {
        console.error("Error fetching builds:", err);
      }
    };
    fetchBuilds();
  }, []);

  const handleEditClick = (build) => {
    setEditingId(build._id);
    setEditData({ ...build });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSave = async (buildId) => {
    try {
      const res = await axios.put(`http://localhost:5001/api/builds/${buildId}`, editData);
      setBuilds(builds.map((b) => (b._id === buildId ? res.data : b)));
      setEditingId(null);
      setEditData({});
      alert("Build updated successfully!");
    } catch (err) {
      console.error("Error updating build:", err);
      alert("Failed to update build");
    }
  };

  const handleDelete = async (buildId) => {
    if (!window.confirm("Are you sure you want to delete this build?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/builds/${buildId}`);
      setBuilds(builds.filter((b) => b._id !== buildId));
      alert("Build deleted successfully");
    } catch (err) {
      console.error("Error deleting build:", err);
      alert("Failed to delete build");
    }
  };

  const handlePay = (build) => {
    alert(`Proceed to pay $${build.totalPrice || 0} for ${build.customerEmail}`);
    // Integrate payment gateway logic here
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 font-semibold";
      case "rejected":
        return "text-red-600 font-semibold";
      case "pending":
      default:
        return "text-[#1E3A8A]/80 font-semibold";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DBEAFE] via-[#EFF6FF] to-white p-6">
      <div className="w-full">
        <h2 className="text-3xl font-extrabold mb-6 text-[#1E3A8A]/80 text-center">
          💻 My PC Requests
        </h2>

        <div className="overflow-x-auto w-full">
          <table className="w-full bg-white border border-[#BFDBFE] rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.25)]">
            <thead className="bg-blue-100 rounded-t-2xl">
              <tr>
                <th className="p-3 border text-left">Customer Email</th>
                {Object.keys(options).map((field) => (
                  <th key={field} className="p-3 border text-left capitalize">{field}</th>
                ))}
                <th className="p-3 border text-left">Total Price</th>
                <th className="p-3 border text-left">Status</th>
                <th className="p-3 border text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {builds.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center p-4 text-gray-500">
                    No PC requests found.
                  </td>
                </tr>
              ) : (
                builds.map((b) => (
                  <tr key={b._id} className="border-b hover:bg-gray-50">
                    <td className="p-2 border">{b.customerEmail || "-"}</td>

                    {Object.keys(options).map((field) => (
                      <td key={field} className="p-2 border">
                        {editingId === b._id ? (
                          <select
                            value={editData[field] || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, [field]: e.target.value })
                            }
                            className="border rounded p-1 w-full focus:ring-1 focus:ring-blue-400"
                          >
                            <option value="">Select {field}</option>
                            {options[field].map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          b[field] || "-"
                        )}
                      </td>
                    ))}

                    <td className="p-2 border font-semibold text-blue-600">${b.totalPrice || 0}</td>
                    <td className={`p-2 border ${getStatusClass(b.status)}`}>{b.status || "pending"}</td>
                    <td className="p-2 border space-x-2">
                      {editingId === b._id ? (
                        <>
                          <button
                            onClick={() => handleSave(b._id)}
                            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {b.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleEditClick(b)}
                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Update
                              </button>
                              <button
                                onClick={() => handleDelete(b._id)}
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </>
                          )}
                          {b.status === "approved" && (
                            <button
                              onClick={() => handlePay(b)}
                              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Pay
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
