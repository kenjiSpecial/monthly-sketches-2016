/** global library **/
require('gsap');

var raf = require('raf')
var montlyFiles = require('./js/monthly-files');
var loaderFiles = require('./js/loader-files');

window.THREE = require('three');

window.app = {
    assets : {
        texture : {}
    }
};

var month = 1;

//var SpecialMat = require('./js/boilerplate/main-mat');
//var SpecialMat = require('./js/01/main-mat');
import SpecialMat from './js/02/main-mat';

var mat;
var prevTime;
var mouseX = 0, mouseY = 0;

var Loader = require('./js/loader');

document.body.style.margin = "0";


var renderer, camera, mesh, mat, scene;
var loader;

function loadStart(){
    renderer = new THREE.WebGLRenderer({ alpht: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0x000000, 1 );
    window.app.renderer = renderer;
    document.body.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera( -window.innerWidth/2, window.innerWidth/2, -window.innerHeight/2, window.innerHeight/2, -10000, 10000 );
    camera.position.z = 10;


    loaderFiles.images = montlyFiles[month + 1];
    loader = new Loader();
    loader.addEventListener ( loader.ASSETS_LOADED, onAssetsLoaded );
    loader.start()


}

function onAssetsLoaded(){
    prevTime = performance.now();
    var geometry = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight );
    mat = new SpecialMat();

    mesh = new THREE.Mesh(geometry, mat);

    scene.add(mesh);

    mat.reset();
    onResize();

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);

    raf(loop);
}

function loop(){
    var curTime = performance.now();
    var dt = (curTime - prevTime)/1000

    mat.onUpdate(dt, renderer, mouseX, mouseY);
    renderer.render(scene, camera)

    prevTime = curTime;
    raf(loop);
}

function onResize(ev){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.left = -window.innerWidth / 2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = -window.innerHeight / 2;
    camera.updateProjectionMatrix();

    mat.onResize(renderer);

    mesh.geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera)
}

function onMouseMove(ev){
    mouseX = ev.clientX;
    mouseY = ev.clientY;
};

loadStart();