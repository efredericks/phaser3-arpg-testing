class shooterMain extends Phaser.Scene {
    constructor() {
        super({ key: "shooterMain" });
    }

    preload() {
        this.load.spritesheet("sprWater", "assets/img/sprWater.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image("sprSand", "assets/img/sprSand.png");
        this.load.image("sprGrass", "assets/img/sprGrass.png");
        this.load.image("bullet", "assets/img/kenney_rpg-urban-pack/Tiles/tile_0060.png");

        this.load.image("wizard", "assets/img/kenney_tiny-dungeon/Tiles/tile_0084.png");
        this.load.image("ghost", "assets/img/kenney_tiny-dungeon/Tiles/tile_0121.png");
    }

    create() {
        this.anims.create({
            key: "sprWater",
            frames: this.anims.generateFrameNumbers("sprWater"),
            frameRate: 5,
            repeat: -1
        });

        this.cameraSpeed = 10;
        this.cameras.main.setZoom(1);
        this.cameras.main.setBackgroundColor(0x1D1923);


        this.player = this.physics.add.sprite(10, 10, 'wizard');
        this.player.setBounce(0.2);
        this.player.setDepth(99);
        // this.player.setCollideWorldBounds(true);
        this.player.health = 10;
        this.player.fire_cooldown = 0;

        this.enemies = this.physics.add.group({ key: 'ghost', frame: 0, repeat: 53, health: 500 });
        // this.enemies = this.grp_enemies.getChildren();
        Phaser.Actions.GridAlign(this.enemies.getChildren(), { width: 9, cellWidth: 58, cellHeight: 48, x: 0, y: 0 });

        for (let e of this.enemies.getChildren()) {
            e.health = 5;
            e.pushback = -1;
            e.pushspeed = 50;
        }

        // for (let i = 0; i < 5; i++) {
        //     let e = this.physics.add.sprite(i * 10 + 20, 0, 'sprSand');
        //     this.enemies.add(e);
        // }

        // Add 2 groups for Bullet objects
        this.playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });


        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    // collision_cb(a, b) {
    //     // console.log(a,b);
    // }

    // bulletHit(a, b) {
    // }

    update() {
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

        // fire keys
        if (this.player.fire_cooldown == 0) {
            if (this.cursors.left.isDown) {
                // this.player.bullets.fireBullet(this.player.x, this.player.y, -1, 0);
                this.fireBullet(this.player, -1, 0);
            }
            else if (this.cursors.right.isDown) {
                // this.player.bullets.fireBullet(this.player.x, this.player.y, 1, 0);
                this.fireBullet(this.player, 1, 0);
            }
            if (this.cursors.up.isDown) {
                // this.player.bullets.fireBullet(this.player.x, this.player.y, 0, -1);
                this.fireBullet(this.player, 0, -1);
            }
            else if (this.cursors.down.isDown) {
                // this.player.bullets.fireBullet(this.player.x, this.player.y, 0, 1);
                this.fireBullet(this.player, 0, 1);
            }
        } else {
            this.player.fire_cooldown--;
        }


        // center camera
        this.cameras.main.centerOn(this.player.x, this.player.y);
        // this.player.x = this.followPoint.x;
        // this.player.y = this.followPoint.y;

        for (let e of this.enemies.getChildren()) {
            if (e.pushback > 0) {
                e.pushback--;
            } else if (e.pushback == 0) {
                e.pushback--;
                e.setVelocity(0, 0);
            }

        }
    }
    fireBullet(e, vx, vy) {
        let grp;
        let other;
        if (e === this.player) {
            grp = this.playerBullets;
            other = this.enemies;
        }
        else {
            grp = this.enemyBullets;
            other = this.player;
        }
        e.fire_cooldown = 10;

        // Get bullet from bullets group
        const bullet = grp.get().setActive(true).setVisible(true);

        if (bullet) {
            bullet.fire(e, vx, vy);//this.reticle);
            this.physics.add.collider(other, bullet, (_bullet, _entity) => this.entityHitCallback(_bullet, _entity));
        }
    }

    entityHitCallback(_bullet, _entity) {
        if (_entity.active === true && _bullet.active === true) {
            _bullet.setActive(false).setVisible(false);

            _entity.pushback = 5;
            _entity.setVelocity(_bullet.vx * _entity.pushspeed, _bullet.vy * _entity.pushspeed);

            _entity.health--;
            if (_entity.health <= 0) {
                _entity.setActive(false).setVisible(false);
            }
        }
    }
    // enemyHitCallback(enemyHit, bulletHit) {
    //     // Reduce health of enemy
    //     if (bulletHit.active === true && enemyHit.active === true) {
    //         // enemyHit.health = enemyHit.health - 1;
    //         // console.log('Enemy hp: ', enemyHit.health);

    //         // // Kill enemy if health <= 0
    //         // if (enemyHit.health <= 0) {
    //         //     enemyHit.setActive(false).setVisible(false);
    //         // }

    //         // Destroy bullet
    //         bulletHit.setActive(false).setVisible(false);
    //     }
    // }

    // playerHitCallback(playerHit, bulletHit) {
    //     // Reduce health of player
    //     if (bulletHit.active === true && playerHit.active === true) {
    //         // playerHit.health = playerHit.health - 1;
    //         // console.log('Player hp: ', playerHit.health);

    //         // // Kill hp sprites and kill player if health <= 0
    //         // if (playerHit.health === 2) {
    //         //     this.hp3.destroy();
    //         // }
    //         // else if (playerHit.health === 1) {
    //         //     this.hp2.destroy();
    //         // }
    //         // else {
    //         //     this.hp1.destroy();

    //         //     // Game over state should execute here
    //         // }

    //         // Destroy bullet
    //         bulletHit.setActive(false).setVisible(false);
    //     }
    // }

}


/*
class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
        this.speed = 300;
        // console.log(this.scene.player);
    }

    fire(x, y, vx, vy) {
        this.body.reset(x, y);

        this.lifetime = 20;

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityX(vx * this.speed);
        this.setVelocityY(vy * this.speed);

        // console.log(vx, vy, this.speed)
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this.lifetime--;
        // if (this.y <= -32 || this.x <= -32 || this.x > 500 || this.y > 500) {
        if (this.lifetime <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

class Bullets extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 5,
            key: 'bullet',
            active: false,
            visible: false,
            classType: Bullet
        });
    }

    fireBullet(x, y, vx, vy) {
        const bullet = this.getFirstDead(false);

        if (bullet) {
            bullet.fire(x, y, vx, vy);
        }
    }
}
*/

class Bullet extends Phaser.GameObjects.Image {
    constructor(scene) {
        super(scene, 0, 0, 'bullet');
        this.speed = 0.15;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
        this.vx = 0;
        this.vy = 0;
    }

    fire(shooter, vx, vy) {//target) {
        this.setPosition(shooter.x + (vx * shooter.width * 1.25), shooter.y + (vy * shooter.height * 1.25)); // Initial position

        console.log(shooter.body.velocity)

        this.vx = vx;
        this.vy = vy;

        this.xSpeed =  (shooter.body.velocity.x * 0.0001) + this.speed * vx;
        this.ySpeed =  (shooter.body.velocity.y * 0.0001) + this.speed * vy;
        // this.direction = Math.atan((target.x - this.x) / (target.y - this.y));

        // // Calculate X and y velocity of bullet to moves it from shooter to target
        // if (target.y >= this.y) {
        //     this.xSpeed = this.speed * Math.sin(this.direction);
        //     this.ySpeed = this.speed * Math.cos(this.direction);
        // }
        // else {
        //     this.xSpeed = -this.speed * Math.sin(this.direction);
        //     this.ySpeed = -this.speed * Math.cos(this.direction);
        // }

        // this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    }

    update(time, delta) {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}
