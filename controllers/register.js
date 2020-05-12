
const handleRegister = (req, res, db , bcrypt)=> {//要多設定db跟bcrypt
	const {email, name, password } = req.body;
	if(!email || !name || !password) {//沒return 就算是if符合 下面的trx會繼續跑
		return res.status(400).json('incorrect from submission !');
	}
	const hash = bcrypt.hashSync(password);//儲存密碼
    db.transaction(trx => {//knex的功能, 同時抓取數據到login table跟users table
        trx.insert({
        	hash: hash,//hash bcrypt所接受的資訊
        	email: email
        })
        .into('login')//進到login table
        .returning('email')
        .then(loginEmail => {
        	return trx('users')//進到user table
			    .returning('*')
			    .insert({
			       email: loginEmail[0],//記得要加[0], 不然會回傳{}
			       name: name,//password要另外加密
			       joined: new Date()//就連接資料庫的join(使用者何時加入的)
			    })
			    .then(user => {
			    	res.json(user[0]);//就加到table的最後面
			    })
		    })
        .then(trx.commit)//沒加這個就不會傳到users table and login table
        .catch(trx.rollback)//失敗就回到之前狀態, 然後開始做/signin
    })
	    .catch(err => res.status(400).json('unable to register'))//直接回err會暴露太多伺服器資訊
  }

module.exports = {
	handleRegister: handleRegister
};