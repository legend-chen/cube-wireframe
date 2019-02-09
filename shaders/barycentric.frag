#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
	precision mediump float;
#endif


varying vec3 v_barycentric;

float edgeFactor()
{
	vec3 d = fwidth(v_barycentric);
	vec3 a3 = smoothstep(vec3(0.0), d * 1.5, v_barycentric);
	return min(min(a3.x, a3.y), a3.z);
}

void main() 
{
	gl_FragColor.rgb = mix(vec3(0.0), vec3(1.0), edgeFactor());
	gl_FragColor.a = 1.0;

	// alpha by edge
    if(gl_FrontFacing)
    {
        gl_FragColor = vec4(0.0, 0.0, 0.0, (1.0-edgeFactor())*1.0);
    }
    else
    {
        gl_FragColor = vec4(0.0, 0.0, 0.0, (1.0-edgeFactor())*0.5);
    }

    /*if(any(lessThan(v_barycentric, vec3(0.02))))
    {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
    else
    {
        gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
    }*/
}