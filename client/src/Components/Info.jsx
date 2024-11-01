import Header from "./Header";

function Info() {
  return (
    <div className="container vh-100">
      <Header />
      <div className="container vh-100 d-flex flex-column align-items-center justify-content-center">
      <div className="text-center">
        <h2 className="my-4">About</h2>
        <p className="lead">This application allows users to track their time spent on various tasks.</p>
        <p className="text-muted">Version: 1.0.0</p>
        
        <h3 className="my-4">Contact Information</h3>
        <p>Name: <strong>Nirmal Dharmasena</strong></p>
        <p>Email: <strong><a href="mailto:nirmal.dharmasena@tuni.fi">nirmal.dharmasena@tuni.fi</a></strong></p>
        
        <h3 className="my-4">Running the Application</h3>
        <p>This project consists of two parts: the client and the server. To run the application, follow these steps:</p>
        <ol className="list-unstyled">
          <li>
            Navigate to the client directory and install the dependencies:
            <br />
            <code>cd client && npm install</code>
          </li>
          <li>
            Start the client application:
            <br />
            <code>npm run dev</code>
          </li>
          <li>
            Navigate to the server directory and install the dependencies:
            <br />
            <code>cd server && npm install</code>
          </li>
          <li>
            Start the server:
            <br />
            <code>node server.js</code>
          </li>
        </ol>
        
        <h3 className="my-4">Development Tools</h3>
        <p>This project was developed using VS Code Codium with Tab9 AI assistance.</p>
        
        <h3 className="my-4">Work Duration</h3>
        <p>Total work time: <strong>3 weeks</strong></p>
      </div>
    </div>
    </div>
  );
}

export default Info;
