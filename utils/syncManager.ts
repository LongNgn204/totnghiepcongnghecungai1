// Sync Manager - Đồng bộ localStorage với backend

import api from './apiClient';

interface SyncConfig {
  autoSync: boolean;
  syncInterval: number; // milliseconds
  enabled: boolean;
}

class SyncManager {
  private isSyncPaused: boolean = true; // Start as paused
  private config: SyncConfig;
  private syncInProgress = false;
  private lastSyncTime = 0;
  private syncTimer: number | null = null;

  constructor() {
    this.config = this.loadConfig();
    window.addEventListener('online', () => {
      if (this.config.enabled && !this.isSyncPaused) {
        this.syncAll();
      }
    });
  }

  private loadConfig(): SyncConfig {
    const stored = localStorage.getItem('sync_config');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      autoSync: true,
      syncInterval: 5 * 60 * 1000, // 5 minutes
      enabled: true,
    };
  }

  saveConfig(config: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...config };
    localStorage.setItem('sync_config', JSON.stringify(this.config));
    if (this.config.autoSync && this.config.enabled) {
      this.startAutoSync();
    } else {
      this.stopAutoSync();
    }
  }

  getConfig(): SyncConfig {
    return { ...this.config };
  }

  async syncAll(): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (this.syncInProgress || !this.config.enabled || !navigator.onLine || !token) {
      console.log('[Sync] Skipped:', { inProgress: this.syncInProgress, enabled: this.config.enabled, online: navigator.onLine, authenticated: !!token });
      return;
    }
    this.syncInProgress = true;
    try {
      const startTime = Date.now();
      console.log('[Sync] Starting full sync...');
      await Promise.allSettled([api.exams.getAll(), api.flashcards.decks.getAll(), api.chat.getAll()]);
      this.lastSyncTime = Date.now();
      localStorage.setItem('last_sync_time', String(this.lastSyncTime));
      console.log(`[Sync] Completed in ${Date.now() - startTime}ms`);
      window.dispatchEvent(new CustomEvent('sync-completed', { detail: { lastSyncTime: this.lastSyncTime } }));
    } catch (error) {
      console.error('[Sync] Failed:', error);
      if ((error as any).status === 401) {
        this.pauseSync();
      }
      window.dispatchEvent(new CustomEvent('sync-error', { detail: { error } }));
    } finally {
      this.syncInProgress = false;
    }
  }

  startAutoSync(): void {
    if (this.isSyncPaused || !localStorage.getItem('auth_token')) {
      console.warn('[Sync] Auto-sync not started: paused or not authenticated.');
      return;
    }
    this.stopAutoSync();
    if (!this.config.enabled) return;
    this.syncTimer = window.setInterval(() => {
      if (navigator.onLine && this.config.enabled && !this.isSyncPaused && localStorage.getItem('auth_token')) {
        this.syncAll();
      }
    }, this.config.syncInterval);
    console.log('[Sync] Auto-sync started.');
  }

  stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
      console.log('[Sync] Auto-sync stopped');
    }
  }

  pauseSync(): void {
    this.isSyncPaused = true;
    this.stopAutoSync();
    console.warn('[Sync] Sync paused.');
  }

  resumeSync(): void {
    this.isSyncPaused = false;
    this.startAutoSync();
    console.log('[Sync] Sync resumed.');
    this.syncAll(); // Trigger immediate sync on resume
  }

  getLastSyncTime(): number {
    const stored = localStorage.getItem('last_sync_time');
    return stored ? parseInt(stored) : 0;
  }

  isSyncing(): boolean {
    return this.syncInProgress;
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }
}

export const syncManager = new SyncManager();

export const pauseSync = () => syncManager.pauseSync();
export const resumeSync = () => syncManager.resumeSync();

export default syncManager;
