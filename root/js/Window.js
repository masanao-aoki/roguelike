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

	module.exports = __webpack_require__(7);


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
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Settings_1 = __webpack_require__(2);
	var Window = (function () {
	    function Window(game, array) {
	        var defaultNum = 0;
	        var _this = this;
	        switch (array['type']) {
	            case 'item':
	                _this.itemWindow(game, array, defaultNum);
	                break;
	            case 'other':
	                console.log('それ以外');
	                break;
	        }
	        game.addEventListener('enterframe', function () {
	            if (game.input.down) {
	                defaultNum++;
	                _this.itemWindow(game, array, defaultNum);
	            }
	            if (game.input.up) {
	                defaultNum--;
	                _this.itemWindow(game, array, defaultNum);
	            }
	        });
	    }
	    Window.prototype.itemWindow = function (game, itemListArray, defaultNum) {
	        var itemWindowWidth = Window.ITEM_WIDTH + Window.WINDOW_PADDING * 2;
	        var itemWindowHeight = Window.ITEM_HEIGHT * itemListArray['data'].length + Window.WINDOW_PADDING_HEIGHT * 2;
	        var windowBg = new Sprite(itemWindowWidth, itemWindowHeight);
	        windowBg.x = itemListArray['x'];
	        windowBg.y = itemListArray['y'];
	        var windowBgS = new Surface(itemWindowWidth, itemWindowHeight);
	        windowBgS.context.rect(1, 1, itemWindowWidth - 2, itemWindowHeight - 2);
	        windowBgS.context.fillStyle = "rgba(0, 0, 0, .8)";
	        windowBgS.context.strokeStyle = "rgb(255, 255, 255)";
	        windowBgS.context.fill();
	        windowBgS.context.stroke();
	        windowBg.image = windowBgS;
	        game.rootScene.removeChild(windowBg);
	        game.rootScene.addChild(windowBg);
	        for (var i = 0; i < itemListArray['data'].length; i++) {
	            var itemList = new Sprite(Window.ITEM_WIDTH, Window.ITEM_HEIGHT);
	            if (i == defaultNum) {
	                itemList.backgroundColor = 'rgba(255, 255, 255, .2)';
	            }
	            itemList.x = windowBg.x + Window.WINDOW_PADDING;
	            itemList.y = Window.ITEM_HEIGHT * i + windowBg.y + Window.WINDOW_PADDING_HEIGHT;
	            itemList.opacity = 0.7;
	            var label = new Label();
	            label.width = Window.ITEM_WIDTH - Window.PADDING;
	            label.font = "10px monospace";
	            label.color = "#ffffff";
	            label.text = itemListArray['data'][i]['name'];
	            label.x = itemList.x + Settings_1.Settings.CHIP_WIDTH / 3;
	            label.y = itemList.y + 1.5;
	            game.rootScene.removeChild(itemList);
	            game.rootScene.removeChild(label);
	            game.rootScene.addChild(itemList);
	            game.rootScene.addChild(label);
	        }
	    };
	    Window.PADDING = Settings_1.Settings.CHIP_WIDTH;
	    Window.ITEM_HEIGHT = Settings_1.Settings.CHIP_HEIGHT / 2;
	    Window.ITEM_WIDTH = Settings_1.Settings.CHIP_WIDTH * 3;
	    Window.WINDOW_PADDING_HEIGHT = Settings_1.Settings.CHIP_WIDTH / 5;
	    Window.WINDOW_PADDING = Settings_1.Settings.CHIP_WIDTH / 18;
	    return Window;
	}());
	exports.Window = Window;


/***/ }
/******/ ]);