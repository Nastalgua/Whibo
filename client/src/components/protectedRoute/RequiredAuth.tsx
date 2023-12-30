import { useAppSelector } from "@/redux/store";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function requiredAuth(Component: any) {
  return function RequiredAuth(props: any) {
    const isAuth = useAppSelector((state) => state.authReducer.value.isAuth);
    const loaded = useAppSelector((state) => state.authReducer.value.loaded);

    useEffect(() => {
      if (loaded && !isAuth) {
        redirect('/login')
      } 
    }, [isAuth, loaded]);

    if (!loaded || !isAuth) {
      return null;
    }

    return <Component {...props} />;
  }
};

