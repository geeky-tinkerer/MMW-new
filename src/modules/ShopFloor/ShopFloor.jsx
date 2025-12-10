import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import useStore from '../../store/useStore';
import KanbanColumn from './KanbanColumn';
import { Plus, Camera, Hammer, AlertTriangle } from 'lucide-react';

const COLUMNS = ['PENDING', 'CUTTING', 'WELDING', 'FINISHING', 'DONE'];

const ShopFloor = () => {
    const jobs = useStore(state => state.jobs);
    const updateJobStatus = useStore(state => state.updateJobStatus);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'error') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        const newStatus = destination.droppableId;
        const job = jobs.find(j => j.id === draggableId);

        // Safety Guard: Final QC Check
        if (newStatus === 'DONE') {
            const qcItem = job.checklist?.find(i => i.label === 'Final QC');
            if (qcItem && !qcItem.checked) {
                showToast("⚠️ Cannot complete job. Final QC is pending.");
                return;
            }
        }

        updateJobStatus(draggableId, newStatus);
    };

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="font-stencil text-2xl text-rust">SHOP FLOOR</h2>
                <div className="flex gap-2">
                    <button className="bg-surface p-2 rounded-full border border-metal hover:border-rust text-metal hover:text-rust transition-colors">
                        <Camera size={20} />
                    </button>
                    <button className="bg-rust text-black p-2 rounded-full font-bold shadow-lg shadow-rust/20">
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* Board */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex-1 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-1 no-scrollbar">
                    {COLUMNS.map(col => (
                        <KanbanColumn
                            key={col}
                            id={col}
                            title={col}
                            jobs={jobs.filter(j => j.status === col)}
                        />
                    ))}
                </div>
            </DragDropContext>

            {/* Toast Overlay */}
            {toast && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] animate-fade-in w-max max-w-[90%]">
                    <div className={`px-4 py-3 rounded-lg font-bold shadow-2xl flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                        <AlertTriangle size={18} />
                        <span className="text-sm">{toast.msg}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopFloor;
