//  it is gentral for all
var SasiyaDocX=document;
var SaEleAcceX=document.getElementById;
var SaBody=document.getElementsByTagName;
var SIE4=document.all
var SaIE6andNs6=document.getElementById
var SaXn4=document.layers;
var SaXReslt;
var SaTabHolder=new Array(100);
var Dox= new SasiyaScript_pre_All();
var Doxop=new SasiyaScript_pre_controls();
var STab=new SasiyaScript_Tab_controls();
var oldb;
var baseUrl="";
//var today = new present_time();
 //ajith
 
 //
function SasiyaScript_pre_All()
{
   this.SasiyaElement=function(id)
   					  {
	SaIE6andNs6?SaXReslt=SasiyaDocX.getElementById(id):SIE4?SaXReslt=SasiyaDocX.all[id]:SaXn4?SaXReslt=SasiyaDocX.layers[id]:"";
	return SaXReslt;
					  }
	this.SasiyaCrossStyle=function(id)
   					  {
	var SaXReslt=id.constructor==String? Dox.SasiyaElement(id):id; 					  
	//SaIE6andNs6?SaXReslt=SasiyaDocX.getElementById(id):SIE4?SaXReslt=SasiyaDocX.all[id]:SaXn4?SaXReslt=SasiyaDocX.layers[id]:"";
	var CrossStyle=SaXReslt.style?SaXReslt.style:SaXReslt;
	return CrossStyle;
					  }	
	this.SasiyaobCrossStyle=function(SaXReslt)
   					  {
						 var CrossStyle=SaXReslt.style?SaXReslt.style:SaXReslt;
						 return CrossStyle;
					  }					  
}
	 
	 
function SasiyaScript_pre_controls()
{
   this.SasiyaCTElement=function(id,pid,El)
   					  { 
						 var ShObj=pid.constructor==String? Dox.SasiyaElement(pid):pid;  
					     var SAxEl=SasiyaDocX.createElement(El);
						     if(id!=""){SAxEl.setAttribute("id",id);}
						 var Dxz=ShObj.childNodes 
							 ShObj.appendChild(SAxEl);
							 return SAxEl;
					  }
  this.SasiyaObjCTElement=function(id,pid,El)
   					  {
					     var SAxEl=SasiyaDocX.createElement(El);
						     SAxEl.setAttribute("id",id);
							 Dox.SasiyaElement(pid).appendChild(SAxEl);
							 return SAxEl;
					  }	
 this.SasiyaDisplay=function(id)
   					  {
					  var DisObj=Dox.SasiyaCrossStyle(id)
					      DisObj.display=="none"?DisObj.display="":DisObj.display="none";
							 
					  }					  
 this.SasiyaObjDisplay=function(Obj)
   					  {	
					    var DisObj=Dox.SasiyaobCrossStyle(Obj);
					        DisObj.display=="none"?DisObj.display="":DisObj.display="none";							
					  }
 this.SasiyaShringWin=function(id,minx,Idvalue,Ohw)	
                      {
				var Rtvalue=false;
				    minx+=5;
				var ShObj=id.constructor==String?Dox.SasiyaCrossStyle(id):SasiyaobCrossStyle(id);				      	 
				var ShWidth=parseInt(ShObj.width);
				var ShHeight=parseInt(ShObj.height);
					Ohw==0?ShWidth>=minx?ShObj.width=(ShWidth-Idvalue)+"px":Rtvalue=true:"";
					Ohw==1?ShHeight>=minx?ShObj.height=(ShHeight-Idvalue)+"px":Rtvalue=true:"";
				var Drt=Rtvalue?"Stop":"Continue";
				    return Drt;
					  }
  this.SasiyaExpendWin=function(id,maxn,Idvalue,Ohw)	
                      {
				var Rtvalue=false;
				    maxn-=5;
				var ShObj=id.constructor==String?Dox.SasiyaCrossStyle(id):SasiyaobCrossStyle(id);				      	 
				var ShWidth=parseInt(ShObj.width);
				var ShHeight=parseInt(ShObj.height);
					Ohw==0?ShWidth<=maxn?ShObj.width=(ShWidth+Idvalue)+"px":Rtvalue=true:"";
					Ohw==1?ShHeight<=maxn?ShObj.height=(ShHeight+Idvalue)+"px":Rtvalue=true:"";
				var Drt=Rtvalue?"Stop":"Continue";
				    return Drt;
					  }	
   this.SasiyaITLposWin=function(id,maxn,Idvalue,Ohw)	
                      {
				var Rtvalue=false;
				    maxn-=Idvalue;
				var ShObjs=id.constructor==String?Dox.SasiyaElement(id):id;	
				var ShObj=id.constructor==String?Dox.SasiyaCrossStyle(id):SasiyaobCrossStyle(id);
				    ShObj.position!="absolute"? ShObj.position="absolute":"";
				var ShWidth=parseInt(ShObjs.offsetLeft);
				var ShHeight=parseInt(ShObjs.offsetTop);
				   	Ohw==0?ShWidth<=maxn?ShObj.left=(ShWidth+Idvalue)+"px":Rtvalue=true:"";
					Ohw==1?ShHeight<=maxn?ShObj.bottom=(ShHeight+Idvalue)+"px":Rtvalue=true:"";					
				var Drt=Rtvalue?"Stop":"Continue";
				    return Drt;
					  }	
    this.SasiyaDTLposWin=function(id,mixn,Idvalue,Ohw)	
                      {
				var Rtvalue=false;
				    mixn-=Idvalue;
				var ShObjs=id.constructor==String?Dox.SasiyaElement(id):id;	
				var ShObj=id.constructor==String?Dox.SasiyaCrossStyle(id):SasiyaobCrossStyle(id);				
				    ShObj.position!="absolute"? ShObj.position="absolute":"";					
				var ShWidth=parseInt(ShObjs.offsetLeft);
				var ShHeight=parseInt(ShObjs.offsetTop);
				   	Ohw==0?ShWidth>=mixn?ShObj.left=(ShWidth-Idvalue)+"px":Rtvalue=true:"";
					Ohw==1?ShHeight>=mixn?ShObj.bottom=(ShHeight-Idvalue)+"px":Rtvalue=true:"";					
				var Drt=Rtvalue?"Stop":"Continue";
				    return Drt;
					  }					  
 this.SasiyaClose=function(id)
  					{
					 var ShObj=id.constructor==String?Dox.SasiyaCrossStyle(id):id;	
					     Dox.SasiyaobCrossStyle(ShObj).display="none";	
						 return ShObj; 	   
					}
 this.SasiyaXClose=function(id)
  					{
					 var ShObj=id.constructor==String?Dox.SasiyaCrossStyle(id):id;	
					     Dox.SasiyaobCrossStyle(ShObj).display="";	
						 return ShObj;   
					}					
 this.getParent=function(id,n)
  					{
					 var ShObj=id.constructor==String? Dox.SasiyaElement(id):id;
					 var TemObj;
					 var DynamicObj=ShObj;
					           for(var i=0;i<n-1;i++)
							   {
					           TemObj=DynamicObj.parentElement?DynamicObj.parentElement:DynamicObj.parentNode;
							   DynamicObj=TemObj;							   
							   }
					     return(DynamicObj);		   
					}
 this.getChild=function(id,n)
  					{
					 var ShObj=id.constructor==String? Dox.SasiyaElement(id):id;
					 var TemObj;
					 var DynamicObj=ShObj;
					 
					           for(var i=0;i<n-1;i++)
							   {
								var TemObj=DynamicObj.childNodes;
	                            var obj=typeof(TemObj[0].tagName)=="undefined"?TemObj[1]:TemObj[0];	                            
		                        DynamicObj=obj;
							   }
					     return(DynamicObj);		   
					}					
 this.SasiyaColorLabel=function(id,Mover,Mout,Click)
                       {
						var ShObj=id.constructor==String? Dox.SasiyaElement(id):id; 
						    ShObj.onmouseover=function(){Dox.SasiyaobCrossStyle(ShObj).backgroundColor=Mover}
							ShObj.onmouseout=function(){Dox.SasiyaobCrossStyle(ShObj).backgroundColor=Mout}
							ShObj.onmousedown=function(){Dox.SasiyaobCrossStyle(ShObj).backgroundColor=Click}
					        ShObj.onmouseup=function(){Dox.SasiyaobCrossStyle(ShObj).backgroundColor=Mover}	   
					   }
 this.SasiyaGraphicLabel=function(id,Mover,Mout,Click)
                       {
						var ShObj=id.constructor==String? Dox.SasiyaElement(id):id;  
						    ShObj.onmouseover=function(){if(Dox.SasiyaobCrossStyle(ShObj).backgroundImage!=oldb){
							                             oldb=Dox.SasiyaobCrossStyle(ShObj).backgroundImage="url("+Mover+")"}
														}
							ShObj.onmouseout=function(){Dox.SasiyaobCrossStyle(ShObj).backgroundImage="url("+Mout+")"}
							ShObj.onmousedown=function(){Dox.SasiyaobCrossStyle(ShObj).backgroundImage="url("+Click+")"}
							ShObj.onmouseup=function(){Dox.SasiyaobCrossStyle(ShObj).backgroundImage="url("+Mover+")"}
						    Dox.SasiyaobCrossStyle(ShObj).backgroundRepeat="repeat-x";
							Dox.SasiyaobCrossStyle(ShObj).backgroundPosition="center";
					   }
this.SasiyaKeyEvent=function(e)
                       {
					 var keyCode =e.keyCode ?e.keyCode :e.which ?e.which :e.charCode;
                         return keyCode;
					   }
this.checkAll=function(id)
						{
						return this.getCheckBox(id,0);
						}
this.unCheckAll=function(id)
						{
						return this.getCheckBox(id,1);
						}						
this.getCheckBox=function(id,n)
						{
						 var ShObj=id.constructor==String? Dox.SasiyaElement(id):id;  
						 var el= ShObj.getElementsByTagName('input');
						 var apel=new Array();var nc=0;
		                     for(var i=0;i<el.length;i++)
							 {
								if(el[i].type.search(/checkbox/i)>=0)
								{
								  
								  if(n==0){el[i].checked=true;apel[nc]=el[i];nc++;}
								  else if(n==1){el[i].checked=false;apel[nc]=el[i];nc++;}
								  else if(n==2 && el[i].checked){apel[nc]=el[i];nc++;}
								  else if(n==3 && !el[i].checked){apel[nc]=el[i];nc++;}		
								  
								}
							 }
							 return apel;
						}
this.getCheckBoxByName=function(id,n)
						{
						// var ShObj=id.constructor==String? Dox.SasiyaElement(id):id;  
						 var el= document.getElementsByName(id);
						 var apel=new Array();var nc=0;
		                     for(var i=0;i<el.length;i++)
							 {
								if(el[i].type.search(/checkbox/i)>=0)
								{
								  
								  if(n==0){el[i].checked=true;apel[nc]=el[i];nc++;}
								  else if(n==1){el[i].checked=false;apel[nc]=el[i];nc++;}
								  else if(n==2 && el[i].checked){apel[nc]=el[i];nc++;}
								  else if(n==3 && !el[i].checked){apel[nc]=el[i];nc++;}		
								  
								}
							 }
							 return apel;
						}						
this.getCheckBoxFun=function(id,fun)
						{
						 var ShObj=id.constructor==String? Dox.SasiyaElement(id):id;  
						 var el= ShObj.getElementsByTagName('input');
						 var apel=new Array();var nc=0;
		                     for(var i=0;i<el.length;i++)
							 {
								if(el[i].type.search(/checkbox/i)>=0)
								{
								  if(fun!='none')fun(el[i])
								  							  
								}
							 }
							 return apel;
						}
this.getOffset=function ( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { bottom: _y, left: _x };
}																								   
}	 
function SasiyaScript_Tab_controls()
{
    this.Ctwind=function(id,pid)
   				{
					
					var obj=DoxScripts.SasiyaCTElement(id,pid,"table")
					    obj.cellSpacing=0;
						return obj;
				}
   
   this.AddRowCell=function(El,Rc,Cc)
   					  {
					     var SAxEl=El.constructor==String?Dox.SasiyaElement(El):El;
						     for(var i=0;i<Rc;i++)
							 {
						 var RcEl=SAxEl.insertRow(SAxEl.rows.length);
							 for(var j=0;j<Cc;j++)
							 {
							 var CcEl=RcEl.insertCell(RcEl.cells.length);
							     
							 }
							 }
					  }
	this.AddCell=function(El,Rc,Cc,txt)
   					  {
					     var SAxEl=El.constructor==String?Dox.SasiyaElement(El):El;
						     if(SAxEl.rows.length==0){SAxEl.insertRow(0);}
						 var RcElv=SAxEl.rows; 
						 var RcEl=RcElv[Rc-1];
						     Cc=Cc==0?RcEl.cells.length:Cc; // alert(RcEl.cells.length)
						 var CcEl=RcEl.insertCell(Cc-1);
							 if(txt!=""){CcEl.innerHTML=txt;}					
							 return CcEl;
					  }  	
   this.AddValue=function(El,Rc,Cc,value)
   					  {
					     var SAxEl=El.constructor==String?Dox.SasiyaElement(El):El;
						 var RcEl=SAxEl.rows;
						 var CcEl=RcEl[Rc-1].cells;
						     CcEl[Cc-1].innerHTML=value;
							 return CcEl[Cc-1];
					  }	
  this.Remove=function(El,pid)
   					  {
						 var SaNtab=pid.constructor==String?Dox.SasiyaElement(pid):pid;
					         SaNtab.removeChild(El)
					  }	
					  
 this.Tittle=function(id,icon,value,iconX)
             {	
             var SaNtab=id.constructor==String?Dox.SasiyaElement(id):id; 
             var Sxtb=SaTabX.Ctwind(id,SaNtab)
			     Dox.SasiyaobCrossStyle(Sxtb).width="100%";
				 SaTabX.AddRowCell(Sxtb,1,3)
			 var idzxv="I"+value.replace(" ","a");
			 var imgicon="<img src='"+icon+"' id='"+idzxv+"'/>";
			 var imgclose="<img src='"+iconX+"'  onclick='closeX(this)'/>";
             var ob1=SaTabX.AddValue(Sxtb,1,1,imgicon);
			     ob1.align="center";
			 var ob2=SaTabX.AddValue(Sxtb,1,2,value);
			     ob2.style.width="70%";
			 var ob3=SaTabX.AddValue(Sxtb,1,3,imgclose);
			     ob1.align="center";
				 
			}			  
					  
}	
 function GetWidth()

      {
 
              var x = 0;

              if (self.innerHeight)

              {
 
                      x = self.innerWidth;
  
              }
  
              else if (document.documentElement && document.documentElement.clientHeight)
  
              {
 
                      x = document.documentElement.clientWidth;
 
              }

              else if (document.body)
 
              {
 
                      x = document.body.clientWidth;

              }
  
              return x;

      }
 
       
  
      function GetHeight()
 
      {
 
              var y = 0;

              if (self.innerHeight)
 
              {

                      y = self.innerHeight;

              }
 
              else if (document.documentElement && document.documentElement.clientHeight)

              {

                      y = document.documentElement.clientHeight;
 
              }

              else if (document.body)
 
              {
  
                      y = document.body.clientHeight;

              }

              return y;

      }
function responsetable(id)
{
	var wdh=GetWidth();
	var obj=id.constructor==String?Dox.SasiyaElement(id):id;
	if(!obj)return;
	
	var rws=obj.rows;
	var lmt=rws[0].cells.length;
	var nmt=1;
	if(wdh<=300){var limstart=3;var limstartc=1;}
	else if(wdh<=500){var limstart=4;var limstartc=2;}
	else if(wdh<=700){var limstart=5;var limstartc=3;}
	else {var limstart=3;var limstartc=1;}
	nmt=limstartc;
	for(var j=0;j<lmt-limstart;j++){var cels=rws[0].cells;nmt+=1;cels[nmt].style.display=wdh<=400?'none':'';}
	for(var i=1;i<rws.length;i++)
	{   
	    nmt=limstartc;
		for(var j=0;j<lmt-limstart;j++){var cels=rws[i].cells;nmt+=1;
		if(cels[nmt])cels[nmt].style.display=wdh<=400?'none':'';
		}
	}
	
} 
function getOffset(el) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + window.scrollX,
    bottom: el.bottom + window.scrollY
  }
}

function getPosition(n,endNode){
    var left = 0;
    var bottom =0;
    var node = n;
    done=false;
    while(!done){
        if(node.offsetLeft!=null)
            left += node.offsetLeft;
        if(node.offsetTop!=null)
            bottom += node.offsetTop;
        if(node.offsetParent){
            node = node.offsetParent;
        }else{
            done = true;
        }
        if(node == endNode)
            done = true;
    }
    done=false;
    node = n;
    while(!done){
        if(document.all && node.style && parseInt(node.style.borderLeftWidth)){
            left += parseInt(node.style.borderLeftWidth);
        }
        if(document.all && node.style && parseInt(node.style.borderTopWidth)){
            bottom += parseInt(node.style.borderTopWidth);
        }

        if(node.scrollLeft){
            left -= node.scrollLeft;
        }
        if(node.scrollTop)
            bottom -= node.scrollTop;
        if(node.parentNode)
            node = node.parentNode;
        else
            done=true;
    }
    return new Array(left);
}

