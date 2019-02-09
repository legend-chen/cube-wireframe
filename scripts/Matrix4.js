var Vector3 = function (){

    function Vector3(a, b, c){
        var _this = this;
            _this.x = a || 0;
            _this.y = b || 0;
            _this.z = c || 0;
    }

    var __proto__ = Vector3.prototype;

    __proto__.from = function (vector)
    {
        var _this = this;
        _this.x = vector.x;
        _this.y = vector.y;
        _this.z = vector.z;
        return _this;
    }

    __proto__.normalize = function ()
    {
        var _this = this;
        var x = _this.x;
        var y = _this.y;
        var z = _this.z;

        var g = Math.sqrt(x * x + y * y + z * z);
        if (g != 0 ) g = 1 / g

        _this.x *= g;
        _this.y *= g;
        _this.z *= g;

        return _this;
    }

    __proto__.toString = function ()
    {
        var _this = this;
        return "(" + _this.x + ", " + _this.y + ", " + _this.z + ")";
    }

    return Vector3;
}();

function trace()
{
    console.log.apply(null, arguments);
}


function number_format (text)
{
    var index = 1;
    var args = arguments;
    return text.replace(/%n/g, function()
    {
        var i = index++;
        var str = args[i]!=undefined ? args[i].toString() : "";
        if (str == undefined) return "";
        if (str.length > 12) str = (str.indexOf("e") > 0 ? str.substr(0, 4) + "?" + str.substr(-7, 7) :str.substr(0, 11) + "?");
        return ("            " + str).substr(-12, 12);
    });
}

var x00 = 0, x01 = 4, x02 =  8, x03 = 12;
var x10 = 1, x11 = 5, x12 =  9, x13 = 13;
var x20 = 2, x21 = 6, x22 = 10, x23 = 14;
var x30 = 3, x31 = 7, x32 = 11, x33 = 15;


var Matrix3 = (function(){
    
    function Matrix3(){}

    var __proto__ = Matrix3.prototype;
    var __class__ = Matrix3;
    __class__.prototype.__proto__ = Float32Array.prototype;

    __class__.create = function ()
    {
        var _this = new Float32Array(9);
        _this[x00] = 1;
        _this[x11] = 1;
        _this[x22] = 1;
        _this.__proto__ = Matrix3.prototype;
        return _this;
    }

    __proto__.NormalFromMatrix4 = function(matrix)
    {
        var _this = this;
        var a = matrix[x00],  b = matrix[x01],  c = matrix[x02],  d = matrix[x03],
            e = matrix[x10],  f = matrix[x11],  g = matrix[x12],  h = matrix[x13],
            i = matrix[x20],  j = matrix[x21],  k = matrix[x22],  l = matrix[x23],
            m = matrix[x30],  n = matrix[x31],  o = matrix[x32],  p = matrix[x33],
            q = a * f - b * e, r = a * g - c * e,
            s = a * h - d * e, t = b * g - c * f,
            u = b * h - d * f, v = c * h - d * g,
            w = i * n - j * m, x = i * o - k * m,
            y = i * p - l * m, z = j * o - k * n,
            A = j * p - l * n, B = k * p - l * o,
            ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);

        _this[0] = ( f * B - g * A + h * z) * ivd;
        _this[1] = (-b * B + c * A - d * z) * ivd;
        _this[2] = ( n * v - o * u + p * t) * ivd;
        // _this[x30] = (-j * v + k * u - l * t) * ivd;

        _this[3] = (-e * B + g * y - h * x) * ivd;
        _this[4] = ( a * B - c * y + d * x) * ivd;
        _this[5] = (-m * v + o * s - p * r) * ivd;
        // _this[x31] = ( i * v - k * s + l * r) * ivd;

        _this[6] = ( e * A - f * y + h * w) * ivd;
        _this[7] = (-a * A + b * y - d * w) * ivd;
        _this[8] = ( m * u - n * s + p * q) * ivd;
        // _this[x32] = (-i * u + j * s - l * q) * ivd;

        // _this[x03] = (-e * z + f * x - g * w) * ivd;
        // _this[x13] = ( a * z - b * x + c * w) * ivd;
        // _this[x23] = (-m * t + n * r - o * q) * ivd;
        // _this[x33] = ( i * t - j * r + k * q) * ivd;
        return _this;
    };

    __proto__.log = function ()
    {
        var _this = this;
        console.log(number_format("{%n,%n,%n,\n %n,%n,%n,\n %n,%n,%n}",
            _this[0], _this[3], _this[6], 
            _this[1], _this[4], _this[7],
            _this[2], _this[5], _this[8]));
    }
    
    return Matrix3;
})();

var Matrix4 = (function(){

    function Matrix4(){}
    
    var __proto__ = Matrix4.prototype;
    var __class__ = Matrix4;
    __class__.prototype.__proto__ = Float32Array.prototype;

    __class__.create = function ()
    {
        var _this = new Float32Array(16);
        _this[x00] = 1;
        _this[x11] = 1;
        _this[x22] = 1;
        _this[x33] = 1;
        _this.__proto__ = Matrix4.prototype;
        return _this;
    }

    __proto__.identify = function ()
    {
        var _this = this;

        _this[x00] = 1;
        _this[x01] = 0;
        _this[x02] = 0;
        _this[x03] = 0;
        _this[x10] = 0;
        _this[x11] = 1;
        _this[x12] = 0;
        _this[x13] = 0;
        _this[x20] = 0;
        _this[x21] = 0;
        _this[x22] = 1;
        _this[x23] = 0;
        _this[x30] = 0;
        _this[x31] = 0;
        _this[x32] = 0;
        _this[x33] = 1;

        return _this;
    }


    __class__.trace = function (matrix)
    {
        console.log(number_format("{%n,%n,%n,%n,\n %n,%n,%n,%n,\n %n,%n,%n,%n,\n %n,%n,%n,%n}",
            matrix[x00], matrix[x01], matrix[x02], matrix[x03],
            matrix[x10], matrix[x11], matrix[x12], matrix[x13],
            matrix[x20], matrix[x21], matrix[x22], matrix[x23],
            matrix[x30], matrix[x31], matrix[x32], matrix[x33]));
    }

    __proto__.log = function ()
    {
        var _this = this;
        console.log(number_format("{%n,%n,%n,%n,\n %n,%n,%n,%n,\n %n,%n,%n,%n,\n %n,%n,%n,%n}",
            _this[x00], _this[x01], _this[x02], _this[x03],
            _this[x10], _this[x11], _this[x12], _this[x13],
            _this[x20], _this[x21], _this[x22], _this[x23],
            _this[x30], _this[x31], _this[x32], _this[x33]));
    }

    __proto__.toArray = function (array, offset)
    {
        var _this = this;
        array[ 0 + offset] = _this[0];
        array[ 1 + offset] = _this[1];
        array[ 2 + offset] = _this[2];
        array[ 3 + offset] = _this[3];

        array[ 4 + offset] = _this[4];
        array[ 5 + offset] = _this[5];
        array[ 6 + offset] = _this[6];
        array[ 7 + offset] = _this[7];

        array[ 8 + offset] = _this[8];
        array[ 9 + offset] = _this[9];
        array[10 + offset] = _this[10];
        array[11 + offset] = _this[11];

        array[12 + offset] = _this[12];
        array[13 + offset] = _this[13];
        array[14 + offset] = _this[14];
        array[15 + offset] = _this[15];

        return _this;
    }

    __proto__.multiplyFrom = function(matrix1, matrix2)
    {
        var _this = this;
        var A = matrix1[x00],  B = matrix1[x01],  C = matrix1[x02],  D = matrix1[x03],
            E = matrix1[x10],  F = matrix1[x11],  G = matrix1[x12],  H = matrix1[x13],
            I = matrix1[x20],  J = matrix1[x21],  K = matrix1[x22],  L = matrix1[x23],
            M = matrix1[x30],  N = matrix1[x31],  O = matrix1[x32],  P = matrix1[x33],

            a = matrix2[x00],  b = matrix2[x01],  c = matrix2[x02],  d = matrix2[x03],
            e = matrix2[x10],  f = matrix2[x11],  g = matrix2[x12],  h = matrix2[x13],
            i = matrix2[x20],  j = matrix2[x21],  k = matrix2[x22],  l = matrix2[x23],
            m = matrix2[x30],  n = matrix2[x31],  o = matrix2[x32],  p = matrix2[x33];

        _this[x00] = A * a + B * e + C * i + D * m;
        _this[x01] = A * b + B * f + C * j + D * n;
        _this[x02] = A * c + B * g + C * k + D * o;
        _this[x03] = A * d + B * h + C * l + D * p;

        _this[x10] = E * a + F * e + G * i + H * m;
        _this[x11] = E * b + F * f + G * j + H * n;
        _this[x12] = E * c + F * g + G * k + H * o;
        _this[x13] = E * d + F * h + G * l + H * p;

        _this[x20] = I * a + J * e + K * i + L * m;
        _this[x21] = I * b + J * f + K * j + L * n;
        _this[x22] = I * c + J * g + K * k + L * o;
        _this[x23] = I * d + J * h + K * l + L * p;

        _this[x30] = M * a + N * e + O * i + P * m;
        _this[x31] = M * b + N * f + O * j + P * n;
        _this[x32] = M * c + N * g + O * k + P * o;
        _this[x33] = M * d + N * h + O * l + P * p;

        return _this;
    };

    // __class__.lookAt = function (mat4, eye, target, up)
    // {
    //     var zAxis = new Vector3D();
    //     zAxis.x = target.x-eye.x;
    //     zAxis.y = target.y-eye.y;
    //     zAxis.z = target.z-eye.z;
    //     zAxis.normalize();

    //     var xAxis = new Vector3D();
    //     xAxis.copy(up).cross(zAxis);
    //     xAxis.normalize();

    //     var yAxis = new Vector3D();
    //     yAxis.copy(zAxis).cross(xAxis);
    //     yAxis.normalize();

    //     var ex = -xAxis.dot(eye);
    //     var ey = -yAxis.dot(eye);
    //     var ez = -zAxis.dot(eye);

    //     mat4[x00] = xAxis.x;
    //     mat4[x10] = yAxis.x;
    //     mat4[x20] = zAxis.x;
        
    //     mat4[x01] = xAxis.y;
    //     mat4[x11] = yAxis.y;
    //     mat4[x21] = zAxis.y;

    //     mat4[x02] = xAxis.z;
    //     mat4[x12] = yAxis.z;
    //     mat4[x22] = zAxis.z;

    //     mat4[x03] = ex;
    //     mat4[x13] = ey;
    //     mat4[x23] = ez;

    //     mat4[x30] = 0;
    //     mat4[x31] = 0;
    //     mat4[x32] = 0;
    //     mat4[x33] = 1;

    //     return mat4;
    // }


    __proto__.perspective = function (fov, aspect, znear, zfar)
    {
        var matrix = this;
        var tan = 1.0 / (Math.tan(fov * Math.PI / 360));
        matrix[x00] = tan / aspect;
        matrix[x01] = matrix[x02] = matrix[x03] = matrix[x10] = 0.0;
        matrix[x11] = tan;
        matrix[x12] = matrix[x13] = matrix[x20] = matrix[x21] = 0.0;
        matrix[x22] = (znear + zfar) / (znear - zfar);
        matrix[x23] = 2 * znear * zfar / (znear - zfar);

        matrix[x30] = matrix[x31] = matrix[x33] = 0.0;
        matrix[x32] = -1.0;
        return matrix;
    };

    __proto__.transpose = function(matrix)
    {
        var _this = this;
        var a = matrix[x00],  b = matrix[x01],  c = matrix[x02],  d = matrix[x03],
            e = matrix[x10],  f = matrix[x11],  g = matrix[x12],  h = matrix[x13],
            i = matrix[x20],  j = matrix[x21],  k = matrix[x22],  l = matrix[x23],
            m = matrix[x30],  n = matrix[x31],  o = matrix[x32],  p = matrix[x33];

        _this[x00]  = a;  _this[x01]  = e; _this[x02]  = i;  _this[x03]  = m;
        _this[x10]  = b;  _this[x11]  = f; _this[x12]  = j;  _this[x13]  = n;
        _this[x20]  = c;  _this[x21]  = g; _this[x22]  = k;  _this[x23]  = o;
        _this[x30]  = d;  _this[x31]  = h; _this[x32]  = l;  _this[x33]  = p;
        return _this;
    };

    __proto__._invert = function(matrix)
    {
        var _this = this;
        var a = matrix[x00],  b = matrix[x01],  c = matrix[x02],  d = matrix[x03],
            e = matrix[x10],  f = matrix[x11],  g = matrix[x12],  h = matrix[x13],
            i = matrix[x20],  j = matrix[x21],  k = matrix[x22],  l = matrix[x23],
            m = matrix[x30],  n = matrix[x31],  o = matrix[x32],  p = matrix[x33],
            q = a * f - b * e, r = a * g - c * e,
            s = a * h - d * e, t = b * g - c * f,
            u = b * h - d * f, v = c * h - d * g,
            w = i * n - j * m, x = i * o - k * m,
            y = i * p - l * m, z = j * o - k * n,
            A = j * p - l * n, B = k * p - l * o,
            ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);

        _this[x00] = ( f * B - g * A + h * z) * ivd;
        _this[x01] = (-b * B + c * A - d * z) * ivd;
        _this[x02] = ( n * v - o * u + p * t) * ivd;
        _this[x03] = (-j * v + k * u - l * t) * ivd;

        _this[x10] = (-e * B + g * y - h * x) * ivd;
        _this[x11] = ( a * B - c * y + d * x) * ivd;
        _this[x12] = (-m * v + o * s - p * r) * ivd;
        _this[x13] = ( i * v - k * s + l * r) * ivd;

        _this[x20] = ( e * A - f * y + h * w) * ivd;
        _this[x21] = (-a * A + b * y - d * w) * ivd;
        _this[x22] = ( m * u - n * s + p * q) * ivd;
        _this[x23] = (-i * u + j * s - l * q) * ivd;

        _this[x30] = (-e * z + f * x - g * w) * ivd;
        _this[x31] = ( a * z - b * x + c * w) * ivd;
        _this[x32] = (-m * t + n * r - o * q) * ivd;
        _this[x33] = ( i * t - j * r + k * q) * ivd;
        return _this;
    };

    __proto__._scale = function (scale)
    {
        var _this = this;
        _this[x00] *= scale;
        _this[x11] *= scale;
        _this[x22] *= scale;
        // mat4[x33] = 1.0;
        return _this;
    };

    __proto__._translate = function (x, y, z)
    {
        var _this = this;
        _this[x03] += x;
        _this[x13] += y;
        _this[x23] += z;
        return _this;
    };

    // __class__.RotationX = function (angle)
    // {
    //     var result = new Matrix4();
    //     var s = Math.sin(angle);
    //     var c = Math.cos(angle);
    //     result[x00] = 1.0;
    //     result[x33] = 1.0;
    //     result[x11] = c;
    //     result[x22] = c;
    //     result[x21] = s;
    //     result[x12] = -s;
    //     return result;
    // };

    // __class__.RotationY = function (angle)
    // {
    //     var result = new Matrix4();
    //     var s = Math.sin(angle);
    //     var c = Math.cos(angle);
    //     result[x11] = 1.0;
    //     result[x33] = 1.0;
    //     result[x00] = c;
    //     result[x02] = s;
    //     result[x20] = -s;
    //     result[x22] = c;
    //     return result;
    // };

    // __class__.RotationZ = function (angle)
    // {
    //     var result = new Matrix4();
    //     var s = Math.sin(angle);
    //     var c = Math.cos(angle);
    //     result[x22] = 1.0;
    //     result[x33] = 1.0;
    //     result[x00] = c;
    //     result[x01] = -s;
    //     result[x10] = s;
    //     result[x11] = c;
    //     return result;
    // };

    // Matrix3D.Normalize = function (origin)
    // {
    //     var vector = origin.clone();
        
    //     return vector.normalize();
    // }

    return Matrix4;
})();

