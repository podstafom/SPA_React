import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main.jsx";
import Favorites from "./pages/Favorites.jsx";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
  );
}

export default App;