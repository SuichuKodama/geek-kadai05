var Game = {
  display: null,

  init: function() {
      this.display = new ROT.Display();
      document.body.appendChild(this.display.getContainer());
  }
}

Game.map = {};
Game._generateMap = function() {
  var digger = new ROT.Map.Digger();
  var freeCells = [];

  var digCallback = function(x, y, value) {
      if (value) { return; } /* do not store walls */

      var key = x+","+y;
      freeCells.push(key);
      this.map[key] = ".";
  }
  digger.create(digCallback.bind(this));

  this._generateBoxes(freeCells);

  this._drawWholeMap();
};

Game.ananas = null;

Game._generateBoxes = function(freeCells) {
  for (var i=0;i<10;i++) {
      var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
      var key = freeCells.splice(index, 1)[0];
      this.map[key] = "*";
      if (!i) { this.ananas = key; } /* first box contains an ananas */
  }
};

Game._drawWholeMap = function() {
  for (var key in this.map) {
      var parts = key.split(",");
      var x = parseInt(parts[0]);
      var y = parseInt(parts[1]);
      this.display.draw(x, y, this.map[key]);
  }
}

//プレイヤーキャラクター
var Player = function(x, y) {
  this._x = x;
  this._y = y;
  this._draw();
}

Player.prototype._draw = function() {
  Game.display.draw(this._x, this._y, "@", "#ff0");
}

Game.player = null;

Game._generateMap = function() {
  /* ...previous stuff... */
  this._createPlayer(freeCells);
};

Game._createPlayer = function(freeCells) {
  var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
  var key = freeCells.splice(index, 1)[0];
  var parts = key.split(",");
  var x = parseInt(parts[0]);
  var y = parseInt(parts[1]);
  this.player = new Player(x, y);
};


//ゲームターンエンジンの準備
Game.engine = null;

Game.init = function() {
    var scheduler = new ROT.Scheduler.Simple();
    scheduler.add(this.player, true);
    this.engine = new ROT.Engine(scheduler);
    this.engine.start();
}

//アクターとエンジン間のインタラクション
Player.prototype.act = function() {
  Game.engine.lock();
 /* ユーザー入力を待ちます。ユーザーがキーを押したときに処理を実行します */
  window.addEventListener("keydown", this);
}

   /* ユーザー入力を処理します */
Player.prototype.handleEvent = function(e) {

   //キーボードを操作してプレーヤーを移動する
  var keyMap = {};
  keyMap[38] = 0;
  keyMap[33] = 1;
  keyMap[39] = 2;
  keyMap[34] = 3;
  keyMap[40] = 4;
  keyMap[35] = 5;
  keyMap[37] = 6;
  keyMap[36] = 7;

  var code = e.keyCode;
  if (code == 13 || code == 32) {
    this._checkBox();
    return;
  } 

  if (!(code in keyMap)) { return; }

  var diff = ROT.DIRS[8][keyMap[code]];
  var newX = this._x + diff[0];
  var newY = this._y + diff[1];

  var newKey = newX + "," + newY;
  if (!(newKey in Game.map)) { return; }  /* この方向には移動できません */ 

  Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
  this._x = newX;
  this._y = newY;
  this._draw();
  window.removeEventListener("keydown", this);
  Game.engine.unlock();
}


Player.prototype._checkBox = function() {
  var key = this._x + "," + this._y;
  if (Game.map[key] != "*") {
      alert("ここにはボックスがありません!");
  } else if (key == Game.ananas) {
      alert(" 「万歳！あなたはアナナスを見つけて、このゲームに勝ちました。」");
      Game.engine.lock();
      window.removeEventListener("keydown", this);
  } else {
      alert("このボックスは空です :-(");
  }
}