var username = '123';

	$('body').delegate('.guanzhu',{click:function() {
	var _this = $(this);
	$.post('../saveattention', {
		username:username,
		othername:$(this).prev().text()
	}, function(data) {
		if(data.successInfo.success === true){
			_this.html('已关注');
		}
	});
}});
		$('#login-submit').click(function() {
	$.post('../UserLogin', {
		account:$('#username').val(),
		password:$('#password').val()
	}, function(data) {
		console.log(data);
		if(data.successInfo.success === true){
			alert('登陆成功');
			$('#login-btn').html($('#username').val());
			username = $('#username').val();
		}
		$('.login-window').hide();
		$('.mask').hide();
		attentionlist();
	});
});
$('body').delegate('.face',{
	click: function(event){
		console.log(event);
		if(! $('#sinaEmotion,#sinaEmotion2').is(':visible')){
			$(this).sinaEmotion($(this).parent().find('textarea'));
			event.stopPropagation();
		}
		$('#sinaEmotion,#sinaEmotion2').css({
			position:'fixed',
			left:'40%',
			top:'25%'
		});
	},
});
$('.mask').bind('click',function(event) {
		event.stopPropagation();
		$('.login-window').hide();
		$('.mask').hide();
});
$('body').delegate('.msg-foot button',{click: function(){
	$(this).parent().next().slideToggle('fast');
}});
$('.submit').bind({
	click : function(){
		var content = $('.subContent').val();
		if(!content){
			return;
			
		}
		$.post('../savetalk', {
			account:username,
			textarea:content,
			myFile:'',
		}, function(data) {
			if(data.successInfo.success === true){
				alert('发布说说成功');
				var msg = $('.msg').first().clone();
				msg.find('.name').text(username);
				msg.find('.msg-body').text(content);
				
				$('#msgContainer').prepend(msg);
				msg.show();
				$('.msg').eq(1).parseEmotion();
				$('.subContent').val('');
			}
		});
	}
});

function attentionlist(){
	$.post('../attentionlist',{username:username},function(data){
		if(data.successInfo.success === true){
			$.each(data.attentions,function(index,item){
				$('#myfriend ul').append('<li>'+item.othername+'</li>');
			});
		}
	});
}
$(document).ready(function(){
	getAllTalk();
	$('#alltalk').bind('click',function(){
		$('#container').show();
		$('#myfriend-container').hide();
	});
	$('#friendtalk').bind('click',function(){
		$('#container').hide();
		$('#myfriend-container').show();
	});
});
function getFriendTalk(){
	$.ajax({
		url:'../attentionlist',
		method:'POST',
		dataType:'json',
		success:function(data){
			if(data.successInfo.success === true){
				console.log(data);
				$('#myfriend-container #msgContainer').html('');
				$.each(data.talktalkList,function(index,item){
					var msg = $('#myfriend-container .msg').first().clone();
					msg.find('.name').text(item.account);
					msg.find('.msg-body').text(item.textarea);
					$('#myfriend-container #msgContainer').append(msg);
					msg.show();
					msg.find('.submit-comment').attr('data',item.id);
					$.post('../comments',{
						talktalkId:item.id
					},function(data) {
						if(data.successInfo.success === true){
							var commentList = msg.find('.commentList');
							commentList.html('');
							$.each(data.commentList,function(index,item) {
								commentList.append('<div class="commentItem">'+item.textarea+'</div>');
							});
						}
					});
				});
			}
		},
		complete:function(){
			$('#myfriend-container #msgContainer .msg-body').parseEmotion();
			$('body').delegate('.submit-comment',{click:function() {
				$.ajax({
					url:'../savecomment',
					data:{talktalkId:parseInt($(this).attr('data')),
						username:username,
						textarea:$(this).prev().val()},
					dataType:'json',
					method:'post',
					success:function(data) {
					if(data.successInfo.success === true){
						alert('评论成功');
						var commentContent = $(this).prev('.commentContent').val();
						$('#myfriend-container .commentList').prepend("<div class='commentItem'>"+commentContent+"</div>");
						console.log($(this).parent().parent().find('.commentItem').first());
						$(this).parent().parent().find('.commentItem').first().parseEmotion();
						$('#myfriend-container .commentContent').val('');
						$('#myfriend-container .commentCon').slideToggle('fast');
					}
				},
				complete:function(){
					$('#myfriend-container #msgContainer .commentItem').parseEmotion();
				}
				});
			}});
		}
	});
}
function getAllTalk(){
	$.ajax({
		url:'../talktalklist',
		method:'POST',
		dataType:'json',
		success:function(data){
			if(data.successInfo.success === true){
				console.log(data);
				$('#msgContainer').html('');
				$.each(data.talktalkList,function(index,item){
					var msg = $('.msg').first().clone();
					msg.find('.name').text(item.account);
					msg.find('.msg-body').text(item.textarea);
					$('#msgContainer').append(msg);
					msg.show();
					msg.find('.submit-comment').attr('data',item.id);
					$.post('../comments',{
						talktalkId:item.id
					},function(data) {
						if(data.successInfo.success === true){
							var commentList = msg.find('.commentList');
							commentList.html('');
							$.each(data.commentList,function(index,item) {
								commentList.append('<div class="commentItem">'+item.textarea+'</div>');
							});
						}
					});
				});
			}
		},
		complete:function(){
			$('.msg-body').parseEmotion();
			$('body').delegate('.submit-comment',{click:function() {
				$.ajax({
					url:'../savecomment',
					data:{talktalkId:parseInt($(this).attr('data')),
						username:username,
						textarea:$(this).prev().val()},
					dataType:'json',
					method:'post',
					success:function(data) {
					if(data.successInfo.success === true){
						alert('评论成功');
						var commentContent = $(this).prev('.commentContent').val();
						$('.commentList').prepend("<div class='commentItem'>"+commentContent+"</div>");
						console.log($(this).parent().parent().find('.commentItem').first());
						$(this).parent().parent().find('.commentItem').first().parseEmotion();
						$('.commentContent').val('');
						$('.commentCon').slideToggle('fast');
					}
				},
				complete:function(){
					$('.commentItem').parseEmotion();
				}
				});
			}});
		}
	});
}