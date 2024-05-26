class Platformer extends Phaser.Scene {
    constructor() {
        super("sceneEnd");
    }

    preload(){
    }

    create() {        
        //reset
        this.rKey = this.input.keyboard.addKey('R');
                
        //Create Game Map
        this.map = this.add.tilemap("EndScene", 18, 18, 72, 40);
        
        //Create Tilesets
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");
        //this.tilebackground = this.map.addTilesetImage("tilemap-backgrounds_packed", "tilemap_back");

        // Crete Needed Layers
        this.endLayer = this.map.createLayer("End", this.tileset, 0, 0);              
    }
}