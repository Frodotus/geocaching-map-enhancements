<?php
    header('Access-Control-Allow-Origin: *');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    $con = mysql_connect('server','username','password') 
        or die('Could not connect to the server!');
     
    // select a database:
    mysql_select_db('geocaching') 
        or die('Could not select a database.');
    if ($_GET['id']) {
        $id = $_GET['id'];
        $status = 1;
        $setstatus = "";
        if ($_GET['status']) {
            $status = $_GET['status'];
            $setstatus = ",status = $status";
        }
        $name = '';
        $setname = "";
        if ($_GET['name']) {
            $name = $_GET['name'];
            $setname = ",name = '$name'";
        }
        $postdata = file_get_contents("php://input");
        if ($postdata) {
            $sql = "select id from geocaches WHERE id = '$id'";
            $query = mysql_query ( $sql );
            $content = mysql_real_escape_string($postdata);        
            if(mysql_num_rows($query) > 0) {
                $sql = "update geocaches set content = '$content'$setstatus$setname WHERE id = '$id'";
                echo $sql;
            } else {
                $sql = "insert into geocaches (id,status,content,name) values ('$id',$status,'$content','$name')";
                echo $sql;
            }
            @mysql_query( $sql );
        } else {
            $sql = "select * from geocaches WHERE id = '$id'";
            if ( @mysql_query ( $sql ) )        
            {
                $query = mysql_query ( $sql );
                $row = mysql_fetch_assoc ( $query );
                echo $row['content'];
            }
        }
    }
?>
