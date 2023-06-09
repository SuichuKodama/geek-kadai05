// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, push, set, onChildAdded, remove, onChildRemoved, update }from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to database
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6b2s1HZUZTky5hl4H7r_B8hENBKFcVtM",
  authDomain: "geek-kadai05.firebaseapp.com",
  projectId: "geek-kadai05",
  storageBucket: "geek-kadai05.appspot.com",
  messagingSenderId: "500603958385",
  appId: "1:500603958385:web:c53469799ef362772097d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app); //RealtimeDBに接続
const dbRef = ref(db, "position"); //RealtimeDB内の"position"を使う



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

//マップチップのImageオブジェクト
var mapchip = new Image();
mapchip.src = '/assets/img/map.png';

//キーボードのオブジェクト
const key = new Object();
key.up = false;
key.down = false;
key.right = false;
key.left = false;
key.push = '';

//マップの作成
let map = [
	[0, 0, 1, 0, 1, 0, 0, 0 ,0 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,1 ,0],
	[0, 1, 0, 0, 0, 1, 1, 1 ,0 ,1 ,0 ,1 ,1 ,0 ,1 ,1 ,1 ,0 ,1 ,0],
	[0, 0, 1, 1, 0, 0, 0, 1 ,0 ,0 ,0 ,1 ,0 ,0 ,0 ,1 ,0 ,0 ,0 ,0],
	[1, 0, 1, 0, 1, 1, 0, 0 ,0 ,1 ,1 ,1 ,1 ,1 ,0 ,0 ,1 ,0 ,1 ,0],
	[0, 0, 0, 0, 0, 1, 1, 1 ,0 ,1 ,0 ,0 ,0 ,0 ,1 ,1 ,0 ,1 ,1 ,0],
	[0, 1, 1, 1, 0, 0, 0, 0 ,0 ,1 ,0 ,1 ,1 ,1 ,0 ,1 ,0 ,0 ,0 ,0],
	[0, 1, 1, 1, 0, 1, 1, 1 ,1 ,1 ,0 ,1 ,0 ,0 ,0 ,0 ,1 ,1 ,1 ,0],
	[0, 0, 0, 1, 0, 0, 0, 0 ,1 ,0 ,0 ,1 ,0 ,1 ,1 ,0 ,0 ,0 ,1 ,0],
	[1, 1, 0, 1, 1, 1, 1, 1 ,1 ,0 ,1 ,1 ,0 ,0 ,1 ,1 ,1 ,0 ,1 ,1],
	[1, 0, 0, 0, 0, 0, 1, 1 ,0 ,0 ,0 ,0 ,1 ,0 ,1 ,1 ,0 ,0 ,1 ,0],
	[1, 0, 1, 1, 1, 0, 0, 0 ,1 ,0 ,1 ,0 ,0 ,0 ,0 ,0 ,1 ,1 ,0 ,0],
	[1, 0, 1, 0, 1, 1, 1, 0 ,1 ,0 ,1 ,1 ,0 ,1 ,1 ,0 ,0 ,0 ,0 ,1],
	[0, 0, 1, 0, 0, 1, 0, 0 ,1 ,0 ,0 ,1 ,0 ,1 ,0 ,1 ,1 ,1 ,0 ,0],
	[0, 1, 1, 1, 0, 1, 0, 1 ,0 ,0 ,1 ,1 ,0 ,1 ,0 ,1 ,1 ,0 ,1 ,0],
	[0, 0, 0, 1, 0, 1, 0, 0 ,1 ,0 ,1 ,1 ,0 ,1 ,0 ,0 ,0 ,0 ,0 ,0],
	[1, 1, 0, 1, 0, 1, 0, 1 ,1 ,0 ,0 ,1 ,0 ,1 ,1 ,0 ,1 ,1 ,1 ,0],
	[0, 0, 0, 1, 0, 1, 1, 1 ,1 ,1 ,0 ,1 ,0 ,1 ,1 ,0 ,0 ,0 ,1 ,0],
	[0, 1, 1, 1, 0, 1, 0, 0 ,0 ,0 ,0 ,1 ,0 ,0 ,0 ,1 ,1 ,0 ,1 ,1],
	[0, 1, 0, 0, 0, 1, 0, 1 ,1 ,1 ,0 ,0 ,1 ,1 ,0 ,1 ,0 ,0 ,0 ,0],
	[0, 0, 0, 1, 0, 0, 0, 1 ,1 ,1 ,1 ,0 ,0 ,0 ,1 ,1 ,1 ,1 ,1 ,0]
];

//メインループ
function main() {

  //塗（ぬ）りつぶす色を指定（してい）
	context.fillStyle = "rgb( 0, 0, 0 )";
	//塗（ぬ）りつぶす
	context.fillRect(0, 0, 640, 640);

  //マップチップを表示する
  for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if ( map[y][x] === 0 ) context.drawImage( mapchip, 0, 0, 32, 32, 32*x, 32*y, 32, 32 );
			if ( map[y][x] === 1 ) context.drawImage( mapchip, 32, 0, 32, 32, 32*x, 32*y, 32, 32 );
		}
	}

  //画像の表示
  context.drawImage( kappa.img, kappa.x, kappa.y );  

  //キーボード押された時、はなした時のイベント
  addEventListener('keydown', keydownfunc, false);
  addEventListener('keyup', keyupfunc, false);


  //方向キーが押されている場合、かっぱ移動
  if (kappa.move === 0) {
    if (key.left === true) {
      let x =  kappa.x / 32;
      let y =  kappa.y / 32;
      x--;
      if ( map[y][x] === 0 ) {
        kappa.move = 32;
        key.push = 'left';
      }
    }
    if (key.up === true) {
      let x =  kappa.x / 32;
      let y =  kappa.y / 32;
      if ( y > 0 ) {
        y--;
        if ( map[y][x] === 0 ) {
          kappa.move = 32;
          key.push = 'up';
        }
      }
    }
    if (key.right === true) {
      let x =  kappa.x / 32;
      let y =  kappa.y / 32;
      x++;
      if ( map[y][x] === 0 ) {
        kappa.move = 32;
        key.push = 'right';
      }
    }
    if (key.down === true) {
      let x =  kappa.x / 32;
      let y =  kappa.y / 32;
      if ( y < 19 ) {
        y++;
        if ( map[y][x] === 0 ) {
          kappa.move = 32;
          key.push = 'down';
        }
      }
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

//キーボードがはなされたときに呼び出される関数
function keyupfunc( event ) {
	const key_code = event.keyCode;
	if( key_code === 37 ) key.left = false;
	if( key_code === 38 ) key.up = false;
	if( key_code === 39 ) key.right = false;
	if( key_code === 40 ) key.down = false;

  const xposition = kappa.x;
  const yposition = kappa.y;

  const coordinate = {
    x: xposition,
    y: yposition
  }

  // const newPostRef = push(dbRef);
  set(dbRef, coordinate);

  console.log(kappa.x, 'はなした')
  console.log(kappa.y, 'はなした')
}






