import {Settings} from "./Settings";

declare function enchant();
declare var Game;

enchant();

export var game = new Game(
	Settings.STAGE_WIDTH,
	Settings.STAGE_HEIGHT
);