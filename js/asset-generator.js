// This file will generate simple placeholder assets for our game
// Create this file and run it once to generate the assets

const fs = require('fs');
const { createCanvas } = require('canvas');

// Make sure the assets directory exists
if (!fs.existsSync('./assets')) {
    fs.mkdirSync('./assets');
}

// Function to create a simple asset
function createAsset(filename, width, height, drawFunction) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Draw the asset
    drawFunction(ctx, width, height);
    
    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./assets/${filename}.png`, buffer);
    
    console.log(`Created ${filename}.png`);
}

// Player sprite
createAsset('player', 32, 32, (ctx, width, height) => {
    // Body
    ctx.fillStyle = '#3498db';
    ctx.fillRect(8, 8, 16, 20);
    
    // Head
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(16, 8, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(12, 6, 2, 2);
    ctx.fillRect(18, 6, 2, 2);
    
    // Mouth
    ctx.beginPath();
    ctx.moveTo(13, 11);
    ctx.lineTo(19, 11);
    ctx.stroke();
});

// Chair
createAsset('chair', 32, 32, (ctx, width, height) => {
    // Seat
    ctx.fillStyle = '#8e44ad';
    ctx.fillRect(6, 16, 20, 6);
    
    // Back
    ctx.fillRect(6, 4, 4, 12);
    ctx.fillRect(22, 4, 4, 12);
    ctx.fillRect(6, 4, 20, 4);
    
    // Legs
    ctx.fillStyle = '#34495e';
    ctx.fillRect(8, 22, 4, 8);
    ctx.fillRect(20, 22, 4, 8);
});

// Desk
createAsset('desk', 64, 32, (ctx, width, height) => {
    // Top
    ctx.fillStyle = '#d35400';
    ctx.fillRect(4, 8, 56, 8);
    
    // Legs
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(8, 16, 6, 14);
    ctx.fillRect(50, 16, 6, 14);
});

// Floor
createAsset('floor', 32, 32, (ctx, width, height) => {
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(0, 0, width, height);
    
    // Tile pattern
    ctx.strokeStyle = '#bdc3c7';
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.lineTo(32, 16);
    ctx.moveTo(16, 0);
    ctx.lineTo(16, 32);
    ctx.stroke();
});

// Wall
createAsset('wall', 32, 32, (ctx, width, height) => {
    ctx.fillStyle = '#95a5a6';
    ctx.fillRect(0, 0, width, height);
    
    // Brick pattern
    ctx.strokeStyle = '#7f8c8d';
    ctx.beginPath();
    
    // Horizontal lines
    for (let y = 8; y < height; y += 8) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }
    
    // Vertical lines - staggered for brick effect
    for (let x = 0; x < width; x += 16) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        
        ctx.moveTo(x + 8, 8);
        ctx.lineTo(x + 8, height);
    }
    
    ctx.stroke();
});

// Door (closed)
createAsset('door_closed', 32, 32, (ctx, width, height) => {
    // Door frame
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(0, 0, width, height);
    
    // Door
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(2, 2, 28, 28);
    
    // Handle
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(24, 16, 3, 0, Math.PI * 2);
    ctx.fill();
});

// Door (open)
createAsset('door_open', 32, 32, (ctx, width, height) => {
    // Door frame
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(0, 0, width, height);
    
    // Open space (showing floor)
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(2, 2, 28, 28);
    
    // Door (open to the side)
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(2, 2, 8, 28);
    
    // Handle
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(8, 16, 2, 0, Math.PI * 2);
    ctx.fill();
});

// Plant
createAsset('plant', 32, 32, (ctx, width, height) => {
    // Pot
    ctx.fillStyle = '#e67e22';
    ctx.fillRect(10, 22, 12, 10);
    
    // Plant
    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.arc(16, 18, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(12, 14, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(20, 14, 6, 0, Math.PI * 2);
    ctx.fill();
});

// Office tileset (combined)
createAsset('office_tileset', 128, 128, (ctx, width, height) => {
    // This is just a reference image with all assets
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    
    // Draw labels
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    
    // Create a temporary canvas for each asset
    const assets = [
        { name: 'Player', file: 'player', x: 0, y: 0 },
        { name: 'Chair', file: 'chair', x: 32, y: 0 },
        { name: 'Desk', file: 'desk', x: 64, y: 0 },
        { name: 'Floor', file: 'floor', x: 0, y: 32 },
        { name: 'Wall', file: 'wall', x: 32, y: 32 },
        { name: 'Door (C)', file: 'door_closed', x: 64, y: 32 },
        { name: 'Door (O)', file: 'door_open', x: 96, y: 32 },
        { name: 'Plant', file: 'plant', x: 0, y: 64 }
    ];
    
    // We'll need to load the images we just created
    // For simplicity, we'll just draw colored rectangles as placeholders
    assets.forEach(asset => {
        if (asset.file === 'desk') {
            ctx.fillStyle = '#d35400';
            ctx.fillRect(asset.x, asset.y, 64, 32);
        } else {
            ctx.fillStyle = '#3498db';
            ctx.fillRect(asset.x, asset.y, 32, 32);
        }
        
        ctx.fillStyle = '#000';
        ctx.fillText(asset.name, asset.x + 2, asset.y + 20);
    });
});

console.log('All assets created successfully!'); 