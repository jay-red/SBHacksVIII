function init_draw() {
	var ELEM = {};

	ELEM["ANIM_IMG"] = document.getElementById( "anim-img" ),
	ELEM["ANIM_CANVAS"] = document.getElementById( "anim-canvas" );

	var data = {};
	data["loader"] = {};

	data.loader["reader"] = null;
	data.loader["image"] = null;

	function handle_img_load( evt ) {
		ELEM.ANIM_CANVAS.width = data.loader.image.width;
		ELEM.ANIM_CANVAS.height = data.loader.image.height;

		ELEM.ANIM_CANVAS.getContext( "2d" ).drawImage( data.loader.image, 0, 0 );
	}

	function handle_reader_load( evt ) {
		data.loader.image = new Image();
		data.loader.image.addEventListener( "load", handle_img_load );

		data.loader.image.src = data.loader.reader.result;
	}

	function handle_file_change( evt ) {
		if( ELEM.ANIM_IMG.files.length == 0 ) return;

		data.loader.reader = new FileReader();
		data.loader.reader.addEventListener( "load", handle_reader_load );

		data.loader.reader.readAsDataURL( ELEM.ANIM_IMG.files[0] );
	}

	ELEM.ANIM_IMG.addEventListener( "change", handle_file_change );
}

window.addEventListener( "load", init_draw );