import { SocketUser } from "@/types/user";

type UserItemProps = {
  user: SocketUser
}

export default function UserItem({ user }: UserItemProps) {
  const formatText = (username: string) => {
    return username[0].toUpperCase();
  }

  return (
    <div className="py-0.5 px-2 bg-sky-600 rounded-sm text-white">{formatText(user.username)}</div>
  );
}