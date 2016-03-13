import {Image, Settings, DungeonChip} from "./Settings";

declare var Sprite;
declare var Surface;
declare var Label;

export class Window {

    static PADDING = Settings.CHIP_WIDTH;
	static ITEM_HEIGHT = Settings.CHIP_HEIGHT / 2;
	static ITEM_WIDTH = Settings.CHIP_WIDTH * 3;
	static WINDOW_PADDING_HEIGHT = Settings.CHIP_WIDTH / 5;
	static WINDOW_PADDING = Settings.CHIP_WIDTH / 18;


    constructor(game,array) {


        switch (array['type']){
            case 'item':
                this.itemWindow(game,array)
                break;
            case 'other':
                console.log('それ以外');
                break;
        }

    }

    itemWindow(game,itemListArray) {
        let windowBg = new Sprite(Window.ITEM_WIDTH + Window.WINDOW_PADDING * 2,Window.ITEM_HEIGHT * itemListArray['data'].length + Window.WINDOW_PADDING_HEIGHT * 2);
        let windowBgS = new Surface(Window.ITEM_WIDTH + Window.WINDOW_PADDING * 2,Window.ITEM_HEIGHT * itemListArray['data'].length + Window.WINDOW_PADDING_HEIGHT * 2);
        windowBg.x = itemListArray['x'];
        windowBg.y = itemListArray['y'];
        windowBgS.context.rect(1, 1, Window.ITEM_WIDTH + Window.WINDOW_PADDING * 2 -2 ,Window.ITEM_HEIGHT * itemListArray['data'].length + Window.WINDOW_PADDING_HEIGHT * 2 -2 );
        windowBgS.context.fillStyle = "rgba(0, 0, 0, .8)";
        windowBgS.context.fill();
        windowBgS.context.strokeStyle = "rgb(255, 255, 255)";
        windowBgS.context.stroke();
        windowBg.image = windowBgS;
        game.rootScene.addChild(windowBg);

        for (var i = 0; i < itemListArray['data'].length; i++) {
            let itemList = new Sprite(Window.ITEM_WIDTH,Window.ITEM_HEIGHT);
            //itemList.backgroundColor = '#000';
            console.log(Window.ITEM_HEIGHT * i + windowBg.y + Window.WINDOW_PADDING);
            itemList.x = windowBg.x + Window.WINDOW_PADDING;
            itemList.y = Window.ITEM_HEIGHT * i + windowBg.y + Window.WINDOW_PADDING_HEIGHT;
    		itemList.opacity = 0.7;

            console.log(itemList.y)
            let label = new Label();
            label.width = Window.ITEM_WIDTH - Window.PADDING;
    		label.font = "10px monospace";
    		label.color = "#ffffff";
    		label.text = itemListArray['data'][i]['name'];
    		label.x = itemList.x + Settings.CHIP_WIDTH / 3;
    		label.y = Window.ITEM_HEIGHT * i + windowBg.y + Window.WINDOW_PADDING_HEIGHT + 1.5;

            game.rootScene.addChild(itemList);
    		game.rootScene.addChild(label);
        }
	}

}
