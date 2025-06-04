export interface User {
  id: string | null;
  username: string | null;
  isLoading?: boolean;
  isFirstLogin: boolean | null;
}
