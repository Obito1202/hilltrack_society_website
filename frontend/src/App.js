import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

import PublicLayout from "@/components/site/PublicLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Members from "@/pages/Members";
import Events from "@/pages/Events";
import Achievements from "@/pages/Achievements";
import Schools from "@/pages/Schools";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import Donate from "@/pages/Donate";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/admin/Dashboard";

function Protected({ children }) {
  const { user } = useAuth();
  if (user === null) return <div className="p-10">Loading...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="members" element={<Members />} />
            <Route path="events" element={<Events />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="schools" element={<Schools />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="contact" element={<Contact />} />
            <Route path="donate" element={<Donate />} />
          </Route>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<Protected><AdminDashboard /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;
