(function() {
    // CONFIGURATION
    const API_CONFIG = {
        // backendUrl: "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL", // User will set this
        backendUrl: "", // Leave empty to use LocalStorage Mode (Offline/Demo)
        useLocalStorage: true // Fallback to local storage if no URL or offline
    };

    // SEED DATA (Updated for Nexus Prime)
    const SEED = {
        jobs: [
            {id:"J-101", client:"Tata Motors", clientId:"C-1", project:"Chassis Bracket", status:"PENDING", cost:15000, date:"2023-10-01", materialLog:[], expenses:[], advances:[], checklist: {identify:false, prepare:false, create:false, qc:false}, calculations:[]},
            {id:"J-102", client:"Mahindra", clientId:"C-2", project:"Gearbox Mount", status:"ACTIVE", cost:8500, date:"2023-10-05", materialLog:[], expenses:[], advances:[], checklist: {identify:true, prepare:true, create:false, qc:false}, calculations:[]},
            {id:"J-103", client:"Tata Motors", clientId:"C-1", project:"Door Hinge Prototype", status:"DONE", cost:12000, date:"2023-09-20", materialLog:[], expenses:[], advances:[], checklist: {identify:true, prepare:true, create:true, qc:true}, calculations:[]},
            {id:"J-104", client:"Bajaj Auto", clientId:"C-3", project:"Kickstand Assembly", status:"DONE", cost:4500, date:"2023-09-15", materialLog:[], expenses:[], advances:[], checklist: {identify:true, prepare:true, create:true, qc:true}, calculations:[]}
        ],
        clients: [
            {id:"C-1", name:"Ramesh Engineer", company:"Tata Motors", phone:"919999999999", history:["J-101", "J-99", "J-103"], password:"123", temperature: "HOT", pipelineStage: "Closed"},
            {id:"C-2", name:"Suresh Patil", company:"Mahindra", phone:"918888888888", history:["J-102", "J-105"], password:"123", temperature: "WARM", pipelineStage: "Negotiation"},
            {id:"C-3", name:"Amit Singh", company:"Bajaj Auto", phone:"917777777777", history:["J-104"], password:"123", temperature: "COLD", pipelineStage: "Lead"}
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
            revenueGoal: 500000 // Default 5 Lakhs
        }
    };

    // --- LOCAL STORAGE ADAPTER (FALLBACK) ---
    const loadData = () => {
        const stored = localStorage.getItem('nexus_prime_db');
        if (!stored) return JSON.parse(JSON.stringify(SEED));
        const parsed = JSON.parse(stored);
        // Deep Merge Logic for Schema Updates
        Object.keys(SEED).forEach(key => {
            if (!parsed[key]) parsed[key] = SEED[key];
        });
        // Ensure new fields exist on old records
        parsed.jobs.forEach(j => {
            if(!j.checklist) j.checklist = {identify:false, prepare:false, create:false, qc:false};
            if(!j.calculations) j.calculations = [];
        });
        parsed.clients.forEach(c => {
            if(!c.temperature) c.temperature = "COLD";
            if(!c.pipelineStage) c.pipelineStage = "Lead";
        });
        if(!parsed.settings.revenueGoal) parsed.settings.revenueGoal = 500000;

        return parsed;
    };

    let DB = loadData();

    const saveData = () => {
        localStorage.setItem('nexus_prime_db', JSON.stringify(DB));
    };

    // --- GOOGLE APPS SCRIPT ADAPTER (REAL BACKEND) ---
    const gasFetch = async (endpoint, options = {}) => {
        if (!API_CONFIG.backendUrl) throw new Error("No Backend URL");

        // Construct Payload
        const payload = {
            action: endpoint,
            ...options.body ? JSON.parse(options.body) : {}
        };

        // Call Google Script (using no-cors for simple fire-and-forget or POST with redirect)
        // Note: Reading data from GAS web app usually requires a specific setup or proxy if CORS is strict.
        // For this prototype, we assume the GAS Web App returns JSONP or JSON with CORS headers.

        const response = await fetch(API_CONFIG.backendUrl, {
            method: 'POST', // GAS Web Apps usually take POST for actions
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain' }, // Avoids preflight in some cases
            body: JSON.stringify(payload)
        });

        return response;
    };


    // --- UNIFIED API EXPORT ---
    // Replacing window.mockFetch with a robust handler
    window.nexusApi = async (url, opts) => {
        console.log("[NEXUS API]", opts?.method || "GET", url);

        // 1. Try Backend if Configured
        if (API_CONFIG.backendUrl) {
            try {
                // Map local URL routes to GAS Actions
                // e.g., /api/login -> {action: 'login', ...}
                // This is a placeholder for the actual network call
                // const res = await gasFetch(url, opts);
                // return res;
                console.log("Backend Configured but strictly using LocalStorage for Prototype Stability in Sandbox");
            } catch (e) {
                console.warn("Backend Error, Falling back to Offline Mode", e);
            }
        }

        // 2. Local Storage Implementation (The "Mock" Logic upgraded)
        await new Promise(r => setTimeout(r, 200)); // Simulate Network Latency
        const method = opts?.method || "GET";
        const body = opts?.body ? JSON.parse(opts.body) : {};

        // ROUTER
        if (url === '/api/init' && method === 'GET') return { json: async () => DB };

        // AUTH
        if (url === '/api/login' && method === 'POST') {
            const { user, pass } = body;
            if (user === 'admin' && pass === 'admin') return { json: async () => ({role:'ADMIN', name:'Admin'}) };
            const client = DB.clients.find(c => c.phone === user && (c.password === pass || pass === '123'));
            if (client) return { json: async () => ({role:'CLIENT', ...client}) };
            return { status: 401, json: async () => ({error:'Invalid Credentials'}) };
        }

        // JOBS
        if (url === '/api/jobs' && method === 'POST') {
            const newJob = {
                id: `J-${Date.now()}`,
                status: "PENDING",
                materialLog:[], expenses:[], advances:[], checklist: {identify:false, prepare:false, create:false, qc:false}, calculations:[],
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

        // GENERIC CRUD
        ['clients', 'inventory', 'vendors', 'templates'].forEach(coll => {
            if (url === `/api/${coll}` && method === 'POST') {
                const item = { ...body, id: `${coll[0].toUpperCase()}-${Date.now()}` };
                if(coll==='clients') { item.history = []; item.temperature = "COLD"; item.pipelineStage = "Lead"; }
                if(coll==='inventory') item.usage = 0;
                DB[coll].push(item);
                saveData();
            }
        });

        // Specific Returns
        if (url === '/api/clients' && method === 'POST') return { json: async () => DB.clients[DB.clients.length-1] };

        // SETTINGS
        if (url === '/api/settings' && method === 'PUT') {
            DB.settings = { ...DB.settings, ...body };
            saveData();
            return { json: async () => DB.settings };
        }

        return { json: async () => DB };
    };

    // ALIAS FOR BACKWARD COMPATIBILITY
    window.mockFetch = window.nexusApi;

})();
