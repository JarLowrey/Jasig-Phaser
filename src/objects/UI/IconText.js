/* jshint esversion: 6 */

/*
 * IconText
 * ====
 *
 */
import ParentSprite from '../../objects/Sprites/Parents/ParentSprite';


export default class IconText extends Phaser.Group {

  constructor(game, fontHeight,
    text, style, iconKey, iconFrame, marginBtwSpriteAndText, bgKey, bgFrame) {
    super(game);

    this.marginBtwSpriteAndText = marginBtwSpriteAndText;

    style = this.game.fonts[style] || this.game.fonts['text'];
    style.fontSize = fontHeight;
    this.text = this.game.add.text(0, 0, text, style);

    this.image = this.game.add.image(0, 0, iconKey, iconFrame);
    this.image.height = this.text.height;
    this.image.scale.x = this.image.scale.y;

    //set text to left of image
    this.text.anchor.setTo(0, 0.5);
    this.image.anchor.setTo(1, 0.5);
    this.text.x = marginBtwSpriteAndText;

    if (bgKey) {
      this.graphic = this.game.add.image(-this.width / 2, -this.height / 2, bgKey, bgFrame);
      this.addChild(this.graphic);
    }
    this.addChild(this.text);
    this.addChild(this.image);
  }

  setPressable(width, outlineWidth, outlineColor, bgColor, outlineColorPressed, bgColorPressed, pressFunction) {
    if (this.graphic) this.graphic.kill();
    if (this.graphicPressed) this.graphicPressed.kill();

    this.graphic = this.getBg(width, outlineWidth, 10, outlineColor, bgColor);
    this.graphicPressed = this.getBg(width, outlineWidth, 10, outlineColorPressed, bgColorPressed);
    this.outlineWidth = outlineWidth;

    this.addChild(this.graphicPressed);
    this.addChild(this.graphic);
    this.bringToTop(this.text);
    this.bringToTop(this.image);

    //make this group clickable
    this.setAll('inputEnabled', true);
    this.callAll('events.onInputDown.add', 'events.onInputDown', this.onDown, this);
    this.callAll('events.onInputUp.add', 'events.onInputUp', this.onUp, this);
    this.pressFunction = pressFunction;
  }
  changePressFunction(pressFunction) {
    this.pressFunction = pressFunction;
  }
  onDown() {
    this.swapChildren(this.graphicPressed, this.graphic);
  }
  onUp() {
    this.swapChildren(this.graphicPressed, this.graphic);
    this.pressFunction();
  }
  getBg(width, outlineLen, radius, outlineColor, bgColor) {
    var graphic = this.game.add.graphics(0, 0);
    graphic.anchor.setTo(0.5, 0.5);
    const height = this.height * 1.5;

    //outline
    graphic.lineStyle(outlineLen, outlineColor, 1);
    graphic.drawRoundedRect(-width / 2, -height / 2, width, height, radius);

    graphic.beginFill(bgColor);
    graphic.drawRoundedRect(-width / 2, -height / 2, width, height, radius);
    graphic.endFill();

    return graphic;
  }

  update() {
    //this.game.debug.geom(this.text.getBounds()); //better way of showing the bounding box when debugging
    //this.game.debug.geom(this.image.getBounds()); //better way of showing the bounding box when debugging
  }

  setText(txt) {
    this.text.setText(txt);

    if (this.graphic && this.graphicPressed && this.image) {
      //image and text have their right and left edges on the mid-line (respectively). Find the max of their dimensions, and double it for a centered graphic
      /*
            const width = Math.max(this.text.width, this.image.width);
            const height = Math.max(this.text.height, this.image.height);
            this.graphic.width = width * 2;
            this.graphic.height = height * 2;

            this.graphicPressed.width = width * 2;
            this.graphicPressed.height = height * 2;
            */

    }
  }

  kill() {
    this.exists = false;

    if (this.graphic) this.graphic.kill();
    if (this.graphicPressed) this.graphicPressed.kill();

    this.image.kill();
    this.text.kill();
  }

  reset() {
    this.exists = true;
    this.alpha = 1;

    //Common usage of IconText will  be to show the gold amount when an enemy ship dies. Set up variables for that use-case below.
    //Needs to be in reset rather than constructor as you cannot change the properties of a tween after setting them the first time.
    this.fadeOutTween = this.game.add.tween(this).to({
      y: '-' + (25), //tween it relative to the current position. Needs to be a string
      alpha: 0
    }, 750, Phaser.Easing.Linear.In);
    this.fadeOutTween.onComplete.add(function() {
      this.kill();
    }, this);

    if (this.graphic) this.graphic.reset();
    if (this.graphicPressed) this.graphicPressed.reset();

    this.image.reset();
    this.text.reset();
  }

  fadeOut(text, x, y) {
    this.reset();
    this.alpha = 1;

    this.setText(text);

    this.x = x;
    this.y = y;

    this.fadeOutTween.start();
  }
}
