var fs = require('fs');
var fsX = require('fs-extra');
var utils79 = require('utils79');
var it79 = require('iterate79');
var phpjs = require('phpjs');
var zipFolder = require('zip-folder');
var packageJson = require('./package.json');
var date = new Date();
var appName = packageJson.name;
var NwBuilder = require('nw-builder');


console.log('== build "'+appName+'" ==');

console.log('Cleanup...');
(function(base){
	var ls = fs.readdirSync(base);
	for(var idx in ls){
		if( ls[idx] == '.gitkeep' ){continue;}
		if( utils79.is_dir(base+'/'+ls[idx]) ){
			fsX.removeSync(base+'/'+ls[idx]);
		}else if( utils79.is_file(base+'/'+ls[idx]) ){
			fsX.unlinkSync(base+'/'+ls[idx]);
		}
	}
})( __dirname+'/build/' );
console.log('');

function getTimeString(){
	var date = new Date();
	return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
}
function writeLog(row){
	fs.appendFile( __dirname+'/build/buildlog.txt', row+"\n" ,'utf8', function(err){
		if(err){
			console.error(err);
		}
	} );
	console.log(row);
}
writeLog( getTimeString() );

writeLog('Build...');

var nw = new NwBuilder({
	files: [
		'./package.json',
		'./common/**/*',
		'./index.html',
		'./index_files/**/*',
		'./node_modules/**/*'
	],
	flavor: 'sdk',
	macIcns: './common/images/appicon-osx.icns',
	winIco: './common/images/appicon-win.ico',
	zip: false,
	platforms: [
		'linux64',
		'osx64',
		'win32'
	],
	version: '0.21.1'
});
nw.on('log',  writeLog);


// Build returns a promise
nw.build().then(function () {

	writeLog('all build done!');
	writeLog( getTimeString() );

	(function(){
		var versionSign = packageJson.version;
		function pad(str, len){
			str += '';
			str = phpjs.str_pad(str, len, '0', 'STR_PAD_LEFT');
			return str;
		}
		if( packageJson.version.match(new RegExp('\\+(?:[a-zA-Z0-9\\_\\-\\.]+\\.)?nb$')) ){
			versionSign += '-'+pad(date.getFullYear(),4)+pad(date.getMonth()+1, 2)+pad(date.getDate(), 2);
			versionSign += '-'+pad(date.getHours(),2)+pad(date.getMinutes(), 2);
		}

		it79.fnc({}, [
			function(itPj, param){
				writeLog('ZIP osx64...');
				zipFolder(
					__dirname + '/build/'+appName+'/osx64/',
					__dirname + '/build/'+appName+'-'+versionSign+'-osx64.zip',
					function(err) {
						if(err) {
							writeLog('ERROR!', err);
						} else {
							writeLog('success. - '+'./build/'+appName+'-'+versionSign+'-osx64.zip');
						}
						itPj.next(param);
					}
				);
			},
			function(itPj, param){
				writeLog('ZIP win32...');
				zipFolder(
					__dirname + '/build/'+appName+'/win32/',
					__dirname + '/build/'+appName+'-'+versionSign+'-win32.zip',
					function(err) {
						if(err) {
							writeLog('ERROR!', err);
						} else {
							writeLog('success. - '+'./build/'+appName+'-'+versionSign+'-win32.zip');
						}
						itPj.next(param);
					}
				);
			},
			function(itPj, param){
				writeLog('ZIP linux64...');
				zipFolder(
					__dirname + '/build/'+appName+'/linux64/',
					__dirname + '/build/'+appName+'-'+versionSign+'-linux64.zip',
					function(err) {
						if(err) {
							writeLog('ERROR!', err);
						} else {
							writeLog('success. - '+'./build/'+appName+'-'+versionSign+'-linux64.zip');
						}
						itPj.next(param);
					}
				);
			},
			function(itPj, param){
				writeLog('cleanup...');
				fsX.removeSync(__dirname+'/build/'+appName+'/');
				itPj.next(param);
			},
			function(itPj, param){
				writeLog( getTimeString() );
				writeLog('all zip done!');
				itPj.next(param);
			}
		]);

	})();

}).catch(function (error) {
	writeLog("ERROR:");
	writeLog(error);
	console.error(error);
});
