import { useOutsideClick } from "@/hooks/useOutsideClick";
import type { IUserWithSub } from "@/types";
import { useRef } from "react";
import "./style/index.css";
import { formatDate, formatTimestampToDate } from "@/utils/date";

interface IProps {
  user?: IUserWithSub | null;
  onClose?: () => void;
}

const UserDetailModal = ({ user, onClose }: IProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClick(modalRef, () => onClose?.());

  if (!user) return null;

  const expiration = user?.expires_on
    ?.sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    })
    ?.map((date) => {
      return formatDate(date);
    });

  const formattedExpirationDates = expiration?.map((e) => e);

  const subscriptionStatus =
    expiration && new Date(expiration?.[0]) < new Date() ? "Expired" : "Active";
  const userStatus = user.active === "1" ? "Active" : "Expired";
  const joinDate = formatTimestampToDate(user.join_date);

  return (
    <div className="modal-wrapper">
      <div className="modal" ref={modalRef}>
        <div className="modal-header">
          <div className="modal-title">
            <h2>Subscription Details</h2>
            <p>Detailed information about this subscription</p>
          </div>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="subscription-info">
            <div className="grid">
              <div>
                <strong>Subscription ID</strong>
                <p>{user.id}</p>
              </div>
              <div>
                <strong>Package</strong>
                <p>
                  {user.packages?.map((pkg, i) =>
                    user.packages?.length === i + 1 ? pkg : pkg + ", "
                  )}
                </p>
              </div>
              <div>
                <strong>Status</strong>
                <span
                  className={`status-card ${subscriptionStatus.toLowerCase()}`}
                >
                  {subscriptionStatus}
                </span>
              </div>
              <div>
                <strong>Expires On</strong>
                <p>
                  {formattedExpirationDates?.map((date, i) =>
                    formattedExpirationDates?.length === i + 1
                      ? date
                      : date + ", "
                  )}
                </p>
              </div>
            </div>
          </div>
          <hr className="divider" />
          <div className="user-info">
            <h3>User Information</h3>
            <div className="grid">
              <div>
                <strong>Name</strong>
                <p>{`${user.first_name} ${user.middle_name} ${user.last_name}`}</p>
              </div>
              <div>
                <strong>User ID</strong>
                <p>{user.id}</p>
              </div>
              <div>
                <strong>Email</strong>
                <p>{user.email}</p>
              </div>
              <div>
                <strong>Status</strong>
                <span className={`status-card ${userStatus.toLowerCase()}`}>
                  {userStatus}
                </span>
              </div>
              <div>
                <strong>Address</strong>
                <p>{user.address}</p>
              </div>
              <div>
                <strong>Country</strong>
                <p>{user.country}</p>
              </div>
              <div>
                <strong>Join Date</strong>
                <p>{joinDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
