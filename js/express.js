//NODE + EXPRESS SERVER
var args = process.argv.slice(2);
var decryptKey;
if(args[0] !== undefined && args[0] !== null && args[0]) decryptKey= args[0];
else decryptKey = "Ariane";

//Configuration ================================================================
var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');
var methodOverride = require('method-override');
var app        = express();
var port       = 8080;
var server     = require('http').Server(app);

var inEditionSite = [];

var g=0,p=0,d=0,put=0,pi=0,gi=0,dai=0;

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());
//Autorise les requête en locale TRIGGER ERROR STATUS -1 on standart request
/*app.options('/api/*', function (request, response, next) {
    response.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    response.send();
});*/
app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//Connexion à mongodb
mongoose.connect('mongodb://localhost:27017/cooking');
mongoose.set('debug', true);
//app.listen(port);

//Schemas ======================================================================

var Report = mongoose.model('Report',{
  title : String,
  reference : String,
  branch : Number,
  app : {name : String, id : String},
  time : {periodNumber : Number, periodDisplay : String, submitDate : Number},
  meta : {
    read : Boolean,
    priority : Number,
    color : String,
    meta_type : Boolean,
    id : Number
  },
  elements : [{
    title : String,
    description : String,
    e_type : Number,
    priority : Number,
    color : String,
    app : {name : String, id : String}
  }],
  holidayData : {
    start : Number,
    startDisplay : String,
    end : Number,
    endDisplay : String
  },
  rights : {
    editable : {
      level : Boolean,
      branch : Boolean,
      people : [{id : String, bool : Boolean}]
    },
    restriction : {
      level : Boolean,
      branch : Boolean,
      people : [{id : String, bool : Boolean}]
    }
  },
  comments : String,
  author : {name : String, surname : String, id : String},
  gathered : {type : Boolean, default : false},
  sent : {type : Boolean, default : false}
});

var User = mongoose.model('User',{
  name : String,
  surname : String,
  pass : String, //Need crypt
  token : String, //Need crypt (only for persistent connection)
  reports : [String],
  weekReports : [String],
  haveGathered : {type:Boolean,default:false},
  receivedReports : [String],
  archivedReports : [{
    title : String,
    reference : String,
    branch : Number,
    app : {name : String, id : String},
    time : {periodNumber : Number, periodDisplay : String, submitDate : Number},
    meta : {
      read : Boolean,
      priority : Number,
      color : String,
      meta_type : Boolean,
      id : Number
    },
    elements : [{
      title : String,
      description : String,
      e_type : Number,
      priority : Number,
      color : String,
      app : {name : String, id : String}
    }],
    holidayData : {
      start : Number,
      startDisplay : String,
      end : Number,
      endDisplay : String
    },
    rights : {
      editable : {
        level : Boolean,
        branch : Boolean,
        people : [{id : String, bool : Boolean}]
      },
      restriction : {
        level : Boolean,
        branch : Boolean,
        people : [{id : String, bool : Boolean}]
      }
    },
    comments : String,
    author : {name : String, surname : String, id : String},
    gathered : {type : Boolean, default : false},
    sent : {type : Boolean, default : false}
  }],
  inbox : [Number],
  outbox : [Number],
  unreadMessages : Number,
  branch : Number,
  head : Boolean,
  level : Number,
  superuser: {type:Boolean,default:false},
  id : Number
});

//Routes ========================================================================

//Ping
app.get('/api/ping',function(req,res){
    res.send('Connecté');
});


//CONTROLLER SITES ========================================================================

//CONTROLLER REPORTS ========================================================================

//GET ALL REPORTS
app.get('/api/reports',function(req,res){
  Report.find(function(err,reports){
    if(err) res.send(err);
    res.json(reports);
  });
});

//GET ONE REPORT (request body is: {_id : mongooseId})
app.post('/api/reports/one',function(req,res){
  Report.findById(req.body._id,function(err,report){
    if(err) res.send(err);
    res.json(report);
  });
});

//GET PERSONNAL REPORTS (not used)
app.post('/api/reports/mine',function(req,res){
  Report.find({'author.id' : req.body._id},function(err,reports){
    console.log('Personnal reports:');
    console.log(reports);
    if(err) res.send(err);
    res.json(reports);
  })
});

//CREATE
app.post('/api/reports',function(req,res){
  var r = req.body;
  console.log(r);
  Report.create(r, function(err,report){
    console.log("Mongoose report");
    console.log(report);
    if(err) res.send(err);
    //On renvoie l'id Mongoose du rapport créé
    res.send({_id : report._id});
    //Reload reports
    io.emit('createReport',report);
  });
});

//UPDATE
app.post('/api/reports/edit',function(req,res){
    Report.findOneAndUpdate({_id: req.body._id},req.body,function(err,report){
        if(err) res.send(err);
        res.json(report);
        io.emit('editReport',report);
    });
});

//DELETE
app.post('/api/reports/delete',function(req,res){
  Report.remove({
    _id : req.body._id
}, function(err,report){
    if(err) res.send(err);

    User.find(function(err,users){
      for (var i = 0; i < users.length; i++) {
        if(users[i].reports.indexOf(req.body._id) != -1)
          users[i].reports.splice(users[i].reports.indexOf(req.body._id),1);
        if(users[i].weekReports.indexOf(req.body._id) != -1)
          users[i].weekReports.splice(users[i].weekReports.indexOf(req.body._id),1);
        if(users[i].receivedReports.indexOf(req.body._id) != -1)
          users[i].receivedReports.splice(users[i].receivedReports.indexOf(req.body._id),1);

        users[i].save(function(err,user){
          if(err) res.send(err);
          console.log(user);
        })
      }
      res.json(report);
    });


  });
});

//REBASE
app.post('/api/reports/rebase',function(req,res){
    Report.remove(function(err,reports){
        if(err) res.send(err);
        else res.json(reports);
    });
    User.find(function(err,users){
        for (var i = 0; i < users.length; i++) {
            users[i].weekReports = [];
            users[i].reports = [];
            users[i].receivedReports = [];
            users[i].save(function(err){
                if(err) res.send(err);
            })
        }
    });
});

//Listening (ALWAYS PUT IT AT THE END)
server.listen(port);
console.log('Server started and listening on ' + port);