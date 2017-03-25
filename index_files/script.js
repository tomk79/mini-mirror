window.win = nw.Window.get();
window.win.setAlwaysOnTop(true);
window.win.title = "mini mirror";
let mirror = document.getElementById('mirror');
let localStream;

(function(){
	var menubar = new nw.Menu({type:"menubar"});
	menubar.createMacBuiltin("mini mirror");

	var submenu = new nw.Menu();
	submenu.append(new nw.MenuItem({
		'type': 'checkbox',
		'label': '左右反転',
		'click': function(){
			// console.log(this);
			var mirror = $('#mirror');
			mirror.removeClass('no-reverse');
			if( !this.checked ){
				mirror.addClass('no-reverse');
			}
		},
		'key': 'r',
		'modifiers': 'super',
		'checked': true
	}));
	menubar.append(new nw.MenuItem({
		label: '操作',
		submenu: submenu
	}));
	window.win.menu = menubar;
	menubar.items[0].label = "mini mirror";

	nw.Window.get().menu = menubar;
	// console.log( nw.Window.get().menu.items );
})();



navigator.mediaDevices.getUserMedia({video: true, audio: false})
	.then(function (stream) { // success
		localStream = stream;
		mirror.src = window.URL.createObjectURL(localStream);
		console.log('success');
	}).catch(function (error) { // error
		console.error('mediaDevice.getUserMedia() error:', error);
		return;
	})
;


$(window).on('load', function(){
	$('#mirror')
		.on('mouseover', function(){
			nw.Window.get().show(true);
		})
		.on('mouseout', function(){
			nw.Window.get().show(false);
		})
	;
});
