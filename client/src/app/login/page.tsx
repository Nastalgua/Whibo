"use client"

import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const googleLogin = () => {
    window.open('/api/v1/auth/google', '_self');
  }

  const logout = async () => {
    const res = await fetch("/api/v1/auth/logout/");
    const isSuccess = (await res.json()).logoutSuccess;

    if (isSuccess) {
      router.push("/");
    } else {
      console.log("Could not log out.");
    }
  }

  return (
    <div className="flex flex-col">
      <button onClick={googleLogin}>Login</button>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}
