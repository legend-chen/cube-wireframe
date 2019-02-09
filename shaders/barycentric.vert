precision highp float;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

attribute vec3 position;
attribute vec3 barycentric;

varying vec3 v_barycentric;

void main() 
{ 
	v_barycentric = barycentric;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1);
    
}