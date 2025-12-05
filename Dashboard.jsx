import "./dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>

      <div className="cards">
        <div className="card c1">
          <h3>Total Students</h3>
          <p>120</p>
        </div>

        <div className="card c2">
          <h3>Total Faculty</h3>
          <p>15</p>
        </div>

        <div className="card c3">
          <h3>Products</h3>
          <p>52</p>
        </div>

        <div className="card c4">
          <h3>Sales</h3>
          <p>₹ 18,450</p>
        </div>
      </div>
    </div>
  );
}
