<!DOCTYPE html>
<?php

$db_name = 'denyodev1';//'denyoappv2';
$db_user = 'denyodev1';//'denyoappv2';
$db_pass = '51RkC3nQgXlwGyZq';//'RfS4aE4Wxq2daL0D';
$db_host = 'localhost';//'localhost';
$connect_db = new mysqli( $db_host, $db_user, $db_pass, $db_name );
	
?>
<html>
	<head>
	<script  src="https://code.jquery.com/jquery-3.1.1.js"></script>
	<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css">
	</head>
<body>
<div class="container">
	<form   id="myform" name="myform" method="post" action="" onsubmit="process()">
	<br>
	<!----<div class="row">
			<div class="col-lg-12">
				<div class="col-lg-6" class="col-md-6" class="col-sm-4" id="block">
				<p>Code</p>				
				<select class="form-control" name="code">
					<?php
					$query = mysqli_query($connect_db,"SELECT * from unitdetails_labels");
					while($row=mysqli_fetch_array($query))
					{	
					?>
					<option id="<?php echo $row[2]; ?>"><?php echo $row[2]; ?></option>
					<?php
					}
					?>					
				</select>
				</div>
			</div>
	</div>
	<br>
	<div class="row">
			<div class="col-lg-12">
				<div class="col-lg-6" class="col-md-6" class="col-sm-4" id="block">
				<p>Hexacode</p>
				<textarea name="hexacode" style="width:100%;"></textarea>
				</div>
			</div>
	</div>------->
	</br>
	<div class="row">
			<div class="col-lg-12">
				<div class="col-lg-6" class="col-md-6" class="col-sm-4" id="block">
				<p>Generator id</p>
				<select class="form-control" name="genid" id="genid">
				<?php
					$query = mysqli_query($connect_db,"SELECT * from units where deletestatus = '0'");
					while($row=mysqli_fetch_array($query))
					{	
					?>
					<option id="<?php echo $row[6]; ?>"><?php echo $row[6]; ?></option>
					<?php
					}
					?>	
				</select>
				</div>
			</div>
	</div>
	<br>
	<div class="row">
			<div class="col-lg-12">
				<div class="col-lg-6" class="col-md-6" class="col-sm-4" id="block">
				<p>Hexacode Formate</p>
				<textarea name="data" style="width:100%;"></textarea>
				</div>
			</div>
	</div>
	<br>	
	<div class="row">
			<div class="col-lg-12">
				<div class="col-lg-6" class="col-md-6" class="col-sm-4" id="block">
				<button  name="submit" class="btn btn-info">Submit</button>
				</div>
			</div>
	</div>

	
	</form>
</div>
<script>
function process() { 
  var data = document.getElementById("genid").value;
  var action ="currentunitstatus.php?gid="+data;
  document.getElementById("myform").action = action;
  document.getElementById("myform").submit();
}
</script>

</body>
</html>
