/**
 * ###### not so fun
 */
export enum CommandType {
    Info = 'info',
    Fun = 'fun',
    Misc = 'misc',
}
/**
 * ###### ew errors
 */
export enum ErrorType {
    Missing = 'Missing Permissions',
    Failure = 'Command Failure',
}
/**
 * ###### Colors are cool
 */
export enum Color {
    Red = '#FF0000',
    White = '#FFFFFF',
    Black = '#000001',
    Blue = '#2b2bff',
    Purple = '#a107fa',
    Cyan = '#00bbff',
}

export enum PermissionLevel {
    Owner = 'owner',
    Admin = 'admin',
    Public = 'public',
}

export enum ButtonCustomIds {
    TABOO_ENTRY = 'Taboo Button',
    CAH_ENTRY = 'CAH Button',
    CAH_SUBMIT_MENU = 'CAH Submit Menu',
    CAH_SUBMIT_BUTTON = 'CAH submit Button',
    CAH_VOTE_BUTTON = 'CAH vote button',
}
