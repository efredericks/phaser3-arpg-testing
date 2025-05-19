class endlessMain extends Phaser.Scene {
    constructor() {
        super({ key: "endlessMain" });
    }

    preload() {
        this.load.spritesheet("sprWater", "assets/img/sprWater.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image("sprSand", "assets/img/sprSand.png");
        this.load.image("sprGrass", "assets/img/sprGrass.png");
    }

    create() {
        this.anims.create({
            key: "sprWater",
            frames: this.anims.generateFrameNumbers("sprWater"),
            frameRate: 5,
            repeat: -1
        });

        this.chunk_size = 8;
        this.tile_size = 16;
        this.cameraSpeed = 10;

        this.cameras.main.setZoom(2);

        this.followPoint = new Phaser.Math.Vector2(
            this.cameras.main.worldView.x + (this.cameras.main.worldView.width * 0.5),
            this.cameras.main.worldView.y + (this.cameras.main.worldView.height * 0.5)
        );

        this.player = this.physics.add.sprite(this.followPoint.x, this.followPoint.y, 'sprGrass');
        this.player.setBounce(0.2);
        this.player.setDepth(99);
        this.player.setCollideWorldBounds(true);


        this.env_colliding_tiles = this.physics.add.staticGroup();
        this.moving_entities = this.physics.add.group();
        this.moving_entities.add(this.player);

        this.physics.add.collider(this.player, this.env_colliding_tiles);

        // this.physics.add.collider(this.env_colliding_tiles, this.moving_entities, this.collision_cb);//, undefined, this.onProcessCallback.bind(this))


        this.chunks = [];

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    collision_cb(a, b) {
        // console.log(a,b);
    }

    getChunk(x, y) {
        let chunk = null;
        for (let i = 0; i < this.chunks.length; i++) {
            if (this.chunks[i].x == x && this.chunks[i].y == y) {
                chunk = this.chunks[i];
            }
        }
        return chunk;
    }

    update() {
        // let snapped_chunk_x = (this.chunk_size * this.tile_size) * Math.round(this.followPoint.x / (this.chunk_size * this.tile_size));
        // let snapped_chunk_y = (this.chunk_size * this.tile_size) * Math.round(this.followPoint.y / (this.chunk_size * this.tile_size));
        let snapped_chunk_x = (this.chunk_size * this.tile_size) * Math.round(this.player.x / (this.chunk_size * this.tile_size));
        let snapped_chunk_y = (this.chunk_size * this.tile_size) * Math.round(this.player.y / (this.chunk_size * this.tile_size));

        // create chunks in radius around follow
        snapped_chunk_x = snapped_chunk_x / this.chunk_size / this.tile_size;
        snapped_chunk_y = snapped_chunk_y / this.chunk_size / this.tile_size;

        // chunk load/unload
        for (let x = snapped_chunk_x - 2; x < snapped_chunk_x + 2; x++) {
            for (let y = snapped_chunk_y - 2; y < snapped_chunk_y + 2; y++) {
                let existingChunk = this.getChunk(x, y);

                if (existingChunk == null) {
                    let newChunk = new Chunk(this, x, y);
                    this.chunks.push(newChunk);
                }
            }
        }

        for (let i = 0; i < this.chunks.length; i++) {
            let chunk = this.chunks[i];

            if (Phaser.Math.Distance.Between(
                snapped_chunk_x,
                snapped_chunk_y,
                chunk.x,
                chunk.y
            ) < 3) {
                if (chunk !== null) {
                    chunk.load();
                }
            }
            else {
                if (chunk !== null) {
                    chunk.unload();
                }
            }
        }

        // camera movement
        if (this.keyW.isDown) {
            this.player.setVelocityY(-160);
            // this.player.y -= this.cameraSpeed;
        }
        else if (this.keyS.isDown) {
            // this.player.y += this.cameraSpeed;
            this.player.setVelocityY(160);
        } else {
            this.player.setVelocityY(0);
        }
        if (this.keyA.isDown) {
            // this.player.x -= this.cameraSpeed;
            this.player.setVelocityX(-160);
        } else if (this.keyD.isDown) {
            this.player.setVelocityX(160);
            // this.player.x += this.cameraSpeed;
        } else {
            this.player.setVelocityX(0);
        }

        // center camera
        this.cameras.main.centerOn(this.player.x, this.player.y);
        // this.player.x = this.followPoint.x;
        // this.player.y = this.followPoint.y;
    }
}