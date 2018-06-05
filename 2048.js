var game={
		data:[],//启动后是一个二维数组，存储每个格的数字
		RN:6,//行
		CN:6,//列
		score:0,//保存分数
		state:0,//保存游戏的状态
		RUNNING:1,//游戏正在运行的状态
		GAMEOVER:0,//专门表示游戏结束
		getGridsHtml:function(){//生成所有背景格的html代码
			for(r=0,arr=[];r<this.RN;r++){
				
				for(c=0;c<this.CN;c++){
					arr.push(""+r+c);
				}
			}
			return '<div id="g'+
				arr.join('" class="grid"></div><div id="g')
				+'" class="grid"></div>';
		},
		getCellsHtml:function(){//生成所有背景格的html代码
			for(r=0,arr=[];r<this.RN;r++){
				
				for(c=0;c<this.CN;c++){
					arr.push(""+r+c);
				}
			}
			return '<div id="c'+
				arr.join('" class="cell"></div><div id="c')
				+'" class="cell"></div>';
		},
		init:function(){//生成所有背景前景格，并加入页面
			var gp=document.getElementById("gridPanel");
			gp.style.width=116*this.CN+16+"px";
			gp.style.height=116*this.RN+16+"px";
			gp.innerHTML=this.getGridsHtml()+
						this.getCellsHtml();
		},
	start:function(){//游戏启动方法
		this.init();
		this.state=this.RUNNING;//游戏状态改为启动
		//初始化数组为二维数组，所有元素为0
		this.data=[];
		for(var r=0;r<this.RN;r++){
			this.data[r]=[];//初始化每一行为空数组
			for(var c=0;c<this.CN;c++){
				this.data[r][c]=0;//初始化每个格为0
			}
		}
		//console.log(this.data);
		this.score=0;
		this.randomNum();
		this.randomNum();
		this.updateView();//将data的数据更新到di
	},
	isGameOver:function(){//判断游戏是否结束
		/*
		遍历data所有元素
		如果当前原始值==0
		返回false
		否则 如果当前列不是最右测列
		且当前元素等于右侧元素
		返回false
		否则 如果当前行不是最后一行
			且当前元素等于下方元素
			返回false
			（遍历结束）状态改为gameover
			return true
		*/
		for(r=0;r<this.data.length;r++){
			for(c=0;c<this.data[r].length;c++){
				if(this.data[r][c]==0){return false;}
				else{
					if(r!=(this.data.length-1)&&this.data[r][c]==this.data[r+1][c]){
						return false;
					}else if(c!=(this.data[r].length-1)&&this.data[r][c]==this.data[r][c+1]){
						return false;
					}
				}
			}
		}
		this.state=this.GAMEOVER;
		return true;
	},
	randomNum:function(){//随机挑选一个位置，生成2或4
		//反复执行
		if(!this.Full){
		while(true){
		//随机生成一个行下标，保存在row中
		var r=parseInt(Math.random()*(this.RN));
		var c=parseInt(Math.random()*(this.CN));
		//随机生成一个行下标，保存在col中
		//如果data中r行c列位置的值==0
		if(this.data[r][c]==0){
		//  随机生成2或4，放入r行c列的元素中
		//  如果生成一个随机数<0.5，就放入2，否则放4
		var ff=Math.random();
		ff<0.5?this.data[r][c]=2:this.data[r][c]=4;
		break;
		}
	}
	}
	},
	isFull:function(){//专门用来判断数字是否已满
		//遍历data中每个元素
		//  只要发现当前元素==0
		//  返回false
		//  遍历结束返回true；
		for(var r=0;r<this.data.length;r++){
			for(var c=0;c<this.data[r].length;c++){
				if(this.data[r][c]==0){
					return false;
				}
			}
		return true;
		}
	},
	updateView:function(){
		for(var r=0;r<this.data.length;r++){
		for(var c=0;c<this.data[r].length;c++){
			var div=document.getElementById("c"+r+c);
			if(this.data[r][c]!=0){
			div.innerHTML=this.data[r][c];
			div.className="cell n"+this.data[r][c];
			}else{//否则，重置
				div.className="cell";
				div.innerHTML="";
			}
		}
	}
	var span=document.getElementById("score");
	span.innerHTML=parseInt(this.score);
	var gameover=document.getElementById("gameover");
	if(this.state==this.GAMEOVER){
		var span=document.getElementById("finalScore");
		span.innerHTML=this.score;
		//如果游戏结束，找到#gameover，修改display为block
		gameover.style.display="block";
	}else{
		//否则，修改为none
		gameover.style.display="none";
	}
	},
	moverLeft:function(){   //左移所有行
		var before=this.data.toString();
		for(var r=0;r<this.RN;r++){
			this.moveLeftInRow(r);
		}
		var after=this.data.toString();
		if(after!=before){
		this.randomNum();//随机生成一个新数
		this.isGameOver();//判断游戏是否结束
		this.updateView();//跟新界面
		}
	},
	moveLeftInRow:function(r){      //左移第r行
		for(var c=0;c<this.data[r].length-1;c++){
			var next=this.getRightNext(r,c);
			if(next==-1){//把下一个为0的情况排除掉
				break;
			}else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[r][next];
					this.data[r][next]=0;
					c--;
				}else if(this.data[r][c]==this.data[r][next]){
					this.data[r][c]*=2;
					this.data[r][next]=0;
					this.score+=this.data[r][c];
					console.log(this.score+"左");
				}
			}
		}
	},
	getRightNext:function(r,c){//找右侧下一个
		//从c+1开始遍历周所有元素
		for(var next=c+1;next<this.data[r].length;next++){
		// 如果找到！=0的
		if(this.data[r][next]!=0){
		// 返回nextC
		 return next;
		 }
		 }//遍历结束返回-1
		 return -1;
	},
	/*向上移动*/
	moveUp:function(){
		var before=this.data.toString();
		for(var c=0;c<this.CN;c++){
			this.moveUpInCol(c);
		}
		var after=this.data.toString();
		if(after!=before){
		this.randomNum();//随机生成一个新数
		this.isGameOver();//判断游戏是否结束
		this.updateView();//跟新界面
		}
	},
	moveUpInCol:function(c){
		for(var r=0;r<(this.data.length-1);r++){
			var next=this.getdown(r,c);
			if(next==-1){
				break;
			}else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[next][c];
					this.data[next][c]=0;
					r--;
				}else if(this.data[r][c]==this.data[next][c]){
					this.data[r][c]*=2;
					this.data[next][c]=0;
					this.score+=this.data[r][c];
					console.log(this.score+"上");
				}
			}
		}
	},
	getdown:function(r,c){
		for(var down=r+1;down<this.data.length;down++){
			if(this.data[down][c]!=0){
				return down;
			}
		}
		return -1;
	},
	moveRight:function(){
		var before=this.data.toString();
		for(var r=0;r<this.RN;r++){
			this.moveRightInRow(r);
		}
		var after=this.data.toString();
		if(after!=before){
		this.randomNum();//随机生成一个新数
		this.isGameOver();//判断游戏是否结束
		this.updateView();//跟新界面
		}
	},
	moveRightInRow:function(r){  
		for(var c=this.data[r].length-1;c>0;c--){
			var perv=this.getLeftPerv(r,c);
			if(perv==-1){
				break;
			}else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[r][perv];
					this.data[r][perv]=0;
					c++;
				}
				else if(this.data[r][c]==this.data[r][perv]){
					this.data[r][c]*=2;
					this.data[r][perv]=0;
					this.score+=this.data[r][c];
					console.log(this.score+"右");
				}
			}
	}
	},
	getLeftPerv:function(r,c){
		for(var perv=c-1;perv>=0;perv--){
			if(this.data[r][perv]!=0){

		// 返回nextC
		 return perv;
		 }
		 }//遍历结束返回-1
		 return -1;
		},
	/*向下移动*/
	moveDown:function(){
		var before=this.data.toString();
		for(var c=0;c<this.CN;c++){
			this.moveDownCol(c);
		}
		var after=this.data.toString();
		if(after!=before){
		this.randomNum();//随机生成一个新数
		this.isGameOver();//判断游戏是否结束
		this.updateView();//跟新界面
		}
	},
	moveDownCol:function(c){
		for(r=this.data.length-1;r>0;r--){
			var perv=this.getUp(r,c);
			if(perv==-1){
				break;
			}else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[perv][c];
					this.data[perv][c]=0;
					r++;
				}else if(this.data[r][c]==this.data[perv][c]){
					this.data[r][c]*=2;
					this.data[perv][c]=0;
					this.score+=this.data[r][c];
					console.log(this.score+"下");
				}
			}
		}
	},
	getUp:function(r,c){
		for(var perv=r-1;perv>=0;perv--){
			if(this.data[perv][c]!=0){
				return perv;
			}
		}
		return -1;
	}
}
//当页面加载后，启动游戏
//事件
window.onload=function(){
	game.start();
	//当按下键时
	document.onkeydown=function(){
if(game.state==game.RUNNING){
	var e=window.event||arguments[0];
	var target=e.target||e.srcElement;
	//var code=e.keyCode;
	if(e.keyCode==37){
		game.moverLeft();
}else if(e.keyCode==39){
		game.moveRight();
}else if(e.keyCode==38){
		game.moveUp();
}else if(e.keyCode==40){
		game.moveDown();
}
}
}
}