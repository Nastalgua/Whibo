import { useAppSelector } from "@/redux/store";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function requiredGuest(Component: any) {
  return function RequiredGuest(props: any) {
    const isAuth = useAppSelector((state) => state.authReducer.value.isAuth);
    const loaded = useAppSelector((state) => state.authReducer.value.loaded);

    useEffect(() => {
      if (loaded && isAuth) {
        redirect('/');
      }
    }, [isAuth, loaded]);

    if (!loaded || isAuth) {
      return null;
    }

    return <Component {...props} />;
  }
};
