// Snap to Grid (e.g. 20px)
export const snapToGrid = (val, gridSize = 20) => {
    return Math.round(val / gridSize) * gridSize;
};

// Distance between two points
export const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

// Midpoint
export const getMidpoint = (p1, p2) => {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
    };
};

// Generate ID
export const generateId = () => Math.random().toString(36).substr(2, 9);
