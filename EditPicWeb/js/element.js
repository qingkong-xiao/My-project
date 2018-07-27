var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var mirror = document.getElementById('canvas-mirror');
var mirrorContext = mirror.getContext('2d');
var watermarkcanvas = document.getElementById('watermarkcanvas');
var watermarkContext = watermarkcanvas.getContext('2d');
var ul = document.getElementsByTagName('ul');
var ul2 = document.getElementsByClassName('filter');
var file = document.getElementById('file');
var type;
var initializationImg;
var image = new Image();
var magnifier = {
	ismousedown:false
};