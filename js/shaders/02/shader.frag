uniform float uOpacity;
uniform sampler2D texture;

void main(){
    vec3 col = mix( vec3(0., 0., 0.), texture2D(texture, vUv).rgb, uOpacity);
    gl_FragColor = vec4( col, 1.);
}