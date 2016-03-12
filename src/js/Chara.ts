import {Image, Settings, DungeonChip, CharaSettings} from "./Settings";
import {DungeonMap, Point} from "./Dungeon";

declare var Sprite;
declare var Surface;
declare var _;

// キャラクター
export class Chara {
	static SOUTH = 0;
	static WEST = 1;
	static EAST = 2;
	static NORTH = 3;
	static LOWER_LEFT = 4;
	static UPPER_LEFT = 5;
	static UPPER_RIGHT = 7;
	static LOWER_RIGHT = 6;
	key: string;
	sprite: any; // Sprite
	vx: number;
	vy: number;
	isMoving: boolean;
	direction: number;
	counter: number;
	motion: (frame:number)=>void;
	constructor(mapX: number, mapY: number, key: string, public hp: number, public name: string) {
		var sprite = new Sprite(CharaSettings.WIDTH, CharaSettings.HEIGHT);
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
	walkMotion(frame:number) {
		if (frame % 3 == 0) {
			this.counter++;
			this.counter %= 4;
		}
		// 0, 1, 2, 1...という順になるように
		this.sprite.frame = this.direction * 3 + (Math.floor(this.counter / 3) + this.counter % 3);
	}
	// 剣を振る動き
	slashMotion(frame: number) {
		this.sprite.frame = this.direction * 3 + this.counter;
		if (frame % 3 == 0) {
			this.counter++;
			this.counter %= 3;
		}
	}
	private dir2v(dir: number): Point {
		var vx = 0;
		var vy = 0;
		if (dir == Chara.WEST || dir == Chara.UPPER_LEFT || dir == Chara.LOWER_LEFT) vx = -1;
		if (dir == Chara.EAST || dir == Chara.UPPER_RIGHT || dir == Chara.LOWER_RIGHT) vx = 1;
		if (dir == Chara.NORTH || dir == Chara.UPPER_LEFT || dir == Chara.UPPER_RIGHT) vy = -1;
		if (dir == Chara.SOUTH || dir == Chara.LOWER_LEFT || dir == Chara.LOWER_RIGHT) vy = 1;
		return new Point(vx, vy);
	}
	front(dir: number): Point {
		var point = this.dir2v(dir);
		point.x = this.sprite.x + (Settings.CHIP_WIDTH / 2) + (point.x * Settings.CHIP_WIDTH);
		point.y = this.sprite.y + Settings.CHIP_HEIGHT + (point.y * Settings.CHIP_HEIGHT);
		return point;
	}
	damage(num): void {
		this.hp -= num;
	}
	// 次のフレームから歩き出す
	setMove(map: DungeonMap, dir: number) {
		let point = this.dir2v(dir);
		this.vx = point.x * Settings.MOVE_SPEED;
		this.vy = point.y * Settings.MOVE_SPEED;

		let nowX = this.sprite.x + (Settings.CHIP_WIDTH / 2);
		let nowY = this.sprite.y + Settings.CHIP_HEIGHT;
		let x = nowX + (point.x * Settings.CHIP_WIDTH);
		let y = nowY + (point.y * Settings.CHIP_HEIGHT);

		map.setCollision(nowX, nowY, 0); // 移動元を通行可に
		map.setCollision(x, y, 1); // 移動先を通行不可に
	}
	moveBy(vx: number, vy: number) {
		this.sprite.moveBy(vx, vy);
	}
	setMapPos(mapX: number, mapY: number) {
		this.sprite.x = mapX * Settings.CHIP_WIDTH - (Settings.CHIP_WIDTH / 2);
		this.sprite.y = mapY * Settings.CHIP_HEIGHT - Settings.CHIP_HEIGHT;
	}
	getFrontPos(dir: number): Point {
		let point = this.front(dir);
		return new Point(point.x / Settings.CHIP_WIDTH, point.y / Settings.CHIP_HEIGHT);
	}

	getMapPos(): Point {
		return new Point((this.sprite.x + Settings.CHIP_WIDTH / 2) / Settings.CHIP_WIDTH, (this.sprite.y + Settings.CHIP_HEIGHT) / Settings.CHIP_HEIGHT);
	}
	// x, yとも16で割り切れる場所にいるか
	divisible(): boolean {
		return (this.sprite.x + Settings.CHIP_WIDTH / 2) % Settings.CHIP_WIDTH == 0 && this.sprite.y % Settings.CHIP_HEIGHT == 0;
	}
	// ※デバッグ用
	showPos(): string {
		return "(" + this.sprite.x + "," + this.sprite.y + ")" +
			((this.sprite.x + 8) % 16 == 0 && this.sprite.y % 16 == 0 ? "true" : "false");
	}
}


// プレイヤー(剣士)
export class Player extends Chara {
	walkImage : any; // Surface
	slashImage : any; // Surface
	constructor(mapX: number, mapY: number, game: any, key: string, name: string) {
		super(mapX, mapY, key, 1, name);
		console.log(Image.PLAYER);
		var image = game.assets[Image.PLAYER];
		this.walkImage = new Surface(96 * 2, 128 * 4);
		this.walkImage.draw(image, 0, 0, 96 * 2, 128 * 4, 0, 0, 96 * 2, 128 * 4);
		this.slashImage = new Surface(96 * 2, 128 * 2);
		this.slashImage.draw(image, 0, 0, 96 * 2, 128 * 4, 0, 0, 96 * 2, 128 * 4);
		this.setWalkMotion();
	}
	setWalkMotion() {
		this.sprite.image = this.walkImage;
		this.motion = this.walkMotion;
		this.counter = 0;
	}
	setSlashMotion() {
		this.sprite.image = this.slashImage;
		this.motion = this.slashMotion;
		this.counter = 0;
	}
}
// 敵
class Enemy extends Chara {
	constructor(mapX: number, mapY: number, key: string, hp: number, name: string) {
		super(mapX, mapY, key, hp, name);
	}
}
// スライム型の敵
class Slime extends Enemy {
	static HP = 1;
	static NAME = 'スライム';
	static IMAGE = Image.CHARA6_GIF;
	constructor(mapX: number, mapY: number, key: string, game: any) {
		super(mapX, mapY, key, Slime.HP, Slime.NAME);
		var surface = new Surface(96 * 2, 128 * 2);
		surface.draw(game.assets[Slime.IMAGE], 0, 0, 96 * 2, 128 * 2, 0, 0, 96 * 2, 128 * 2);
		this.sprite.image = surface;
	}
}
// 魔法使い型の敵
class Mage extends Enemy {
	static HP = 2;
	static NAME = '魔法使い';
	static IMAGE = Image.CHARA6_GIF;
	constructor(mapX: number, mapY: number, key: string, game: any) {
		super(mapX, mapY, key, Mage.HP, Mage.NAME);
		var surface = new Surface(96 * 2, 128 * 2);
		surface.draw(game.assets[Image.CHARA6_GIF], 96 * 2, 0, 96 * 2, 128 * 2, 0, 0, 96 * 2, 128 * 2);
		this.sprite.image = surface;
	}
}
// 黒い剣士型の敵
class Knight extends Enemy {
	static HP = 1;
	static NAME = '黒い剣士';
	static IMAGE = Image.CHARA7_GIF;
	constructor(mapX: number, mapY: number, key: string, game: any) {
		super(mapX, mapY, key, Knight.HP, Knight.NAME);
		var surface = new Surface(96 * 2, 128 * 2);
		surface.draw(game.assets[Knight.IMAGE], 0, 0, 96 * 2, 128 * 2, 0, 0, 96 * 2, 128 * 2);
		this.sprite.image = surface;
	}
}

// キャラを一斉に動かすクラス
export class Puppeteer {
	group: any; // enchant.Group
	player: Player;
	charas: Chara[];
	counter: number;
	constructor(game: any, group: any, map: DungeonMap) {
		var pos = map.randomPos();
		this.player = new Player(pos.x, pos.y, game, 'player', 'プレイヤー');
		map.setCollision(pos.x * Settings.CHIP_WIDTH, pos.y * Settings.CHIP_HEIGHT, 1); // キャラのいる位置を移動不可に
		this.charas = [];
		this.charas.push(this.player);
		this.counter = 0;
		group.addChild(this.player.sprite);
		this.group = group;
	}
	// 敵発生
	spawn(game: any, map: DungeonMap, id: number) {
		var mapPos = map.randomPos();
		var enemy: Enemy;
		var key: string;
		if (id == 0) {
			key = "slime" + (this.counter++);
			enemy = new Slime(mapPos.x, mapPos.y, key, game);
		} else if (id == 1) {
			key = "mage" + (this.counter++);
			enemy = new Mage(mapPos.x, mapPos.y, key, game);
		} else if (id == 2) {
			key = "knight" + (this.counter++);
			enemy = new Knight(mapPos.x, mapPos.y, key, game);
		} else {
			console.log("Undefined enemy: id=" + id);
			return;
		}
		map.setCollision(mapPos.x * Settings.CHIP_WIDTH, mapPos.y * Settings.CHIP_HEIGHT, 1); // キャラのいる位置を移動不可に
		this.charas.push(enemy);
		this.group.addChild(enemy.sprite);
	}
	getChara(x :number, y: number):Chara {
		let chara = _.filter(this.charas, (chara) => {
			return chara.sprite.x + Settings.CHIP_WIDTH / 2 == x && chara.sprite.y + Settings.CHIP_HEIGHT == y;
		});
		return chara.length === 1 ? chara[0] : null;
	}
	terminate(map: DungeonMap, chara: Chara) {
		map.setCollision(chara.sprite.x + Settings.CHIP_WIDTH / 2, chara.sprite.y + Settings.CHIP_HEIGHT, 0); // キャラのいる位置を移動可に
		this.group.removeChild(chara.sprite);
		this.charas  = _.filter(this.charas, (c) => {
			return c.key !== chara.key;
		});
	}
	motion(frame: number) {
		this.charas.forEach((chara) => {
			chara.motion(frame);
		});
	}
	move(map: DungeonMap) {
		this.charas.forEach((chara) => {
			chara.moveBy(chara.vx, chara.vy);
			if (chara.divisible()) { // 16で割り切れる場所なら一旦止まる
				chara.setMove(map, -1);
			}
		});
	}
	setMoveEnemy(map: DungeonMap, pos: Point = this.player.getMapPos()) {
		let enemys = _.filter(this.charas, (chara)=> {return chara.key !== this.player.key});
		enemys.forEach((chara) => {
			let move = 0;
			var isEast = chara.getMapPos().x < pos.x;
			let isWest = chara.getMapPos().x > pos.x;
			let isSouth = chara.getMapPos().y < pos.y;
			let isNorth = chara.getMapPos().y > pos.y;

			if(isEast && isSouth) move = Chara.LOWER_RIGHT;
			else if(isEast && isNorth) move = Chara.UPPER_RIGHT;
			else if(isWest && isSouth) move = Chara.LOWER_LEFT;
			else if(isWest && isNorth) move = Chara.UPPER_LEFT;
			else if(isEast) move = Chara.EAST;
			else if(isWest) move = Chara.WEST;
			else if(isSouth) move = Chara.SOUTH;
			else if(isNorth) move = Chara.NORTH;

			let dir = move;
			chara.direction = dir;
			let front = chara.front(dir);
			let dirChara = this.getChara(front.x, front.y);

			if (!map.hitTest(front.x, front.y)) {
				chara.setMove(map, dir);
			}
		});
	}
	clearEnemy(map: DungeonMap) {
		this.charas.forEach((chara) => {
			if (chara.key != this.player.key) {
				this.terminate(map, chara);
			}
		});
	}
	// ※デバッグ用
	showPos():string {
		var ret = "";
		for (var key in this.charas) {
			var chara = this.charas[key];
			ret += chara.key + ":" + chara.showPos() + ";";
		}
		return ret;
	}
}