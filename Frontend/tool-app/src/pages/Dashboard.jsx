import "./Dashboard.css";
import WindowIcon from '@mui/icons-material/Window';
import GroupsIcon from '@mui/icons-material/Groups';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BlockedIpData from "../Components/BlockedIp";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img1 from "../../../../Python/top_10_ip_addresses.png";
import img2 from "../../../../Python/requests_over_time.png";
import img3 from "../../../../Python/status_code_distribution.png";

export default function Dashboard() {
    const navigate = useNavigate();

    const onLogOut = () => {
        localStorage.clear();
        toast.success("Logout Successful");
        setTimeout(() => {
            navigate("/");
        }, 2000);
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2 className="logo">CloudBouncer</h2>
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-item active">
                        <WindowIcon className="nav-icon" />
                        <span>Overview</span>
                    </div>
                    <div className="nav-item">
                        <AssessmentIcon className="nav-icon" />
                        <span>Reports</span>
                    </div>
                    <div className="nav-item">
                        <GroupsIcon className="nav-icon" />
                        <span>Customers</span>
                    </div>
                    <div className="nav-item">
                        <SettingsIcon className="nav-icon" />
                        <span>Settings</span>
                    </div>
                    <div className="nav-item">
                        <CodeIcon className="nav-icon" />
                        <span>Developer</span>
                    </div>
                    <div className="nav-item logout" onClick={onLogOut}>
                        <LogoutIcon className="nav-icon" />
                        <span>Logout</span>
                    </div>
                </nav>
            </div>

            <div className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Dashboard</h1>
                    <div className="user-profile">
                        <AccountCircleIcon className="profile-icon" />
                    </div>
                </header>

                <main className="dashboard-content">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Total Requests</h3>
                            <p className="stat-value">24,567</p>
                            <p className="stat-change positive">+12.5%</p>
                        </div>
                        <div className="stat-card">
                            <h3>Blocked Attacks</h3>
                            <p className="stat-value">1,234</p>
                            <p className="stat-change positive">+8.2%</p>
                        </div>
                        <div className="stat-card">
                            <h3>Response Time</h3>
                            <p className="stat-value">45ms</p>
                            <p className="stat-change negative">-2.1%</p>
                        </div>
                        <div className="stat-card">
                            <h3>Active Users</h3>
                            <p className="stat-value">1,890</p>
                            <p className="stat-change positive">+5.7%</p>
                        </div>
                    </div>

                    <div className="charts-container">
                        <div className="chart-card">
                            <h3>Top IP Addresses</h3>
                            <div className="chart-wrapper">
                                <img src={img1} alt="Top IP Addresses" className="chart-image" />
                            </div>
                        </div>
                        <div className="chart-card">
                            <h3>Requests Over Time</h3>
                            <div className="chart-wrapper">
                                <img src={img2} alt="Requests Over Time" className="chart-image" />
                            </div>
                        </div>
                    </div>

                    <div className="bottom-section">
                        <div className="blocked-ips-card">
                            <h3>Blocked IPs</h3>
                            <div className="blocked-ips-content">
                                <BlockedIpData />
                            </div>
                        </div>
                        <div className="chart-card">
                            <h3>Status Code Distribution</h3>
                            <div className="chart-wrapper">
                                <img src={img3} alt="Status Code Distribution" className="chart-image" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <ToastContainer />
        </div>
    );
}