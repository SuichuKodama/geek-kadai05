//canvas設定
const canvas = document.getElementById('canvas')
canvas.width = 640;
canvas.height = 640;

//コンテキストを取得
const context = canvas.getContext('2d')

//キャラ画像
const kappa = new Object();
kappa.img = new Image();
kappa.img.src = '/assets/img/kappa.png'
kappa.x = 0;
kappa.y = 0;
kappa.move = 0;

//キーボードのオブジェクト
const key = new Object();
key.up = false;
key.down = false;
key.right = false;
key.left = false;
key.push = '';

//メインループ
function main() {
  //塗（ぬ）りつぶす色を指定（してい）
	context.fillStyle = "rgb( 0, 0, 0 )";
	//塗（ぬ）りつぶす
	context.fillRect(0, 0, 640, 640);

  //画像の表示
  context.drawImage( kappa.img, kappa.x, kappa.y );  

  //キーボード押された時、話した時のイベント
  addEventListener('keydown', keydownfunc, false);
  addEventListener('keyup', keyupfunc, false);

  //方向キーが押されている場合、かっぱ移動
  if (kappa.move === 0) {
    if (key.left === true) {
      kappa.move = 32;
      key.push = 'left';
    }
    if (key.up === true) {
      kappa.move = 32;
      key.push = 'up';
    }
    if (key.right === true) {
      kappa.move = 32;
      key.push = 'right';
    }
    if (key.down === true) {
      kappa.move = 32;
      key.push = 'down';
    }
  }
  
  //kappa.moveが０より大きい場合場合は、4pxずるつ移動
  if (kappa.move > 0) {
    kappa.move -= 4;
    if (key.push === 'left') kappa.x -= 4;
    if (key.push === 'up') kappa.y -= 4;
    if (key.push === 'right') kappa.x += 4;
    if (key.push === 'down') kappa.y += 4;
  }

  requestAnimationFrame( main );

}

//画像の表示
addEventListener('load', main(), false);

//キーボードが押されたときに呼び出される関数（かんすう）
function keydownfunc( event ) {
	const key_code = event.keyCode;
	if( key_code === 37 ) key.left = true;
	if( key_code === 38 ) key.up = true;
	if( key_code === 39 ) key.right = true;
	if( key_code === 40 ) key.down = true;
	event.preventDefault();
}

//キーボードが放（はな）されたときに呼び出される関数
function keyupfunc( event ) {
	const key_code = event.keyCode;
	if( key_code === 37 ) key.left = false;
	if( key_code === 38 ) key.up = false;
	if( key_code === 39 ) key.right = false;
	if( key_code === 40 ) key.down = false;
}

