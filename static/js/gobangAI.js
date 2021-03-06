var script=document.createElement("script");
var istep = 0;
script.type="text/javascript";
script.src="jquery-1.12.4.min.js";
var sKey;
document.getElementsByTagName('head')[0].appendChild(script);

iColor = 0;
function status1() {
    $.ajax({
        url: "/player/" + sKey,
        data:{player:0},
        dataType:"text",
        type:"get",
        success:function (data) {
            console.log(data);
            if(data=="YES"){
                document.getElementById('qizi').src = "/static/images/black.png";
                iColor = 1;
                iswin = false;
            }else{
                alert("黑棋已经被占了");
            }
        },error:function (o,e) {
            alert(e);
        }
    })
}
function status2() {
    $.ajax({
        url: "/player/" + sKey,
        data:{player:1},
        dataType:"text",
        type:"get",
        success:function (data) {
            if(data=="YES"){
                document.getElementById('qizi').src = "/static/images/white.png";
                iColor = -1;
                iswin = false;
            }else{
                alert("白棋已经被占了");
            }
        },error:function (o,e) {
            alert(e);
        }
    })
}

/* 控件事件 */
function closeFunction() {
    if (confirm("是否退出游戏？")) {
        window.close();
    } else {
        history.back();
    }
}

var tds = document.getElementsByTagName('td');
var iswin = false; // 有没有分出胜负

var dromp=function (i, j) {
    if (iswin) {
        alert('游戏结束!');
        return;
    }
    console.log(i+"-"+j);
    $.ajax({
        url:"/drompAI/"+sKey,
        data:{line:i,row:j,color:iColor},
        type:"get",
        dataType:"json",
        success:function(data) {
            console.log(data);

            var line = data['line'];
            var rows = data["rows"];
            var oRow1 = document.getElementById("L"+line[0]+"R"+rows[0]);
            var oRow2 = document.getElementById("L"+line[1]+"R"+rows[1]);
            istep = data["step"]
            if(iColor==1){
                oRow1.style.background = 'url(/static/images/black.png)';
                oRow2.style.background = 'url(/static/images/white.png)';
            }else{
                oRow1.style.background = 'url(/static/images/white.png)';
                oRow2.style.background = 'url(/static/images/black.png)';
            }
            if(data['winner']==0){
                return;
            }
            else if(data['winner']==1){
                alert("黑方获胜");
                iswin = true;
                return;
            }
            else if(data['winner']==-1){
                iswin = true;
                alert("白方获胜");
                return;
            }else if(data["winner"]==65534){
                alert("你的小伙伴还没准备好");
            }
            else{
                alert("年轻人，别心急");
                return;
            }
        },
        error:function (o,e) {
            alert(e);
        }
    })
};

function td_click(i, j) {
    if (iColor!=0) {
        oTd = document.getElementById("L" + i + "R" + j);
        dromp.call(oTd, i, j);
    }
   
}

window.onload = function () {
    sKey = document.getElementById('RoomKey').innerText;
    var oTab = document.getElementById('chess_table');
    var i = 0, j = 0;
    var sTab = "";
    for (i = 0; i < 15; i++) {
        sTab += "<tr>";
        for (j = 0; j < 15; j++) {
            sTab += '<td onclick="td_click(' + i + ',' + j + ')" id="L' + i + 'R' + j + '")>&nbsp;</td>';
        }
        sTab += "</tr>";
    }
    oTab.innerHTML += sTab;
};