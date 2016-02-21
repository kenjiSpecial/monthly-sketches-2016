var THREE = require('three');
window.THREE = THREE;
require('./MarchingCubes');
var glslify = require('glslify');

export default class SkinnedMesh extends THREE.ShaderMaterial {
    constructor() {

        var uniforms = {
            uOpacity : {type : "f", value: 1},
            texture  : {type : "t", value: null}
        };

        var opts = {
            uniforms : uniforms,
            vertexShader   : glslify('../shaders/common.vert'),
            fragmentShader : glslify('../shaders/01/shader.frag'),
            side           : THREE.DoubleSide,
            transparent    : true
        };

        super(opts);

        this.uniforms = uniforms;

        this.rTextureWidth  = window.innerWidth;
        this.rTextureHeight = window.innerHeight; //window.innerWidth * 54/62;
        this.rTexture = new THREE.WebGLRenderTarget( this.rTextureWidth, this.rTextureHeight, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBFormat
        });

        this.uniforms.texture.value = this.rTexture;


        this.cameraRTT = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
        this.cameraRTT.position.set( 0, 0, 1000 );
        this.cameraRTT.lookAt(new THREE.Vector3(0, 0, 0));
        //this.cameraRTT.position.z = 200;

        this.sceneRTT = new THREE.Scene();

        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 0.5, 0.5, 1 );
        this.sceneRTT.add( light );

        var pointLight = new THREE.PointLight( 0xff3300 );
        pointLight.position.set( 0, 0, 100 );
        this.sceneRTT.add( pointLight );

        var ambientLight = new THREE.AmbientLight( 0x080808 );
        this.sceneRTT.add( ambientLight );

        this.resolution = 10;
        this.numBlobs = 0;
        //this.material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
        //this.material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
        this.material = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0x111111, shininess: 1, shading: THREE.FlatShading });
        this.cubes = new THREE.MarchingCubes(this.resolution, this.material, true, true);
        this.cubes.enableUvs = false;
        this.cubes.enableColors = false;


        this.sceneRTT.add(this.cubes);
        this.cubes.position.set( 0, 0, 0 );
        var scale = 800;
        this.cubes.scale.set( scale, scale, scale );

        var i, ballx, bally, ballz, subtract, strength;
        var object = this.cubes;
        var numblobs = this.numBlobs;
        var time = 0;

        object.reset();

        subtract = 12;
        strength = 1.2 / ( ( Math.sqrt( numblobs ) - 1 ) / 4 + 1 );

        for ( i = 0; i < numblobs; i ++ ) {

            ballx = Math.sin( i + 1.26 * time * ( 1.03 + 0.5 * Math.cos( 0.21 * i ) ) ) * 0.27 + 0.5;
            bally = Math.abs( Math.cos( i + 1.12 * time * Math.cos( 1.22 + 0.1424 * i ) ) ) * 0.77; // dip into the floor
            ballz = Math.cos( i + 1.32 * time * 0.1 * Math.sin( ( 0.92 + 0.53 * i ) ) ) * 0.27 + 0.5;

            object.addBall(ballx, bally, ballz, strength, subtract);

        }

         //object.addPlaneY( 2, 12 );
         object.addPlaneZ( 1, 12 );
         //object.addPlaneX( 2, 12 );
        //object.addPlaneX( -2, 12 );

        //console.log(this.cubes);


        var geo = new THREE.CubeGeometry(100, 100, 100);
        var mat = new THREE.MeshBasicMaterial({color: 0xff0000});
        var cubes = new THREE.Mesh(geo, mat);
        this.sceneRTT.add(cubes);
    }

    reset (){

    }

    update (dt){
        window.app.renderer.render(this.sceneRTT, this.cameraRTT, this.rTexture, true);
    }
}
