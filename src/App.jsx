import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import { Loader2, LayoutDashboard, Settings, Users, FileText, Menu, X, PenTool, Calculator, Camera, Wifi, WifiOff, Smartphone } from 'lucide-react';
import ShopFloor from './modules/ShopFloor/ShopFloor';
import CadDesigner from './modules/CAD/CadDesigner';
import Calculators from './modules/Fabricator/Calculators';
import FabricatorHUD from './modules/Fabricator/FabricatorHUD';
import { useState } from 'react';

// Admin Sidebar/Nav Layout
const AdminLayout = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);
    const isOnline = useStore(state => state.isOnline);

    return (
        <div className="min-h-screen flex flex-col bg-oil text-white font-mono">
            {/* Mobile Header */}
            <header className="h-16 flex items-center justify-between px-4 border-b border-surface bg-oil sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-rust">
                        {menuOpen ? <X /> : <Menu />}
                    </button>
                    <span className="font-stencil text-xl tracking-wider">MMW <span className="text-rust">OPS</span></span>
                </div>
                <div className="flex items-center gap-2">
                    {isOnline ? <Wifi size={16} className="text-green-500"/> : <WifiOff size={16} className="text-red-500 animate-pulse"/>}
                    <div className="w-8 h-8 rounded-full bg-surface border border-rust flex items-center justify-center font-bold text-xs">
                        {user?.name?.[0] || 'A'}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                 {/* Sidebar */}
                 <aside className={`fixed inset-y-0 left-0 w-64 bg-surface border-r border-metal/20 transform transition-transform duration-200 z-30 lg:relative lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-4 pt-20 lg:pt-4 space-y-2">
                        {/* Status Indicator (Desktop) */}
                        <div className="hidden lg:flex items-center gap-2 mb-6 px-4 py-2 bg-black/20 rounded">
                            {isOnline ? <Wifi size={16} className="text-green-500"/> : <WifiOff size={16} className="text-red-500"/>}
                            <span className="text-xs text-metal">{isOnline ? 'ONLINE' : 'OFFLINE MODE'}</span>
                        </div>

                        <NavButton to="/admin" icon={<LayoutDashboard size={20}/>} label="Shop Floor" onClick={() => setMenuOpen(false)} />
                        <NavButton to="/admin/cad" icon={<PenTool size={20}/>} label="CAD Designer" onClick={() => setMenuOpen(false)} />
                        <NavButton to="/admin/calc" icon={<Calculator size={20}/>} label="Calculators" onClick={() => setMenuOpen(false)} />
                        <NavButton to="/admin/hud" icon={<Camera size={20}/>} label="AR HUD" onClick={() => setMenuOpen(false)} />
                        <div className="h-px bg-metal/20 my-2"></div>
                        <NavButton to="/admin/clients" icon={<Users size={20}/>} label="Clients" onClick={() => setMenuOpen(false)} />
                        <NavButton to="/admin/ledger" icon={<FileText size={20}/>} label="Ledger" onClick={() => setMenuOpen(false)} />
                        <NavButton to="/admin/settings" icon={<Settings size={20}/>} label="Settings" onClick={() => setMenuOpen(false)} />

                        <div className="pt-8 border-t border-metal/20 mt-8">
                             <button onClick={() => setUser(null)} className="w-full text-left px-4 py-3 text-red-500 hover:bg-black/20 rounded flex items-center gap-3 font-bold text-sm">
                                Logout
                             </button>
                        </div>
                    </div>
                 </aside>

                 {/* Main Content */}
                 <main className="flex-1 overflow-auto p-4 relative">
                     {menuOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setMenuOpen(false)}></div>}
                     {children}
                 </main>
            </div>
        </div>
    );
};

const NavButton = ({ to, icon, label, onClick }) => (
    <a href={to} onClick={(e) => { e.preventDefault(); onClick(); window.history.pushState({}, '', to); window.dispatchEvent(new PopStateEvent('popstate')); }} className="flex items-center gap-3 px-4 py-3 text-metal hover:text-rust hover:bg-black/20 rounded transition-colors group">
        <span className="group-hover:scale-110 transition-transform">{icon}</span>
        <span className="font-bold text-sm">{label}</span>
    </a>
);


// Placeholders for Routes
const VisitorHome = () => {
    const deferredPrompt = useStore(state => state.deferredPrompt);
    const setDeferredPrompt = useStore(state => state.setDeferredPrompt);

    const handleInstall = () => {
        if(deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(choice => {
                if(choice.outcome === 'accepted') setDeferredPrompt(null);
            });
        }
    };

    return (
        <div className="text-center mt-20 p-4">
            <h1 className="font-stencil text-4xl mb-4 text-white">MANKU METAL <span className="text-rust">WORKS</span></h1>
            <p className="text-metal mb-8">Premium Fabrication Services | Pune</p>

            <div className="grid gap-4 max-w-sm mx-auto">
                <a href="/login" onClick={(e)=>{e.preventDefault(); window.history.pushState({},'','/login'); window.dispatchEvent(new PopStateEvent('popstate'));}} className="bg-rust text-black font-bold py-3 rounded hover:bg-white transition-colors">
                    EMPLOYEE LOGIN
                </a>
                <a href="/client" onClick={(e)=>{e.preventDefault(); window.history.pushState({},'','/client'); window.dispatchEvent(new PopStateEvent('popstate'));}} className="border border-metal text-metal hover:text-white hover:border-white py-3 rounded transition-colors">
                    CLIENT PORTAL
                </a>
            </div>

            {deferredPrompt && (
                <button onClick={handleInstall} className="mt-8 bg-surface text-green-500 border border-green-500/50 px-6 py-2 rounded-full font-bold flex items-center gap-2 mx-auto hover:bg-green-500 hover:text-black transition-colors animate-pulse">
                    <Smartphone size={20} /> INSTALL APP
                </button>
            )}
        </div>
    );
};

const ClientHome = () => <div className="text-center mt-20"><h1 className="font-stencil text-2xl text-white">CLIENT PORTAL</h1><p className="text-metal">My Orders & Requests</p></div>;

const Login = () => {
    const setUser = useStore(state => state.setUser);
    const [err, setErr] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const d = new FormData(e.target);
        const user = d.get('user');
        const pass = d.get('pass');

        // Mock Auth
        if(user === 'admin' && pass === 'admin') {
            setUser({ role: 'ADMIN', name: 'Admin', id: 'ADMIN' });
        } else {
            setErr("Invalid Credentials (Try: admin / admin)");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-surface border border-rust w-full max-w-sm p-8 rounded-lg shadow-2xl">
                <h2 className="font-stencil text-2xl text-rust mb-6 text-center">SECURE OPS ACCESS</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input name="user" placeholder="ID" className="w-full bg-black border border-metal p-3 text-white rounded focus:border-rust outline-none" />
                    <input name="pass" type="password" placeholder="PASSWORD" className="w-full bg-black border border-metal p-3 text-white rounded focus:border-rust outline-none" />
                    {err && <div className="text-red-500 text-xs font-bold text-center">{err}</div>}
                    <button className="w-full bg-rust text-black font-bold py-3 rounded hover:bg-white transition-colors">AUTHENTICATE</button>
                </form>
            </div>
        </div>
    );
};

const App = () => {
  const user = useStore(state => state.user);
  const isLoading = useStore(state => state.isLoading);

  if (isLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-oil text-rust">
              <Loader2 className="animate-spin" size={48} />
          </div>
      );
  }

  return (
    <Router>
        <Routes>
            <Route path="/" element={
                !user ? <VisitorHome /> :
                user.role === 'ADMIN' ? <Navigate to="/admin" /> :
                <Navigate to="/client" />
            } />

            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

            {/* Protected Admin Routes */}
            <Route path="/admin/*" element={
                user?.role === 'ADMIN' ? (
                    <AdminLayout>
                        <Routes>
                            <Route path="/" element={<ShopFloor />} />
                            <Route path="cad" element={<CadDesigner onClose={()=>window.history.back()} />} />
                            <Route path="calc" element={<Calculators />} />
                            <Route path="hud" element={<FabricatorHUD onClose={()=>window.history.back()} />} />
                            <Route path="clients" element={<div>Clients Module</div>} />
                            <Route path="ledger" element={<div>Ledger Module</div>} />
                            <Route path="settings" element={<div>Settings Module</div>} />
                        </Routes>
                    </AdminLayout>
                ) : <Navigate to="/" />
            } />

            {/* Protected Client Routes */}
            <Route path="/client" element={user?.role === 'CLIENT' ? <ClientHome /> : <Navigate to="/" />} />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </Router>
  );
};

export default App;
