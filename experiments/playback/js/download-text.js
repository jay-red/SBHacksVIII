function init_download() {
	var LINK_DOWNLOAD = document.getElementById( "download-link" );

	var anim_data = new Blob( [ "hello world" ], { type: 'text/plain' } );
	var anim_file = window.URL.createObjectURL( anim_data );

	LINK_DOWNLOAD.href = anim_file;
}

window.addEventListener( "load", init_download );