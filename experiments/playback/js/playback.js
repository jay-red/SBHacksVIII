function init_playback() {
	var ELEM = {};

	ELEM["ANIM_CANVAS"] = document.getElementById( "anim-canvas" );

	var data = {};

	data["anim"] = {};

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
		var x = data.anim.cap[idx + 1];
		var y = data.anim.cap[idx + 2];

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

		data.anim.frame += 1;
		if( data.anim.frame < data.anim.max_frame ) {
			window.requestAnimationFrame( game_loop );
		}
	}

	function handle_image_load() {
		ELEM.ANIM_CANVAS.width = data.anim.img.width;
		ELEM.ANIM_CANVAS.height = data.anim.img.height;

		data.anim.ctx = ELEM.ANIM_CANVAS.getContext( "2d" );

		data.anim.ctx.drawImage( data.anim.img, 0, 0 );

		data.anim.max_frame = ( ( data.anim.cap.length - 1 ) / 2 ) | 0;

		data.anim.ctx.lineWidth = data.anim.cap[0];
		data.anim.ctx.strokeStyle = "#FF0000";

		window.requestAnimationFrame( game_loop );
	}

	function handle_ready_state_change() {
		if( xhr.readyState != 4 || xhr.status != 200 ) return;
		data.anim.cap = new Int16Array( xhr.response );

		data.anim.img.addEventListener( "load", handle_image_load );

		data.anim.img.src = "./assets/6ee29cb098b8f1f601f73e9351db4e89.webp";
	}

	xhr.responseType = "arraybuffer";

	xhr.addEventListener( "readystatechange", handle_ready_state_change );

	xhr.open( "GET", "./assets/6ee29cb098b8f1f601f73e9351db4e89.webp.sus" );
	xhr.send();
}

window.addEventListener( "load", init_playback );