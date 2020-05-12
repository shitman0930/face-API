
const handleSignin = (db, bcrypt) => (req, res)  => {
	const { email, password } = req.body;
	if(!email || !password) {//沒return 就算是if符合 下面的trx會繼續跑
		return res.status(400).json('incorrect from submission !');
	}
	db.select('email', 'hash').from('login')//從login抓取email跟密碼
	  .where('email', '=', email)
	  .then(data => {
	  	 const isValid = bcrypt.compareSync(password, data[0].hash);//從bcrypt複製貼上改一下 比較密碼有無錯誤
	  	 if(isValid) {//isValid就已驗證
	  	 	return db.select('*').from('users')//email跟密碼正確就進到users table
	  	 	  .where('email', '=', email)
	  	 	  .then(user => {
	  	 	  	res.json(user[0])
	  	 	  })
	  	 	  .catch(err => res.status(400).json('unable to get user !'))//只是檢查, 所以不用trx 沒有修改任何東西
	  	 } else {
              res.status(400).json('wrong credentials !')
	  	 }
	  })
	  .catch(err => res.status(400).json('wrong credentials'))//就認證錯誤
}

module.exports = {
	handleSignin: handleSignin
};