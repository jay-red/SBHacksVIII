function init_amogitech() {
	var AMOGI_PRESETS = ["0pbx60g1uwm71.jpg", "10000-15-A-OR_300x.jpg", "1000_F_264918039_IDCcav68QDuCiCwHQDy25vhnVkszDpIL.jpg", "258910878_473682777657733_4852886152500614701_n.png", "269894827_685723842423806_7807012008190964539_n.jpg", "270072551_608382863766024_1397326534896797595_n.png", "272269789_758263478910882_8371936274854153652_n.png", "41RsEwAbK5L._AC_.jpg", "630ifq407yb71.jpg", "69965c2849ec9b7148a5547ce6714735.jpg", "8ee.jpg", "af.PNG", "chinese-characters.001.jpg", "Cl.PNG", "CombJellyProductImage_1024x1024@2x.jpg", "crzsbduz88p51.jpg", "EuTYyBKXIAQs5A-.png", "fe6.jpg", "hat.PNG", "hr2gxpitgvw61.jpg", "img_2145.jpg", "lb.PNG", "lunch.PNG", "memscwmtpo371.jpg", "na8act8mxqo71.png", "nebula.PNG", "os.PNG", "parking-meters-1.jpg", "ribosome_lrg_sm_subunits-23b46a3be6354c4eacb550b25fa3c69d.jpg", "rl7gr4ifanw71.jpg", "s-l400.jpg", "toe.PNG", "uc.PNG", "wh.PNG", "ximugadle2071.jpg"];

	var ELEM = {};

	ELEM["AMOGI_FILE"] = document.getElementById( "amogi-file" );
	ELEM["AMOGI_CANVAS"] = document.getElementById( "amogi-canvas" );

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
	data.anim["target_x"] = -1;
	data.anim["target_y"] = -1;

	function handle_anim_ready_state_change() {
		if( data.anim.xhr.readyState != 4 || data.anim.xhr.status != 200 ) return;

		console.log( data.anim.target_x, data.anim.target_y );
	}

	function handle_amogi_ready_state_change() {
		if( data.upload.xhr.readyState != 4 || data.upload.xhr.status != 200 ) return;

		data.anim.xhr = new XMLHttpRequest();

		data.anim.xhr.addEventListener( "readystatechange", handle_anim_ready_state_change )

		data.anim.xhr.open( "GET", "./assets/sus/" + AMOGI_PRESETS[( Math.random() * AMOGI_PRESETS.length ) | 0] + ".sus" );
		data.anim.xhr.send();

		var response = JSON.parse( data.upload.xhr.responseText );

		data.anim.target_x = response.x;
		data.anim.target_y = response.y;
	}

	function handle_image_load() {
		data.upload.xhr = new XMLHttpRequest();

		data.upload.xhr.addEventListener( "readystatechange", handle_amogi_ready_state_change );

		data.upload.xhr.open( "POST", "http://localhost:5000/" );
		data.upload.xhr.send( data.upload.form );
	}

	function handle_reader_load() {
		data.upload.image = new Image();
		data.upload.image.addEventListener( "load", handle_image_load );

		data.upload.image.src = data.upload.reader.result;
	}

	function handle_amogi_change() {
		console.log( "amogi" );

		if( ELEM.AMOGI_FILE.files.length == 0 ) return;

		data.upload.file = ELEM.AMOGI_FILE.files[0];

		data.upload.form = new FormData();
		data.upload.form.append( "amogi-file", data.upload.file );

		data.upload.reader = new FileReader();
		data.upload.reader.addEventListener( "load", handle_reader_load );

		data.upload.reader.readAsDataURL( ELEM.AMOGI_FILE.files[0] );

		ELEM.AMOGI_FILE.setAttribute( "disabled", "" );
	}

	ELEM.AMOGI_FILE.addEventListener( "change", handle_amogi_change );
}

window.addEventListener( "load", init_amogitech );

//"https://amogitech.herokuapp.com/"