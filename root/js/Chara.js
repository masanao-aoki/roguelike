/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Settings_1 = __webpack_require__(2);
	var Dungeon_1 = __webpack_require__(3);
	// キャラクター
	var Chara = (function () {
	    function Chara(mapX, mapY, key, hp, name) {
	        this.hp = hp;
	        this.name = name;
	        var sprite = new Sprite(Settings_1.CharaSettings.WIDTH, Settings_1.CharaSettings.HEIGHT);
	        sprite.frame = 0;
	        this.sprite = sprite;
	        this.setMapPos(mapX, mapY);
	        this.key = key;
	        this.vx = this.vy = 0;
	        this.isMoving = false;
	        this.direction = 0;
	        this.counter = 0;
	        this.motion = this.walkMotion;
	    }
	    // 歩く動き
	    Chara.prototype.walkMotion = function (frame) {
	        if (frame % 3 == 0) {
	            this.counter++;
	            this.counter %= 4;
	        }
	        // 0, 1, 2, 1...という順になるように
	        this.sprite.frame = this.direction * 3 + (Math.floor(this.counter / 3) + this.counter % 3);
	    };
	    // 剣を振る動き
	    Chara.prototype.slashMotion = function (frame) {
	        this.sprite.frame = this.direction * 3 + this.counter;
	        if (frame % 3 == 0) {
	            this.counter++;
	            this.counter %= 3;
	        }
	    };
	    Chara.prototype.dir2v = function (dir) {
	        var vx = 0;
	        var vy = 0;
	        if (dir == Chara.WEST || dir == Chara.UPPER_LEFT || dir == Chara.LOWER_LEFT)
	            vx = -1;
	        if (dir == Chara.EAST || dir == Chara.UPPER_RIGHT || dir == Chara.LOWER_RIGHT)
	            vx = 1;
	        if (dir == Chara.NORTH || dir == Chara.UPPER_LEFT || dir == Chara.UPPER_RIGHT)
	            vy = -1;
	        if (dir == Chara.SOUTH || dir == Chara.LOWER_LEFT || dir == Chara.LOWER_RIGHT)
	            vy = 1;
	        return new Dungeon_1.Point(vx, vy);
	    };
	    Chara.prototype.front = function (dir) {
	        var point = this.dir2v(dir);
	        point.x = this.sprite.x + (Settings_1.Settings.CHIP_WIDTH / 2) + (point.x * Settings_1.Settings.CHIP_WIDTH);
	        point.y = this.sprite.y + Settings_1.Settings.CHIP_HEIGHT + (point.y * Settings_1.Settings.CHIP_HEIGHT);
	        return point;
	    };
	    Chara.prototype.damage = function (num) {
	        this.hp -= num;
	    };
	    // 次のフレームから歩き出す
	    Chara.prototype.setMove = function (map, dir) {
	        var point = this.dir2v(dir);
	        this.vx = point.x * Settings_1.Settings.MOVE_SPEED;
	        this.vy = point.y * Settings_1.Settings.MOVE_SPEED;
	        var nowX = this.sprite.x + (Settings_1.Settings.CHIP_WIDTH / 2);
	        var nowY = this.sprite.y + Settings_1.Settings.CHIP_HEIGHT;
	        var x = nowX + (point.x * Settings_1.Settings.CHIP_WIDTH);
	        var y = nowY + (point.y * Settings_1.Settings.CHIP_HEIGHT);
	        map.setCollision(nowX, nowY, 0); // 移動元を通行可に
	        map.setCollision(x, y, 1); // 移動先を通行不可に
	    };
	    Chara.prototype.moveBy = function (vx, vy) {
	        this.sprite.moveBy(vx, vy);
	    };
	    Chara.prototype.setMapPos = function (mapX, mapY) {
	        this.sprite.x = mapX * Settings_1.Settings.CHIP_WIDTH - (Settings_1.Settings.CHIP_WIDTH / 2);
	        this.sprite.y = mapY * Settings_1.Settings.CHIP_HEIGHT - Settings_1.Settings.CHIP_HEIGHT;
	    };
	    Chara.prototype.getFrontPos = function (dir) {
	        var point = this.front(dir);
	        return new Dungeon_1.Point(point.x / Settings_1.Settings.CHIP_WIDTH, point.y / Settings_1.Settings.CHIP_HEIGHT);
	    };
	    Chara.prototype.getMapPos = function () {
	        return new Dungeon_1.Point((this.sprite.x + Settings_1.Settings.CHIP_WIDTH / 2) / Settings_1.Settings.CHIP_WIDTH, (this.sprite.y + Settings_1.Settings.CHIP_HEIGHT) / Settings_1.Settings.CHIP_HEIGHT);
	    };
	    // x, yとも16で割り切れる場所にいるか
	    Chara.prototype.divisible = function () {
	        return (this.sprite.x + Settings_1.Settings.CHIP_WIDTH / 2) % Settings_1.Settings.CHIP_WIDTH == 0 && this.sprite.y % Settings_1.Settings.CHIP_HEIGHT == 0;
	    };
	    // ※デバッグ用
	    Chara.prototype.showPos = function () {
	        return "(" + this.sprite.x + "," + this.sprite.y + ")" +
	            ((this.sprite.x + 8) % 16 == 0 && this.sprite.y % 16 == 0 ? "true" : "false");
	    };
	    Chara.SOUTH = 0;
	    Chara.WEST = 1;
	    Chara.EAST = 2;
	    Chara.NORTH = 3;
	    Chara.LOWER_LEFT = 4;
	    Chara.UPPER_LEFT = 5;
	    Chara.UPPER_RIGHT = 7;
	    Chara.LOWER_RIGHT = 6;
	    return Chara;
	}());
	exports.Chara = Chara;
	// プレイヤー(剣士)
	var Player = (function (_super) {
	    __extends(Player, _super);
	    function Player(mapX, mapY, game, key, name) {
	        _super.call(this, mapX, mapY, key, 1, name);
	        console.log(Settings_1.Image.PLAYER);
	        var image = game.assets[Settings_1.Image.PLAYER];
	        this.walkImage = new Surface(96 * 2, 128 * 4);
	        this.walkImage.draw(image, 0, 0, 96 * 2, 128 * 4, 0, 0, 96 * 2, 128 * 4);
	        this.slashImage = new Surface(96 * 2, 128 * 2);
	        this.slashImage.draw(image, 0, 0, 96 * 2, 128 * 4, 0, 0, 96 * 2, 128 * 4);
	        this.setWalkMotion();
	    }
	    Player.prototype.setWalkMotion = function () {
	        this.sprite.image = this.walkImage;
	        this.motion = this.walkMotion;
	        this.counter = 0;
	    };
	    Player.prototype.setSlashMotion = function () {
	        this.sprite.image = this.slashImage;
	        this.motion = this.slashMotion;
	        this.counter = 0;
	    };
	    return Player;
	}(Chara));
	exports.Player = Player;
	// 敵
	var Enemy = (function (_super) {
	    __extends(Enemy, _super);
	    function Enemy(mapX, mapY, key, hp, name) {
	        _super.call(this, mapX, mapY, key, hp, name);
	    }
	    return Enemy;
	}(Chara));
	// スライム型の敵
	var Slime = (function (_super) {
	    __extends(Slime, _super);
	    function Slime(mapX, mapY, key, game) {
	        _super.call(this, mapX, mapY, key, Slime.HP, Slime.NAME);
	        var surface = new Surface(96 * 2, 128 * 2);
	        surface.draw(game.assets[Slime.IMAGE], 0, 0, 96 * 2, 128 * 2, 0, 0, 96 * 2, 128 * 2);
	        this.sprite.image = surface;
	    }
	    Slime.HP = 1;
	    Slime.NAME = 'スライム';
	    Slime.IMAGE = Settings_1.Image.CHARA6_GIF;
	    return Slime;
	}(Enemy));
	// 魔法使い型の敵
	var Mage = (function (_super) {
	    __extends(Mage, _super);
	    function Mage(mapX, mapY, key, game) {
	        _super.call(this, mapX, mapY, key, Mage.HP, Mage.NAME);
	        var surface = new Surface(96 * 2, 128 * 2);
	        surface.draw(game.assets[Settings_1.Image.CHARA6_GIF], 96 * 2, 0, 96 * 2, 128 * 2, 0, 0, 96 * 2, 128 * 2);
	        this.sprite.image = surface;
	    }
	    Mage.HP = 2;
	    Mage.NAME = '魔法使い';
	    Mage.IMAGE = Settings_1.Image.CHARA6_GIF;
	    return Mage;
	}(Enemy));
	// 黒い剣士型の敵
	var Knight = (function (_super) {
	    __extends(Knight, _super);
	    function Knight(mapX, mapY, key, game) {
	        _super.call(this, mapX, mapY, key, Knight.HP, Knight.NAME);
	        var surface = new Surface(96 * 2, 128 * 2);
	        surface.draw(game.assets[Knight.IMAGE], 0, 0, 96 * 2, 128 * 2, 0, 0, 96 * 2, 128 * 2);
	        this.sprite.image = surface;
	    }
	    Knight.HP = 1;
	    Knight.NAME = '黒い剣士';
	    Knight.IMAGE = Settings_1.Image.CHARA7_GIF;
	    return Knight;
	}(Enemy));
	// キャラを一斉に動かすクラス
	var Puppeteer = (function () {
	    function Puppeteer(game, group, map) {
	        var pos = map.randomPos();
	        this.player = new Player(pos.x, pos.y, game, 'player', 'プレイヤー');
	        map.setCollision(pos.x * Settings_1.Settings.CHIP_WIDTH, pos.y * Settings_1.Settings.CHIP_HEIGHT, 1); // キャラのいる位置を移動不可に
	        this.charas = [];
	        this.charas.push(this.player);
	        this.counter = 0;
	        group.addChild(this.player.sprite);
	        this.group = group;
	    }
	    // 敵発生
	    Puppeteer.prototype.spawn = function (game, map, id) {
	        var mapPos = map.randomPos();
	        var enemy;
	        var key;
	        if (id == 0) {
	            key = "slime" + (this.counter++);
	            enemy = new Slime(mapPos.x, mapPos.y, key, game);
	        }
	        else if (id == 1) {
	            key = "mage" + (this.counter++);
	            enemy = new Mage(mapPos.x, mapPos.y, key, game);
	        }
	        else if (id == 2) {
	            key = "knight" + (this.counter++);
	            enemy = new Knight(mapPos.x, mapPos.y, key, game);
	        }
	        else {
	            console.log("Undefined enemy: id=" + id);
	            return;
	        }
	        map.setCollision(mapPos.x * Settings_1.Settings.CHIP_WIDTH, mapPos.y * Settings_1.Settings.CHIP_HEIGHT, 1); // キャラのいる位置を移動不可に
	        this.charas.push(enemy);
	        this.group.addChild(enemy.sprite);
	    };
	    Puppeteer.prototype.getChara = function (x, y) {
	        var chara = _.filter(this.charas, function (chara) {
	            return chara.sprite.x + Settings_1.Settings.CHIP_WIDTH / 2 == x && chara.sprite.y + Settings_1.Settings.CHIP_HEIGHT == y;
	        });
	        return chara.length === 1 ? chara[0] : null;
	    };
	    Puppeteer.prototype.terminate = function (map, chara) {
	        map.setCollision(chara.sprite.x + Settings_1.Settings.CHIP_WIDTH / 2, chara.sprite.y + Settings_1.Settings.CHIP_HEIGHT, 0); // キャラのいる位置を移動可に
	        this.group.removeChild(chara.sprite);
	        this.charas = _.filter(this.charas, function (c) {
	            return c.key !== chara.key;
	        });
	    };
	    Puppeteer.prototype.motion = function (frame) {
	        this.charas.forEach(function (chara) {
	            chara.motion(frame);
	        });
	    };
	    Puppeteer.prototype.move = function (map) {
	        this.charas.forEach(function (chara) {
	            chara.moveBy(chara.vx, chara.vy);
	            if (chara.divisible()) {
	                chara.setMove(map, -1);
	            }
	        });
	    };
	    Puppeteer.prototype.setMoveEnemy = function (map, pos) {
	        var _this = this;
	        if (pos === void 0) { pos = this.player.getMapPos(); }
	        var enemys = _.filter(this.charas, function (chara) { return chara.key !== _this.player.key; });
	        enemys.forEach(function (chara) {
	            var move = 0;
	            var isEast = chara.getMapPos().x < pos.x;
	            var isWest = chara.getMapPos().x > pos.x;
	            var isSouth = chara.getMapPos().y < pos.y;
	            var isNorth = chara.getMapPos().y > pos.y;
	            if (isEast && isSouth)
	                move = Chara.LOWER_RIGHT;
	            else if (isEast && isNorth)
	                move = Chara.UPPER_RIGHT;
	            else if (isWest && isSouth)
	                move = Chara.LOWER_LEFT;
	            else if (isWest && isNorth)
	                move = Chara.UPPER_LEFT;
	            else if (isEast)
	                move = Chara.EAST;
	            else if (isWest)
	                move = Chara.WEST;
	            else if (isSouth)
	                move = Chara.SOUTH;
	            else if (isNorth)
	                move = Chara.NORTH;
	            var dir = move;
	            chara.direction = dir;
	            var front = chara.front(dir);
	            var dirChara = _this.getChara(front.x, front.y);
	            if (!map.hitTest(front.x, front.y)) {
	                chara.setMove(map, dir);
	            }
	        });
	    };
	    Puppeteer.prototype.clearEnemy = function (map) {
	        var _this = this;
	        this.charas.forEach(function (chara) {
	            if (chara.key != _this.player.key) {
	                _this.terminate(map, chara);
	            }
	        });
	    };
	    // ※デバッグ用
	    Puppeteer.prototype.showPos = function () {
	        var ret = "";
	        for (var key in this.charas) {
	            var chara = this.charas[key];
	            ret += chara.key + ":" + chara.showPos() + ";";
	        }
	        return ret;
	    };
	    return Puppeteer;
	}());
	exports.Puppeteer = Puppeteer;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var Settings = (function () {
	    function Settings() {
	    }
	    Settings.CHIP_WIDTH = 32;
	    Settings.CHIP_HEIGHT = 32;
	    Settings.STAGE_WIDTH = 256;
	    Settings.STAGE_HEIGHT = 192;
	    Settings.FPS = 32;
	    Settings.MOVE_SPEED = 4;
	    return Settings;
	}());
	exports.Settings = Settings;
	var Image = (function () {
	    function Image() {
	    }
	    Image.PLAYER = "/img/player.png";
	    Image.CHARA5_GIF = "/img/chara5.png";
	    Image.CHARA6_GIF = "/img/chara6.png";
	    Image.CHARA7_GIF = "/img/chara7.png";
	    Image.MAP0_GIF = "/img/map0.png";
	    return Image;
	}());
	exports.Image = Image;
	var DungeonChip = (function () {
	    function DungeonChip() {
	    }
	    DungeonChip.PATH = 2; // 通路
	    DungeonChip.ROOM = 0; // 部屋
	    DungeonChip.WALL = 1; // 壁（通れない）
	    DungeonChip.STAIR = 14; // 階段
	    return DungeonChip;
	}());
	exports.DungeonChip = DungeonChip;
	var Collision = (function () {
	    function Collision() {
	    }
	    Collision.Object = [
	        DungeonChip.WALL
	    ];
	    return Collision;
	}());
	exports.Collision = Collision;
	var CharaSettings = (function () {
	    function CharaSettings() {
	    }
	    CharaSettings.WIDTH = 64;
	    CharaSettings.HEIGHT = 64;
	    return CharaSettings;
	}());
	exports.CharaSettings = CharaSettings;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Settings_1 = __webpack_require__(2);
	var DungeonMap = (function () {
	    function DungeonMap(chipWidth, chipHeight, image) {
	        this.floor = 1;
	        this.map = new Map(chipWidth, chipHeight);
	        this.map.image = image;
	    }
	    DungeonMap.prototype.createMap = function (MAP_W, MAP_H) {
	        var dungeon = new Dungeon(MAP_W, MAP_H);
	        this.map.loadData(dungeon.map);
	        this.map.collisionData = dungeon.collisionData;
	        this.dungeon = dungeon;
	    };
	    // ランダム位置の取得（プレイヤー初期位置や敵の出現位置で使う）
	    // ※空き地がない場合無限ループになる
	    DungeonMap.prototype.randomPos = function () {
	        var pos, collision;
	        do {
	            pos = this.dungeon.randomPos();
	            collision = this.map.collisionData[pos.y][pos.x];
	        } while (collision != 0);
	        return pos;
	    };
	    DungeonMap.prototype.setCollision = function (x, y, c) {
	        this.map.collisionData[Math.floor(y / this.map.tileHeight)][Math.floor(x / this.map.tileWidth)] = c;
	    };
	    DungeonMap.prototype.checkTile = function (x, y) {
	        return this.map.checkTile(x, y);
	    };
	    DungeonMap.prototype.hitTest = function (x, y) {
	        return this.map.hitTest(x, y);
	    };
	    DungeonMap.prototype.join = function (g) {
	        g.addChild(this.map);
	    };
	    DungeonMap.prototype.getWidth = function () {
	        return this.map.width;
	    };
	    DungeonMap.prototype.getHeight = function () {
	        return this.map.height;
	    };
	    DungeonMap.prototype.getFloor = function () {
	        return this.floor;
	    };
	    DungeonMap.prototype.setFloor = function (num) {
	        this.floor = num;
	    };
	    return DungeonMap;
	}());
	exports.DungeonMap = DungeonMap;
	// 位置
	var Point = (function () {
	    function Point(x, y) {
	        this.x = x;
	        this.y = y;
	    }
	    return Point;
	}());
	exports.Point = Point;
	// 矩形（左上頂点、右下頂点を指定）
	var Rect = (function () {
	    function Rect(x0, y0, x1, y1) {
	        this.x0 = x0;
	        this.y0 = y0;
	        this.x1 = x1;
	        this.y1 = y1;
	        this.x0 = x0;
	        this.y0 = y0;
	        this.x1 = x1;
	        this.y1 = y1;
	    }
	    return Rect;
	}());
	// 区画
	var Area = (function (_super) {
	    __extends(Area, _super);
	    function Area(x0, y0, x1, y1) {
	        _super.call(this, x0, y0, x1, y1);
	    }
	    return Area;
	}(Rect));
	// ランダムダンジョン生成
	// 参考文献：<a href="http://racanhack.sourceforge.jp/rhdoc/index.html">Racanhack コード解説</a>
	var Dungeon = (function () {
	    function Dungeon(MAP_W, MAP_H, ROOM_MIN, MARGIN) {
	        if (ROOM_MIN === void 0) { ROOM_MIN = 3; }
	        if (MARGIN === void 0) { MARGIN = 2; }
	        this.MAP_W = MAP_W;
	        this.MAP_H = MAP_H;
	        this.ROOM_MIN = ROOM_MIN;
	        this.MARGIN = MARGIN;
	        this.MIN_RECT = this.ROOM_MIN + (this.MARGIN * 2);
	        // 区画分け
	        this.areaList = this.split(new Area(0, 0, MAP_W - 1, MAP_H - 1));
	        // 部屋作成
	        this.makeRoom(this.areaList);
	        // 通路作成
	        this.pathList = this.makePath(this.areaList);
	        // マップ生成
	        this.map = this.makeMap();
	        // 衝突データ生成
	        this.collisionData = this.makeCollisionData();
	    }
	    // マップデータの生成
	    Dungeon.prototype.makeMap = function () {
	        var map = this.createPathList(this.init());
	        map = this.createAreaList(map);
	        // 階段の描画
	        var stairPoint = this.getRandomPosition(map);
	        map[stairPoint.y][stairPoint.x] = Settings_1.DungeonChip.STAIR;
	        return map;
	    };
	    //衝突データ
	    Dungeon.prototype.makeCollisionData = function () {
	        var collisionData = [];
	        for (var y = 0; y < this.MAP_H; y++) {
	            collisionData[y] = new Array(this.MAP_W);
	            for (var x = 0; x < this.MAP_W; x++) {
	                collisionData[y][x] = _.indexOf(Settings_1.Collision.Object, this.map[y][x]) >= 0 ? 1 : 0;
	            }
	        }
	        return collisionData;
	    };
	    //mapの初期化壁でとりあえず埋め尽くす
	    Dungeon.prototype.init = function () {
	        // 初期化
	        var map = [];
	        for (var y = 0; y < this.MAP_H; y++) {
	            map[y] = [];
	            for (var x = 0; x < this.MAP_W; x++) {
	                map[y][x] = Settings_1.DungeonChip.WALL;
	            }
	        }
	        return map;
	    };
	    //通路の描画
	    Dungeon.prototype.createPathList = function (map) {
	        for (var i = 0, len = this.pathList.length; i < len; i++) {
	            var path = this.pathList[i];
	            if (path.x0 == path.x1) {
	                for (var y = path.y0; y <= path.y1; y++)
	                    map[y][path.x0] = Settings_1.DungeonChip.PATH;
	            }
	            if (path.y0 == path.y1) {
	                for (var x = path.x0; x <= path.x1; x++)
	                    map[path.y0][x] = Settings_1.DungeonChip.PATH;
	            }
	        }
	        return map;
	    };
	    // 部屋の描画
	    Dungeon.prototype.createAreaList = function (map) {
	        // 部屋の描画
	        for (var i = 0, len = this.areaList.length; i < len; i++) {
	            if (this.areaList[i].room) {
	                var room = this.areaList[i].room;
	                for (var y = room.y0; y <= room.y1; y++) {
	                    for (var x = room.x0; x <= room.x1; x++) {
	                        map[y][x] = Settings_1.DungeonChip.ROOM;
	                    }
	                }
	            }
	        }
	        return map;
	    };
	    //ランダム部屋の中のでポジションを取得
	    Dungeon.prototype.getRandomPosition = function (map) {
	        var x, y;
	        do {
	            x = _.random(0, this.MAP_W - 1);
	            y = _.random(0, this.MAP_H - 1);
	        } while (map[y][x] != Settings_1.DungeonChip.ROOM);
	        return new Point(x, y);
	    };
	    // ランダム位置
	    Dungeon.prototype.randomPos = function () {
	        return this.getRandomPosition(this.map);
	    };
	    // マップ表示
	    Dungeon.prototype.drawMap = function () {
	        var text = "";
	        for (var y = 0; y < this.MAP_H; y++) {
	            for (var x = 0; x < this.MAP_W; x++) {
	                text += this.map[y][x];
	            }
	            text += "<br>";
	        }
	        return text;
	    };
	    // 矩形の座標表示
	    Dungeon.prototype.showRect = function (rectList) {
	        var len = rectList.length;
	        var text = "";
	        for (var i = 0; i < len; i++) {
	            var r = rectList[i];
	            text += "(" + r.x0 + " " + r.y0 + " " + r.x1 + " " + r.y1 + ")";
	        }
	        return text + "<br>";
	    };
	    // 区画の表示
	    Dungeon.prototype.drawRect = function () {
	        return this.showRect(this.areaList);
	    };
	    // 通路の表示
	    Dungeon.prototype.drawPath = function () {
	        return this.showRect(this.pathList);
	    };
	    // ランダム整数生成（min <= 値 < max の範囲で生成）
	    //randomRange(min:number, max:number) :number {
	    //	return Math.floor(Math.random() * (max - min) + min);
	    //}
	    // 区画分割を行う関数（再帰）
	    Dungeon.prototype.split = function (area) {
	        var _this = this;
	        var split = function (area) {
	            // 終了条件
	            if ((area.x1 - area.x0 <= _this.MIN_RECT * 2) ||
	                (area.y1 - area.y0 <= _this.MIN_RECT * 2) ||
	                _.random(0, 16 - 1) == 0) {
	                // 区画が小さい場合終了
	                // たまに強制的に分割終了させることで大部屋ができたりする
	                return [area];
	            }
	            // 区画の追加
	            var child = new Area(area.x0, area.y0, area.x1, area.y1);
	            var dir = _.random(0, 1) ? 'x' : 'y';
	            var areaDir = _.random(area[dir + 0] + _this.MIN_RECT, area[dir + 1] - _this.MIN_RECT - 1);
	            area[dir + 1] = areaDir;
	            child[dir + 0] = areaDir;
	            var ret = [area, child].map(split);
	            return _.flatten(ret);
	        };
	        return split(area);
	    };
	    // 部屋作成
	    Dungeon.prototype.makeRoom = function (areaList) {
	        for (var i = 0, len = areaList.length; i < len; i++) {
	            var area = areaList[i];
	            var w = _.random(this.ROOM_MIN, area.x1 - area.x0 - (this.MARGIN * 2));
	            var h = _.random(this.ROOM_MIN, area.y1 - area.y0 - (this.MARGIN * 2));
	            var x = _.random(area.x0 + this.MARGIN, area.x1 - this.MARGIN - w);
	            var y = _.random(area.y0 + this.MARGIN, area.y1 - this.MARGIN - h);
	            area.room = new Rect(x, y, x + w, y + h);
	        }
	    };
	    // 通路作成
	    Dungeon.prototype.makePath = function (areaList) {
	        var pathList = [];
	        // 通路の追加
	        var addPath = function (area1, area2, isDeadEnd, num) {
	            // 隣り合う２つの区画を比較
	            //let dir = area1.y1 === area2.y0 ? 'y' : 'x';
	            //let reverseDir = area1.y1 === area2.y0 ? 'x' : 'y';
	            //let area1RoomReverseDir0 = area1.room[reverseDir + 0];
	            //let area2RoomReverseDir0 = area2.room[reverseDir + 0];
	            //let area1RoomReverseDir1 = area1.room[reverseDir + 1];
	            //let area2RoomReverseDir1 = area2.room[reverseDir + 1];
	            //var area1Point = _.random(area1RoomReverseDir0, area1RoomReverseDir1 - 1);
	            //var area2Point = _.random(area2RoomReverseDir0, area2RoomReverseDir1 - 1);
	            //
	            //
	            //let area1RoomDir0 = area1.room[dir + 0];
	            //let area2RoomDir0 = area2.room[dir + 0];
	            //let area1RoomDir1 = area1.room[dir + 1];
	            //let area2RoomDir1 = area2.room[dir + 1];
	            //let area1Dir0 = area1[dir + 0];
	            //let area2Dir0 = area2[dir + 0];
	            //let area1Dir1 = area1[dir + 1];
	            //let area2Dir1 = area2[dir + 1];
	            //pathList.push(new Rect(area1Point, area1RoomDir1, area1Point, area1Dir1)); // 縦の通路
	            //pathList.push(new Rect(area2Point, area2Dir0, area2Point, area2RoomDir0)); // 縦の通路
	            //
	            //
	            //pathList.push(new Rect(
	            //	area1Point < area2Point ? area1Point : area2Point,
	            //	area1Dir1,
	            //	area1Point < area2Point ? area2Point : area1Point,
	            //	area2Dir0)
	            //);
	            var deadEnd = isDeadEnd && _.random(0, num) === 0;
	            if (area1.y1 == area2.y0) {
	                var area1Point = _.random(area1.room.x0, area1.room.x1 - 1);
	                var area2Point = _.random(area2.room.x0, area2.room.x1 - 1);
	                pathList.push(new Rect(area1Point, area1.room.y1, area1Point, area1.y1)); // 縦の通路
	                pathList.push(new Rect(area2Point, area2.y0, area2Point, area2.room.y0)); // 縦の通路
	                if (!deadEnd) {
	                    if (area1Point < area2Point)
	                        pathList.push(new Rect(area1Point, area1.y1, area2Point, area2.y0)); // 横の通路
	                    else
	                        pathList.push(new Rect(area2Point, area1.y1, area1Point, area2.y0)); // 横の通路
	                }
	            }
	            else if (area1.x1 == area2.x0) {
	                var a = _.random(area1.room.y0, area1.room.y1 - 1);
	                var b = _.random(area2.room.y0, area2.room.y1 - 1);
	                pathList.push(new Rect(area1.room.x1, a, area1.x1, a)); // 横の通路
	                pathList.push(new Rect(area2.x0, b, area2.room.x0, b)); // 横の通路
	                if (!deadEnd) {
	                    if (a < b)
	                        pathList.push(new Rect(area1.x1, a, area2.x0, b)); // 縦の通路
	                    else
	                        pathList.push(new Rect(area1.x1, b, area2.x0, a)); // 縦の通路
	                }
	            }
	        };
	        // 全部屋をつなぐ通路を作成
	        var len = areaList.length;
	        for (var i = 0; i < len - 1; i++) {
	            addPath(areaList[i], areaList[i + 1]);
	        }
	        // ランダムで余分な通路を追加（一本道だとつまらないので）
	        for (var i = 0; i < len - 1; i++) {
	            for (var j = 1; j < len; j++) {
	                if (_.random(0, 2) == 0)
	                    addPath(areaList[i], areaList[j], true, 0);
	            }
	        }
	        return pathList;
	    };
	    return Dungeon;
	}());


/***/ }
/******/ ]);