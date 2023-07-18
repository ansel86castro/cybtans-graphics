#version 300 es
precision mediump float;

in vec3 v_positionW;
in vec2 v_texCoord;

vec4 diffuse;
uniform sampler2D uDiffuseSampler;

out vec4 Color;

void main() 
{
    Color = texture(uDiffuseSampler, v_texCoord);
       
}