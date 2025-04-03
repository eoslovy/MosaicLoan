export interface User {
  id: number;
  username: string;
}

export interface UserResponse {
  data: User | null;
}

export interface UserInfoType {
  name: string;
  createdAt: string;
  oauthProvider: string;
}
