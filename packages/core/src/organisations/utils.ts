import { OrganisationRole } from '../types';

export const isPrivilegedUser = (roles: OrganisationRole[] | undefined) => {
  return (
    roles?.includes(OrganisationRole.ADMIN) ||
    roles?.includes(OrganisationRole.LECTURER)
  );
};
