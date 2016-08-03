/*
 * IconText
 * ====
 *
 */

import UiHandler from '../objects/UiHandler';

export default class IconText extends Phaser.Group {

  constructor(game, x, y, fontHeight,
    text, style, iconKey, iconFrame, whereIconGoesRelativeToText, marginBtwSpriteAndText){
    super(game);

    this.x = x;
    this.y = y;

    style = this.game.fonts[style] || this.game.fonts["text"];
    style.fontSize = fontHeight;
    this.text = this.game.add.text(0,0,text,style);

    this.image = this.game.add.image(0,0,iconKey,iconFrame);
    this.image.height = this.text.height;
    this.image.scale.x = this.image.scale.y;

    if(whereIconGoesRelativeToText == 'left'){
      this.text.anchor.setTo(0,0.5);
      this.image.anchor.setTo(1,0.5);
    }else{
      this.text.anchor.setTo(1,0.5);
      this.image.anchor.setTo(0,0.5);
    }

    this.add(this.text);
    this.add(this.image);
  }

  setText(txt){
    this.text.setText(txt);
  }

  kill(){
    this.text.kill();
    this.image.kill();

    this.exists = false;
  }

  revive(){
    this.exists = true;
    this.alpha = 1;

    this.text.revive();
    this.image.revive();
  }
}
