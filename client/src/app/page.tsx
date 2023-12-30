"use client"

import requiredAuth from "@/components/protectedRoute/RequiredAuth";

import { logout } from "@/redux/features/auth-slice";

import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";

function Home() {

  const dispatch = useDispatch<AppDispatch>();

  const onClick = async () => {
    dispatch(logout());
  }

  return (
    <button onClick={onClick}>Log Out</button>
  );
}

export default requiredAuth(Home);
