import { create } from 'zustand';
import api from '../services/api';
import { db, seedDatabase } from '../services/db';

const useStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('mmw_user')) || null,
  isLoading: false,
  isOnline: navigator.onLine,
  deferredPrompt: null, // PWA Install Prompt

  // Data State
  jobs: [],
  clients: [],
  inventory: [],
  settings: {},

  // Actions
  setUser: (user) => {
    if (user) localStorage.setItem('mmw_user', JSON.stringify(user));
    else localStorage.removeItem('mmw_user');
    set({ user });
  },

  setOnlineStatus: (status) => {
      set({ isOnline: status });
      if (status) get().flushSyncQueue();
  },

  setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),

  // Hydrate Data: Remote -> IndexedDB -> Zustand
  hydrate: async () => {
    set({ isLoading: true });
    try {
        let remoteData = null;
        if (navigator.onLine) {
            try {
                remoteData = await api.get('/init');
            } catch (e) {
                console.warn("Remote sync failed, falling back to local DB", e);
            }
        }

        if (remoteData) {
            await seedDatabase(remoteData);
        }

        const jobs = await db.jobs.toArray();
        const clients = await db.clients.toArray();
        const inventory = await db.inventory.toArray();
        const settings = await db.settings.get('global');

        // MIGRATION Logic (Simulated for Prototype)
        const updatedJobs = await Promise.all(jobs.map(async j => {
             let changed = false;
             if (!j.checklist || j.checklist.length === 0) {
                 j.checklist = [
                     { id: 'chk-1', label: 'Material Stock Check', checked: false },
                     { id: 'chk-2', label: 'Dimensions Verified', checked: false },
                     { id: 'chk-3', label: 'Joint Strength Check', checked: false },
                     { id: 'chk-4', label: 'Final QC', checked: false }
                 ];
                 changed = true;
             }
             if (j.status === 'ACTIVE') {
                 j.status = 'CUTTING';
                 changed = true;
             }
             if (changed) await db.jobs.put(j);
             return j;
        }));

        set({ jobs: updatedJobs, clients, inventory, settings: settings || {} });
    } catch (err) {
        console.error("Hydration Failed", err);
    } finally {
        set({ isLoading: false });
    }
  },

  // SYNC QUEUE LOGIC
  addToSyncQueue: async (endpoint, method, body) => {
      console.log(`[Offline] Queueing ${method} ${endpoint}`);
      await db.syncQueue.add({ endpoint, method, body, timestamp: Date.now() });
  },

  flushSyncQueue: async () => {
      const count = await db.syncQueue.count();
      if (count === 0) return;

      console.log(`[Sync] Flushing ${count} items...`);
      const queue = await db.syncQueue.toArray();

      // Sort by timestamp to preserve order
      queue.sort((a,b) => a.timestamp - b.timestamp);

      for (const item of queue) {
          try {
              if (item.method === 'POST') await api.post(item.endpoint, item.body);
              if (item.method === 'PUT') await api.put(item.endpoint, item.body);
              if (item.method === 'DELETE') await api.delete(item.endpoint);

              await db.syncQueue.delete(item.id);
          } catch (e) {
              console.error(`[Sync] Failed to sync item ${item.id}`, e);
              // In production, we might increment a retry counter or leave it for next time
              // For now, we leave it in queue if network error, but if it's a 4xx, maybe delete.
              // Assuming network error -> Keep.
          }
      }
      console.log("[Sync] Complete");
  },

  addJob: async (jobData) => {
     const tempId = `TEMP-${Date.now()}`;
     const defaultChecklist = [
         { id: 'chk-1', label: 'Material Stock Check', checked: false },
         { id: 'chk-2', label: 'Dimensions Verified', checked: false },
         { id: 'chk-3', label: 'Joint Strength Check', checked: false },
         { id: 'chk-4', label: 'Final QC', checked: false }
     ];
     const newJob = { ...jobData, id: tempId, status: 'PENDING', checklist: defaultChecklist };

     set(state => ({ jobs: [newJob, ...state.jobs] }));

     try {
         await db.jobs.add(newJob);
         if (navigator.onLine) {
             const serverJob = await api.post('/jobs', { ...jobData, checklist: defaultChecklist });
             await db.jobs.delete(tempId);
             await db.jobs.put(serverJob);
             set(state => ({
                 jobs: state.jobs.map(j => j.id === tempId ? serverJob : j)
             }));
         } else {
             await get().addToSyncQueue('/jobs', 'POST', { ...jobData, checklist: defaultChecklist });
         }
     } catch (e) {
         console.error("Add Job Failed", e);
     }
  },

  updateJobStatus: async (jobId, newStatus) => {
      const state = get();
      const job = state.jobs.find(j => j.id === jobId);
      if (!job) return;

      const updatedJob = { ...job, status: newStatus };

      set(state => ({
          jobs: state.jobs.map(j => j.id === jobId ? updatedJob : j)
      }));

      try {
          await db.jobs.put(updatedJob);
          if (navigator.onLine) {
              await api.put(`/jobs/${jobId}`, { status: newStatus });
          } else {
              await get().addToSyncQueue(`/jobs/${jobId}`, 'PUT', { status: newStatus });
          }
      } catch (e) {
          console.error("Update Status Failed", e);
      }
  }
}));

export default useStore;
