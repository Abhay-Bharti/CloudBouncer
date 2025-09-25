import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Navbar from '../Components/Navbar';
import { validateEmail } from '../utils/utils';
import axiosInstance from '../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import './SignUp.css';

export default function Signup() {
    const [info, setInfo] = useState({ fullName: "", email: "", password: "" });
    const [error, setError] = useState("");


    const navigate = useNavigate();

    const handleInput = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value })
    }

    const handleSignUp = async(e) =>{
            e.preventDefault();

            if(!info.fullName){
                setError("Please enter your Full Name");
                return;
            }

            if(!validateEmail(info.email)){
                setError("Please enter a valid email address");
                toast.error("Please Enter a valid email address");
                return;
            }

            if(!info.password){
                setError("Please enter a valid password");
                return;
            }
            setError("");

            //sign up api is being called

            try{
                const response = await axiosInstance.post("/signup",{
                    fullName:info.fullName,
                    email:info.email,
                    password:info.password,
                });

                if (response.data && response.data.error) {
                    setError(response.data.message);
                    if (response.data.message === "User already exists") {
                        toast.error("User already exists");
                      
                    } else{
                        toast.error(response.data.message);
                    }
                    return;
                }
    
                if (response.data && response.data.accessToken) {
                    localStorage.setItem("token", response.data.accessToken);
                    toast.success("Account created successfully!");
                    setTimeout(() => {
                        navigate("/login");
                    }, 1200);
                }
            }catch(error){
                if (error.response && error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    toast.error(" An Unexpected error occured.");
                    setError("An unexpected error occured. Please try again.")
                }
            }
    }

    return (
        <>
            <Navbar />
            <div className="signup-page">
                <Container className="signup-container">
                    <h1 className="signup-title">Create Your Account</h1>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    <Form onSubmit={handleSignUp} className="signup-form">
                        <Form.Group controlId="fullName">
                            <Form.Label className="form-label">Full Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your Full Name" name="fullName" onChange={handleInput} value={info.fullName} required className="form-input" />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="form-label">Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleInput} value={info.email} required className="form-input" />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label className="form-label">Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter Password" name="password" onChange={handleInput} value={info.password} required minLength={8} className="form-input" />
                        </Form.Group>
                        <div className="login-link-container">
                            Already registered? <Link to="/login" className="login-link">Login here</Link>
                        </div>
                        <Button variant="primary" type="submit" className="signup-btn">
                            Sign Up
                        </Button>
                    </Form>
                </Container>
            </div>
            <ToastContainer/>
        </>
    )
}