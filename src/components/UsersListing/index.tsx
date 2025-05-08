import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import { getPageNumbers } from "@/utils/getPageNumbers.ts";
import type { ISub, IUser, IUserWithSub } from "@/types/index.ts";
import { loadSubscriptions, loadUsers } from "@/utils/loadDataLists.ts";
import { useDisclosure } from "@/hooks/useDisclosure";
import UserDetailModal from "@/components/UserDetailModal";
import UserCard from "@/components/UserCard";

const UserListing = () => {
  const [usersData, setUsersData] = useState<IUser[]>([]);
  const [subsData, setSubsData] = useState<ISub[]>([]);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const [toggleFiltered, setToggleFiltered] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      const [usersResult, subsResult] = await Promise.allSettled([
        loadUsers(),
        loadSubscriptions(),
      ]);

      if (usersResult.status === "fulfilled") {
        setUsersData(usersResult.value as IUser[]);
      }
      if (subsResult.status === "fulfilled") {
        setSubsData(subsResult.value as ISub[]);
      }
    };

    fetchData();
  }, []);

  const mergedUsers: IUserWithSub[] = usersData.map((user) => {
    const sub = subsData.find((s) => s.user_id === user.id.toString());
    return {
      ...user,
      package: sub?.package,
      expires_on: sub?.expires_on,
    };
  });

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, selectedPackage, selectedStatus, toggleFiltered]);

  const getStatus = (expires_on?: string) => {
    if (!expires_on) return "active";
    const now = new Date();
    const expiry = new Date(expires_on);
    return expiry < now ? "expired" : "active";
  };

  const filteredUsers = mergedUsers.filter((user) => {
    const fullName = `${user.first_name} ${user.middle_name || ""} ${
      user.last_name
    }`
      .toLowerCase()
      .trim();
    const status = getStatus(user.expires_on);

    if (toggleFiltered && !user.package) return false;
    if (!fullName.includes(searchQuery.toLowerCase())) return false;
    if (selectedPackage !== "all" && user.package !== selectedPackage)
      return false;
    if (selectedStatus !== "all" && status !== selectedStatus) return false;

    return true;
  });

  const totalPages = Math.ceil(filteredUsers.length / limit);
  const pages = getPageNumbers(currentPage, totalPages);
  const currentData = filteredUsers.slice(
    currentPage * limit,
    (currentPage + 1) * limit
  );

  const handleUserClick = (user: IUser) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleFilteredCheck = (e: ChangeEvent<HTMLInputElement>) => {
    setToggleFiltered(e.target.checked);
  };

  const formattedDate = (date?: string) => {
    if (!date) {
      return "-";
    }
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={selectedPackage}
          onChange={(e) => setSelectedPackage(e.target.value)}
        >
          <option value="all">All Packages</option>
          <option value="Plan 1">Plan 1</option>
          <option value="Plan 2">Plan 2</option>
          <option value="Plan 3">Plan 3</option>
          <option value="Plan 4">Plan 4</option>
          <option value="Plan 5">Plan 5</option>
          <option value="Plan 6">Plan 6</option>
          <option value="Plan 7">Plan 7</option>
          <option value="Plan 8">Plan 8</option>
          <option value="Plan 9">Plan 9</option>
          <option value="Plan 10">Plan 10</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>

        <div className="filtered-wrapper">
          <input
            type="checkbox"
            id="filtered-data"
            onChange={handleFilteredCheck}
          ></input>
          <label htmlFor="filtered-data">Show only filtered data</label>
        </div>
      </div>

      <table className="table">
        <thead className="table-header">
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Active</th>
            <th>Country</th>
            <th>Package</th>
            <th>Status</th>
            <th>Expires On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {currentData.map((user) => {
            const status = getStatus(user.expires_on);
            const fullName = [user.first_name, user.middle_name, user.last_name]
              .filter(Boolean)
              .join(" ");

            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <UserCard name={fullName} email={user.email} />
                </td>
                <td>{user.active === "1" ? "Yes" : "No"}</td>
                <td>{user.country}</td>
                <td>{user.package ?? "-"}</td>
                <td>
                  <div
                    className={`status-card ${
                      status === "active" ? "active" : "expired"
                    }`}
                    aria-label={`Status: ${status}`}
                  >
                    {status}
                  </div>
                </td>
                <td>{formattedDate(user.expires_on)}</td>
                <td>
                  <button onClick={() => handleUserClick(user)}>View</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
        >
          Previous
        </button>

        {pages.map((page, i) =>
          page === -1 || page === -2 ? (
            <span key={i} className="pagination-dots">...</span>
          ) : (
            <button
              key={i}
              onClick={() => setCurrentPage(page)}
              disabled={page === currentPage}
              style={{
                fontWeight: page === currentPage ? "bold" : "normal",
              }}
            >
              {page + 1}
            </button>
          )
        )}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </button>
      </div>

      {isOpen ? (
        <UserDetailModal user={selectedUser} onClose={onClose} />
      ) : null}
    </div>
  );
};

export default UserListing;
