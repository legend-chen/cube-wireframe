var Program = (function (){

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    var frustumSize = 600;

    function Program () 
    {
        var _this = this;

        _this.screenWidth = SCREEN_WIDTH;
        _this.screenHeight = SCREEN_HEIGHT;

        _this._needUpdate = false;

        _this._captured = false;
        _this._camera = new Camera3D(this);
        _this._begin_pointer = new Vector3();
        _this._pointer = new Vector3();

        _this.onMouseDown = _this.onMouseDown.bind(_this);
        _this.onMouseMove = _this.onMouseMove.bind(_this);
        _this.onMouseUp   = _this.onMouseUp.bind(_this);
        _this.onWheel     = _this.onWheel.bind(_this);

        _this._begin_wheel = 0;
        _this._current_wheel = 0;
    }

    var __proto__ = Program.prototype;



function createShader(gl, source, type)
{
    var _this = this;

    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        return shader;
    }
    else
    {
        console.warn(gl.getShaderInfoLog(shader));
    }
}

function createProgram(gl, vs, fs)
{
    var program = gl.createProgram();

    gl.attachShader(program, vs);
    
    gl.attachShader(program, fs); 
    
    gl.linkProgram(program);


    if (gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        gl.useProgram(program);

        return program;
    }
    else
    {
        alert(gl.getProgramInfoLog(program));
    }
}

function bindProgramParameters(gl, program, target) 
{
    var i, attrib, uniform, count, name;

    target.attributes = {};
    target.uniforms = {};

    count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (i = 0; i < count; i++) {
        attrib = gl.getActiveAttrib(program, i);
        target.attributes[attrib.name] = gl.getAttribLocation(program, attrib.name);
    }

    count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (i = 0; i < count; i++) {
        uniform = gl.getActiveUniform(program, i);
        // name = uniform.name.replace("[0]", "");
        target.uniforms[uniform.name] = gl.getUniformLocation(program, uniform.name);
    }
}


    __proto__.createProgram = function (name, vertexSource, fragmentSource)
    {
        var _this = this;
        var gl = _this._context;

        var vs = createShader(gl, vertexSource, gl.VERTEX_SHADER);
        var fs = createShader(gl, fragmentSource, gl.FRAGMENT_SHADER)
        var program = createProgram(gl, vs, fs);
        bindProgramParameters(gl, program, program);
        _this._programs[name] = program;
    }

    __proto__.useProgram = function (name)
    {
        var _this = this;
        var gl = _this._context;

        var result = _this._programs[name];
        gl.useProgram(result);

        return result;
    }

    __proto__.run = function (context)
    {
        var _this = this;
        _this._container = context.canvas;
        _this._context = context;

        document.addEventListener("mousedown", _this.onMouseDown);
        document.addEventListener("mousemove", _this.onMouseMove);
        document.addEventListener("mouseup", _this.onMouseUp);
        document.addEventListener("wheel", _this.onWheel);

        _this._needUpdate = true;
    }

    __proto__._getMouseCoords = function (event)
    {
        var _this = this;
        var viewport = _this._viewport
        var x = event.pageX - viewport._x;
        var y = event.pageY - viewport._y;
        
        var pointer = _this._mouse_position;
        pointer.x = x / viewport._w * 2 - 1;
        pointer.y = 1 - y / viewport._h * 2;
        return pointer;
    }

    __proto__._getPointerCoords = function (event)
    {
        var _this = this;

        var x = event.pageX
        var y = event.pageY

        if (null != event.touches)
        {
            x = event.touches[0].pageX;
            y = event.touches[0].pageY;
        };

        var bounding = _this._container.getBoundingClientRect();
        var offsetY = bounding.top + window.pageYOffset + document.documentElement.clientTop;
        var offsetX = bounding.left + window.pageXOffset + document.documentElement.clientLeft;
        _this._pointer.x = x * window.devicePixelRatio - offsetX;
        _this._pointer.y = y * window.devicePixelRatio - offsetY;

        return _this._pointer;
    }

    var movement = new Vector3();

    __proto__.update = function (time_elapsed)
    {
        var _this = this;

        if (_this._needUpdate)
        {
            var camera  = _this._camera;
            var delta = _this._begin_wheel - _this._current_wheel;
            
            movement.x  = (_this._begin_pointer.x - _this._pointer.x);
            movement.y  = (_this._begin_pointer.y - _this._pointer.y);


            var isCameraUpdated = false;

            if (Math.abs(delta) > 0.001)
            {
                camera.radius += delta * 0.01;
                _this._begin_wheel -= delta * 0.5;

                isCameraUpdated = true;
            }

            if (Math.abs(movement.x) > 0.001 ||
                Math.abs(movement.y) > 0.001)
            {
                camera.rotationX += movement.x * 0.005 
                camera.rotationY += movement.y * 0.005
                
                _this._begin_pointer.x -= movement.x * 0.1;
                _this._begin_pointer.y -= movement.y * 0.1;

                isCameraUpdated = true;
            }

            if (isCameraUpdated)
            {
                camera.composeCameraMatrix();
            }
            else
            {
                _this._needUpdate = false;
            }

            _this.render();

            
        }
    }

    __proto__.onMouseDown = function (event)
    {
        var _this = this;

        var pointer = _this._getPointerCoords(event);
        _this._begin_pointer.x = pointer.x;
        _this._begin_pointer.y = pointer.y;
        _this._captured = true;
    }

    __proto__.onMouseMove = function ()
    {
        var _this = this;

        event.preventDefault();

        if (_this._captured)
        {
            var pointer = _this._getPointerCoords(event);
            _this._needUpdate = true;
        }
    }

    __proto__.onMouseUp = function ()
    {
        var _this = this;

        var pointer = _this._getPointerCoords(event);

        _this._captured = false;
    }

    __proto__.onWheel = function (event)
    {
        var _this = this;

        var delta  = event.wheelDelta;
        // var deltaX = event.wheelDeltaX;
        // var deltaY = event.wheelDeltaY;

        _this._current_wheel += delta * 0.1;
        _this._needUpdate = true;

        event.preventDefault();
    }

    __proto__.render = function ()
    {
        var _this = this;

        
        var gl = _this._context

        var camera = _this._camera;


        var program = _this.useProgram("barycentric")
        
        camera._normal_matrix.NormalFromMatrix4(camera._rotation_matrix);
        gl.uniformMatrix3fv(program.uniforms.normalMatrix, false, camera._normal_matrix);
        gl.uniformMatrix4fv(program.uniforms.projectionMatrix, false, camera._perspective_matrix); 
        gl.uniformMatrix4fv(program.uniforms.viewMatrix, false, camera._rotation_matrix); 

        

        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // gl.bindTexture(gl.TEXTURE_2D, null);
        
        
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, resource._ebo);
        // gl.bindBuffer(gl.ARRAY_BUFFER, resource._vbo);
        gl.bindBuffer(gl.ARRAY_BUFFER, _this._quad._data);
        gl.vertexAttribPointer(program.attributes.position, _this._quad._size, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(program.attributes.position);


        gl.bindBuffer(gl.ARRAY_BUFFER, _this._barycentric._data);
        gl.vertexAttribPointer(program.attributes.barycentric, _this._barycentric._size, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(program.attributes.barycentric);

        gl.drawArrays(gl.TRIANGLES, 0, _this._quad._count);
        //gl.flush();
        //gl.drawElements(gl.TRIANGLES, resource._ebo._count, gl.UNSIGNED_SHORT, 0);
    }

    return Program;
})();