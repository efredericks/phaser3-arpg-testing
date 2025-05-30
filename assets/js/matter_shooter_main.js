const MAX_ENEMIES_PER_ROOM = 100;

class matterShooterMain extends Phaser.Scene {
    constructor() {
        super({ key: "matterShooterMain" });
    }

    preload() {
        this.load.spritesheet("sprWater", "assets/img/sprWater.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image("sprSand", "assets/img/sprSand.png");
        this.load.image("sprGrass", "assets/img/sprGrass.png");
        this.load.image("bullet", "assets/img/kenney_rpg-urban-pack/Tiles/tile_0060.png");

        this.load.image("tinydungeon-tiles", "assets/img/kenney_tiny-dungeon/Tilemap/tilemap_packed.png");
        this.load.image("wizard", "assets/img/kenney_tiny-dungeon/Tiles/tile_0084.png");
        this.load.image("ghost", "assets/img/kenney_tiny-dungeon/Tiles/tile_0121.png");
        this.load.image("ouch", "assets/img/kenney_tiny-dungeon/Tiles/tile_0062.png");
    }

    create() {
        this.matter.world.setBounds(0, 0, 100 * 16, 100 * 16).disableGravity();

        this.anims.create({
            key: "sprWater",
            frames: this.anims.generateFrameNumbers("sprWater"),
            frameRate: 5,
            repeat: -1
        });

        this.worldCollisionCategory = this.matter.world.nextCategory();
        this.enemiesCollisionCategory = this.matter.world.nextCategory();
        this.wizardCollisionCategory = this.matter.world.nextCategory();
        this.bulletCollisionCategory = this.matter.world.nextCategory();



        this.cameraSpeed = 10;
        this.cameras.main.setZoom(1);
        this.cameras.main.setBackgroundColor(0x1D1923);
        this.cameras.main.setBounds(0, 0, 100 * 16, 100 * 16);

        // tilemap
        this.level = [];
        for (let r = 0; r < 100; r++) {
            let row = [];
            for (let c = 0; c < 100; c++) {
                let ch = 0;
                if (r == 0 || c == 0 || r == 99 || c == 99)
                    ch = 14;
                else {
                    let r = Math.random();
                    if (r < 0.9) ch = 48;
                    else if (r < 0.95) ch = 49;
                    else if (r < 0.97) ch = 14;
                    else ch = 42;
                }

                //42 stones
                //48 blank
                //49 dots

                row.push(ch);
            }
            this.level.push(row);
        }

        this.map = this.make.tilemap({ data: this.level, tileWidth: 16, tileHeight: 16 });
        this.tiles = this.map.addTilesetImage("tinydungeon-tiles");
        this.layer = this.map.createLayer(0, this.tiles, 0, 0);

        this.map.setCollision(14);
        this.layer.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(this.layer);
        this.layer.forEachTile(tile => {
            if (tile.physics && tile.physics.matterBody) {
                tile.physics.matterBody.setCollisionCategory(this.worldCollisionCategory); // example
                tile.physics.matterBody.setCollidesWith([this.enemiesCollisionCategory, this.bulletCollisionCategory, this.wizardCollisionCategory]); // example
            }
        });


        let startx = 16 * 2;
        let starty = 16 * 2;

        this.wizard = this.matter.add.image(200, 50, 'wizard', null, { isSensor: true });
        this.wizard.setBody({
            type: 'rectangle',
            width: 14,
            height: 14
        });
        // this.wizard.setVelocity(6, 3);
        // this.wizard.setAngularVelocity(0.01);
        this.wizard.setBounce(1);
        this.wizard.setFriction(0, 0, 0);
        this.wizard.setCollisionCategory(this.wizardCollisionCategory);
        this.wizard.setCollidesWith([this.enemiesCollisionCategory, this.worldCollisionCategory]);


        this.enemies = [];
        for (let _ = 0; _ < 10; _++) {
            const enemy = this.spawnEnemy('ghost');
            this.enemies.push(enemy);
        }

        this.bullets = [];
        for (let i = 0; i < 64; i++) {
            const bullet = new Bullet(this.matter.world, 0, 0, 'bullet', null, { isSensor: true });//, wrapBounds);

            bullet.setCollisionCategory(this.bulletCollisionCategory);
            bullet.setCollidesWith([this.enemiesCollisionCategory, this.worldCollisionCategory]);
            bullet.setOnCollide(this.bulletVsEnemy);

            this.bullets.push(bullet);
        }

        // collision groups
        // this.static_collisions = this.matter.world.nextGroup(); // bouncing
        // this.bullet_collisions = this.matter.world.nextGroup(); // shooting
        // this.dynamic_collisions = this.matter.world.nextGroup(); // bumping

        // this.wizard.setCollisionGroup(this.static_collisions);


        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown-SPACE', () => {
            const bullet = this.bullets.find(bullet => !bullet.active);

            if (bullet) {
                bullet.fire(this.wizard.x, this.wizard.y, this.wizard.rotation, 5);
            }

        });
    }

    spawnEnemy(key) {
        let _x = Phaser.Math.Between(0, 100 * 16);
        let _y = Phaser.Math.Between(0, 100 * 16);

        const enemy = new Enemy(this.matter.world, Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), key, null, { isSensor: true });//, wrapBounds);
        enemy.setCollisionCategory(this.enemiesCollisionCategory);
        enemy.setCollidesWith([this.wizardCollisionCategory, this.bulletCollisionCategory, this.worldCollisionCategory]);
    }

    bulletVsEnemy(collisionData) {
        let bullet = collisionData.bodyA.gameObject;
        let enemy = collisionData.bodyB.gameObject;

        console.log(bullet, enemy)

        if ("type" in bullet && bullet.type == "Sprite") {
            bullet.setActive(false);
            bullet.setVisible(false);
            bullet.world.remove(bullet.body, true);
        }
        if ("type" in enemy && enemy.type == "Sprite") {
            enemy.setActive(false);
            enemy.setVisible(false);
            enemy.world.remove(enemy.body, true);
        }
    }

    update(time, delta) {
        this.wizard.setAngularVelocity(0); // avoid rotation when colliding
        if (this.keyW.isDown) {
            this.wizard.setVelocityY(-3);
        }
        else if (this.keyS.isDown) {
            this.wizard.setVelocityY(3);
        } else {
            this.wizard.setVelocityY(0);
        }
        if (this.keyA.isDown) {
            this.wizard.setVelocityX(-3);
        } else if (this.keyD.isDown) {
            this.wizard.setVelocityX(3);
        } else {
            this.wizard.setVelocityX(0);
        }
        // for (let e of this.enemies) {
        // const dist = Math.sqrt((e.body.position.x - this.wizard.x) ** 2 + (e.body.position.y - this.wizard.y) ** 2);
        // if (dist < 120) {
        //     if (e.body.position.x < this.wizard.body.position.x)
        //         e.setVelocityX(0.5)
        //     else
        //         e.setVelocityX(-0.5)
        //     if (e.body.position.y < this.wizard.body.position.y)
        //         e.setVelocityY(0.5)
        //     else
        //         e.setVelocityY(-0.5)
        // }

        // e.setAngularVelocity(0);
        // }

        if (this.enemies.length < MAX_ENEMIES_PER_ROOM && Math.random() > 0.95) {
            this.enemies.push(this.spawnEnemy('ghost'));
        }


        this.cameras.main.centerOn(this.wizard.x, this.wizard.y);
    }
}

class Enemy extends Phaser.Physics.Matter.Sprite {
    constructor(world, x, y, texture, bodyOptions) {
        super(world, x, y, texture, null, { plugin: bodyOptions });

        // this.play('eyes');

        this.setFrictionAir(0);

        this.scene.add.existing(this);

        const angle = Phaser.Math.Between(0, 360);
        const speed = Phaser.Math.FloatBetween(1, 3);

        // this.setAngle(angle);

        // this.setAngularVelocity(Phaser.Math.FloatBetween(-0.05, 0.05));

        this.setVelocityX(speed * Math.cos(angle));
        this.setVelocityY(speed * Math.sin(angle));
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        const dist = Math.sqrt((this.body.position.x - this.scene.wizard.x) ** 2 + (this.body.position.y - this.scene.wizard.y) ** 2);
        if (dist < 120) {
            if (this.body.position.x < this.scene.wizard.body.position.x)
                this.setVelocityX(0.5)
            else
                this.setVelocityX(-0.5)
            if (this.body.position.y < this.scene.wizard.body.position.y)
                this.setVelocityY(0.5)
            else
                this.setVelocityY(-0.5)
        }

        this.setAngularVelocity(0);
    }
}

class Bullet extends Phaser.Physics.Matter.Sprite {
    lifespan;

    constructor(world, x, y, texture, bodyOptions) {
        super(world, x, y, texture, null, { plugin: bodyOptions });

        this.setFrictionAir(0);
        this.setFixedRotation();
        this.setActive(false);

        this.scene.add.existing(this);

        this.world.remove(this.body, true);
    }

    fire(x, y, angle, speed) {
        this.world.add(this.body);

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.setRotation(angle);
        this.setVelocityX(speed * Math.cos(angle));
        this.setVelocityY(speed * Math.sin(angle));

        this.lifespan = 1000;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this.lifespan -= delta;

        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
            this.world.remove(this.body, true);
        }
    }
}