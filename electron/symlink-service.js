const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Creates a new symbolic link
 */
async function createSymlink(linkPath, targetPath, type) {
    try {
        // Check if target exists
        await fs.access(targetPath);

        // Create symlink
        await fs.symlink(targetPath, linkPath, type === 'dir' ? 'junction' : 'file');

        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        // Check for permission errors
        if (errorMessage.includes('EPERM') || errorMessage.includes('privilege')) {
            return {
                success: false,
                error: 'Yönetici yetkileri gerekiyor. Uygulamayı yönetici olarak çalıştırın.'
            };
        }

        return { success: false, error: errorMessage };
    }
}

/**
 * Removes a symbolic link
 */
async function removeSymlink(linkPath) {
    try {
        const stats = await fs.lstat(linkPath);

        if (!stats.isSymbolicLink()) {
            return { success: false, error: 'Bu bir sembolik link değil' };
        }

        await fs.unlink(linkPath);
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return { success: false, error: errorMessage };
    }
}

/**
 * Scans a directory for symbolic links
 */
async function scanDirectory(directoryPath) {
    try {
        const entries = await fs.readdir(directoryPath, { withFileTypes: true });
        const symlinks = [];

        for (const entry of entries) {
            const fullPath = path.join(directoryPath, entry.name);

            try {
                const stats = await fs.lstat(fullPath);

                if (stats.isSymbolicLink()) {
                    const targetPath = await fs.readlink(fullPath);
                    const isValid = await checkTargetExists(targetPath, directoryPath);

                    // Determine type by checking the target
                    let type = 'file';
                    try {
                        const targetStats = await fs.stat(fullPath);
                        type = targetStats.isDirectory() ? 'directory' : 'file';
                    } catch {
                        // Target doesn't exist or can't be accessed
                    }

                    symlinks.push({
                        id: uuidv4(),
                        name: entry.name,
                        linkPath: fullPath,
                        targetPath: path.isAbsolute(targetPath)
                            ? targetPath
                            : path.resolve(directoryPath, targetPath),
                        type,
                        isValid,
                        createdAt: stats.birthtime.toISOString()
                    });
                }
            } catch {
                // Skip files we can't access
                continue;
            }
        }

        return { success: true, symlinks };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return { success: false, error: errorMessage };
    }
}

/**
 * Validates if a symlink's target exists
 */
async function validateSymlink(linkPath) {
    try {
        const stats = await fs.lstat(linkPath);

        if (!stats.isSymbolicLink()) {
            return { valid: false, error: 'Bu bir sembolik link değil' };
        }

        // Try to access the target
        await fs.stat(linkPath);
        return { valid: true };
    } catch (error) {
        if (error.code === 'ENOENT') {
            return { valid: false, error: 'Hedef dosya/klasör bulunamadı' };
        }
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return { valid: false, error: errorMessage };
    }
}

/**
 * Gets detailed information about a symlink
 */
async function getSymlinkInfo(linkPath) {
    try {
        const stats = await fs.lstat(linkPath);

        if (!stats.isSymbolicLink()) {
            return { success: false, error: 'Bu bir sembolik link değil' };
        }

        const targetPath = await fs.readlink(linkPath);
        const name = path.basename(linkPath);
        const directory = path.dirname(linkPath);

        const isValid = await checkTargetExists(targetPath, directory);

        let type = 'file';
        try {
            const targetStats = await fs.stat(linkPath);
            type = targetStats.isDirectory() ? 'directory' : 'file';
        } catch {
            // Target doesn't exist
        }

        return {
            success: true,
            info: {
                id: uuidv4(),
                name,
                linkPath,
                targetPath: path.isAbsolute(targetPath)
                    ? targetPath
                    : path.resolve(directory, targetPath),
                type,
                isValid,
                createdAt: stats.birthtime.toISOString()
            }
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return { success: false, error: errorMessage };
    }
}

/**
 * Helper function to check if a target path exists
 */
async function checkTargetExists(targetPath, basePath) {
    try {
        const absolutePath = path.isAbsolute(targetPath)
            ? targetPath
            : path.resolve(basePath, targetPath);
        await fs.access(absolutePath);
        return true;
    } catch {
        return false;
    }
}

module.exports = {
    createSymlink,
    removeSymlink,
    scanDirectory,
    validateSymlink,
    getSymlinkInfo
};
