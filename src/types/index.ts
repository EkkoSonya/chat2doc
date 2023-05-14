export interface UserInfo {
    name: string;
    password: string;
    email?: string;
    first_name?: string;
    last_name?: string;
}

export interface User {
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    isLogin: boolean;
}

export interface NewFolder {
    name: string;
    description: string;
    id?: number | undefined;
}

export interface Item {
    key: number | undefined;
    title: string;
    id: number | undefined;
    docstore_id: number;
}

export interface Folder {
    key?: number;
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
    user: User;
    folders: Folder[];
    items: Item[];
    flag: boolean;
    newFolder: NewFolder;
    chatInfo: ChatInfo;
    uploadFiles: Item[];
}

export interface Visible {
    user: boolean;
    folder: boolean;
    choose: boolean;
    chat: boolean;
    modify: boolean[];
}

export interface DocInfo {
    docstore_id?: number | undefined;
    path?: string;
    id?: number | undefined;
    authors: string[];
    title: string;
    description: string;
    abstract: string;
}

export interface ModifyInfo {
    doc_store: NewFolder;
    doc: DocInfo;
}