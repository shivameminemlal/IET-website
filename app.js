const express= require('express');
const path= require('path');
const mongoose=  require('mongoose');
const bodyParser= require('body-parser');
const expressValidator= require('express-validator');
const flash=  require('connect-flash');
const session= require('express-session');
const config= require('./config/database');
const bcrypt= require('bcryptjs');
const port= process.env.PORT || 3000;

mongoose.connect('mongodb://admin:Admin1234@ds153948.mlab.com:53948/node-blog');
let db=mongoose.connection;

db.once('open',()=>{
console.log('Connected to Database');
});

db.on('error',(err)=>{
	console.log(err);
});

const app=express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))
app.use(flash());
app.use(expressValidator())

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});



let Post= require('./models/post');

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');


app.get('*',(req,res,next)=>{
res.locals.user= req.user || null;
next();
});

app.get('/',(req,res)=>{
	res.sendFile('/index.html');
});

app.get('/about-us',(req,res)=>{
	res.sendFile(__dirname+'/public/about-us.html');
});

app.get('/events',(req,res)=>{ 
	res.sendFile(__dirname+'/public/events.html');
});

app.get('/gallery',(req,res)=>{
	res.sendFile(__dirname+'/public/gallery.html');
});

app.get('/contact',(req,res)=>{
	res.sendFile(__dirname+'/public/contact.html');
});

app.get('/techdesk',(req,res)=>{
let posts = Post.find({},(err,posts)=>{
	if(err){
		console.log(err);
		return;
	}
res.render('index',{
	title:'Posts',
	posts:posts
});
});
});


app.get('/techdesk/post/:id',(req,res)=>{

	let posts = Post.find({},(err,posts)=>{
		if(err){
			console.log(err);
			res.render('404');
			return;
		}
		Post.findById(req.params.id,(err,post)=>{
			if(!post){
				res.render('404');
			}
			res.render('post',{
			post:post,
			posts:posts
			});
			});
	});

});

app.get('/techdesk/post/edit/:id',(req,res)=>{
Post.findById(req.params.id,(err,post)=>{
	if(!post){
		res.render('404');
	}
res.render('edit_post',{ 
post:post
});
});
});


 
app.get('/techdesk/posts/add',(req,res)=>{
res.render('add_post',{
title:'Add Post'
});
});

app.post('/techdesk/post/delete/:id',(req,res)=>{
	
	if(req.body.password=="BOSSBOSSyeah"){
let query = {_id:req.params.id}
Post.remove(query,(err)=>{
if(err){
	console.log(err);
	res.redirect('/techdesk');
}
req.flash('warning','Post deleted');
res.redirect('/techdesk');
});
	}else{
		req.flash('info','Password??');
		res.redirect('/techdesk/post/edit/'+req.params.id)
	}
}); 

app.post('/techdesk/posts/add',(req,res)=>{
	req.checkBody('title','Title is required').notEmpty();
	req.checkBody('body','Body is required').notEmpty();
	
	let errors= req.validationErrors();
	if(errors){
		
		for(var i=0;i<errors.length;i++){
			req.flash('danger',errors[i].msg);
		}
		res.render('add_post',{
			title:'Add Post'
		});
	}

	let post=  new Post();
	post.title=req.body.title;
	post.body=req.body.body;
	post.author=req.body.author;
	var d= new Date();
	var monthArr=['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
	var dateString=d.getDate().toString()+"-"+monthArr[d.getMonth()]+"-"+d.getFullYear().toString();
	post.postdate=dateString;
if(req.body.password=="BOSSBOSSyeah"){
post.save((err)=>{
if(err){
	console.log(err);
	return;
}
req.flash('success','Post added');
res.redirect('/techdesk');
});
}else{
	req.flash('danger','Incorrect password');
	res.redirect('/techdesk/posts/add');
}
});

app.post('/techdesk/post/edit/:id',(req,res)=>{
	let post=  {};
	post.title=req.body.title;
	post.body=req.body.body;
	post.author=req.body.author;
	let query = {_id:req.params.id};
	if(req.body.password=="BOSSBOSSyeah"){
Post.update(query,post,(err)=>{
if(err){
	console.log(err);
	return;
}
req.flash('info','Article edited');
res.redirect('/techdesk');
});
	}else{
		req.flash('danger','Incorrect password');
		res.redirect('/techdesk/post/edit/'+req.params.id);
	}
});


app.use(function(req, res, next){
	res.status(404);
  
	if (req.accepts('html')) {
	  res.render('404', { url: req.url });
	  return;
	}
  
	if (req.accepts('json')) {
	  res.send({ error: 'Not found' });
	  return;
	}
	res.type('txt').send('Not found');
  });

app.listen(port,()=>{
console.log('Server started');
});