import Navbar from "./components/Navbar";
import Playlist from "./pages/Playlist";
import Home from "./pages/Home";
import Videos from "./pages/Video";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/videos" element={<Videos />} />
      </Routes>
    </>
  );
}

export default App;
