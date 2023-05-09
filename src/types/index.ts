export interface UserInfo {
    name: string;
    password: string;
    email?: string;
    first_name?: string;
    last_name?: string;
}

export interface NewFolder {
    name: string;
    description: string;
}

export interface Item {
    title: string;
    id: number;
    docstore_id: number;
}

export interface Folder {
    name: string;
    id: number;
    docs?: Item[];
}

export interface History {
    role: string;
    text: string;
}

export interface ChatInfo {
    name: string;
    id: number | undefined;
    query: string;
    history: History[];
    docs: Item[] | undefined;
}

export interface Data {
    userInfo: UserInfo;
    folders: Folder[];
    items: Item[];
    flag: boolean;
    newFolder: NewFolder;
    chatInfo: ChatInfo;
}

export interface Visible {
    user: boolean;
    folder: boolean;
    choose: boolean;
    chat: boolean;
}

export interface DocInfo {
    docstore_id: number | undefined;
    path: string;
    authors: string[];
    title: string;
    description: string;
    abstract: string;
}