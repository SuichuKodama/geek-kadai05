// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, push, set, onChildAdded, remove, onChildRemoved }from "firebase/database";
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
const dbRef = ref(db, "position"); //RealtimeDB内の"chat"を使う


//データ登録(Click)
const $sendBtn = document.getElementById('send')
const $uname = document.getElementById('uname')
const $text = document.getElementById('text')

$sendBtn.addEventListener('click', function(){
    const unameValue = $uname.value;
    const textValue = $text.value;

    const msg = {
        uname: unameValue,
        text: textValue
    };
    // alert(uname + text);

    const newPostRef = push(dbRef); //ユニークkeyを生成
    set(newPostRef, msg);

    //入力した後に空っぽにする

})

//データ登録(Enter)


//最初にデータ取得＆onSnapshotでリアルタイムにデータを取得
const $output = document.getElementById('output')

onChildAdded(dbRef, function(data){
    const msg = data.val(); //オブジェクトデータを取得
    const key = data.key; //データのユニークキー

    console.log(msg)
    console.log(key)

    // let h = `
    // <ul class="list">
    //     <li class="item">${msg.uname}</li>
    //     <li class="item">${msg.text}</li>
    // </ul>
    // `; 

    // $("#output").append(h);

    $output.innerHTML += `
        <div class="message-box">
            <div class="user-name">${msg.uname}</div>
            <div class="text">${msg.text}</div>
        </div>
    `;
})

