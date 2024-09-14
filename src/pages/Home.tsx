import ConnectionChecker from "../components/ConnectionChecker";
import "../styles/pages/Home.css";

const Home = () => {
  return (
    <div id="home-page" style={{ textAlign: "center" }}>
      <h1 className="logo-text">
        <span className="logo-text-chess">CHESS</span>
        <span className="logo-text-mixed">MIXED</span>
      </h1>
      <br />
      <img
        id="hero-image"
        src="/images/chessmixed-hero-edit.png"
        alt="two opposing castles on stylized chess board"
      />
      <ConnectionChecker />
    </div>
  );
};

export default Home;
