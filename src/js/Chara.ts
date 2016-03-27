import {Image, Settings, DungeonChip, CharaSettings} from "./Settings";
import {DungeonMap, Point} from "./Dungeon";
import {floatMap} from "./FloatMap";
import {game} from "./Game";


declare var Sprite;
declare var Surface;
declare var _;

export class SpritePoint {
	public x: number;
	public y: number;
	constructor() {
	}
	spritePointBySprite(sprite) {
		this.x = sprite.x + (Settings.CHIP_WIDTH / 2);
		this.y = sprite.y + Settings.CHIP_HEIGHT;
	}

	spritePointByPoint(point) {
		this.x = point.x * Settings.CHIP_WIDTH - (Settings.CHIP_WIDTH / 2);
		this.y = point.y * Settings.CHIP_HEIGHT - Settings.CHIP_HEIGHT;
	}
}

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
	constructor(public pos: Point, key: string, public hp: number, public name: string) {
		let sprite = new Sprite(CharaSettings.WIDTH, CharaSettings.HEIGHT);
		sprite.frame = 0;
		this.sprite = sprite;
		this.key = key;
		this.vx = this.vy = 0;
		this.isMoving = false;
		this.direction = 0;
		this.counter = 0;
		this.motion = this.walkMotion;
		this.setMapSpritePos(pos);
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
	damage(num): void {
		this.hp -= num;
	}
	// 次のフレームから歩き出す
	setMove(map: DungeonMap, dir: number) {
		let dirNum = this.dir2v(dir);
		this.vx = dirNum.x * Settings.MOVE_SPEED;
		this.vy = dirNum.y * Settings.MOVE_SPEED;


		let nextSpritePoint = new SpritePoint();
		nextSpritePoint.spritePointBySprite(this.sprite);
		nextSpritePoint.x = nextSpritePoint.x + (dirNum.x * Settings.CHIP_WIDTH);
		nextSpritePoint.y = nextSpritePoint.y + (dirNum.y * Settings.CHIP_HEIGHT);
		let nextPoint = this.getNextPointBySpritePoint(nextSpritePoint);

		if(this.key === 'player') {
			floatMap.putPlayer(nextPoint.x, nextPoint.y);
		} else {
			floatMap.putEnemy(nextPoint.x, nextPoint.y);
		}

		let nowSpritePoint = new SpritePoint();
		nowSpritePoint.spritePointBySprite(this.sprite);

		map.setCollision(nowSpritePoint.x, nowSpritePoint.y, 0); // 移動元を通行可に
		map.setCollision(nextSpritePoint.x, nextSpritePoint.y, 1); // 移動先を通行不可に
	}
	moveBy(vx: number, vy: number) {
		this.sprite.moveBy(vx, vy);
	}
	private dir2v(dir: number) {
		let x = 0;
		let y = 0;
		if (dir == Chara.WEST || dir == Chara.UPPER_LEFT || dir == Chara.LOWER_LEFT) x = -1;
		if (dir == Chara.EAST || dir == Chara.UPPER_RIGHT || dir == Chara.LOWER_RIGHT) x = 1;
		if (dir == Chara.NORTH || dir == Chara.UPPER_LEFT || dir == Chara.UPPER_RIGHT) y = -1;
		if (dir == Chara.SOUTH || dir == Chara.LOWER_LEFT || dir == Chara.LOWER_RIGHT) y = 1;
		return {x: x, y: y};
	}

	nextSpritePos(dir: number) {
		let dirNum = this.dir2v(dir);
		let nowSpritePoint = new SpritePoint();
		nowSpritePoint.spritePointBySprite(this.sprite);
		nowSpritePoint.x = nowSpritePoint.x + (dirNum.x * Settings.CHIP_WIDTH);
		nowSpritePoint.y = nowSpritePoint.y + (dirNum.y * Settings.CHIP_HEIGHT);
		return nowSpritePoint;
	}

	getNextPoint(dir: number): Point {
		let nextSpritePos = this.nextSpritePos(dir);
		return this.getNextPointBySpritePoint(nextSpritePos);
	}

	setMapSpritePos(point: Point) {
		let nowSpritePoint = new SpritePoint();
		nowSpritePoint.spritePointByPoint(point);

		this.sprite.x = nowSpritePoint.x;
		this.sprite.y = nowSpritePoint.y;
	}
	getMapPoint(): Point {
		let nowSpritePoint = new SpritePoint();
		nowSpritePoint.spritePointBySprite(this.sprite);
		return this.getNextPointBySpritePoint(nowSpritePoint);
	}
	getNextPointBySpritePoint(spritePoint: SpritePoint): Point {
		return new Point(
			spritePoint.x / Settings.CHIP_WIDTH,
			spritePoint.y / Settings.CHIP_HEIGHT
		);

	}
	// x, yとも16で割り切れる場所にいるか
	divisible(): boolean {
		return (this.sprite.x + Settings.CHIP_WIDTH / 2) % Settings.CHIP_WIDTH == 0 && this.sprite.y % Settings.CHIP_HEIGHT == 0;
	}
}


// プレイヤー(剣士)
export class Player extends Chara {
	walkImage : any; // Surface
	slashImage : any; // Surface
	constructor(pos: Point, key: string, name: string) {
		super(pos, key, 1, name);
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
	constructor(pos: Point, key: string, hp: number, name: string) {
		super(pos, key, hp, name);
	}
}
// スライム型の敵
class Slime extends Enemy {
	static HP = 1;
	static NAME = 'スライム';
	static IMAGE = Image.CHARA6_GIF;
	constructor(pos: Point, key: string) {
		super(pos, key, Slime.HP, Slime.NAME);
		let surface = new Surface(96 * 2, 128 * 2);
		surface.draw(game.assets[Slime.IMAGE], 0, 0, 96 * 2, 128 * 2, 0, 0, 96 * 2, 128 * 2);
		this.sprite.image = surface;
	}
}
// 魔法使い型の敵
class Mage extends Enemy {
	static HP = 2;
	static NAME = '魔法使い';
	static IMAGE = Image.CHARA6_GIF;
	constructor(pos: Point, key: string) {
		super(pos, key, Mage.HP, Mage.NAME);
		let surface = new Surface(96 * 2, 128 * 2);
		surface.draw(game.assets[Image.CHARA6_GIF], 96 * 2, 0, 96 * 2, 128 * 2, 0, 0, 96 * 2, 128 * 2);
		this.sprite.image = surface;
	}
}
// 黒い剣士型の敵
class Knight extends Enemy {
	static HP = 1;
	static NAME = '黒い剣士';
	static IMAGE = Image.CHARA7_GIF;
	constructor(pos: Point, key: string) {
		super(pos, key, Knight.HP, Knight.NAME);
		let surface = new Surface(96 * 2, 128 * 2);
		surface.draw(game.assets[Knight.IMAGE], 0, 0, 96 * 2, 128 * 2, 0, 0, 96 * 2, 128 * 2);
		this.sprite.image = surface;
	}
}

// キャラを一斉に動かすクラス
export class Puppeteer {
	group: any; // enchant.Group
	player: Player;
	characters: Chara[];
	counter: number;
	constructor(group: any, map: DungeonMap) {
		let pos: Point = map.randomPoint();
		this.player = new Player(pos, 'player', 'プレイヤー');
		floatMap.putPlayer(pos.x, pos.y);
		map.setCollision(pos.x * Settings.CHIP_WIDTH, pos.y * Settings.CHIP_HEIGHT, 1); // キャラのいる位置を移動不可に
		this.characters = [];
		this.characters.push(this.player);
		this.counter = 0;
		group.addChild(this.player.sprite);
		this.group = group;
	}


	// 敵発生
	spawn(map: DungeonMap, id: number) {
		var pos = map.randomPoint();
		var enemy: Enemy;
		var key: string;
		if (id == 0) {
			key = "slime" + (this.counter++);
			enemy = new Slime(pos, key);
		} else if (id == 1) {
			key = "mage" + (this.counter++);
			enemy = new Mage(pos, key);
		} else if (id == 2) {
			key = "knight" + (this.counter++);
			enemy = new Knight(pos, key);
		} else {
			console.log("Undefined enemy: id=" + id);
			return;
		}
		map.setCollision(pos.x * Settings.CHIP_WIDTH, pos.y * Settings.CHIP_HEIGHT, 1); // キャラのいる位置を移動不可に
		floatMap.putEnemy(pos.x, pos.y);
		this.characters.push(enemy);
		this.group.addChild(enemy.sprite);
	}
	getChara(x :number, y: number): Chara {
		let chara = _.filter(this.characters, (chara) => {
			return chara.sprite.x + Settings.CHIP_WIDTH / 2 == x && chara.sprite.y + Settings.CHIP_HEIGHT == y;
		});
		return chara.length === 1 ? chara[0] : null;
	}
	terminate(map: DungeonMap, chara: Chara) {
		map.setCollision(chara.sprite.x + Settings.CHIP_WIDTH / 2, chara.sprite.y + Settings.CHIP_HEIGHT, 0); // キャラのいる位置を移動可に
		this.group.removeChild(chara.sprite);
		this.characters  = _.filter(this.characters, (c) => {
			return c.key !== chara.key;
		});
	}
	motion(frame: number) {
		this.characters.forEach((chara: Chara) => {
			chara.motion(frame);
		});
	}
	move(map: DungeonMap) {
		this.characters.forEach((chara: Chara) => {
			chara.moveBy(chara.vx, chara.vy);
			if (chara.divisible()) { // 16で割り切れる場所なら一旦止まる
				chara.setMove(map, -1);
			}
		});
	}
	setMoveEnemy(map: DungeonMap, pos: Point = this.player.getMapPoint()) {
		let enemies = _.filter(this.characters, (chara: Chara)=> {return chara.key !== this.player.key});
		enemies.forEach((chara: Chara) => {
			let charaPos = chara.getMapPoint();
			let move = 0;
			var isEast = charaPos.x < pos.x;
			let isWest = charaPos.x > pos.x;
			let isSouth = charaPos.y < pos.y;
			let isNorth = charaPos.y > pos.y;

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
			let nextSpritePos = chara.nextSpritePos(dir);
			let dirChara = this.getChara(nextSpritePos.x, nextSpritePos.y);

			if (!map.hitTest(nextSpritePos.x, nextSpritePos.y)) {
				chara.setMove(map, dir);
			}
		});
	}
	clearEnemy(map: DungeonMap) {
		this.characters.forEach((chara) => {
			if (chara.key != this.player.key) {
				this.terminate(map, chara);
			}
		});
	}
}
