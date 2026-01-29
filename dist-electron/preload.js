import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('symlink', {
    create: (linkPath, targetPath, type) => ipcRenderer.invoke('symlink:create', linkPath, targetPath, type),
    remove: (linkPath) => ipcRenderer.invoke('symlink:remove', linkPath),
    scan: (directoryPath) => ipcRenderer.invoke('symlink:scan', directoryPath),
    validate: (linkPath) => ipcRenderer.invoke('symlink:validate', linkPath),
    info: (linkPath) => ipcRenderer.invoke('symlink:info', linkPath)
});
contextBridge.exposeInMainWorld('dialog', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
    saveFile: (defaultPath) => ipcRenderer.invoke('dialog:saveFile', defaultPath)
});
