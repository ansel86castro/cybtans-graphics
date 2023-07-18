#version 300 es
precision mediump float;

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

in vec3 v_positionW;
in vec3 v_normalW;
in vec3 v_tangentW;
in vec3 v_binormalW;
in vec2 v_texCoord;
in float v_occ;

uniform Light uLight;
uniform vec3 uAmbient;
uniform vec3 uEyePos;
uniform Material uMaterial;
uniform vec3 uAtmosphere;

uniform sampler2D uDiffuseSampler;
uniform sampler2D uCloudSampler;

out vec4 Color;

vec4 lit(float NdotL, float NdotH, float m){

  float ambient = 1.0;
  float diffuse = max(NdotL, 0.0);
  float specular = step(0.0, NdotL) * max(NdotH, 0.0);
  specular = pow(specular, m);
  return vec4(ambient, diffuse, specular, 1.0);
}

vec3 DirectionalLight(vec3 normal, vec3 diffuse, vec3 specular, float specularPower)
{
	vec3 toEye = normalize(uEyePos - v_positionW);	
    vec3 lightDir = -uLight.dir;

    float nDotL = dot(normal, lightDir);
    vec3 reflection = (2.0 * normal * nDotL) - lightDir;
    float rDotV = dot(reflection, toEye);

	vec4 l = lit(nDotL, rDotV , specularPower);	
	
	//add diffuse contribution
	vec3 color = (diffuse * uLight.diffuse) * l.y + (specular * uLight.specular) * l.z;   

     // Add atmosphere
    float atmosphereRatio = 1.0 - clamp( dot(toEye, normal) ,0.0, 1.0);
    color.rgb += 0.30 * uAtmosphere * pow(atmosphereRatio, 2.0);

    return color;
}


vec3 PointLight(vec3 normal, vec3 diffuse, vec3 specular, float specularPower)
{
    vec3 toEye = normalize(uEyePos - v_positionW);	
    vec3 lightDir = uLight.pos - v_positionW;
	// The distance from Surface to Light.
	float d = length(lightDir);

	if( d > uLight.range ) 
        return vec3(0.0f, 0.0f, 0.0f);
	
    // Normalize the Light vector.
	lightDir /= d;	

    float nDotL = dot(normal, lightDir);
    vec3 reflection = (2.0 * normal * nDotL) - lightDir;
    float rDotV = dot(reflection, toEye);

	vec4 l = lit(nDotL, rDotV , specularPower);	
	
	vec3 color = (diffuse * uLight.diffuse) * l.y + (specular * uLight.specular) * l.z;
	color /=  dot(uLight.att, vec3(1.0f, d, d*d));

      // Add atmosphere
    float atmosphereRatio = 1.0 - clamp( dot(toEye, normal) ,0.0, 1.0);
    color.rgb += 0.30 * uAtmosphere * pow(atmosphereRatio, 2.0);
    
    return color;
}

void main() 
{   
    vec4 diffuse  = texture(uDiffuseSampler, v_texCoord);
    diffuse *= uMaterial.diffuse;

    diffuse.rgb += texture(uCloudSampler, v_texCoord).rgb * 0.8;

    vec3 specular = 0.5 * uMaterial.specular;

    Color.rgb += uLight.type == 1.0f? 
            DirectionalLight(v_normalW, diffuse.rgb, specular, uMaterial.specularPower): 
            PointLight(v_normalW, diffuse.rgb, specular, uMaterial.specularPower);

    Color.a = diffuse.a;
}
