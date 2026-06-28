import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import PublicLayout from "./components/PublicLayout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Members from "./pages/Members.jsx";
import Events from "./pages/Events.jsx";
import Achievements from "./pages/Achievements.jsx";
import Schools from "./pages/Schools.jsx";
import Gallery from "./pages/Gallery.jsx";
import Contact from "./pages/Contact.jsx";
import Donate from "./pages/Donate.jsx";
import Initiatives from "./pages/Initiatives.jsx";
import Books from "./pages/Books.jsx";

// HashRouter so GitHub Pages doesn't 404 on direct sub-routes
ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/members" element={<Members />} />
        <Route path="/events" element={<Events />} />
        <Route path="/initiatives" element={<Initiatives />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/books" element={<Books />} />
      </Route>
    </Routes>
  </HashRouter>
);
