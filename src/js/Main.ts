import {Image, Settings, DungeonChip} from "./Settings";
import {DungeonMap, Point} from "./Dungeon";
import {Chara, Player, Puppeteer} from "./Chara";
import {Fade} from "./Effect";
import {Message} from "./Message";
import {floatMap} from "./FloatMap";
import {game} from "./Game";

declare var Group;
declare var Label;
declare var Sprite;
declare var Surface;
declare var _;

// メインクラス
export class Main {
	fade: Fade;
	map: DungeonMap;
	player: Player;
	puppeteer: Puppeteer;
	stage: any; // Group
	private message: Message;
	enterframe: (e) => void;
	constructor() {
		// フェードイン・フェードアウト用
		this.fade = new Fade(Settings.STAGE_WIDTH, Settings.STAGE_HEIGHT);
		// マップ生成処理
		this.map = new DungeonMap(Settings.CHIP_WIDTH, Settings.CHIP_HEIGHT, game.assets[Image.MAP0_GIF]);
		this.map.createMap(Settings.CHIP_WIDTH * _.random(1,2), Settings.CHIP_WIDTH * _.random(1,2));

		// キャラを動かすクラス
		var charaGroup = new Group();
		var puppeteer = new Puppeteer(charaGroup, this.map);
		puppeteer.spawn(this.map, Math.floor(Math.random() * 3));
		// ゲームの舞台
		// メンバー変数を設定
		this.player = puppeteer.player;
		this.puppeteer = puppeteer;
		this.stage = new Group();
		this.enterframe = this.waiting;
		this.scroll();
		// ステージ上にオブジェクトを配置
		this.map.join(this.stage);
		this.stage.addChild(charaGroup);
		game.rootScene.addChild(this.stage);
		game.rootScene.addChild(this.fade.sprite);
		game.rootScene.addEventListener('enterframe', (e) => {this.enterframe(e);});

		//全体マップを表示する
		floatMap.showFloatMap();
		floatMap.showAllMap(this.map);

		game.keybind(' '.charCodeAt(0), 'space');

		this.message= new Message();
	}
	// プレイヤーの動きに合わせてスクロールする
	scroll() {
		var x = Math.min((Settings.STAGE_WIDTH  - Settings.CHIP_WIDTH) / 2 - this.player.sprite.x - Settings.CHIP_WIDTH / 2, 0);
		var y = Math.min((Settings.STAGE_HEIGHT - Settings.CHIP_HEIGHT) / 2 - this.player.sprite.y - Settings.CHIP_HEIGHT / 2, 0);
		x = Math.max(Settings.STAGE_WIDTH,  x + this.map.getWidth())  - this.map.getWidth();
		y = Math.max(Settings.STAGE_HEIGHT, y + this.map.getHeight()) - this.map.getHeight();
		this.stage.x = x;
		this.stage.y = y;
	}
	// 入力待ち
	waiting(e) {
		this.puppeteer.motion(game.frame);
		var dir = -1;
		if (game.input.left && game.input.up) {dir = Chara.UPPER_LEFT;}
		else if (game.input.right && game.input.up) {dir = Chara.UPPER_RIGHT;}
		else if (game.input.left && game.input.down) {dir = Chara.LOWER_LEFT;}
		else if (game.input.right && game.input.down) {dir = Chara.LOWER_RIGHT;}
		else if (game.input.left) {dir = Chara.WEST;}
		else if (game.input.right) {dir = Chara.EAST;}
		else if (game.input.up) {dir = Chara.NORTH;}
		else if (game.input.down) {dir = Chara.SOUTH;}
		else if (game.input.space) {
			floatMap.clearActors();
			this.player.setSlashMotion();
			this.puppeteer.setMoveEnemy(this.map);
			this.puppeteer.move(this.map);
			this.enterframe = this.attacking;
		}

		if (dir != -1) {
			// 一歩先が通行可能か
			this.player.direction = dir;
			let nextSpritePos = this.player.nextSpritePos(dir);
			if (!this.map.hitTest(nextSpritePos.x, nextSpritePos.y)) { // 通れる
				floatMap.clearActors();
				this.player.setMove(this.map, dir);
				this.puppeteer.setMoveEnemy(this.map, this.player.getNextPoint(dir));
				this.puppeteer.move(this.map);
				this.scroll();
				this.enterframe = this.walking;
			} else { // 通れないならプレイヤーの正面は壁か敵
				let chara = this.puppeteer.getChara(nextSpritePos.x, nextSpritePos.y);
				if (chara) { // 敵がいたら攻撃
					//this.player.setSlashMotion();
					//this.enterframe = this.attacking;
				}
			}
		}
	}
	// 攻撃中
	attacking(e) {
		let counter = this.player.counter;
		this.player.motion(game.frame);
		this.puppeteer.motion(game.frame);
		this.puppeteer.move(this.map);
		if(counter === 0 && this.player.counter == 2) { //ふりはじめ
			let nextSpritePos = this.player.nextSpritePos(this.player.direction);
			let chara = this.puppeteer.getChara(nextSpritePos.x, nextSpritePos.y);
			if(chara) {
				chara.damage(1);
				this.message.setMessageDamage(chara, 1);
				if(chara.hp <= 0) {
					this.puppeteer.terminate(this.map, chara);

					this.message.setMessageTerminate(chara);
				}
			}

			console.log('ふりはじめ');
		}
		if (counter != this.player.counter && this.player.counter == 0) { // 剣を振り終わった
			this.player.setWalkMotion();
			this.enterframe = this.waiting;
			console.log('ふりおわり');
		}
	}
	// 歩行中
	walking(e) {
		this.puppeteer.motion(game.frame);
		this.puppeteer.move(this.map);
		this.scroll();
		if (this.player.divisible()) { // x, yとも16で割り切れる場所に着いたとき
			let pos = this.player.getMapPoint();

			//フロアーマップの描画
			floatMap.putFloor(pos.x, pos.y, 1, 1);

			var tile = this.map.checkTile(pos.x * Settings.CHIP_WIDTH, pos.y * Settings.CHIP_HEIGHT);
			if (tile == DungeonChip.STAIR) {
				this.enterframe = this.goNextFloor;
				this.map.setFloor(this.map.getFloor() + 1);
				console.log(this.map.getFloor() + '階');
			} else {
				if (Math.floor(Math.random() * 16) == 0)
					this.puppeteer.spawn(this.map, Math.floor(Math.random() * 3));
					this.enterframe = this.waiting;
			}
		}
	}
	// マップ移動
	goNextFloor(e) { // フェードアウト
		floatMap.clearMap();
		if (this.fade.fadeOut(0.2)) {
			this.enterframe = (e) => { // マップ移動
				this.puppeteer.clearEnemy(this.map);
				this.map.createMap(Settings.CHIP_WIDTH * _.random(1,3), Settings.CHIP_HEIGHT * _.random(1,3));
				var pos = this.map.randomPoint();
				this.player.setMapSpritePos(pos);
				this.map.setCollision(pos.x * Settings.CHIP_WIDTH, pos.y * Settings.CHIP_HEIGHT, 1); // キャラのいる位置を移動不可に
				this.puppeteer.spawn(this.map, Math.floor(Math.random() * 3));
				this.scroll();

				floatMap.clearMap();
				floatMap.clearActors();
				floatMap.showAllMap(this.map);
				this.enterframe = (e) => { // フェードイン
					if (this.fade.fadeIn(0.2)) {
						this.enterframe = this.waiting;
					}
				};
			};
		}
	}
}