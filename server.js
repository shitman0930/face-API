const express = require('express');
const bodyParser = require('body-parser');//有用req.body json就要設定這個 不然就會錯誤
const bcrypt = require('bcrypt-nodejs');//這個要更新, 現在還是先用這個傳密碼
const cors = require('cors');//這個是連接前端跟後端的工具, 想了解去看283資料夾
const knex = require('knex');// 伺服器跟資料庫做連接

const register = require('./controllers/register');//分門別類route
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db =knex({
  client: 'pg',//就改postgresql
  connection: {
    host : '127.0.0.1',
    user : 'postgres',//要輸入postgres 之前建立的postgres使用者名稱
    password : '1234',//資料庫密碼也要打 不然連不到
    database : 'facedetection'//資料庫建在哪就哪
  }
});



const app = express();

app.use(bodyParser.json());//有用req.body json就要設定這個 不然就會錯誤
app.use(cors());//用了就不會出錯了會讀到後端的database, localhost要改一下 不然兩個都3000也會錯

app.get('/', (req, res) => { res.send(' it is working !') })//在postman的get貼上localhost3000/按send會回應上面的users; 因為會重跑, 所以要加Ann的話, 要去postman /register重跑一次, 再跑/ database才會多1個Ann
app.post('/signin', signin.handleSignin(db ,bcrypt))//就跟register一樣, req跟res其實系統會自動回傳, 去controller裡的signin.js改成功能中的功能
app.post('/register', (req, res) => { register.handleRegister(req, res, db , bcrypt) })//整段拿去controllers裡的register.js, 另設功能, 因為db跟bcrypt(dependency injection)在register.js會有錯 所以這邊也要設定回傳才不會有錯
app.get('/profile/:id',(req, res) => { profile.handleProfileGet(req, res, db)})//
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})


// 	bcrypt.hash(password, null, null, function(err, hash) {//用在register, 密碼在後端就會一堆亂碼, 而且每輸入一次就變一次
//     console.log(hash);
// });
// bcrypt.compare("apples", '$2a$10$vVS15GObZDUf1whuUOhGyuyW5h/g4PoG4QTcWAtElpITjjk6acKqu', function(err, res) {//signin之後就比較密碼, 也是後端傳回亂碼
//     console.log('first guess', res)//這會true
// });
// bcrypt.compare("veggies", '$2a$10$vVS15GObZDUf1whuUOhGyuyW5h/g4PoG4QTcWAtElpITjjk6acKqu', function(err, res) {
//     console.log('first guess', res)//這會false
// });

app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port ${ process.env.PORT }`);//就看一下有沒有開始監控啦
})

/*
/---> res = This is owrking !
/signin ---> POST = success/fail
/register ---> POST = user
/profile/user:id ---> GET = user
/image ---> PUT --> user

*/ 
