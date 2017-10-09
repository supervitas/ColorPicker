precision highp float;

uniform vec3 pickingColor;

void main()	{	
	gl_FragColor = vec4(pickingColor, 1.0);
}