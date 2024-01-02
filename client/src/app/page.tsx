"use client"

import requiredAuth from "@/components/protectedRoute/RequiredAuth";

import { logout } from "@/redux/features/auth-slice";

import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();

  const onClick = async () => {
    dispatch(logout());
  }

  return (
    <button onClick={onClick}>Default page.</button>
  );
}
