#version 300 es
precision mediump float;

in vec3 v_texCoord;

uniform samplerCube u_CubeMap;

out vec4 Color;

void main(){	
   Color = texture(u_CubeMap, v_texCoord);
}