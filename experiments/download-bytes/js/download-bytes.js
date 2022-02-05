function init_download() {
	var LINK_DOWNLOAD = document.getElementById( "download-link" );

	var bytes = new Int16Array( 65536 );

	for( var i = -32768; i < 32768; ++i ) {
		bytes[i + 32768] = i;
	}

	var anim_data = new Blob( [ bytes.buffer ], { type: 'text/plain' } );
	var anim_file = window.URL.createObjectURL( anim_data );

	LINK_DOWNLOAD.href = anim_file;
}

window.addEventListener( "load", init_download );