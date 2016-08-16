/*
Class modified from http://jsfiddle.net/lewster32/0yvemxnw/
*/

export default class PieProgress extends Phaser.Sprite{

  constructor(game, x, y, radius, color = '#ffffff', angle = -90, text, style){
    super(game,x,y);

    this.setRadius(radius);
    this.setStyle(style);
    this._progress = 1;
    this.bmp = game.add.bitmapData(this.getRadius() * 2, this.getRadius() * 2);
    Phaser.Sprite.call(this, game, x, y, this.bmp);

    this.anchor.setTo(0.5,0.5);
    this.angle = angle;
    this.color = color;
    this.updateProgress();

    this.textItem = this.game.add.text(0,0, text, style);
    this.textItem.anchor.setTo(0.5, 0.4);
    this.addChild(this.textItem);
    this.textItem.angle = angle;
    this._text = text;
  }

  updateProgress(){
    var progress = this._progress;
    progress = Phaser.Math.clamp(progress, 0.00001, 0.99999);

    this.bmp.clear();
    this.bmp.ctx.fillStyle = this.color;
    this.bmp.ctx.beginPath();
    this.bmp.ctx.arc(this.getRadius(), this.getRadius(), this.getRadius(), 0, (Math.PI * 2) * progress, true);
    this.bmp.ctx.lineTo(this.getRadius(), this.getRadius());
    this.bmp.ctx.closePath();
    this.bmp.ctx.fill();
    this.bmp.dirty = true;
  }

  getText(){ return this._text; }
  setText(val){
    this._text = val;
    if(this.textItem) this.textItem.setText(this._text);
  }

  getStyle(){ return this._style; }
  setStyle(val = {font: '26px papercuts', fill: '#ffffff', stroke: '#535353', strokeThickness: 5}){
    this._style = val;
    if(this.textItem) this.textItem.setStyle(this._style);
  }

  getRadius(){ return this._radius; }
  setRadius(val = 20){
    this._radius = (val > 0 ? val : 0);
    if(this.bmp){
      this.bmp.resize(this.getRadius() * 2, this.getRadius() * 2);
      this.updateProgress();
    }
  }

  getProgress(){ return this._progress; }
  setProgress(val){
    this._progress = Phaser.Math.clamp(val, 0, 1);
    if(this.bmp) this.updateProgress();
  }
}
