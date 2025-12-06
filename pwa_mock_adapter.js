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
            {id:"S-1", title:"Luxury Gate", tag:"Gate", color:"#1e293b"},
            {id:"S-2", title:"Heavy Duty Grill", tag:"Grill", color:"#334155"},
            {id:"S-3", title:"Industrial Rack", tag:"Industrial", color:"#475569"},
            {id:"S-4", title:"Garden Gate", tag:"Gate", color:"#0f172a"},
            {id:"S-5", title:"Balcony Railing", tag:"Grill", color:"#1e293b"}
        ],
        offers: [
            {id:"O-1", title:"Monsoon Sale", desc:"10% off on Gate Fabrication"},
            {id:"O-2", title:"Free Design", desc:"Free CAD Design for orders > 50k"}
        ],
        settings: {
            theme: "dark",
            whatsappBlurb: "Hello, I am interested in a fabrication job.",
            shopName: "Manku Metal Works"
        }
    };

    const loadData = () => {
        const stored = localStorage.getItem('mmw_db');
        if (!stored) return JSON.parse(JSON.stringify(SEED));

        const parsed = JSON.parse(stored);
        // Robust Merge: Ensure all SEED arrays exist in parsed data
        // This fixes the crash where new features (showcase) are missing in old localStorage
        Object.keys(SEED).forEach(key => {
            if (!parsed[key]) parsed[key] = SEED[key];
        });
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

        // GET ALL
        if (url === '/api/init' && method === 'GET') {
            return { json: async () => DB };
        }

        // --- AUTH ---
        if (url === '/api/login' && method === 'POST') {
            const { user, pass } = body;
            if (user === 'admin' && pass === 'admin') return { json: async () => ({role:'ADMIN', name:'Admin'}) };
            const client = DB.clients.find(c => c.phone === user && (c.password === pass || pass === '123'));
            if (client) return { json: async () => ({role:'CLIENT', ...client}) };
            return { status: 401, json: async () => ({error:'Invalid Credentials'}) };
        }

        // --- JOBS ---
        if (url === '/api/jobs' && method === 'POST') {
            // Visitor request or Admin create
            const newJob = {
                id: `J-${Date.now()}`,
                status: "PENDING",
                materialLog:[], expenses:[], advances:[],
                ...body
            };
            DB.jobs.unshift(newJob);
            saveData();
            return { json: async () => newJob };
        }
        if (url.startsWith('/api/jobs/') && method === 'PUT') {
            const id = url.split('/').pop();
            const idx = DB.jobs.findIndex(j => j.id === id);
            if (idx > -1) {
                DB.jobs[idx] = { ...DB.jobs[idx], ...body };
                saveData();
                return { json: async () => DB.jobs[idx] };
            }
        }
        if (url.startsWith('/api/jobs/') && method === 'DELETE') {
            const id = url.split('/').pop();
            DB.jobs = DB.jobs.filter(j => j.id !== id);
            saveData();
            return { json: async () => ({success:true}) };
        }

        // --- CLIENTS ---
        if (url === '/api/clients' && method === 'POST') {
            const newClient = { ...body, id: `C-${Date.now()}`, history:[] };
            DB.clients.unshift(newClient);
            saveData();
            return { json: async () => newClient };
        }

        // --- INVENTORY ---
        if (url === '/api/inventory' && method === 'POST') {
            const newItem = { ...body, id: `I-${Date.now()}`, usage:0 };
            DB.inventory.push(newItem);
            saveData();
            return { json: async () => newItem };
        }
        if (url.startsWith('/api/inventory/') && method === 'PUT') {
            const id = url.split('/').pop();
            const idx = DB.inventory.findIndex(i => i.id === id);
            if (idx > -1) {
                DB.inventory[idx] = { ...DB.inventory[idx], ...body };
                saveData();
                return { json: async () => DB.inventory[idx] };
            }
        }

        // --- VENDORS ---
        if (url === '/api/vendors' && method === 'POST') {
            const newVendor = { ...body, id: `V-${Date.now()}` };
            DB.vendors.push(newVendor);
            saveData();
            return { json: async () => newVendor };
        }

        // --- TEMPLATES ---
        if (url === '/api/templates' && method === 'POST') {
            const newTemplate = { ...body, id: `T-${Date.now()}` };
            DB.templates.push(newTemplate);
            saveData();
            return { json: async () => newTemplate };
        }

        // --- SETTINGS ---
        if (url === '/api/settings' && method === 'PUT') {
            DB.settings = { ...DB.settings, ...body };
            saveData();
            return { json: async () => DB.settings };
        }

        return { json: async () => DB };
    };
})();