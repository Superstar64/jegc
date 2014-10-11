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
var scale;
var graph=function(func,xsize,ysize){
	for(var i=0;i<xsize;i++){
		var ay=func(i/scale+curx);
		var y=ysize-(ay-cury)*scale;
		if(y>0 && y<ysize){
			drawPixel(i,y);
		}
	}
}
var funcs=[];
var renderFunctions=function(){
	cordx.innerHTML=curx+"";
	cordy.innerHTML=cury+"";
	canvas.width=canvas.width;
	for(var i=0;i<funcs.length;i++){
		graph(funcs[i],canvas.width,canvas.height);
	}
}

var render=function(){
	var erron=document.getElementById("error");
	erron.innerHTML="";
	scale=1;
	curx=-canvas.width/2/scale;
	cury=-canvas.height/2/scale;
	funcs=[];
	var functions=document.getElementsByClassName("function");
	for(var i=0;i<functions.length;i++){
		var str="function(x) {"+(functions[i].innerText || functions[i].textContent)+"}";
		try{
			funcs[i]=eval(str);
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
	mouseDown=false;
}
document.onmousedown = function(event) {
	mouseDown=true;
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
var init=function(){
	canvas=document.getElementById("graph");
	context=canvas.getContext("2d");
	cordx=document.getElementById("cordx");
	cordy=document.getElementById("cordy");
}

var setCanvasSize=function(){
	canvas.width=canvas.offsetWidth;
	canvas.height=canvas.offsetHeight;
	context=canvas.getContext("2d");
	render();
}
