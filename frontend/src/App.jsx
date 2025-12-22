import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Common/Header";
import Navigation from "./components/Common/Navigation";
import HomePage from "./pages/HomePage";
import BuilderPage from "./pages/BuilderPage";
import "./index.css";
import "./styles/components.css";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/builder" element={<BuilderPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
