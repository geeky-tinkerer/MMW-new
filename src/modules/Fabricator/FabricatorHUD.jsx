import React, { useState, useRef, useEffect } from 'react';
import { Camera, Grid, X, Edit, Smartphone } from 'lucide-react';

const FabricatorHUD = ({ onClose }) => {
    const [mode, setMode] = useState('VIEW'); // VIEW, MARK
    const [snapshot, setSnapshot] = useState(null);
    const [tilt, setTilt] = useState(0);
    const [gridSize, setGridSize] = useState(50);
    const [permGranted, setPermGranted] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Camera Init
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        })
        .then(s => {
            streamRef.current = s;
            if(videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(e => console.log("Cam Error", e));

        return () => {
            if(streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Orientation Logic
    useEffect(() => {
        if (!permGranted) return;

        const handleOr = (e) => {
             // gamma is left/right tilt [-90,90]
             setTilt(e.gamma || 0);
        };
        window.addEventListener('deviceorientation', handleOr);
        return () => window.removeEventListener('deviceorientation', handleOr);
    }, [permGranted]);

    const requestAccess = () => {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') setPermGranted(true);
                    else alert("Permission Denied");
                })
                .catch(console.error);
        } else {
            // Android / Non-iOS
            setPermGranted(true);
        }
    };

    const takeSnapshot = () => {
        const video = videoRef.current;
        if (!video) return;

        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');

        // Draw Video
        const scale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
        const x = (canvas.width / 2) - (video.videoWidth / 2) * scale;
        const y = (canvas.height / 2) - (video.videoHeight / 2) * scale;
        ctx.drawImage(video, x, y, video.videoWidth * scale, video.videoHeight * scale);

        // Draw Horizon
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(tilt * Math.PI / 180);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(-canvas.width, 0, canvas.width*2, 2);
        ctx.restore();

        // Draw Marks
        if (canvasRef.current) ctx.drawImage(canvasRef.current, 0, 0);

        setSnapshot(canvas.toDataURL('image/jpeg'));
    };

    // Drawing Logic
    const startDraw = (e) => {
        if (mode !== 'MARK') return;
        setIsDrawing(true);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        const { clientX, clientY } = e.touches ? e.touches[0] : e;
        ctx.moveTo(clientX, clientY);
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
    };

    const draw = (e) => {
        if (!isDrawing || mode !== 'MARK') return;
        const ctx = canvasRef.current.getContext('2d');
        const { clientX, clientY } = e.touches ? e.touches[0] : e;
        ctx.lineTo(clientX, clientY);
        ctx.stroke();
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black text-white">
            {snapshot ? (
                <div className="relative w-full h-full flex flex-col">
                    <img src={snapshot} className="flex-1 object-contain bg-black" />
                    <div className="flex justify-around p-6 bg-black/90">
                        <button onClick={()=>{setSnapshot(null)}} className="text-white font-bold">DISCARD</button>
                        <button onClick={()=>{
                            const a = document.createElement('a'); a.href = snapshot; a.download = 'ar_snap.jpg'; a.click();
                            onClose();
                        }} className="text-rust font-bold">SAVE & CLOSE</button>
                    </div>
                </div>
            ) : (
                <>
                    <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-70" />

                    {/* Grid Layer */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-50"
                         style={{
                             backgroundImage: `linear-gradient(to right, rgba(34, 197, 94, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 197, 94, 0.5) 1px, transparent 1px)`,
                             backgroundSize: `${gridSize}px ${gridSize}px`
                         }}>
                    </div>

                    <canvas ref={canvasRef}
                        width={window.innerWidth} height={window.innerHeight}
                        className={`absolute inset-0 z-10 ${mode==='MARK'?'pointer-events-auto':'pointer-events-none'}`}
                        onMouseDown={startDraw} onMouseMove={draw} onMouseUp={()=>setIsDrawing(false)}
                        onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={()=>setIsDrawing(false)}
                    />

                    {/* Horizon */}
                    {permGranted && (
                        <div
                            className="absolute left-0 right-0 h-0.5 bg-green-500 shadow-[0_0_10px_#22c55e] transition-transform duration-100 z-0 top-1/2 pointer-events-none"
                            style={{transform: `rotate(${tilt}deg)`}}
                        ></div>
                    )}

                    {!permGranted && (
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                             <button onClick={requestAccess} className="bg-rust text-black px-4 py-2 rounded font-bold flex gap-2 items-center">
                                 <Smartphone size={20} /> Enable Horizon
                             </button>
                         </div>
                    )}

                    {/* Toolbar */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent z-20 flex flex-col gap-6">
                        {/* Grid Control */}
                        <div className="flex items-center gap-2 px-4">
                            <Grid size={16} className="text-green-500" />
                            <input type="range" min="20" max="200" value={gridSize} onChange={e=>setGridSize(e.target.value)} className="w-full accent-green-500 h-1" />
                        </div>

                        <div className="flex justify-between items-end">
                            <button onClick={onClose} className="bg-black/50 text-white p-3 rounded-full hover:bg-red-600 transition-colors"><X size={24}/></button>

                            <div className="flex gap-4">
                                <button onClick={()=>setMode(mode==='VIEW'?'MARK':'VIEW')} className={`p-4 rounded-full transition-all ${mode==='MARK'?'bg-rust text-black scale-110 shadow-lg shadow-rust/50':'bg-black/50 text-white border border-white/30'}`}>
                                    <Edit size={24} />
                                </button>

                                <button onClick={takeSnapshot} className="bg-white text-black p-4 rounded-full border-4 border-gray-300 shadow-xl active:scale-95 transition-transform">
                                    <Camera size={28} />
                                </button>
                            </div>

                            {/* Spacer */}
                            <div className="w-12"></div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FabricatorHUD;
