import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import JobCard from './JobCard';
import clsx from 'clsx';

const KanbanColumn = ({ id, title, jobs }) => {
    return (
        <div className="min-w-[280px] w-[85vw] sm:w-80 flex flex-col h-full bg-black/20 rounded-xl border border-metal/10 snap-center">
            <div className="p-3 border-b border-metal/20 flex justify-between items-center sticky top-0 bg-oil/95 backdrop-blur z-10 rounded-t-xl">
                <h3 className="font-stencil text-lg text-rust tracking-wide">{title}</h3>
                <span className="bg-surface text-xs font-bold px-2 py-1 rounded-full text-metal">{jobs.length}</span>
            </div>

            <Droppable droppableId={id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={clsx(
                            "flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors",
                            snapshot.isDraggingOver ? "bg-rust/5" : ""
                        )}
                    >
                        {jobs.map((job, index) => (
                            <JobCard key={job.id} job={job} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default KanbanColumn;
