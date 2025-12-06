(function() {
    const SEED = {
        jobs: [
            {id:"J-101", client:"Tata Motors", clientId:"C-1", project:"Chassis Bracket", status:"PENDING", cost:15000, date:"2023-10-01"},
            {id:"J-102", client:"Mahindra", clientId:"C-2", project:"Gearbox Mount", status:"ACTIVE", cost:8500, date:"2023-10-05"},
            {id:"J-103", client:"Tata Motors", clientId:"C-1", project:"Door Hinge Prototype", status:"DONE", cost:12000, date:"2023-09-20"},
            {id:"J-104", client:"Bajaj Auto", clientId:"C-3", project:"Kickstand Assembly", status:"DONE", cost:4500, date:"2023-09-15"},
            {id:"J-105", client:"Mahindra", clientId:"C-2", project:"Bumper Guard", status:"ACTIVE", cost:22000, date:"2023-10-10"}
        ],
        clients: [
            {id:"C-1", name:"Ramesh Engineer", company:"Tata Motors", phone:"919999999999", history:["J-101", "J-99", "J-103"]},
            {id:"C-2", name:"Suresh Patil", company:"Mahindra", phone:"918888888888", history:["J-102", "J-105"]},
            {id:"C-3", name:"Amit Singh", company:"Bajaj Auto", phone:"917777777777", history:["J-104"]}
        ],
        inventory: [
            {id:"I-1", item:"MS Sheet 2mm", stock:15, unit:"sheet", usage: 8},
            {id:"I-2", item:"SS Tube 1inch", stock:40, unit:"ft", usage: 25},
            {id:"I-3", item:"Angle Iron 2x2", stock:20, unit:"ft", usage: 12},
            {id:"I-4", item:"Welding Rods", stock:5, unit:"box", usage: 50}
        ],
        templates: [{id:"T-1", name:"Standard Gate", parts:[{id:"I-1", qty:2}]}]
    };

    window.mockFetch = async (url, opts) => {
        console.log("[MOCK]", opts?.method || "GET", url);
        await new Promise(r => setTimeout(r, 200));

        // Simple router
        if (url === '/api/init') return { json: async () => SEED };

        return { json: async () => SEED };
    };
})();