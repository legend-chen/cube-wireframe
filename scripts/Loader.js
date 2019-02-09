/**
 * Created by legend on 17/01/25.
 */
/*
 * Copyright (C) 2012 Legend Chen.  All rights reserved.
 */

function Loader ()
{
    var _this = this;

    _this._count = 0;
    _this._max = 0;
    
}

var __proto__ = Loader.prototype;

__proto__._request = function (url, type, callback)
{
    var _this = this;

    _this._max++;

    var xhr = new XMLHttpRequest();
    xhr.responseType = type;
    xhr.open('GET', url, true);

    xhr.onload = function ()
    {
        callback (xhr.response, xhr.responseUrl, xhr.responseType);
        _this._onProcess && _this._onProcess();
        (++_this._count == _this._max) && _this._onReady && _this._onReady();
    }

    xhr.send();
}

__proto__._image = function (url, callback)
{
    var _this = this;
    _this._max++;

    var image = new Image()
    image.src = url;

    image.onload = function ()
    {
        callback.call(this, image);
        _this._onProcess && _this._onProcess();
        (++_this._count == _this._max) && _this._onReady && _this._onReady();
    }
}

__proto__._async = function (callback)
{
    var _this = this;

    _this._max++;

    return function thread(result)
    {
        callback && callback.apply(this, arguments);
        _this._onProcess && _this._onProcess();
        (++_this._count == _this._max) && _this._onReady && _this._onReady();
    }
}


Loader.createWithCompleted = function (func)
{
    var _this = new Loader();
    _this._onReady = func;
    return _this
}

Loader.create = function (url, type, callback)
{
    var res = new Loader();
    res._request(url, type, callback);
    return res;
}

Loader._saveAs = function (fName, buffer)
{   
    // var url = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var isArray = buffer instanceof Array;
    var url = URL.createObjectURL(new Blob(isArray ? buffer : [buffer], {type:'application/x-download'}));
    var link = document.createElement('a');
    link.href = url;
    link.download = fName;

    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click');
    link.dispatchEvent(event);
    //URL.revokeObjectURL(url);
}

Loader._saveCanvas = function (fName, canvas)
{   
    var url = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    // var isArray = buffer instanceof Array;
    // var url = URL.createObjectURL(new Blob(isArray ? buffer : [buffer], {type:'application/x-download'}));
    var link = document.createElement('a');
    link.href = url;
    link.download = fName;

    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click');
    link.dispatchEvent(event);
    //URL.revokeObjectURL(url);
}

