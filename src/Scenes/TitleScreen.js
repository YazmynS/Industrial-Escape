class Title extends Phaser.Scene {
    constructor() {
        super("titleScreen");
    }

    preload(){
        //load title animation plugin
        this.load.scenePlugin("AnimatedTiles", "./lib/AnimatedTiles.js", "animatedTiles", "animatedTiles");
        this.load.audio('backMusic',  './assets/Audio/mixkit-deep-urban-623.mp3');
        this.load.audio("walkingSound", "assets/Audio/lowRandom.ogg");
        this.load.audio("jumpingSound", "assets/Audio/phaseJump1.ogg");
        this.load.audio("gooLakeSound", "assets/Audio/pepSound1.ogg");
        this.load.audio("signSound", "assets/Audio/threeTone2.ogg");
        this.load.audio("batterySound","assets/Audio/powerUp2.ogg");
        this.load.audio("groundSound", "assets/Audio/pepSound3.ogg");
    } 

    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 4000;
        this.physics.world.TILE_BIAS = 24
        this.JUMP_VELOCITY = -700;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 3.0;
        this.SpawnX = 10;
        this.SpawnY = 10;
    }

    create() {        
        //Create Music
        const music = this.sound.add('backMusic',{volume: 0.4, loop: true});
        music.play();
        this.wMusic = this.sound.add("walkingSound", {loop: true, rate: 5.5});
        this.jMusic = this.sound.add("jumpingSound", {loop: true, rate: 1.5});
        this.lMusic = this.sound.add("gooLakeSound");
        this.sMusic = this.sound.add("signSound");
        this.bMusic = this.sound.add("batterySound");
        this.gMusic = this.sound.add("groundSound", {loop: true, rate: 2.0});
        
        //create game instructions
        document.getElementById('description').innerHTML = '<h2>Level 1: left/right: move // up: climb/jump // Space: jump // R: restart level // D: debug'

// set up Key Inputs
        //left, right, up, down, space
        cursors = this.input.keyboard.createCursorKeys();
    
        //reset
        this.rKey = this.input.keyboard.addKey('R');
        this.eKey = this.input.keyboard.addKey('E');
        
        // debug 
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);
        
        //Create Game Map
        this.map = this.add.tilemap("TitleScreen", 18, 18, 72, 40);

        //Create Tilesets
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");
        this.tilebackground = this.map.addTilesetImage("tilemap-backgrounds_packed", "tilemap_back");

        // Crete Needed Layers
        this.EnvironLayer = this.map.createLayer("Environment", this.tileset, 0, 0);
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.groundGooLayer = this.map.createLayer("GroundGoo", this.tileset,0,0);
        this.platformLayer = this.map.createLayer("Platform", this.tileset,0,0);
        this.ladderLayer = this.map.createLayer("Ladders", this.tileset, 0, 0); 
        this.checkpointLayer =this.map.createLayer("Hazard", this.tileset,0,0);
        this.ropeLayer = this.map.createLayer("Ropes", this.tileset,0,0);
        this.gooLakeLayer = this.map.createLayer("GooLakes", this.tileset,0,0);

        // Make Layers collidable (not needed for Obj Layers)
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.groundGooLayer.setCollisionByProperty({
            collides: true
        })

        this.platformLayer.setCollisionByProperty({
            collides: true
        })

        this.gooLakeLayer.setCollisionByProperty({
            collides: true
        })
        
        //Tell the animated tiles plugin to start
        this.animatedTiles.init(this.map);

//Set Up Batteries
        // Finds Battery in the "Objects" layer in Phaser
        this.battery = this.map.createFromObjects("BatteryObj", {
            name: "battery",
            key: "tilemap_sheet",
            frame: 10
        });
        //Apply Pysics to the Batteries
        this.physics.world.enable(this.battery, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a battery group for collision handling
        this.batteryGroup = this.add.group(this.battery);

//Set Up Door
    this.door = this.map.createFromObjects("DoorObj",{
        name: "Door",
        key: "tilemap_sheet",
        frame: 28
    });
    this.physics.world.enable(this.door, Phaser.Physics.Arcade.STATIC_BODY);
    this.doorGroup = this.add.group(this.door);

//Set up Checkpoints
        this.checkpoint = this.map.createFromObjects("SignObj", {
            name: "Sign",
            key: "tilemap_sheet",
            frame: 74
        });
        this.physics.world.enable(this.checkpoint, Phaser.Physics.Arcade.STATIC_BODY);
        this.signGroup = this.add.group(this.checkpoint);

// Set up Ropes
        this.rope = this.map.createFromObjects("RopeObj", {
            name: "Rope",
            key: "tilemap_sheet",
            frame: 23,
        });
        this.physics.world.enable(this.rope, Phaser.Physics.Arcade.STATIC_BODY);
        this.ropeGroup = this.add.group(this.rope);

// Set up Ladder
    this.ladder = this.map.createFromObjects("LadderObj", {
        name: "Ladder",
        key: "tilemap_sheet",
        frame: 11,
    });
    this.physics.world.enable(this.ladder, Phaser.Physics.Arcade.STATIC_BODY);
    this.ladderGroup = this.add.group(this.ladder);

// Set up player 
        my.sprite.player = this.physics.add.sprite(30, 170, "platformer_characters", "tile_0000.png").setScale(.7);
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.onRope = false; 
        my.sprite.player.onLadder = false;
        my.sprite.player.onDoor = false;
//Set up particle systems
        //battery particles
        my.vfx.batteryParticles = this.add.particles(0, 0, "kenny-particles", {
            frame: ['circle_03.png', 'circle_01.png'],
            scale: {start: 0.03, end: 0.1}, 
            maxParticles: 30,
            maxAliveParticles: 3,
            quantity: 3,
            lifespan: 250,
            tint: 0xFACADE,
            alpha: {start: 1, end: 0.1}, 
        });
        my.vfx.batteryParticles.stop()

        //sign particles
        my.vfx.signParticles = this.add.particles(0, 0, "kenny-particles", {
            frame: ['star_07.png', 'star_08.png'],
            scale: {start: 0.03, end: 0.05}, 
            maxAParticles: 3,
            lifespan: 250,
            tint: 0x0000FF,
            alpha: {start: 1, end: 0.1}, 
        });
        my.vfx.signParticles.stop()

        //goo lake particles
        my.vfx.lakeParticles = this.add.particles(0, 0, "kenny-particles", {
            frame: ['dirt_01.png', 'dirt_02.png'],
            scale: {start: 0.03, end: 0.1}, 
            maxParticles: 3,
            lifespan: 250,
            tint: 0x00FF00,
            alpha: {start: 1, end: 0.1}, 
        });
        my.vfx.lakeParticles.stop()

        //walking on goo particles
        my.vfx.gooWalking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_01.png', 'smoke_05.png'],
            scale: {start: 0.03, end: 0.1}, 
            maxAliveParticles: 3,
            lifespan: 250,
            tint: 0x00FF00,
            alpha: {start: 1, end: 0.1}, 
        });
        my.vfx.gooWalking.stop()

        //walking particles
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_01.png', 'smoke_05.png'],
            scale: {start: 0.03, end: 0.1}, 
            maxAliveParticles: 2,
            lifespan: 250,
            alpha: {start: 1, end: 0.1}, 
        });
        my.vfx.walking.stop()

        //jumping particles
        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_07.png'],
            random: true,
            scale: {start: 0.01, end: 0.1}, 
            maxAliveParticles: 3,
            lifespan: 250,
            alpha: {start: 1, end: 0.1}, 
        });
        my.vfx.jumping.stop()

//Set up Camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(2.5);

// Handle collision detection
        //ground
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        //platform
        this.physics.add.collider(my.sprite.player, this.platformLayer);
        
        //ground goo (Player moves slower through Groudgoo)
        this.physics.add.collider(my.sprite.player, this.groundGooLayer, (obj1, obj2) =>{
            obj1.setVelocityX(10);

            //PLay Music
            if(!this.gMusic.isPlaying){
                this.gMusic.play();
            }else{
                this.gMusic.stop();
            }
        });

        //signs
        this.physics.add.overlap(my.sprite.player, this.signGroup, (obj1, obj2) => {
           //Set Spawn point = to the players position when they collided with the sign
            this.SpawnX = my.sprite.player.x; 
            this.SpawnY = my.sprite.player.y;

             //Display Particles
             my.vfx.signParticles.start();
             this.time.addEvent({ delay: 1000, callback: function() {my.vfx.signParticles.stop();}, callbackScope: this, loop: false });
             my.vfx.signParticles.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
             my.vfx.signParticles.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
             
             //PLay Music
             if(!this.sMusic.isPlaying){
                 this.sMusic.play();
             }else{
                 this.sMusic.stop();
             }
        })

        //batteries
        this.physics.add.overlap(my.sprite.player, this.batteryGroup, (obj1, obj2) => {
            obj2.destroy(); // remove battery on overlap

            //Display Particles
            my.vfx.batteryParticles.start();
            this.time.addEvent({ delay: 1000, callback: function() {my.vfx.batteryParticles.stop();}, callbackScope: this, loop: false });
            my.vfx.batteryParticles.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.batteryParticles.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            
            //Play Music
            if(!this.bMusic.isPlaying){
                this.bMusic.play();
            }else{
                this.bMusic.stop();
            }
        })
         //goo Lake
        this.physics.add.collider(my.sprite.player, this.gooLakeLayer, (obj1, obj2) =>{
            //respawn at sign
            obj1.x = this.SpawnX;
            obj1.y = this.SpawnY;

            //Display Particles
            my.vfx.lakeParticles.start();
            this.time.addEvent({ delay: 1000, callback: function() {my.vfx.lakeParticles.stop();}, callbackScope: this, loop: false });
            my.vfx.lakeParticles.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.lakeParticles.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            //Play Music
            if(!this.lMusic.isPlaying){
                this.lMusic.play();
            }else{
                this.lMusic.stop();
            }
        });
    }
    update(){
         //Move Left
         if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
                if(!this.wMusic.isPlaying){
                    this.wMusic.play();
                }
            }
        //Move Right
        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
                if(!this.wMusic.isPlaying){
                    this.wMusic.play();
                }
            }

        //Stop
        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
            
            if(this.wMusic.isPlaying){
                this.wMusic.stop();
            }
        }

        // Jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
            if(!this.jMusic.isPlaying){
                this.jMusic.play();
            }  
        }else{
            this.jMusic.stop();
        }
            
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.space)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            my.vfx.jumping.start();
            my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.jumping.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            
        }else {
            my.vfx.jumping.stop();
        }

        //Restart Game
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

//Falling Goo
        let startX = 8;
        let startY = 150;
        let time = 2000;
        let arr = [];

        for(let r = 0; r < 4; r++, time+=1500){
            let timeObj = {
                at: time,
                run: () => {
                    //cols
                    for(let c = 0; c < 63; c++){
                        my.sprite.fall = this.add.sprite(startX+c*18, startY+r*18, "tilemap_sheet", 47).setScale(.55,1);
                        if(this.physics.overlap(my.sprite.player, my.sprite.fall)){
                            this.scene.restart();
                        }
                    }
                }
            }
            arr.push(timeObj);
            
            
        }
        const timeline = this.add.timeline(arr);
        timeline.play();

        
        
        

        
//Rope Stuff
        if (!this.physics.overlap(my.sprite.player, this.RopeGroup)) {
            my.sprite.player.onRope = false;
        }else{
            my.sprite.player.onRope = true;
        } 

        if (my.sprite.player.onRope || my.sprite.player.onLadder || my.sprite.player.onDoor) {
            my.sprite.player.body.allowGravity = false;
            cursors.down.enabled = true;
            cursors.up.enabled = true;
        }else if (!my.sprite.player.onRope && my.sprite.player.onLadder) {
            //if player no longer overlaps if rope, allow gravity but disable up and down keys
            my.sprite.player.body.allowGravity = true;
            cursors.down.enabled = false;
            cursors.up.enabled = false;
        }
        // Climb up Rope
        if (cursors.up.enabled && cursors.up.isDown) {
            cursors.down.isDown = false;
            cursors.down.isUp = true;
            my.sprite.player.setVelocityY(-this.ACCELERATION);
        } 
        // Climb down
        else if (cursors.down.enabled && cursors.down.isDown) {
            cursors.up.isDown = false;
            cursors.up.isUp = true;
            my.sprite.player.setVelocityY(this.ACCELERATION);
        }
        else {
            // Stop player movement
            cursors.up.isDown = false;
            cursors.down.isDown = false;
            cursors.up.isUp = true;
            cursors.down.isUp = true;
        } 

//Ladder Stuff
        //If on ladder, disable gravity but enable up and down keys
        if (!this.physics.overlap(my.sprite.player, this.ladderGroup)) {
            my.sprite.player.onLadder = false;
        }else{
            my.sprite.player.onLadder = true;
        } 
        
        if (my.sprite.player.onLadder) {
            my.sprite.player.body.allowGravity = false;
            cursors.down.enabled = true;
            cursors.up.enabled = true;
            my.sprite.player.setVelocityY(0);
        }else if (!my.sprite.player.onLadder) {
            //if player no longer overlaps if ladder, allow gravity but disable up and down keys
            my.sprite.player.body.allowGravity = true;
            cursors.down.enabled = false;
            cursors.up.enabled = false;
            //my.sprite.player.setVelocityY(this.ACCELERATION);
        }
        // Climb up ladder
        if (cursors.up.enabled && cursors.up.isDown) {
            cursors.down.isDown = false;
            cursors.down.isUp = true;
            my.sprite.player.setVelocityY(-this.ACCELERATION);
        } 
        // Climb down ladder
        else if (cursors.down.enabled && cursors.down.isDown) {
            cursors.up.isDown = false;
            cursors.up.isUp = true;
            my.sprite.player.setVelocityY(this.ACCELERATION);
        }
        else {
            // Stop player movement
            cursors.up.isDown = false;
            cursors.down.isDown = false;
            cursors.up.isUp = true;
            cursors.down.isUp = true;
        }      

        //Door End Game
        //door
        if(this.physics.add.overlap(my.sprite.player, this.doorGroup)){
            my.sprite.player.onDoor = true;
        }else{
            my.sprite.player.onDoor = false;     
        }

        if (my.sprite.player.onDoor && Phaser.Input.Keyboard.JustDown(this.eKey)){
            this.scene.start("platformerScene");
        }        
    }
}
//Additions:
    //Add Particles
    //Fix Ground Goo Sound
    //Move Platform
    //Add falling goop
    //Door ism't working for some reason?
    //Reset button doesn't work for some reason?