$(document).ready(()=>{
$('.delete-post').on('click',(e)=>{
$target = $(e.target);
const id = $target.attr('data-id');
$.ajax({
type:'DELETE',
url:'/post/'+id,
success:(response)=>{
	window.location.href='/';
},
error:(err)=>{
	console.log(err);
}
});
});
});