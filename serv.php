<?php

class objt{};
$str=new objt();

require_once("bd.php");
require_once("class/bd_mysql.php");


if(!empty($_POST['zapr'])){//��������� � ��������� ������
$my_obj = json_decode($_POST['zapr']);
$cmd=$my_obj->cmd;
$mysql = @new bd_mysql($m_host,$m_user,$m_pass,$n_bd); // ����������� � ���� ������ ��������� � bd.php

 if ($cmd==0){//��������� ������� �� ����� � ������� � �������� ������ ���� ������
  
   $str->cmd = 0;
   $str->arr=[$m_host,$m_user,$m_pass,$n_bd];
   $str->tab_names=$mysql->tabl_names();
  
 }
 if ($cmd==1){//�������� ������� � �� ���������
  $mysql->table($my_obj->dat);
  $str->cmd = 1;
  if (!is_null($mysql->pri_table)){// ����� ���� ���������� ����� (���� ����)+1
  $str->pri_table=$mysql->pri_table+1;
  } 
  $str->tab_nm=$my_obj->dat;//��� �������
  $str->z_table=$mysql->z_table;// ��������� ����� �������
  $str->m_table=$mysql->m_table_met;//���� ������ �����
  $str->table=$mysql->t_table;// ���� ������� (�� ��������)
 }
 if ($cmd==2){//������ �� �������� ����� �������
  if ($mysql->table_del($my_obj->tab_name, $my_obj->dat)==2){
    $str->err=2; //������ �������� ������ � �� 
	$str->tab_nm=$my_obj->tab_name;//��� �������
  }
 }
 if ($cmd==3){//������ �� ������� ������ � �������
   if ($mysql->table_ins($my_obj->tab_name, $my_obj->dat)==3){
    $str->err=3; //������ ������ ������ � �� 
	$str->tab_nm=$my_obj->tab_name;//��� �������
   }
 }
 if ($cmd==4){//������ �� �������������� �������
  if($mysql->table_red($my_obj->tab_name, $my_obj->dat)==4){
    $str->err=4; //������ �������������� ������� �� 
	$str->tab_nm=$my_obj->tab_name;//��� �������
  }
 }
 $mysql->close();
}



if (json_encode($str)){
echo json_encode($str);
}
else
{
echo "������0";
}
/*echo '���������� �����������... ' . $mysql->host_info ." ������ " .$mysql->client_info." ������ ".$mysql->server_info ."\n";*/

/*$arr = $mysql->tabl_names();// ��������� ������ ���� ������ � ���� �������
$rr = $mysql->table($arr[10]);//��������� ������ �������*/



?>