var express = require('express');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bodyParser = require('body-parser');


app.set('port', process.env.PORT || '5000');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/www"));
app.use(function (req, res, next) {

  /**  var allowedOrigins = ['https://localhost:5000','http://localhost:5000', 'https://purple-tunes.com', 'http://purpletunezform.herokuapp.com/', 'http://purple-tunes.com', '*.heroku.com','*.herokuapp.com'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }**/
    
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

mongoose.connect("mongodb://oalebio1:Thinkeasy1@ds023213.mlab.com:23213/heroku_l0vxdm4r"); 


var articleSchema = new Schema({
  date: {type: Date, required: true},
  text: {type: String, required: true},
  title: {type: String, required: true},
  author: {type: String, required: true},
  musicTag: {type: Array, default: []},
  artistTag: {type: Array, default: []},
  eventTag: {type: Array, default: []},
  imageURL: {type: String, required: false},
  hasBanner: {type: Boolean, default: false},
  bannerImageURL: {type: String, required: false}
}, {versionKey:false});


var artistSchema = new Schema({
  name: {type: String, required: true},
  bio: {type: String, required: true},
  imageURL: {type: String, required: false}
}, {versionKey:false});

var musicSchema = new Schema({
  date: {type: Date, required: true},
  text: {type: String, required: true},
  artist: {type: String, required: true},
  title: {type: String, required: true},
  author: {type: String, required: true},
  musicTag: {type: Array, default: []},
  artistTag: {type: Array, default: []},
  eventTag: {type: Array, default: []},
  imageURL: {type: String, required: false},
  audioURL: {type: String, required: false},
  videoURL: {type: String, required: false},
  isVideo: {type: Boolean, default: false},
  isAudio: {type: Boolean, default: false},
  isAlbum: {type: Boolean, default: false}
}, {versionKey:false});


var eventSchema = new Schema({
  date: {type: Date, required: true},
  title: {type: String, required: true},
  artist: {type: Array, default: []},
  location: {type: String, required: true},
  musicTag: {type: Array, default: []},
  artistTag: {type: Array, default: []},
  eventTag: {type: Array, default: []},
  eventURL: {type: String, required: true}
}, {versionKey:false});

var Article = mongoose.model('Article', articleSchema);
var Music = mongoose.model('Music', musicSchema);
var Artist = mongoose.model('Artist', artistSchema);
var Event = mongoose.model('Event', eventSchema);

app.post('/api/artist/new', function(req, res){
  //var postID = req.body.userID;
  var postName = req.body.name;
  var postBio = req.body.bio;
  var postImageURL = req.body.imageURL;

  var newArtist = new Artist({
    name: postName,
    bio: postBio,
    imageURL: postImageURL
    });
    
  newArtist.save(function(err, nU){
    if(err){
      res.status(400).send("Unknown Error, message:" +  err.message);
      return;
    }
    res.status(200).send(newArtist._id);
  })
});

app.get('/api/artist/page', function(req, res){
  var temp = req.query.pageLetter;
  var postPageLetter =  "^" +temp;
  //var skipBy = postPageSize*(postPageNumber-1);
//if isvideo or is album or is audio


  Artist.aggregate([
      {$match: {name: {$regex: postPageLetter}}}, // pageLetter contains letter 
      {$sort: {name: -1}},  //sort by name    
      {$project: {
        _id: 1,
        name: 1,
        bio: 1,
        imageURL: 1
      }}
    ], function(err, messages){
      if (err) {
        res.status(400).send("Unknown Error");
        return;
      }
    console.log(messages);
      res.status(200).send(messages);
  })
});

app.post('/api/artists/all', function(req, res){
  var postID = req.body.artistId;

  Artist.aggregate([
      {$match: {artistId: {$eq: postID}}},
      {$project: {
        _id: 1,
        name: 1,
        biography: 1,
        imageURL: 1,
        date: 1
      }}
    ], function(err, messages){
      if (err) {
        res.status(400).send("Unknown Error");
        return;
      }
    console.log(messages);
      res.status(200).send(messages);
  })
});

app.post('/api/artist/get', function(req, res){
  var postTransactionID = req.body.transactionID;
  Artist.findOne({_id: postTransactionID}, function(err, transaction){
    if (err || transaction == null){
      res.status(400).send("Unknown Error");
      return;
    }
    res.status(200).send(transaction);
  });
});

app.post('/api/artist/delete', function(req, res){
  var postTransactionID = req.body.transactionID;
  Artist.remove({_id: postTransactionID}, function(err, transaction){
    if (err || transaction == null){
      res.status(400).send("Unknown Error");
      return;
    }
    res.status(200).send(transaction);
  });
});

app.post('/api/artist/delete', function(req, res){
  var postTransactionID = req.body.transactionID;
  Artist.remove({_id: postTransactionID}, function(err, transaction){
    if (err || transaction == null){
      res.status(400).send("Unknown Error");
      return;
    }
    res.status(200).send(transaction);
  });
});

app.post('/api/event/new', function(req, res){
  //var postID = req.body.userID;
  var postArtist = req.body.artist;
  var postLocation = req.body.location;
  var postTitle = req.body.title;
  var postDate = req.body.date;
  var postMusicTag = req.body.musicTag;
  var postArtistTag = req.body.artistTag;
  var postEvenTag = req.body.eventTag;
  var postEventURL = req.body.eventURL;

  var newEvent = new Event({
    artist: postArtist,
    location: postLocation,
    title: postTitle,
    musicTag: postMusicTag,
    artistTag: postArtistTag,
    eventTag: postEvenTag,
    date: postDate,
    eventURL: postEventURL
  });
  newEvent.save(function(err, nU){
    if(err){
      res.status(400).send("Unknown Error, message:" +  err.message);
      return;
    }
    res.status(200).send(newEvent._id);
  })
});

app.post('/api/events/all', function(req, res){
  var postID = req.body.eventId;

  Event.aggregate([
      {$match: {eventId: {$eq: postID}}},
      {$project: {
        _id: 1,
        artist: 1,
        location: 1,
        title: 1,
        musicTag: 1,
        eventTag: 1,
        imageURL: 1,
        videoURL: 1,
        artistTag: 1,
        eventURL: 1,
        date: 1
      }}
    ], function(err, messages){
      if (err) {
        res.status(400).send("Unknown Error");
        return;
      }
    console.log(messages);
      res.status(200).send(messages);
  })
});

app.get('/api/events/page', function(req, res){
 //var postID = req.body._;
  var postPageSize = parseInt(req.query.pageSize);
  var postPageNumber = parseInt(req.query.pageNumber);
  var skipBy = postPageSize*(postPageNumber-1);
  var postID = req.body._;
//if isvideo or is album or is audio


  Event.aggregate([
      {$match: {eventId: {$eq: postID}}},
      {$sort: {date: -1}},
      {$skip: skipBy},
      {$limit: postPageSize},      
      {$project: {
        _id: 1,
        artist: 1,
        location: 1,
        title: 1,
        musicTag: 1,
        eventTag: 1,
        imageURL: 1,
        videoURL: 1,
        artistTag: 1,
        eventURL: 1,
        date: 1
      }}
    ], function(err, messages){
      if (err) {
        res.status(400).send("Unknown Error");
        return;
      }
    console.log(messages);
      res.status(200).send(messages);
  })
});

app.post('/api/music/new', function(req, res){
  //var postID = req.body.userID;
  var postAuthor = req.body.author;
  var postText = req.body.text;
  var postTitle = req.body.title;
  var postArtist = req.body.artist;
  var postDate = req.body.date;
  var postMusicTag = req.body.musicTag;
  var postArtistTag = req.body.artistTag;
  var postEvenTag = req.body.eventTag;
  var postImageURL = req.body.imageURL;
  var postAudioURL = req.body.audioURL;
  var postVideoURL = req.body.videoURL;
  var postIsVideo = req.body.isVideo;
  var postIsAudio = req.body.isAudio;
  var postIsAlbum = req.body.isAlbum;

  var newMusic = new Music({
    author: postAuthor,
    text: postText,
    title: postTitle,
    artist: postArtist,
    musicTag: postMusicTag,
    artistTag: postArtistTag,
    eventTag: postEvenTag,
    date: postDate,
    imageURL: postImageURL,
    audioURL: postAudioURL,
    videoURL: postVideoURL,
    isVideo: postIsVideo,
    isAudio: postIsAudio,
    isAlbum: postIsAlbum
  });

  newMusic.save(function(err, nU){
    if(err){
      res.status(400).send("Unknown Error, message:" +  err.message);
      return;
    }
    res.status(200).send(newMusic._id);
  })
});

app.post('/api/music/get', function(req, res){
  var postTransactionID = req.body.transactionID;
  Music.findOne({_id: postTransactionID}, function(err, transaction){
    if (err || transaction == null){
      res.status(400).send("Unknown Error");
      return;
    }
    res.status(200).send(transaction);
  });
});

app.post('/api/music/delete', function(req, res){
  var postTransactionID = req.body.transactionID;
  Music.remove({_id: postTransactionID}, function(err, transaction){
    if (err || transaction == null){
      res.status(400).send("Unknown Error");
      return;
    }
    res.status(200).send(transaction);
  });
});

app.post('/api/music/all', function(req, res){
  var postID = req.body.musicId;

  Music.aggregate([
      {$match: {musicId: {$eq: postID}}},
      {$project: {
        _id: 1,
        author: 1,
        text: 1,
        title: 1,
        musicTag: 1,
        eventTag: 1,
        artistTag: 1,
        imageURL: 1,
        videoURL: 1,
        audioURL: 1,
        isVideo: 1,
        isAlbum: 1,
        isAudio: 1,
        date: 1
      }}
    ], function(err, messages){
      if (err) {
        res.status(400).send("Unknown Error");
        return;
      }
    console.log(messages);
      res.status(200).send(messages);
  })
});

app.get('/api/music/audio/page', function(req, res){
  //var postID = req.body._;
  var postPageSize = parseInt(req.query.pageSize);
  var postPageNumber = parseInt(req.query.pageNumber);
  var skipBy = postPageSize*(postPageNumber-1);
//if isvideo or is album or is audio


  Music.aggregate([
      {$match: {isAudio: {$eq: true}}},
      {$sort: {date: -1}},
      {$skip: skipBy},
      {$limit: postPageSize},      
      {$project: {
        _id: 1,
        author: 1,
        text: 1,
        title: 1,
        musicTag: 1,
        eventTag: 1,
        artistTag: 1,
        imageURL: 1,
        videoURL: 1,
        audioURL: 1,
        isVideo: 1,
        isAlbum: 1,
        isAudio: 1,
        date: 1
      }}
    ], function(err, messages){
      if (err) {
        res.status(400).send("Unknown Error");
        return;
      }
    console.log(messages);
      res.status(200).send(messages);
  })
});


app.get('/api/music/video/page', function(req, res){
  //var postID = req.body._;
  var postPageSize = parseInt(req.query.pageSize);
  var postPageNumber = parseInt(req.query.pageNumber);
  var skipBy = postPageSize*(postPageNumber-1);
//if isvideo or is album or is audio


  Music.aggregate([
      {$match: {isVideo: {$eq: true}}},
      {$sort: {date: -1}},
      {$skip: skipBy},
      {$limit: postPageSize},      
      {$project: {
        _id: 1,
        author: 1,
        text: 1,
        title: 1,
        musicTag: 1,
        eventTag: 1,
        artistTag: 1,
        imageURL: 1,
        videoURL: 1,
        audioURL: 1,
        isVideo: 1,
        isAlbum: 1,
        isAudio: 1,
        date: 1
      }}
    ], function(err, messages){
      if (err) {
        res.status(400).send("Unknown Error");
        return;
      }
    console.log(messages);
      res.status(200).send(messages);
  })
});

app.get('/api/music/album/page', function(req, res){
  //var postID = req.body._;
  var postPageSize = parseInt(req.query.pageSize);
  var postPageNumber = parseInt(req.query.pageNumber);
  var skipBy = postPageSize*(postPageNumber-1);
//if isvideo or is album or is audio


  Music.aggregate([
      {$match: {isAlbum: {$eq: true}}},
      {$sort: {date: -1}},
      {$skip: skipBy},
      {$limit: postPageSize},      
      {$project: {
        _id: 1,
        author: 1,
        text: 1,
        title: 1,
        musicTag: 1,
        eventTag: 1,
        artistTag: 1,
        imageURL: 1,
        videoURL: 1,
        audioURL: 1,
        isVideo: 1,
        isAlbum: 1,
        isAudio: 1,
        date: 1
      }}
    ], function(err, messages){
      if (err) {
        res.status(400).send("Unknown Error");
        return;
      }
    console.log(messages);
      res.status(200).send(messages);
  })
});




app.post('/api/article/new', function(req, res){
  //var postID = req.body.userID;
  var postAuthor = req.body.author;
  var postText = req.body.text;
  var postTitle = req.body.title;
  var postDate = req.body.date;
  var postMusicTag = req.body.musicTag;
  var postArtistTag = req.body.artistTag;
  var postEvenTag = req.body.eventTag;
  var postImageURL = req.body.imageURL;
  var postBannerImageURL = req.body.bannerImageURL;
  var postHasBanner = req.body.hasBanner;

  var newArticle = new Article({
    author: postAuthor,
    text: postText,
    title: postTitle,
    musicTag: postMusicTag,
    artistTag: postArtistTag,
    eventTag: postEvenTag,
    date: postDate,
    imageURL: postImageURL,
    bannerImageURL: postBannerImageURL,
    hasBanner: 1,
  });
  newArticle.save(function(err, nU){
    if(err){
      res.status(400).send("Unknown Error, message:" +  err.message);
      return;
    }
    res.status(200).send(newArticle._id);
  })
});

app.post('/api/article/get', function(req, res){
  var postTransactionID = req.body.transactionID;
  Article.findOne({_id: postTransactionID}, function(err, transaction){
    if (err || transaction == null){
      res.status(400).send("Unknown Error");
      return;
    }
    res.status(200).send(transaction);
  });
});

app.post('/api/article/delete', function(req, res){
  var postTransactionID = req.body.transactionID;
  Article.remove({_id: postTransactionID}, function(err, transaction){
    if (err || transaction == null){
      res.status(400).send("Unknown Error");
      return;
    }
    res.status(200).send(transaction);
  });
});

app.post('/api/articles/all', function(req, res){
  var postID = req.body.articleId;

  Article.aggregate([
      {$match: {artcleId: {$eq: postID}}},
      {$project: {
        _id: 1,
        author: 1,
        text: 1,
        title: 1,
        musicTag: 1,
        eventTag: 1,
        imageURL: 1,
        bannerImageURL: 1,
        hasBanner: 1,
        artistTag: 1,
        date: 1
      }}
    ], function(err, messages){
      if (err) {
        res.status(400).send("Unknown Error");
        return;
      }
    console.log(messages);
      res.status(200).send(messages);
  })
});

app.get('/api/articles/page', function(req, res){
  var postPageSize = parseInt(req.query.pageSize);
  var postPageNumber = parseInt(req.query.pageNumber);
  var skipBy = postPageSize*(postPageNumber-1);
  var postID = req.body._;

  Article.aggregate([
      {$match: {artcleId: {$eq: postID}}},
      {$sort: {date: -1}},
      {$skip: skipBy},
      {$limit: postPageSize},
      {$project: {
        _id: 1,
        author: 1,
        text: 1,
        title: 1,
        musicTag: 1,
        eventTag: 1,
        imageURL: 1,
        bannerImageURL: 1,
        hasBanner: 1,
        artistTag: 1,
        date: 1
      }}
    ], function(err, messages){
      if (err) {
        res.status(400).send("Unknown Error");
        return;
      }
    console.log(messages);
      res.status(200).send(messages);
  })
});

app.post('/api/articles/bannerArticle', function(req, res){
  var postID = req.body.articleId;

  Article.aggregate([
      {$match: {hasBanner: {$eq: true}}},
      {$project: {
        _id: 1,
        author: 1,
        text: 1,
        title: 1,
        musicTag: 1,
        eventTag: 1,
        imageURL: 1,
        bannerImageURL: 1,
        hasBanner: 1,
        artistTag: 1,
        date: 1
      }}
    ], function(err, messages){
      if (err) {
        res.status(400).send("Unknown Error");
        return;
      }
    console.log(messages);
      res.status(200).send(messages);
  })
});


app.listen(app.get('port'));
