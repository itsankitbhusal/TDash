import { useOutsideClick } from "@/hooks/useOutsideClick";
import type { IUser } from "@/types";
import { useRef } from "react";

interface IProps {
  user?: IUser | null;
  onClose?: () => void;
}
const UserDetailModal = ({ user, onClose }: IProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClick(modalRef, () => onClose?.());

  return (
    <div className="modal-wrapper">
      <div className="modal" ref={modalRef}>
        <div className="modal-header">
          <h2>Subscription details</h2>
          <button onClick={onClose}>x</button>
        </div>
        <div className="modal-body">
          <div>this is test description</div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
