import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage/homepage";

function App() {
  return (
    <Routes>
      {/* this handels the index route */}
      <Route path="/" element={<Homepage />} />
      {/* this handles all the wildcard route that is not defined */}
      <Route path="*" element={<Homepage />} />
    </Routes>
  );
}

export default App;
