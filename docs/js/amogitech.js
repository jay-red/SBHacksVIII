function init_amogitech() {
	var AMOGI_PRESETS = ["0pbx60g1uwm71.jpg", "10000-15-A-OR_300x.jpg", "1000_F_264918039_IDCcav68QDuCiCwHQDy25vhnVkszDpIL.jpg", "258910878_473682777657733_4852886152500614701_n.png", "269894827_685723842423806_7807012008190964539_n.jpg", "270072551_608382863766024_1397326534896797595_n.png", "272269789_758263478910882_8371936274854153652_n.png", "41RsEwAbK5L._AC_.jpg", "630ifq407yb71.jpg", "69965c2849ec9b7148a5547ce6714735.jpg", "8ee.jpg", "af.PNG", "chinese-characters.001.jpg", "Cl.PNG", "CombJellyProductImage_1024x1024@2x.jpg", "crzsbduz88p51.jpg", "EuTYyBKXIAQs5A-.png", "fe6.jpg", "hat.PNG", "hr2gxpitgvw61.jpg", "img_2145.jpg", "lb.PNG", "lunch.PNG", "memscwmtpo371.jpg", "na8act8mxqo71.png", "nebula.PNG", "os.PNG", "parking-meters-1.jpg", "ribosome_lrg_sm_subunits-23b46a3be6354c4eacb550b25fa3c69d.jpg", "rl7gr4ifanw71.jpg", "s-l400.jpg", "toe.PNG", "uc.PNG", "wh.PNG", "ximugadle2071.jpg"];

	var ELEM = {};

	ELEM["AMOGI_FILE"] = document.getElementById( "amogi-file" );
	ELEM["AMOGI_CANVAS"] = document.getElementById( "amogi-canvas" );
	ELEM["AMOGI_LOGO"] = document.getElementById( "logo-div" );
	ELEM["AMOGI_LOGO_FIXED"] = document.getElementById( "fixed-logo" );

	var data = {};

	data["upload"] = {};

	data.upload["xhr"] = null;
	data.upload["file"] = null;
	data.upload["form"] = null;
	data.upload["reader"] = null;
	data.upload["image"] = null;

	data["anim"] = {};

	data.anim["ctx"] = null;
	data.anim["xhr"] = null;
	data.anim["cap"] = null;
	data.anim["target_x"] = -1;
	data.anim["target_y"] = -1;
	data.anim["target_r"] = -1;
	data.anim["frame"] = 0;
	data.anim["max_frame"] = 0;
	data.anim["drawing"] = false;
	data.anim["last_drawing"] = false;

	function game_loop( ts ) {
		var idx = data.anim.frame << 1;
		var x = data.anim.cap[idx + 4];
		var y = data.anim.cap[idx + 5];

		if( x == -1 || y == -1 ) data.anim.drawing = false;
		else data.anim.drawing = true;

		x += data.anim.target_x;
 		y += data.anim.target_y;

		if( data.anim.drawing ) {
			if( data.anim.last_drawing != data.anim.drawing ) {
				data.anim.ctx.beginPath();
				data.anim.ctx.moveTo( x, y );
			} else {
				data.anim.ctx.lineTo( x, y );
				data.anim.ctx.stroke();
			}
		}

		data.anim.last_drawing = data.anim.drawing;

		data.anim.frame += 1;
		if( data.anim.frame < data.anim.max_frame ) {
			window.requestAnimationFrame( game_loop );
		} else {
			data.upload.xhr = null;
			data.upload.file = null;
			data.upload.form = null;
			data.upload.reader = null;
			data.upload.image = null;

			data.anim.ctx = null;
			data.anim.xhr = null;
			data.anim.cap = null;
			data.anim.target_x = -1;
			data.anim.target_y = -1;
			data.anim.target_r = -1;
			data.anim.frame = 0;
			data.anim.max_frame = 0;
			data.anim.drawing = false;
			data.anim.last_drawing = false;

			ELEM.AMOGI_FILE.removeAttribute( "disabled" );
		}
	}

	function handle_anim_ready_state_change() {
		if( data.anim.xhr.readyState != 4 || data.anim.xhr.status != 200 ) return;

		data.anim.cap = new Int16Array( data.anim.xhr.response );

		data.anim.max_frame = ( ( data.anim.cap.length - 4 ) / 2 ) | 0;

		var center_x = data.anim.cap[0];
		var center_y = data.anim.cap[1];
		var radius = data.anim.cap[2] - center_x;
		var scale = data.anim.target_r / radius;
		var width = data.anim.cap[3] * scale;
		if( width < 0 ) width = 1;

		var min_x = 0;
		var min_y = 0;
		var max_x = data.upload.image.width;
		var max_y = data.upload.image.height;

		var temp;

		for( var i = 0; i < data.anim.max_frame; ++i ) {
			if( data.anim.cap[( i << 1 ) + 4] == -1 || data.anim.cap[( i << 1 ) + 5] == -1 ) continue;
			data.anim.cap[( i << 1 ) + 4] = data.anim.cap[( i << 1 ) + 4] * 1.0 - center_x;
			data.anim.cap[( i << 1 ) + 5] = data.anim.cap[( i << 1 ) + 5] * 1.0 - center_y;
			data.anim.cap[( i << 1 ) + 4] = data.anim.cap[( i << 1 ) + 4] * scale;
			data.anim.cap[( i << 1 ) + 5] = data.anim.cap[( i << 1 ) + 5] * scale;

			temp = data.anim.cap[( i << 1 ) + 4] + data.anim.target_x;
			if( temp - width < min_x ) min_x = temp - width;
			else if( temp + width > max_x ) max_x = temp + width;

			temp = data.anim.cap[( i << 1 ) + 5] + data.anim.target_y;
			if( temp - width < min_y ) min_y = temp - width;
			else if( temp + width > max_y ) max_y = temp + width;
		}

		ELEM.AMOGI_CANVAS.width = max_x - min_x;
		ELEM.AMOGI_CANVAS.height = max_y - min_y;

		data.anim.ctx = ELEM.AMOGI_CANVAS.getContext( "2d" );

		data.anim.ctx.drawImage( data.upload.image, -min_x, -min_y );

		data.anim.target_x -= min_x;
		data.anim.target_y -= min_y;

		data.anim.ctx.lineWidth = width;
		data.anim.ctx.strokeStyle = "#FF0000";

		window.requestAnimationFrame( game_loop );

		//console.log( data.anim.target_x, data.anim.target_y, data.anim.target_r );
	}

	function handle_amogi_ready_state_change() {
		if( data.upload.xhr.readyState != 4 || data.upload.xhr.status != 200 ) return;

		var response = JSON.parse( data.upload.xhr.responseText );

		data.anim.target_x = response.x | 0;
		data.anim.target_y = response.y | 0;
		data.anim.target_r = response.r;

		data.anim.xhr = new XMLHttpRequest();
		data.anim.xhr.responseType = "arraybuffer";

		data.anim.xhr.addEventListener( "readystatechange", handle_anim_ready_state_change )

		data.anim.xhr.open( "GET", "./assets/sus/" + AMOGI_PRESETS[( ( ( ( data.anim.target_x ) | 0 ) + ( ( data.anim.target_y ) | 0 ) + ( ( data.anim.target_r ) | 0 ) + 10419 ) % AMOGI_PRESETS.length ) | 0] + ".sus" );
		data.anim.xhr.send();

	}

	function handle_image_load() {
		data.upload.xhr = new XMLHttpRequest();

		data.upload.xhr.addEventListener( "readystatechange", handle_amogi_ready_state_change );

		data.upload.xhr.open( "POST", "https://amogitech.herokuapp.com/" );
		data.upload.xhr.send( data.upload.form );
	}

	function handle_reader_load() {
		data.upload.image = new Image();
		data.upload.image.addEventListener( "load", handle_image_load );

		data.upload.image.src = data.upload.reader.result;
	}

	function handle_amogi_change() {
		console.log( "amogitech v3" );

		if( ELEM.AMOGI_FILE.files.length == 0 ) return;

		data.upload.file = ELEM.AMOGI_FILE.files[0];

		data.upload.form = new FormData();
		data.upload.form.append( "amogi-file", data.upload.file );

		data.upload.reader = new FileReader();
		data.upload.reader.addEventListener( "load", handle_reader_load );

		data.upload.reader.readAsDataURL( ELEM.AMOGI_FILE.files[0] );

		ELEM.AMOGI_FILE.setAttribute( "disabled", "" );
		ELEM.AMOGI_LOGO.setAttribute( "class", "hidden" );
		ELEM.AMOGI_LOGO_FIXED.setAttribute( "class", "show" );
	}

	ELEM.AMOGI_FILE.addEventListener( "change", handle_amogi_change );
}

window.addEventListener( "load", init_amogitech );

//"https://amogitech.herokuapp.com/"