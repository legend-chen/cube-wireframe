function Box3()
{
    var _this = this;
    _this._min = new Vector3(+Infinity, +Infinity, +Infinity);
    _this._max = new Vector3(-Infinity, -Infinity, -Infinity);
    _this._center = new Vector3();
    _this._size = new Vector3();
}

var __proto__ = Box3.prototype;

__proto__._expendVector = function(vector)
{
    return this._expend(vector.x, vector.y, vector.z);
}

__proto__._containVector = function (vector)
{
    return this._contain(vector.x, vector.y, vector.z);
}

__proto__._expand = function(x, y, z)
{
    var _this = this;
    if ( x < _this._min.x ) _this._min.x = x;
    if ( y < _this._min.y ) _this._min.y = y;
    if ( z < _this._min.z ) _this._min.z = z;

    if ( x > _this._max.x ) _this._max.x = x;
    if ( y > _this._max.y ) _this._max.y = y;
    if ( z > _this._max.z ) _this._max.z = z;
    return _this;
}

__proto__._contain = function (x, y, z)
{
    var _this = this;
    if (x >= _this._min.x && y >= _this._min.y && z >= _this._min.z && 
        x <= _this._max.x && y <= _this._max.y && z <= _this._max.z)
    {
        return true
    }

    return false;
}

__proto__._compute = function ()
{
    var _this = this;
    
    _this._size.x = _this._max.x - _this._min.x;
    _this._size.y = _this._max.y - _this._min.y;
    _this._size.z = _this._max.z - _this._min.z;

    _this._center.x = (_this._max.x + _this._min.x)*0.5;
    _this._center.y = (_this._max.y + _this._min.y)*0.5;
    _this._center.z = (_this._max.z + _this._min.z)*0.5;

    return _this;
}
