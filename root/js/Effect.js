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

	module.exports = __webpack_require__(4);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports) {

	"use strict";
	// フェードイン・フェードアウトを行うクラス
	var Fade = (function () {
	    function Fade(width, height) {
	        var sprite = new Sprite(width, height);
	        var image = new Surface(width, height);
	        image.clear();
	        image.context.globalAlpha = 0; // 透明度の設定
	        image.context.fillRect(0, 0, width, height); // 黒で塗りつぶす
	        sprite.image = image;
	        this.sprite = sprite;
	        this.blightness = 0; // 完全に透明
	    }
	    Fade.prototype.fadeIn = function (speed) {
	        this.blightness -= speed; // 徐々に透明に
	        var image = this.sprite.image;
	        image.clear();
	        image.context.globalAlpha = this.blightness; // 透明度の設定
	        image.context.fillRect(0, 0, image.width, image.height); // 黒で塗りつぶす
	        if (this.blightness <= 0) {
	            return true;
	        }
	        return false;
	    };
	    Fade.prototype.fadeOut = function (speed) {
	        this.blightness += speed; // 徐々に不透明に
	        var image = this.sprite.image;
	        image.clear();
	        image.context.globalAlpha = this.blightness; // 透明度の設定
	        image.context.fillRect(0, 0, image.width, image.height); // 黒で塗りつぶす
	        if (this.blightness >= 1) {
	            return true;
	        }
	        return false;
	    };
	    return Fade;
	}());
	exports.Fade = Fade;


/***/ }
/******/ ]);