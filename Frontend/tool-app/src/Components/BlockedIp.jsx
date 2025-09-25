import { Table, Button } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from "../utils/axiosInstance";
import { toast } from 'react-toastify';
import './IpTable.css';

const formatDateTime = (isoString) => {
    const options = {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: true
    };
    return new Date(isoString).toLocaleString(undefined, options);
};

const BlockedIpData = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/blockedIps");
            console.log("Blocked IPs response:", response.data); // Debug log

            // Handle the new API response structure
            if (response.data && response.data.success && response.data.data) {
                setData(response.data.data);
            } else if (Array.isArray(response.data)) {
                // Fallback for old API structure
                setData(response.data);
            } else {
                console.error("Unexpected response format:", response.data);
                setData([]);
                setError("Unexpected data format received from server");
            }
            setError(null); // Clear any previous errors
        } catch (error) {
            console.error("Error fetching blocked IPs:", error);
            setError("Error while fetching Blocked IPs");
            setData([]); // Ensure data is always an array
            toast.error("Failed to fetch blocked IPs");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (ip) => {
        try {
            const response = await axiosInstance.delete(`/blockedIps/${encodeURIComponent(ip)}`);
            
            if (response.data && response.data.success) {
                // Remove the IP from the local state
                const updatedData = data.filter(entry => entry.ip !== ip);
                setData(updatedData);
                toast.success(`IP ${ip} has been unblocked successfully`);
            } else {
                toast.error("Failed to unblock IP");
            }
        } catch (error) {
            console.error("Error deleting blocked IP:", error);
            if (error.response && error.response.status === 404) {
                toast.error("IP not found in blocked list");
            } else if (error.response && error.response.status === 401) {
                toast.error("You need to be logged in to perform this action");
            } else {
                toast.error("Failed to unblock IP");
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="table-container m-2">
                <div className="text-center">Loading blocked IPs...</div>
            </div>
        );
    }

    return (
        <div className="table-container m-2">
            {error && <div className="alert alert-danger">{error}</div>}
            {data.length === 0 && !error && !loading ? (
                <div className="alert alert-info">No blocked IPs found.</div>
            ) : (
                <Table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>IP Address</th>
                            <th>Date Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((entry, index) => (
                            <tr key={entry.ip || index}>
                                <td>{index + 1}</td>
                                <td>{entry.ip}</td>
                                <td>{formatDateTime(entry.timestamp || entry.blockedAt || entry.createdAt)}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(entry.ip)}
                                        size="sm"
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default BlockedIpData;
