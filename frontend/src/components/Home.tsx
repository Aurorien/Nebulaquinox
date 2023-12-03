import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-wrapper">
      <div>
        <div className="home-title">
          <h1>Nebulaquinox</h1>
        </div>
      </div>
      <div>
        <Link to="/dockyard">Go to Spaceship dockyard</Link>
      </div>
    </div>
  );
}

export default Home;
