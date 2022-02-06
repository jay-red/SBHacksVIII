function init_playback() {
	var xhr = new XMLHttpRequest();

	function handle_ready_state_change() {
		if( xhr.readyState != 4 || xhr.status != 200 ) return;
		console.log( xhr.response );
	}

	xhr.responseType = "arraybuffer";

	xhr.addEventListener( "readystatechange", handle_ready_state_change );

	xhr.open( "GET", "./assets/6ee29cb098b8f1f601f73e9351db4e89.webp.sus" );
	xhr.send();
}

window.addEventListener( "load", init_playback );