export interface UserInfo {
    name: string;
    username: string;
    email: string;
    profileUrl: string;
}

export interface AuthState {
    user: UserInfo | null;
    loading: boolean;
    authenticated: boolean;
    error: string | null;
}