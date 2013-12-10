<?php
// Create connection
$con = mysql_connect("127.0.0.1","root","parkk");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

mysql_select_db("rfi_info", $con);

$projects = "SELECT * FROM projects";
$result_projects = mysql_query($projects);
  
$num = mysql_numrows($result_projects);

$i=0;
 while ($i < $num) 
{
  $name=mysql_result($result_projects,$i,"name");

  echo "$name";
  echo "<br/>";

  $i++;

}





mysqli_close($con);
?>