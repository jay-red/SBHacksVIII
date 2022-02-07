function init_playback() {
	var ELEM = {};

	ELEM["ANIM_CANVAS"] = document.getElementById( "amogi-canvas" );

	var data = {};

	data["idx"] = 0;

	data["anim"] = {};

	var AMOGI_PRESETS = ["0pbx60g1uwm71.jpg", "10000-15-A-OR_300x.jpg", "1000_F_264918039_IDCcav68QDuCiCwHQDy25vhnVkszDpIL.jpg", "258910878_473682777657733_4852886152500614701_n.png", "269894827_685723842423806_7807012008190964539_n.jpg", "270072551_608382863766024_1397326534896797595_n.png", "272269789_758263478910882_8371936274854153652_n.png", "41RsEwAbK5L._AC_.jpg", "630ifq407yb71.jpg", "69965c2849ec9b7148a5547ce6714735.jpg", "8ee.jpg", "af.PNG", "chinese-characters.001.jpg", "Cl.PNG", "CombJellyProductImage_1024x1024@2x.jpg", "crzsbduz88p51.jpg", "EuTYyBKXIAQs5A-.png", "fe6.jpg", "hat.PNG", "hr2gxpitgvw61.jpg", "img_2145.jpg", "lb.PNG", "lunch.PNG", "memscwmtpo371.jpg", "na8act8mxqo71.png", "nebula.PNG", "os.PNG", "parking-meters-1.jpg", "ribosome_lrg_sm_subunits-23b46a3be6354c4eacb550b25fa3c69d.jpg", "rl7gr4ifanw71.jpg", "s-l400.jpg", "toe.PNG", "uc.PNG", "wh.PNG", "ximugadle2071.jpg"];

	data.anim["name"] = AMOGI_PRESETS[0];
	data.anim["ctx"] = null;
	data.anim["cap"] = null;
	data.anim["img"] = new Image();
	data.anim["frame"] = 0;
	data.anim["max_frame"] = 0;
	data.anim["drawing"] = false;
	data.anim["last_drawing"] = false;

	var xhr = new XMLHttpRequest();

	function game_loop( ts ) {
		var idx = data.anim.frame << 1;
		var x = data.anim.cap[idx + 4];
		var y = data.anim.cap[idx + 5];

		if( x == -1 || y == -1 ) data.anim.drawing = false;
		else data.anim.drawing = true;

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

		data.anim.frame += 3;
		if( data.anim.frame < data.anim.max_frame ) {
			window.requestAnimationFrame( game_loop );
		} else {
			data.idx += 1;
			data.idx %= AMOGI_PRESETS.length;

			data.anim.ctx.clearRect( 0, 0, ELEM.ANIM_CANVAS.width, ELEM.ANIM_CANVAS.height );
			data.anim.name = AMOGI_PRESETS[data.idx];
			data.anim.ctx = null;
			data.anim.cap = null;
			data.anim.img = new Image();
			data.anim.frame = 0;
			data.anim.max_frame = 0;
			data.anim.drawing = false;
			data.anim.last_drawing = false;

			xhr = new XMLHttpRequest();

			xhr.responseType = "arraybuffer";

			xhr.addEventListener( "readystatechange", handle_ready_state_change );

			xhr.open( "GET", "../../docs/assets/sus/"  + data.anim.name + ".sus" );
			xhr.send();
		}
	}

	function handle_image_load() {
		ELEM.ANIM_CANVAS.width = data.anim.img.width;
		ELEM.ANIM_CANVAS.height = data.anim.img.height;

		data.anim.ctx = ELEM.ANIM_CANVAS.getContext( "2d" );

		data.anim.ctx.drawImage( data.anim.img, 0, 0 );

		data.anim.max_frame = ( ( data.anim.cap.length - 4 ) / 2 ) | 0;

		data.anim.ctx.lineWidth = data.anim.cap[3];
		data.anim.ctx.strokeStyle = "#FF0000";

		window.requestAnimationFrame( game_loop );
	}

	function handle_ready_state_change() {
		if( xhr.readyState != 4 || xhr.status != 200 ) return;
		data.anim.cap = new Int16Array( xhr.response );

		data.anim.img.addEventListener( "load", handle_image_load );

		data.anim.img.src = "../../docs/assets/amogus/" + data.anim.name;
	}

	xhr.responseType = "arraybuffer";

	xhr.addEventListener( "readystatechange", handle_ready_state_change );

	xhr.open( "GET", "../../docs/assets/sus/"  + data.anim.name + ".sus" );
	xhr.send();
}

window.addEventListener( "load", init_playback );