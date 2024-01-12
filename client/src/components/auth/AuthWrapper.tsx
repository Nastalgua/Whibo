import { useUser } from "@/hooks/useUser";
import { PropsWithChildren } from "react";

export default function AuthWrapper({ children }: PropsWithChildren) {
  useUser();

  return <>{children}</>
}