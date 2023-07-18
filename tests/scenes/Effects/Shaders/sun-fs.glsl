#version 300 es
precision mediump float;

in vec3 v_positionW;
in vec3 v_normalW;
in vec2 v_texCoord;
in float v_occ;

uniform sampler2D uDiffuseSampler;

out vec4 Color;

void main() 
{
    Color  = texture(uDiffuseSampler, v_texCoord);
    Color.rgb *= 1.8 ;
    Color.rgb = clamp(Color.rgb, vec3(0.0), vec3(1.0));
}