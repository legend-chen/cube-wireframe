




var Camera3D = (function(){

    function Camera3D (stage)
    {
        var _this = this;

        _this._perspective_matrix = Matrix4.create();
        
        _this._perspective_matrix.perspective(60, stage.screenWidth/stage.screenHeight, 0.01, 1000.0)

        _this._rotation_matrix = Matrix4.create();

        _this._model_matrix = Matrix4.create();

        // _this._model_matrix._scale(2);
        //_this._model_matrix._translate(-6.7307610511779785, -9.678930282592773, -0.32486700266599655);

        _this._projection_matrix = Matrix4.create();
        _this._projection_matrix_inv = Matrix4.create();
        _this._normal_matrix = Matrix3.create();

        _this.radius  = 5;
        _this.rotationY = 0;
		_this.rotationX = 0;

        _this.composeCameraMatrix();
    }
    
    var __proto__  = Camera3D.prototype;

    __proto__.composeCameraMatrix = function ()
    {
        var _this = this;

        var matrix = _this._rotation_matrix;

    	var cosx = Math.cos(_this.rotationX);
		var sinx = Math.sin(_this.rotationX);
		var cosy = Math.cos(_this.rotationY);
		var siny = Math.sin(_this.rotationY);

        var x = _this.radius * sinx * cosy
        var y = _this.radius * siny 
        var z = _this.radius * cosx * cosy

        var rotateY = Math.abs(_this.rotationY) % (Math.PI * 2)
        var sign = rotateY > 0.5 * Math.PI && rotateY < 1.5 * Math.PI ? -1 : 1;

        var eye = new Vector3(x, y, z);

        _this.x = x;
        _this.y = y;
        _this.z = z;

    
        var a = -sinx * cosy, b = -siny, c = -cosx * cosy;
        var A = 0, B = -sign, C = 0;

        var d = b * C - B * c, e = c * A - a * C, f = a * B - b * A;

        var g = Math.sqrt(d * d + e * e + f * f);
        if (g != 0 ) g = 1 / g
        A = d * g;
        B = e * g;
        C = f * g;

        d = b * C - B * c;
        e = c * A - a * C;
        f = a * B - b * A;

        g = Math.sqrt(d * d + e * e + f * f);
        if (g != 0 ) g = 1 / g

        d *= g;
        e *= g;
        f *= g;

        matrix[x00] = A;
        matrix[x01] = B;
        matrix[x02] = C;
        
        matrix[x10] = d;
        matrix[x11] = e;
        matrix[x12] = f;

        matrix[x20] = a;
        matrix[x21] = b;
        matrix[x22] = c;

        matrix[x03] = - _this.radius * (a * A + b * B + c * C);
        matrix[x13] = - _this.radius * (a * d + b * e + c * f);
        matrix[x23] = - _this.radius * (1);

        matrix[x30] = 0;
        matrix[x31] = 0;
        matrix[x32] = 0;
        matrix[x33] = 1;

        _this._projection_matrix.multiplyFrom(_this._perspective_matrix, _this._rotation_matrix);
    }

    return Camera3D;	
})();