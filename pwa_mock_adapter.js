(function() {
    const SEED = {
        jobs: [
            {id:"J-101", client:"Tata Motors", clientId:"C-1", project:"Chassis Bracket", status:"PENDING", cost:15000, date:"2023-10-01"},
            {id:"J-102", client:"Mahindra", clientId:"C-2", project:"Gearbox Mount", status:"ACTIVE", cost:8500, date:"2023-10-05"}
        ],
        clients: [
            {id:"C-1", name:"Ramesh Engineer", company:"Tata Motors", phone:"919999999999", history:["J-101", "J-99"]},
            {id:"C-2", name:"Suresh Patil", company:"Mahindra", phone:"918888888888", history:["J-102"]}
        ],
        inventory: [{id:"I-1", item:"MS Sheet 2mm", stock:15, unit:"sheet"}],
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