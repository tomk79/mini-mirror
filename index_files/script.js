window.win = nw.Window.get();
let mirror = document.getElementById('mirror');
let localStream;

navigator.mediaDevices.getUserMedia({video: true, audio: false})
	.then(function (stream) { // success
		localStream = stream;
		mirror.src = window.URL.createObjectURL(localStream);
	}).catch(function (error) { // error
		console.error('mediaDevice.getUserMedia() error:', error);
		return;
	})
;
