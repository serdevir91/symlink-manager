const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const {
    createSymlink,
    removeSymlink,
    scanDirectory,
    validateSymlink,
    getSymlinkInfo
} = require('./symlink-service.js');

let mainWindow = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        titleBarStyle: 'hiddenInset',
        frame: true,
        backgroundColor: '#0a0a0a',
        show: false
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        // DevTools icin: View > Toggle Developer Tools veya Ctrl+Shift+I
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// IPC Handlers
ipcMain.handle('symlink:create', async (_event, linkPath, targetPath, type) => {
    return await createSymlink(linkPath, targetPath, type);
});

ipcMain.handle('symlink:remove', async (_event, linkPath) => {
    return await removeSymlink(linkPath);
});

ipcMain.handle('symlink:scan', async (_event, directoryPath) => {
    return await scanDirectory(directoryPath);
});

ipcMain.handle('symlink:validate', async (_event, linkPath) => {
    return await validateSymlink(linkPath);
});

ipcMain.handle('symlink:info', async (_event, linkPath) => {
    return await getSymlinkInfo(linkPath);
});

ipcMain.handle('dialog:openFile', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile']
    });
    return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('dialog:openDirectory', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
    return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('dialog:saveFile', async (_event, defaultPath) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath
    });
    return result.canceled ? null : result.filePath;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
