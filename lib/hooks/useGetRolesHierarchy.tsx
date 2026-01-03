import { useGetUserRolesQuery } from '@/store/api/usersApi';
import { UserRoleEnum } from '@/types/user';

const useGetRolesHierarchy = () => {
  const { data: roles, isLoading } = useGetUserRolesQuery();

  const isHigherRole = (currentRole: UserRoleEnum, targetRole: UserRoleEnum, allowEqual: boolean = false): boolean => {
    if (!roles) return true;

    const targetRoleDefinition = roles.find(role => role.name === targetRole);

    if (!targetRoleDefinition) {
      return false;
    }

    if (allowEqual && currentRole === targetRole) {
      return true;
    }

    return targetRoleDefinition.higherRoleNames.includes(currentRole);
  };

  return { data: roles || [], isLoading, isHigherRole };
};

export default useGetRolesHierarchy;
