function myFunction() {
	var str;
	alert("in");
	//monday
    var m = document.getElementById("m").checked;
    if (m) {
    	str+="M";
    }

    //tuesday
    var t = document.getElementById("t").checked;
    if (t) {
    	str+="T";
    }

    var w = document.getElementById("w").checked;
    if (w) {
    	str+="W";
    } 

    var r = document.getElementById("r").checked;
    if (r) {
    	str+="R";
    }

    var f = document.getElementById("f").checked;
    if (f) {
    	str+="F";
    }

    var s = document.getElementById("s").checked;
    if (s) {
    	str+="S";
    } 
    var n = document.getElementById("n").checked;
    if (n) {
    	str+="N";
    } 

    alert (str);
}