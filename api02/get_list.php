<?php
 $dsn="mysql:host=localhost;charset=utf8;dbname=culture";
 $pdo=new PDO($dsn,'root','');

 $rows=$pdo->query("SELECT * FROM art_collection LIMIT 20")->fetchAll();

 echo  json_encode($rows);

?>