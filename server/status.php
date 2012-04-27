<?
    header('Access-Control-Allow-Origin: *');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    $con = mysql_connect('server','username','password') 
        or die('Could not connect to the server!');
     
    // select a database:
    mysql_select_db('geocaching') 
        or die('Could not select a database.');
    
        $ids = split(",", $_GET['ids']);
        foreach ($ids as &$id) {
            $id = "'" . $id . "'";
        }
        $query_ids = implode(",", $ids);
        $sql = "select * from geocaches WHERE `id` IN ($query_ids)";
        $stack = array();
        $comma = "";
        if ( @mysql_query ( $sql ) )
        {   
            echo "{";
            $query = mysql_query ( $sql );
            do {
                
                if($row['id']){
                  echo $comma."'".$row['id']."':".$row['status'];
//                  echo $comma."{'id':'".$row['id']."','status':".$row['status'].;
                  $comma = ",";
                }
            } while ( $row = mysql_fetch_assoc ( $query ) );
            echo "}";
    } else {
		die ( mysql_error () );
	}
?>
