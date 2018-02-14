var id = 1; var lpos = 1; var npos = 1; var postm = true;
var notify = function (message) {

}
var getKeyCode = function (str) {
	return str.charCodeAt(str);
}
function showmsgin(mid, n) {
	showtabs(3)
	SasiyaAjax.setloadimage("contentview3", "<img src='assets/icon/procs.gif'/>");
	SasiyaAjax.Connect_call_back("http://denyoappv2.stridecdev.com/denyo2.php?method=mview&id=" + id + "&v=" + mid + "&n=" + n, 'get', '', 0, function (tx, n) { e("contentview3").innerHTML = tx; });

}
function replayall(n) {
	if (n == 0) {
		e('to').value = e('from').innerHTML;

	}
	e('subject').value = e('su').innerHTML;
	e('message').value = e('msgbody').innerHTML;

	showtabs(2);
}
function showtabs(n) {
	if (n == 0) {
		SasiyaAjax.setloadimage("contentview", "<img src='assets/icon/procs.gif'/>");
		SasiyaAjax.Connect_call_back("http://denyoappv2.stridecdev.com/denyo2.php?method=inbox&id=" + id, 'get', '', 0, function (tx, n) { e("contentview").innerHTML = tx; });
		e('homepage').style.display = ""; e('sendpage').style.display = "none"; e('compose').style.display = "none"; e('dm').style.display = "none"; e('viewmsg').style.display = "none";
	}
	else if (n == 1) {
		SasiyaAjax.setloadimage("contentview2", "<img src='assets/icon/procs.gif'/>");
		SasiyaAjax.Connect_call_back("http://denyoappv2.stridecdev.com/denyo2.php?method=sent&id=" + id, 'get', '', 0, function (tx, n) { e("contentview2").innerHTML = tx; });
		e('homepage').style.display = "none"; e('sendpage').style.display = ""; e('compose').style.display = "none"; e('dm').style.display = "none"; e('viewmsg').style.display = "none";
	}
	else if (n == 3) { e('homepage').style.display = "none"; e('sendpage').style.display = "none"; e('compose').style.display = "none"; e('dm').style.display = "none"; e('viewmsg').style.display = ""; }
	else { e('homepage').style.display = "none"; e('sendpage').style.display = "none"; e('compose').style.display = ""; e('dm').style.display = ""; e('viewmsg').style.display = "none"; }
}
function ordermsg(obj, n) {

	if (obj.value >= 1) {
		if (n == 0) {
			SasiyaAjax.setloadimage("contentview", "<img src='assets/icon/procs.gif'/>");
			SasiyaAjax.Connect_call_back("http://denyoappv2.stridecdev.com/denyo2.php?method=inbox&id=" + id + "&v=" + obj.value, 'get', '', 0, function (tx, n) { e("contentview").innerHTML = tx; });
		}
		else {
			SasiyaAjax.setloadimage("contentview2", "<img src='assets/icon/procs.gif'/>");
			SasiyaAjax.Connect_call_back("http://denyoappv2.stridecdev.com/denyo2.php?method=sent&id=" + id + "&v=" + obj.value, 'get', '', 0, function (tx, n) { e("contentview2").innerHTML = tx; });
		}
	}
}
function actmsg(obj, n) {
	if (obj.value >= 1) {
		if (n == 0) {
			var pos = SasiyaAjax.formData("contentview");
			SasiyaAjax.setloadimage("contentview", "<img src='assets/icon/procs.gif'/>");
			SasiyaAjax.Connect_call_back("http://denyoappv2.stridecdev.com/denyo2.php?method=action&id=" + id + "&v=" + obj.value + '&a=' + obj.value + "&n=" + n, 'post', pos, 0, function (tx, n) { e("contentview").innerHTML = tx; });
		}
		else {
			var pos = SasiyaAjax.formData("contentview2");
			SasiyaAjax.setloadimage("contentview2", "<img src='assets/icon/procs.gif'/>");
			SasiyaAjax.Connect_call_back("http://denyoappv2.stridecdev.com/denyo2.php?method=action&id=" + id + "&v=" + obj.value + '&a=' + obj.value + "&n=" + n, 'post', pos, 0, function (tx, n) { e("contentview2").innerHTML = tx; });
		}
	}
}
function sendmsg() {
	SasiyaAjax.setloadimage("contentview2", "<img src='assets/icon/procs.gif'/>");
	SasiyaAjax.Connect_call_back("http://denyoappv2.stridecdev.com/denyo2.php?method=sent&id=1", 'get', '', 0, function (tx, n) { e("contentview2").innerHTML = tx; });
}
function sptions(ev) {
	var userId = localStorage.getItem("userInfoId");
	var companyId = localStorage.getItem("userInfoCompanyId");


	var evt = ev || window.event || {}; var code = ev.charCode || ev.keyCode || ev.which;
	var kCd = ev.keyCode || ev.charCode; var obj = evt.target;
	//var code = (e.keyCode ? e.keyCode : e.which);
	var scrollPos = obj.scrollTop;
	var caretPos = obj.selectionStart;
	var front = (obj.value).substring(0, caretPos);
	var back = (obj.value).substring(obj.selectionEnd, obj.value.length);
	var atpos = front.lastIndexOf('@'); npos = atpos;
	var charsplit = obj.value.split(" ");
	var lastchar = charsplit[charsplit.length - 1];
	var ltpos = lastchar.lastIndexOf('@');
	var hashpos = lastchar.lastIndexOf('#');
	//alert(ltpos);
	if (ltpos == 0 && !hashpos >= 0) {
		//e('pol').innerHTML=obj.offsetWidth+"=="+obj.offsetHeight;	 
		var strkeys = front.substring(atpos + 1, atpos.length);
		//alert(strkeys);
		//if (strkeys.length >= 1) {
			strkeys = strkeys.replace("#", "%23");
		SasiyaAjax.Connect_call_back("http://denyoappv2.stridecdev.com/api/atmentioned.php?method=atmention&id=" + id + "&tem=" + strkeys + "&act=message&companyId=" + companyId + "&userId=" + userId, 'get', '', 0, function (tx, n) {
			if (!e("suschoise")) { var el = document.createElement("div"); el.className = "subx"; el.id = "suschoise"; document.body.appendChild(el); }
			var tmp = e("suschoise"); tmp.innerHTML = tx; tmp.style.display = "block";
			tmp.style.width = obj.offsetWidth + "px";
			var searchbox = obj; // add that id, not just class name to html				
			var pos = getPosition(searchbox);
			tmp.style.left = obj.offsetLeft + "px";
			// tmp.style.left = pos[0] + "px";
			tmp.style.top = (pos[1] + searchbox.offsetHeight) + "px";
			tmp.style.visibility = "visible";

		});
		//}
	}
}

function sptions(ev) {

	var userId = localStorage.getItem("userInfoId");
	var companyId = localStorage.getItem("userInfoCompanyId");
	var evt = ev || window.event || {}; var code = ev.charCode || ev.keyCode || ev.which;
	var kCd = ev.keyCode || ev.charCode; var obj = evt.target;
	//var code = (e.keyCode ? e.keyCode : e.which);
	var scrollPos = obj.scrollTop;
	var caretPos = obj.selectionStart;
	var front = (obj.value).substring(0, caretPos);
	var back = (obj.value).substring(obj.selectionEnd, obj.value.length);
	var atpos = front.lastIndexOf('@'); npos = atpos;
	var charsplit = obj.value.split(" ");
	var lastchar = charsplit[charsplit.length - 1];
	var ltpos = lastchar.lastIndexOf('@');
	var hashpos = lastchar.lastIndexOf('#');
	//alert(ltpos);
	if (ltpos == 0 && !hashpos >= 0) {
		//e('pol').innerHTML=obj.offsetWidth+"=="+obj.offsetHeight;	 
		var strkeys = front.substring(atpos + 1, atpos.length);
		//alert(strkeys);
		//if (strkeys.length >= 1) {
			strkeys = strkeys.replace("#", "%23");
		SasiyaAjax.Connect_call_back("http://denyoappv2.stridecdev.com/api/atmentioned.php?method=atmention&id=" + id + "&tem=" + strkeys + "&act=&companyId=" + companyId + "&userId=" + userId, 'get', '', 0, function (tx, n) {
			if (!e("suschoise")) { var el = document.createElement("div"); el.className = "subx"; el.id = "suschoise"; document.body.appendChild(el); }
			var tmp = e("suschoise"); tmp.innerHTML = tx; tmp.style.display = "block";
			tmp.style.width = obj.offsetWidth + "px";
			var searchbox = obj; // add that id, not just class name to html				
			var pos = getPosition(searchbox);
			tmp.style.left = obj.offsetLeft + "px";
			// tmp.style.left = pos[0] + "px";
			tmp.style.top = (pos[1] + searchbox.offsetHeight) + "px";
			tmp.style.visibility = "visible";

		});
		//}
	}
}

function message(ev) {

	var userId = localStorage.getItem("userInfoId");
	var companyId = localStorage.getItem("userInfoCompanyId");
	var evt = ev || window.event || {}; var code = ev.charCode || ev.keyCode || ev.which;
	var kCd = ev.keyCode || ev.charCode; var obj = evt.target;
	//var code = (e.keyCode ? e.keyCode : e.which);
	var scrollPos = obj.scrollTop;
	var caretPos = obj.selectionStart;
	var front = (obj.value).substring(0, caretPos);
	var back = (obj.value).substring(obj.selectionEnd, obj.value.length);
	var atpos = front.lastIndexOf('@'); npos = atpos;
	var charsplit = obj.value.split(" ");
	var lastchar = charsplit[charsplit.length - 1];
	var ltpos = lastchar.lastIndexOf('@');
	var hashpos = lastchar.lastIndexOf('#');
	//alert(ltpos);
	if (ltpos == 0 && !hashpos >= 0) {

		//e('pol').innerHTML=obj.offsetWidth+"=="+obj.offsetHeight;	 
		var strkeys = front.substring(atpos + 1, atpos.length);
		//alert(strkeys);
		//if (strkeys.length >= 1) {

		strkeys = strkeys.replace("#", "%23");
		SasiyaAjax.Connect_call_back("http://denyoappv2.stridecdev.com/api/atmentioned.php?method=atmention&id=" + id + "&tem=" + strkeys + "&act=message&companyId=" + companyId + "&userId=" + userId, 'get', '', 0, function (tx, n) {
			if (!e("suschoise")) { var el = document.createElement("div"); el.className = "subx"; el.id = "suschoise"; document.body.appendChild(el); }
			var tmp = e("suschoise"); tmp.innerHTML = tx; tmp.style.display = "block";
			tmp.style.width = obj.offsetWidth + "px";
			var searchbox = obj; // add that id, not just class name to html				
			var pos = getPosition(searchbox);
			tmp.style.left = obj.offsetLeft + "px";
			// tmp.style.left = pos[0] + "px";
			tmp.style.top = (pos[1] + searchbox.offsetHeight) + "px";
			tmp.style.visibility = "visible";

		});
		//}
	}
}



function unit(ev) {

	var userId = localStorage.getItem("userInfoId");
	var companyId = localStorage.getItem("userInfoCompanyId");
	var evt = ev || window.event || {}; var code = ev.charCode || ev.keyCode || ev.which;
	var kCd = ev.keyCode || ev.charCode; var obj = evt.target;
	//var code = (e.keyCode ? e.keyCode : e.which);
	var scrollPos = obj.scrollTop;
	var caretPos = obj.selectionStart;
	var front = (obj.value).substring(0, caretPos);
	var back = (obj.value).substring(obj.selectionEnd, obj.value.length);
	var atpos = front.lastIndexOf('@'); npos = atpos;
	var charsplit = obj.value.split(" ");
	var lastchar = charsplit[charsplit.length - 1];
	var ltpos = lastchar.lastIndexOf('@');
	var hashpos = lastchar.lastIndexOf('#');
	//alert(ltpos);
	if (ltpos == 0 && !hashpos >= 0) {
		//e('pol').innerHTML=obj.offsetWidth+"=="+obj.offsetHeight;	 
		var strkeys = front.substring(atpos + 1, atpos.length);
		//alert(strkeys);
		//if (strkeys.length >= 1) {
			strkeys = strkeys.replace("#", "%23");
		SasiyaAjax.Connect_call_back("http://denyoappv2.stridecdev.com/api/atmentioned.php?method=atmention&id=" + id + "&tem=" + strkeys + "&act=unit&companyId=" + companyId + "&userId=" + userId, 'get', '', 0, function (tx, n) {
			if (!e("suschoise")) { var el = document.createElement("div"); el.className = "subx"; el.id = "suschoise"; document.body.appendChild(el); }
			var tmp = e("suschoise"); tmp.innerHTML = tx; tmp.style.display = "block";
			tmp.style.width = obj.offsetWidth + "px";
			var searchbox = obj; // add that id, not just class name to html				
			var pos = getPosition(searchbox);
			tmp.style.left = obj.offsetLeft + "px";
			// tmp.style.left = pos[0] + "px";
			tmp.style.top = (pos[1] + searchbox.offsetHeight) + "px";
			tmp.style.visibility = "visible";

		});
		//}
	}
}
function setct(obj) { insertAtCaret("to", obj.innerHTML); if (e("suschoise")) { e("suschoise").style.display = "none"; } }

function address1get(val) {	
	localStorage.setItem("atMentionResult", val);
}
function sptionshide() { setTimeout(function () { if (e("suschoise")) { e("suschoise").style.display = "none"; } }, 150); }
function postmsg(obj) {

	if (postm) {
		postm = false;
		var pos = SasiyaAjax.formData("mwin");
		SasiyaAjax.Connect_call_back("http://denyoappv2.stridecdev.com/denyo2.php?method=compose&id=" + id, 'post', pos, 0, function (tx, n) {
			showtabs(1); postm = true; sendmsg();
		});
	}
}
function insertAtCaret(areaId, text) {
	var txtarea = document.getElementById(areaId);
	var scrollPos = txtarea.scrollTop;
	var caretPos = txtarea.selectionStart;

	var front = (txtarea.value).substring(0, caretPos + 1);
	var back = (txtarea.value).substring(txtarea.selectionEnd, txtarea.value.length);
	var atpos = front.lastIndexOf('@'); front = (txtarea.value).substring(0, atpos);
	txtarea.value = front + text + back;
	caretPos = caretPos + text.length;
	txtarea.selectionStart = caretPos;
	txtarea.selectionEnd = caretPos;
	txtarea.focus();
	txtarea.scrollTop = scrollPos;
}

function setauto() {
	var inputs = document.querySelectorAll('.suggest');
	for (var i = 0; field = inputs[i]; i++) {
		field.addEventListener('keyup', function (event) {
			var text = 'You typed: ' + this.value;

			if (!this.suggestion) {
				var rect = this.getBoundingClientRect();
				var left = rect.left;
				var top = rect.bottom;
				this.suggestion = document.createElement('DIV');
				this.suggestion.innerHTML = text;
				this.suggestion.setAttribute('style', 'background: #B0B0B0; padding: 6px; position: absolute; top: ' + top + 'px; left: ' + left + 'px;');
				this.parentNode.appendChild(this.suggestion);
			} else {
				this.suggestion.innerHTML = text;
				this.suggestion.style.display = 'block';
			}

		});
		field.addEventListener('blur', function (event) {
			if (this.suggestion) {
				this.suggestion.style.display = 'none';
			}
		});
	}
}