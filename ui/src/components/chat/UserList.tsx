import { UserListProps } from "./ChatInterface";

function UserList({ users, onSelectUser }: UserListProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">Available Users</h2>
      <ul>
        {users.map((user) => (
          <li
            key={user.userid}
            className="cursor-pointer py-2 hover:bg-gray-100"
            onClick={() => onSelectUser(user)}
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;