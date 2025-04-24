import React from "react";
import TryOnComponent from "../components/TryOnComponent";

const Home: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to Virtual Try-On</h1>
      <TryOnComponent />
    </div>
  );
};

export default Home;
