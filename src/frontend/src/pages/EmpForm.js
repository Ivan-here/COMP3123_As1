import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function EmpForm({ mode }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        position: "",
        salary: "",
        date_of_joining: "",
        department: "",
    });

    const [profileImageFile, setProfileImageFile] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (mode === "edit" && id) {
            api.get(`/api/v1/emp/employees/${id}`).then((res) => {
                const emp = res.data;
                setForm({
                    first_name: emp.first_name || "",
                    last_name: emp.last_name || "",
                    email: emp.email || "",
                    position: emp.position || "",
                    salary: emp.salary || "",
                    date_of_joining: emp.date_of_joining
                        ? emp.date_of_joining.substring(0, 10)
                        : "",
                    department: emp.department || "",
                });
            });
        }
    }, [mode, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setProfileImageFile(e.target.files[0] || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value !== "" && value !== null) {
                    formData.append(key, value);
                }
            });

            if (profileImageFile) {
                formData.append("profileImage", profileImageFile);
            }

            if (mode === "create") {
                await api.post("/api/v1/emp/employees", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await api.put(`/api/v1/emp/employees/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            navigate("/employees");
        } catch (err) {
            setError(err.response?.data?.message || "Error saving employee");
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h3 className="card-title mb-3">
                        {mode === "create" ? "Add Employee" : "Edit Employee"}
                    </h3>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">First Name</label>
                                <input
                                    className="form-control"
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    required={mode === "create"}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Last Name</label>
                                <input
                                    className="form-control"
                                    name="last_name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    required={mode === "create"}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required={mode === "create"}
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Position</label>
                                <input
                                    className="form-control"
                                    name="position"
                                    value={form.position}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Department</label>
                                <input
                                    className="form-control"
                                    name="department"
                                    value={form.department}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Salary</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="salary"
                                    value={form.salary}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Date of Joining</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="date_of_joining"
                                    value={form.date_of_joining}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Profile Picture</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-secondary me-2"
                                onClick={() => navigate("/employees")}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {mode === "create" ? "Create" : "Update"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EmpForm;