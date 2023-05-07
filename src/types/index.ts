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
    name: string;
}

export interface Folder {
    name: string;
    docs?: Item[];
}

export interface Data {
    userInfo: UserInfo;
    folders: Folder[];
    items: Item[];
    flag: boolean;
    newFolder: NewFolder;
}

export interface Visible {
    userVisible: boolean;
    folderVisible: boolean;
}