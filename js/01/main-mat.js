//require('./vendors/GPUParticleSystem');
var HanabiParticle = require('./hanabi-particle'); // = new HanabiParticle();

var glslify = require('glslify');

var Special01Material = function(){
    var bgImage = window.app.assets.texture['spBg'].image;
    //window.app.assets.texture['spBg'].minFilter = window.app.assets.texture['spBg'].magFilter = THREE.LinearFilter;
    //window.app.assets.texture['spBg'].format = THREE.RGBAFormat;

    this.uniforms = {
        uTime : {type :"f", value: 0 },
        uState : {type: "f", value: 0 },
        uOpacity : {type: "f", value: 0 },
        uDeviceRatio : {type: "f", value: window.devicePixelRatio },
        uuOpacity : {type: "f", value: 0.9 + 0.1 * Math.random() },
        texture :   { type: "t",  value: null },
        bgTexture : { type: "t", value: window.app.assets.texture['spBg']},
        bgSize    : { type: "v2", value: new THREE.Vector2( bgImage.width, bgImage.height )},
        windowSize: { type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) }
    }

    this.opts = {
        uniforms       : this.uniforms,
        vertexShader   : glslify('../shaders/common.vert'),
        fragmentShader : glslify('../shaders/01/shader.frag'),
        side           : THREE.DoubleSide,
        transparent    : true,
        depthTest      : true
    };

    this.rTextureWidth  = window.innerWidth;
    this.rTextureHeight = window.innerHeight; //window.innerWidth * 54/62;
    this.rTexture = new THREE.WebGLRenderTarget( this.rTextureWidth, this.rTextureHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBFormat
    });

    this.uniforms.texture.value = this.rTexture;

    this.cameraRTT = new THREE.PerspectiveCamera(50, 1/this.rTextureHeight*this.rTextureWidth, 1, 10000);
    this.cameraRTT.position.z = 200;


    this.sceneRTT = new THREE.Scene();

    this.particleSystem = new HanabiParticle();


    this.sceneRTT.add( this.particleSystem);



    THREE.ShaderMaterial.call(this, this.opts);
};


Special01Material.prototype = Object.create(THREE.ShaderMaterial.prototype);
Special01Material.prototype.constructor = Special01Material;

Special01Material.prototype.reset = function(){
    this.uniforms.uTime.value = 0;
    this.uniforms.uOpacity.value = 0;

    this.start();
};


Special01Material.prototype.start = function(){

    this.particleSystem.start();

    TweenLite.to(this.uniforms.uOpacity, 1.2, {value: 1, delay: 0.4, onComplete: function(){
        this.dispatchEvent ( {type: "tweenComplete"} );
    }.bind(this)});
};

Special01Material.prototype.turnOff = function(){
    this.particleSystem.turnOff();
    TweenLite.to(this.uniforms.uOpacity, 0.6, {value: 0, onComplete: function(){
        this.dispatchEvent ( {type: "turnOffSpecial"} );
    }.bind(this)});
}

Special01Material.prototype.onUpdate = function(dt){
    this.uniforms.uuOpacity.value = 0.1 * Math.random() + 0.6;

    this.uniforms.uTime.value += dt;
    var tick = this.uniforms.uTime.value;
    this.particleSystem.update(this.uniforms.uTime.value);

    window.app.renderer.render(this.sceneRTT, this.cameraRTT, this.rTexture);
};

Special01Material.prototype.onResize = function(){
    this.uniforms.windowSize.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    this.rTextureWidth  = window.innerWidth;
    this.rTextureHeight = window.innerHeight;

    this.rTexture.setSize( window.innerWidth, window.innerHeight );

    this.cameraRTT.aspect = window.innerWidth / window.innerHeight;
    this.cameraRTT.updateProjectionMatrix();
};

module.exports = Special01Material;