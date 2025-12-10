import React from 'react';
import { MousePointer2, Square, Circle, Minus, Type, Download, Save, X } from 'lucide-react';
import clsx from 'clsx';

const Tools = [
    { id: 'SELECT', icon: <MousePointer2 size={20} /> },
    { id: 'RECT', icon: <Square size={20} /> },
    { id: 'CIRCLE', icon: <Circle size={20} /> },
    { id: 'LINE', icon: <Minus size={20} /> },
    { id: 'TEXT', icon: <Type size={20} /> },
];

const Toolbar = ({ activeTool, setTool, onSave, onExport, onClose }) => {
    return (
        <div className="absolute top-4 left-4 right-4 bg-surface/90 backdrop-blur border border-rust/50 rounded-lg p-2 flex justify-between items-center shadow-xl z-50">
            <div className="flex gap-1">
                <button onClick={onClose} className="p-3 hover:bg-white/10 rounded text-metal hover:text-white">
                    <X size={20} />
                </button>
                <div className="w-px bg-metal/30 mx-1"></div>
                {Tools.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTool(t.id)}
                        className={clsx(
                            "p-3 rounded transition-colors",
                            activeTool === t.id ? "bg-rust text-black font-bold shadow-lg shadow-rust/20" : "text-metal hover:bg-white/10 hover:text-white"
                        )}
                    >
                        {t.icon}
                    </button>
                ))}
            </div>

            <div className="flex gap-2">
                <button onClick={onExport} className="p-3 bg-black/50 text-white rounded hover:bg-rust hover:text-black transition-colors">
                    <Download size={20} />
                </button>
                <button onClick={onSave} className="p-3 bg-rust text-black font-bold rounded shadow-lg shadow-rust/20 flex items-center gap-2">
                    <Save size={20} />
                    <span className="hidden sm:inline">SAVE</span>
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
