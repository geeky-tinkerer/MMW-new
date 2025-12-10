
const SEED = {
    jobs: [
        {id:"J-101", client:"Tata Motors", clientId:"C-1", project:"Chassis Bracket", status:"PENDING", cost:15000, date:"2023-10-01", deliveryDate: "2023-10-15", gallery: [], materialLog:[], expenses:[], advances:[], workLog:[], notes:[{id:"N1", text:"Initial Concept Approved", date:"2023-10-02", isPublic:true}]},
        {id:"J-102", client:"Mahindra", clientId:"C-2", project:"Gearbox Mount", status:"ACTIVE", cost:8500, date:"2023-10-05", deliveryDate: "2023-10-20", gallery: [], materialLog:[], expenses:[], advances:[], workLog:[], notes:[]},
        {id:"J-103", client:"Tata Motors", clientId:"C-1", project:"Door Hinge Prototype", status:"DONE", cost:12000, date:"2023-09-20", deliveryDate: "2023-09-25", gallery: [], materialLog:[], expenses:[], advances:[], workLog:[], notes:[]},
        {id:"J-104", client:"Bajaj Auto", clientId:"C-3", project:"Kickstand Assembly", status:"DONE", cost:4500, date:"2023-09-15", deliveryDate: "2023-09-18", gallery: [], materialLog:[], expenses:[], advances:[], workLog:[], notes:[]},
        {id:"J-105", client:"Mahindra", clientId:"C-2", project:"Bumper Guard", status:"ACTIVE", cost:22000, date:"2023-10-10", deliveryDate: "2023-10-30", gallery: [], materialLog:[], expenses:[], advances:[], workLog:[], notes:[]}
    ],
    requests: [
        {id:"R-1", type:"APPT", clientId:"C-1", clientName:"Ramesh Engineer", status:"OPEN", details:{date:"2023-11-01", time:"10:00", reason:"New Project Discussion"}, date:"2023-10-25"},
        {id:"R-2", type:"QUOTE", clientId:"C-2", clientName:"Suresh Patil", status:"CLOSED", details:{desc:"Safety Grill for 3 windows", image:null}, date:"2023-10-20"}
    ],
    notifications: [
        {id:"N-1", userId:"C-1", text:"Your order J-101 is now PENDING approval.", date:"2023-10-01", read: false},
        {id:"N-2", userId:"C-2", text:"Payment received for J-102.", date:"2023-10-06", read: true}
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
        {id:"S-1", title:"Luxury Gate", tag:"Gate", images:["https://placehold.co/600x400/1e293b/FFF?text=Luxury+Gate"]},
        {id:"S-2", title:"Heavy Duty Grill", tag:"Grill", images:["https://placehold.co/600x400/334155/FFF?text=Grill"]},
        {id:"S-3", title:"Industrial Rack", tag:"Industrial", images:["https://placehold.co/600x400/475569/FFF?text=Industrial+Rack"]},
        {id:"S-4", title:"Garden Gate", tag:"Gate", images:["https://placehold.co/600x400/0f172a/FFF?text=Garden+Gate"]},
        {id:"S-5", title:"Balcony Railing", tag:"Grill", images:["https://placehold.co/600x400/1e293b/FFF?text=Railing"]}
    ],
    offers: [
        {id:"O-1", title:"Monsoon Sale", desc:"10% off on Gate Fabrication"},
        {id:"O-2", title:"Free Design", desc:"Free CAD Design for orders > 50k"},
        {id:"O-3", title:"Referral Bonus", desc:"Get ₹500 for referring a client"}
    ],
    settings: {
        id: "global",
        theme: "dark",
        whatsappBlurb: "Hello, I am interested in a fabrication job.",
        shopName: "Manku Metal Works",
        monthlyTarget: 100000
    }
};

// Internal Memory for Mock Backend
let MOCK_DB = JSON.parse(JSON.stringify(SEED));

// Migration Logic: ACTIVE -> CUTTING
MOCK_DB.jobs.forEach(job => {
    if (job.status === 'ACTIVE') {
        job.status = 'CUTTING';
    }
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MockBackend = {
    async request(method, endpoint, body = null) {
        console.log(`[MockAPI] ${method} ${endpoint}`, body);
        await delay(500); // Simulate latency

        // --- INIT / SYNC ---
        if (endpoint === '/init' && method === 'GET') {
            return { ...MOCK_DB };
        }

        // --- AUTH ---
        if (endpoint === '/login' && method === 'POST') {
            const { user, pass } = body;
            if (user === 'admin' && pass === 'admin') return { role: 'ADMIN', name: 'Admin', id: 'ADMIN' };
            const client = MOCK_DB.clients.find(c => c.phone === user && (c.password === pass || pass === '123'));
            if (client) return { role: 'CLIENT', ...client };
            throw new Error('Invalid Credentials');
        }

        // --- JOBS ---
        if (endpoint === '/jobs' && method === 'POST') {
            const newJob = {
                id: `J-${Date.now()}`,
                status: "PENDING",
                materialLog: [], expenses: [], advances: [], workLog: [], notes: [],
                gallery: [],
                ...body
            };
            MOCK_DB.jobs.unshift(newJob);
            return newJob;
        }
        if (endpoint.startsWith('/jobs/') && method === 'PUT') {
            const id = endpoint.split('/').pop();
            const idx = MOCK_DB.jobs.findIndex(j => j.id === id);
            if (idx > -1) {
                MOCK_DB.jobs[idx] = { ...MOCK_DB.jobs[idx], ...body };
                return MOCK_DB.jobs[idx];
            }
            throw new Error("Job not found");
        }

        // --- GENERIC POST ---
        const collection = endpoint.replace('/', '');
        if (['clients', 'inventory', 'vendors', 'templates', 'showcase', 'offers', 'requests'].includes(collection) && method === 'POST') {
            const newItem = { ...body, id: `${collection[0].toUpperCase()}-${Date.now()}` };
            if (collection === 'clients') newItem.history = [];
            if (collection === 'inventory') newItem.usage = 0;
            if (collection === 'showcase' && !newItem.images) newItem.images = [];

            if(!MOCK_DB[collection]) MOCK_DB[collection] = [];
            MOCK_DB[collection].push(newItem);
            return newItem;
        }

         // --- GENERIC PUT ---
         // e.g. /inventory/I-1
         const parts = endpoint.split('/');
         if (parts.length === 3 && method === 'PUT') {
             const coll = parts[1];
             const id = parts[2];
             if(MOCK_DB[coll]) {
                 const idx = MOCK_DB[coll].findIndex(i => i.id === id);
                 if (idx > -1) {
                     MOCK_DB[coll][idx] = { ...MOCK_DB[coll][idx], ...body };
                     return MOCK_DB[coll][idx];
                 }
             }
         }

         if (endpoint === '/exec' && method === 'POST') {
             // Mock GAS exec
             if (body.action === 'upload_image') {
                 return { status: "success", url: "https://placehold.co/600x400/green/white?text=Uploaded+Image" };
             }
         }

        return { success: true };
    }
};

const api = {
    async get(endpoint) {
        if (import.meta.env.VITE_USE_REAL_BACKEND === 'true') {
            // Real fetch implementation placeholder
            const res = await fetch(`/api${endpoint}`);
            return res.json();
        }
        return MockBackend.request('GET', endpoint);
    },
    async post(endpoint, body) {
        if (import.meta.env.VITE_USE_REAL_BACKEND === 'true') {
             const res = await fetch(`/api${endpoint}`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(body)
             });
             return res.json();
        }
        return MockBackend.request('POST', endpoint, body);
    },
    async put(endpoint, body) {
        if (import.meta.env.VITE_USE_REAL_BACKEND === 'true') {
            const res = await fetch(`/api${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            return res.json();
        }
        return MockBackend.request('PUT', endpoint, body);
    },
    async delete(endpoint) {
        if (import.meta.env.VITE_USE_REAL_BACKEND === 'true') {
            const res = await fetch(`/api${endpoint}`, { method: 'DELETE' });
            return res.json();
        }
        return MockBackend.request('DELETE', endpoint);
    },

    // Helper for uploading
    upload: (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1024;
                const scaleSize = MAX_WIDTH / img.width;

                if (img.width > MAX_WIDTH) {
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;
                } else {
                    canvas.width = img.width;
                    canvas.height = img.height;
                }

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                resolve(compressedBase64);
            };
            img.onerror = (e) => reject(new Error("Image Load Failed"));
        };
        reader.onerror = (error) => reject(error);
    })
};

export default api;
