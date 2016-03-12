export class Settings {
	static CHIP_WIDTH = 32;
	static CHIP_HEIGHT = 32;
	static STAGE_WIDTH = 256;
	static STAGE_HEIGHT = 192;
	static FPS = 32;
	static MOVE_SPEED = 4;
}

export class Image {
	static PLAYER = "/img/player.png";
	static CHARA5_GIF = "/img/chara5.png";
	static CHARA6_GIF = "/img/chara6.png";
	static CHARA7_GIF = "/img/chara7.png";
	static MAP0_GIF = "/img/map0.png";
}

export class DungeonChip {
	static PATH = 2; // 通路
	static ROOM = 0; // 部屋
	static WALL = 1; // 壁（通れない）
	static STAIR = 14; // 階段
}

export class Collision {
	static Object = [
		DungeonChip.WALL
	];
}

export class CharaSettings {
	static WIDTH = 64;
	static HEIGHT = 64;
}