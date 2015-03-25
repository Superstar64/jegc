var emptyFunc="<code>\
		function(x){ <br/>\
			<div id=\"emptyFunc\" class=\"border indent\" contenteditable=\"true\" onKeyUp=\"checkWhite(this)\"></div>\
		}<br/>\
	</code>";
var drawPixel=function(x,y){
	context.fillRect(x,y,1,1);
}

var curx;
var cury;
var scale=1;
var graph=function(func){
	for(var i=0;i<canvas.width;i++){
		var ay=func(i/scale+curx);
		var y=canvas.height-(ay-cury)*scale;
		if(y>0 && y<canvas.height){
			drawPixel(i,y);
		}
	}
}
var funcs=[];

var renderFunctions=function(){
	cordx.value=curx+"";
	cordy.value=cury+"";
	scaleelm.value=(Math.log(scale)/Math.log(2))+"";
	canvas.width=canvas.width;
	
	context.fillStyle="blue";
	
	var originx=(0-curx)*scale;
	if(originx>0 && originx<canvas.width){
		context.fillRect(originx,0,1,canvas.height);
	}
	var originy=canvas.height-(0-cury)*scale;
	if(originy>0 && originy<canvas.height){
		context.fillRect(0,originy,canvas.width,1);
	}
	
	context.fillStyle="gray";
	
	var guide=1/scale*32;
	
	for(var guidex=curx-curx%guide;guidex<curx+canvas.width/scale;guidex+=guide){
		if(guidex!=0){
			context.fillRect((guidex-curx)*scale,0,1,canvas.height);
			context.fillText(guidex+"",(guidex-curx)*scale,canvas.height);
		}
	}
	for(var guidey=cury-cury%guide;guidey<cury+canvas.height/scale;guidey+=guide){
		if(guidey!=0){
			context.fillRect(0,canvas.height-(guidey-cury)*scale,canvas.width,1);
			context.fillText(guidey+"",0,canvas.height-(guidey-cury)*scale);
		}
	}
	guideelm.innerHTML="Guide Lines Every "+guide+" Units";
	
	context.fillStyle="black";
	for(var i=0;i<funcs.length;i++){
		graph(funcs[i]);
	}
}

var render=function(){
	var erron=document.getElementById("error");
	erron.innerHTML="";
	funcs=[];
	var functions=document.getElementsByClassName("function");
	for(var i=0;i<functions.length;i++){
		var str="function(x) {"+(functions[i].innerText || functions[i].textContent)+"}";
		try{
			funcs[i]=eval("("+str+")");
		}catch(e){
			if(!(e instanceof SyntaxError)){
				throw e;
			}else{
				erron.innerHTML+=(str + "is not valid<br/>");
			}
		}
	}
	renderFunctions();
}

var mouseDown=false;

document.onmouseup = function(event) {
	if(event.button==0){
		mouseDown=false;
	}
}
document.onmousedown = function(event) {
	if(event.button==0){
		mouseDown=true;
	}
}

var oldx=0;
var oldy=0;

var onMove=function(event){
	var X=(event.pageX-canvas.offsetLeft)/canvas.offsetWidth*canvas.width;
	var Y=(event.pageY-canvas.offsetTop)/canvas.offsetHeight*canvas.height;
	if(mouseDown){
		var diffx=X-oldx;
		var diffy=Y-oldy;
		curx-=diffx/scale;
		cury+=diffy/scale;
		renderFunctions();
	}
	oldx=X;
	oldy=Y;
}

var onScroll=function(event){
	curx+=oldx/scale;
	cury+=(canvas.height-oldy)/scale;
	if(event.wheelDeltaY>0){
		scale*=2;
		curx-=oldx/scale;
		cury-=(canvas.height-oldy)/scale;
	}else{
		scale/=2;
		curx-=oldx/scale;
		cury-=(canvas.height-oldy)/scale;
	}
	renderFunctions();
	return false;
}
/*
		curx-=canvas.width/2/scale;
		cury-=canvas.height/2/scale;*/
var checkWhite=function(elem){
	if(elem.innerHTML===""){
		if( elem.id!=="emptyFunc"){
			var remelm=elem.parentElement;
			remelm.parentElement.removeChild(remelm);
			document.getElementById("emptyFunc").focus();
		}
	}else if(elem.id==="emptyFunc"){
		elem.removeAttribute("id");
		elem.className+= " "+ "function";
		addEmpty();
	}
}

var addEmpty=function(){
	var funcs=document.getElementById("functions");
	
	var tmp=document.createElement("div");
	tmp.innerHTML=emptyFunc;
	var nfunc=tmp.childNodes;
	
	funcs.appendChild(nfunc[0]);
}

var canvas;
var context;
var cordx;
var cordy;
var scaleelm;
var sizex;
var sizey;
var borderwidth=2;
var guideelm;
var init=function(){
	canvas=document.getElementById("graph");
	context=canvas.getContext("2d");
	cordx=document.getElementById("cordx");
	cordy=document.getElementById("cordy");
	scaleelm=document.getElementById("scale");
	guideelm=document.getElementById("guide");
	addEmpty();
	canvas.onmousemove=onMove;
	canvas.onwheel=onScroll;
	setCanvasSize();
	curx=-canvas.width/2/scale;
	cury=-canvas.height/2/scale;
	render();
	sizex=document.getElementById("sizex");
	sizey=document.getElementById("sizey");
	sizex.value=canvas.width;
	sizey.value=canvas.height;
	
}

var setsizex=function(size){
	var elm=document.getElementsByClassName("cwidth");
	for(var i=0;i<elm.length;i++){
		elm[i].style.width=size-borderwidth*2;
	}
	canvas.width=size;
	context=canvas.getContext("2d");
	renderFunctions();
}

var setsizey=function(size){
	var elm=document.getElementsByClassName("cheight");
	for(var i=0;i<elm.length;i++){
		elm[i].style.height=size-borderwidth*2;
	}
	canvas.height=size;
	context=canvas.getContext("2d");
	renderFunctions();
}

var setCanvasSize=function(){
	canvas.width=canvas.offsetWidth;
	canvas.height=canvas.offsetHeight;
	context=canvas.getContext("2d");
	render();
}

var setScale=function(size){
	scale=Math.pow(2,size);
	renderFunctions();
}
