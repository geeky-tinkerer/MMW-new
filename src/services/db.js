import Dexie from 'dexie';

export const db = new Dexie('MMW_DB');

db.version(1).stores({
  jobs: 'id, status, clientId, date',
  clients: 'id, phone, name',
  inventory: 'id, item',
  vendors: 'id',
  templates: 'id',
  showcase: 'id, tag',
  offers: 'id',
  requests: 'id, status, clientId',
  notifications: 'id, userId, read',
  settings: 'id',
  syncQueue: '++id, endpoint, method, body, timestamp' // NEW: Sync Queue
});

// Helper to seed from API if empty
export const seedDatabase = async (initialData) => {
    const jobCount = await db.jobs.count();
    if (jobCount === 0 && initialData) {
        await db.transaction('rw', db.jobs, db.clients, db.inventory, db.vendors, db.templates, db.showcase, db.offers, db.requests, db.notifications, db.settings, async () => {
             // Bulk add all collections
             if(initialData.jobs) await db.jobs.bulkPut(initialData.jobs);
             if(initialData.clients) await db.clients.bulkPut(initialData.clients);
             if(initialData.inventory) await db.inventory.bulkPut(initialData.inventory);
             if(initialData.vendors) await db.vendors.bulkPut(initialData.vendors);
             if(initialData.templates) await db.templates.bulkPut(initialData.templates);
             if(initialData.showcase) await db.showcase.bulkPut(initialData.showcase);
             if(initialData.offers) await db.offers.bulkPut(initialData.offers);
             if(initialData.requests) await db.requests.bulkPut(initialData.requests);
             if(initialData.notifications) await db.notifications.bulkPut(initialData.notifications);
             if(initialData.settings) await db.settings.put(initialData.settings);
        });
        console.log("Database seeded from Remote/Mock API");
    }
};
