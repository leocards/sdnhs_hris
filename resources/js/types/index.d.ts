import { STAFFPOSITIONS } from './../Pages/Staff/types';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    department: string;
    position: any;
    leave_credits?: number|null;
    email: string;
    role: string;
    email_verified_at: string;
}

export type PaginateData = {
    current_page: number,
    data: Array<any>,
    first_page_url: string,
    from: number,
    last_page: number,
    last_page_url: string,
    links: Array<any>,
    next_page_url: string | null,
    path: string,
    per_page: number,
    prev_page_url: string | null,
    to: number,
    total: number
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
