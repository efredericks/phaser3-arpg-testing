var config = {
    type: Phaser.WEBGL,

    width: 600,
    height: 600,
    zoom: 1,

    backgroundColor: "black",
    physics: {
        default: "matter",
        matter: {
            debug: true,
        }
        // default: "arcade",
        // arcade: {
        //     Gravity: { x: 0, y: 0 }
        // }
    },
    scene: [
        matterShooterMain
        // shooterMain
        // endlessMain
    ],
    pixelArt: true,
    roundPixels: true,

    overlapBias: 32,

    // debug: true,
    // debugShowBody: true,
    // debugShowStaticBody: true,


};

var game = new Phaser.Game(config);
// still getting pushed through - tried 32 and 64
// game.physics.arcade.TILE_BIAS = 32;