/*
 * IconText
 * ====
 *
 */

export default class IconText extends Phaser.Group {

  constructor(game, diameter, iconKey, iconFrame, outlineLen, outlineColor, outlineColorPressed, bgColor, bgColorPressed, onPressedFunction) {
    super(game);

    this.outlineColor = outlineColor;
    this.outlineLen = outlineLen;
    this.outlineColorPressed = outlineColorPressed;
    this.bgColor = bgColor;
    this.bgColorPressed = bgColorPressed;

    this.graphic = this.getCircle(outlineLen, diameter, outlineColor, bgColor);
    this.graphicPressed = this.getCircle(outlineLen, diameter, outlineColorPressed, bgColorPressed);
    this.icon = game.add.image(0, 0, iconKey, iconFrame);
    this.icon.anchor.setTo(0.5, 0.5);
    this.icon.width = diameter * 0.75;
    this.icon.height = diameter * 0.75;

    this.addChild(this.graphicPressed);
    this.addChild(this.graphic);
    this.addChild(this.icon);

    //register click listeners
    this.setAll('inputEnabled', true);
    this.callAll('events.onInputDown.add', 'events.onInputDown', this.onDown, this);
    this.callAll('events.onInputUp.add', 'events.onInputUp', this.onUp, this);
    this.pressFunction = onPressedFunction;
  }

  onDown() {
    this.swapChildren(this.graphicPressed, this.graphic);
  }

  onUp() {
    this.swapChildren(this.graphicPressed, this.graphic);
    this.pressFunction();
  }

  getCircle(outlineLen, diameter, outlineColor, bgColor) {
    var graphic = this.game.add.graphics(0, 0);
    graphic.anchor.setTo(0.5, 0.5);

    //outline
    graphic.lineStyle(outlineLen, outlineColor, 1);
    graphic.drawCircle(0, 0, diameter);

    graphic.beginFill(bgColor);
    graphic.drawCircle(0, 0, diameter);
    graphic.endFill();

    return graphic;
  }

}
