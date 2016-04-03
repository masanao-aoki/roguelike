import {game} from "./Game";
import {Image, Settings, DungeonChip, Collision} from "./Settings";

declare var Sprite;
declare var Surface;
declare var _;

export class FloatMap {
	static MARGIN = Settings.CHIP_WIDTH;
	static PADDING = Settings.CHIP_WIDTH;
	static MAP_HEIGHT = Settings.STAGE_HEIGHT;
	static MAP_WIDTH = Settings.STAGE_WIDTH;
	static MAP_CHIP_WIDTH = 3;
	static MAP_CHIP_HEIGHT = 3;

	static MAP_COLOR = '#008';
	static MAP_OPACITY = '0.4';

	static PLAYER_COLOR = '#FFF';
	static ENEMY_COLOR = '#F00';
	static ITEM_COLOR = '#0FF';
	static STAIRS_COLOR = '#8CF';


	floor;
	floorCanvas;
	floorContext;

	charaLayer;
	charaCanvas;
	charaContext;

	stairLayer;
	stairCanvas;
	stairContext;
	constructor(game) {

		//フロアーマップ
		this.floor = new Sprite(FloatMap.MAP_WIDTH, FloatMap.MAP_HEIGHT);
		this.floorCanvas = this.floor.image = new Surface(FloatMap.MAP_WIDTH, FloatMap.MAP_HEIGHT);
		this.floor.x = 0;
		this.floor.y = 0;
		this.floor.opacity = FloatMap.MAP_OPACITY;
		this.floorContext = this.floor.image.context;

		//キャラクター
		this.charaLayer = new Sprite(FloatMap.MAP_WIDTH, FloatMap.MAP_HEIGHT);
		this.charaCanvas = this.charaLayer.image = new Surface(FloatMap.MAP_WIDTH, FloatMap.MAP_HEIGHT);
		this.charaContext = this.charaCanvas.context;

		//階段
		this.stairLayer = new Sprite(FloatMap.MAP_WIDTH, FloatMap.MAP_HEIGHT);
		this.stairCanvas = this.stairLayer.image = new Surface(FloatMap.MAP_WIDTH, FloatMap.MAP_HEIGHT);
		this.stairContext = this.stairCanvas.context;
	}

	showFloatMap() {
		game.rootScene.addChild(this.floor);
		game.rootScene.addChild(this.charaLayer);
		game.rootScene.addChild(this.stairLayer);
	}

	putFloor(x, y, width, height){
		let ctx = this.floorContext;
		let mapChipWidth = FloatMap.MAP_CHIP_WIDTH;
		let mapChipHight = FloatMap.MAP_CHIP_HEIGHT;
		ctx.fillStyle = FloatMap.MAP_COLOR;
		ctx.fillRect(
			x * mapChipWidth,
			y * mapChipHight,
			width * mapChipWidth,
			height * mapChipHight
		);
	}
	clearMap() {
		this.floorCanvas.clear();
		this.clearStair();
	}

	showAllMap(map) {
		_.each(map.dungeon.areaList, (roomArea) => {
			let room = roomArea.room;
			let width = room.x1 - room.x0 + 1;
			let height = room.y1 - room.y0 + 1;

			this.putFloor(room.x0, room.y0, width, height);
		});

		_.each(map.dungeon.pathList, (area) => {
			let width = area.x1 - area.x0 + 1;
			let height = area.y1 - area.y0 + 1;

			this.putFloor(area.x0, area.y0, width, height);
		});

		this.putStair(map.dungeon.stairPoint.x, map.dungeon.stairPoint.y);
	}

	putPlayer(x, y) {
		let ctx = this.charaContext;
		ctx.beginPath();
		ctx.fillStyle = FloatMap.PLAYER_COLOR;
		ctx.arc(
			(x + 0.5) * FloatMap.MAP_CHIP_WIDTH,
			(y + 0.5) * FloatMap.MAP_CHIP_HEIGHT,
			FloatMap.MAP_CHIP_WIDTH / 2, 0,
			2 * Math.PI
		);
		ctx.fill();
	}
	putEnemy(x, y) {
		let ctx = this.charaContext;
		ctx.beginPath();
		ctx.fillStyle = FloatMap.ENEMY_COLOR;
		ctx.arc(
			(x + 0.5) * FloatMap.MAP_CHIP_WIDTH,
			(y + 0.5) * FloatMap.MAP_CHIP_HEIGHT,
			FloatMap.MAP_CHIP_WIDTH / 2, 0,
			2 * Math.PI
		);
		ctx.fill();
	}
	clearActors() {
		this.charaCanvas.clear();
	}
	putStair(x, y) {
		let ctx = this.stairContext;
		ctx.beginPath();
		ctx.fillStyle = FloatMap.STAIRS_COLOR;
		ctx.arc(
			(x + 0.5) * FloatMap.MAP_CHIP_WIDTH,
			(y + 0.5) * FloatMap.MAP_CHIP_HEIGHT,
			FloatMap.MAP_CHIP_WIDTH / 2, 0,
			2 * Math.PI
		);
		ctx.fill();
	}
	clearStair() {
		this.stairCanvas.clear();
	}
}

export var floatMap = new FloatMap(game);