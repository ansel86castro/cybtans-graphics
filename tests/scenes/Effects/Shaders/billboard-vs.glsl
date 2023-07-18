#version 300 es

in vec3 a_position;
in vec2 a_texCoord;

uniform mat4 u_Billboard;
uniform mat4 u_World;
uniform mat4 u_ViewProj;

out vec3 v_positionW;
out vec2 v_texCoord;
out vec4 v_screenCoord;

void main(){
    v_positionW = vec3(u_World * u_Billboard * vec4(a_position, 1));

    gl_Position =  u_ViewProj * vec4(v_positionW ,1) ;

    v_screenCoord.x = (gl_Position.x + gl_Position.w) * 0.5f;
    v_screenCoord.x = (gl_Position.w + gl_Position.y) * 0.5f;
    v_screenCoord.zw = gl_Position.ww;
    v_texCoord = a_texCoord;    
}