export interface User {
  id: number;
  username: string;
  oauthProvider: string;
  createdAt: string;
}

export interface UserResponse {
  data: {
    id: number;
    name: string;
    oauthProvider: string;
    createdAt: string;
  } | null;
}

export interface UserInfoType {
  name: string;
  createdAt: string;
  oauthProvider: string;
}
