import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Container } from 'react-bootstrap';
import "../App.css"
import NavbarScroll from "../Components/Navbar";
import { validateEmail } from "../utils/utils";
import axiosInstance from "../utils/axiosInstance";
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);

    const handleInput = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateEmail(credentials.email)) {
            toast.error("Invalid email address"); // Use toast.error
            return;
        }

        if (!credentials.password) {
            toast.error("Please enter the password"); // Use toast.error
            return;
        }

        setError("");

        // Login API call
        try {
            const response = await axiosInstance.post("/login", {
                email: credentials.email,
                password: credentials.password,
            });

            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                toast.success("Login successful!"); 
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1000); 
            }
            

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
                toast.error(error.response.data.message); // Show error message
            } else {
                setError("An unexpected error occurred. Please try again.");
                toast.error("An unexpected error occurred. Please try again."); // Show error message
            }
        }
    }


    return (
        <>
            <NavbarScroll />
            <div className="login-page">
                <Container className="login-container">
                    <div className="login-header">
                        <svg className="login-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <h1 className="login-title">Login to Your Account</h1>
                    </div>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    <Form onSubmit={handleSubmit} className="login-form">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="form-label">Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                onChange={handleInput}
                                value={credentials.email}
                                required
                                className="form-input"
                            />
                            <Form.Text className="form-text">
                                We&apos;ll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label className="form-label">Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter Password"
                                name="password"
                                onChange={handleInput}
                                value={credentials.password}
                                required
                                minLength={8}
                                className="form-input"
                            />
                        </Form.Group>
                        <div className="signup-link-container">
                            Do not have an account? <Link to="/signup" className="signup-link">Sign up here</Link>
                        </div>
                        <Button variant="primary" type="submit" className="login-btn">
                            Login
                        </Button>
                    </Form>
                </Container>
            </div>
            <ToastContainer />
        </>
    );
}          
