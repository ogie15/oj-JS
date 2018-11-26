
var RELOAD_STAT = false;
var ACTIVE_FILE = "";
var host
var ping = "http://localhost/oj/index.php/worker";
var thread_handle;

var modal = "<div id='modal' align='center' style='position:fixed; width: 100%; height: 100%; background-color: rgba(0,0,0, 0.75); padding: 50px'>"
				+"<div align='left' style=' padding: 8px; border-radius: 5px;box-shadow:0px 0px 10px #999; background-color: white; width: 60%; font-family: Calibri Light; font-size: 17px'>"
					+"<img style='width: 38px; height: 38px' src='http://localhost/oj/assets/resources/loading.gif'></img>"
					+" Changes detected Loading to apply changes..."
				+"</div>"
			+"</div>";


function ping_url(){
	var active_url = location.href;
	var get_data = "";
	var real_get_data;
	$get_pos = active_url.indexOf('?');
	$get_pos = ($get_pos == -1)?active_url.length:$get_pos;

	get_data = active_url.substr($get_pos+1);
	real_get_data = url_get_parser(get_data)
	ping = real_get_data['protocol']+"://"+real_get_data['host']+"/oj/index.php/worker"; 
	console.log(real_get_data);

	if(real_get_data['protocol']){
		if(real_get_data['host']){
			$.post(ping, {"active_url": active_url.substr(0,$get_pos)}, function(data, status){

				console.log(data);
				if(data.chgStat == 1){
					show_reload(true);
					window.location.reload(true);
					
				}else{
					show_reload(false);
				}

				if(data == '200'){
					show_err("Parse Error: Invalid configuration in your config file", true);

				}else if(data =='201'){
					show_err("Sorry file url has not yet bee registered...", true);
				
				}else{
					show_err("", false);
				}

			});
		}else{
			console.log("Incomplete parameter Err: <host> parameter required!!!");
			show_err("",false);
			show_err("<span style='color:#aa1111'>INCOMPLETE PARAMETER ERR:</span><br> -host- parameter required!!!<br>(example host=localhost:8000)", true)
		}
		
	}else{
		console.log("Incomplete parameter Err: <protocol> parameter required!!!");
		show_err("",false);
		show_err("<span style='color:#aa1111'>INCOMPLETE PARAMETER ERR:</span><br> -protocol- parameter required!!!<br>(example protocol=http)", true)
	}
	
}


function initLoop(){
	thread_handle = setInterval(function(){
		ping_url();

	}, 1000);
}

function show_reload(state){
	if(state){
		$('body').prepend(modal);
	}else{
		$('#modal').remove();
	}
	
}

function show_err(error, state){

	if(state){
		var err_modal = "<div id='modal' align='center' style='z-index:1000000; position:fixed; width: 100%; height: 100%; background-color: rgba(0,0,0, 0.75); padding: 50px'>"
			+"<div align='center' style=' padding: 8px; border-radius: 5px;box-shadow:0px 0px 10px #999; background-color: white; width: 30%; font-family: Calibri Light; font-size: 17px'>"
				+"<br><img style='width: 150px; height: 150px' src='http://localhost/oj/assets/resources/alert.png'></img><br><br><br>"
				+" <span style='font-size: 20px; color:#444'><b>"+error+"</b></span><br><br><br>"
			+"</div>"
		+"</div>";

		$('body').prepend(err_modal);

	}else{
		$('#modal').remove();
	}
}

function url_get_parser(raw_get){
	var real_get_data = {};
	var data = "";
	var key = "";
	var value = "";
	var read_value = false;

	for(var i=0; i< raw_get.length; i++){
		var data_char = raw_get[i];
		if(data_char != '&'){
			data += data_char;
		}else{

			for(var j=0; j< data.length; j++){
				var key_value_data = data[j];

				if(read_value){
					value += key_value_data;
				}
				if(key_value_data != '=' && !read_value){
					key += key_value_data;
				}else{
					read_value = true;
				}
				
			}
			read_value = false;
			real_get_data[key] = value;
			data = "";
			key = "";
			value = "";
		}
		
	}
	for(var j=0; j< data.length; j++){
		var key_value_data = data[j];

		if(read_value){
			value += key_value_data;
		}
		if(key_value_data != '=' && !read_value){
			key += key_value_data;
		}else{
			read_value = true;
		}
		
	}
	real_get_data[key] = value;

	return real_get_data;

}


// window.addEventListener();//pending
initLoop();
