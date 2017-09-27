var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var bodyParser = require('body-parser');
var Users = require('./public/models/users');
var Jobs = require('./public/models/jobs');
var session = require('express-session');
app.use(express.static(__dirname+'/public'));
var router = express.Router();
router.use('/', express.static('public', {
  redirect: false
}));

mongoose.connect('mongodb://localhost/js_june');

var db = mongoose.connection;

db.on('error',function(){
	console.log('DB Connection Error');
});

db.on('open',function(){
	console.log('DB Connection Established');
});

app.use(
	session({
		secret:"marlabs_sess_secret_key",
		resave:true,
		saveUninitialized:true
	})
);

app.use(bodyParser.urlencoded({'extended':false}));
app.use(bodyParser.json());

app.post('/register',function(req,res){
	var user = new Users();

	user.username  = req.body.username;
	user.password  = req.body.password;
	user.email     = req.body.email;
	user.location  = req.body.location;
	user.phone     = req.body.phone;
	user.userType  = req.body.userType;


	user.save(function(err){
		if(err){
			res.json({success:false,message:err});
		}else{
			res.json({success:true,message:"User Data Registered!"});
		}
	});
	
});
app.post('/login',function(req,res){
            console.log('came');
	var uname = req.body.username;
	var pswd = req.body.password;
	var sessionUser;
	Users.find({ 
		$and:[{
			"username":uname
		},
		{
			"password":pswd
		}
		]},function(err,result){
			if(err){
				res.json({success:false,message:err});
			}
                        if(result){
				result.forEach(function(record){
				sessionUser = record;
                                req.session.isLoggedIn = record.username;
				req.session.user = record.userType;
                                
				res.json({success:true,user:sessionUser});
                                
				});
			}
	});
});


app.get('/session', function(req,res){
    console.log(req.session.user);
    if(req.session.user === 'company'){
        res.json({CLoggedin: "true",loggedIn: "false"});
        console.log(req.session.user);
    } else if(req.session.user === 'seeker'){
        res.json({loggedIn: "true",CLoggedin: "false"});   
    }else{
        res.json([{loggedIn: "false"}, {CLoggedin: "false"}]);         
    }
});


app.get('/logout', function(req,res){
    
    req.session.destroy();
    res.json({loggedIn: "false", CLoggedin:"false"});
});

app.post('/postjob',function(req,res){
	var job = new Jobs();

	job.jobTitle  = req.body.jobTitle;
	job.jobDescription = req.body.jobDescription;
	job.keywords     = req.body.keywords;
	job.jobLocation  = req.body.jobLocation;



	job.save(function(err){
		if(err){
			res.json({success:false,message:err});
		}else{
			res.json({success:true,message:"Job Posted!"});
		}
	});
	
});

app.post('/search',function(req,res){
	
	console.log("request recieved");
	console.log(req.body.searchTitle);
	var searchTitle = req.body.searchTitle;
	var searchKeyword  = req.body.searchKeyword;
	var searchLocation  = req.body.searchLocation;

	Jobs.find({ 
		$or:[{
			"jobTitle":searchTitle
		},
		{
			"keywords":searchKeyword
		},
		{
			"jobLocation":searchLocation
		}
		]},function(err,result){
			console.log(result.data);
                        if(err){
				res.json({success:false,message:err});
			}else if(result){
                            res.json(result);
			}else{
				res.json({success:false,message:"No Result"});
			}
	});
	
});




router.get('*', function (req, res, next) {
  res.sendFile(path.resolve('indexpage.html'));
});
app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/indexpage.html');
});


app.listen(8081,function(){
	console.log("Server Running on 8081");
});