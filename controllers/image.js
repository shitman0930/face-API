const Clarifai = require('clarifai');//從前端改到這邊比較安全

const app = new Clarifai.App({//就都從網站複製貼上的
 apiKey: '38084e90f9634ccd9efb9fb0a13b823c'
});

const handleApiCall = (req, res) => {
	app.models
	   .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	   .then(data => {
	   	res.json(data);
	   })
	   .catch(err => res.status(400).json('unable to work with API !'))
}


// Clarifai.COLOR_MODEL,//直接去原始碼抓model,會在console裡的output的data裡的color裡顯示圖片的顏色百分比組成
//我們要用的是這個model, output/data/regions/region_info/bounding_box 會有各部份組成百分比
// "a403429f2ddf4b49b307e318f00e528b", //api key, 可以免費點5000次/月
//這邊改成this.state.imageUrl會有錯 
//因為setState的特有語法,由於各種原因(主要是性能），在React中調用setState()是異步的。在幕後，React會將對setState()的多個調用分批處理到一個調用中，然後一次重新渲染該組件，而不是針對每個狀態更改都重新渲染(這是AJAX)。因此，imageUrl參數在我們的示例中將永遠無法工作，因為當我們使用預測函數調用Clarifai時，React尚未完成狀態的更新。
//解決此問題的一種方法是使用回調函數：
//setState(updater, callback)

const handleImage = (req, res, db)=> {//會更新entries
  const{ id } = req.body;//{ id }就要求的body(!?)
	db('users').where('id', '=', id)
    .increment('entries', 1)//就輸入一次網址增加一次
    .returning('entries')
    .then(entries => {
    	res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImage, handleApiCall
};//es6之後, put也不用回傳值, ApiCall沒加到 害我找半天=.,=