"use client"

import requiredGuest from "@/components/protectedRoute/RequiredGuest";

function Login() {
  const googleLogin = () => {
    window.open('/api/v1/auth/google', '_self');
  }

  return (
    <div className="flex flex-col">
      <button onClick={googleLogin}>Login</button>
    </div>
  );
}

export default requiredGuest(Login);
