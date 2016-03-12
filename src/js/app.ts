import {Image, Settings, DungeonChip} from "./Settings";
import {Main} from "./Main";

declare function enchant();
declare var Game;

enchant();

let game = new Game(
	Settings.STAGE_WIDTH,
	Settings.STAGE_HEIGHT
);

game.fps = Settings.FPS;

game.preload(
	Image.PLAYER,
	Image.CHARA5_GIF,
	Image.CHARA6_GIF,
	Image.CHARA7_GIF,
	Image.MAP0_GIF
);

game.onload = (e) => {let main = new Main(game);};
game.start();




