<?php

class objt{};
$str=new objt();

require_once("bd.php");
require_once("class/bd_mysql.php");


if(!empty($_POST['zapr'])){//Получение и обработка данных
$my_obj = json_decode($_POST['zapr']);
$cmd=$my_obj->cmd;
$mysql = @new bd_mysql($m_host,$m_user,$m_pass,$n_bd); // Подключение к базе данных параметры в bd.php

 if ($cmd==0){//Обработка запроса на подкл к таблице и отправке списка имен таблиц
  
   $str->cmd = 0;
   $str->arr=[$m_host,$m_user,$m_pass,$n_bd];
   $str->tab_names=$mysql->tabl_names();
  
 }
 if ($cmd==1){//отправка таблицу и ее метаданнх
  $mysql->table($my_obj->dat);
  $str->cmd = 1;
  if (!is_null($mysql->pri_table)){// Номер поля первичного ключа (если есть)+1
  $str->pri_table=$mysql->pri_table+1;
  } 
  $str->tab_nm=$my_obj->dat;//имя таблицы
  $str->z_table=$mysql->z_table;// заголовки полей таблицы
  $str->m_table=$mysql->m_table_met;//типы данных полей
  $str->table=$mysql->t_table;// тело таблицы (ее значения)
 }
 if ($cmd==2){//Запрос на удаление строк таблицы
  if ($mysql->table_del($my_obj->tab_name, $my_obj->dat)==2){
    $str->err=2; //Ошибка удаления строки в БД 
	$str->tab_nm=$my_obj->tab_name;//имя таблицы
  }
 }
 if ($cmd==3){//Запрос на вставку строки в таблицу
   if ($mysql->table_ins($my_obj->tab_name, $my_obj->dat)==3){
    $str->err=3; //Ошибка записи ячейки в БД 
	$str->tab_nm=$my_obj->tab_name;//имя таблицы
   }
 }
 if ($cmd==4){//Запрос на редактирование таблицы
  if($mysql->table_red($my_obj->tab_name, $my_obj->dat)==4){
    $str->err=4; //Ошибка редактирования таблицы БД 
	$str->tab_nm=$my_obj->tab_name;//имя таблицы
  }
 }
 $mysql->close();
}



if (json_encode($str)){
echo json_encode($str);
}
else
{
echo "Ошибка0";
}
/*echo 'Соединение установлено... ' . $mysql->host_info ." Клиент " .$mysql->client_info." Сервер ".$mysql->server_info ."\n";*/

/*$arr = $mysql->tabl_names();// получение списка имен таблиц в виде массива
$rr = $mysql->table($arr[10]);//Получение данных таблицы*/



?>