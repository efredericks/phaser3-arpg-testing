class pauseMenu extends Phaser.Scene {
    constructor() {
        super({ key: "pauseMenu" });
    }

    create() {
        this.text = this.add.text(300, 300, "PAUSED").setColor("#fff").setSize(40);
        this.vx = 1.;
        this.vy = 1.;
        this.speed = (600. / 2.) / 1000.;

        this.tweens.add({
            targets: this.text,
            scaleX: 2.0,
            scaleY: 2.0,
            duration: 1000,
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1,
        });

        this.overworld = this.scene.get("exploratoriumOverworld");

        this.input.on('pointerdown', () => {
            this.scene.switch(this.overworld);
            // this.scene.transition({
            //     target: this.overworld,
            //     duration: 3000,
            //     moveAbove: true,
            // });



            // this.scene.setVisible(true, this.overworld);
            // this.scene.setActive(true, this.overworld);

            // this.scene.setVisible(false, this);
            // this.scene.setActive(false, this);
            // this.scene.setVisible(false, this);
            // this.scene.setVisible(true, this.overworld);
            // this.scene.setVisible(false, 'pauseMenu');
            // this.scene.setActive(false, 'pauseMenu');

            // this.scene.setVisible(true, 'exploratoriumOverworld');
            // this.scene.setActive(true, 'exploratoriumOverworld');
            // this.scene.launch('exploratoriumOverworld');
        });
    }

    update(time, delta) {
        this.text.x += this.vx * delta * this.speed;
        this.text.y += this.vy * delta * this.speed;

        if (this.text.x < 0 || this.text.x > 1024) this.vx = (this.vx * -1) + Phaser.Math.FloatBetween(-0.05, 0.05);
        if (this.text.y < 0 || this.text.y > 768) this.vy = (this.vy * -1) + Phaser.Math.FloatBetween(-0.05, 0.05);

        this.vx = Math.min(1.0, Math.max(-1.0, this.vx));
        this.vy = Math.min(1.0, Math.max(-1.0, this.vy));
    }
}

class exploratoriumShop extends Phaser.Scene {
    constructor() {
        super({ key: "exploratoriumShop" });
    }
}
class exploratoriumDetailed extends Phaser.Scene {
    constructor() {
        super();
        // super({ key: "exploratoriumDetailed" });
    }

    create() {
        this.text = this.add.text(300, 300, "DETAILED").setColor("#fff");
        this.text.setRotation(Phaser.Math.FloatBetween(0, TWO_PI));

        this.overworld = this.scene.get("exploratoriumOverworld");


        this.input.on('pointerdown', () => {
            this.scene.switch(this.overworld);
        });
    }

    update(time, delta) {
        if (this.keyW.isDown) {
            this.player.setVelocityY(-this.player.data.get('speed'));
        }
        else if (this.keyS.isDown) {
            this.player.setVelocityY(this.player.data.get('speed'));
        } else {
            this.player.setVelocityY(0);
        }
        if (this.keyA.isDown) {
            this.player.setVelocityX(-this.player.data.get('speed'));
        } else if (this.keyD.isDown) {
            this.player.setVelocityX(this.player.data.get('speed'));
        } else {
            this.player.setVelocityX(0);
        }
    }
}

// instantiate all data within the phaser context
class setupGameData extends Phaser.Scene {
    constructor() {
        super({ key: "setupGameData" });
    }
    create() {
        this.text = this.add.text(300, 300, "LOADING").setColor("#fff").setSize(40);
        this.vx = 1.;
        this.vy = 1.;
        this.speed = (600. / 2.) / 1000.;

        this.tweens.add({
            targets: this.text,
            scaleX: 2.0,
            scaleY: 2.0,
            duration: 1000,
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1,
        });

        setupAllData(Phaser);

        this.scene.setActive("setupGameData", false);
        this.scene.switch(this.scene.get("exploratoriumOverworld"));
    }
}
class exploratoriumOverworld extends Phaser.Scene {
    constructor() {
        super({ key: "exploratoriumOverworld" });
    }

    preload() {
        this.load.spritesheet("sprWater", "assets/img/sprWater.png", {
            frameWidth: TILE_SIZE,
            frameHeight: TILE_SIZE
        });
        this.load.image("sprSand", "assets/img/sprSand.png");
        this.load.image("sprGrass", "assets/img/sprGrass.png");
        // this.load.image("bullet", "assets/img/kenney_rpg-urban-pack/Tiles/tile_0060.png");
        this.load.image("bullet", "assets/img/zoe-sprites/peely.png");

        this.load.image("tinydungeon-tiles", "assets/img/kenney_tiny-dungeon/Tilemap/tilemap_packed.png");
        // this.load.image("player", "assets/img/kenney_tiny-dungeon/Tiles/tile_0084.png");
        // this.load.spritesheet("player", "assets/img/tile_0084.png", {
        //     frameWidth: TILE_SIZE,
        //     frameHeight: TILE_SIZE
        // });
        this.load.spritesheet("player", "assets/img/zoe-sprites/linkpizza.png", {
            frameWidth: TILE_SIZE,
            frameHeight: TILE_SIZE
        });
        this.load.image("ghost", "assets/img/zoe-sprites/slime-ball-blower.png");
        // this.load.image("ghost", "assets/img/kenney_tiny-dungeon/Tiles/tile_0121.png");
        this.load.image("ghost-green", "assets/img/kenney_tiny-dungeon/Tiles/tile_0108.png");
        this.load.image("spider", "assets/img/kenney_tiny-dungeon/Tiles/tile_0122.png");

        this.load.image("ouch", "assets/img/kenney_tiny-dungeon/Tiles/tile_0062.png");

        this.load.image("red-potion", "assets/img/kenney_tiny-dungeon/Tiles/tile_0115.png");
    }

    create() {
        this.matter.world.setBounds(0, 0, MAP_DATA.NUM_COLS * TILE_SIZE, MAP_DATA.NUM_ROWS * TILE_SIZE).disableGravity();

        this.anims.create({
            key: "sprWater",
            frames: this.anims.generateFrameNumbers("sprWater"),
            frameRate: 5,
            repeat: -1
        });

        this.worldCollisionCategory = this.matter.world.nextCategory();
        this.enemiesCollisionCategory = this.matter.world.nextCategory();
        this.playerCollisionCategory = this.matter.world.nextCategory();
        this.bulletCollisionCategory = this.matter.world.nextCategory();
        this.pickupCollisionCategory = this.matter.world.nextCategory();
        this.portalCollisionCategory = this.matter.world.nextCategory();

        this.moving_entities = [];

        this.cameraSpeed = 10;
        this.cameras.main.setZoom(1);
        this.cameras.main.setBackgroundColor(0x1D1923);
        this.cameras.main.setBounds(0, 0, MAP_DATA.NUM_COLS * TILE_SIZE, MAP_DATA.NUM_ROWS * TILE_SIZE);
        this.cameras.main.setLerp(0.1, 0.1);
        this.cameras.main.fadeIn();
        this.cameras.main.postFX.addVignette(0.5, 0.5, 0.8);

        this.cameras.main.zoomTo(2, 10);

        // tilemap
        let wtypes = ["random", "arena", "bsp", "cellular"];
        this.world = game_data.levels.overworld;
        // this.generateWorld(
        //     // Phaser.Math.RND.pick(wtypes)
        //     // "arena",
        //     "cellular",
        // ); // arena, cellular, bsp
        // this.world.level = world.level;

        this.map = this.make.tilemap({ data: this.world.level, tileWidth: TILE_SIZE, tileHeight: TILE_SIZE });
        this.tiles = this.map.addTilesetImage("tinydungeon-tiles");
        this.layer = this.map.createLayer(0, this.tiles, 0, 0);

        this.map.setCollision(MAP_DATA.BLOCKING);
        this.layer.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(this.layer);
        this.layer.forEachTile(tile => {
            if (tile.physics && tile.physics.matterBody) {
                // set static?
                tile.physics.matterBody.setCollisionCategory(this.worldCollisionCategory); // example
                tile.physics.matterBody.setCollidesWith([this.enemiesCollisionCategory, this.bulletCollisionCategory, this.playerCollisionCategory]); // example
            }
        });

        // this.enemies = [];
        for (let e of game_data.enemies) {
            this.moving_entities.push(
                ObjectFactory.createMovingEntity(this, this.matter.world, e)
            );

        }
        // for (let _ = 0; _ < 10; _++) {
        //     let oc = Phaser.Math.RND.pick(this.world.open_cells);
        //     const enemy = this.spawnEnemy(Phaser.Math.RND.pick(['ghost', 'spider']), oc.c, oc.r);
        //     // this.enemies.push(enemy);
        //     this.moving_entities.push(enemy);
        // }


        let woc = Phaser.Math.RND.pick(this.world.open_cells);
        this.player = ObjectFactory.createPlayer(this, this.matter.world, game_data.player);
        // this.player = new MovingEntity(this.matter.world, this, woc.c * TILE_SIZE + HALF_TILE, woc.r * TILE_SIZE + HALF_TILE, 'player', { isSensor: true });
        // this.player.isPlayer = true;
        // this.player.setCollisionCategory(this.playerCollisionCategory);
        // this.player.setCollidesWith([this.enemiesCollisionCategory, this.worldCollisionCategory, this.pickupCollisionCategory, this.portalCollisionCategory]);
        // this.player.setDepth(100);

        // this.player.positions = {};
        // this.player.positions['overworld'] = { x: 0, y: 0 };
        // this.player.positions['detailed1'] = { x: 0, y: 0 };
        // this.player.positions['detailed2'] = { x: 0, y: 0 };

        // //debug
        // this.player.text_debug = this.add.text(this.player.x, this.player.y - TILE_SIZE, `${this.player.x}, ${this.player.y}`).setColor("#000");
        // this.player.x = this.world.door.c * TILE_SIZE + HALF_TILE;
        // this.player.y = this.world.door.r * TILE_SIZE + HALF_TILE;

        this.moving_entities.push(this.player);

        this.bullets = [];
        for (let i = 0; i < 64; i++) {
            const bullet = new Bullet(this.matter.world, -64, -64, 'bullet', null, { isSensor: true });//, wrapBounds);

            bullet.setCollisionCategory(this.bulletCollisionCategory);
            bullet.setCollidesWith([this.enemiesCollisionCategory, this.worldCollisionCategory]);
            this.bullets.push(bullet);
        }

        // pickups
        this.hp_potion = this.matter.add.image(400, 300, 'red-potion', null, null);
        this.hp_potion.setCollisionCategory(this.pickupCollisionCategory);
        this.hp_potion.setCollidesWith([this.playerCollisionCategory]);

        this.player.setOnCollideWith(this.hp_potion, pair => {
            // Do something
            // console.log('wowee')
            this.player.heal(SPRITE_DATA['hp-potion'].heal);
            this.hp_potion.setActive(false);
            this.hp_potion.setVisible(false);
            this.hp_potion.world.remove(this.hp_potion, true);
        });

        // collide with detailed scenes
        this.portal_scenes = [];
        this.portal_scenes.push(1);
        this.portal_scenes.push(2);
        for (let p of this.world.portals) {
            this.player.setOnCollideWith(p.portal, pair => {
                let pid = this.portal_scenes.indexOf(p.portal_id);
                if (pid >= 0) {
                    this.player.positions['overworld'].x = this.player.x;
                    this.player.positions['overworld'].y = this.player.y;
                    this.scene.switch(this.scene.get(`exploratoriumDetailed_${p.portal_id}`), { player: this.player });
                } else {
                    console.warn("Detailed scene ID not found");
                }
                // console.log(p)
            });
        }




        this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.text_debug = this.add.text(TILE_SIZE, TILE_SIZE, `Enemies: ${this.moving_entities.length - 1}`).setColor("#000");

        this.player.anims.create({
            key: "rest",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 5,
            repeat: -1
        });
        this.player.play('rest');

        this.matter.world.on('collisionactive', event => {
            for (let pair of event.pairs) {
                // bullet-entity collision
                if (pair.bodyA.gameObject.isBullet) {
                    pair.bodyA.gameObject.setActive(false);
                    pair.bodyA.gameObject.setVisible(false);
                    pair.bodyA.gameObject.world.remove(pair.bodyA, true);

                    if (pair.bodyB.gameObject.isMovingEntity)
                        pair.bodyB.gameObject.damaged(1);
                    // entity-bullet collision
                } else if (pair.bodyB.gameObject.isBullet) {
                    pair.bodyB.gameObject.setActive(false);
                    pair.bodyB.gameObject.setVisible(false);
                    pair.bodyB.gameObject.world.remove(pair.bodyB, true);

                    if (pair.bodyA.gameObject.isMovingEntity)
                        pair.bodyA.gameObject.damaged(1);
                    // entity-entity collision
                } else {
                    // enemy-player collision
                    if ((pair.bodyA.gameObject.isPlayer && pair.bodyB.gameObject.isEnemy) || (pair.bodyA.gameObject.isEnemy && pair.bodyB.gameObject.isPlayer)) {
                        this.player.damaged(1);
                        this.cameras.main.shake(100, 0.001);
                    }
                }
            }
        });

        this.pauseMenu = this.scene.get("pauseMenu");
        // this.scene.launch(this.pauseMenu, () => {
        //     this.scene.setVisible(false, this.pauseMenu);
        //     this.scene.setActive(false, this.pauseMenu);
        // });
        // this.scene.setVisible(false, this.pauseMenu);
        // this.scene.setActive(false, this.pauseMenu);

        // this.input.on('pointerdown', () => {
        //     this.scene.switch(this.pauseMenu);
        //     // this.scene.setVisible(true, this.pauseMenu);
        //     // this.scene.setActive(true, this.pauseMenu);

        //     // this.scene.setVisible(false, this);
        //     // this.scene.setActive(false, this);
        // });
    }

    // generateWorld(t = "random") {
    //     let level = [];
    //     let open_cells = [];

    //     if (t == "random") {
    //         for (let r = 0; r < MAP_DATA.NUM_ROWS; r++) {
    //             let row = [];
    //             for (let c = 0; c < MAP_DATA.NUM_COLS; c++) {
    //                 let ch = 0;
    //                 if (r == 0 || c == 0 || r == MAP_DATA.NUM_ROWS - 1 || c == MAP_DATA.NUM_COLS - 1)
    //                     ch = 14;
    //                 else {
    //                     let r = Math.random();
    //                     if (r < 0.9) ch = 48;
    //                     else if (r < 0.95) ch = 49;
    //                     else if (r < 0.97) ch = 14;
    //                     else ch = 42;
    //                 }

    //                 //42 stones
    //                 //48 blank
    //                 //49 dots
    //                 if (MAP_DATA.WALKABLE.indexOf(ch) >= 0) {
    //                     open_cells.push({ r: r, c: c })
    //                 }

    //                 row.push(ch);
    //             }
    //             level.push(row);
    //         }
    //     } else {
    //         // let map = new ROT.Map.EllerMaze(MAP_DATA.NUM_COLS, MAP_DATA.NUM_ROWS);

    //         let map;

    //         if (t == "bsp") {
    //             map = new ROT.Map.Digger(MAP_DATA.NUM_COLS, MAP_DATA.NUM_ROWS, {
    //                 roomWidth: [5, 20],
    //                 roomHeight: [5, 20],
    //                 corridorLength: [5, 20],
    //                 dugPercentage: 0.4,

    //             });
    //         } else if (t == "cellular") {
    //             map = new ROT.Map.Cellular(MAP_DATA.NUM_COLS, MAP_DATA.NUM_ROWS);
    //             map.randomize(0.5);
    //             for (let i = 0; i < 50; i++) map.create();
    //             map.connect(null, 0, function (from, to) {
    //                 // console.log(from,to)
    //             });
    //         } else { // arena
    //             map = new ROT.Map.Arena(MAP_DATA.NUM_COLS, MAP_DATA.NUM_ROWS);
    //         }

    //         for (let r = 0; r < MAP_DATA.NUM_ROWS; r++) {
    //             let row = [];
    //             for (let c = 0; c < MAP_DATA.NUM_COLS; c++) {
    //                 row.push(-1);
    //             }
    //             level.push(row);
    //         }
    //         let mapcb = function (x, y, val) {
    //             // console.log(x, y, val);
    //             let ch = val;
    //             if (val == 1 || (x == 0 || y == 0 || x == MAP_DATA.NUM_COLS - 1 || y == MAP_DATA.NUM_ROWS - 1)) ch = 0;
    //             else {
    //                 if (t == "arena") {
    //                     let r = Math.random();
    //                     if (r < 0.9) ch = 48;
    //                     else if (r < 0.95) ch = 49;
    //                     else if (r < 0.97) ch = 14;
    //                     else ch = 42;
    //                 } else {
    //                     ch = 48;
    //                 }
    //             }
    //             level[y][x] = ch;

    //             if (ch != 0 && MAP_DATA.WALKABLE.indexOf(ch) >= 0)
    //                 open_cells.push({ c: x, r: y });
    //         }
    //         map.create(mapcb);

    //         // post process to minimize colliding entities
    //         for (let r = 0; r < MAP_DATA.NUM_ROWS; r++) {
    //             for (let c = 0; c < MAP_DATA.NUM_COLS; c++) {
    //                 if (MAP_DATA.WALKABLE.indexOf(level[r][c]) >= 0) {
    //                     for (let d of DIRECTIONS) {
    //                         let next = { c: c + d[0], r: r + d[1] };

    //                         if (next.c >= 0 && next.c <= MAP_DATA.NUM_COLS - 1 && next.r >= 0 && next.r <= MAP_DATA.NUM_ROWS - 1) {
    //                             if (level[next.r][next.c] == 0) level[next.r][next.c] = 14;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //         console.log(level)
    //     }

    //     // carve out a town?
    //     let oc = Phaser.Math.RND.pick(open_cells); // center point of area
    //     while (oc.c < 10 || oc.c > MAP_DATA.NUM_COLS - 11 || oc.r < 10 || oc.r > MAP_DATA.NUM_ROWS - 11) {
    //         oc = Phaser.Math.RND.pick(open_cells); // center point of area
    //     }
    //     level[oc.r][oc.c] = 33;
    //     let tlc = oc.c - 3;
    //     let tlr = oc.r - 6;
    //     for (let r = tlr; r <= tlr + 6; r++) {
    //         for (let c = tlc; c <= tlc + 6; c++) {
    //             if (r != oc.r || c != oc.c) {
    //                 if (r == tlr || r == tlr + 6 || c == tlc || c == tlc + 6)
    //                     if (c == tlc)
    //                         level[r][c] = 36;
    //                     else if (c == tlc + 6)
    //                         level[r][c] = 38;
    //                     else
    //                         level[r][c] = 37;
    //                 else
    //                     level[r][c] = 0;
    //             }
    //         }
    //     }
    //     for (let c = tlc - 1; c <= tlc + 7; c++) {
    //         level[oc.r + 1][c] = 0;
    //         level[oc.r - 7][c] = 0;
    //     }
    //     for (let r = tlr - 1; r <= tlr + 7; r++) {
    //         level[r][tlc - 1] = 0;
    //         level[r][tlc + 7] = 0;
    //     }
    //     // level[oc.r - 3][oc.c] = 33;
    //     let portals = [];
    //     const portal = this.matter.add.image(oc.c * TILE_SIZE + HALF_TILE, (oc.r - 3) * TILE_SIZE + HALF_TILE, 'ouch', null, null).setStatic(true);
    //     portal.label = "portal";
    //     portal.portal_id = "1";
    //     portal.setDepth(98);
    //     portal.setCollisionCategory(this.portalCollisionCategory);
    //     portal.setCollidesWith([this.playerCollisionCategory]);
    //     let portal_level = [];
    //     for (let r = 0; r < 10; r++) {
    //         let row = [];
    //         for (let c = 0; c < 10; c++) {
    //             let ch = 0;
    //             if (c == 0 || r == 0 || c == 9 || r == 9) ch = 14;
    //             row.push(ch);
    //         }
    //         portal_level.push(row);
    //     }
    //     portals.push({ portal: portal, portal_id: 1, level: portal_level });

    //     const portal2 = this.matter.add.image(oc.c * TILE_SIZE + HALF_TILE, (oc.r - 5) * TILE_SIZE + HALF_TILE, 'ouch', null, null).setStatic(true);
    //     portal2.label = "portal";
    //     portal2.portal_id = "2";
    //     portal2.setDepth(98);
    //     portal2.setCollisionCategory(this.portalCollisionCategory);
    //     portal2.setCollidesWith([this.playerCollisionCategory]);
    //     let portal2_level = [];
    //     for (let r = 0; r < 10; r++) {
    //         let row = [];
    //         for (let c = 0; c < 10; c++) {
    //             let ch = 0;
    //             if (c == 0 || r == 0 || c == 9 || r == 9) ch = 14;
    //             else {
    //                 if (Math.random() > 0.8) ch = 14;
    //             }
    //             row.push(ch);
    //         }
    //         portal2_level.push(row);
    //     }
    //     portals.push({ portal: portal2, portal_id: 2, level: portal2_level });

    //     this.scene.add(`exploratoriumDetailed_${1}`, exploratoriumDetailed, false);
    //     this.scene.add(`exploratoriumDetailed_${2}`, exploratoriumDetailed, false);


    //     // console.log('Door:', oc.c * TILE_SIZE, oc.r * TILE_SIZE)

    //     return { level: level, open_cells: open_cells, door: oc, portals: portals };
    // }

    goAway() {
        console.log("ew")
    }

    spawnItem(key, x, y) {

    }

    spawnEnemy(key, c = null, r = null) {
        let _x, _y;
        if (c == null || r == null) {
            _x = Phaser.Math.Between(TILE_SIZE * 2, (MAP_DATA.NUM_COLS - 1) * TILE_SIZE);
            _y = Phaser.Math.Between(TILE_SIZE * 2, (MAP_DATA.NUM_ROWS - 1) * TILE_SIZE);
        } else {
            _x = c * TILE_SIZE + HALF_TILE;
            _y = r * TILE_SIZE + HALF_TILE;
        }

        let enemy;
        if (key == 'ghost')
            enemy = new Ghost(this.matter.world, this, _x, _y, key, null, { isSensor: true });//, wrapBounds);
        else
            enemy = new Spider(this.matter.world, this, _x, _y, key, null, { isSensor: true });//, wrapBounds);

        enemy.setCollisionCategory(this.enemiesCollisionCategory);
        enemy.setCollidesWith([this.playerCollisionCategory, this.bulletCollisionCategory, this.worldCollisionCategory]);
        enemy.isEnemy = true;

        return enemy;
    }

    bulletVsEnemy(collisionData) {
        let bullet = collisionData.bodyA.gameObject;
        let enemy = collisionData.bodyB.gameObject;

        // console.log(bullet, enemy)

        if ("type" in bullet && bullet.type == "Sprite") {

            // has HP
            if (bullet.bar) {
                bullet.damaged(enemy.power);
            }
        }
        if ("type" in enemy && enemy.type == "Sprite") {
            if (enemy.bar) {
                enemy.damaged(bullet.power);
            }
        }
    }

    update(time, delta) {
        if (this.keyP.isDown) {
            this.scene.switch(this.pauseMenu);
        }
        if (this.keyW.isDown) {
            this.player.setVelocityY(-this.player.data.get('speed'));
        }
        else if (this.keyS.isDown) {
            this.player.setVelocityY(this.player.data.get('speed'));
        } else {
            this.player.setVelocityY(0);
        }
        if (this.keyA.isDown) {
            this.player.setVelocityX(-this.player.data.get('speed'));
        } else if (this.keyD.isDown) {
            this.player.setVelocityX(this.player.data.get('speed'));
        } else {
            this.player.setVelocityX(0);
        }

        let fc = this.player.data.get('fire_cooldown');

        if (fc == 0) {
            let angle = null;
            if (this.cursors.left.isDown) {
                angle = Math.PI;
            }
            else if (this.cursors.right.isDown) {
                angle = 0;
            }
            if (this.cursors.up.isDown) {
                angle = -HALF_PI;
            }
            else if (this.cursors.down.isDown) {
                angle = HALF_PI;
            }
            if (angle != null) {
                this.player.data.set('fire_cooldown', 10);

                // single
                // const bullet = this.bullets.find(bullet => !bullet.active);
                // if (bullet) {
                //     bullet.fire(this.player.x, this.player.y, angle, 5);
                // }
                // tri
                const bullet = this.bullets.find(bullet => !bullet.active);
                if (bullet) {
                    bullet.fire(this.player.x, this.player.y, angle, 5);
                }
                const bullet2 = this.bullets.find(bullet2 => !bullet2.active);
                if (bullet2) {
                    bullet2.fire(this.player.x, this.player.y, angle - EIGHTH_PI, 5);
                }
                const bullet3 = this.bullets.find(bullet3 => !bullet3.active);
                if (bullet3) {
                    bullet3.fire(this.player.x, this.player.y, angle + EIGHTH_PI, 5);
                }
            }
        } else {
            fc--;
            this.player.data.set('fire_cooldown', fc);
        }

        // if (this.moving_entities.length - 1 < MAX_ENEMIES_PER_ROOM && Math.random() > 0.95) {
        //     let oc = Phaser.Math.RND.pick(this.world.open_cells);
        //     const e = this.spawnEnemy(Phaser.Math.RND.pick(['ghost', 'spider']), oc.c, oc.r);
        //     // this.enemies.push(e);
        //     this.moving_entities.push(e);
        // }
        this.text_debug.setText(`Enemies: ${this.moving_entities.length - 1}`);

        // draw HP bars
        for (let i = this.moving_entities.length - 1; i >= 0; i--) {
            let me = this.moving_entities[i];
            if (!me.active) { // cull
                this.moving_entities.splice(i, 1);
            } else {
                me.draw();
            }
        }

        let num = 0;
        let inv = this.player.data.get('inventory');
        if ('ghost-green' in inv) num = inv['ghost-green'];
        this.player.text_debug.setText(`${Math.floor(this.player.x)},${Math.floor(this.player.y)},${num}`);
        this.player.text_debug.x = this.player.x - TILE_SIZE;
        this.player.text_debug.y = this.player.y - TILE_SIZE * 2;

        this.cameras.main.centerOn(this.player.x, this.player.y);
    }
}

class PickupEntity extends Phaser.Physics.Matter.Sprite {
    constructor(world, scene, x, y, texture, bodyOptions) {
        super(world, x, y, texture, null, { plugin: bodyOptions });
        this.scene = scene;

        console.assert(texture in SPRITE_DATA, `Missing ${texture} in SPRITE_DATA dictionary`);

        this.setFriction(0, 0, 0);

        this.setBody({
            type: 'rectangle',
            width: TILE_SIZE - 2,
            height: TILE_SIZE - 2,
        });

        this.setDataEnabled();
        this.scene.add.existing(this);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.setAngularVelocity(0);
        this.setFixedRotation(0);
    }
}

// object creation factory to handle instantiation between scenes
// read in configuration data and instantiate Phaser objects each scene 
class ObjectFactory {
    static createPlayer(scene, world, config) {
        let player;

        let position = config.getData('position');
        player = new MovingEntity(world, scene, position.x, position.y, 'player', { isSensor: true });
        player.isPlayer = true;
        player.setCollisionCategory(scene.playerCollisionCategory);
        player.setCollidesWith([scene.enemiesCollisionCategory, scene.worldCollisionCategory, scene.pickupCollisionCategory, scene.portalCollisionCategory]);
        player.setDepth(100);

        player.positions = config.getData("positions");
        // player.positions['overworld'] = { x: 0, y: 0 };
        // player.positions['detailed1'] = { x: 0, y: 0 };
        // player.positions['detailed2'] = { x: 0, y: 0 };

        //debug
        player.text_debug = scene.add.text(player.x, player.y - TILE_SIZE, `${player.x}, ${player.y}`).setColor("#000");
        // player.x = player.positions['overworld'].x;
        // player.y = player.positions['overworld'].y;

        return player;
    }
    static createMovingEntity(scene, world, config) {
        let enemy;
        let position = config.getData('position');
        if (config.data.entity_id == 'ghost')
            enemy = new Ghost(world, scene, position.x, position.y, config.data.entity_id, null, { isSensor: true });
        else
            enemy = new Spider(world, scene, position.x, position.y, config.data.entity_id, null, { isSensor: true });

        enemy.setCollisionCategory(scene.enemiesCollisionCategory);
        enemy.setCollidesWith([scene.playerCollisionCategory, scene.bulletCollisionCategory, scene.worldCollisionCategory]);
        enemy.isEnemy = true;

        return enemy;
    }
    static createStaticEntity(scene, world, config) {
    }

    static createEntity(scene, world, config) {
        // let player = new Player();
        // player.setPosition(playerConfig.x, playerConfig.y);
        // player.setEquipment(playConfig.equipment);
        // return player;
    }

    static createMap(config) {

    }
}

class MovingEntity extends Phaser.Physics.Matter.Sprite {
    constructor(world, scene, x, y, texture, bodyOptions) {
        super(world, x, y, texture, null, { plugin: bodyOptions });

        this.scene = scene;

        console.assert(texture in SPRITE_DATA, `Missing ${texture} in SPRITE_DATA dictionary`);

        // this.play('eyes');
        this.setFriction(0, 0, 0);

        this.setBody({
            type: 'rectangle',
            width: TILE_SIZE - 2,
            height: TILE_SIZE - 2,
        });

        this.setDataEnabled();
        this.data.set('HP', SPRITE_DATA[texture].hp);
        this.data.set('maxHP', SPRITE_DATA[texture].hp);
        this.data.set('fire_cooldown', 0);
        this.data.set('fire_cooldown_max', SPRITE_DATA[texture].fire_cooldown_max);
        this.data.set('hurt_cooldown', 0);
        this.data.set('hurt_cooldown_max', SPRITE_DATA[texture].hurt_cooldown_max);
        this.data.set('speed', SPRITE_DATA[texture].speed);
        this.data.set('power', SPRITE_DATA[texture].power)

        this.data.set('inventory', {});

        // console.log(texture, this.data)

        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.scene.add.existing(this.bar);
        this.bar.setDepth(99);

        this.isBullet = false;
        this.isMovingEntity = true;

        // let fx = this.preFX.addGlow("0xff00ff");

        // this.scene.tweens.add({
        //     targets: fx,
        //     outerStrength: 50,
        //     yoyo: true,
        //     loop: -1,
        //     ease: 'sine.inout'
        // });

        this.scene.add.existing(this);
    }

    addItem(drop) {
        let inv = this.data.get('inventory');
        if (inv) {
            if (drop.texture.key in inv) {
                inv[drop.texture.key]++;
            } else {
                inv[drop.texture.key] = 1;
            }
        }
        this.data.set('inventory', inv);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.setAngularVelocity(0);
        this.setFixedRotation(0);

        let hc = this.data.get('hurt_cooldown');
        if (hc > 0) {
            this.setTint("0xff0000");
            hc--;
        } else if (hc == 0) {
            this.clearTint();
            hc--;
        }
        this.data.set('hurt_cooldown', hc);
    }

    heal(amt) {
        let hp = this.data.get('HP') + amt;
        hp = Math.min(hp, this.data.get('maxHP'));
        this.data.set('HP', hp);
    }

    damaged(dmg) {
        if (this.data.get('hurt_cooldown') <= 0) {
            this.data.set('hurt_cooldown', this.data.get('hurt_cooldown_max'));

            let hp = this.data.get('HP');
            hp -= dmg;
            hp = Math.max(0, hp);
            this.data.set('HP', hp);

            if (hp == 0) {
                this.die();
            }
        }
    }

    die() {
        this.setActive(false);
        this.setVisible(false);
        this.bar.destroy();
        this.world.remove(this.body, true);

        if (this.isPlayer) this.scene.scene.restart();

        if (this.isEnemy) {
            let inv = this.data.get('inventory');
            if (inv) {
                // for (let _inv of inv) {
                for (const [key, val] of Object.entries(inv)) {
                    if (key in SPRITE_DATA) {
                        if (Math.random() < SPRITE_DATA[key].drop_rate) {

                            // abstract
                            let drop = this.scene.matter.add.image(this.x, this.y, 'ghost-green', null, null);
                            drop.setCollisionCategory(this.scene.pickupCollisionCategory);
                            drop.setCollidesWith([this.scene.playerCollisionCategory]);
                            drop.setOnCollideWith(this.scene.player, pair => {
                                // Do something
                                // console.log('wowee')
                                this.scene.player.heal(SPRITE_DATA['hp-potion'].heal);
                                this.scene.player.addItem(drop);
                                drop.setActive(false);
                                drop.setVisible(false);
                                this.world.remove(drop, true);
                            });
                            // spawnItem(key, this.x, this.y);

                        }
                    }
                }
            }
        }
    }

    draw() {
        this.bar.clear();
        let perc = this.data.get('HP') / this.data.get('maxHP');

        let _x = this.x - HALF_TILE;
        let _y = this.y - TILE_SIZE;

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(_x, _y, TILE_SIZE, QUARTER_TILE);

        if (perc < 0.3) {
            this.bar.fillStyle(0xff0000);
        }
        else {
            this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(perc * TILE_SIZE - 4);
        this.bar.fillRect(_x + 2, _y + 1, d, QUARTER_TILE - 2);
    }
}

class Spider extends MovingEntity {//Phaser.Physics.Matter.Sprite {
    constructor(world, scene, x, y, texture, bodyOptions) {
        super(world, scene, x, y, texture, null, { plugin: bodyOptions });

        // this.setFrictionAir(0);
        this.scene.add.existing(this);

        const angle = Phaser.Math.Between(0, 360);
        const speed = Phaser.Math.FloatBetween(1, 3);

        this.setVelocityX(speed * Math.cos(angle));
        this.setVelocityY(speed * Math.sin(angle));

        let inv = this.data.get('inventory');
        if (texture == 'ghost')
            inv.push('ghost-leg');
        this.data.set('inventory', inv);

        this.states = {
            crawling: 0,
            towards: 1,
            away: 2,
        }
        this.data.set('state', this.states.crawling);
        this.data.set('next-state-timer', SPRITE_DATA['spider'].state_change_timeout);

        // this.text_debug = this.scene.add.text(this.x, this.y - TILE_SIZE, `${this.data.get('state')}`).setColor("#ff00ff");
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // go towards player
        if (this.data.get('state') == this.states.towards) {
            const dist = Math.sqrt((this.body.position.x - this.scene.player.x) ** 2 + (this.body.position.y - this.scene.player.y) ** 2);
            if (dist < 520) {
                if (this.body.position.x < this.scene.player.body.position.x)
                    this.setVelocityX(0.5)
                else
                    this.setVelocityX(-0.5)
                if (this.body.position.y < this.scene.player.body.position.y)
                    this.setVelocityY(0.5)
                else
                    this.setVelocityY(-0.5)
            }
        } else if (this.data.get('state') == this.states.away) {
            const dist = Math.sqrt((this.body.position.x - this.scene.player.x) ** 2 + (this.body.position.y - this.scene.player.y) ** 2);
            if (dist < 220) {
                if (this.body.position.x < this.scene.player.body.position.x)
                    this.setVelocityX(-0.7)
                else
                    this.setVelocityX(0.7)
                if (this.body.position.y < this.scene.player.body.position.y)
                    this.setVelocityY(-0.7)
                else
                    this.setVelocityY(0.7)
            }
        } else {
            if (Math.random() > 0.9) {
                this.setVelocityX(Phaser.Math.FloatBetween(-2, 2))
                this.setVelocityY(Phaser.Math.FloatBetween(-2, 2))
            }
        }

        let timer = this.data.get('next-state-timer');
        timer--;
        if (timer == 0) {
            let state = this.data.get('state');
            state++;
            if (state > Object.keys(this.states).length - 1) state = 0;
            this.data.set('state', state);
            timer = SPRITE_DATA['spider'].state_change_timeout;
        }
        this.data.set('next-state-timer', timer);

        // this.text_debug.setText(`${this.data.get('state')}:${this.data.get('next-state-timer')}`);
        // this.text_debug.x = this.x;
        // this.text_debug.y = this.y+TILE_SIZE;

        this.setAngularVelocity(0);
    }
}
class Ghost extends MovingEntity {//Phaser.Physics.Matter.Sprite {
    constructor(world, scene, x, y, texture, bodyOptions) {
        super(world, scene, x, y, texture, null, { plugin: bodyOptions });

        // this.setFrictionAir(0);
        this.scene.add.existing(this);

        const angle = Phaser.Math.Between(0, 360);
        const speed = Phaser.Math.FloatBetween(1, 3);

        this.setVelocityX(speed * Math.cos(angle));
        this.setVelocityY(speed * Math.sin(angle));

        // blarg
        let inv = this.data.get('inventory');
        if (texture == 'ghost') {
            if ('ghost-leg' in inv) {
                inv['ghost-leg']++;
            } else {
                inv['ghost-leg'] = 1;
            }
            // inv.push('ghost-leg');
        }
        this.data.set('inventory', inv);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        const dist = Math.sqrt((this.body.position.x - this.scene.player.x) ** 2 + (this.body.position.y - this.scene.player.y) ** 2);
        if (dist < 120) {
            if (this.body.position.x < this.scene.player.body.position.x)
                this.setVelocityX(0.5)
            else
                this.setVelocityX(-0.5)
            if (this.body.position.y < this.scene.player.body.position.y)
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

        this.setBody({
            type: 'rectangle',
            width: TILE_SIZE - 4,
            height: TILE_SIZE - 4,
        });

        this.power = 1;
        this.isBullet = true;

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