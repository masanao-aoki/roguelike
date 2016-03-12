declare var Sprite;
declare var Surface;

// フェードイン・フェードアウトを行うクラス
export class Fade {
	sprite: any; // Sprite
	blightness: number;
	constructor(width: number, height: number) {
		var sprite = new Sprite(width, height);
		var image = new Surface(width, height);
		image.clear();
		image.context.globalAlpha = 0; // 透明度の設定
		image.context.fillRect(0, 0, width, height); // 黒で塗りつぶす
		sprite.image = image;
		this.sprite = sprite;
		this.blightness = 0; // 完全に透明
	}
	fadeIn(speed: number): boolean {
		this.blightness -= speed; // 徐々に透明に
		var image = this.sprite.image;
		image.clear();
		image.context.globalAlpha = this.blightness; // 透明度の設定
		image.context.fillRect(0, 0, image.width, image.height); // 黒で塗りつぶす
		if (this.blightness <= 0) {
			return true;
		}
		return false;
	}
	fadeOut(speed: number): boolean {
		this.blightness += speed; // 徐々に不透明に
		var image = this.sprite.image;
		image.clear();
		image.context.globalAlpha = this.blightness; // 透明度の設定
		image.context.fillRect(0, 0, image.width, image.height); // 黒で塗りつぶす
		if (this.blightness >= 1) {
			return true;
		}
		return false;
	}
}