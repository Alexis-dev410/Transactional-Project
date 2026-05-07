import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Browse from "./pages/browse";
import ListingDetail from "./pages/listingDetail";
import Profile from "./pages/profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* PROTECTED (manual check happens inside pages) */}
        <Route path="/" element={<Browse />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;