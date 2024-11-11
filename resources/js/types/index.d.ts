export interface User {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    extension_name: string | null;
    department: string;
    position: any;
    address: string;
    leave_credits?: number | null;
    email: string;
    role: string;
    email_verified_at: string;
    avatar: string;
    enable_email_notification: boolean | null;
    enable_email_message_notification: boolean | null;
    enable_email_note_reminder: boolean | null;
}

export interface UserInfo {
    sex?: "Male" | "Female",
    date_of_birth: string,
    phone_number: string,
    personnel_id: string,
    date_hired: string,
    leave_rendered: number,
    name: string
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

export type SALNTOTALTYPE = {
    real: number,
    personal: number,
    liability: number,
    networth: number
}

export type SALNTYPE = {
    spouse: {
        saln_id: number
        family_name: string
        first_name: string
        middle_name: string
        position: string
        office: string
        office_address: string
        government_id: string
        government_id_no: string
        date_issued: string
    }
    declarant: {
        government_id: string
        id_number: string
        issued: string
    }
    pages: Array<{
        children: Array<{
            id: number
            saln_id: number
            name: string
            date_of_birth: string
            age: string
        }>|null
        real: Array<{
            id: number
            assessed_value: string;
            cost: string;
            current_market_value: string;
            description: string;
            kind: string;
            location: string;
            mode: string;
            saln_id: number;
            year: string;
        }>|null
        personal: Array<{
            id: number
            cost: string;
            description: string;
            year: string;
        }>|null
        liabilities: Array<{
            id: number
            saln_id: number
            balances: string
            creditors: string
            nature: string
        }>|null
        bifc: {
            salnbifc: any
            bifc: Array<{
                id: number
                saln_bi_fc_id: number
                name: string
                address: string
                nature: string
                date: string
            }>|null
        }
        relatives: {
            salnrelatives: any
            relatives: Array<{
                id: number
                saln_relative_id: number
                name: string
                relationship: string
                position: string
                agency_address: string
            }>|null
        }
        saln_totals: SALNTOTALTYPE
    }>
}
