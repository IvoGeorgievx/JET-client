export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

export interface RegisterResponse {
  id: string;
  username: string;
}
