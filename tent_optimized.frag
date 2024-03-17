#version 450

layout(constant_id = 0) const int WINDOW_R = 1;

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
    const bvec2 isOdd = bvec2(ivec2(gl_FragCoord.xy) & 1);
    const vec2 t = vec2(isOdd) * -2.0 + 1.0;

    const vec2 kernel_vec = vec2(params.k) - params.b * vec2(1, 2);
    const float kernel_sum = (2 * WINDOW_R + 1) *
        (params.k * (2 * WINDOW_R + 1) - 2 * WINDOW_R * (WINDOW_R + 1) * params.b);

    vec3 row_0, row_2, row_0_basis, row_2_basis;
    vec3 texel_0, texel_1;

    texel_0 = textureLod(colorTex, texCoord + params.offset * vec2(-1, -1), 0).rgb;
    texel_1 = textureLod(colorTex, texCoord + params.offset * vec2( 1, -1), 0).rgb;
    row_0_basis = texel_0 + texel_1;
    texel_0 = isOdd.x ? texel_0 : texel_1;
    texel_0 += dFdxFine(texel_0) * t.x;
    row_0 = row_0_basis * kernel_vec.y + texel_0 * kernel_vec.x;
    row_0_basis = (row_0_basis + texel_0) * params.b;

    texel_0 = textureLod(colorTex, texCoord + params.offset * vec2(-1, 1), 0).rgb;
    texel_1 = textureLod(colorTex, texCoord + params.offset * vec2( 1, 1), 0).rgb;
    row_2_basis = texel_0 + texel_1;
    texel_0 = isOdd.x ? texel_0 : texel_1;
    texel_0 += dFdxFine(texel_0) * t.x;
    row_2 = row_2_basis * kernel_vec.y + texel_0 * kernel_vec.x;
    row_2_basis = (row_2_basis + texel_0) * params.b;

    texel_0 = isOdd.y ? (row_0 + row_0_basis) : (row_2 + row_2_basis);
    texel_0 += dFdyFine(texel_0) * t.y;
    
    row_0 += texel_0 + row_2;

    color = vec4(row_0 / kernel_sum, 1.0);
}

void tent5x5()
{
    const bvec2 isOdd = bvec2(ivec2(gl_FragCoord.xy) & 1);
    const vec2 t = vec2(isOdd) * -2.0 + 1.0;

    const vec4 kernel_vec = vec4(params.k) - params.b * vec4(1, 2, 3, 4);
    const float kernel_sum = (2 * WINDOW_R + 1) *
        (params.k * (2 * WINDOW_R + 1) - 2 * WINDOW_R * (WINDOW_R + 1) * params.b);

    vec3 row_0, row_2, row_4, row_0_basis, row_2_basis, row_4_basis;
    vec3 texel_0, texel_1, texel_2;

    texel_0 = textureLod(colorTex, texCoord + params.offset * vec2(-2, -2), 0).rgb;
    texel_1 = textureLod(colorTex, texCoord + params.offset * vec2( 0, -2), 0).rgb;
    texel_2 = textureLod(colorTex, texCoord + params.offset * vec2( 2, -2), 0).rgb;
    row_0_basis = texel_0 + texel_1 + texel_2;
    row_0 = (texel_0 + texel_2) * kernel_vec.w + texel_1 * kernel_vec.y;
    texel_0 = isOdd.x ? texel_0 + texel_1 : texel_1 + texel_2;
    texel_0 += dFdxFine(texel_0) * t.x;
    row_0 += texel_0 * kernel_vec.z;
    row_0_basis = (row_0_basis + texel_0) * params.b;

    texel_0 = textureLod(colorTex, texCoord + params.offset * vec2(-2, 0), 0).rgb;
    texel_1 = textureLod(colorTex, texCoord, 0).rgb;
    texel_2 = textureLod(colorTex, texCoord + params.offset * vec2( 2, 0), 0).rgb;
    row_2_basis = texel_0 + texel_1 + texel_2;
    row_2 = (texel_0 + texel_2) * kernel_vec.y + texel_1 * params.k;
    texel_0 = isOdd.x ? texel_0 + texel_1 : texel_1 + texel_2;
    texel_0 += dFdxFine(texel_0) * t.x;
    row_2 += texel_0 * kernel_vec.x;
    row_2_basis = (row_2_basis + texel_0) * params.b;

    texel_0 = textureLod(colorTex, texCoord + params.offset * vec2(-2, 2), 0).rgb;
    texel_1 = textureLod(colorTex, texCoord + params.offset * vec2( 0, 2), 0).rgb;
    texel_2 = textureLod(colorTex, texCoord + params.offset * vec2( 2, 2), 0).rgb;
    row_4_basis = texel_0 + texel_1 + texel_2;
    row_4 = (texel_0 + texel_2) * kernel_vec.w + texel_1 * kernel_vec.y;
    texel_0 = isOdd.x ? texel_0 + texel_1 : texel_1 + texel_2;
    texel_0 += dFdxFine(texel_0) * t.x;
    row_4 += texel_0 * kernel_vec.z;
    row_4_basis = (row_4_basis + texel_0) * params.b;
    
    texel_0 = row_2 - row_2_basis + (isOdd.y ? row_0 + row_0_basis : row_4 + row_4_basis);
    texel_0 += dFdyFine(texel_0) * t.y;
    texel_0 += row_0 + row_2 + row_4;

    color = vec4(texel_0 / kernel_sum, 1.0);
}

void tent7x7()
{
    const bvec2 isOdd = bvec2(ivec2(gl_FragCoord.xy) & 1);
    const vec2 t = vec2(isOdd) * -2.0 + 1.0;

    const vec4 kernel_vec_first = vec4(params.k) - params.b * vec4(1, 2, 3, 4);
    const vec2 kernel_vec_second = vec2(params.k) - params.b * vec2(5, 6);
    const float kernel_sum = (2 * WINDOW_R + 1) *
        (params.k * (2 * WINDOW_R + 1) - 2 * WINDOW_R * (WINDOW_R + 1) * params.b);

    vec3 row_0, row_2, row_4, row_6, row_0_basis, row_2_basis, row_4_basis, row_6_basis;
    vec3 texel_0, texel_1, texel_2, texel_3;

    texel_0 = textureLod(colorTex, texCoord + params.offset * vec2(-3, -3), 0).rgb;
    texel_1 = textureLod(colorTex, texCoord + params.offset * vec2(-1, -3), 0).rgb;
    texel_2 = textureLod(colorTex, texCoord + params.offset * vec2( 1, -3), 0).rgb;
    texel_3 = textureLod(colorTex, texCoord + params.offset * vec2( 3, -3), 0).rgb;
    row_0 = (isOdd.x ? texel_0 + texel_2 : texel_1 + texel_3) * kernel_vec_second.x 
        + (isOdd.x ? texel_1 : texel_2) * kernel_vec_first.z;
    row_0_basis = texel_1 + texel_2 + (isOdd.x ? texel_0 : texel_3);
    row_0 += dFdxFine(row_0) * t.x;
    row_0_basis += dFdxFine(row_0_basis) * t.x;
    row_0 += (texel_0 + texel_3) * kernel_vec_second.y + (texel_1 + texel_2) * kernel_vec_first.w;
    row_0_basis = (row_0_basis + texel_0 + texel_1 + texel_2 + texel_3) * params.b;

    texel_0 = textureLod(colorTex, texCoord + params.offset * vec2(-3, -1), 0).rgb;
    texel_1 = textureLod(colorTex, texCoord + params.offset * vec2(-1, -1), 0).rgb;
    texel_2 = textureLod(colorTex, texCoord + params.offset * vec2( 1, -1), 0).rgb;
    texel_3 = textureLod(colorTex, texCoord + params.offset * vec2( 3, -1), 0).rgb;
    row_2 = (isOdd.x ? texel_0 + texel_2 : texel_1 + texel_3) * kernel_vec_first.z 
        + (isOdd.x ? texel_1 : texel_2) * kernel_vec_first.x;
    row_2_basis = texel_1 + texel_2 + (isOdd.x ? texel_0 : texel_3);
    row_2 += dFdxFine(row_2) * t.x;
    row_2_basis += dFdxFine(row_2_basis) * t.x;
    row_2 += (texel_0 + texel_3) * kernel_vec_first.w + (texel_1 + texel_2) * kernel_vec_first.y;
    row_2_basis = (row_2_basis + texel_0 + texel_1 + texel_2 + texel_3) * params.b;

    texel_0 = textureLod(colorTex, texCoord + params.offset * vec2(-3, 1), 0).rgb;
    texel_1 = textureLod(colorTex, texCoord + params.offset * vec2(-1, 1), 0).rgb;
    texel_2 = textureLod(colorTex, texCoord + params.offset * vec2( 1, 1), 0).rgb;
    texel_3 = textureLod(colorTex, texCoord + params.offset * vec2( 3, 1), 0).rgb;
    row_4 = (isOdd.x ? texel_0 + texel_2 : texel_1 + texel_3) * kernel_vec_first.z 
        + (isOdd.x ? texel_1 : texel_2) * kernel_vec_first.x;
    row_4_basis = texel_1 + texel_2 + (isOdd.x ? texel_0 : texel_3);
    row_4 += dFdxFine(row_4) * t.x;
    row_4_basis += dFdxFine(row_4_basis) * t.x;
    row_4 += (texel_0 + texel_3) * kernel_vec_first.w + (texel_1 + texel_2) * kernel_vec_first.y;
    row_4_basis = (row_4_basis + texel_0 + texel_1 + texel_2 + texel_3) * params.b;

    texel_0 = textureLod(colorTex, texCoord + params.offset * vec2(-3, 3), 0).rgb;
    texel_1 = textureLod(colorTex, texCoord + params.offset * vec2(-1, 3), 0).rgb;
    texel_2 = textureLod(colorTex, texCoord + params.offset * vec2( 1, 3), 0).rgb;
    texel_3 = textureLod(colorTex, texCoord + params.offset * vec2( 3, 3), 0).rgb;
    row_6 = (isOdd.x ? texel_0 + texel_2 : texel_1 + texel_3) * kernel_vec_second.x 
        + (isOdd.x ? texel_1 : texel_2) * kernel_vec_first.z;
    row_6_basis = texel_1 + texel_2 + (isOdd.x ? texel_0 : texel_3);
    row_6 += dFdxFine(row_6) * t.x;
    row_6_basis += dFdxFine(row_6_basis) * t.x;
    row_6 += (texel_0 + texel_3) * kernel_vec_second.y + (texel_1 + texel_2) * kernel_vec_first.w;
    row_6_basis = (row_6_basis + texel_0 + texel_1 + texel_2 + texel_3) * params.b;

    texel_0 = row_2 + row_4 + t.y * (row_4_basis - row_2_basis);
    texel_0 += isOdd.y ? row_0 + row_0_basis : row_6 + row_6_basis; 
    texel_0 += dFdyFine(texel_0) * t.y;
    texel_0 += row_0 + row_2 + row_4 + row_6;

    color = vec4(texel_0 / kernel_sum, 1.0);
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