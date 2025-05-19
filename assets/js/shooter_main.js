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
    }

    create() {
        this.anims.create({
            key: "sprWater",
            frames: this.anims.generateFrameNumbers("sprWater"),
            frameRate: 5,
            repeat: -1
        });

        this.cameraSpeed = 10;
        this.cameras.main.setZoom(2);
        this.cameras.main.setBackgroundColor(0x1D1923);


        this.player = this.physics.add.sprite(10, 10, 'sprGrass');
        this.player.setBounce(0.2);
        this.player.setDepth(99);
        this.player.setCollideWorldBounds(true);

        this.player.bullets = new Bullets(this);

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    collision_cb(a, b) {
        // console.log(a,b);
    }

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
        if (this.cursors.left.isDown) {
            this.player.bullets.fireBullet(this.player.x, this.player.y, -1, 0);
        }
        else if (this.cursors.right.isDown) {
            this.player.bullets.fireBullet(this.player.x, this.player.y, 1, 0);
        }
        if (this.cursors.up.isDown) {
            this.player.bullets.fireBullet(this.player.x, this.player.y, 0, -1);
        }
        else if (this.cursors.down.isDown) {
            this.player.bullets.fireBullet(this.player.x, this.player.y, 0, 1);
        }


        // center camera
        this.cameras.main.centerOn(this.player.x, this.player.y);
        // this.player.x = this.followPoint.x;
        // this.player.y = this.followPoint.y;
    }
}

class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
        this.speed = 300;
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
