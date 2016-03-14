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

	module.exports = __webpack_require__(3);


/***/ },
/* 1 */,
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