;$(function() {
var s_obj={cmd:0};
var ins_str=0; // Флаг: 1 - была нажата кнопка добавить; 0 - нет
var mos_otm=0; //Флаг: 1 - мышь находится на кнопке отменить

/*Создание oбъекта drav для прорисовки элементов таблиц*/
var drav={};
/*объявление свойств*/
drav.w_table="";//имя текущей (рабочей) таблицы
drav.tabl=[];//Двумерный массив с телом выводимой таблицы
drav.z_tabl=[];//Массив с заголовками столбцов таблицы
drav.m_tabl=[];//Массив с типами данных таблицы
               //drav.pri_table - номер поля первичного ключа
               
/*Объявление методов*/
//вывод имен таблиц с привязкой события клика мыши
drav.tab_name = function(obj) {
    /*Вывод данных подключения к БД*/
    $("#hst").text(obj.arr[0]);
    $("#base-name").text(obj.arr[3]);
    $("#user-name").text(obj.arr[1]);
    //$("#hst").children("span").replaceWith("<span>"+obj.arr[0]+"</span>");
	//$("#base-name").children("span").replaceWith("<span>"+obj.arr[3]+"</span>");
	//$("#user-name").children("span").replaceWith("<span>"+obj.arr[1]+"</span>");
	
    /*Вывод имен таблиц БД*/
	$("#lbb").children("ul").replaceWith("<ul></ul>");
	for(var i=0; i<obj.tab_names.length; i++) {
        var elem = $("<li>"+obj.tab_names[i]+"</li>");
        elem.click(function() { o_kn(this); });
        $("#lbb").children("ul").append(elem);
	} 
}

//Прорисовка имени текущей таблицы
drav.w_tab_name = function(){
    $("#tab-name").children("span").replaceWith("<span>"+this.w_table+"</span>");
}

//Прорисовка тела текущей таблицы
drav.t_table = function () {
    $("#cont").children("table").replaceWith("<table></table>");
    
    /*Печать заголовков и метаданных*/
    if (this.z_tabl.length>0) {
        $("#cont").children("table").append("<thead><tr><td></td></tr></thead>");
   
        for(var j=0; j<this.z_tabl.length; j++) {
            if ((drav.pri_table - 1) == j) {
                var aa=this.z_tabl[j]+", PRI";
            } else {
                var aa=this.z_tabl[j];
            }
            
            $("#cont").children("table").children("thead").children("tr").eq(0).append("<td>"+aa+"</td>");
        }
    }
    
    if (this.m_tabl.length > 0) {
        $("#cont").children("table").children("thead").append("<tr><td></td></tr>");
        for(var j=0; j<this.m_tabl.length; j++){
            $("#cont").children("table").children("thead").children("tr").eq(1).append("<td>"+this.m_tabl[j]+"</td>");
        }
    }
    
    /*Печать тела таблицы*/
    if (this.tabl.length > 0) {
        for(var i=0; i<this.tabl.length; i++) {
	
            $("#cont").children("table").append('<tr id="str'+i+'"></tr>');
            var elem = $('<td><input type="checkbox" name="'+i+'"></td>');
            $("#cont").children("table").children("tr").eq(i).append(elem);
            for(var j=0; j < this.tabl[i].length; j++) {
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

//Прорисовка пустой строки в конце текущей таблицы
drav.str_table = function() {
    if (this.tabl.length>0) {
        var i=this.tabl.length;
    }  else  {
        var i=0;
    }
    
    $("#cont").children("table").append('<tr id="str'+i+'"><td></td></tr>');
    
    for(var j=0; j<this.z_tabl.length; j++) {
        var elem = $("<td></td>");
        var zn="num"+i+"-"+j;
        elem.attr("data-num",zn);
        elem.attr("contenteditable","true")
        $("#cont").children("table").children("tr:last").append(elem);
	}
}

//Печать количества строк и столбцов
drav.cont = function() {
    /*var colstr=this.tabl.length;*/
    var colstr=0;
    for (dd in this.tabl) {
        colstr +=1;
    }
    var colstl=this.z_tabl.length;
    $("div#rb-str").children("span").replaceWith("<span>"+colstr+"</span>");
    $("div#rb-stl").children("span").replaceWith("<span>"+colstl+"</span>");
}  

/*Задание обработчиков событий для кнопок в футере*/
$("button#is").click(function(){but_is()});//нажата кнопка Добавить строку
$("button#ds").click(function(){but_ds()});//нажата кнопка Удалить строку
$("button#otm").click(function(){but_otm()});//нажата кнопка Отменить
$("button#save").click(function(){but_save()});//нажата кнопка Сохранить

$("button#otm").mouseover(function(){mos_otm=1;});//мышь в пределах кнопки Отменить
$("button#otm").mouseout(function(){mos_otm=0;});//мышь не в пределах кнопки Отменить

/*Обработчик события нажатия кнопки Добавить строку*/
function but_is() {
    if (ins_str==0){
        ins_str=1;
        drav.str_table();
    } else {
        but_save()
        drav.str_table();
        ins_str=1;
    }
}

/*Обработчик события нажатия кнопки удалить строку*/
function but_ds() {
    var inch = $("input:checkbox:checked");
    if (inch.length>0) {
        var s_obj = {};
        s_obj.cmd=2; // Команда на удаление строк
        s_obj.tab_name=drav.w_table;// имя таблицы
        s_obj.dat=[];
        s_obj.dat[0]=drav.z_tabl[drav.pri_table-1];
        
        for(var i=0; i<inch.length; i++) {
            var bb=inch.eq(i).attr("name")-0;
            s_obj.dat[i+1] = drav.tabl[bb][drav.pri_table-1];
            var ob_del = "tr#str"+bb;
            $(ob_del).remove();
	
            delete drav.tabl[bb];
        }
        
        s_srv(s_obj);
        drav.cont();
    } else {
        print_err("Вы не выбрали ни одной строки для удаления!");
    }  
}

/*Обработчик события нажатия кнопки отменить*/
function but_otm() {
    if (ins_str==1){
        $("#cont").children("table").children("tr:last").remove();
        ins_str=0;
    } 
}

/*Обработчик события нажатия кнопки Сохранить*/
function but_save() {
    if (ins_str==1) {
        if (drav.tabl.length>0) {
            var j=drav.tabl.length;
        } else {
            var j=0;
        }
        
        var arr=[];
        drav.tabl.push(arr);
        var instr=$("#cont").children("table").children("tr:last").children("td");
        var s_obj = {};
        s_obj.cmd=3; // Команда на добавление строки 
        s_obj.tab_name=drav.w_table;// имя таблицы
        s_obj.dat=[];
        
        for(var i=1;i<instr.length;i++) {
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

/*Обработчик события клика по имени таблицы*/
function o_kn(obj) {
    $("button#is").removeAttr("disabled");
    $("button#ds").removeAttr("disabled");
    $("button#otm").removeAttr("disabled");
    $("button#save").removeAttr("disabled");
    /*Пометить активную таблицу*/
    $("div#lbb li").removeClass("lbb-activ");
    $(obj).addClass("lbb-activ");

    s_srv({cmd:1,dat:$(obj).text()});
}

/*Обработчик события клика по ячейки таблицы*/
function cell_cl(obj) {
/*var atr=$(obj).attr("data-num");
var str=atr.slice(3).split("-");
var pole_name=drav.z_tabl[str[1]];
var bb=str[0];
var pri=drav.tabl[bb][drav.pri_table-1];*/
}

// Потеря фокуса ячейки таблицы
function cell_ou(obj) {
    var atr=$(obj).attr("data-num");
    var str=atr.slice(3).split("-");
    var pole_name=drav.z_tabl[str[1]];
    var bb=str[0];
    var pri=drav.tabl[bb][drav.pri_table-1];
    var txt=$(obj).text();

    if (mos_otm==1){//Значит нажата кнопка отменить
        $(obj).text(drav.tabl[bb][str[1]]);
    } else {
        /*Формирование данных на редактирование*/
        var s_obj = {};
        s_obj.cmd=4; // Команда на редактирование
        s_obj.tab_name=drav.w_table;// имя таблицы
        s_obj.dat=[];
        s_obj.dat[0]=drav.z_tabl[drav.pri_table-1];//Имя поля первичного ключа
        s_obj.dat[1]=pri; //Значение первичного ключа
        s_obj.dat[2]=pole_name; // Имя редактируемого поля
        s_obj.dat[3]=txt; // Значение редактируемого поля

        if (txt!=drav.tabl[str[0]][str[1]]) {
            s_srv(s_obj);
        }
    }
}

//функция отправки на сервер объекта obj
function s_srv(obj) {
  
    var txt = JSON.stringify(obj); 

    $.post( 
    "serv.php",
    {zapr:txt},
    otvet);
}

//Функция вывода сообщения об ошибке на экран
function print_err(txt) {
    $("div#mod-err-fon").css('display', 'block');
    $("div#mod-err").css('display', 'block');
    $("p#mod-err-txt").children("span").eq(1).replaceWith("<span>"+txt+"</span>");

    $("div#mod-err-fon").click(function() {
        $("div#mod-err-fon").css('display', 'none');
        $("div#mod-err").css('display', 'none');
    });

    $("div#mod-err").click(function() {
        $("div#mod-err-fon").css('display', 'none');
        $("div#mod-err").css('display', 'none');
    });
}

//Функция получения и обработки ответа с сервера
function otvet(data) {

    var p_obj = JSON.parse(data);
    if (p_obj.err) {//Обработка ошибок
        if (p_obj.err==10) {//Ошибка подключения к базе данных
            print_err(p_obj.text_err);
        }
        
        if (p_obj.err==2) {//Ошибка удаления строк
            print_err("Не удалось удалить строки из таблицы "+p_obj.tab_nm);
            if (p_obj.tab_nm==drav.w_table) {
                s_srv({cmd:1,dat:p_obj.tab_nm});
            }	 
        }
        
        if(p_obj.err==3){//Не удалось записать строку в таблицу
            print_err("Не удалось записать строку в таблицу "+p_obj.tab_nm);
        }
        
        if(p_obj.err==4){//Ошибка редактирования ячейки в таблице
            print_err("Ошибка редактирования ячейки в таблице "+p_obj.tab_nm+" Запись не сохранена");
        }
    } else {
        if (p_obj.cmd==0){//Запрос на подкл. к БД
        drav.tab_name(p_obj);
        }
        
        if (p_obj.cmd==1) {//Запрос на получение таблицы
            drav.w_table=p_obj.tab_nm;
            drav.tabl = p_obj.table;
            drav.z_tabl = p_obj.z_table;
            drav.m_tabl = p_obj.m_table;
            
            if (p_obj.pri_table) {
                //первичный ключ таблицы
                drav.pri_table = p_obj.pri_table;
            }
            
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

})();