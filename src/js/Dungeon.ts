import {Image, Settings, DungeonChip, Collision} from "./Settings";
declare var Map;
declare var _;

export class DungeonMap {
	private map: any; // Map
	private dungeon: Dungeon;
	private floor: number = 1;
	constructor(chipWidth: number, chipHeight: number, image: any) {
		this.map = new Map(chipWidth, chipHeight);
		this.map.image = image;
	}
	createMap(MAP_W: number, MAP_H: number):void {
		let dungeon = new Dungeon(MAP_W, MAP_H);
		this.map.loadData(dungeon.map);
		this.map.collisionData = dungeon.collisionData;
		this.dungeon = dungeon;
	}
	// ランダム位置の取得（プレイヤー初期位置や敵の出現位置で使う）
	// ※空き地がない場合無限ループになる
	randomPos(): Point {
		let pos, collision;
		do {
			pos = this.dungeon.randomPos();
			collision = this.map.collisionData[pos.y][pos.x];
		} while (collision != 0);
		return pos;
	}
	setCollision(x: number, y: number, c: number):void {
		this.map.collisionData[Math.floor(y / this.map.tileHeight)][Math.floor(x / this.map.tileWidth)] = c;
	}
	checkTile(x: number, y: number): number {
		return this.map.checkTile(x, y);
	}
	hitTest(x: number, y: number): number {
		return this.map.hitTest(x, y);
	}
	join(g: any): void {
		g.addChild(this.map);
	}
	getWidth(): number {
		return this.map.width;
	}
	getHeight(): number {
		return this.map.height;
	}
	getFloor(): number {
		return this.floor;
	}
	setFloor(num: number) {
		this.floor = num;
	}
}

// 位置
export class Point {
	constructor(public x: number, public y: number) {}
}
// 矩形（左上頂点、右下頂点を指定）
class Rect {
	constructor(
		public x0:number,
		public y0:number,
		public x1:number,
		public y1:number
	) {
		this.x0 = x0;
		this.y0 = y0;
		this.x1 = x1;
		this.y1 = y1;
	}
}
// 区画
class Area extends Rect {
	room: Rect;
	constructor(x0: number, y0: number, x1: number, y1: number) {
		super(x0, y0, x1, y1);
	}
}

// ランダムダンジョン生成
// 参考文献：<a href="http://racanhack.sourceforge.jp/rhdoc/index.html">Racanhack コード解説</a>
class Dungeon {
	MIN_RECT: number;
	areaList: Area[];
	pathList: Rect[];
	map: number[][];
	collisionData: number[][];
	constructor(
		public MAP_W: number,
		public MAP_H: number,
		public ROOM_MIN: number = 3,
		public MARGIN: number = 2
	) {
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
	makeMap():number[][] {
		let map = this.createPathList(this.init());
		map = this.createAreaList(map);

		// 階段の描画
		let stairPoint = this.getRandomPosition(map);
		map[stairPoint.y][stairPoint.x] = DungeonChip.STAIR;

		return map;
	}

	//衝突データ
	makeCollisionData():number[][] {
		let collisionData = [];
		for(let y = 0; y < this.MAP_H; y++) {
			collisionData[y] = new Array(this.MAP_W);
			for (let x = 0; x < this.MAP_W; x++) {
				collisionData[y][x] = _.indexOf(Collision.Object, this.map[y][x]) >= 0 ? 1 : 0;
			}
		}
		return collisionData;
	}

	//mapの初期化壁でとりあえず埋め尽くす
	init(): number[][] {
		// 初期化
		var map = [];
		for (let y = 0; y < this.MAP_H; y++) {
			map[y] = [];
			for (let x = 0; x < this.MAP_W; x++) {
				map[y][x] = DungeonChip.WALL;
			}
		}
		return map;
	}
	//通路の描画
	createPathList(map): number[][] {
		for (let i = 0, len = this.pathList.length; i < len; i++) {
			let path = this.pathList[i];
			if (path.x0 == path.x1) {
				for (var y = path.y0; y <= path.y1; y++) map[y][path.x0] = DungeonChip.PATH;
			}
			if (path.y0 == path.y1) {
				for (var x = path.x0; x <= path.x1; x++) map[path.y0][x] = DungeonChip.PATH;
			}
		}
		return map;
	}
	// 部屋の描画
	createAreaList(map): number[][] {
		// 部屋の描画
		for (let i = 0, len = this.areaList.length; i < len; i++) {
			if (this.areaList[i].room) {
				let room = this.areaList[i].room;
				for (let y = room.y0; y <= room.y1; y++) {
					for (let x = room.x0; x <= room.x1; x++) {
						map[y][x] = DungeonChip.ROOM;
					}
				}
			}
		}
		return map;
	}

	//ランダム部屋の中のでポジションを取得
	getRandomPosition(map): Point {
		let x: number, y: number;
		do {
			x = _.random(0, this.MAP_W - 1);
			y = _.random(0, this.MAP_H - 1);
		} while(map[y][x] != DungeonChip.ROOM);
		return new Point(x, y);
	}

	// ランダム位置
	randomPos(): Point {
		return this.getRandomPosition(this.map);
	}

	// マップ表示
	drawMap(): string {
		let text = "";
		for (let y = 0; y < this.MAP_H; y++) {
			for (let x = 0; x < this.MAP_W; x++) {
				text += this.map[y][x];
			}
			text += "<br>";
		}
		return text;
	}

	// 矩形の座標表示
	showRect(rectList:Rect[]):string {
		var len = rectList.length;
		var text = "";
		for (var i = 0; i < len; i++) {
			var r = rectList[i];
			text += "(" + r.x0 + " " + r.y0 + " " + r.x1 + " " + r.y1 + ")";
		}
		return text + "<br>";
	}

	// 区画の表示
	drawRect():string {
		return this.showRect(this.areaList);
	}
	// 通路の表示
	drawPath():string {
		return this.showRect(this.pathList);
	}

	// ランダム整数生成（min <= 値 < max の範囲で生成）
	//randomRange(min:number, max:number) :number {
	//	return Math.floor(Math.random() * (max - min) + min);
	//}

	// 区画分割を行う関数（再帰）
	split(area: Area): Area[] {
		var split = (area: Area) => {
			// 終了条件
			if ((area.x1 - area.x0 <= this.MIN_RECT * 2) ||
				(area.y1 - area.y0 <= this.MIN_RECT * 2) ||
				_.random(0, 16 - 1) == 0) {
				// 区画が小さい場合終了
				// たまに強制的に分割終了させることで大部屋ができたりする
				return [area];
			}
			// 区画の追加
			var child = new Area(area.x0, area.y0, area.x1, area.y1);

			var dir = _.random(0, 1) ? 'x' : 'y';
			var areaDir = _.random(area[dir + 0] + this.MIN_RECT, area[dir + 1] - this.MIN_RECT - 1);
			area[dir + 1] = areaDir;
			child[dir + 0] = areaDir;
			var ret = [area, child].map(split);

			return _.flatten(ret);
		};
		return split(area);
	}
	// 部屋作成
	makeRoom(areaList: Area[]) {
		for (var i = 0, len = areaList.length; i < len; i++) {
			var area = areaList[i];
			var w = _.random(this.ROOM_MIN, area.x1 - area.x0 - (this.MARGIN * 2));
			var h = _.random(this.ROOM_MIN, area.y1 - area.y0 - (this.MARGIN * 2));
			var x = _.random(area.x0 + this.MARGIN, area.x1 - this.MARGIN - w);
			var y = _.random(area.y0 + this.MARGIN, area.y1 - this.MARGIN - h);
			area.room = new Rect(x, y, x + w, y + h);
		}
	}
	// 通路作成
	makePath(areaList: Area[]): Rect[] {
		var pathList = [];
		// 通路の追加
		var addPath = (area1, area2, isDeadEnd?, num?) => {
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

			if (area1.y1 == area2.y0) { // 上下に隣接（上→下の順）
				var area1Point = _.random(area1.room.x0, area1.room.x1 - 1);
				var area2Point = _.random(area2.room.x0, area2.room.x1 - 1);
				pathList.push(new Rect(area1Point, area1.room.y1, area1Point, area1.y1)); // 縦の通路
				pathList.push(new Rect(area2Point, area2.y0, area2Point, area2.room.y0)); // 縦の通路

				if(!deadEnd) {
					if (area1Point < area2Point) pathList.push(new Rect(area1Point, area1.y1, area2Point, area2.y0)); // 横の通路
					else pathList.push(new Rect(area2Point, area1.y1, area1Point, area2.y0)); // 横の通路
				}
			} else if (area1.x1 == area2.x0) { // 左右に隣接（左→右の順）
				var a = _.random(area1.room.y0, area1.room.y1 - 1);
				var b = _.random(area2.room.y0, area2.room.y1 - 1);
				pathList.push(new Rect(area1.room.x1, a, area1.x1, a)); // 横の通路
				pathList.push(new Rect(area2.x0, b, area2.room.x0, b)); // 横の通路

				if(!deadEnd) {
					if (a < b) pathList.push(new Rect(area1.x1, a, area2.x0, b)); // 縦の通路
					else pathList.push(new Rect(area1.x1, b, area2.x0, a)); // 縦の通路
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
	}
}