export interface User {
  id: number;
  username: string;
}

export interface UserResponse {
  data: User | null;
}
