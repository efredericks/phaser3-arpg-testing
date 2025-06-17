// minecraft style chunking for worldgen
class Chunk {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.tiles = this.scene.add.group();


        this.is_loaded = false;
    }

    // unload tiles for chunk
    unload() {
        if (this.is_loaded) {
            this.tiles.clear(true, true);
            this.is_loaded = false;
        }
    }

    // load tiles for chunk
    load() {
        if (!this.is_loaded) {
            for (let y = 0; y < this.scene.chunk_size; y++) {
                for (let x = 0; x < this.scene.chunk_size; x++) {
                    let tile_x = (this.x * (this.scene.chunk_size * this.scene.tile_size)) + (x * this.scene.tile_size);
                    let tile_y = (this.y * (this.scene.chunk_size * this.scene.tile_size)) + (y * this.scene.tile_size);

                    let noise_value = noise.perlin2(tile_x * 0.01, tile_y * 0.01);
                    let key = "";
                    let animation_key = "";

                    if (noise_value < 0.2) {
                        key = "sprWater";
                        animation_key = "sprWater";
                    }
                    else if (noise_value >= 0.2 && noise_value < 0.3) {
                        key = "sprSand";
                    }
                    else if (noise_value >= 0.3) {
                        key = "sprGrass";
                    }

                    let tile;
                    if (key == "sprGrass")
                        tile = new CollideTile(this.scene, tile_x, tile_y, key);
                    else
                        tile = new Tile(this.scene, tile_x, tile_y, key);

                    // let tile = new Tile(this.scene, tile_x, tile_y, key);

                    if (animation_key !== "") {
                        tile.play(animation_key);
                    }

                    this.tiles.add(tile);
                }
            }
            this.scene.env_colliding_tiles.add(this.tiles);
            this.is_loaded = true;
        }
    }
}

class CollideTile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.setOrigin(0);
        let t = this.scene.physics.add.sprite(x, y, key);
        this.scene.env_colliding_tiles.add(this);
        t.refreshBody();
    }
}

class Tile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.setOrigin(0);
    }
}