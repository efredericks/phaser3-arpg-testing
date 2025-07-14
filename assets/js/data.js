// consts
const SPRITE_DATA = {
    // moving entities
    'player': { hp: 10, defense: 1, speed: 3, fire_cooldown_max: 10, hurt_cooldown_max: 30, power: 1 },
    'ghost': { hp: 3, defense: 1, speed: 1, fire_cooldown_max: 20, hurt_cooldown_max: 10, power: 1 },
    'spider': { hp: 2, defense: 1, speed: 3, fire_cooldown_max: 0, hurt_cooldown_max: 10, power: 2, state_change_timeout: 60 },
    // consumables
    'hp-potion': { heal: 5 },
    // pickups
    'ghost-leg': { drop_rate: 0.8 },
};

const MAP_DATA = {
    //42 stones
    //48 blank
    //49 dots
    //14 wall
    //33 open door
    WALKABLE: [42, 48, 49, 33],
    BLOCKING: [14, 36, 37, 38],
    NUM_ROWS: 100,
    NUM_COLS: 100,
}

const DIRECTIONS = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [0, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
];

const MAX_ENEMIES_PER_ROOM = 100;
const TWO_PI = Math.PI * 2.;
const HALF_PI = Math.PI / 2.;
const QUARTER_PI = Math.PI / 4.;
const EIGHTH_PI = Math.PI / 8.;
const TILE_SIZE = 16;
const HALF_TILE = TILE_SIZE / 2;
const QUARTER_TILE = TILE_SIZE / 4;

// DATA-RELATED FUNCTIONS - we'll keep them separated from the Phaser physics objects for now
// only storing things that will change over time
// move to localStorage eventually
// NOT IMPLEMENTED IN MAIN YET!
class EntityData {
    constructor(entity_id) {
        this.data = {};

        // things all entities have
        this.data.entity_id = entity_id;
        this.data.position = { x: -1, y: -1 };
        this.data.positions = {};
        this.data.inventory = {};
        this.data.components = {};
    }

    setData(key, val) {
        this.data[key] = val;
    }
    getData(key) {
        if (key in this.data) return this.data[key];
        else console.error(`Missing key in Entity dictionary [${key}]`);
    }
};

// are these needed...
// class MovingEntityData extends EntityData {
//     constructor(key) {
//         super(key);
//     }
// }
// class StaticEntityData extends EntityData {
//     constructor(key) {
//         super(key);
//     }
// }

// class PlayerData extends MovingEntityData {
class PlayerData extends EntityData {
    constructor(Phaser) {
        super('player');

        let sd = getSpriteData('player');
        let fc = new FighterComponent(sd.hp, sd.defense, sd.speed, sd.power);
        let wc = new WeaponComponent('base');

        this.setData('components', { 'FighterComponent': fc, 'WeaponComponent': wc });
        this.setData('position', getValidPosition(Phaser, 'overworld'));
    }
}

// class EnemyData extends MovingEntityData {
class EnemyData extends EntityData {
    constructor(Phaser, key) {
        super(key);

        let sd = getSpriteData(key);
        let fc = new FighterComponent(sd.hp, sd.defense, sd.speed, sd.power);
        this.setData('components', { 'FighterComponent': fc });
        this.setData('position', getValidPosition(Phaser, 'overworld'));
    }
}

class FighterComponent {
    constructor(hp, def, speed, power) {
        this.hp = hp;
        this.def = def;
        this.speed = speed;
        this.power = power;
    }
}

// weapon separate from fighter 
class WeaponComponent {
    constructor(type) {//}, power) {
        this.type = type;
        // this.power = power; // just use base power for now
    }
}

class NPCComponent {
    constructor(name) {
        // setup a data object for this
        this.is_quest_giver = false;
        this.random_chatter = [];
        this.quest_chatter = [];
    }
}
let game_data = {};
// setupAllData();

function getValidPosition(Phaser, key) {
    let oc = Phaser.Math.RND.pick(game_data.levels[key].open_cells);
    return { x: oc.c * TILE_SIZE + HALF_TILE, y: oc.r * TILE_SIZE + HALF_TILE };
}

function setupAllData(Phaser) {
    // level data inc. items
    game_data.levels = {};
    game_data.levels.overworld = generateOverworld(Phaser);
    game_data.levels.detailed = generateDetailed(Phaser);

    // entity data
    game_data.player = new PlayerData(Phaser);

    game_data.enemies = [];
    for (let _ = 0; _ < 20; _++)
        game_data.enemies.push(new EnemyData(Phaser, 'ghost'));

    console.log(game_data)
}

function getSpriteData(key) {
    if (key in SPRITE_DATA) {
        return SPRITE_DATA[key];
    } else {
        console.error(`Error looking up ${key} in SPRITE_DATA`);
    }
}

function generateOverworld(Phaser) {
    // generateWorld(t = "random") {
    let level = [];
    let open_cells = [];

    let t = "random";
    // let t = "cellular";

    if (t == "random") {
        for (let r = 0; r < MAP_DATA.NUM_ROWS; r++) {
            let row = [];
            for (let c = 0; c < MAP_DATA.NUM_COLS; c++) {
                let ch = 0;
                if (r == 0 || c == 0 || r == MAP_DATA.NUM_ROWS - 1 || c == MAP_DATA.NUM_COLS - 1)
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
                if (MAP_DATA.WALKABLE.indexOf(ch) >= 0) {
                    open_cells.push({ r: r, c: c })
                }

                row.push(ch);
            }
            level.push(row);
        }
    } else {
        // let map = new ROT.Map.EllerMaze(MAP_DATA.NUM_COLS, MAP_DATA.NUM_ROWS);

        let map;

        if (t == "bsp") {
            map = new ROT.Map.Digger(MAP_DATA.NUM_COLS, MAP_DATA.NUM_ROWS, {
                roomWidth: [5, 20],
                roomHeight: [5, 20],
                corridorLength: [5, 20],
                dugPercentage: 0.4,

            });
        } else if (t == "cellular") {
            map = new ROT.Map.Cellular(MAP_DATA.NUM_COLS, MAP_DATA.NUM_ROWS);
            map.randomize(0.5);
            for (let i = 0; i < 50; i++) map.create();
            map.connect(null, 0, function (from, to) {
                // console.log(from,to)
            });
        } else { // arena
            map = new ROT.Map.Arena(MAP_DATA.NUM_COLS, MAP_DATA.NUM_ROWS);
        }

        for (let r = 0; r < MAP_DATA.NUM_ROWS; r++) {
            let row = [];
            for (let c = 0; c < MAP_DATA.NUM_COLS; c++) {
                row.push(-1);
            }
            level.push(row);
        }
        let mapcb = function (x, y, val) {
            // console.log(x, y, val);
            let ch = val;
            if (val == 1 || (x == 0 || y == 0 || x == MAP_DATA.NUM_COLS - 1 || y == MAP_DATA.NUM_ROWS - 1)) ch = 0;
            else {
                if (t == "arena") {
                    let r = Math.random();
                    if (r < 0.9) ch = 48;
                    else if (r < 0.95) ch = 49;
                    else if (r < 0.97) ch = 14;
                    else ch = 42;
                } else {
                    ch = 48;
                }
            }
            level[y][x] = ch;

            if (ch != 0 && MAP_DATA.WALKABLE.indexOf(ch) >= 0)
                open_cells.push({ c: x, r: y });
        }
        map.create(mapcb);

        // post process to minimize colliding entities
        for (let r = 0; r < MAP_DATA.NUM_ROWS; r++) {
            for (let c = 0; c < MAP_DATA.NUM_COLS; c++) {
                if (MAP_DATA.WALKABLE.indexOf(level[r][c]) >= 0) {
                    for (let d of DIRECTIONS) {
                        let next = { c: c + d[0], r: r + d[1] };

                        if (next.c >= 0 && next.c <= MAP_DATA.NUM_COLS - 1 && next.r >= 0 && next.r <= MAP_DATA.NUM_ROWS - 1) {
                            if (level[next.r][next.c] == 0) level[next.r][next.c] = 14;
                        }
                    }
                }
            }
        }
        console.log(level)
    }

    // carve out a town?
    let oc = Phaser.Math.RND.pick(open_cells); // center point of area
    while (oc.c < 10 || oc.c > MAP_DATA.NUM_COLS - 11 || oc.r < 10 || oc.r > MAP_DATA.NUM_ROWS - 11) {
        oc = Phaser.Math.RND.pick(open_cells); // center point of area
    }
    level[oc.r][oc.c] = 33;
    let tlc = oc.c - 3;
    let tlr = oc.r - 6;
    for (let r = tlr; r <= tlr + 6; r++) {
        for (let c = tlc; c <= tlc + 6; c++) {
            if (r != oc.r || c != oc.c) {
                if (r == tlr || r == tlr + 6 || c == tlc || c == tlc + 6)
                    if (c == tlc)
                        level[r][c] = 36;
                    else if (c == tlc + 6)
                        level[r][c] = 38;
                    else
                        level[r][c] = 37;
                else
                    level[r][c] = 0;
            }
        }
    }
    for (let c = tlc - 1; c <= tlc + 7; c++) {
        level[oc.r + 1][c] = 0;
        level[oc.r - 7][c] = 0;
    }
    for (let r = tlr - 1; r <= tlr + 7; r++) {
        level[r][tlc - 1] = 0;
        level[r][tlc + 7] = 0;
    }
    // level[oc.r - 3][oc.c] = 33;
    let portals = [];
    // const portal = this.matter.add.image(oc.c * TILE_SIZE + HALF_TILE, (oc.r - 3) * TILE_SIZE + HALF_TILE, 'ouch', null, null).setStatic(true);
    // portal.label = "portal";
    // portal.portal_id = "1";
    // portal.setDepth(98);
    // portal.setCollisionCategory(this.portalCollisionCategory);
    // portal.setCollidesWith([this.wizardCollisionCategory]);
    // let portal_level = [];
    // for (let r = 0; r < 10; r++) {
    //     let row = [];
    //     for (let c = 0; c < 10; c++) {
    //         let ch = 0;
    //         if (c == 0 || r == 0 || c == 9 || r == 9) ch = 14;
    //         row.push(ch);
    //     }
    //     portal_level.push(row);
    // }
    // portals.push({ portal: portal, portal_id: 1, level: portal_level });

    // const portal2 = this.matter.add.image(oc.c * TILE_SIZE + HALF_TILE, (oc.r - 5) * TILE_SIZE + HALF_TILE, 'ouch', null, null).setStatic(true);
    // portal2.label = "portal";
    // portal2.portal_id = "2";
    // portal2.setDepth(98);
    // portal2.setCollisionCategory(this.portalCollisionCategory);
    // portal2.setCollidesWith([this.wizardCollisionCategory]);
    // let portal2_level = [];
    // for (let r = 0; r < 10; r++) {
    //     let row = [];
    //     for (let c = 0; c < 10; c++) {
    //         let ch = 0;
    //         if (c == 0 || r == 0 || c == 9 || r == 9) ch = 14;
    //         else {
    //             if (Math.random() > 0.8) ch = 14;
    //         }
    //         row.push(ch);
    //     }
    //     portal2_level.push(row);
    // }
    // portals.push({ portal: portal2, portal_id: 2, level: portal2_level });

    // this.scene.add(`exploratoriumDetailed_${1}`, exploratoriumDetailed, false);
    // this.scene.add(`exploratoriumDetailed_${2}`, exploratoriumDetailed, false);


    // console.log('Door:', oc.c * TILE_SIZE, oc.r * TILE_SIZE)

    return { level: level, open_cells: open_cells, door: oc, portals: portals };

}

function generateDetailed(Phaser) {

}