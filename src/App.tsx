import { useState, useCallback } from 'react';
import './index.css';

// Types
interface SymlinkInfo {
  id: string;
  name: string;
  linkPath: string;
  targetPath: string;
  type: 'file' | 'directory';
  isValid: boolean;
  createdAt: string;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
}

// Icons as simple emoji/text for now
const Icons = {
  link: '🔗',
  folder: '📁',
  file: '📄',
  add: '+',
  delete: '🗑️',
  refresh: '🔄',
  check: '✓',
  warning: '⚠️',
  error: '✕',
  arrow: '→',
  search: '🔍',
};

function App() {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [symlinks, setSymlinks] = useState<SymlinkInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast functions
  const addToast = useCallback((type: Toast['type'], title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Scan directory for symlinks
  const scanDirectory = useCallback(async (path: string) => {
    if (!path) return;

    setIsLoading(true);
    try {
      const result = await window.symlink.scan(path);
      if (result.success && result.symlinks) {
        setSymlinks(result.symlinks);
        if (result.symlinks.length === 0) {
          addToast('warning', 'Info', 'No symbolic links found in this directory.');
        } else {
          addToast('success', 'Scan Complete', `Found ${result.symlinks.length} symbolic link(s).`);
        }
      } else {
        addToast('error', 'Error', result.error || 'Failed to scan directory');
      }
    } catch {
      addToast('error', 'Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  // Select directory
  const handleSelectDirectory = async () => {
    const path = await window.dialog.openDirectory();
    if (path) {
      setCurrentPath(path);
      await scanDirectory(path);
    }
  };

  // Delete symlink
  const handleDelete = async (linkPath: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" symbolic link?`)) {
      return;
    }

    try {
      const result = await window.symlink.remove(linkPath);
      if (result.success) {
        setSymlinks(prev => prev.filter(s => s.linkPath !== linkPath));
        addToast('success', 'Deleted', `"${name}" was successfully deleted.`);
      } else {
        addToast('error', 'Error', result.error || 'Failed to delete');
      }
    } catch {
      addToast('error', 'Error', 'An unexpected error occurred');
    }
  };

  // Refresh current directory
  const handleRefresh = () => {
    if (currentPath) {
      scanDirectory(currentPath);
    }
  };

  // Stats
  const stats = {
    total: symlinks.length,
    valid: symlinks.filter(s => s.isValid).length,
    invalid: symlinks.filter(s => !s.isValid).length,
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-logo">
          <div className="app-logo-icon">{Icons.link}</div>
          <span className="app-logo-text">Symlink Manager</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            {Icons.add} New Symlink
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <aside className="app-sidebar">
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="card-header">
              <h3 className="card-title">Select Directory</h3>
            </div>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', marginBottom: 'var(--space-3)' }}
              onClick={handleSelectDirectory}
            >
              {Icons.folder} Browse
            </button>
            {currentPath && (
              <div className="directory-selector">
                <span className="directory-selector-path" title={currentPath}>
                  {currentPath}
                </span>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          {currentPath && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Statistics</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-secondary text-sm">Total</span>
                  <span className="font-semibold">{stats.total}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-secondary text-sm">Valid</span>
                  <span className="font-semibold" style={{ color: 'var(--color-success-400)' }}>{stats.valid}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-secondary text-sm">Broken</span>
                  <span className="font-semibold" style={{ color: 'var(--color-error-400)' }}>{stats.invalid}</span>
                </div>
              </div>
            </div>
          )}
        </aside>

        <section className="app-content">
          {!currentPath ? (
            <div className="empty-state">
              <div className="empty-state-icon">{Icons.folder}</div>
              <h2 className="empty-state-title">Select a directory to get started</h2>
              <p className="empty-state-description">
                Use the "Browse" button on the left to select the folder you want to scan.
              </p>
              <button className="btn btn-primary btn-lg" onClick={handleSelectDirectory}>
                {Icons.folder} Browse
              </button>
            </div>
          ) : (
            <>
              {/* Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h2 className="text-xl font-semibold">Symbolic Links</h2>
                <button
                  className="btn btn-ghost"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  {isLoading ? <div className="spinner" /> : Icons.refresh} Refresh
                </button>
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className="empty-state">
                  <div className="spinner spinner-lg" />
                  <p className="text-secondary" style={{ marginTop: 'var(--space-4)' }}>Scanning...</p>
                </div>
              ) : symlinks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">{Icons.link}</div>
                  <h2 className="empty-state-title">No symbolic links found</h2>
                  <p className="empty-state-description">
                    This directory doesn't have any symbolic links yet. Create a new one!
                  </p>
                  <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    {Icons.add} Create New Symlink
                  </button>
                </div>
              ) : (
                <div className="symlink-list">
                  {symlinks.map(symlink => (
                    <div key={symlink.id} className="symlink-item">
                      <div className={`symlink-icon ${symlink.type}`}>
                        {symlink.type === 'directory' ? Icons.folder : Icons.file}
                      </div>
                      <div className="symlink-info">
                        <div className="symlink-name">{symlink.name}</div>
                        <div className="symlink-path">{symlink.linkPath}</div>
                        <div className="symlink-target">{symlink.targetPath}</div>
                      </div>
                      <div className={`symlink-status ${symlink.isValid ? 'valid' : 'invalid'}`}>
                        {symlink.isValid ? Icons.check : Icons.warning}
                        {symlink.isValid ? 'Valid' : 'Broken'}
                      </div>
                      <div className="symlink-actions">
                        <button
                          className="btn btn-icon btn-ghost btn-danger"
                          onClick={() => handleDelete(symlink.linkPath, symlink.name)}
                          title="Delete"
                        >
                          {Icons.delete}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateSymlinkModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            if (currentPath) scanDirectory(currentPath);
            addToast('success', 'Success', 'Symbolic link created successfully.');
          }}
          onError={(error) => {
            addToast('error', 'Error', error);
          }}
        />
      )}

      {/* Toast Container */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast ${toast.type}`}>
              <span className="toast-icon">
                {toast.type === 'success' ? Icons.check : toast.type === 'error' ? Icons.error : Icons.warning}
              </span>
              <div className="toast-content">
                <div className="toast-title">{toast.title}</div>
                <div className="toast-message">{toast.message}</div>
              </div>
              <button
                className="btn btn-icon btn-ghost"
                onClick={() => removeToast(toast.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Create Symlink Modal Component
interface CreateSymlinkModalProps {
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CreateSymlinkModal({ onClose, onSuccess, onError }: CreateSymlinkModalProps) {
  const [targetPath, setTargetPath] = useState('');
  const [linkPath, setLinkPath] = useState('');
  const [linkType, setLinkType] = useState<'file' | 'dir'>('file');
  const [isCreating, setIsCreating] = useState(false);

  const handleSelectTarget = async () => {
    const path = linkType === 'dir'
      ? await window.dialog.openDirectory()
      : await window.dialog.openFile();
    if (path) setTargetPath(path);
  };

  const handleSelectLinkLocation = async () => {
    const path = await window.dialog.saveFile();
    if (path) setLinkPath(path);
  };

  const handleCreate = async () => {
    if (!targetPath || !linkPath) {
      onError('Please select both target and link location.');
      return;
    }

    setIsCreating(true);
    try {
      const result = await window.symlink.create(linkPath, targetPath, linkType);
      if (result.success) {
        onSuccess();
      } else {
        onError(result.error || 'Failed to create symlink');
      }
    } catch {
      onError('An unexpected error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">New Symbolic Link</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Link Type */}
          <div className="input-group" style={{ marginBottom: 'var(--space-5)' }}>
            <label className="input-label">Link Type</label>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                className={`btn ${linkType === 'file' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setLinkType('file')}
              >
                📄 File
              </button>
              <button
                className={`btn ${linkType === 'dir' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setLinkType('dir')}
              >
                📁 Folder
              </button>
            </div>
          </div>

          {/* Target Path */}
          <div className="input-group" style={{ marginBottom: 'var(--space-5)' }}>
            <label className="input-label">Target {linkType === 'dir' ? 'Folder' : 'File'}</label>
            <div className="input-with-button">
              <input
                type="text"
                className="input"
                value={targetPath}
                onChange={e => setTargetPath(e.target.value)}
                placeholder="Select or enter target path..."
              />
              <button className="btn btn-secondary" onClick={handleSelectTarget}>
                Browse
              </button>
            </div>
            <span className="text-xs text-tertiary">
              The actual file or folder the symlink will point to
            </span>
          </div>

          {/* Link Path */}
          <div className="input-group">
            <label className="input-label">Link Location</label>
            <div className="input-with-button">
              <input
                type="text"
                className="input"
                value={linkPath}
                onChange={e => setLinkPath(e.target.value)}
                placeholder="Where to create the symlink..."
              />
              <button className="btn btn-secondary" onClick={handleSelectLinkLocation}>
                Browse
              </button>
            </div>
            <span className="text-xs text-tertiary">
              Location and name for the new symbolic link
            </span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={isCreating || !targetPath || !linkPath}
          >
            {isCreating ? <div className="spinner" /> : null}
            {isCreating ? 'Creating...' : 'Create Symlink'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
