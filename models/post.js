let mongoose=require('mongoose');

let postSchema = mongoose.Schema({
title:{
	type:String,
	required:true
},
author:{
	type:String,
	require:true
},
body:{
	type:String,
	required:true
},
postdate:{
	type:String,
	required:true
}
});

let Post= module.exports=  mongoose.model('Post',postSchema);