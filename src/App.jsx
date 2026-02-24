import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayouts";

import Home from "./pages/Home";
import Playlist from "./pages/Playlist";
import Videos from "./pages/Video";
import About from "./pages/About";
import SearchPage from "./pages/SearchPage";
import Short from "./pages/Short";
import NotFound from "./pages/NotFound";
import Watch from "./pages/Watch";

import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />

      <Routes>
        <Route path="shorts" element={<Short />} />
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="playlists" element={<Playlist />} />
          <Route path="videos" element={<Videos />} />
          <Route path="about" element={<About />} />
          <Route path="search" element={<SearchPage />} />

          <Route path="watch/:videoId" element={<Watch />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
