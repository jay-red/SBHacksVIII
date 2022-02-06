function init_draw() {
	var ELEM = {};

	ELEM["ANIM_IMG"] = document.getElementById( "anim-img" ),
	ELEM["ANIM_CANVAS"] = document.getElementById( "anim-canvas" );

	var data = {};
	data["loader"] = {};

	data.loader["reader"] = null;
	data.loader["image"] = null;

	data["draw"] = {};

	data.draw["last_time"] = -10419;
	data.draw["drawing"] = false;
	data.draw["last_drawing"] = false;
	data.draw["coords"] = new Int16Array( 2 );
	data.draw["ctx"] = null;

	data.draw.coords[0] = -1;
	data.draw.coords[1] = -1;

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

		data.draw.last_time = curr;
		data.draw.last_drawing = data.draw.drawing;

		window.requestAnimationFrame( game_loop	);
	}

	function handle_mouse_down( evt ) {
		if( data.draw.last_time < -1 ) {
			data.draw.last_time = -1;
			window.requestAnimationFrame( game_loop );
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

		ELEM.ANIM_CANVAS.addEventListener( "mousedown", handle_mouse_down );
		ELEM.ANIM_CANVAS.addEventListener( "mousemove", handle_mouse_move );
		ELEM.ANIM_CANVAS.addEventListener( "mouseup", handle_mouse_up );	
	}

	function handle_reader_load( evt ) {
		data.loader.image = new Image();
		data.loader.image.addEventListener( "load", handle_img_load );

		data.loader.image.src = data.loader.reader.result;
	}

	function handle_file_change( evt ) {
		data.draw.last_time = -10419;
		data.draw.drawing = false;
		data.draw.ctx = null;

		data.draw.coords[0] = -1;
		data.draw.coords[1] = -1;

		ELEM.ANIM_CANVAS.removeEventListener( "mousedown", handle_mouse_down );
		ELEM.ANIM_CANVAS.removeEventListener( "mousemove", handle_mouse_move );
		ELEM.ANIM_CANVAS.removeEventListener( "mouseup", handle_mouse_up );

		if( ELEM.ANIM_IMG.files.length == 0 ) return;

		data.loader.reader = new FileReader();
		data.loader.reader.addEventListener( "load", handle_reader_load );

		data.loader.reader.readAsDataURL( ELEM.ANIM_IMG.files[0] );
	}

	ELEM.ANIM_IMG.addEventListener( "change", handle_file_change );
}

window.addEventListener( "load", init_draw );