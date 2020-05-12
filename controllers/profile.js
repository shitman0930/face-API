
 const handleProfileGet = (req, res, db)=> {
	const{ id } = req.params;//{ id }就要求的參數
	db.select('*').from('users').where({id})//knex的功能, 抓取特定的id資訊
	.then(user => {
		if(user.length) {
			res.json(user[0]);//因為要抓取user[] 所以要加[0]
		} else {
			res.status(400).json('NOT FOUND !')
		}
	})
	.catch(err => res.status(400).json('error getting user !'))//postman還是空白的 因為[]有回傳的話就是true
}

module.exports = {
	handleProfileGet
};//es6之後get直接這樣就可以 不用值