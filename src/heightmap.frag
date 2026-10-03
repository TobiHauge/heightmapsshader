uniform sampler2D u_tex0;

uniform vec2 u_resolution;

int checkHeightGroup(int lines, float height) {
    int curGroup = 0;
    float border;
    for (int i = 1; i < lines+1; i++) {
        border = float(i)/float(lines);
        if (height > border) {
            curGroup = i;
        }
    }

    return curGroup;
}

int lines = 10;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    vec4 imageColor = texture2D(u_tex0, uv);
    float height = (imageColor.x + imageColor.y + imageColor.z)/3;
    
    int group = checkHeightGroup(lines, height);
    int neighborGroups = 0;

    vec2 tempCoord;
    vec4 tempColor;
    float tempHeight;

    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (!(i == 1 && j == 1)) {
                tempCoord = vec2(uv.x + float(i-1)/u_resolution.x, uv.y + float(j-1)/u_resolution.y);
                tempColor = texture2D(u_tex0, tempCoord);
                tempHeight = (tempColor.x + tempColor.y + tempColor.z)/3;

                neighborGroups += checkHeightGroup(lines, tempHeight);
            }
        }
    }

    vec4 outColor = vec4(0, 0, 0, 1);

    if (group*8 > neighborGroups) {
    	float lineColor = 1.0;
	    if (float(group) + 3.0 * -floor(float(group)/3.0) == 1.0) {
		    lineColor = 0.5;
	    } else if (float(group) + 3.0 * -floor(float(group)/3.0) == 2.0) {
            lineColor = 0.25;
        }
            outColor = vec4(1, 1, 1, 1)*lineColor;
    }

    gl_FragColor = outColor;
}
