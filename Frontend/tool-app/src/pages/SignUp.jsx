import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    InputAdornment,
    IconButton,
    Alert,
    Grid
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    Business as BusinessIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import './SignUp.css';

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        company: '',
        phone: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axiosInstance.post('/signup', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                company: formData.company,
                phone: formData.phone
            });

            if (response.data.message) {
                toast.success('Account created successfully!');
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during signup');
            toast.error('Signup failed. Please try again.');
        }
    };

    return (
        <div className="signup-page">
            <Container maxWidth="md">
                <Paper elevation={3} className="signup-card">
                    <div className="signup-header">
                        <Typography variant="h4" className="signup-title">
                            Create Your Account
                        </Typography>
                        <Typography variant="body1" className="signup-subtitle">
                            Join CloudBouncer to secure your cloud infrastructure
                        </Typography>
                    </div>

                    {error && (
                        <Alert severity="error" className="error-alert">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="signup-form">
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    margin="normal"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    className="form-field"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    margin="normal"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    className="form-field"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    margin="normal"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BusinessIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    className="form-field"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    margin="normal"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PhoneIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    className="form-field"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    margin="normal"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    className="form-field"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    margin="normal"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    className="form-field"
                                />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            className="signup-button"
                        >
                            Create Account
                        </Button>

                        <Box className="signup-options">
                            <Button
                                color="primary"
                                onClick={() => navigate('/login')}
                                className="login-link"
                            >
                                Already have an account? Sign In
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </div>
    );
}