import { Routes, Route } from "react-router-dom";
import Callback from "./Callback";
import VideoUploader from "./VideoUploader";
import { AuthManager } from "./AuthManager";

function Login() {
  return (
    <div>
      <h1>AIFootballLab Login + Upload Video</h1>
      <button onClick={AuthManager.login}>Login with Cognito</button>
      {AuthManager.isAuthenticated() && (
        <button onClick={AuthManager.logout} style={{ marginLeft: "1rem" }}>
          Logout
        </button>
      )}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/upload" element={<VideoUploader />} />
    </Routes>
  );
}

export default App;




