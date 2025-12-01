import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

async function getEmployees(department) {
    // if department is provided, call search endpoint
    const url = department
        ? "/api/v1/emp/employees/search"
        : "/api/v1/emp/employees";

    const res = await api.get(url, {
        params: department ? { department } : {},
    });

    return res.data;
}

function EmpList() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [deptInput, setDeptInput] = useState("");
    const [deptFilter, setDeptFilter] = useState("");

    const { data, isLoading, error } = useQuery({
        queryKey: ["employees", { department: deptFilter }],
        queryFn: () => getEmployees(deptFilter),
    });

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this employee?")) return;

        try {
            await api.delete("/api/v1/emp/employees", {
                params: { eid: id },
            });
            queryClient.invalidateQueries(["employees"]);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to delete employee");
        }
    };

    const applySearch = () => {
        setDeptFilter(deptInput.trim());
    };

    const clearSearch = () => {
        setDeptInput("");
        setDeptFilter("");
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <span className="navbar-brand">Employee Manager</span>
                    <div className="ms-auto">
                        <button
                            className="btn btn-outline-light me-2"
                            onClick={() => navigate("/employees/new")}
                        >
                            Add Employee
                        </button>
                        <button className="btn btn-outline-warning" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="mb-0">Employees</h2>
                    <div className="d-flex">
                        <input
                            type="text"
                            className="form-control form-control-sm me-2"
                            placeholder="Search by Department"
                            value={deptInput}
                            onChange={(e) => setDeptInput(e.target.value)}
                            style={{ width: "220px" }}
                        />
                        <button
                            className="btn btn-sm btn-primary me-2"
                            type="button"
                            onClick={applySearch}
                        >
                            Search
                        </button>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            type="button"
                            onClick={clearSearch}
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {isLoading && <div className="alert alert-info">Loading...</div>}
                {error && (
                    <div className="alert alert-danger">Error loading employees</div>
                )}
                {data && Array.isArray(data) && (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover align-middle">
                            <thead className="table-dark">
                            <tr>
                                <th scope="col">Profile</th>
                                <th scope="col">First Name</th>
                                <th scope="col">Last Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Department</th>
                                <th scope="col">Position</th>
                                <th scope="col">Salary</th>
                                <th scope="col">Date of Joining</th>
                                <th scope="col" style={{ width: "220px" }}>
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((emp) => {
                                const id = emp.employee_id || emp._id;

                                const isAbsolute =
                                    typeof emp.profileImage === "string" &&
                                    emp.profileImage.startsWith("http");
                                const imgSrc = emp.profileImage
                                    ? isAbsolute
                                        ? emp.profileImage
                                        : `http://localhost:8080${emp.profileImage}`
                                    : null;

                                return (
                                    <tr key={id}>
                                        <td>
                                            {imgSrc && (
                                                <img
                                                    src={imgSrc}
                                                    alt="Profile"
                                                    className="rounded-circle"
                                                    style={{
                                                        width: "60px",
                                                        height: "60px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            )}
                                        </td>
                                        <td>{emp.first_name}</td>
                                        <td>{emp.last_name}</td>
                                        <td>{emp.email}</td>
                                        <td>{emp.department}</td>
                                        <td>{emp.position}</td>
                                        <td>{emp.salary}</td>
                                        <td>
                                            {emp.date_of_joining &&
                                                new Date(
                                                    emp.date_of_joining
                                                ).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => navigate(`/employees/${id}`)}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-secondary me-2"
                                                onClick={() => navigate(`/employees/${id}/edit`)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

export default EmpList;