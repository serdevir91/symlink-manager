export interface SymlinkInfo {
    id: string;
    name: string;
    linkPath: string;
    targetPath: string;
    type: 'file' | 'directory';
    isValid: boolean;
    createdAt: string;
}
export interface SymlinkAPI {
    create: (linkPath: string, targetPath: string, type: 'file' | 'dir') => Promise<{
        success: boolean;
        error?: string;
    }>;
    remove: (linkPath: string) => Promise<{
        success: boolean;
        error?: string;
    }>;
    scan: (directoryPath: string) => Promise<{
        success: boolean;
        symlinks?: SymlinkInfo[];
        error?: string;
    }>;
    validate: (linkPath: string) => Promise<{
        valid: boolean;
        error?: string;
    }>;
    info: (linkPath: string) => Promise<{
        success: boolean;
        info?: SymlinkInfo;
        error?: string;
    }>;
}
export interface DialogAPI {
    openFile: () => Promise<string | null>;
    openDirectory: () => Promise<string | null>;
    saveFile: (defaultPath?: string) => Promise<string | null>;
}
