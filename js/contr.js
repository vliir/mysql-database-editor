var s_obj={cmd:0};
var ins_str=0; // ����: 1 - ���� ������ ������ ��������; 0 - ���
var mos_otm=0; //����: 1 - ���� ��������� �� ������ ��������
/*�������� o������ drav ��� ���������� ��������� ������*/
var drav={};
/*���������� �������*/
drav.w_table="";//��� ������� (�������) �������
drav.tabl=[];//��������� ������ � ����� ��������� �������
drav.z_tabl=[];//������ � ����������� �������� �������
drav.m_tabl=[];//������ � ������ ������ �������
               //drav.pri_table - ����� ���� ���������� �����
/*���������� �������*/
drav.tab_name = function(obj){//����� ���� ������ � ��������� ������� ����� ����
/*����� ������ ����������� � ��*/
    $("#hst").children("span").replaceWith("<span>"+obj.arr[0]+"</span>");
	$("#base-name").children("span").replaceWith("<span>"+obj.arr[3]+"</span>");
	$("#user-name").children("span").replaceWith("<span>"+obj.arr[1]+"</span>");
	/*����� ���� ������ ��*/
	
	  $("#lbb").children("ul").replaceWith("<ul></ul>");
	  for(var i=0; i<obj.tab_names.length; i++){
	   var elem = $("<li>"+obj.tab_names[i]+"</li>");
	   elem.click(function() { o_kn(this); });
	   $("#lbb").children("ul").append(elem);
	 } 
}
drav.w_tab_name = function(){//���������� ����� ������� �������
 $("#tab-name").children("span").replaceWith("<span>"+this.w_table+"</span>");
}
drav.t_table = function (){//���������� ���� ������� �������
 $("#cont").children("table").replaceWith("<table></table>");
 /*������ ���������� � ����������*/
  
  if (this.z_tabl.length>0){
   $("#cont").children("table").append("<thead><tr><td></td></tr></thead>");
   
   for(var j=0; j<this.z_tabl.length; j++){
     if ((drav.pri_table - 1) == j){
	 var aa=this.z_tabl[j]+", PRI";
	 }
	 else{
	 var aa=this.z_tabl[j];
	 }
	   $("#cont").children("table").children("thead").children("tr").eq(0).append("<td>"+aa+"</td>");
	  }
  }
 if (this.m_tabl.length>0){
   $("#cont").children("table").children("thead").append("<tr><td></td></tr>");
   for(var j=0; j<this.m_tabl.length; j++){
	   $("#cont").children("table").children("thead").children("tr").eq(1).append("<td>"+this.m_tabl[j]+"</td>");
	  }
  }
 /*������ ���� �������*/
  if (this.tabl.length>0){
    for(var i=0; i<this.tabl.length; i++){
	
	  $("#cont").children("table").append('<tr id="str'+i+'"></tr>');
	  var elem = $('<td><input type="checkbox" name="'+i+'"></td>');
	  $("#cont").children("table").children("tr").eq(i).append(elem);
	   for(var j=0; j<this.tabl[i].length; j++){
	   var elem = $("<td>"+this.tabl[i][j]+"</td>");
	   var zn="num"+i+"-"+j;
	   elem.attr("data-num",zn);
	   elem.attr("contenteditable","true")
	   elem.focus(function(){cell_cl(this)});
	   elem.focusout(function(){cell_ou(this)});
	   $("#cont").children("table").children("tr").eq(i).append(elem);
	  }
	}
  }
this.cont();
}
drav.str_table = function (){//���������� ������ ������ � ����� ������� �������
if (this.tabl.length>0){
  var i=this.tabl.length;
  }
  else
  {
  var i=0;
  }
 $("#cont").children("table").append('<tr id="str'+i+'"><td></td></tr>');
  for(var j=0; j<this.z_tabl.length; j++){
  
   var elem = $("<td></td>");
	   var zn="num"+i+"-"+j;
	   elem.attr("data-num",zn);
	   elem.attr("contenteditable","true")
	   $("#cont").children("table").children("tr:last").append(elem);
	 }

}
drav.cont = function(){//������ ���������� ����� � ��������
 /*var colstr=this.tabl.length;*/
 var colstr=0;
 for (dd in  this.tabl){
 colstr +=1;
 }
 var colstl=this.z_tabl.length;
 $("div#rb-str").children("span").replaceWith("<span>"+colstr+"</span>");
 $("div#rb-stl").children("span").replaceWith("<span>"+colstl+"</span>");
}  

/*������� ������������ ������� ��� ������ � ������*/
$("button#is").click(function(){but_is()});//������ ������ �������� ������
$("button#ds").click(function(){but_ds()});//������ ������ ������� ������
$("button#otm").click(function(){but_otm()});//������ ������ ��������
$("button#save").click(function(){but_save()});//������ ������ ���������

$("button#otm").mouseover(function(){mos_otm=1;});//���� � �������� ������ ��������
$("button#otm").mouseout(function(){mos_otm=0;});//���� �� � �������� ������ ��������

/*���������� ������� ������� ������ �������� ������*/
function but_is(){
if (ins_str==0){
ins_str=1;
drav.str_table();
}
else
{
but_save()
drav.str_table();
ins_str=1;
}

}
/*���������� ������� ������� ������ ������� ������*/
function but_ds(){
var inch = $("input:checkbox:checked");
 if (inch.length>0){
 var s_obj = {};
 s_obj.cmd=2; // ������� �� �������� �����
 s_obj.tab_name=drav.w_table;// ��� �������
 s_obj.dat=[];
 s_obj.dat[0]=drav.z_tabl[drav.pri_table-1];
   for(var i=0; i<inch.length; i++){
    var bb=inch.eq(i).attr("name")-0;
    s_obj.dat[i+1] = drav.tabl[bb][drav.pri_table-1];
	var ob_del = "tr#str"+bb;
	$(ob_del).remove();
	
	delete drav.tabl[bb];
	
   }
  s_srv(s_obj);
  drav.cont();
 }
 else{
  print_err("�� �� ������� �� ����� ������ ��� ��������!");
 }  
}
/*���������� ������� ������� ������ ��������*/
function but_otm(){
if (ins_str==1){
$("#cont").children("table").children("tr:last").remove();
ins_str=0;
}
 
}
/*���������� ������� ������� ������ ���������*/
function but_save(){
 if (ins_str==1){
   if (drav.tabl.length>0){
     var j=drav.tabl.length;
    }
	else
	{
	 var j=0;
	}
	var arr=[];
	drav.tabl.push(arr);
  var instr=$("#cont").children("table").children("tr:last").children("td");
  var s_obj = {};
   s_obj.cmd=3; // ������� �� ���������� ������ 
   s_obj.tab_name=drav.w_table;// ��� �������
   s_obj.dat=[];
    for(var i=1;i<instr.length;i++){
     s_obj.dat[i-1]=instr.eq(i).text();
	 
	 instr.eq(i).focus(function(){cell_cl(this)});
	 instr.eq(i).focusout(function(){cell_ou(this)});
	   
	 drav.tabl[j][i-1] = instr.eq(i).text();
    }
	
  var elem = $('<td><input type="checkbox" name="'+j+'"></td>');
	  $("#cont").children("table").children("tr:last").children("td").eq(0).replaceWith(elem);
	  
  
  s_srv(s_obj);
  drav.cont();
  ins_str=0;
 }
}

/*���������� ������� ����� �� ����� �������*/
function o_kn(obj){
$("button#is").removeAttr("disabled");
$("button#ds").removeAttr("disabled");
$("button#otm").removeAttr("disabled");
$("button#save").removeAttr("disabled");
/*�������� �������� �������*/
$("div#lbb li").removeClass("lbb-activ");
$(obj).addClass("lbb-activ");

s_srv({cmd:1,dat:$(obj).text()});
}
/*���������� ������� ����� �� ������ �������*/
function cell_cl(obj){
/*var atr=$(obj).attr("data-num");
var str=atr.slice(3).split("-");
var pole_name=drav.z_tabl[str[1]];
var bb=str[0];
var pri=drav.tabl[bb][drav.pri_table-1];*/
}
function cell_ou(obj){// ������ ������ ������ �������
var atr=$(obj).attr("data-num");
var str=atr.slice(3).split("-");
var pole_name=drav.z_tabl[str[1]];
var bb=str[0];
var pri=drav.tabl[bb][drav.pri_table-1];
var txt=$(obj).text();

if (mos_otm==1){//������ ������ ������ ��������
$(obj).text(drav.tabl[bb][str[1]]);
}
else
{
/*������������ ������ �� ��������������*/
var s_obj = {};
s_obj.cmd=4; // ������� �� ��������������
s_obj.tab_name=drav.w_table;// ��� �������
 s_obj.dat=[];
s_obj.dat[0]=drav.z_tabl[drav.pri_table-1];//��� ���� ���������� �����
s_obj.dat[1]=pri; //�������� ���������� �����
s_obj.dat[2]=pole_name; // ��� �������������� ����
s_obj.dat[3]=txt; // �������� �������������� ����

 if (txt!=drav.tabl[str[0]][str[1]]){
 
  s_srv(s_obj);
 }
}
}


function s_srv(obj){//������� �������� �� ������ ������� obj
  
var txt = JSON.stringify(obj); 

$.post( 
"serv.php",
{zapr:txt},
otvet);
}

function print_err(txt){//������� ������ ��������� �� ������ �� �����
$("div#mod-err-fon").css('display', 'block');
$("div#mod-err").css('display', 'block');
$("p#mod-err-txt").children("span").eq(1).replaceWith("<span>"+txt+"</span>");

$("div#mod-err-fon").click(function(){
$("div#mod-err-fon").css('display', 'none');
$("div#mod-err").css('display', 'none');
});

$("div#mod-err").click(function(){
$("div#mod-err-fon").css('display', 'none');
$("div#mod-err").css('display', 'none');
});

}

function otvet(data){ //������� ��������� � ��������� ������ � �������

  var p_obj = JSON.parse(data);
  if (p_obj.err){//��������� ������
    if(p_obj.err==10){//������ ����������� � ���� ������
	 print_err(p_obj.text_err);
	}
	if(p_obj.err==2){//������ �������� �����
	 print_err("�� ������� ������� ������ �� ������� "+p_obj.tab_nm);
	 if(p_obj.tab_nm==drav.w_table){
	  s_srv({cmd:1,dat:p_obj.tab_nm});
     }	 
	}
    if(p_obj.err==3){//�� ������� �������� ������ � �������
	 print_err("�� ������� �������� ������ � ������� "+p_obj.tab_nm);
	}
	if(p_obj.err==4){//������ �������������� ������ � �������
	 print_err("������ �������������� ������ � ������� "+p_obj.tab_nm+" ������ �� ���������");
	}
  
  }
  else
  {
   if (p_obj.cmd==0){//������ �� �����. � ��
    drav.tab_name(p_obj);
   }
   if (p_obj.cmd==1){//������ �� ��������� �������
    drav.w_table=p_obj.tab_nm;
	drav.tabl = p_obj.table;
	drav.z_tabl = p_obj.z_table;
	drav.m_tabl = p_obj.m_table;
	if (p_obj.pri_table){drav.pri_table = p_obj.pri_table;}//��������� ���� �������
	drav.w_tab_name();
    drav.t_table();
	}
  }  
}
$("button#is").attr("disabled","disabled");
$("button#ds").attr("disabled","disabled");
$("button#otm").attr("disabled","disabled");
$("button#save").attr("disabled","disabled");
s_srv(s_obj);