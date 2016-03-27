import {game} from "./Game";
import {Image, Settings, DungeonChip} from "./Settings";
import {Main} from "./Main";

game.fps = Settings.FPS;

game.preload(
	Image.PLAYER,
	Image.CHARA5_GIF,
	Image.CHARA6_GIF,
	Image.CHARA7_GIF,
	Image.MAP0_GIF
);

game.onload = (e) => {
	let main = new Main();
};
game.start();




