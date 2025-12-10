import React, { useState } from 'react';

const Calculators = () => {
  const [activeTab, setActiveTab] = useState('pie'); // 'pie', 'triangle', 'weight', 'converter'

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-900 text-gray-100 min-h-screen">
      {/* Navigation Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-700 pb-2 overflow-x-auto no-scrollbar">
        {['pie', 'triangle', 'weight', 'converter'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 capitalize whitespace-nowrap transition-colors ${
              activeTab === tab
              ? 'text-blue-400 font-bold border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab === 'converter' ? 'Units' : tab}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
        {activeTab === 'pie' && <PieCutCalc />}
        {activeTab === 'triangle' && <TriangleCalc />}
        {activeTab === 'weight' && <WeightCalc />}
        {activeTab === 'converter' && <UnitConverter />}
      </div>
    </div>
  );
};

// --- 1. Unit Converter Component ---

const UnitConverter = () => {
  const [val, setVal] = useState(1);
  const [mode, setMode] = useState('mm_inch');

  const conversions = {
    mm_inch: { label: 'Length', input: 'mm', output: 'inch', factor: 0.0393701 },
    inch_mm: { label: 'Length', input: 'inch', output: 'mm', factor: 25.4 },
    kg_lbs:  { label: 'Weight', input: 'kg', output: 'lbs', factor: 2.20462 },
    lbs_kg:  { label: 'Weight', input: 'lbs', output: 'kg', factor: 0.453592 },
  };

  const current = conversions[mode];
  const result = val * current.factor;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-purple-400 border-b border-gray-700 pb-2">Unit Converter</h3>

      {/* Mode Toggles */}
      <div className="grid grid-cols-2 gap-2">
        {Object.keys(conversions).map((k) => (
            <button
                key={k}
                onClick={() => setMode(k)}
                className={`px-2 py-2 rounded text-xs border transition-all ${
                    mode === k
                    ? 'bg-purple-600 border-purple-400 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
            >
                {conversions[k].input} → {conversions[k].output}
            </button>
        ))}
      </div>

      {/* Calculator Interface */}
      <div className="grid grid-cols-1 gap-4 bg-gray-900 p-4 rounded border border-gray-700 mt-4">
        <div>
          <label className="block text-xs text-gray-400 uppercase mb-1">{current.input}</label>
          <input
            type="number"
            value={val}
            onChange={e => setVal(Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-600 p-3 rounded text-xl font-mono text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="flex justify-center items-center -my-2 opacity-50">
            <span className="text-2xl">↓</span>
        </div>

        <div>
          <label className="block text-xs text-gray-400 uppercase mb-1">{current.output}</label>
          <div className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-xl font-mono text-green-400">
            {result.toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. Pie Cut Calculator (Enhanced Visuals) ---

const PieCutCalc = () => {
  const [bendAngle, setBendAngle] = useState(90);
  const [segments, setSegments] = useState(5);

  // Math
  // Cut Angle = The angle to set on the bandsaw/chop saw.
  const cutAngle = bendAngle / (segments * 2);

  // Segment Angle = The rotation contribution of each piece to the total bend.
  const segmentAngle = bendAngle / segments;

  // SVG Generation for Welded Assembly
  const generateBendPoints = () => {
    // Start drawing from bottom-left
    let points = "M 20 100 ";
    let currentX = 20;
    let currentY = 100;
    let currentAngle = 0; // 0 degrees = Horizontal Right
    const segLength = 20; // Visual scale length

    for (let i = 0; i <= segments; i++) {
        // Calculate new end point based on accumulated angle
        currentX += segLength * Math.cos(currentAngle * Math.PI / 180);
        currentY -= segLength * Math.sin(currentAngle * Math.PI / 180); // Y is flipped in SVG
        points += `L ${currentX} ${currentY} `;

        // Increment angle for next segment
        if (i < segments) currentAngle += segmentAngle;
    }
    return points;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-orange-400 border-b border-gray-700 pb-2">Pie Cut Calculator</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Total Bend Angle (°)</label>
          <input type="number" value={bendAngle} onChange={e => setBendAngle(Number(e.target.value))} className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Number of Segments</label>
          <input type="number" value={segments} onChange={e => setSegments(Number(e.target.value))} className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-orange-500" />
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded text-center border border-orange-500/30 shadow-inner">
        <p className="text-gray-400 text-sm uppercase tracking-wider">Saw Cut Angle</p>
        <p className="text-4xl font-mono text-orange-400 font-bold">{cutAngle.toFixed(2)}°</p>
        <p className="text-[10px] text-gray-500 mt-1">Set saw vise to this angle</p>
      </div>

      {/* Visualizers */}
      <div className="grid grid-cols-2 gap-3 mt-2">

        {/* Visual 1: The Cut */}
        <div className="bg-gray-900/50 p-3 rounded border border-gray-700 flex flex-col items-center justify-center">
            <span className="text-[10px] text-gray-400 mb-2 uppercase">1. Cut Profile</span>
            <svg width="80" height="60" viewBox="0 0 100 80">
                {/* Tube */}
                <rect x="20" y="20" width="60" height="40" fill="#374151" stroke="#4B5563" strokeWidth="1"/>
                {/* Cut Line */}
                <line x1="50" y1="20" x2="50" y2="60" stroke="white" strokeDasharray="3" opacity="0.3"/>
                {/* The Wedge Removed */}
                <path d="M 50 20 L 65 20 L 50 60 L 35 60 Z" fill="rgba(249, 115, 22, 0.4)" stroke="orange" strokeWidth="1" />
                <text x="50" y="75" textAnchor="middle" fill="orange" fontSize="10">{cutAngle.toFixed(1)}°</text>
            </svg>
        </div>

        {/* Visual 2: The Weld */}
        <div className="bg-gray-900/50 p-3 rounded border border-gray-700 flex flex-col items-center justify-center">
            <span className="text-[10px] text-gray-400 mb-2 uppercase">2. Welded Assembly</span>
            <svg width="100" height="100" viewBox="0 0 140 140">
                {/* The Path */}
                <path
                    d={generateBendPoints()}
                    stroke="#F97316"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Reference Horizon */}
                <line x1="20" y1="100" x2="60" y2="100" stroke="gray" strokeWidth="1" strokeDasharray="2"/>
                <text x="20" y="120" fill="gray" fontSize="9">Start</text>
                {/* Total Angle Label */}
                <text x="100" y="20" fill="white" fontSize="9" textAnchor="end">{bendAngle}° Total</text>
            </svg>
        </div>
      </div>
    </div>
  );
};

// --- 3. Triangle Calculator ---

const TriangleCalc = () => {
  const [sideA, setSideA] = useState(300);
  const [sideB, setSideB] = useState(400);
  const hypotenuse = Math.sqrt((sideA ** 2) + (sideB ** 2));

  // Calculate angle A (in degrees)
  const angleA = (Math.atan(sideA / sideB) * 180) / Math.PI;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-blue-400 border-b border-gray-700 pb-2">Right Triangle</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Height (A)</label>
          <input type="number" value={sideA} onChange={e => setSideA(Number(e.target.value))} className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Base (B)</label>
          <input type="number" value={sideB} onChange={e => setSideB(Number(e.target.value))} className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded text-center border border-blue-500/30">
        <p className="text-gray-400 text-sm uppercase">Hypotenuse (C)</p>
        <p className="text-3xl font-mono text-blue-400 font-bold">{hypotenuse.toFixed(1)} <span className="text-sm font-normal">mm</span></p>
        <p className="text-xs text-gray-500 mt-2">Corner Angle: {angleA.toFixed(1)}°</p>
      </div>

      {/* Triangle Visual */}
      <div className="flex justify-center mt-4 border border-gray-700 p-4 bg-gray-900/50 rounded">
        <svg width="150" height="100" viewBox="0 0 200 150">
          <polygon points="20,130 20,20 180,130" fill="none" stroke="#60A5FA" strokeWidth="2" />
          {/* Labels */}
          <text x="10" y="80" fill="white" fontSize="12" fontWeight="bold">A</text>
          <text x="100" y="145" fill="white" fontSize="12" fontWeight="bold">B</text>
          <text x="110" y="70" fill="white" fontSize="12" fontWeight="bold">C</text>
          {/* Right Angle marker */}
          <polyline points="20,110 40,110 40,130" fill="none" stroke="gray" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};

// --- 4. Weight Calculator (Updated) ---

const WeightCalc = () => {
  const [shape, setShape] = useState('plate');
  const [l, setL] = useState(100);
  const [w, setW] = useState(100);
  const [t, setT] = useState(10);
  const [density] = useState(7.85); // Fixed to steel for simplicity in this version

  let volumeCm3 = 0;

  if (shape === 'plate') {
    // L * W * T
    volumeCm3 = (l/10 * w/10 * t/10);
  } else if (shape === 'round') {
    // Solid Bar: PI * r^2 * L
    // t used as Diameter
    const r = (t/10) / 2;
    volumeCm3 = Math.PI * (r ** 2) * (l/10);
  } else if (shape === 'tube_round') {
    // Hollow Tube: (Area Outer - Area Inner) * L
    // w = OD, t = Wall Thickness
    const r_outer = (w/10) / 2;
    const r_inner = r_outer - (t/10);
    // Prevent negative area
    const area = r_inner > 0 ? Math.PI * (r_outer**2 - r_inner**2) : 0;
    volumeCm3 = area * (l/10);
  }

  const weightKg = (volumeCm3 * density) / 1000;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-green-400 border-b border-gray-700 pb-2">Material Weight</h3>

      {/* Shape Selector */}
      <div className="flex flex-wrap gap-2 mb-2">
        {[
            {id: 'plate', label: 'Plate'},
            {id: 'round', label: 'Solid Bar'},
            {id: 'tube_round', label: 'Round Tube'}
        ].map(s => (
            <button
                key={s.id}
                onClick={() => setShape(s.id)}
                className={`px-3 py-1 text-xs rounded border transition-colors ${
                    shape === s.id
                    ? 'bg-green-600 border-green-400 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300'
                }`}
            >
                {s.label}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Length (mm)</label>
          <input type="number" value={l} onChange={e => setL(Number(e.target.value))} className="w-full bg-gray-700 text-white p-2 rounded" />
        </div>

        {/* Width / OD Input */}
        {(shape === 'plate' || shape === 'tube_round') && (
          <div>
            <label className="block text-xs text-gray-400 mb-1">
                {shape === 'plate' ? 'Width (mm)' : 'Outer Dia (mm)'}
            </label>
            <input type="number" value={w} onChange={e => setW(Number(e.target.value))} className="w-full bg-gray-700 text-white p-2 rounded" />
          </div>
        )}

        {/* Thickness / Dia / Wall Input */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">
             {shape === 'plate' ? 'Thickness' : shape === 'tube_round' ? 'Wall Thick' : 'Diameter'} (mm)
          </label>
          <input type="number" value={t} onChange={e => setT(Number(e.target.value))} className="w-full bg-gray-700 text-white p-2 rounded" />
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded text-center border border-green-500/30 mt-2">
        <p className="text-gray-400 text-sm uppercase">Estimated Weight</p>
        <p className="text-3xl font-mono text-green-400 font-bold">{weightKg.toFixed(2)} <span className="text-sm font-normal">kg</span></p>
        <p className="text-[10px] text-gray-500 mt-1">Based on Steel (7.85 g/cm³)</p>
      </div>
    </div>
  );
};

export default Calculators;
