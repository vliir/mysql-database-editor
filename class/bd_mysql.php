<?php
// ���������� ����� ��� ������ � ������ ������ MySql ��� �������� mysqli
 class bd_mysql extends mysqli{
 /*���������� �������� �������*/
public $t_table = array(); //��������� ������ � ����� �������
public $z_table = array(); //������ � ������� �������� �������
public $zz_table = array();//������ ���������� �������
public $m_table = array(); // ������ � ������ ������ ������� (�����)
public $k_table = array(); // ��������� ������ � ����������� �������
public $k_table_inf = array();//������ ���������� ������� ����������
public $pri_table = null; // ����� ���� ���������� �����
public $m_table_met = array();// ������ � ������ ������ ������� 

 // ���������� ����������� ������
 function __construct($m_host,$m_user,$m_pass,$n_bd){
   parent:: __construct($m_host,$m_user,$m_pass,$n_bd);
    if (mysqli_connect_error()) {
	$str->err=10; //������ �����������
	$str->text_err = '������ ����������� � ��: (' . mysqli_connect_errno() . ') '. mysqli_connect_error();
	/*
	$errtx=mysqli_connect_errno().mysqli_connect_error();
	$str->text_err = $errtx;
	$txt = json_encode($str);*/
	
	$txt = '{"err":10,"text_err":"'.$str->text_err.'"}';
		
     die($txt);
   }
 }
 //��������� ������ ������ ���� ������
 function tabl_names(){
   $tabl_name = array();
   $result = parent::query("SHOW TABLES");
   $jj=0;
    while($row = $result->fetch_assoc()) {
     foreach($row as $key=>$vr){
      $tabl_name[$jj]=$vr;
      $jj+=1;
     }
	}
return $tabl_name;
 }
 function table($tab_name){// ��������� ������ ������� 
   $this->t_table = array();
   $this->z_table = array();
   $this->m_table = array();
 $result = parent::query("SELECT * FROM ".$tab_name);
 $finfo = $result->fetch_fields();// ��������� ����������
  $i=0;
  foreach ($finfo as $val=>$vr) {
   $this->z_table[$i] = $vr->name;
   $this->m_table[$i] = $vr->type;
   $i++;
  }
 
 $i=0;
  while($row = $result->fetch_assoc()) {
   $j=0;
    foreach($row as $key=>$vr){
     $this->t_table[$i][$j]=$vr;
     $j++;
    }
   $i++;
  }
  $this->table_met($tab_name);
 }
 
 function table_met($tb_name){//������ � �����������
 $this->m_table_met = array();
 $this->k_table = array();
 $this->zz_table = array();//������ ���������� �������
 $this->k_table_inf = array();
 $this->pri_table = null;
 
  $result = parent::query("DESCRIBE ".$tb_name);
  $this->k_table = $result->fetch_all();
  $this->k_table_inf=$result->fetch_fields();
  $arr=$this->k_table;
  $i=0;
  foreach ($arr as $vr){
   $this->m_table_met[$i]=$vr[1];
   $this->zz_table[$i]=$vr[0];
    if ($vr[3]=="PRI") {
     $this->pri_table = $i;
    }
	$i++;
  }
}
function table_red($tb_name, $arr){// �������������� ���� �������
 $result = parent::query("UPDATE ".$tb_name." SET ".$arr[2]."='".$arr[3]."' WHERE ".$arr[0]."='".$arr[1]."'");
 if(!$result) return 4;
}
function table_del($tb_name, $arr){//�������� ����� �������
$id=$arr[0];
$ret=0;
 if (count($arr)>0){
  for($i=1; $i<count($arr); $i++){
   $result = parent::query("DELETE FROM ".$tb_name." WHERE ".$id."='".$arr[$i]."'");
   if(!$result) $ret=2;
  }  
 }
 if($ret>0) return $ret;
}
function table_ins($tb_name, $arr){//������� ������ � �������
 $this->table_met($tb_name);
 $pol_n="";
 $val="";
 
  for($i=0; $i<count($arr);$i++){
   $pol_n .= $this->zz_table[$i].", ";
   /*$val= "1,"."'dfg', "."'bri'";*/
   $val .= "'".$arr[$i]."', ";
  }
  $pol_n=substr($pol_n, 0, -2);
  $val=substr($val, 0, -2);
  $result = parent::query("INSERT INTO ".$tb_name." (".$pol_n.") VALUES (".$val.")");
  if(!$result) return 3;
}


}
?>