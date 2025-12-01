import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

async function getEmployee(id) {
    const res = await api.get(`/api/v1/emp/employees/${id}`);
    return res.data; // backend returns { employee_id, first_name, ... }
}

function EmpDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery({
        queryKey: ["employee", id],
        queryFn: () => getEmployee(id),
    });

    if (isLoading) return <p style={{ padding: 10 }}>Loading...</p>;
    if (error) return <p style={{ padding: 10, color: "red" }}>Error loading employee</p>;
    if (!data) return <p style={{ padding: 10 }}>Employee not found</p>;

    const emp = data;
    const isAbsolute =
        typeof emp.profileImage === "string" &&
        emp.profileImage.startsWith("http");
    const imgSrc = emp.profileImage
        ? isAbsolute
            ? emp.profileImage
            : `http://localhost:8080${emp.profileImage}`
        : null;

    return (
        <div className="container mt-4 d-flex justify-content-center">
            <div className="card shadow-lg rounded-4 p-2" style={{ width: "28rem" }}>
                <div className="card-body text-center">
                    <button
                        onClick={() => navigate("/employees")}
                        className="btn btn-outline-secondary mb-3">Back to Employees</button>
                    <h3 className="card-title mb-4">Employee Details</h3>

                    {imgSrc && (
                        <div className="mb-3">
                            <img
                                src={imgSrc}
                                alt="Profile"
                                className="rounded-circle border"
                                style={{ width: 120, height: 120, objectFit: "cover" }}
                            />
                        </div>
                    )}

                    <div className="text-start px-3" style={{ lineHeight: 1.5 }}>
                        <div><strong>ID:</strong> {emp.employee_id}</div>
                        <div><strong>First Name:</strong> {emp.first_name}</div>
                        <div><strong>Last Name:</strong> {emp.last_name}</div>
                        <div><strong>Email:</strong> {emp.email}</div>
                        <div><strong>Department:</strong> {emp.department}</div>
                        <div><strong>Position:</strong> {emp.position}</div>
                        <div><strong>Salary:</strong> {emp.salary}</div>
                        <div><strong>Date of Joining:</strong> {emp.date_of_joining && new Date(emp.date_of_joining).toLocaleDateString()}</div>
                        <div><strong>Created At:</strong> {emp.created_at && new Date(emp.created_at).toLocaleString()}</div>
                        <div><strong>Updated At:</strong> {emp.updated_at && new Date(emp.updated_at).toLocaleString()}</div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default EmpDetails;