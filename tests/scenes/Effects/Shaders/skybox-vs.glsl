#version 300 es

in vec3 a_position;

uniform mat4 u_View;
uniform mat4 u_Proj;

out vec3 v_texCoord;

void main(){
    vec3 pos = mat3(u_View) *  a_position;    
    gl_Position =  (u_Proj * vec4(pos ,1)).xyww;
    v_texCoord = a_position;
}