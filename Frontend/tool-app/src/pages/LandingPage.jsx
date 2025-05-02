import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, Grid, Paper } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import Navbar from "../Components/Navbar";
import AboutUs from "../Components/AboutUs";
import Service from "../Components/Service";
import ContactUs from "../Components/Contact";
import Footer from "../Components/Footer";
import Home from "../Components/Home";
import axiosInstance from "../utils/axiosInstance";
import './LandingPage.css';

export default function LandingPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const features = [
        {
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
            title: "Advanced Security",
            description: "Protect your cloud infrastructure with state-of-the-art DDoS detection and prevention."
        },
        {
            icon: <SpeedIcon sx={{ fontSize: 40 }} />,
            title: "Real-time Monitoring",
            description: "Monitor your network traffic in real-time with detailed analytics and alerts."
        },
        {
            icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
            title: "Comprehensive Analytics",
            description: "Get detailed insights into your network traffic patterns and security threats."
        }
    ];

    // useEffect(() => {
    //     const fetchIpAndCheck = async () => {
    //         try {
    //             const response = await axiosInstance.get('/');
    //             if (response.data.isBlocked === true) {
    //                 console.log(response.data.isBlocked);
    //                 navigate('/denied');
    //             } else {
    //                 setLoading(false);
    //             }
    //         } catch (error) {
    //             console.error("Error checking IP address", error);
    //             setLoading(false);
    //         }
    //     };

    //     fetchIpAndCheck();
    // }, [navigate]);

    if (loading) {
        return <div>Checking IP...</div>;
    }

    return (
        <>
            <Navbar />
            <Home />
            <AboutUs />
            <Service />
            <ContactUs />
            <Footer />
        </>
    );
}
