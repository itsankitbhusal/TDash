import { useEffect, useState, type ChangeEvent } from "react";
import type { ISub, IUser, IUserWithSub } from "@/types/index.ts";
import { loadSubscriptions, loadUsers } from "@/utils/loadDataLists.ts";
import { useDisclosure } from "@/hooks/useDisclosure";
import UserDetailModal from "@/components/UserDetailModal";
import UserCard from "@/components/UserCard";
import { formatDate } from "@/utils/date";
import Pagination from "@/components/Pagination";

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

  const changePageFromPagination = (page: number) => {
    setCurrentPage(page);
  };

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
    const sub = subsData.filter((s) => s.user_id == user.id.toString());
    return {
      ...user,
      packages: sub.map((s) => s.package),
      expires_on: sub.map((s) => s.expires_on),
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
    // const status = getStatus(user.expires_on?.[0]);

    if (toggleFiltered && user.packages?.length === 0) return false;
    if (!fullName.includes(searchQuery.toLowerCase())) return false;
    if (selectedPackage !== "all" && !user.packages?.includes(selectedPackage))
      return false;
    if (selectedStatus !== "all" && status !== selectedStatus) return false;

    return true;
  });

  const packages = Array.from(new Set(subsData.map((s) => s.package)));

  const totalPages = Math.ceil(filteredUsers.length / limit);
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

  return (
    <div className="user-listing-wrapper">
      <div className="filters">
        <h3>Subscription List</h3>
        <div className="filter-group">
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
            {packages.map((pkg) => (
              <option key={pkg} value={pkg}>
                {pkg}
              </option>
            ))}
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
            <label htmlFor="filtered-data">Filtered unwanted</label>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
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
              const fullName = [
                user.first_name,
                user.middle_name,
                user.last_name,
              ]
                .filter(Boolean)
                .join(" ");

              const expiration = user?.expires_on
                ?.sort((a, b) => {
                  return new Date(a).getTime() - new Date(b).getTime();
                })
                ?.map((date) => {
                  return formatDate(date);
                });

              const status = getStatus(user.expires_on?.[0]);
              const formattedExpirationDate = expiration?.[0] ?? "-";

              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <UserCard name={fullName} email={user.email} />
                  </td>
                  <td>{user.active === "1" ? "Yes" : "No"}</td>
                  <td>{user.country}</td>
                  <td>
                    {user.packages?.map((pkg, i) =>
                      user.packages?.length == i + 1 ? pkg : pkg + ", "
                    ) ?? "-"}
                  </td>
                  <td>
                    <div
                      className={`status-card ${
                        status === "active" ? "active" : "expired"
                      }`}
                    >
                      {status}
                    </div>
                  </td>
                  <td>{formattedExpirationDate}</td>
                  <td>
                    <button onClick={() => handleUserClick(user)}>View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        changePageFromPagination={changePageFromPagination}
        totalPages={totalPages}
      />

      {isOpen ? (
        <UserDetailModal user={selectedUser} onClose={onClose} />
      ) : null}
    </div>
  );
};

export default UserListing;
