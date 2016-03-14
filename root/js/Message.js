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

	module.exports = __webpack_require__(6);


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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Settings_1 = __webpack_require__(2);
	var Message = (function () {
	    function Message(game) {
	        var msgbg = new Sprite(Message.MSG_WIDTH, Message.MSG_HEIGHT);
	        var msgbgS = new Surface(Message.MSG_WIDTH, Message.MSG_HEIGHT);
	        msgbgS.context.fillStyle = "#000000";
	        msgbgS.context.fillRect(0, 0, Message.MSG_WIDTH, Message.MSG_HEIGHT);
	        msgbg.image = msgbgS;
	        msgbg.x = Message.MARGIN;
	        msgbg.y = Settings_1.Settings.STAGE_HEIGHT - (Message.MARGIN + Message.MSG_HEIGHT);
	        msgbg.opacity = 0.7;
	        this.label = new Label();
	        this.label.width = Message.MSG_WIDTH - Message.PADDING * 2;
	        this.label.font = "10px monospace";
	        this.label.color = "#ffffff";
	        this.label.text = "";
	        this.label.x = msgbg.x + Message.PADDING;
	        this.label.y = msgbg.y + Message.PADDING;
	        game.rootScene.addChild(msgbg);
	        game.rootScene.addChild(this.label);
	    }
	    Message.prototype.setMessage = function (str) {
	        this.label.text = str;
	    };
	    Message.prototype.setMessageTerminate = function (chara) {
	        this.label.text = chara.name + "\u3092\u5012\u3057\u307E\u3057\u305F\u3002";
	    };
	    Message.prototype.setMessageDamage = function (chara, damage) {
	        this.label.text = chara.name + "\u306B" + damage + "\u30C0\u30E1\u30FC\u30B8\u3092\u4E0E\u3048\u307E\u3057\u305F\u3002";
	    };
	    Message.MARGIN = Settings_1.Settings.CHIP_WIDTH / 4;
	    Message.PADDING = Settings_1.Settings.CHIP_WIDTH / 4;
	    Message.MSG_HEIGHT = Settings_1.Settings.CHIP_HEIGHT * 1.5;
	    Message.MSG_WIDTH = Settings_1.Settings.STAGE_WIDTH - Message.MARGIN * 2;
	    return Message;
	}());
	exports.Message = Message;


/***/ }
/******/ ]);