(function() {
    const SEED = {
        jobs: [
            {id:"J-101", client:"Tata Motors", clientId:"C-1", project:"Chassis Bracket", status:"PENDING", cost:15000, date:"2023-10-01", materialLog:[], expenses:[], advances:[]},
            {id:"J-102", client:"Mahindra", clientId:"C-2", project:"Gearbox Mount", status:"ACTIVE", cost:8500, date:"2023-10-05", materialLog:[], expenses:[], advances:[]},
            {id:"J-103", client:"Tata Motors", clientId:"C-1", project:"Door Hinge Prototype", status:"DONE", cost:12000, date:"2023-09-20", materialLog:[], expenses:[], advances:[]},
            {id:"J-104", client:"Bajaj Auto", clientId:"C-3", project:"Kickstand Assembly", status:"DONE", cost:4500, date:"2023-09-15", materialLog:[], expenses:[], advances:[]},
            {id:"J-105", client:"Mahindra", clientId:"C-2", project:"Bumper Guard", status:"ACTIVE", cost:22000, date:"2023-10-10", materialLog:[], expenses:[], advances:[]}
        ],
        clients: [
            {id:"C-1", name:"Ramesh Engineer", company:"Tata Motors", phone:"919999999999", history:["J-101", "J-99", "J-103"], password:"123"},
            {id:"C-2", name:"Suresh Patil", company:"Mahindra", phone:"918888888888", history:["J-102", "J-105"], password:"123"},
            {id:"C-3", name:"Amit Singh", company:"Bajaj Auto", phone:"917777777777", history:["J-104"], password:"123"}
        ],
        inventory: [
            {id:"I-1", item:"MS Sheet 2mm", stock:15, unit:"sheet", usage: 8},
            {id:"I-2", item:"SS Tube 1inch", stock:40, unit:"ft", usage: 25},
            {id:"I-3", item:"Angle Iron 2x2", stock:20, unit:"ft", usage: 12},
            {id:"I-4", item:"Welding Rods", stock:5, unit:"box", usage: 50}
        ],
        vendors: [
            {id:"V-1", name:"Steel City Suppliers", contact:"Vikram", phone:"9988776655", material:"MS/SS Sheets"},
            {id:"V-2", name:"Pune Industrial Gas", contact:"Rahul", phone:"8877665544", material:"Argon/CO2"}
        ],
        templates: [
            {id:"T-1", name:"Standard Gate", project:"Standard Gate", cost:25000},
            {id:"T-2", name:"Window Grill (4x4)", project:"Window Grill 4x4", cost:4000}
        ],
        showcase: [
            {id:"S-1", title:"Luxury Gate", tag:"Gate", img:"https://placehold.co/600x400/1e293b/FFF?text=Luxury+Gate"},
            {id:"S-2", title:"Heavy Duty Grill", tag:"Grill", img:"https://placehold.co/600x400/334155/FFF?text=Grill"},
            {id:"S-3", title:"Industrial Rack", tag:"Industrial", img:"https://placehold.co/600x400/475569/FFF?text=Industrial+Rack"},
            {id:"S-4", title:"Garden Gate", tag:"Gate", img:"https://placehold.co/600x400/0f172a/FFF?text=Garden+Gate"},
            {id:"S-5", title:"Balcony Railing", tag:"Grill", img:"https://placehold.co/600x400/1e293b/FFF?text=Railing"}
        ],
        offers: [
            {id:"O-1", title:"Monsoon Sale", desc:"10% off on Gate Fabrication"},
            {id:"O-2", title:"Free Design", desc:"Free CAD Design for orders > 50k"},
            {id:"O-3", title:"Referral Bonus", desc:"Get ₹500 for referring a client"}
        ],
        settings: {
            theme: "dark", // dark, light, festival
            whatsappBlurb: "Hello, I am interested in a fabrication job.",
            shopName: "Manku Metal Works",
            monthlyTarget: 100000
        }
    };

    const loadData = () => {
        const stored = localStorage.getItem('mmw_db');
        if (!stored) return JSON.parse(JSON.stringify(SEED));

        const parsed = JSON.parse(stored);
        // Robust Merge: Ensure all SEED arrays exist in parsed data
        Object.keys(SEED).forEach(key => {
            if (!parsed[key]) parsed[key] = SEED[key];
        });

        // Migration: Ensure monthlyTarget exists
        if (!parsed.settings.monthlyTarget) parsed.settings.monthlyTarget = SEED.settings.monthlyTarget;

        // Migration: Showcase images array
        if (parsed.showcase) {
            parsed.showcase.forEach(s => {
                if (s.img && !s.images) {
                    s.images = [s.img, s.img, s.img]; // Seed with 3 for demo
                    delete s.img;
                }
            });
        }

        return parsed;
    };

    let DB = loadData();

    const saveData = () => {
        localStorage.setItem('mmw_db', JSON.stringify(DB));
    };

    window.mockFetch = async (url, opts) => {
        console.log("[MOCK]", opts?.method || "GET", url, opts?.body);
        await new Promise(r => setTimeout(r, 200));

        const method = opts?.method || "GET";
        const body = opts?.body ? JSON.parse(opts.body) : {};

        // API ROUTER
        if (url === '/api/init' && method === 'GET') return { ok: true, status: 200, json: async () => DB };

        // --- AUTH ---
        if (url === '/api/login' && method === 'POST') {
            const { user, pass } = body;
            if (user === 'admin' && pass === 'admin') return { ok: true, status: 200, json: async () => ({role:'ADMIN', name:'Admin'}) };
            const client = DB.clients.find(c => c.phone === user && (c.password === pass || pass === '123'));
            if (client) return { ok: true, status: 200, json: async () => ({role:'CLIENT', ...client}) };
            return { ok: false, status: 401, json: async () => ({error:'Invalid Credentials'}) };
        }

        // --- JOBS ---
        if (url === '/api/jobs' && method === 'POST') {
            const newJob = {
                id: `J-${Date.now()}`,
                status: "PENDING",
                materialLog:[], expenses:[], advances:[],
                ...body
            };
            DB.jobs.unshift(newJob);
            saveData();
            return { ok: true, status: 200, json: async () => newJob };
        }
        if (url.startsWith('/api/jobs/') && method === 'PUT') {
            const id = url.split('/').pop();
            const idx = DB.jobs.findIndex(j => j.id === id);
            if (idx > -1) {
                DB.jobs[idx] = { ...DB.jobs[idx], ...body };
                saveData();
                return { ok: true, status: 200, json: async () => DB.jobs[idx] };
            }
        }
        if (url.startsWith('/api/jobs/') && method === 'DELETE') {
            const id = url.split('/').pop();
            DB.jobs = DB.jobs.filter(j => j.id !== id);
            saveData();
            return { ok: true, status: 200, json: async () => ({success:true}) };
        }

        // --- CLIENTS, INVENTORY, VENDORS, TEMPLATES (Standard Create) ---
        ['clients', 'inventory', 'vendors', 'templates', 'showcase'].forEach(coll => {
            if (url === `/api/${coll}` && method === 'POST') {
                const item = { ...body, id: `${coll[0].toUpperCase()}-${Date.now()}` };
                if(coll==='clients') item.history = [];
                if(coll==='inventory') item.usage = 0;
                if(coll==='showcase' && !item.images) item.images = [];
                DB[coll].push(item);
                saveData();
                // Return wrapped item
                // We need to return a promise for this
            }
        });

        // Manual implementation for return values to avoid async issues in loop above
        if (url === '/api/clients' && method === 'POST') return { ok: true, status: 200, json: async () => DB.clients[DB.clients.length-1] };
        if (url === '/api/vendors' && method === 'POST') return { ok: true, status: 200, json: async () => DB.vendors[DB.vendors.length-1] };
        if (url === '/api/templates' && method === 'POST') return { ok: true, status: 200, json: async () => DB.templates[DB.templates.length-1] };
        if (url === '/api/inventory' && method === 'POST') return { ok: true, status: 200, json: async () => DB.inventory[DB.inventory.length-1] };
        if (url === '/api/showcase' && method === 'POST') return { ok: true, status: 200, json: async () => DB.showcase[DB.showcase.length-1] };

        // --- UPDATES (PUT) ---
        if (url.startsWith('/api/clients/') && method === 'PUT') {
            const id = url.split('/').pop();
            const idx = DB.clients.findIndex(c => c.id === id);
            if (idx > -1) {
                DB.clients[idx] = { ...DB.clients[idx], ...body };
                saveData();
                return { ok: true, status: 200, json: async () => DB.clients[idx] };
            }
        }
        if (url.startsWith('/api/inventory/') && method === 'PUT') {
            const id = url.split('/').pop();
            const idx = DB.inventory.findIndex(i => i.id === id);
            if (idx > -1) {
                DB.inventory[idx] = { ...DB.inventory[idx], ...body };
                saveData();
                return { ok: true, status: 200, json: async () => DB.inventory[idx] };
            }
        }
        if (url.startsWith('/api/showcase/') && method === 'PUT') {
            const id = url.split('/').pop();
            const idx = DB.showcase.findIndex(s => s.id === id);
            if (idx > -1) {
                // Special handling for images array if needed, but generic merge works for now
                // If body contains images: [...], it replaces. If we want push, logic should be in frontend
                DB.showcase[idx] = { ...DB.showcase[idx], ...body };
                saveData();
                return { ok: true, status: 200, json: async () => DB.showcase[idx] };
            }
        }
        if (url.startsWith('/api/showcase/') && method === 'DELETE') {
            const id = url.split('/').pop();
            DB.showcase = DB.showcase.filter(s => s.id !== id);
            saveData();
            return { ok: true, status: 200, json: async () => ({success:true}) };
        }

        // --- SETTINGS ---
        if (url === '/api/settings' && method === 'PUT') {
            DB.settings = { ...DB.settings, ...body };
            saveData();
            return { ok: true, status: 200, json: async () => DB.settings };
        }

        // --- GAS PROXY (Simulated) ---
        if (url === '/api/exec' && method === 'POST') {
            if (body.action === 'upload_image') {
                console.log("[MOCK] Upload Image:", body.filename, body.mimeType);

                // Stress Test Simulation: Random Failures or Timeouts
                // if (Math.random() < 0.1) return { status: 500, json: async () => ({error: "Simulated Server Error"}) };

                // GAS Payload Limit Check (approx 2MB limit usually, but user said 50KB or something small? No "payload limits" usually means 50MB for POST, but GAS execution time is limit. User mentioned base64 string exceeds limits.)
                // Let's assume the compression target is ~150KB. If we get something huge, we fail.
                if (body.image.length > 2000000) { // 2MB roughly
                     return { ok: false, status: 413, json: async() => ({error: "Payload Too Large"}) };
                }

                return { ok: true, status: 200, json: async () => ({status: "success", url: "https://placehold.co/600x400/green/white?text=Uploaded+Image"}) };
            }
        }

        return { ok: true, status: 200, json: async () => DB };
    };
})();