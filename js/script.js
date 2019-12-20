;$(function() {
    
    //Виджет таблицы
    function Table() {
        
        var ins_str=0; // Флаг: 1 - была нажата кнопка добавить; 0 - нет
        var mos_otm=0; //Флаг: 1 - мышь находится на кнопке отменить
        
        //имя текущей (рабочей) таблицы
        let tableName = "";
        
        //Двумерный массив с телом выводимой таблицы
        let tableBody = [];
        
        //Массив с заголовками столбцов таблицы
        let tableHead = [];
        
        //Массив с типами данных таблицы
        let tableType = [];
        
        let primaryKey;
        let activeCheckbox;
        
        function setTableName(atr) {
            tableName = atr;
        }
        
        function setTableBody(atr) {
            tableBody = atr;
        }
        
        function setTableHead(atr) {
            tableHead = atr;
        }
        
        function setTableType(atr) {
            tableType = atr;
        }
        
        function setPrimaryKey(atr) {
            primaryKey = atr;
        }
        
        function getTableName() {
            return tableName;
        }
        
        function getTableBody() {
            return tableBody;
        }
        
        function getTableHead() {
            return tableHead;
        }
        
        function getTableType() {
            return tableType;
        }
        
        function getPrimaryKey() {
            return primaryKey;
        }
        
        function getActiveCheckbox() {
            return activeCheckbox;
        }
        
        /**
         * Вывод данных подключения к БД
         */
        function showHostData(obj) {
            $("#hst").text(obj.arr[0]);
            $("#base-name").text(obj.arr[3]);
            $("#user-name").text(obj.arr[1]);
        }
        
        /**
         * Вывод имен таблиц БД
         */
        function showTablesNames(obj) {
            $("#lbb").children("ul").replaceWith("<ul></ul>");
            for (let i = 0; i < obj.tab_names.length; i++) {
                let elem = $("<li>"+obj.tab_names[i]+"</li>");
                elem.click(function() { choiseTableName(this); });
                $("#lbb").children("ul").append(elem);
            } 
        }
        
        //Прорисовка имени текущей таблицы
        function showCurrentTableName(){
            $("#tab-name").children("span").replaceWith("<span>"+tableName+"</span>");
        }
        
        //Прорисовка тела текущей таблицы
        function showTableBody() {
            $("#cont").children("table").replaceWith("<table></table>");
    
            //Печать заголовков и метаданных
            if (tableHead.length>0) {
                $("#cont").children("table").append("<thead><tr><td></td></tr></thead>");
   
                for(var j=0; j < tableHead.length; j++) {
                    if ((primaryKey - 1) == j) {
                        var aa = tableHead[j] + ", PRI";
                    } else {
                        var aa = tableHead[j];
                    }
            
                    $("#cont").children("table").children("thead").children("tr").eq(0).append("<td>"+aa+"</td>");
                }
            }
    
            if (tableType.length > 0) {
                $("#cont").children("table").children("thead").append("<tr><td></td></tr>");
                for(var j=0; j < tableType.length; j++){
                    $("#cont").children("table").children("thead").children("tr").eq(1).append("<td>"+tableType[j]+"</td>");
                }
            }
    
            //Печать тела таблицы
            if (tableBody.length > 0) {
                for(var i=0; i < tableBody.length; i++) {
                    $("#cont").children("table").append('<tr id="str'+i+'"></tr>');
                    var elem = $('<td><input type="checkbox" name="'+i+'"></td>');
                    elem.click(function(){clickCheckbox(this)});
                    $("#cont").children("table").children("tr").eq(i).append(elem);
                    
                    for(var j=0; j < tableBody[i].length; j++) {
                        var elem = $("<td>" + tableBody[i][j]+"</td>");
                        var zn="num"+i+"-"+j;
                        elem.attr("data-num",zn);
                        elem.attr("contenteditable","true")
                        elem.focus(function(){cellIn(this)});
                        elem.focusout(function(){cellOut(this)});
                        $("#cont").children("table").children("tr").eq(i).append(elem);
                    }
                }
            }
            cont();
    
            //Прокрутка таблицы
            elem = document.getElementById("cont");
        
            let tr1 = elem.querySelectorAll("tr");
            let tdh = tr1[0].querySelectorAll("td");  
            let tdh1 = tr1[1].querySelectorAll("td"); 
            let td1 = elem.querySelectorAll("td:first-child");

            $(elem).scroll(function() {

                //Непрокручиваем первую строку
                //tr1.style.cssText = "top:"+this.scrollTop+"px";
                for (var i=0, max=tdh.length; i<max; i++) {
                    tdh[i].style.cssText = "position:relative;background-color:#d6dde8;border:1px solid #000;z-index:100;top:"+this.scrollTop+"px";
                    tdh1[i].style.cssText = "position:relative;background-color:#d6dde8;z-index:100;top:"+this.scrollTop+"px";
                }
	
                //И первый столбец
                for(var i=0, max=td1.length; i<max; i++){
                    td1[i].style.cssText = "position:relative;z-index:200;left:"+this.scrollLeft+"px";
                }
                td1[0].style.cssText = "position:relative;background-color:#d6dde8;z-index:250;top:"+this.scrollTop+"px;left:"+this.scrollLeft+"px";
                td1[1].style.cssText = "position:relative;background-color:#d6dde8;z-index:250;top:"+this.scrollTop+"px;left:"+this.scrollLeft+"px";
            });
        
        }
        
        //Печать количества строк и столбцов
        function cont() {
            var colstr=0;
            for (dd in tableBody) {
                colstr +=1;
            }
            var colstl = tableHead.length;
            $("div#rb-str").children("span").replaceWith("<span>"+colstr+"</span>");
            $("div#rb-stl").children("span").replaceWith("<span>"+colstl+"</span>");
        }  
        
        //Прорисовка пустой строки в конце текущей таблицы
        function newStr() {
            if (tableBody.length > 0) {
                var i = tableBody.length;
            } else {
                var i = 0;
            }
    
            $("#cont").children("table").append('<tr id="str'+i+'"><td></td></tr>');
    
            for(var j=0; j < tableHead.length; j++) {
                var elem = $("<td></td>");
                var zn="num"+i+"-"+j;
                elem.attr("data-num",zn);
                elem.attr("contenteditable","true");
                elem.focus(function(){cellIn(this)});
                $("#cont").children("table").children("tr:last").append(elem);
            }
        }
        
        function enableButton(buttonName) {
            if (buttonName == "addStr") {
                $("button#is").removeAttr("disabled");
            }
            if (buttonName == "delStr") {
                $("button#ds").removeAttr("disabled");
            }
            if (buttonName == "undo") {
                $("button#otm").removeAttr("disabled");
            }
            if (buttonName == "SaveStr") {
                $("button#save").removeAttr("disabled");
            }
        }
        
        function disableButton(buttonName) {
            if (buttonName == "addStr") {
                $("button#is").attr("disabled", "true");
            }
            if (buttonName == "delStr") {
                $("button#ds").attr("disabled", "true");
            }
            if (buttonName == "undo") {
                $("button#otm").attr("disabled", "true");
            }
            if (buttonName == "SaveStr") {
                $("button#save").attr("disabled", "true");
            }
        }
        
        /*Задание обработчиков событий для кнопок в футере*/
        $("button#is").click(function(){addStr()});//нажата кнопка Добавить строку
        $("button#ds").click(function(){delStr()});//нажата кнопка Удалить строку
        $("button#otm").click(function(){undo()});//нажата кнопка Отменить
        $("button#save").click(function(){SaveStr()});//нажата кнопка Сохранить

        $("button#otm").mouseover(function(){mos_otm=1;});//мышь в пределах кнопки Отменить
        $("button#otm").mouseout(function(){mos_otm=0;});//мышь не в пределах кнопки Отменить
        
        // Потеря фокуса ячейки таблицы
        function cellOut(obj) {
            disableButton('SaveStr');
            disableButton('undo');
            var atr = $(obj).attr("data-num");
            var str = atr.slice(3).split("-");
            var pole_name = tableHead[str[1]];
            var bb = str[0];
            var pri = tableBody[bb][primaryKey - 1];
            var txt = $(obj).text();

            if (mos_otm==1){//Значит нажата кнопка отменить
                $(obj).text(tableBody[bb][str[1]]);
            } else {
                //Формирование данных на редактирование
                var s_obj = {};
                s_obj.cmd = 4; // Команда на редактирование
                s_obj.tab_name = tableName;// имя таблицы
                s_obj.dat=[];
                s_obj.dat[0] = tableHead[primaryKey - 1];//Имя поля первичного ключа
                s_obj.dat[1] = pri; //Значение первичного ключа
                s_obj.dat[2] = pole_name; // Имя редактируемого поля
                s_obj.dat[3] = txt; // Значение редактируемого поля

                if (txt != tableBody[str[0]][str[1]]) {
                    ajaxSender.update('cellOut', s_obj);
                }
            }
        }
        
        //Обработчик события клика по имени таблицы
        function choiseTableName(obj) {          
            let tableName = $(obj).text();
            //Пометить активную таблицу
            $("div#lbb li").removeClass("lbb-activ");
            $(obj).addClass("lbb-activ");
            
            ajaxSender.update('choiseTableName', tableName);
        }
        
        function cellIn() {
            enableButton('SaveStr');
            enableButton('undo');
        }
        
        //Обработчик события нажатия кнопки Добавить строку
        function addStr() {
            enableButton('undo');
            if (ins_str == 0){
                ins_str = 1;
                newStr();
            } else {
                SaveStr()
                newStr();
                ins_str = 1;
            }
        }
        
        function clickCheckbox() {
            activeCheckbox = $("input:checkbox:checked");
            if (activeCheckbox.length > 0) {
                enableButton('delStr');
            } else {
                disableButton('delStr');
            }
        }
        
        //Обработчик события нажатия кнопки удалить строку
        function delStr() {
            activeCheckbox = $("input:checkbox:checked");
            ajaxSender.update('delStr');
        }
        
        //Обработчик события нажатия кнопки отменить
        function undo() {
            disableButton('SaveStr');
            disableButton('undo');
            if (ins_str==1){
                $("#cont").children("table").children("tr:last").remove();
                ins_str=0;
            } 
        }
        
        //Обработчик события нажатия кнопки Сохранить
        function SaveStr() {
            disableButton('SaveStr');
            disableButton('undo');
            if (ins_str == 1) {
                if (tableBody.length > 0) {
                    var j = tableBody.length;
                } else {
                    var j = 0;
                }
        
                var arr = [];
                tableBody.push(arr);
                var instr=$("#cont").children("table").children("tr:last").children("td");
                
                var s_obj = {};
                s_obj.cmd=3; // Команда на добавление строки 
                s_obj.tab_name = tableName;// имя таблицы
                s_obj.dat=[];
        
                for(var i=1;i<instr.length;i++) {
                    s_obj.dat[i-1]=instr.eq(i).text();
	 
                    instr.eq(i).focus(function(){cell_cl(this)});
                    instr.eq(i).focusout(function(){cell_ou(this)});
	   
                    tableBody[j][i-1] = instr.eq(i).text();
                }
	
                var elem = $('<td><input type="checkbox" name="'+j+'"></td>');
                $("#cont").children("table").children("tr:last").children("td").eq(0).replaceWith(elem);
	  
  
                ajaxSender.update('SaveStr', s_obj);
                showTableBody();
                ins_str = 0;
            }
        }
        
        $("button#is").attr("disabled","disabled");
        $("button#ds").attr("disabled","disabled");
        $("button#otm").attr("disabled","disabled");
        $("button#save").attr("disabled","disabled");
        
        this.setTableName = setTableName;
        this.setTableBody = setTableBody;
        this.setTableHead = setTableHead;
        this.setTableType = setTableType;
        this.setPrimaryKey = setPrimaryKey;
        this.getTableName = getTableName;
        this.getTableBody = getTableBody;
        this.getTableHead = getTableHead;
        this.getTableType = getTableType;
        this.getPrimaryKey = getPrimaryKey;
        this.getActiveCheckbox = getActiveCheckbox;
        this.showHostData = showHostData;
        this.showTablesNames = showTablesNames;
        this.showCurrentTableName = showCurrentTableName;
        this.showTableBody = showTableBody;
        this.cont = cont;
        this.enableButton = enableButton;
        this.disableButton = disableButton;    
    }
    
    // Посредник
    function AjaxSender() {
        
        let handler = {};
        
        handler.choiseTableName = function(tableName) {           
            table.enableButton("addStr");
            sent({cmd:1,dat:tableName});
        };
        
        handler.cellOut = function(obj) {
            sent(obj);
        };
        
        handler.delStr = function(obj) {
            let inch = table.getActiveCheckbox();
            
            if (inch.length > 0) {
                let tableName = table.getTableName();
                let tableHead = table.getTableHead();
                let primaryKey = table.getPrimaryKey();
                let tableBody = table.getTableBody();
                
                let s_obj = {};
                s_obj.cmd = 2; // Команда на удаление строк
                s_obj.tab_name = tableName;// имя таблицы
                s_obj.dat = [];
                s_obj.dat[0] = tableHead[primaryKey - 1];
        
                for(var i = 0; i < inch.length; i++) {
                    var bb = inch.eq(i).attr("name") - 0;
                    s_obj.dat[i+1] = tableBody[bb][primaryKey - 1];
                    var ob_del = "tr#str" + bb;
                    $(ob_del).remove();
	
                    //tableBody.splice(bb, 1);
                    delete tableBody[bb];
                }
                //table.setTableBody(tableBody);
        
                sent(s_obj);
                table.cont();
            } else {
                printErr("Вы не выбрали ни одной строки для удаления!");
            }  
        };
        
        handler.SaveStr = function(obj) {
            sent(obj);
        };
        
        function update(action, atr) {
            handler[action](atr);
        }
        
        function sent(obj) { 
            let txt = JSON.stringify(obj); 
            $.post( 
            "serv.php",
            {zapr:txt},
            otvet);
        }
        
        //Функция вывода сообщения об ошибке на экран
        function printErr(txt) {
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

            let p_obj = JSON.parse(data);
            if (p_obj.err) {//Обработка ошибок
                if (p_obj.err==10) {//Ошибка подключения к базе данных
                    printErr(p_obj.text_err);
                }
        
                if (p_obj.err==2) {//Ошибка удаления строк
                    printErr("Не удалось удалить строки из таблицы "+p_obj.tab_nm);
                    if (p_obj.tab_nm==drav.w_table) {
                        s_srv({cmd:1,dat:p_obj.tab_nm});
                    }	 
                }
        
                if(p_obj.err==3){//Не удалось записать строку в таблицу
                    printErr("Не удалось записать строку в таблицу "+p_obj.tab_nm);
                }
        
                if(p_obj.err==4){//Ошибка редактирования ячейки в таблице
                    printErr("Ошибка редактирования ячейки в таблице "+p_obj.tab_nm+" Запись не сохранена");
                }
            } else {
                if (p_obj.cmd==0){//Запрос на подкл. к БД
                    table.showHostData(p_obj);
                    table.showTablesNames(p_obj);
                }
        
                if (p_obj.cmd==1) {//Запрос на получение таблицы
                    table.setTableName(p_obj.tab_nm);
                    table.setTableBody(p_obj.table);
                    table.setTableHead(p_obj.z_table);
                    table.setTableType(p_obj.m_table);
            
                    if (p_obj.pri_table) {
                        //первичный ключ таблицы
                        table.setPrimaryKey(p_obj.pri_table);
                    }
            
                    table.showCurrentTableName();
                    table.showTableBody();
                }
            }
        }
        
        function firstRequest() {
            let s_obj={cmd:0};
            sent(s_obj);
        }
        
        this.update = update;
        this.firstRequest = firstRequest;
    }

    table = new Table();
    ajaxSender = new AjaxSender();
    ajaxSender.firstRequest();
    
})();