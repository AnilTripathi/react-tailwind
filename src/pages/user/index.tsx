import { useGetUsersQuery } from '@/services/user';
import { UserList } from '@/components/UserList';

const UserPage = () => {
    const { data: users, error, isLoading } = useGetUsersQuery();

  return <UserList data={users || []} error={error} isLoading={isLoading} />
}

export default UserPage