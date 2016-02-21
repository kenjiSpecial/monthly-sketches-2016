var THREE = require('three');
window.THREE = THREE;
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

        var geo = new THREE.CubeGeometry(100, 100, 100);
        var mat = new THREE.MeshBasicMaterial({color: 0xff0000});
        var cubes = new THREE.Mesh(geo, mat);
        this.sceneRTT.add(cubes);
    }

    reset (){

    }

    onUpdate (dt){
        window.app.renderer.render(this.sceneRTT, this.cameraRTT, this.rTexture, true);
    }
    ibResize (){
        this.rTextureWidth  = window.innerWidth;
        this.rTextureHeight = window.innerHeight;

        this.rTexture.setSize( window.innerWidth, window.innerHeight );

        this.cameraRTT.aspect = window.innerWidth / window.innerHeight;
        this.cameraRTT.updateProjectionMatrix();
    }
}
