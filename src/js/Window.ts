import {Image, Settings, DungeonChip} from "./Settings";

declare var Sprite;
declare var Surface;
declare var Label;
declare var Scene;

export class Window {

    static PADDING = Settings.CHIP_WIDTH;
	static ITEM_HEIGHT = Settings.CHIP_HEIGHT / 2;
	static ITEM_WIDTH = Settings.CHIP_WIDTH * 3;
	static WINDOW_PADDING_HEIGHT = Settings.CHIP_WIDTH / 5;
	static WINDOW_PADDING = Settings.CHIP_WIDTH / 18;

	private label: any;
	private itemList: any;
	private selectNum: number;

    constructor(game,array) {
        this.selectNum = 0;
        let _this = this;

        switch (array['type']){
            case 'item':
                _this.itemWindow(game,array);
                break;
            case 'command':
                console.log('コマンド');
                break;
            default:
                console.log('デフォルト');
                break;
        }

        game.addEventListener('downbuttondown', function(){
            _this.selectDown();
        });

        game.addEventListener('upbuttondown', function(){
            _this.selectUp();
        });


    }

    selectDown = function (){
        if(this.selectNum < this.itemList.length-1) {
            this.selectNum ++;
        }
        this.select();
    }

    selectUp = function (){
        if(this.selectNum > 0) {
            this.selectNum --;
        }
        this.select();
    }

    select = function (){
        console.log(this.selectNum);
        for (var n = 0; this.itemList.length > n; n++ ){
            if( n == this.selectNum ) {
                this.itemList[n].backgroundColor = 'rgba(255, 255, 255, .2)';
            } else {
                this.itemList[n].backgroundColor = '';
            };

        }
    }

    WindowOpen = function (game) {

    }

    commandWindow = function (game,commandArray) {

    }

    defaultWindow = function (game,windowArray) {

    }


    itemWindow = function (game,itemListArray) {
        let itemWindowWidth = Window.ITEM_WIDTH + Window.WINDOW_PADDING * 2;
        let itemWindowHeight = Window.ITEM_HEIGHT * itemListArray['data'].length + Window.WINDOW_PADDING_HEIGHT * 2;
        let windowBg = new Sprite();
        let windowBgS = new Surface(itemWindowWidth,itemWindowHeight);
        this.itemList = [];
        this.label = [];

        windowBg.height = itemWindowHeight;
        windowBg.width = itemWindowWidth;
        windowBg.x = itemListArray['x'];
        windowBg.y = itemListArray['y'];
        windowBgS.context.fillStyle = "rgba(0, 0, 0, .8)";
        windowBgS.context.fillRect (1, 1, itemWindowWidth-2, itemWindowHeight-2);
        windowBgS.context.strokeStyle = "rgb(255, 255, 255)";
        windowBgS.context.strokeRect (1, 1, itemWindowWidth-2, itemWindowHeight-2);
        windowBg.image = windowBgS;
        game.rootScene.addChild(windowBg);

        for (var i = 0; i < itemListArray['data'].length; i++) {
            this.itemList[i] = new Sprite(Window.ITEM_WIDTH,Window.ITEM_HEIGHT);
            this.itemList[i].x = windowBg.x + Window.WINDOW_PADDING;
            this.itemList[i].y = Window.ITEM_HEIGHT * i + windowBg.y + Window.WINDOW_PADDING_HEIGHT;
    		this.itemList[i].opacity = 0.7;
            this.label = new Label();
            this.label.width = Window.ITEM_WIDTH - Window.PADDING;
            this.label.font = "10px monospace";
            this.label.color = "#ffffff";
            this.label.text = itemListArray['data'][i]['name'];
            this.label.x = this.itemList[i].x + Settings.CHIP_WIDTH / 3;
            this.label.y = this.itemList[i].y + 1.5;

            game.rootScene.addChild(this.itemList[i]);
    		game.rootScene.addChild(this.label);
        }

        this.select();
	}

}
