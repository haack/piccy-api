var express = require('express'),
    images = require('./routes/images');
 
var app = express();
 
app.configure(function () {
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
});
 
app.get('/images', images.findRandom);
app.get('/images/:id', images.findById);
app.post('/images', images.addImage);
app.put('/images/:id', images.updateImage);
app.delete('/images/:id', images.deleteImage);
 
app.listen(3000);
console.log('Listening on port 3000...');