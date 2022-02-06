function init_draw() {
	var ELEM = {};

	ELEM["ANIM_IMG"] = document.getElementById( "anim-img" ),
	ELEM["ANIM_CANVAS"] = document.getElementById( "anim-canvas" );
	ELEM["ANIM_STOP"] = document.getElementById( "stop-capture" );
	ELEM["ANIM_RESET"] = document.getElementById( "reset-canvas" );
	ELEM["ANIM_DOWNLOAD"] = document.getElementById( "download-link" );
	ELEM["ANIM_WIDTH"] = document.getElementById( "stroke-width" );

	var data = {};
	data["loader"] = {};

	data.loader["reader"] = null;
	data.loader["image"] = null;

	data["draw"] = {};

	data.draw["width"] = new Int16Array( 1 );
	data.draw["last_time"] = -10419;
	data.draw["drawing"] = false;
	data.draw["last_drawing"] = false;
	data.draw["coords"] = new Int16Array( 2 );
	data.draw["ctx"] = null;
	data.draw["frame"] = null;
	data.draw["capture"] = new Int16Array( 32768 );
	data.draw["idx"] = 0;
	data.draw["download"] = null;

	data.draw.coords[0] = -1;
	data.draw.coords[1] = -1;

	function reset_capture() {
		for( var i = 0; i < 32768; ++i ) {
			data.draw.capture[i] = -1;
		}
	}

	function game_loop( ts ) {
		if( data.draw.last_time < 0 ) data.draw.last_time = ts;
		var curr = ts;

		if( data.draw.drawing ) {
			if( data.draw.last_drawing != data.draw.drawing ) {
				data.draw.ctx.beginPath();
				data.draw.ctx.moveTo( data.draw.coords[0], data.draw.coords[1] );
			} else {
				data.draw.ctx.lineTo( data.draw.coords[0], data.draw.coords[1] );
				data.draw.ctx.stroke();
			}
		}

		data.draw.capture[( data.draw.idx << 1 )] = data.draw.coords[0];
		data.draw.capture[( data.draw.idx << 1 ) + 1] = data.draw.coords[1];

		data.draw.last_time = curr;
		data.draw.last_drawing = data.draw.drawing;

		++( data.draw.idx );

		if( data.draw.idx < 16384 ) data.draw["frame"] = window.requestAnimationFrame( game_loop );
		else handle_stop_click( null );
	}

	function handle_width_change( evt ) {
		if( data.draw.ctx == null ) return;

		var width = parseInt( ELEM.ANIM_WIDTH.value );
		if( width == NaN ) width = 1;
		if( width < 1 ) width = 1;

		data.draw.ctx.lineWidth = ( data.draw.width = width );
	}

	function handle_stop_click( evt ) {
		window.cancelAnimationFrame( data.draw.frame );
		data.draw.frame = null;

		var download_length = data.draw.idx << 1;

		data.draw.download = new Int16Array( download_length + 1 );

		data.draw.download[0] = data.draw.width;

		for( var i = 0; i < download_length; ++i ) {
			data.draw.download[i + 1] = data.draw.capture[i];
		}

		data.draw.download = new Blob( [ data.draw.download.buffer ], { type: 'text/plain' } );
		data.draw.download = URL.createObjectURL( data.draw.download );

		ELEM.ANIM_DOWNLOAD.innerHTML = "Download";
		ELEM.ANIM_DOWNLOAD.href = data.draw.download;

		ELEM.ANIM_RESET.addEventListener( "click", handle_reset_click );

		ELEM.ANIM_STOP.setAttribute( "disabled", "" );
		ELEM.ANIM_RESET.removeAttribute( "disabled" );
	}

	function handle_reset_click( evt ) {
		ELEM.ANIM_STOP.removeEventListener( "click", handle_stop_click );
		ELEM.ANIM_RESET.removeEventListener( "click", handle_reset_click );

		URL.revokeObjectURL( data.draw.download );

		data.draw.ctx.drawImage( data.loader.image, 0, 0 );

		data.draw.last_time = -10419;
		data.draw.drawing = false;
		data.draw.last_drawing = false;

		data.draw.coords[0] = -1;
		data.draw.coords[1] = -1;

		reset_capture();

		ELEM.ANIM_STOP.setAttribute( "disabled", "" );
		ELEM.ANIM_RESET.setAttribute( "disabled", "" );

		ELEM.ANIM_WIDTH.removeAttribute( "disabled" );	

		ELEM.ANIM_DOWNLOAD.innerHTML = "Waiting for capture...";
		ELEM.ANIM_DOWNLOAD.removeAttribute( "href" );
	}

	function handle_mouse_down( evt ) {
		if( data.draw.last_time < -1 ) {
			data.draw.last_time = -1;
			ELEM.ANIM_DOWNLOAD.innerHTML = "Capturing...";
			ELEM.ANIM_STOP.addEventListener( "click", handle_stop_click );
			ELEM.ANIM_STOP.removeAttribute( "disabled" );
			ELEM.ANIM_WIDTH.setAttribute( "disabled", "" );
			data.draw.frame = window.requestAnimationFrame( game_loop );
		}
		data.draw.coords[0] = evt.offsetX;
		data.draw.coords[1] = evt.offsetY;
		data.draw.drawing = true;
	}

	function handle_mouse_move( evt ) {
		if( !data.draw.drawing ) return;
		data.draw.coords[0] = evt.offsetX;
		data.draw.coords[1] = evt.offsetY;
	}

	function handle_mouse_up( evt ) {
		data.draw.coords[0] = -1;
		data.draw.coords[1] = -1;
		data.draw.drawing = false;
	}

	function handle_img_load( evt ) {
		ELEM.ANIM_CANVAS.width = data.loader.image.width;
		ELEM.ANIM_CANVAS.height = data.loader.image.height;

		data.draw.ctx = ELEM.ANIM_CANVAS.getContext( "2d" );

		data.draw.ctx.drawImage( data.loader.image, 0, 0 );

		data.draw.ctx.strokeStyle = "#FF0000";

		ELEM.ANIM_CANVAS.addEventListener( "mousedown", handle_mouse_down );
		ELEM.ANIM_CANVAS.addEventListener( "mousemove", handle_mouse_move );
		ELEM.ANIM_CANVAS.addEventListener( "mouseup", handle_mouse_up );

		ELEM.ANIM_WIDTH.removeAttribute( "disabled" );	
	}

	function handle_reader_load( evt ) {
		data.loader.image = new Image();
		data.loader.image.addEventListener( "load", handle_img_load );

		data.loader.image.src = data.loader.reader.result;
	}

	function handle_file_change( evt ) {
		if( data.draw.frame != null ) {
			window.cancelAnimationFrame( data.draw.frame );
			data.draw.frame = null;
		}

		if( data.draw.download != null ) {
			URL.revokeObjectURL( data.draw.download );
			data.draw.download = null;
		}

		ELEM.ANIM_DOWNLOAD.innerHTML = "Waiting for capture...";
		ELEM.ANIM_DOWNLOAD.removeAttribute( "href" );

		ELEM.ANIM_STOP.setAttribute( "disabled", "" );
		ELEM.ANIM_RESET.setAttribute( "disabled", "" );

		data.draw.last_time = -10419;
		data.draw.drawing = false;
		data.draw.last_drawing = false;
		data.draw.ctx = null;
		data.draw.download = null;

		reset_capture();

		data.draw.coords[0] = -1;
		data.draw.coords[1] = -1;

		ELEM.ANIM_STOP.removeEventListener( "click", handle_stop_click );
		ELEM.ANIM_RESET.removeEventListener( "click", handle_reset_click );

		ELEM.ANIM_CANVAS.removeEventListener( "mousedown", handle_mouse_down );
		ELEM.ANIM_CANVAS.removeEventListener( "mousemove", handle_mouse_move );
		ELEM.ANIM_CANVAS.removeEventListener( "mouseup", handle_mouse_up );

		if( ELEM.ANIM_IMG.files.length == 0 ) return;

		ELEM.ANIM_DOWNLOAD.setAttribute( "download", ELEM.ANIM_IMG.files[0].name + ".sus" );

		data.loader.reader = new FileReader();
		data.loader.reader.addEventListener( "load", handle_reader_load );

		data.loader.reader.readAsDataURL( ELEM.ANIM_IMG.files[0] );
	}

	reset_capture();

	ELEM.ANIM_WIDTH.addEventListener( "change", handle_width_change );
	ELEM.ANIM_IMG.addEventListener( "change", handle_file_change );
}

window.addEventListener( "load", init_draw );