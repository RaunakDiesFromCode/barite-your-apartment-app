export type Society = {
    id: string;
    name: string;
    address?: string | null;
};

export type SocietyMembership = {
    role: "ADMIN" | "OWNER" | "TENANT";
    society: Society;
};

export type Notice = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
};

export type Complaint = {
    id: string;
    title: string;
    description: string;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
    createdAt: string;
};
