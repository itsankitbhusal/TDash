import { Link } from "react-router";

const Homepage = () => {
  return (
    <div>
      <div>Welcome to homepage of T Dash</div>
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
};

export default Homepage;
