import Header from "./Header";

function Info() {
  return (
    <div className="container vh-100">
      <Header />
      <h2>About</h2>
      <p>This application allows users to track their time spent on various tasks.</p>
      <p>Version: 1.0.0</p>
    </div>
  );
}

export default Info;
