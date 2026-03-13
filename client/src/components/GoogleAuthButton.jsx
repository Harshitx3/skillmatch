import { GoogleLogin } from '@react-oauth/google';
import api from "../lib/api.js";

export default function GoogleAuthButton() {

  const handleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const { data } = await api.post("/auth/google", { credential });
      localStorage.setItem("token", data.token);
      window.location.href = "/profile";
    } catch (err) {
      alert(err.response?.data?.error || "Google login failed");
    }
  };

  const handleError = () => {
    alert('Google login failed. Please try again.');
  };

  return (
    <div className="flex justify-center min-h-[44px]">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="outline"
        text="continue_with"
        shape="pill"
        width="100%"
      />
    </div>
  );
}
