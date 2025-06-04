export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    isFirstLogin: boolean | null;
  };
}

export interface RegisterResponse {
  id: string;
  username: string;
}
