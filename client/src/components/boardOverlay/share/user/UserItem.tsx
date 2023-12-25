import { IUser } from "@/types/user";

type UserItemProps = {
  user: IUser
}

export default function UserItem({ user }: UserItemProps) {
  const formatText = (username: string) => {
    return username[0].toUpperCase();
  }

  return (
    <div className="py-0.5 px-2 bg-red-200 rounded-sm">{formatText(user.username)}</div>
  );
}