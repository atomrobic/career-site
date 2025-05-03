import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login, Register, OtpVerification } from "./components/AuthMain";

import Home from "./components/Home";
import JobDetails from "./components/JobDetails";
//  import AdminDashboard from "./components/AuthMain";
// import ApplyJob from "./pages/ApplyJob";
import Profile from "./components/Profile";
// import NotFound from "./pages/NotFound";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/details/:id" element={<JobDetails />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OtpVerification />} />      
        <Route path="/profile"element={<Profile/>}/>

        {/* <Route path="/AdminDashboard"element={< AdminDashboard/>}/> */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;
