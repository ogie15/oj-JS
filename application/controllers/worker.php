<?php	/**
	  * 
	  */
	 class worker extends CI_Controller{

	 	function __construt(){
	 		parent:: __construt();
	 		echo("data");
	 	}
	 	
	 	function index(){
	 		$ERR_INVALID_CONFIG = '200';
	 		$ERR_FILE_REG = '201';
			
			if($this->input->get_request_header("X-Requested-With") == "XMLHttpRequest"){
				$active_url = $_POST['active_url'];
				$local_file_url = "";
				$error = "";

				if(isset($_SESSION['file_data'])){
					$config_data = $this->__get_config("http://localhost/oj/assets/js/config.json", "files");
					if($config_data != "parse_error"){
						$user_file_name = substr($active_url, strripos($active_url, "/")+1 );
						$file_reg_status = false;

						foreach ($config_data as $file) {
							if(strrpos($file, $user_file_name)){
								$local_file_url = $file;
								$file_reg_status = true;
							}
						}

						if($file_reg_status){
							$file_data = $this->__get_file_data($local_file_url);

							if($file_data == $_SESSION['file_data']){
								$this->output->set_content_type("application/json");
								$this->output->set_output(json_encode(array("chgStat"=>0)));

							}else{
								$this->output->set_content_type("application/json");
								$this->output->set_output(json_encode(array("chgStat"=>1)));
								$_SESSION['file_data'] = $file_data;
							}

						}else{
							$error = "Sorry file url has not yet bee registered...";
							echo($ERR_FILE_REG);
						}
					}else{
						$error = "Parse Error: Invalid configuration in your config file";
						echo($ERR_INVALID_CONFIG);
					}
					
				}else{
					$_SESSION['file_data'] = "";
				}	 
			}else{
				echo("Invalid Entry Point");
			}

	 	}


	 	function __get_file_data($file_url){
	 		$file_data = "";
	 		$active_file = fopen($file_url, 'r') or die("Unable to open file!");
	 		$file_data = fread($active_file, filesize($file_url));
	 		fclose($active_file);

	 		return $file_data;
	 	}


	 	function  __get_config($config_loc="http://localhost/oj/assets/js/config.json", $type="files"){
	 		$data =  "";
	 		$configs = file_get_contents($config_loc);
	 		if(json_decode($configs) != null){
				if($type == 'all'){
		 			$data = json_decode($configs, true);
		 			
		 		}else if($type == "files"){
		 			$data = json_decode($configs, true)["files"];

		 		}else if($type == "interval"){
		 			$data = json_decode($configs, true)["interval"];
		 			
		 		}else{
		 			$data="noting";
		 		}
	 		}else{
	 			$data = "parse_error";
	 		}


	 		return $data;

	 	}

	 } 

?>