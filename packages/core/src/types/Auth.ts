export interface UserSession {
  name: string;
  picture: string;
  email: string;
  roles: string[];
}

export interface Claims {
  email?: string;
}