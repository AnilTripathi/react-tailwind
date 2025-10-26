import { Card } from './Card';
import type { User } from '../types/user';

interface UserListType{
  data: User[] | [],
  error: unknown,
  isLoading: boolean
}

export const UserList:React.FC<UserListType> = ({ data: users, error, isLoading }) => {

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading users</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <div className="grid gap-4">
        {users?.map((user) => (
          <Card key={user.id}>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
