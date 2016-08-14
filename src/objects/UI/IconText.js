/*
 * IconText
 * ====
 *
 */
import ParentSprite from '../../objects/Sprites/ParentSprite';


export default class IconText extends Phaser.Group {

  constructor(game, x, y, fontHeight,
    text, style, iconKey, iconFrame, whereIconGoesRelativeToText, marginBtwSpriteAndText){
    super(game);

    this.x = x;
    this.y = y;

    style = this.game.fonts[style] || this.game.fonts['text'];
    style.fontSize = fontHeight;
    this.text = this.game.add.text(0,0,text,style);

    this.image = this.game.add.image(0,0,iconKey,iconFrame);
    this.image.height = this.text.height;
    this.image.scale.x = this.image.scale.y;

    if(whereIconGoesRelativeToText == 'left'){
      this.text.anchor.setTo(0,0.5);
      this.image.anchor.setTo(1,0.5);
      this.text.x = marginBtwSpriteAndText;
    }else{
      this.text.anchor.setTo(1,0.5);
      this.image.anchor.setTo(0,0.5);
      this.image.x = marginBtwSpriteAndText;
    }

    this.add(this.text);
    this.add(this.image);
  }

  setText(txt){
    this.text.setText(txt);
  }

  kill(){
    this.exists = false;

    this.image.kill();
    this.text.kill();
  }

  reset(){
    this.exists = true;
    this.alpha = 1;

    //Common usage of IconText will  be to show the gold amount when an enemy ship dies. Set up variables for that use-case below.
    //Needs to be in reset rather than constructor as you cannot change the properties of a tween after setting them the first time.
    this.goldTween = this.game.add.tween(this).to({y:'-'+ParentSprite.dp(25), //tween it relative to the current position. Needs to be a string
     alpha: 0}, 750, Phaser.Easing.Linear.In);
    this.goldTween.onComplete.add(function(){ this.kill(); }, this);

    this.image.reset();
    this.text.reset();
  }

  showGoldText(resourceValue, x, y){
    if(!resourceValue || resourceValue <= 0) return;

    this.reset();

    this.setText(resourceValue);

    this.x = x;
    this.y = y;

    this.goldTween.start();
  }
}
