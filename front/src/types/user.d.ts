export interface User {
  id: number;
  username: string;
  oauthProvider: string;
}

export interface UserResponse {
  data: {
    id: number;
    name: string;
    oauthProvider: string;
  } | null;
}

export interface UserInfoType {
  name: string;
  createdAt: string;
  oauthProvider: string;
}
