import React from 'react';
import { Calendar, CheckSquare, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { Draggable } from '@hello-pangea/dnd';

const JobCard = ({ job, index }) => {
    const isLate = job.deliveryDate && new Date(job.deliveryDate) < new Date();
    const isSoon = job.deliveryDate && new Date(job.deliveryDate) < new Date(Date.now() + 86400000 * 3); // 3 days

    const completedChecks = job.checklist ? job.checklist.filter(c => c.checked).length : 0;
    const totalChecks = job.checklist ? job.checklist.length : 0;

    return (
        <Draggable draggableId={job.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={clsx(
                        "bg-surface p-4 mb-3 rounded-lg border-l-4 shadow-sm transition-shadow",
                        snapshot.isDragging ? "shadow-xl ring-2 ring-rust z-50 opacity-90" : "",
                        isLate ? "border-red-600" : isSoon ? "border-yellow-500" : "border-rust"
                    )}
                    style={{ ...provided.draggableProps.style }}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg leading-tight">{job.project}</h3>
                        <span className="text-xs font-mono text-metal">#{job.id.slice(-4)}</span>
                    </div>

                    <p className="text-xs text-metal font-bold mb-3 truncate">{job.client}</p>

                    <div className="flex justify-between items-center text-xs">
                        <div className={clsx("flex items-center gap-1", isLate ? "text-red-500 font-bold" : "text-metal")}>
                            {isLate ? <AlertCircle size={14} /> : <Calendar size={14} />}
                            <span>{job.deliveryDate || 'No Date'}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded text-rust">
                            <CheckSquare size={14} />
                            <span>{completedChecks}/{totalChecks}</span>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default JobCard;
