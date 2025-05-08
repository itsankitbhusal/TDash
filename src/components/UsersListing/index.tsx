import { useEffect, useState } from "react";
import { getPageNumbers } from "@/utils/getPageNumbers.ts";
import type { ISub, IUser, IUserWithSub } from "@/types/index.ts";
import { loadSubscriptions, loadUsers } from "@/utils/loadDataLists.ts";
import { useDisclosure } from "@/hooks/useDisclosure";
import UserDetailModal from "@/components/UserDetailModal";

const UserListing = () => {
  const [usersData, setUsersData] = useState<IUser[]>([]);
  const [subsData, setSubsData] = useState<ISub[]>([]);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

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
  }, [searchQuery, selectedPackage, selectedStatus]);

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

    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesPackage =
      selectedPackage === "all" || user.package === selectedPackage;
    const matchesStatus = selectedStatus === "all" || status === selectedStatus;

    return matchesSearch && matchesPackage && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / limit);
  const pages = getPageNumbers(currentPage, totalPages);
  const currentData = filteredUsers.slice(
    currentPage * limit,
    (currentPage + 1) * limit
  );

  console.log("filtered data: ", mergedUsers, filteredUsers);

  const handleUserClick = (user: IUser) => {
    setSelectedUser(user);
    onOpen();
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
      </div>

      <table>
        <thead>
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
        <tbody>
          {currentData.map((user) => {
            const status = getStatus(user.expires_on);
            const fullName = [user.first_name, user.middle_name, user.last_name]
              .filter(Boolean)
              .join(" ");

            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <div>
                    {fullName}
                    <br />
                    {user?.email}
                  </div>
                </td>
                <td>{user.active === "1" ? "Yes" : "No"}</td>
                <td>{user.country}</td>
                <td>{user.package ?? "-"}</td>
                <td>{status}</td>
                <td>
                  {user.expires_on
                    ? new Date(user.expires_on).toLocaleDateString()
                    : "-"}
                </td>
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
            <span key={i}>...</span>
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
