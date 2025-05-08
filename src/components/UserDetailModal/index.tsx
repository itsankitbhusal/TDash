import type { IUser } from "@/types";

interface IProps {
  user?: IUser | null;
  onClose?: () => void;
}
const UserDetailModal = ({ user, onClose }: IProps) => {
  return (
    <div>
      <div>{JSON.stringify(user)}</div>
      <button onClick={onClose}>x</button>
    </div>
  );
};

export default UserDetailModal;
