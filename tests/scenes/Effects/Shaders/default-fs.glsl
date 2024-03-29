#version 300 es
precision mediump float;

in vec3 v_positionW;
in vec3 v_normalW;
in vec2 v_texCoord;
in float v_occ;

struct Hemispherical {
    vec3 skyColor;
    vec3 groundColor;
    vec3 northPole;
};

struct Light {
    vec3 pos;
    vec3 dir;
    vec3 diffuse;
    vec3 specular;
    vec3 att;
    float range;
    float spotPower;
    float type;
};

struct Material {
    vec4 diffuse;
    vec3 specular;
    float specularPower;
};

uniform Light uLight;
uniform Hemispherical uHemisphereLight;
uniform vec3 uAmbient;
uniform vec3 uEyePos;
uniform Material uMaterial;

uniform sampler2D uDiffuseSampler;

out vec4 Color;

vec4 lit(float NdotL, float NdotH, float m){

  float ambient = 1.0;
  float diffuse = max(NdotL, 0.0);
  float specular = step(0.0, NdotL) * max(NdotH, 0.0);
  specular = pow(specular, m);
  return vec4(ambient, diffuse, specular, 1.0);
}


vec3 ComputeHemisphere()
{
	float k = 0.5f + 0.5f * dot(v_normalW, uHemisphereLight.northPole);
	return mix(uHemisphereLight.groundColor ,uHemisphereLight.skyColor , k) * ( v_occ);	
}


vec3 DirectionalLight(vec3 diffuse, vec3 specular, float specularPower)
{
	vec3 toEye = normalize(uEyePos - v_positionW);	
    vec3 lightDir = -uLight.dir;

    float nDotL = dot(v_normalW, lightDir);
    vec3 reflection = (2.0 * v_normalW * nDotL) - lightDir;
    float rDotV = dot(reflection, toEye);

	//vec3 h = normalize(lightDir + toEye);
    //float nDotH = dot(v_normalW, h);

	vec4 l = lit(nDotL, rDotV , specularPower);	
	
	//add diffuse contribution
	vec3 color = (diffuse * uLight.diffuse) * l.y + (specular * uLight.specular) * l.z;
	
    return color;
}

vec3 PointLight(vec3 diffuse, vec3 specular, float specularPower)
{
    vec3 toEye = normalize(uEyePos - v_positionW);	
    vec3 lightDir = uLight.pos - v_positionW;
	// The distance from Surface to Light.
	float d = length(lightDir);

	if( d > uLight.range ) 
        return vec3(0.0f, 0.0f, 0.0f);
	
    // Normalize the Light vector.
	lightDir /= d;	

    float nDotL = dot(v_normalW, lightDir);
    vec3 reflection = (2.0 * v_normalW * nDotL) - lightDir;
    float rDotV = dot(reflection, toEye);

	vec4 l = lit(nDotL, rDotV , specularPower);	
	
	vec3 color = (diffuse * uLight.diffuse) * l.y + (specular * uLight.specular) * l.z;
	color /=  dot(uLight.att, vec3(1.0f, d, d*d));
    return color;
}



void main() 
{
    vec4 diffuse  = texture(uDiffuseSampler, v_texCoord);
    diffuse *= uMaterial.diffuse;

    Color = diffuse;
    Color.rgb *= ComputeHemisphere();
    Color.rgb += uLight.type == 1.0f? 
                DirectionalLight(diffuse.rgb, uMaterial.specular, uMaterial.specularPower): 
                PointLight(diffuse.rgb, uMaterial.specular, uMaterial.specularPower);
}