var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('imagesdb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'imagedb' database");
        db.collection('images', {strict:true}, function(err, collection) {
            if (err) {
                console.log("Image's collection does not exist.");
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = parseInt(req.params.id);
    db.collection('images', function(err, collection) {
        collection.findOne({'id':id}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findRandom = function(req, res) {
    db.collection('images', function(err, collection) {
        collection.count(function(err, count) {
            console.log("size: " + count);
            var id = Math.floor((Math.random() * count) + 1); //between 1 and 10
            console.log('Selecting random image. id: ' + id);
            collection.findOne({'id':id}, function(err, item) {
                res.send(item);
            });    
        });
        
    });
};

exports.addImage = function(req, res) {
    var image = req.body;
    console.log('Adding images: ' + JSON.stringify(image));
    db.collection('images', function(err, collection) {
        collection.insert(image, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateImage = function(req, res) {
    var id = parseInt(req.params.id);
    var image = req.body;
    console.log('Updating images: ' + id);
    console.log(JSON.stringify(image));
    db.collection('images', function(err, collection) {
        collection.update({'id':id}, image, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating images: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send({'result':"'success'"});
            }
        });
    });
}

exports.deleteImage = function(req, res) {
    var id = req.params.id;
    console.log('Deleting images: ' + id);
    db.collection('images', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}