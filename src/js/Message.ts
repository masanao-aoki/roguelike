import {Image, Settings, DungeonChip} from "./Settings";
import {game} from "./Game";

declare var Group;
declare var Label;
declare var Sprite;
declare var Surface;
declare var _;

export class Message {
	static MARGIN = Settings.CHIP_WIDTH / 4;
	static PADDING = Settings.CHIP_WIDTH / 4;
	static MSG_HEIGHT = Settings.CHIP_HEIGHT * 1.5;
	static MSG_WIDTH = Settings.STAGE_WIDTH - Message.MARGIN * 2;
	private label: any;
	constructor() {
		let msgbg = new Sprite(Message.MSG_WIDTH, Message.MSG_HEIGHT);
		let msgbgS = new Surface(Message.MSG_WIDTH, Message.MSG_HEIGHT);

		msgbgS.context.fillStyle = "#000000";
		msgbgS.context.fillRect(0, 0, Message.MSG_WIDTH, Message.MSG_HEIGHT);

		msgbg.image = msgbgS;
		msgbg.x = Message.MARGIN;
		msgbg.y = Settings.STAGE_HEIGHT - (Message.MARGIN + Message.MSG_HEIGHT);
		msgbg.opacity = 0.7;

		this.label = new Label();
		this.label.width = Message.MSG_WIDTH - Message.PADDING * 2;
		this.label.font = "10px monospace";
		this.label.color = "#ffffff";
		this.label.text = "";
		this.label.x = msgbg.x + Message.PADDING;
		this.label.y = msgbg.y + Message.PADDING;

		game.rootScene.addChild(msgbg);
		game.rootScene.addChild(this.label);
	}

	setMessage(str) {
		this.label.text = str;
	}
	setMessageTerminate(chara) {
		this.label.text = `${chara.name}を倒しました。`;
	}
	setMessageDamage(chara, damage) {
		this.label.text = `${chara.name}に${damage}ダメージを与えました。`;
	}
}