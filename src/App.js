import { BrowserRouter as Router } from "react-router-dom";
import OndcRoutes from "./router";

function App() {
  return (
    <Router>
      <div className="py-2">header</div>
      <div>
        <OndcRoutes />
      </div>
    </Router>
  );
}

export default App;
