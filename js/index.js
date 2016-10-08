$(function(){
	console.log($(document).height());
	$('.kaichang').toggleClass('animation').delay(3000).fadeOut();
	//全局变量
	var hang = 20;
	var shiwu = null;
	var fangxiang = 39;
	var tmerId = null;
	var speed = 500;
	var zidianshe = {"0-0":true,"0-1":true,"0-2":true};
	var she = [{x:0,y:0},{x:0,y:1},{x:0,y:2}];
		// //定义开始结束函数
	var statrttime = function(){
		tmerId = setInterval(move,speed);
	}
	var stopgame = function(){
		clearInterval(tmerId);
		tmerId=null;
	}
	var render = function(){	
		buju();
		she = [{x:0,y:0},{x:0,y:1},{x:0,y:2}];
		zidianshe = {"0-0":true,"0-1":true,"0-2":true};
		she.forEach(function(v){
			$('#'+xy2id(v.x,v.y)).addClass('she');
		})
		shiwu = null;
		shiwu = fangshiwu();
		fangxiang = 39;
	}
	//函数
	var xy2id = function(x,y){
		return x+'-'+y;
	}
	//布局
	var buju = function(){	
		var wh = Math.floor(600/hang);
		var sceen = $('.sceen').height(wh*hang).width(wh*hang);
		sceen.empty();
		for (var i = 0; i < hang; i++) {
			for (var j = 0 ; j < hang; j++) {
				$('<div>')
				.addClass('black')
				.width(wh-1)
				.height(wh-1)
				.attr('id',xy2id(i,j))
				.appendTo(sceen)
			}
		}
	}
	buju();
	//画蛇
	 she.forEach(function(v){
	 	$('#'+xy2id(v.x,v.y)).addClass('she');
	})
	 //画食物
	 var fangshiwu = function(){
	 	do{
	 		var _x = Math.floor(Math.random()*hang);
	 		var _y = Math.floor(Math.random()*hang);
	 	}while(zidianshe[xy2id(_x,_y)]);
	 	
	 	$('#'+xy2id(_x,_y)).addClass('shiwu');
	 	return {x:_x,y:_y}
	 }
	 shiwu = fangshiwu();

	 //移动
	var move = function(){	
		var jiutou = she[she.length-1];
		//判断方向
		if(fangxiang===37){
			var xintou={x:jiutou.x,y:jiutou.y-1}
		}else if(fangxiang===39){
			var xintou={x:jiutou.x,y:jiutou.y+1}
		}else if(fangxiang===38){
			var xintou={x:jiutou.x-1,y:jiutou.y}
		}else if(fangxiang===40){
			var xintou={x:jiutou.x+1,y:jiutou.y}
		}

		$('#'+xintou.x+'-'+parseInt(xintou.y+1)).animate({left:5}).delay(20).animate({left:0})
		$('#'+xintou.x+'-'+parseInt(xintou.y-1)).animate({left:-5}).delay(20).animate({left:0})
		$('#'+(xintou.x+1)+'-'+parseInt(xintou.y)).animate({top:5}).delay(20).animate({top:0})
		$('#'+(xintou.x-1)+'-'+parseInt(xintou.y)).animate({top:-5}).delay(20).animate({top:0})
		//撞墙
		if(zidianshe[xy2id(xintou.x,xintou.y)]){
			$('.jies').css('display','block').text('撞到自己了!').addClass('zhuang');
			stopgame();
			return;
		}
		if(xintou.x<0||xintou.x>hang-1||xintou.y<0||xintou.y>hang-1){
			$('.jies').css('display','block').text('撞到墙了!').addClass('zhuang');
			stopgame();
			return;
		}
		// 吃到食物
		var audio=$('audio').get(0);
		if(xintou.x===shiwu.x&&xintou.y===shiwu.y){
			audio.play();
			she.push(xintou);
			$('#'+xy2id(xintou.x,xintou.y)).addClass('she');
			zidianshe[xy2id(xintou.x,xintou.y)]=true;
			$('#'+xy2id(shiwu.x,shiwu.y)).removeClass('shiwu');
			shiwu = fangshiwu();
			$('#'+(shiwu.x-1)+'-'+parseInt(shiwu.y)).animate({top:-5}).delay(20).animate({top:0})
		    $('#'+(shiwu.x+1)+'-'+parseInt(shiwu.y)).animate({top:5}).delay(20).animate({top:0})
		    $('#'+(shiwu.x)+'-'+parseInt(shiwu.y+1)).animate({left:5}).delay(20).animate({left:0})
	        $('#'+(shiwu.x)+'-'+parseInt(shiwu.y-1)).animate({left:-5}).delay(20).animate({left:0})			
		}else{
			she.push(xintou);
			$('#'+xy2id(xintou.x,xintou.y)).addClass('she');
			zidianshe[xy2id(xintou.x,xintou.y)]=true;
			var weiba = she.shift();
			$('#'+xy2id(weiba.x,weiba.y)).removeClass('she');
			zidianshe[xy2id(weiba.x,weiba.y)]=false;
		}
	}

	// 快捷键控制
	$(document).on('keydown',function(e){
		if(e.keyCode===32){
			stopgame();
            // if(move()){
            // 	stopgame();
            // }else{
            // 	statrttime();
            // }
		}
	})
	//控制方向
	$(document).bind('keydown',function(e){
		if(Math.abs(e.keyCode-fangxiang)===2){
			return;
		}
		if(!( e.keyCode >= 37 && e.keyCode <= 40)){
			return;
		}		
		fangxiang=e.keyCode;	
	})
	//功能
	$('input[data-row=20]').bind('click',function(){
		$('.kf').css('display','block');
		speed=100;
		render(speed);
		$('.gongneng').css('display','none');
		setTimeout(statrttime,1000); 
	})

	$('input[data-row=30]').bind('click',function(){
		$('.kf').css('display','block');
		speed=50;
		render(speed);
		$('.gongneng').css('display','none');
		setTimeout(statrttime,1000); 
	})
	$('#fan').bind('click',function(){
		$('.gongneng').css('display','none');
		$('.jiemian').css('display','block');
	})
	$('input[data-d=kai]').bind('click',function(){
		$('.kf').css('display','block');
		$('.jiemian').css('display','none');
		speed=200;
		hang=20;
		render();
		stopgame();
		$('.jiemian').css('display','none');
		setTimeout(statrttime,500); 
	})

	$('input[data-d=xuan]').bind('click',function(){
		$('.jiemian').css('display','none');
		$('.gongneng').css('display','block');
	})

	$('imput[data-d=tui]').bind('click',function(){
		close();
	})
	$('.chong').on('click',function(){
		$('.jies').css('display','none');
		$('.zt').removeClass('zti');
		render();
		stopgame();
		statrttime();
	})
	$('.fanhui').on('click',function(){
		$('.jies').css('display','none');
		$('.kf').css('display','none');
		$('.jiemian').css('display','block');
		render();
		stopgame();
	})
	$('.zt').on('click',function(){
		$('.zt').toggleClass('zti');
		if($('.zt').hasClass('zti')){
			stopgame();
			$('.zt');
		}else{
			statrttime();
			$('.zt');
		}
	})

	$('#fh').on('click',function(){
		window.close();
	})
})