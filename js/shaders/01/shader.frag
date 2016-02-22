varying vec2 vUv;

uniform float uTime;
uniform float uState;
uniform float uMouse;
uniform float uOpacity;
uniform float uuOpacity;
uniform float uDeviceRatio;

uniform vec2 windowSize;
uniform vec2 bgSize;

uniform sampler2D texture;
uniform sampler2D bgTexture;


void main(){
    vec2 margin = vec2( (windowSize.x - bgSize.x/2.)/2., 40. * uDeviceRatio);
    vec2 customUv;
    customUv.x = (vUv.x * windowSize.x - margin.x)/bgSize.x * 2.;
    customUv.y = (gl_FragCoord.y - margin.y)/bgSize.y * 2.;

    vec4 col;
    if(customUv.x > 0. && customUv.x < 1. && customUv.y > 0. && customUv.y < 1. ){
        col = mix( vec4(0., 0., 0., 1.0), ( texture2D(texture, vUv).rgba + texture2D(bgTexture, customUv).rgba* uuOpacity ), uOpacity);
    }else{
        col = mix( vec4(0., 0., 0., 1.0), texture2D(texture, vUv).rgba, uOpacity);
    }

    gl_FragColor = col;
}
