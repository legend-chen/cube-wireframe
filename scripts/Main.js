var resource = Loader.createWithCompleted(onComplete);

resource._request("./shaders/barycentric.vert", "text", function(content) {
    resource._shader_vertex = content;
});

resource._request("./shaders/barycentric.frag", "text", function(content) {
    resource._shader_fragment = content;
});



var program = new Program();


function onComplete() {
    var ScreenWidth = window.innerWidth;
    var ScreenHeight = window.innerHeight;
    var canvas = document.createElement("canvas");
    canvas.width = ScreenWidth * devicePixelRatio;
    canvas.height = ScreenHeight * devicePixelRatio;
    canvas.style.width = ScreenWidth + "px";
    canvas.style.height = ScreenHeight + "px";
    document.body.appendChild(canvas);

    var gl = canvas.getContext("webgl");

    var vbo = gl.createBuffer();
    var s = 1;

    var vertices = [-s, -s, -s,  -s, s, -s,  s, s, -s,  s, -s, -s,  -s, -s, -s, s, s, -s,  s, s, s,  -s, s, s,  -s, -s, s,  s, s, s,  -s, -s, s,  s, -s, s,  -s, s, -s,  -s, s, s,  s, s, s,  s, s, -s, -s, s, -s, 

    s, s, s, s, -s, s,  -s, -s, s, -s, -s, -s, s, -s, s,  -s, -s, -s,  s, -s, -s, -s, -s, -s,  -s, -s, s,  -s, s, s,  -s, s, -s,  -s, -s, -s,  -s, s, s, 
     s, s, s,  s, -s, s,  s, -s, -s,  s, s, s,  s, -s, -s,  s, s, -s];
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    program._quad = {
        _data: vbo,
        _size: 3,
        _count: 36
    };

    var barycentrics = vertices.map(function (v, i)
    {
        if (i % 9 === 0 || i % 9 === 4 || i % 9 === 8)
        {
            return 1.0;
        }
        return 0.0;
    });

    var vbo2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo2);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(barycentrics), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    program._barycentric = {
        _data: vbo2,
        _size: 3,
        _count: 6
    };


    // var ebo = resource._ebo = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, resource._bin.idxs, gl.STATIC_DRAW);
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    // resource._ebo._count = resource._bin.idxs_count;

    program._context = gl;
    program._programs = {};

    gl.getExtension('OES_standard_derivatives');



    program.createProgram("barycentric", resource._shader_vertex, resource._shader_fragment);
    
    program.run(gl);

    var webglprogram = program.useProgram("barycentric");

    gl.uniform1f(webglprogram.uniforms.Alpha, 1);
    gl.uniformMatrix4fv(webglprogram.uniforms.modelMatrix, false, program._camera._model_matrix);


    gl.bindBuffer(gl.ARRAY_BUFFER, program._quad._data);
    gl.vertexAttribPointer(webglprogram.attributes.position, program._quad._size, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(webglprogram.attributes.position);


    gl.bindBuffer(gl.ARRAY_BUFFER, program._barycentric._data);
    gl.vertexAttribPointer(webglprogram.attributes.barycentric, program._barycentric._size, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(webglprogram.attributes.barycentric);
    // gl.flush();

    // gl.enable(gl.DEPTH_TEST);
    // gl.depthFunc(gl.LEQUAL);

    // gl.frontFace(gl.CCW);
    // gl.cullFace(gl.BACK);
    // gl.enable(gl.CULL_FACE);

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);
    gl.clearDepth(1);
    gl.depthMask(false);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

}


(function() {

    var TimeScale = 1;
    var last_timestamp = 0;
    var totalTime = 0;

    function animate(timestamp) {
        var time_elapsed = (timestamp - last_timestamp) || 0;
        last_timestamp = timestamp;

        // time_elapsed = time_elapsed > 200 ? 1000 / 60 : time_elapsed;
        totalTime += time_elapsed;

        // if (program._isInited)
        {
            program.update(time_elapsed);
        }

        requestAnimationFrame(animate);
    }

    animate();
})();
