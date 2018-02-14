var SasiyaAjax= new SasiyaAjax()
var SasiyaDocX=document;
var SaEleAcceX=document.getElementById;
var SaBody=document.getElementsByTagName;
var SIE4=document.all
var SaIE6andNs6=document.getElementById
var SaXn4=document.layers;
var SaXReslt;
var tmsty=null;
var funcal=new Array();
var ldhtml=new Array();
function SasiyaAjax()
{
	this.setloadimage=function(id,html)
	              { 
					  var obj=id.constructor==String? Dox.SasiyaElement(id):id;
					  var ids=obj.id;
					  if(typeof(obj.id)=='undefined'){ids='A'+Math.random(0,100)+Math.random(0,200)+Math.random(0,50);obj.id=ids;}
					  else if(obj.id==''){ids='A'+Math.random(0,100)+Math.random(0,200)+Math.random(0,50);obj.id=ids;}
					  if(obj.tagName.search(/img/i)>=0){ldhtml[ids]=obj.src;obj.src=html;}
					  else if(obj.tagName.search(/input|textarea/i)>=0){ldhtml[ids]=obj.value;obj.value=html;}
					  else if(obj.innerHTML){ldhtml[ids]=obj.innerHTML;obj.innerHTML=html;}
				 }
	this.loadimage=function(id)
	              {
					  var obj=id.constructor==String? Dox.SasiyaElement(id):id;
					  var ids=obj.id;
					  if(obj.tagName.search(/img/i)>=0){obj.src=ldhtml[ids];}
					  else if(obj.tagName.search(/input|textarea/i)>=0){obj.value=ldhtml[ids];}
					  else if(obj.innerHTML){obj.innerHTML=ldhtml[ids];}
				 }			 
	this.Connect=function(url,method,params,id)
				{
				var xmlHttp;
				xmlHttp=this.Support();	
				SaXReslt=SasiyaDocX.getElementById(id).innerHTML="<img src='Configration/images/loading.gif'/>";
				if (xmlHttp==null)
				
				{	
					alert ("Please run in Any Browser,it is not  browser.")
					return	
				} 
				  
					xmlHttp.onreadystatechange=function()
					{
						if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
						{
							 resText=xmlHttp.responseText;
							 SaIE6andNs6?SaXReslt=SasiyaDocX.getElementById(id):SIE4?SaXReslt=SasiyaDocX.all[id]:SaXn4?SaXReslt=SasiyaDocX.layers[id]:null;
							 SaXReslt.value?SaXReslt.value=resText:SaXReslt.innerHTML=resText;
						}
					}
					
					xmlHttp.open(method.toUpperCase(), url, true);		
					xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");		
					xmlHttp.setRequestHeader("Content-length", params.length);		
					xmlHttp.setRequestHeader("Connection", "close");		
					xmlHttp.send(params);
					
				},
	this.Connect_call_back=function(url,method,params,n,call_back)
				{
				var xmlHttp;
				xmlHttp=this.Support();	
				//alert("ok2")
				if (xmlHttp==null)
				
				{	
					alert ("Please run in Any Browser,it is not  browser.")
					return	
				} 
				  
					xmlHttp.onreadystatechange=function()
					{
					if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete"){resText=xmlHttp.responseText;
					if(call_back!="none")call_back(resText,n)}
					}
					
					xmlHttp.open(method.toUpperCase(), url, true);		
					xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");		
					xmlHttp.setRequestHeader("Content-length", params.length);		
					xmlHttp.setRequestHeader("Connection", "close");		
					xmlHttp.send(params);
					
				},			
	
	this.Support=function()	
				{ 	
					var objXMLHttp=null	
					if (window.XMLHttpRequest){objXMLHttp=new XMLHttpRequest()}	
					else if (window.ActiveXObject){objXMLHttp=new ActiveXObject("Microsoft.XMLHTTP")}	
					return objXMLHttp	
				},
    this.Setvalue=function(id,txt)	
				{ 	
				  
					var SaXReslt=id.constructor==String? this.Getobj(id):id;
				if(SaXReslt.tagName.search(/input/i)>=0 || SaXReslt.tagName.search(/textarea/i)>=0){SaXReslt.value=txt;}
				else {SaXReslt.innerHTML=txt;}
				 
					//SaXReslt.value?SaXReslt.value=txt:SaXReslt.innerHTML=txt;
					
				}
	this.set2Value=function(id,id2)	
				{ 	
				  var SaXReslt=id.constructor==String? this.Getobj(id):id;
				var txt=this.Getvalue(id2);
				if(SaXReslt.tagName.search(/input/i)>=0 || SaXReslt.tagName.search(/textarea/i)>=0){SaXReslt.value=txt;}
				else {SaXReslt.innerHTML=txt;}
					//SaXReslt.value?SaXReslt.value=txt:SaXReslt.innerHTML=txt;
					
				}			
	this.addValue=function(id,txt,n)	
				{ 	try{
				
					var SaXReslt=id.constructor==String? this.Getobj(id):id;
				
				if(SaXReslt.tagName.search(/input/i)>=0 || SaXReslt.tagName.search(/textarea/i)>=0)
				{
					if(n==0)SaXReslt.value+=txt;
				    else SaXReslt.value=txt+SaXReslt.value;
				}
				else {
					if(n==0)SaXReslt.innerHTML+=txt;
				    else SaXReslt.innerHTML=txt+SaXReslt.innerHTML;
					}
					}catch(er){alert(id+"->"+er)}
					
				}			
	this.Getvalue=function(id,txt)	
				{ 	
					var SaXReslt=id.constructor==String? this.Getobj(id):id;
				 // alert(SaXReslt.tagName)
				    if(SaXReslt.tagName.search(/input/i)>=0 || SaXReslt.tagName.search(/textarea/i)>=0)var Stxte=SaXReslt.value;
				    else var Stxte=SaXReslt.innerHTML;
					return Stxte;
					
					
				}
	this.Getobj=function(id)	
				{ 	
					try{SaIE6andNs6?SaXReslt=SasiyaDocX.getElementById(id):SIE4?SaXReslt=SasiyaDocX.all[id]:SaXn4?SaXReslt=SasiyaDocX.layers[id]:null;
					return SaXReslt;}catch(er){alert(id+"->"+er)}
					
				}				
  this.formData=function(obj)	
			   {//alert('in')
				 var SaXReslt=obj.constructor==String? this.Getobj(obj):obj;
				 var datae0=SaXReslt.getElementsByTagName("input");
				 var datae2=SaXReslt.getElementsByTagName("select");
				 var datae3=SaXReslt.getElementsByTagName("textarea");
				 var datael = new Array();
				 var n=0;
				 for(var i=0;i<datae0.length;i++){datael[i]=datae0[i];n+=1;}
				 for(var i=0;i<datae2.length;i++){datael[n]=datae2[i];n+=1;}
				 for(var i=0;i<datae3.length;i++){datael[n]=datae3[i];n+=1;}
				 
				 var data="";//alert(datael.length);
				     for(var i=0;i<datael.length;i++)
					 {//alert(datael[i].name)
						var dataor=datael[i].name+"="+datael[i].value;
						    dataor=dataor.replace("&","%A|D%");
							if(datael[i].type.search(/checkbox|radio/)>=0)
							{
						       if(datael[i].checked){
								   if(i==0)data=dataor;
						           else data+="&"+dataor;
							   }
							}else
							{
								if(i==0)data=dataor;
						        else data+="&"+dataor;
							}
					 }
					 //alert(data);//return
				     return data;
			   }
  this.formcData=function(obj,chtxt,action)	
			   {//alert('in')
			     var strdata="";
				 var SaXReslt=obj.constructor==String? this.Getobj(obj):obj;//alert(SaXReslt);
				 var datae0=SaXReslt.getElementsByTagName("input");
				 var datae2=SaXReslt.getElementsByTagName("select");
				 var datae3=SaXReslt.getElementsByTagName("textarea");
				 var datael = new Array();
				 var n=0;
				 for(var i=0;i<datae0.length;i++){datael[i]=datae0[i];n+=1;}
				 for(var i=0;i<datae2.length;i++){datael[n]=datae2[i];n+=1;}
				 for(var i=0;i<datae3.length;i++){datael[n]=datae3[i];n+=1;}
				 
				 var data="";//alert(datael.length);
				     for(var i=0;i<datael.length;i++)
					 {//alert(datael[i].name)
						//var dataor=datael[i].name+"="+datael[i].value;
						if(datael[i].type.search(/checkbox|radio/i)>=0 && datael[i].checked){
						var txvb=chtxt.replace("{NAME}",datael[i].name);
						    strdata+=txvb.replace("{VALUE}",datael[i].value);
							//alert(datael[i].name+"=WWWWWWW="+datael[i].value)
						}
						else if(datael[i].type.search(/checkbox|radio/i)<0)
						{//alert(datael[i].name+"=WWWWWWW="+datael[i].value)
							var txvb=chtxt.replace("{NAME}",datael[i].name);
						    strdata+=txvb.replace("{VALUE}",datael[i].value);
						}
						   //dataor=dataor.replace("&","%A|D%");
						//if(i==0)data=dataor;
						//else data+="&"+dataor;
					 }
					 //alert(data);//return
				    var frmv="<form method='"+SaXReslt.method+"' action='"+action+"'>"+strdata+"</form>";
					return frmv;
			   }			   
  this.formSubmit=function(pid,n)
  {
	if(!this.Getobj("Sasiya_Cmshh"))
	{
	var sasiya_dv=document.createElement('span');
	    //sasiya_dv.style.display="none";
		//if(window.location.href.search(/editor/)>0)var flnm="../submitdata.html";
		//else var flnm="submitdata.html";
		
	    sasiya_dv.innerHTML='<iframe id="Sasiya_Cmshh"  src="postdata.php" class="frm" frameborder="0" width="100%" height="100"  ></iframe>';
	    document.body.appendChild(sasiya_dv);
		
	   // SasiyaAjax.Getobj("testid").appendChild(sasiya_dv);;
	}
	else{var sasiyafrm=SasiyaAjax.Getobj("Sasiya_Cmshh").contentWindow?SasiyaAjax.Getobj("Sasiya_Cmshh").contentWindow:SasiyaAjax.Getobj("Sasiya_Cmshh").contentDocument;
	sasiyafrm.document.body.innerHTML='<div id="sasiya_formdata">&nbsp;</div>';
	}
	submitcall2(pid,n);
	
	
  }
  this.framex=function(id)
  {var sasiyafrm=this.Getobj(id).contentWindow?this.Getobj(id).contentWindow:this.Getobj(id).contentDocument;
  
   var thedoc =sasiyafrm.document;
  return  thedoc;
  }
}

function submitcall2(pid,n)
{
	var sasiyafrm=SasiyaAjax.Getobj("Sasiya_Cmshh").contentWindow?SasiyaAjax.Getobj("Sasiya_Cmshh").contentWindow:SasiyaAjax.Getobj("Sasiya_Cmshh").contentDocument;
	 var thedoc =sasiyafrm.document;
	//alert(sasiyafrm.document.body.innerHTML)
	if(sasiyafrm.document.getElementById("sasiya_formdata"))
	{
	//alert(sasiyafrm.document.body.innerHTML+"==="+SasiyaAjax.Getvalue(pid));
	thedoc.getElementById("sasiya_formdata").innerHTML=SasiyaAjax.Getvalue(pid);
	var frm=thedoc.getElementsByTagName("form");	 
	frm[0].submit();
	clearTimeout(tmsty);ch_success(pid,n);
	
	}
	else{tmsty= setTimeout("submitcall2('"+pid+"','"+n+"')",50);}
	
}
function ch_success(pid,n)
{
	var sasiyafrm=SasiyaAjax.Getobj("Sasiya_Cmshh").contentWindow?SasiyaAjax.Getobj("Sasiya_Cmshh").contentWindow:SasiyaAjax.Getobj("Sasiya_Cmshh").contentDocument;
	var thedoc =sasiyafrm.document;//alert(sasiyafrm.document.body.innerHTML)
	
	if(sasiyafrm.document.body.innerHTML.search("SUCCESS")>=0)
	{ 
	//alert(sasiyafrm.document.body.innerHTML)
	//alert(thedoc.getElementbyId("spasuc"))
	clearTimeout(tmsty);
	var sdata=sasiyafrm.document.getElementById("sasiya_formdata").innerHTML;alert(sasiyafrm.document.body.innerHTML)
	sasiyafrm.document.getElementById("sasiya_formdata").innerHTML="";
	call_form_submit(sdata,n);
	sasiyafrm.document.body.innerHTML='<div id="sasiya_formdata">&nbsp;</div>';
	//alert(sasiyafrm.document.body.innerHTML)
	}else{tmsty= setTimeout("ch_success('"+pid+"','"+n+"')",50);}
	
	//catch(er){tmsty= setTimeout("ch_success('"+pid+"','"+n+"')",1000);}
}
function e(id){
	SaIE6andNs6?SaXReslt=SasiyaDocX.getElementById(id):SIE4?SaXReslt=SasiyaDocX.all[id]:SaXn4?SaXReslt=SasiyaDocX.layers[id]:"";
	return SaXReslt;
	}
function _(el){
	return document.getElementById(el);
}
function uploadFile(url){
	var file = _("file1").files[0];
	// alert(file.name+" | "+file.size+" | "+file.type);
	alert(_("file1").files[1].name);return;
	var formdata = new FormData();
	formdata.append("file1", file);
	var ajax = new XMLHttpRequest();
	ajax.upload.addEventListener("progress", progressHandler, false);
	ajax.addEventListener("load", completeHandler, false);
	ajax.addEventListener("error", errorHandler, false);
	ajax.addEventListener("abort", abortHandler, false);
	ajax.open("POST", url);
	ajax.send(formdata);
}
function progressHandler(event){
	_("loaded_n_total").innerHTML = "Uploaded "+event.loaded+" bytes of "+event.total;
	var percent = (event.loaded / event.total) * 100;
	_("progressBar").value = Math.round(percent);
	_("status").innerHTML = Math.round(percent)+"% uploaded... please wait";
}
function completeHandler(event){
	_("status").innerHTML = event.target.responseText;
	_("progressBar").value = 0;
}
function errorHandler(event){
	_("status").innerHTML = "Upload Failed";
}
function abortHandler(event){
	_("status").innerHTML = "Upload Aborted";
}	