precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
attribute vec3 position;

void main()	{
	vec3 positionEye = (modelViewMatrix * vec4(position, 1.0)).xyz;
	gl_Position = projectionMatrix * vec4(positionEye, 1.0);
}