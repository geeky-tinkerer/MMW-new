import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text, Transformer } from 'react-konva';
import Toolbar from './Toolbar';
import { snapToGrid, generateId, getDistance, getMidpoint } from './utils';
import jsPDF from 'jspdf';
import useStore from '../../store/useStore';

const GRID_SIZE = 20;

const CadDesigner = ({ job, onClose }) => {
    const updateJobStatus = useStore(state => state.updateJobStatus); // Reuse this or add specific updateDesign action
    // We'll assume a direct API/DB call for saving design for now or update job object

    const [shapes, setShapes] = useState(job?.design || []);
    const [selectedId, setSelectedId] = useState(null);
    const [tool, setTool] = useState('SELECT');

    // Drawing State
    const isDrawing = useRef(false);
    const currentShapeId = useRef(null);

    const stageRef = useRef(null);
    const trRef = useRef(null);

    useEffect(() => {
        if (selectedId && trRef.current && stageRef.current) {
            const node = stageRef.current.findOne('#' + selectedId);
            if (node) {
                trRef.current.nodes([node]);
                trRef.current.getLayer().batchDraw();
            }
        }
    }, [selectedId]);

    const handleStageMouseDown = (e) => {
        // If clicking on empty stage, deselect
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) setSelectedId(null);

        // Tool Logic
        if (tool === 'SELECT') return;

        const pos = e.target.getStage().getPointerPosition();
        const x = snapToGrid(pos.x, GRID_SIZE);
        const y = snapToGrid(pos.y, GRID_SIZE);

        isDrawing.current = true;
        const id = generateId();
        currentShapeId.current = id;

        let newShape;
        if (tool === 'RECT') newShape = { id, type: 'RECT', x, y, width: 0, height: 0, stroke: 'white' };
        if (tool === 'CIRCLE') newShape = { id, type: 'CIRCLE', x, y, radius: 0, stroke: 'white' };
        if (tool === 'LINE') newShape = { id, type: 'LINE', points: [x, y, x, y], stroke: 'white' };
        if (tool === 'TEXT') {
            newShape = { id, type: 'TEXT', x, y, text: 'DOUBLE TAP TO EDIT', fontSize: 16, fill: 'white' };
            isDrawing.current = false; // Text is instant placement
            setTool('SELECT');
        }

        if (newShape) setShapes([...shapes, newShape]);
    };

    const handleStageMouseMove = (e) => {
        if (!isDrawing.current || tool === 'SELECT' || tool === 'TEXT') return;

        const pos = e.target.getStage().getPointerPosition();
        const x = snapToGrid(pos.x, GRID_SIZE);
        const y = snapToGrid(pos.y, GRID_SIZE);

        setShapes(shapes.map(s => {
            if (s.id === currentShapeId.current) {
                if (tool === 'RECT') {
                    return { ...s, width: x - s.x, height: y - s.y };
                }
                if (tool === 'CIRCLE') {
                    const r = Math.sqrt(Math.pow(x - s.x, 2) + Math.pow(y - s.y, 2));
                    return { ...s, radius: r };
                }
                if (tool === 'LINE') {
                    return { ...s, points: [s.points[0], s.points[1], x, y] };
                }
            }
            return s;
        }));
    };

    const handleStageMouseUp = () => {
        isDrawing.current = false;
        if (tool !== 'SELECT') setTool('SELECT');
    };

    const handleSave = async () => {
        // Mock Save Logic - In real app, call updateJob
        console.log("Saving Design:", shapes);
        alert("Design Saved! (Console Logged)");
    };

    const handleExport = () => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(20, 20, 20);
        doc.rect(0, 0, 210, 297, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont("courier", "bold");
        doc.text("MANKU METAL WORKS - DESIGN", 10, 20);

        shapes.forEach(s => {
            doc.setDrawColor(255, 255, 255);
            const scale = 0.2; // Scale down for A4
            const offset = 50;

            if (s.type === 'RECT') {
                doc.rect(s.x * scale, s.y * scale + offset, s.width * scale, s.height * scale);
            }
            if (s.type === 'CIRCLE') {
                doc.circle(s.x * scale, s.y * scale + offset, s.radius * scale);
            }
            if (s.type === 'LINE') {
                doc.line(
                    s.points[0] * scale, s.points[1] * scale + offset,
                    s.points[2] * scale, s.points[3] * scale + offset
                );
            }
            if (s.type === 'TEXT') {
                 doc.text(s.text, s.x * scale, s.y * scale + offset);
            }
        });

        doc.save(`design_${job?.id || 'concept'}.pdf`);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#1a1a1a]">
            <Toolbar
                activeTool={tool}
                setTool={setTool}
                onSave={handleSave}
                onExport={handleExport}
                onClose={onClose}
            />

            {/* Canvas */}
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                ref={stageRef}
                onMouseDown={handleStageMouseDown}
                onMouseMove={handleStageMouseMove}
                onMouseUp={handleStageMouseUp}
                onTouchStart={handleStageMouseDown}
                onTouchMove={handleStageMouseMove}
                onTouchEnd={handleStageMouseUp}
                className="cursor-crosshair bg-[#1c1917]"
            >
                <Layer>
                    {/* Grid Background (Static Visual) */}
                    <Rect width={window.innerWidth} height={window.innerHeight} fill="#1c1917" />
                    {/* Render Shapes */}
                    {shapes.map((s, i) => {
                        const isSelected = s.id === selectedId;
                        const commonProps = {
                            key: s.id,
                            id: s.id,
                            draggable: tool === 'SELECT',
                            onClick: () => tool === 'SELECT' && setSelectedId(s.id),
                            onTap: () => tool === 'SELECT' && setSelectedId(s.id),
                            onDragEnd: (e) => {
                                const node = e.target;
                                const x = snapToGrid(node.x(), GRID_SIZE);
                                const y = snapToGrid(node.y(), GRID_SIZE);
                                node.position({ x, y });

                                // Update State
                                const newShapes = shapes.slice();
                                newShapes[i] = { ...s, x, y };
                                setShapes(newShapes);
                            }
                        };

                        if (s.type === 'RECT') return <Rect {...commonProps} {...s} strokeWidth={2} />;
                        if (s.type === 'CIRCLE') return <Circle {...commonProps} {...s} strokeWidth={2} />;
                        if (s.type === 'LINE') return (
                            <React.Fragment key={s.id}>
                                <Line {...commonProps} {...s} strokeWidth={2} />
                                {/* Smart Dimension Label */}
                                <Text
                                    x={(s.points[0] + s.points[2]) / 2}
                                    y={(s.points[1] + s.points[3]) / 2 - 10}
                                    text={`${Math.round(getDistance(
                                        {x: s.points[0], y: s.points[1]},
                                        {x: s.points[2], y: s.points[3]}
                                    ))}mm`}
                                    fontSize={10}
                                    fill="#22c55e"
                                />
                            </React.Fragment>
                        );
                        if (s.type === 'TEXT') return <Text {...commonProps} {...s} onDblClick={()=>{
                            const val = prompt("Edit Text:", s.text);
                            if(val) setShapes(shapes.map(sh => sh.id === s.id ? {...sh, text: val} : sh));
                        }} />;
                        return null;
                    })}

                    {/* Transformer (Selection Box) */}
                    {selectedId && <Transformer ref={trRef} />}
                </Layer>
            </Stage>

            {/* Grid Overlay (CSS Pointer Events None) */}
            <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)`,
                    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
                }}
            ></div>
        </div>
    );
};

export default CadDesigner;
