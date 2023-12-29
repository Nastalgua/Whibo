import { IUser } from "@/types/user";
import { useEffect, useState } from "react"

export const useUser = () => {

  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/v1/auth/");
        const user = (await res.json()).user;
        setUser(user);
      } catch (err) {
        console.log(err);
      }
    }

    getUser();
  }, []);

  return user;
}