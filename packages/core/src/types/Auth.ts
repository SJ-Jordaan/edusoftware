export interface UserSession {
  userId: string;
  name: string;
  picture: string;
  email: string;
  roles: OrganisationRole[];
  organisations: OrganisationName[];
}

export enum OrganisationRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  LECTURER = 'lecturer',
}

export enum OrganisationName {
  PUBLIC = 'public',
  Tuks = 'tuks',
}
