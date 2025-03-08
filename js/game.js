const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

// Game variables
let player;
let cursors;
let chairs = [];
let doors = [];
let isSitting = false;
let currentChair = null;
let spaceKey;
let helpText;
let playerDirection = 'down'; // Track player direction for animations

function preload() {
    // We'll create assets programmatically instead of loading images
    this.load.image('blank', generateBlankTexture(this));
}

function create() {
    // Create office floor
    createFloorTexture(this);
    for (let x = 0; x < config.width; x += 32) {
        for (let y = 0; y < config.height; y += 32) {
            this.add.image(x, y, 'floor').setOrigin(0);
        }
    }

    // Create walls
    createWallTexture(this);
    
    // Create player textures
    createPlayerTextures(this);
    
    // Create furniture textures
    createChairTexture(this);
    createDeskTexture(this);
    createPlantTexture(this);
    createDoorTextures(this);
    
    // Create player
    player = this.physics.add.sprite(400, 300, 'player-down');
    player.setCollideWorldBounds(true);
    player.setSize(24, 24);
    
    // Create player animations
    createPlayerAnimations(this);
    
    // Create walls
    createWalls(this);
    
    // Create meeting rooms
    createMeetingRooms(this);
    
    // Create office furniture
    createOfficeFurniture(this);
    
    // Set up input
    cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // Help text
    helpText = this.add.text(10, 10, 'Use arrow keys to move. Press SPACE to interact with doors and chairs.', {
        fontSize: '16px',
        fill: '#000'
    });
    helpText.setScrollFactor(0);
}

function update() {
    if (!isSitting) {
        // Player movement
        let moving = false;
        
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.setVelocityY(0);
            player.anims.play('walk-left', true);
            playerDirection = 'left';
            moving = true;
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.setVelocityY(0);
            player.anims.play('walk-right', true);
            playerDirection = 'right';
            moving = true;
        } else if (cursors.up.isDown) {
            player.setVelocityY(-160);
            player.setVelocityX(0);
            player.anims.play('walk-up', true);
            playerDirection = 'up';
            moving = true;
        } else if (cursors.down.isDown) {
            player.setVelocityY(160);
            player.setVelocityX(0);
            player.anims.play('walk-down', true);
            playerDirection = 'down';
            moving = true;
        } else {
            player.setVelocityX(0);
            player.setVelocityY(0);
            
            // Set idle animation based on last direction
            player.anims.stop();
            player.setTexture(`player-${playerDirection}`);
        }
    } else {
        // Player is sitting, no movement allowed
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.setTexture('player-sitting');
    }
    
    // Check for interactions with space key
    if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
        if (isSitting) {
            // Stand up from chair
            standUp();
        } else {
            // Check for nearby chairs to sit on
            let foundChair = false;
            chairs.forEach(chair => {
                if (Phaser.Math.Distance.Between(player.x, player.y, chair.x, chair.y) < 40) {
                    sitOnChair(chair);
                    foundChair = true;
                }
            });
            
            // If not near a chair, check for doors to interact with
            if (!foundChair) {
                doors.forEach(door => {
                    if (Phaser.Math.Distance.Between(player.x, player.y, door.x, door.y) < 40) {
                        toggleDoor(door);
                    }
                });
            }
        }
    }
}

// Generate a blank texture for creating other textures
function generateBlankTexture(scene) {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xFFFFFF);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('blank', 32, 32);
    return 'blank';
}

// Create floor texture
function createFloorTexture(scene) {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    
    // Background
    graphics.fillStyle(0xECF0F1);
    graphics.fillRect(0, 0, 32, 32);
    
    // Tile pattern
    graphics.lineStyle(1, 0xBDC3C7);
    graphics.moveTo(0, 16);
    graphics.lineTo(32, 16);
    graphics.moveTo(16, 0);
    graphics.lineTo(16, 32);
    
    graphics.generateTexture('floor', 32, 32);
}

// Create wall texture
function createWallTexture(scene) {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    
    // Background
    graphics.fillStyle(0x95A5A6);
    graphics.fillRect(0, 0, 32, 32);
    
    // Brick pattern
    graphics.lineStyle(1, 0x7F8C8D);
    
    // Horizontal lines
    for (let y = 8; y < 32; y += 8) {
        graphics.moveTo(0, y);
        graphics.lineTo(32, y);
    }
    
    // Vertical lines - staggered for brick effect
    for (let x = 0; x < 32; x += 16) {
        graphics.moveTo(x, 0);
        graphics.lineTo(x, 32);
        
        graphics.moveTo(x + 8, 8);
        graphics.lineTo(x + 8, 32);
    }
    
    graphics.generateTexture('wall', 32, 32);
}

// Create chair texture
function createChairTexture(scene) {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    
    // Seat
    graphics.fillStyle(0x8E44AD);
    graphics.fillRect(6, 16, 20, 6);
    
    // Back
    graphics.fillRect(6, 4, 4, 12);
    graphics.fillRect(22, 4, 4, 12);
    graphics.fillRect(6, 4, 20, 4);
    
    // Legs
    graphics.fillStyle(0x34495E);
    graphics.fillRect(8, 22, 4, 8);
    graphics.fillRect(20, 22, 4, 8);
    
    graphics.generateTexture('chair', 32, 32);
}

// Create desk texture
function createDeskTexture(scene) {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    
    // Top
    graphics.fillStyle(0xD35400);
    graphics.fillRect(4, 8, 56, 8);
    
    // Legs
    graphics.fillStyle(0x7F8C8D);
    graphics.fillRect(8, 16, 6, 14);
    graphics.fillRect(50, 16, 6, 14);
    
    graphics.generateTexture('desk', 64, 32);
}

// Create plant texture
function createPlantTexture(scene) {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    
    // Pot
    graphics.fillStyle(0xE67E22);
    graphics.fillRect(10, 22, 12, 10);
    
    // Plant
    graphics.fillStyle(0x2ECC71);
    graphics.beginPath();
    graphics.arc(16, 18, 8, 0, Math.PI * 2);
    graphics.closePath();
    graphics.fill();
    
    graphics.beginPath();
    graphics.arc(12, 14, 6, 0, Math.PI * 2);
    graphics.closePath();
    graphics.fill();
    
    graphics.beginPath();
    graphics.arc(20, 14, 6, 0, Math.PI * 2);
    graphics.closePath();
    graphics.fill();
    
    graphics.generateTexture('plant', 32, 32);
}

// Create door textures
function createDoorTextures(scene) {
    // Closed door
    const closedDoor = scene.make.graphics({ x: 0, y: 0, add: false });
    
    // Door frame
    closedDoor.fillStyle(0x7F8C8D);
    closedDoor.fillRect(0, 0, 32, 32);
    
    // Door
    closedDoor.fillStyle(0xE74C3C);
    closedDoor.fillRect(2, 2, 28, 28);
    
    // Handle
    closedDoor.fillStyle(0xF1C40F);
    closedDoor.beginPath();
    closedDoor.arc(24, 16, 3, 0, Math.PI * 2);
    closedDoor.closePath();
    closedDoor.fill();
    
    closedDoor.generateTexture('door_closed', 32, 32);
    
    // Open door
    const openDoor = scene.make.graphics({ x: 0, y: 0, add: false });
    
    // Door frame
    openDoor.fillStyle(0x7F8C8D);
    openDoor.fillRect(0, 0, 32, 32);
    
    // Open space (showing floor)
    openDoor.fillStyle(0xECF0F1);
    openDoor.fillRect(2, 2, 28, 28);
    
    // Door (open to the side)
    openDoor.fillStyle(0xE74C3C);
    openDoor.fillRect(2, 2, 8, 28);
    
    // Handle
    openDoor.fillStyle(0xF1C40F);
    openDoor.beginPath();
    openDoor.arc(8, 16, 2, 0, Math.PI * 2);
    openDoor.closePath();
    openDoor.fill();
    
    openDoor.generateTexture('door_open', 32, 32);
}

// Create player textures for different directions
function createPlayerTextures(scene) {
    // Base player shape
    function drawPlayerBase(graphics, bodyColor) {
        // Body
        graphics.fillStyle(bodyColor);
        graphics.fillRect(8, 8, 16, 20);
        
        // Head
        graphics.fillStyle(0xF1C40F);
        graphics.beginPath();
        graphics.arc(16, 8, 8, 0, Math.PI * 2);
        graphics.closePath();
        graphics.fill();
    }
    
    // Player facing down
    const playerDown = scene.make.graphics({ x: 0, y: 0, add: false });
    drawPlayerBase(playerDown, 0x3498DB);
    
    // Eyes
    playerDown.fillStyle(0x000000);
    playerDown.fillRect(12, 6, 2, 2);
    playerDown.fillRect(18, 6, 2, 2);
    
    // Mouth
    playerDown.beginPath();
    playerDown.moveTo(13, 11);
    playerDown.lineTo(19, 11);
    playerDown.stroke();
    
    playerDown.generateTexture('player-down', 32, 32);
    
    // Player facing up
    const playerUp = scene.make.graphics({ x: 0, y: 0, add: false });
    drawPlayerBase(playerUp, 0x3498DB);
    
    // Back of head (no face)
    playerUp.generateTexture('player-up', 32, 32);
    
    // Player facing left
    const playerLeft = scene.make.graphics({ x: 0, y: 0, add: false });
    drawPlayerBase(playerLeft, 0x3498DB);
    
    // Side face
    playerLeft.fillStyle(0x000000);
    playerLeft.fillRect(12, 6, 2, 2); // One eye
    
    playerLeft.generateTexture('player-left', 32, 32);
    
    // Player facing right
    const playerRight = scene.make.graphics({ x: 0, y: 0, add: false });
    drawPlayerBase(playerRight, 0x3498DB);
    
    // Side face
    playerRight.fillStyle(0x000000);
    playerRight.fillRect(18, 6, 2, 2); // One eye
    
    playerRight.generateTexture('player-right', 32, 32);
    
    // Player sitting
    const playerSitting = scene.make.graphics({ x: 0, y: 0, add: false });
    
    // Shorter body when sitting
    playerSitting.fillStyle(0x3498DB);
    playerSitting.fillRect(8, 8, 16, 14);
    
    // Head
    playerSitting.fillStyle(0xF1C40F);
    playerSitting.beginPath();
    playerSitting.arc(16, 8, 8, 0, Math.PI * 2);
    playerSitting.closePath();
    playerSitting.fill();
    
    // Face
    playerSitting.fillStyle(0x000000);
    playerSitting.fillRect(12, 6, 2, 2);
    playerSitting.fillRect(18, 6, 2, 2);
    
    playerSitting.beginPath();
    playerSitting.moveTo(13, 11);
    playerSitting.lineTo(19, 11);
    playerSitting.stroke();
    
    playerSitting.generateTexture('player-sitting', 32, 32);
}

// Create player animations
function createPlayerAnimations(scene) {
    // Walking animations
    scene.anims.create({
        key: 'walk-down',
        frames: [
            { key: 'player-down' },
            { key: 'player-down', transform: { y: 2 } },
            { key: 'player-down' },
            { key: 'player-down', transform: { y: -2 } }
        ],
        frameRate: 8,
        repeat: -1
    });
    
    scene.anims.create({
        key: 'walk-up',
        frames: [
            { key: 'player-up' },
            { key: 'player-up', transform: { y: 2 } },
            { key: 'player-up' },
            { key: 'player-up', transform: { y: -2 } }
        ],
        frameRate: 8,
        repeat: -1
    });
    
    scene.anims.create({
        key: 'walk-left',
        frames: [
            { key: 'player-left' },
            { key: 'player-left', transform: { x: 2 } },
            { key: 'player-left' },
            { key: 'player-left', transform: { x: -2 } }
        ],
        frameRate: 8,
        repeat: -1
    });
    
    scene.anims.create({
        key: 'walk-right',
        frames: [
            { key: 'player-right' },
            { key: 'player-right', transform: { x: 2 } },
            { key: 'player-right' },
            { key: 'player-right', transform: { x: -2 } }
        ],
        frameRate: 8,
        repeat: -1
    });
}

function createWalls(scene) {
    // Create outer walls
    for (let x = 0; x < config.width; x += 32) {
        scene.physics.add.image(x, 0, 'wall').setOrigin(0).setImmovable(true);
        scene.physics.add.image(x, config.height - 32, 'wall').setOrigin(0).setImmovable(true);
    }
    
    for (let y = 0; y < config.height; y += 32) {
        scene.physics.add.image(0, y, 'wall').setOrigin(0).setImmovable(true);
        scene.physics.add.image(config.width - 32, y, 'wall').setOrigin(0).setImmovable(true);
    }
    
    // Add collision between player and walls
    scene.physics.add.collider(player, scene.physics.world.staticBodies);
}

function createMeetingRooms(scene) {
    // Meeting room 1 (top right)
    createMeetingRoom(scene, 500, 100, 250, 200);
    
    // Meeting room 2 (bottom left)
    createMeetingRoom(scene, 100, 350, 200, 200);
}

function createMeetingRoom(scene, x, y, width, height) {
    // Create meeting room walls
    for (let i = 0; i < width; i += 32) {
        scene.physics.add.image(x + i, y, 'wall').setOrigin(0).setImmovable(true);
        scene.physics.add.image(x + i, y + height - 32, 'wall').setOrigin(0).setImmovable(true);
    }
    
    for (let i = 0; i < height; i += 32) {
        scene.physics.add.image(x, y + i, 'wall').setOrigin(0).setImmovable(true);
        scene.physics.add.image(x + width - 32, y + i, 'wall').setOrigin(0).setImmovable(true);
    }
    
    // Create door (middle of the left wall)
    const doorX = x + width / 2 - 16;
    const doorY = y + height - 32;
    const door = scene.physics.add.image(doorX, doorY, 'door_closed').setOrigin(0);
    door.setImmovable(true);
    door.isOpen = false;
    doors.push(door);
    
    // Add meeting room furniture
    // Conference table
    scene.add.image(x + width / 2, y + height / 2, 'desk').setOrigin(0.5).setScale(2, 1);
    
    // Chairs around the table
    const chairPositions = [
        { x: x + width / 2 - 50, y: y + height / 2 - 30 },
        { x: x + width / 2, y: y + height / 2 - 30 },
        { x: x + width / 2 + 50, y: y + height / 2 - 30 },
        { x: x + width / 2 - 50, y: y + height / 2 + 30 },
        { x: x + width / 2, y: y + height / 2 + 30 },
        { x: x + width / 2 + 50, y: y + height / 2 + 30 }
    ];
    
    chairPositions.forEach(pos => {
        const chair = scene.physics.add.image(pos.x, pos.y, 'chair').setOrigin(0.5);
        chair.setImmovable(true);
        chairs.push(chair);
    });
}

function createOfficeFurniture(scene) {
    // Create desks and chairs in the main office area
    const deskPositions = [
        { x: 100, y: 100 },
        { x: 100, y: 200 },
        { x: 250, y: 100 },
        { x: 250, y: 200 },
        { x: 400, y: 400 },
        { x: 500, y: 400 },
        { x: 600, y: 400 }
    ];
    
    deskPositions.forEach(pos => {
        scene.add.image(pos.x, pos.y, 'desk').setOrigin(0.5);
        
        // Add chair for each desk
        const chair = scene.physics.add.image(pos.x, pos.y + 40, 'chair').setOrigin(0.5);
        chair.setImmovable(true);
        chairs.push(chair);
    });
    
    // Add some plants for decoration
    const plantPositions = [
        { x: 50, y: 50 },
        { x: 750, y: 50 },
        { x: 750, y: 550 },
        { x: 50, y: 550 },
        { x: 400, y: 100 },
        { x: 600, y: 300 }
    ];
    
    plantPositions.forEach(pos => {
        const plant = scene.physics.add.image(pos.x, pos.y, 'plant').setOrigin(0.5);
        plant.setImmovable(true);
        scene.physics.add.collider(player, plant);
    });
}

function sitOnChair(chair) {
    isSitting = true;
    currentChair = chair;
    player.x = chair.x;
    player.y = chair.y - 10;
    helpText.setText('Press SPACE to stand up');
}

function standUp() {
    isSitting = false;
    currentChair = null;
    player.y += 20; // Move player away from chair
    helpText.setText('Use arrow keys to move. Press SPACE to interact with doors and chairs.');
}

function toggleDoor(door) {
    door.isOpen = !door.isOpen;
    if (door.isOpen) {
        door.setTexture('door_open');
        door.body.enable = false; // Disable collision when door is open
    } else {
        door.setTexture('door_closed');
        door.body.enable = true; // Enable collision when door is closed
    }
} 