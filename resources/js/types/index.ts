export type User = {
    id: number;
    name: string;
    email: string;
    foto?: string | null;
    roles: string[];
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User | null;
};

export type Flash = {
    success: string | null;
    error: string | null;
};

export type App = {
    name: string;
};

export type PageProps = {
    auth: Auth;
    flash: Flash;
    app: App;
};
