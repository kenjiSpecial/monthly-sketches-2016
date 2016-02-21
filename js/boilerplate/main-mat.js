var glslify = require('glslify');

var Mat = function(){

    this.uniforms = {
        uTime : {type :"f", value: 0 },
        uState : {type: "f", value: 0 },
        uOpacity : {type: "f", value: 0 },
        uuOpacity : {type: "f", value: 0.9 + 0.1 * Math.random() },
        texture : { type: "t",  value: null },
        bgTexture : { type: "t", value: null}
    }

    this.opts = {
        uniforms       : this.uniforms,
        vertexShader   : glslify('../shaders/common.vert'),
        fragmentShader : glslify('./shader.frag'),
        side           : THREE.DoubleSide,
        transparent    : true
    };


    THREE.ShaderMaterial.call(this, this.opts);
};

Mat.prototype = Object.create(THREE.ShaderMaterial.prototype);


module.exports = Mat;


