import { fullyLoaded, login } from "@/redux/features/auth-slice";
import { AppDispatch } from "@/redux/store";
import { IUser } from "@/types/user";
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";

export const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState<IUser | null>(null);
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/v1/auth/");
        const user = (await res.json()).user;
        setUser(user);
        dispatch(fullyLoaded());
        if (user) { dispatch(login(user)); }
      } catch (err) {
        console.log(err);
        dispatch(fullyLoaded());
      }
    }

    getUser();
  }, []);

  return user;
}