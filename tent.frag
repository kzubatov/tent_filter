#version 450

layout(contant_id = 0) const int WINDOW_R = 1;

layout(location = 0) out vec4 color;

layout(binding = 0) uniform sampler2D colorTex;

layout(location = 0) in vec2 texCoord;

layout(push_constant) uniform params_t
{
    vec2 offset;
    float k;
    float b;
} params;

// kernel_sum = n * (n * k - b * (n * n - 1) / 2)
// kernel[i, j] = k - b(|x| + |y|)

void tent3x3()
{
    const vec2 kernel_vec = vec2(params.k) - params.b * vec2(1, 2);
    const float kernel_sum = (2 * WINDOW_R + 1) *
        (params.k * kernel_sum - 2 * WINDOW_R * (WINDOW_R + 1) * params.b);

    vec3 sum, tmp_1, tmp_2;

    tmp_2  = textureLod(colorTex, texCoord + params.offset * vec2(-1, -1), 0).rgb;
    tmp_1  = textureLod(colorTex, texCoord + params.offset * vec2( 0, -1), 0).rgb;
    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2( 1, -1), 0).rgb;
    
    tmp_1 += textureLod(colorTex, texCoord + params.offset * vec2(-1, 0), 0).rgb;
    sum    = textureLod(colorTex, texCoord, 0).rgb;
    tmp_1 += textureLod(colorTex, texCoord + params.offset * vec2( 1, 0), 0).rgb;

    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2(-1, 1), 0).rgb;
    tmp_1 += textureLod(colorTex, texCoord + params.offset * vec2( 0, 1), 0).rgb;
    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2( 1, 1), 0).rgb;

    sum = sum * params.k + tmp_1 * kernel_vec.x + tmp_2 * kernel_vec.y;

    color = vec4(sum / kernel_sum, 1.0);
}

void tent5x5()
{
    const vec4 kernel_vec = vec4(params.k) - params.b * vec4(1, 2, 3, 4);
    const float kernel_sum = (2 * WINDOW_R + 1) *
        (params.k * kernel_sum - 2 * WINDOW_R * (WINDOW_R + 1) * params.b);

    vec3 sum, tmp_1, tmp_2, tmp_3, tmp_4;

    tmp_4  = textureLod(colorTex, texCoord + params.offset * vec2(-2, -2), 0).rgb;
    tmp_3  = textureLod(colorTex, texCoord + params.offset * vec2(-1, -2), 0).rgb;
    tmp_2  = textureLod(colorTex, texCoord + params.offset * vec2( 0, -2), 0).rgb;
    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2( 1, -2), 0).rgb;
    tmp_4 += textureLod(colorTex, texCoord + params.offset * vec2( 2, -2), 0).rgb;

    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2(-2, -1), 0).rgb;
    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2(-1, -1), 0).rgb;
    tmp_1  = textureLod(colorTex, texCoord + params.offset * vec2( 0, -1), 0).rgb;
    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2( 1, -1), 0).rgb;
    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2( 2, -1), 0).rgb;

    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2(-2, 0), 0).rgb;
    tmp_1 += textureLod(colorTex, texCoord + params.offset * vec2(-1, 0), 0).rgb;
    sum    = textureLod(colorTex, texCoord, 0).rgb;
    tmp_1 += textureLod(colorTex, texCoord + params.offset * vec2( 1, 0), 0).rgb;
    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2( 2, 0), 0).rgb;

    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2(-2, 1), 0).rgb;
    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2(-1, 1), 0).rgb;
    tmp_1 += textureLod(colorTex, texCoord + params.offset * vec2( 0, 1), 0).rgb;
    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2( 1, 1), 0).rgb;
    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2( 2, 1), 0).rgb;

    tmp_4 += textureLod(colorTex, texCoord + params.offset * vec2(-2, 2), 0).rgb;
    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2(-1, 2), 0).rgb;
    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2( 0, 2), 0).rgb;
    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2( 1, 2), 0).rgb;
    tmp_4 += textureLod(colorTex, texCoord + params.offset * vec2( 2, 2), 0).rgb;

    sum = sum * params.k + tmp_1 * kernel_vec.x + tmp_2 * kernel_vec.y + tmp_3 * kernel_vec.z + tmp_4 * kernel_vec.w;

    color = vec4(sum / kernel_sum, 1.0);
}

void tent7x7()
{
    const vec4 kernel_vec_first = vec4(params.k) - params.b * vec4(1, 2, 3, 4);
    const vec2 kernel_vec_second = vec4(params.k) - params.b * vec4(5, 6);
    const float kernel_sum = (2 * WINDOW_R + 1) *
        (params.k * kernel_sum - 2 * WINDOW_R * (WINDOW_R + 1) * params.b);

    vec3 sum, tmp_1, tmp_2, tmp_3, tmp_4, tmp_5, tmp_6;

    tmp_6  = textureLod(colorTex, texCoord + params.offset * vec2(-3, -3), 0).rgb;
    tmp_5  = textureLod(colorTex, texCoord + params.offset * vec2(-2, -3), 0).rgb;
    tmp_4  = textureLod(colorTex, texCoord + params.offset * vec2(-1, -3), 0).rgb;
    tmp_3  = textureLod(colorTex, texCoord + params.offset * vec2( 0, -3), 0).rgb;
    tmp_4 += textureLod(colorTex, texCoord + params.offset * vec2( 1, -3), 0).rgb;
    tmp_5 += textureLod(colorTex, texCoord + params.offset * vec2( 2, -3), 0).rgb;
    tmp_6 += textureLod(colorTex, texCoord + params.offset * vec2( 3, -3), 0).rgb;

    tmp_5 += textureLod(colorTex, texCoord + params.offset * vec2(-3, -2), 0).rgb;
    tmp_4 += textureLod(colorTex, texCoord + params.offset * vec2(-2, -2), 0).rgb;
    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2(-1, -2), 0).rgb;
    tmp_2  = textureLod(colorTex, texCoord + params.offset * vec2( 0, -2), 0).rgb;
    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2( 1, -2), 0).rgb;
    tmp_4 += textureLod(colorTex, texCoord + params.offset * vec2( 2, -2), 0).rgb;
    tmp_5 += textureLod(colorTex, texCoord + params.offset * vec2( 3, -2), 0).rgb;

    tmp_4 += textureLod(colorTex, texCoord + params.offset * vec2(-3, -1), 0).rgb;
    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2(-2, -1), 0).rgb;
    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2(-1, -1), 0).rgb;
    tmp_1  = textureLod(colorTex, texCoord + params.offset * vec2( 0, -1), 0).rgb;
    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2( 1, -1), 0).rgb;
    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2( 2, -1), 0).rgb;
    tmp_4 += textureLod(colorTex, texCoord + params.offset * vec2( 3, -1), 0).rgb;

    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2(-3, 0), 0).rgb;
    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2(-2, 0), 0).rgb;
    tmp_1 += textureLod(colorTex, texCoord + params.offset * vec2(-1, 0), 0).rgb;
    sum    = textureLod(colorTex, texCoord, 0).rgb;
    tmp_1 += textureLod(colorTex, texCoord + params.offset * vec2( 1, 0), 0).rgb;
    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2( 2, 0), 0).rgb;
    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2( 3, 0), 0).rgb;

    tmp_4 += textureLod(colorTex, texCoord + params.offset * vec2(-3, 1), 0).rgb;
    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2(-2, 1), 0).rgb;
    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2(-1, 1), 0).rgb;
    tmp_1 += textureLod(colorTex, texCoord + params.offset * vec2( 0, 1), 0).rgb;
    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2( 1, 1), 0).rgb;
    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2( 2, 1), 0).rgb;
    tmp_4 += textureLod(colorTex, texCoord + params.offset * vec2( 3, 1), 0).rgb;

    tmp_5 += textureLod(colorTex, texCoord + params.offset * vec2(-3, 2), 0).rgb;
    tmp_4 += textureLod(colorTex, texCoord + params.offset * vec2(-2, 2), 0).rgb;
    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2(-1, 2), 0).rgb;
    tmp_2 += textureLod(colorTex, texCoord + params.offset * vec2( 0, 2), 0).rgb;
    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2( 1, 2), 0).rgb;
    tmp_4 += textureLod(colorTex, texCoord + params.offset * vec2( 2, 2), 0).rgb;
    tmp_5 += textureLod(colorTex, texCoord + params.offset * vec2( 3, 2), 0).rgb;

    tmp_6 += textureLod(colorTex, texCoord + params.offset * vec2(-3, 3), 0).rgb;
    tmp_5 += textureLod(colorTex, texCoord + params.offset * vec2(-2, 3), 0).rgb;
    tmp_4 += textureLod(colorTex, texCoord + params.offset * vec2(-1, 3), 0).rgb;
    tmp_3 += textureLod(colorTex, texCoord + params.offset * vec2( 0, 3), 0).rgb;
    tmp_4 += textureLod(colorTex, texCoord + params.offset * vec2( 1, 3), 0).rgb;
    tmp_5 += textureLod(colorTex, texCoord + params.offset * vec2( 2, 3), 0).rgb;
    tmp_6 += textureLod(colorTex, texCoord + params.offset * vec2( 3, 3), 0).rgb;

    sum = sum * params.k + tmp_1 * kernel_vec_first.x + tmp_2 * kernel_vec_first.y
        + tmp_3 * kernel_vec_first.z + tmp_4 * kernel_vec_first.w
        + tmp_5 * kernel_vec_second.x + tmp_6 * kernel_vec_second.y;

    color = vec4(sum / kernel_sum, 1.0);
}

void main()
{
    if (WINDOW_R == 1)
        tent3x3();
    else if (WINDOW_R == 2)
        tent5x5();
    else if (WINDOW_R == 3)
        tent7x7();
}