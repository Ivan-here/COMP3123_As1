import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmployeeList from "./pages/EmpList";
import EmployeeForm from "./pages/EmpForm";
import EmployeeDetails from "./pages/EmpDetails";

function TokenRoute({ children }) {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route
                    path="/employees"
                    element={
                        <TokenRoute>
                            <EmployeeList />
                        </TokenRoute>
                    }
                />
                <Route
                    path="/employees/new"
                    element={
                        <TokenRoute>
                            <EmployeeForm mode="create" />
                        </TokenRoute>
                    }
                />
                <Route
                    path="/employees/:id"
                    element={
                        <TokenRoute>
                            <EmployeeDetails />
                        </TokenRoute>
                    }
                />
                <Route
                    path="/employees/:id/edit"
                    element={
                        <TokenRoute>
                            <EmployeeForm mode="edit" />
                        </TokenRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;