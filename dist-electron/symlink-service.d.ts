export interface SymlinkInfo {
    id: string;
    name: string;
    linkPath: string;
    targetPath: string;
    type: 'file' | 'directory';
    isValid: boolean;
    createdAt: string;
}
/**
 * Creates a new symbolic link
 */
export declare function createSymlink(linkPath: string, targetPath: string, type: 'file' | 'dir'): Promise<{
    success: boolean;
    error?: string;
}>;
/**
 * Removes a symbolic link
 */
export declare function removeSymlink(linkPath: string): Promise<{
    success: boolean;
    error?: string;
}>;
/**
 * Scans a directory for symbolic links
 */
export declare function scanDirectory(directoryPath: string): Promise<{
    success: boolean;
    symlinks?: SymlinkInfo[];
    error?: string;
}>;
/**
 * Validates if a symlink's target exists
 */
export declare function validateSymlink(linkPath: string): Promise<{
    valid: boolean;
    error?: string;
}>;
/**
 * Gets detailed information about a symlink
 */
export declare function getSymlinkInfo(linkPath: string): Promise<{
    success: boolean;
    info?: SymlinkInfo;
    error?: string;
}>;
