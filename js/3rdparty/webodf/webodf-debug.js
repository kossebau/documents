/*


 Copyright (C) 2012 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
var core = {};
var gui = {};
var xmldom = {};
var odf = {};
var ops = {};
function Runtime() {
}
Runtime.ByteArray = function(size) {
};
Runtime.prototype.getVariable = function(name) {
};
Runtime.prototype.toJson = function(anything) {
};
Runtime.prototype.fromJson = function(jsonstr) {
};
Runtime.ByteArray.prototype.slice = function(start, end) {
};
Runtime.ByteArray.prototype.length = 0;
Runtime.prototype.byteArrayFromArray = function(array) {
};
Runtime.prototype.byteArrayFromString = function(string, encoding) {
};
Runtime.prototype.byteArrayToString = function(bytearray, encoding) {
};
Runtime.prototype.concatByteArrays = function(bytearray1, bytearray2) {
};
Runtime.prototype.read = function(path, offset, length, callback) {
};
Runtime.prototype.readFile = function(path, encoding, callback) {
};
Runtime.prototype.readFileSync = function(path, encoding) {
};
Runtime.prototype.loadXML = function(path, callback) {
};
Runtime.prototype.writeFile = function(path, data, callback) {
};
Runtime.prototype.isFile = function(path, callback) {
};
Runtime.prototype.getFileSize = function(path, callback) {
};
Runtime.prototype.deleteFile = function(path, callback) {
};
Runtime.prototype.log = function(msgOrCategory, msg) {
};
Runtime.prototype.setTimeout = function(callback, milliseconds) {
};
Runtime.prototype.clearTimeout = function(timeoutID) {
};
Runtime.prototype.libraryPaths = function() {
};
Runtime.prototype.type = function() {
};
Runtime.prototype.getDOMImplementation = function() {
};
Runtime.prototype.parseXML = function(xml) {
};
Runtime.prototype.getWindow = function() {
};
Runtime.prototype.assert = function(condition, message, callback) {
};
var IS_COMPILED_CODE = false;
Runtime.byteArrayToString = function(bytearray, encoding) {
  function byteArrayToString(bytearray) {
    var s = "", i, l = bytearray.length;
    for(i = 0;i < l;i += 1) {
      s += String.fromCharCode(bytearray[i] & 255)
    }
    return s
  }
  function utf8ByteArrayToString(bytearray) {
    var s = "", i, l = bytearray.length, c0, c1, c2, c3, codepoint;
    for(i = 0;i < l;i += 1) {
      c0 = bytearray[i];
      if(c0 < 128) {
        s += String.fromCharCode(c0)
      }else {
        i += 1;
        c1 = bytearray[i];
        if(c0 >= 194 && c0 < 224) {
          s += String.fromCharCode((c0 & 31) << 6 | c1 & 63)
        }else {
          i += 1;
          c2 = bytearray[i];
          if(c0 >= 224 && c0 < 240) {
            s += String.fromCharCode((c0 & 15) << 12 | (c1 & 63) << 6 | c2 & 63)
          }else {
            i += 1;
            c3 = bytearray[i];
            if(c0 >= 240 && c0 < 245) {
              codepoint = (c0 & 7) << 18 | (c1 & 63) << 12 | (c2 & 63) << 6 | c3 & 63;
              codepoint -= 65536;
              s += String.fromCharCode((codepoint >> 10) + 55296, (codepoint & 1023) + 56320)
            }
          }
        }
      }
    }
    return s
  }
  var result;
  if(encoding === "utf8") {
    result = utf8ByteArrayToString(bytearray)
  }else {
    if(encoding !== "binary") {
      this.log("Unsupported encoding: " + encoding)
    }
    result = byteArrayToString(bytearray)
  }
  return result
};
Runtime.getVariable = function(name) {
  try {
    return eval(name)
  }catch(e) {
    return undefined
  }
};
Runtime.toJson = function(anything) {
  return JSON.stringify(anything)
};
Runtime.fromJson = function(jsonstr) {
  return JSON.parse(jsonstr)
};
Runtime.getFunctionName = function getFunctionName(f) {
  var m;
  if(f.name === undefined) {
    m = (new RegExp("function\\s+(\\w+)")).exec(f);
    return m && m[1]
  }
  return f.name
};
function BrowserRuntime(logoutput) {
  var self = this, cache = {}, useNativeArray = window.ArrayBuffer && window.Uint8Array;
  if(useNativeArray) {
    Uint8Array.prototype.slice = function(begin, end) {
      if(end === undefined) {
        if(begin === undefined) {
          begin = 0
        }
        end = this.length
      }
      var view = this.subarray(begin, end), array, i;
      end -= begin;
      array = new Uint8Array(new ArrayBuffer(end));
      for(i = 0;i < end;i += 1) {
        array[i] = view[i]
      }
      return array
    }
  }
  this.ByteArray = useNativeArray ? function ByteArray(size) {
    return new Uint8Array(new ArrayBuffer(size))
  } : function ByteArray(size) {
    var a = [];
    a.length = size;
    return a
  };
  this.concatByteArrays = useNativeArray ? function(bytearray1, bytearray2) {
    var i, l1 = bytearray1.length, l2 = bytearray2.length, a = new this.ByteArray(l1 + l2);
    for(i = 0;i < l1;i += 1) {
      a[i] = bytearray1[i]
    }
    for(i = 0;i < l2;i += 1) {
      a[i + l1] = bytearray2[i]
    }
    return a
  } : function(bytearray1, bytearray2) {
    return bytearray1.concat(bytearray2)
  };
  function utf8ByteArrayFromString(string) {
    var l = string.length, bytearray, i, n, j = 0;
    for(i = 0;i < l;i += 1) {
      n = string.charCodeAt(i);
      j += 1 + (n > 128) + (n > 2048)
    }
    bytearray = new self.ByteArray(j);
    j = 0;
    for(i = 0;i < l;i += 1) {
      n = string.charCodeAt(i);
      if(n < 128) {
        bytearray[j] = n;
        j += 1
      }else {
        if(n < 2048) {
          bytearray[j] = 192 | n >>> 6;
          bytearray[j + 1] = 128 | n & 63;
          j += 2
        }else {
          bytearray[j] = 224 | n >>> 12 & 15;
          bytearray[j + 1] = 128 | n >>> 6 & 63;
          bytearray[j + 2] = 128 | n & 63;
          j += 3
        }
      }
    }
    return bytearray
  }
  function byteArrayFromString(string) {
    var l = string.length, a = new self.ByteArray(l), i;
    for(i = 0;i < l;i += 1) {
      a[i] = string.charCodeAt(i) & 255
    }
    return a
  }
  this.byteArrayFromArray = function(array) {
    return array.slice()
  };
  this.byteArrayFromString = function(string, encoding) {
    var result;
    if(encoding === "utf8") {
      result = utf8ByteArrayFromString(string)
    }else {
      if(encoding !== "binary") {
        self.log("unknown encoding: " + encoding)
      }
      result = byteArrayFromString(string)
    }
    return result
  };
  this.byteArrayToString = Runtime.byteArrayToString;
  this.getVariable = Runtime.getVariable;
  this.fromJson = Runtime.fromJson;
  this.toJson = Runtime.toJson;
  function log(msgOrCategory, msg) {
    var node, doc, category;
    if(msg !== undefined) {
      category = msgOrCategory
    }else {
      msg = msgOrCategory
    }
    if(logoutput) {
      doc = logoutput.ownerDocument;
      if(category) {
        node = doc.createElement("span");
        node.className = category;
        node.appendChild(doc.createTextNode(category));
        logoutput.appendChild(node);
        logoutput.appendChild(doc.createTextNode(" "))
      }
      node = doc.createElement("span");
      if(msg.length > 0 && msg[0] === "<") {
        node.innerHTML = msg
      }else {
        node.appendChild(doc.createTextNode(msg))
      }
      logoutput.appendChild(node);
      logoutput.appendChild(doc.createElement("br"))
    }else {
      if(console) {
        console.log(msg)
      }
    }
    if(category === "alert") {
      alert(msg)
    }
  }
  function assert(condition, message, callback) {
    if(!condition) {
      log("alert", "ASSERTION FAILED:\n" + message);
      if(callback) {
        callback()
      }
      throw message;
    }
  }
  function readFile(path, encoding, callback) {
    if(cache.hasOwnProperty(path)) {
      callback(null, cache[path]);
      return
    }
    var xhr = new XMLHttpRequest;
    function handleResult() {
      var data;
      if(xhr.readyState === 4) {
        if(xhr.status === 0 && !xhr.responseText) {
          callback("File " + path + " is empty.")
        }else {
          if(xhr.status === 200 || xhr.status === 0) {
            if(encoding === "binary") {
              if(xhr.responseBody !== null && String(typeof VBArray) !== "undefined") {
                data = (new VBArray(xhr.responseBody)).toArray()
              }else {
                data = self.byteArrayFromString(xhr.responseText, "binary")
              }
            }else {
              data = xhr.responseText
            }
            cache[path] = data;
            callback(null, data)
          }else {
            callback(xhr.responseText || xhr.statusText)
          }
        }
      }
    }
    xhr.open("GET", path, true);
    xhr.onreadystatechange = handleResult;
    if(xhr.overrideMimeType) {
      if(encoding !== "binary") {
        xhr.overrideMimeType("text/plain; charset=" + encoding)
      }else {
        xhr.overrideMimeType("text/plain; charset=x-user-defined")
      }
    }
    try {
      xhr.send(null)
    }catch(e) {
      callback(e.message)
    }
  }
  function read(path, offset, length, callback) {
    if(cache.hasOwnProperty(path)) {
      callback(null, cache[path].slice(offset, offset + length));
      return
    }
    var xhr = new XMLHttpRequest;
    function handleResult() {
      var data;
      if(xhr.readyState === 4) {
        if(xhr.status === 0 && !xhr.responseText) {
          callback("File " + path + " is empty.")
        }else {
          if(xhr.status === 200 || xhr.status === 0) {
            if(xhr.response) {
              data = (xhr.response);
              data = new Uint8Array(data)
            }else {
              if(xhr.responseBody !== null && String(typeof VBArray) !== "undefined") {
                data = (new VBArray(xhr.responseBody)).toArray()
              }else {
                data = self.byteArrayFromString(xhr.responseText, "binary")
              }
            }
            cache[path] = data;
            callback(null, data.slice(offset, offset + length))
          }else {
            callback(xhr.responseText || xhr.statusText)
          }
        }
      }
    }
    xhr.open("GET", path, true);
    xhr.onreadystatechange = handleResult;
    if(xhr.overrideMimeType) {
      xhr.overrideMimeType("text/plain; charset=x-user-defined")
    }
    xhr.responseType = "arraybuffer";
    try {
      xhr.send(null)
    }catch(e) {
      callback(e.message)
    }
  }
  function readFileSync(path, encoding) {
    var xhr = new XMLHttpRequest, result;
    xhr.open("GET", path, false);
    if(xhr.overrideMimeType) {
      if(encoding !== "binary") {
        xhr.overrideMimeType("text/plain; charset=" + encoding)
      }else {
        xhr.overrideMimeType("text/plain; charset=x-user-defined")
      }
    }
    try {
      xhr.send(null);
      if(xhr.status === 200 || xhr.status === 0) {
        result = xhr.responseText
      }
    }catch(ignore) {
    }
    return result
  }
  function writeFile(path, data, callback) {
    cache[path] = data;
    var xhr = new XMLHttpRequest;
    function handleResult() {
      if(xhr.readyState === 4) {
        if(xhr.status === 0 && !xhr.responseText) {
          callback("File " + path + " is empty.")
        }else {
          if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 0) {
            callback(null)
          }else {
            callback("Status " + String(xhr.status) + ": " + xhr.responseText || xhr.statusText)
          }
        }
      }
    }
    xhr.open("PUT", path, true);
    xhr.onreadystatechange = handleResult;
    if(data.buffer && !xhr.sendAsBinary) {
      data = data.buffer
    }else {
      data = self.byteArrayToString(data, "binary")
    }
    try {
      if(xhr.sendAsBinary) {
        xhr.sendAsBinary(data)
      }else {
        xhr.send(data)
      }
    }catch(e) {
      self.log("HUH? " + e + " " + data);
      callback(e.message)
    }
  }
  function deleteFile(path, callback) {
    delete cache[path];
    var xhr = new XMLHttpRequest;
    xhr.open("DELETE", path, true);
    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4) {
        if(xhr.status < 200 && xhr.status >= 300) {
          callback(xhr.responseText)
        }else {
          callback(null)
        }
      }
    };
    xhr.send(null)
  }
  function loadXML(path, callback) {
    var xhr = new XMLHttpRequest;
    function handleResult() {
      if(xhr.readyState === 4) {
        if(xhr.status === 0 && !xhr.responseText) {
          callback("File " + path + " is empty.")
        }else {
          if(xhr.status === 200 || xhr.status === 0) {
            callback(null, xhr.responseXML)
          }else {
            callback(xhr.responseText)
          }
        }
      }
    }
    xhr.open("GET", path, true);
    if(xhr.overrideMimeType) {
      xhr.overrideMimeType("text/xml")
    }
    xhr.onreadystatechange = handleResult;
    try {
      xhr.send(null)
    }catch(e) {
      callback(e.message)
    }
  }
  function isFile(path, callback) {
    self.getFileSize(path, function(size) {
      callback(size !== -1)
    })
  }
  function getFileSize(path, callback) {
    var xhr = new XMLHttpRequest;
    xhr.open("HEAD", path, true);
    xhr.onreadystatechange = function() {
      if(xhr.readyState !== 4) {
        return
      }
      var cl = xhr.getResponseHeader("Content-Length");
      if(cl) {
        callback(parseInt(cl, 10))
      }else {
        readFile(path, "binary", function(err, data) {
          if(!err) {
            callback(data.length)
          }else {
            callback(-1)
          }
        })
      }
    };
    xhr.send(null)
  }
  this.readFile = readFile;
  this.read = read;
  this.readFileSync = readFileSync;
  this.writeFile = writeFile;
  this.deleteFile = deleteFile;
  this.loadXML = loadXML;
  this.isFile = isFile;
  this.getFileSize = getFileSize;
  this.log = log;
  this.assert = assert;
  this.setTimeout = function(f, msec) {
    return setTimeout(function() {
      f()
    }, msec)
  };
  this.clearTimeout = function(timeoutID) {
    clearTimeout(timeoutID)
  };
  this.libraryPaths = function() {
    return["lib"]
  };
  this.setCurrentDirectory = function() {
  };
  this.type = function() {
    return"BrowserRuntime"
  };
  this.getDOMImplementation = function() {
    return window.document.implementation
  };
  this.parseXML = function(xml) {
    var parser = new DOMParser;
    return parser.parseFromString(xml, "text/xml")
  };
  this.exit = function(exitCode) {
    log("Calling exit with code " + String(exitCode) + ", but exit() is not implemented.")
  };
  this.getWindow = function() {
    return window
  }
}
function NodeJSRuntime() {
  var self = this, fs = require("fs"), pathmod = require("path"), currentDirectory = "", parser, domImplementation;
  this.ByteArray = function(size) {
    return new Buffer(size)
  };
  this.byteArrayFromArray = function(array) {
    var ba = new Buffer(array.length), i, l = array.length;
    for(i = 0;i < l;i += 1) {
      ba[i] = array[i]
    }
    return ba
  };
  this.concatByteArrays = function(a, b) {
    var ba = new Buffer(a.length + b.length);
    a.copy(ba, 0, 0);
    b.copy(ba, a.length, 0);
    return ba
  };
  this.byteArrayFromString = function(string, encoding) {
    return new Buffer(string, encoding)
  };
  this.byteArrayToString = function(bytearray, encoding) {
    return bytearray.toString(encoding)
  };
  this.getVariable = Runtime.getVariable;
  this.fromJson = Runtime.fromJson;
  this.toJson = Runtime.toJson;
  function isFile(path, callback) {
    path = pathmod.resolve(currentDirectory, path);
    fs.stat(path, function(err, stats) {
      callback(!err && stats.isFile())
    })
  }
  function readFile(path, encoding, callback) {
    path = pathmod.resolve(currentDirectory, path);
    if(encoding !== "binary") {
      fs.readFile(path, encoding, callback)
    }else {
      fs.readFile(path, null, callback)
    }
  }
  this.readFile = readFile;
  function loadXML(path, callback) {
    readFile(path, "utf-8", function(err, data) {
      if(err) {
        return callback(err)
      }
      callback(null, self.parseXML(data))
    })
  }
  this.loadXML = loadXML;
  this.writeFile = function(path, data, callback) {
    path = pathmod.resolve(currentDirectory, path);
    fs.writeFile(path, data, "binary", function(err) {
      callback(err || null)
    })
  };
  this.deleteFile = function(path, callback) {
    path = pathmod.resolve(currentDirectory, path);
    fs.unlink(path, callback)
  };
  this.read = function(path, offset, length, callback) {
    path = pathmod.resolve(currentDirectory, path);
    fs.open(path, "r+", 666, function(err, fd) {
      if(err) {
        callback(err);
        return
      }
      var buffer = new Buffer(length);
      fs.read(fd, buffer, 0, length, offset, function(err) {
        fs.close(fd);
        callback(err, buffer)
      })
    })
  };
  this.readFileSync = function(path, encoding) {
    if(!encoding) {
      return""
    }
    if(encoding === "binary") {
      return fs.readFileSync(path, null)
    }
    return fs.readFileSync(path, encoding)
  };
  this.isFile = isFile;
  this.getFileSize = function(path, callback) {
    path = pathmod.resolve(currentDirectory, path);
    fs.stat(path, function(err, stats) {
      if(err) {
        callback(-1)
      }else {
        callback(stats.size)
      }
    })
  };
  function log(msgOrCategory, msg) {
    var category;
    if(msg !== undefined) {
      category = msgOrCategory
    }else {
      msg = msgOrCategory
    }
    if(category === "alert") {
      process.stderr.write("\n!!!!! ALERT !!!!!" + "\n")
    }
    process.stderr.write(msg + "\n");
    if(category === "alert") {
      process.stderr.write("!!!!! ALERT !!!!!" + "\n")
    }
  }
  this.log = log;
  function assert(condition, message, callback) {
    if(!condition) {
      process.stderr.write("ASSERTION FAILED: " + message);
      if(callback) {
        callback()
      }
    }
  }
  this.assert = assert;
  this.setTimeout = function(f, msec) {
    return setTimeout(function() {
      f()
    }, msec)
  };
  this.clearTimeout = function(timeoutID) {
    clearTimeout(timeoutID)
  };
  this.libraryPaths = function() {
    return[__dirname]
  };
  this.setCurrentDirectory = function(dir) {
    currentDirectory = dir
  };
  this.currentDirectory = function() {
    return currentDirectory
  };
  this.type = function() {
    return"NodeJSRuntime"
  };
  this.getDOMImplementation = function() {
    return domImplementation
  };
  this.parseXML = function(xml) {
    return parser.parseFromString(xml, "text/xml")
  };
  this.exit = process.exit;
  this.getWindow = function() {
    return null
  };
  function init() {
    var DOMParser = require("xmldom").DOMParser;
    parser = new DOMParser;
    domImplementation = self.parseXML("<a/>").implementation
  }
  init()
}
function RhinoRuntime() {
  var self = this, dom = Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance(), builder, entityresolver, currentDirectory = "";
  dom.setValidating(false);
  dom.setNamespaceAware(true);
  dom.setExpandEntityReferences(false);
  dom.setSchema(null);
  entityresolver = Packages.org.xml.sax.EntityResolver({resolveEntity:function(publicId, systemId) {
    var file, open = function(path) {
      var reader = new Packages.java.io.FileReader(path), source = new Packages.org.xml.sax.InputSource(reader);
      return source
    };
    file = systemId;
    return open(file)
  }});
  builder = dom.newDocumentBuilder();
  builder.setEntityResolver(entityresolver);
  this.ByteArray = function ByteArray(size) {
    return[size]
  };
  this.byteArrayFromArray = function(array) {
    return array
  };
  this.byteArrayFromString = function(string, encoding) {
    var a = [], i, l = string.length;
    for(i = 0;i < l;i += 1) {
      a[i] = string.charCodeAt(i) & 255
    }
    return a
  };
  this.byteArrayToString = Runtime.byteArrayToString;
  this.getVariable = Runtime.getVariable;
  this.fromJson = Runtime.fromJson;
  this.toJson = Runtime.toJson;
  this.concatByteArrays = function(bytearray1, bytearray2) {
    return bytearray1.concat(bytearray2)
  };
  function loadXML(path, callback) {
    var file = new Packages.java.io.File(path), xmlDocument;
    try {
      xmlDocument = builder.parse(file)
    }catch(err) {
      print(err);
      callback(err);
      return
    }
    callback(null, xmlDocument)
  }
  function runtimeReadFile(path, encoding, callback) {
    if(currentDirectory) {
      path = currentDirectory + "/" + path
    }
    var file = new Packages.java.io.File(path), data, rhinoencoding = encoding === "binary" ? "latin1" : encoding;
    if(!file.isFile()) {
      callback(path + " is not a file.")
    }else {
      data = readFile(path, rhinoencoding);
      if(encoding === "binary") {
        data = self.byteArrayFromString(data, "binary")
      }
      callback(null, data)
    }
  }
  function runtimeReadFileSync(path, encoding) {
    var file = new Packages.java.io.File(path);
    if(!file.isFile()) {
      return null
    }
    if(encoding === "binary") {
      encoding = "latin1"
    }
    return readFile(path, encoding)
  }
  function isFile(path, callback) {
    if(currentDirectory) {
      path = currentDirectory + "/" + path
    }
    var file = new Packages.java.io.File(path);
    callback(file.isFile())
  }
  this.loadXML = loadXML;
  this.readFile = runtimeReadFile;
  this.writeFile = function(path, data, callback) {
    if(currentDirectory) {
      path = currentDirectory + "/" + path
    }
    var out = new Packages.java.io.FileOutputStream(path), i, l = data.length;
    for(i = 0;i < l;i += 1) {
      out.write(data[i])
    }
    out.close();
    callback(null)
  };
  this.deleteFile = function(path, callback) {
    if(currentDirectory) {
      path = currentDirectory + "/" + path
    }
    var file = new Packages.java.io.File(path);
    if(file["delete"]()) {
      callback(null)
    }else {
      callback("Could not delete " + path)
    }
  };
  this.read = function(path, offset, length, callback) {
    if(currentDirectory) {
      path = currentDirectory + "/" + path
    }
    var data = runtimeReadFileSync(path, "binary");
    if(data) {
      callback(null, this.byteArrayFromString(data.substring(offset, offset + length), "binary"))
    }else {
      callback("Cannot read " + path)
    }
  };
  this.readFileSync = function(path, encoding) {
    if(!encoding) {
      return""
    }
    return readFile(path, encoding)
  };
  this.isFile = isFile;
  this.getFileSize = function(path, callback) {
    if(currentDirectory) {
      path = currentDirectory + "/" + path
    }
    var file = new Packages.java.io.File(path);
    callback(file.length())
  };
  function log(msgOrCategory, msg) {
    var category;
    if(msg !== undefined) {
      category = msgOrCategory
    }else {
      msg = msgOrCategory
    }
    if(category === "alert") {
      print("\n!!!!! ALERT !!!!!")
    }
    print(msg);
    if(category === "alert") {
      print("!!!!! ALERT !!!!!")
    }
  }
  this.log = log;
  function assert(condition, message, callback) {
    if(!condition) {
      log("alert", "ASSERTION FAILED: " + message);
      if(callback) {
        callback()
      }
    }
  }
  this.assert = assert;
  this.setTimeout = function(f) {
    f();
    return 0
  };
  this.clearTimeout = function() {
  };
  this.libraryPaths = function() {
    return["lib"]
  };
  this.setCurrentDirectory = function(dir) {
    currentDirectory = dir
  };
  this.currentDirectory = function() {
    return currentDirectory
  };
  this.type = function() {
    return"RhinoRuntime"
  };
  this.getDOMImplementation = function() {
    return builder.getDOMImplementation()
  };
  this.parseXML = function(xml) {
    return builder.parse(xml)
  };
  this.exit = quit;
  this.getWindow = function() {
    return null
  }
}
var runtime = function() {
  var result;
  if(String(typeof window) !== "undefined") {
    result = new BrowserRuntime(window.document.getElementById("logoutput"))
  }else {
    if(String(typeof require) !== "undefined") {
      result = new NodeJSRuntime
    }else {
      result = new RhinoRuntime
    }
  }
  return result
}();
(function() {
  var cache = {}, dircontents = {};
  function getOrDefinePackage(packageNameComponents) {
    var topname = packageNameComponents[0], i, pkg;
    pkg = eval("if (typeof " + topname + " === 'undefined') {" + "eval('" + topname + " = {};');}" + topname);
    for(i = 1;i < packageNameComponents.length - 1;i += 1) {
      if(!pkg.hasOwnProperty(packageNameComponents[i])) {
        pkg = pkg[packageNameComponents[i]] = {}
      }else {
        pkg = pkg[packageNameComponents[i]]
      }
    }
    return pkg[packageNameComponents[packageNameComponents.length - 1]]
  }
  runtime.loadClass = function(classpath) {
    if(IS_COMPILED_CODE) {
      return
    }
    if(cache.hasOwnProperty(classpath)) {
      return
    }
    var names = classpath.split("."), impl;
    impl = getOrDefinePackage(names);
    if(impl) {
      cache[classpath] = true;
      return
    }
    function getPathFromManifests(classpath) {
      var path = classpath.replace(/\./g, "/") + ".js", dirs = runtime.libraryPaths(), i, dir, code;
      if(runtime.currentDirectory) {
        dirs.push(runtime.currentDirectory())
      }
      for(i = 0;i < dirs.length;i += 1) {
        dir = dirs[i];
        if(!dircontents.hasOwnProperty(dir)) {
          try {
            code = runtime.readFileSync(dirs[i] + "/manifest.js", "utf8");
            if(code && code.length) {
              dircontents[dir] = eval(code)
            }else {
              dircontents[dir] = null
            }
          }catch(e1) {
            dircontents[dir] = null;
            runtime.log("Cannot load manifest for " + dir + ".")
          }
        }
        code = null;
        dir = dircontents[dir];
        if(dir && dir.indexOf && dir.indexOf(path) !== -1) {
          return dirs[i] + "/" + path
        }
      }
      return null
    }
    function load(classpath) {
      var code, path;
      path = getPathFromManifests(classpath);
      if(!path) {
        throw classpath + " is not listed in any manifest.js.";
      }
      try {
        code = runtime.readFileSync(path, "utf8")
      }catch(e2) {
        runtime.log("Error loading " + classpath + " " + e2);
        throw e2;
      }
      if(code === undefined) {
        throw"Cannot load class " + classpath;
      }
      code += "\n//# sourceURL=" + path;
      code += "\n//@ sourceURL=" + path;
      try {
        code = eval(classpath + " = eval(code);")
      }catch(e4) {
        runtime.log("Error loading " + classpath + " " + e4);
        throw e4;
      }
      return code
    }
    impl = load(classpath);
    if(!impl || Runtime.getFunctionName(impl) !== names[names.length - 1]) {
      runtime.log("Loaded code is not for " + names[names.length - 1]);
      throw"Loaded code is not for " + names[names.length - 1];
    }
    cache[classpath] = true
  }
})();
(function(args) {
  if(args) {
    args = Array.prototype.slice.call((args))
  }else {
    args = []
  }
  function run(argv) {
    if(!argv.length) {
      return
    }
    var script = argv[0];
    runtime.readFile(script, "utf8", function(err, code) {
      var path = "", codestring = (code);
      if(script.indexOf("/") !== -1) {
        path = script.substring(0, script.indexOf("/"))
      }
      runtime.setCurrentDirectory(path);
      function inner_run() {
        var script, path, args, argv, result;
        result = eval(codestring);
        if(result) {
          runtime.exit(result)
        }
        return
      }
      if(err || codestring === null) {
        runtime.log(err);
        runtime.exit(1)
      }else {
        inner_run.apply(null, argv)
      }
    })
  }
  if(runtime.type() === "NodeJSRuntime") {
    run(process.argv.slice(2))
  }else {
    if(runtime.type() === "RhinoRuntime") {
      run(args)
    }else {
      run(args.slice(1))
    }
  }
})(String(typeof arguments) !== "undefined" && arguments);
core.Base64 = function() {
  var b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", b64tab = function(bin) {
    var t = {}, i, l;
    for(i = 0, l = bin.length;i < l;i += 1) {
      t[bin.charAt(i)] = i
    }
    return t
  }(b64chars), convertUTF16StringToBase64, convertBase64ToUTF16String, window = runtime.getWindow(), btoa, atob;
  function stringToArray(s) {
    var a = [], i, l = s.length;
    for(i = 0;i < l;i += 1) {
      a[i] = s.charCodeAt(i) & 255
    }
    return a
  }
  function convertUTF8ArrayToBase64(bin) {
    var n, b64 = "", i, l = bin.length - 2;
    for(i = 0;i < l;i += 3) {
      n = bin[i] << 16 | bin[i + 1] << 8 | bin[i + 2];
      b64 += b64chars[n >>> 18];
      b64 += b64chars[n >>> 12 & 63];
      b64 += b64chars[n >>> 6 & 63];
      b64 += b64chars[n & 63]
    }
    if(i === l + 1) {
      n = bin[i] << 4;
      b64 += b64chars[n >>> 6];
      b64 += b64chars[n & 63];
      b64 += "=="
    }else {
      if(i === l) {
        n = bin[i] << 10 | bin[i + 1] << 2;
        b64 += b64chars[n >>> 12];
        b64 += b64chars[n >>> 6 & 63];
        b64 += b64chars[n & 63];
        b64 += "="
      }
    }
    return b64
  }
  function convertBase64ToUTF8Array(b64) {
    b64 = b64.replace(/[^A-Za-z0-9+\/]+/g, "");
    var bin = [], padlen = b64.length % 4, i, l = b64.length, n;
    for(i = 0;i < l;i += 4) {
      n = (b64tab[b64.charAt(i)] || 0) << 18 | (b64tab[b64.charAt(i + 1)] || 0) << 12 | (b64tab[b64.charAt(i + 2)] || 0) << 6 | (b64tab[b64.charAt(i + 3)] || 0);
      bin.push(n >> 16, n >> 8 & 255, n & 255)
    }
    bin.length -= [0, 0, 2, 1][padlen];
    return bin
  }
  function convertUTF16ArrayToUTF8Array(uni) {
    var bin = [], i, l = uni.length, n;
    for(i = 0;i < l;i += 1) {
      n = uni[i];
      if(n < 128) {
        bin.push(n)
      }else {
        if(n < 2048) {
          bin.push(192 | n >>> 6, 128 | n & 63)
        }else {
          bin.push(224 | n >>> 12 & 15, 128 | n >>> 6 & 63, 128 | n & 63)
        }
      }
    }
    return bin
  }
  function convertUTF8ArrayToUTF16Array(bin) {
    var uni = [], i, l = bin.length, c0, c1, c2;
    for(i = 0;i < l;i += 1) {
      c0 = bin[i];
      if(c0 < 128) {
        uni.push(c0)
      }else {
        i += 1;
        c1 = bin[i];
        if(c0 < 224) {
          uni.push((c0 & 31) << 6 | c1 & 63)
        }else {
          i += 1;
          c2 = bin[i];
          uni.push((c0 & 15) << 12 | (c1 & 63) << 6 | c2 & 63)
        }
      }
    }
    return uni
  }
  function convertUTF8StringToBase64(bin) {
    return convertUTF8ArrayToBase64(stringToArray(bin))
  }
  function convertBase64ToUTF8String(b64) {
    return String.fromCharCode.apply(String, convertBase64ToUTF8Array(b64))
  }
  function convertUTF8StringToUTF16Array(bin) {
    return convertUTF8ArrayToUTF16Array(stringToArray(bin))
  }
  function convertUTF8ArrayToUTF16String(bin) {
    var b = convertUTF8ArrayToUTF16Array(bin), r = "", i = 0, chunksize = 45E3;
    while(i < b.length) {
      r += String.fromCharCode.apply(String, b.slice(i, i + chunksize));
      i += chunksize
    }
    return r
  }
  function convertUTF8StringToUTF16String_internal(bin, i, end) {
    var str = "", c0, c1, c2, j;
    for(j = i;j < end;j += 1) {
      c0 = bin.charCodeAt(j) & 255;
      if(c0 < 128) {
        str += String.fromCharCode(c0)
      }else {
        j += 1;
        c1 = bin.charCodeAt(j) & 255;
        if(c0 < 224) {
          str += String.fromCharCode((c0 & 31) << 6 | c1 & 63)
        }else {
          j += 1;
          c2 = bin.charCodeAt(j) & 255;
          str += String.fromCharCode((c0 & 15) << 12 | (c1 & 63) << 6 | c2 & 63)
        }
      }
    }
    return str
  }
  function convertUTF8StringToUTF16String(bin, callback) {
    var partsize = 1E5, str = "", pos = 0;
    if(bin.length < partsize) {
      callback(convertUTF8StringToUTF16String_internal(bin, 0, bin.length), true);
      return
    }
    if(typeof bin !== "string") {
      bin = bin.slice()
    }
    function f() {
      var end = pos + partsize;
      if(end > bin.length) {
        end = bin.length
      }
      str += convertUTF8StringToUTF16String_internal(bin, pos, end);
      pos = end;
      end = pos === bin.length;
      if(callback(str, end) && !end) {
        runtime.setTimeout(f, 0)
      }
    }
    f()
  }
  function convertUTF16StringToUTF8Array(uni) {
    return convertUTF16ArrayToUTF8Array(stringToArray(uni))
  }
  function convertUTF16ArrayToUTF8String(uni) {
    return String.fromCharCode.apply(String, convertUTF16ArrayToUTF8Array(uni))
  }
  function convertUTF16StringToUTF8String(uni) {
    return String.fromCharCode.apply(String, convertUTF16ArrayToUTF8Array(stringToArray(uni)))
  }
  if(window && window.btoa) {
    btoa = function(b) {
      return window.btoa(b)
    };
    convertUTF16StringToBase64 = function(uni) {
      return btoa(convertUTF16StringToUTF8String(uni))
    }
  }else {
    btoa = convertUTF8StringToBase64;
    convertUTF16StringToBase64 = function(uni) {
      return convertUTF8ArrayToBase64(convertUTF16StringToUTF8Array(uni))
    }
  }
  if(window && window.atob) {
    atob = function(a) {
      return window.atob(a)
    };
    convertBase64ToUTF16String = function(b64) {
      var b = atob(b64);
      return convertUTF8StringToUTF16String_internal(b, 0, b.length)
    }
  }else {
    atob = convertBase64ToUTF8String;
    convertBase64ToUTF16String = function(b64) {
      return convertUTF8ArrayToUTF16String(convertBase64ToUTF8Array(b64))
    }
  }
  function Base64() {
    this.convertUTF8ArrayToBase64 = convertUTF8ArrayToBase64;
    this.convertByteArrayToBase64 = convertUTF8ArrayToBase64;
    this.convertBase64ToUTF8Array = convertBase64ToUTF8Array;
    this.convertBase64ToByteArray = convertBase64ToUTF8Array;
    this.convertUTF16ArrayToUTF8Array = convertUTF16ArrayToUTF8Array;
    this.convertUTF16ArrayToByteArray = convertUTF16ArrayToUTF8Array;
    this.convertUTF8ArrayToUTF16Array = convertUTF8ArrayToUTF16Array;
    this.convertByteArrayToUTF16Array = convertUTF8ArrayToUTF16Array;
    this.convertUTF8StringToBase64 = convertUTF8StringToBase64;
    this.convertBase64ToUTF8String = convertBase64ToUTF8String;
    this.convertUTF8StringToUTF16Array = convertUTF8StringToUTF16Array;
    this.convertUTF8ArrayToUTF16String = convertUTF8ArrayToUTF16String;
    this.convertByteArrayToUTF16String = convertUTF8ArrayToUTF16String;
    this.convertUTF8StringToUTF16String = convertUTF8StringToUTF16String;
    this.convertUTF16StringToUTF8Array = convertUTF16StringToUTF8Array;
    this.convertUTF16StringToByteArray = convertUTF16StringToUTF8Array;
    this.convertUTF16ArrayToUTF8String = convertUTF16ArrayToUTF8String;
    this.convertUTF16StringToUTF8String = convertUTF16StringToUTF8String;
    this.convertUTF16StringToBase64 = convertUTF16StringToBase64;
    this.convertBase64ToUTF16String = convertBase64ToUTF16String;
    this.fromBase64 = convertBase64ToUTF8String;
    this.toBase64 = convertUTF8StringToBase64;
    this.atob = atob;
    this.btoa = btoa;
    this.utob = convertUTF16StringToUTF8String;
    this.btou = convertUTF8StringToUTF16String;
    this.encode = convertUTF16StringToBase64;
    this.encodeURI = function(u) {
      return convertUTF16StringToBase64(u).replace(/[+\/]/g, function(m0) {
        return m0 === "+" ? "-" : "_"
      }).replace(/\\=+$/, "")
    };
    this.decode = function(a) {
      return convertBase64ToUTF16String(a.replace(/[\-_]/g, function(m0) {
        return m0 === "-" ? "+" : "/"
      }))
    }
  }
  return Base64
}();
core.RawDeflate = function() {
  var zip_WSIZE = 32768, zip_STORED_BLOCK = 0, zip_STATIC_TREES = 1, zip_DYN_TREES = 2, zip_DEFAULT_LEVEL = 6, zip_FULL_SEARCH = true, zip_INBUFSIZ = 32768, zip_INBUF_EXTRA = 64, zip_OUTBUFSIZ = 1024 * 8, zip_window_size = 2 * zip_WSIZE, zip_MIN_MATCH = 3, zip_MAX_MATCH = 258, zip_BITS = 16, zip_LIT_BUFSIZE = 8192, zip_HASH_BITS = 13, zip_DIST_BUFSIZE = zip_LIT_BUFSIZE, zip_HASH_SIZE = 1 << zip_HASH_BITS, zip_HASH_MASK = zip_HASH_SIZE - 1, zip_WMASK = zip_WSIZE - 1, zip_NIL = 0, zip_TOO_FAR = 4096, 
  zip_MIN_LOOKAHEAD = zip_MAX_MATCH + zip_MIN_MATCH + 1, zip_MAX_DIST = zip_WSIZE - zip_MIN_LOOKAHEAD, zip_SMALLEST = 1, zip_MAX_BITS = 15, zip_MAX_BL_BITS = 7, zip_LENGTH_CODES = 29, zip_LITERALS = 256, zip_END_BLOCK = 256, zip_L_CODES = zip_LITERALS + 1 + zip_LENGTH_CODES, zip_D_CODES = 30, zip_BL_CODES = 19, zip_REP_3_6 = 16, zip_REPZ_3_10 = 17, zip_REPZ_11_138 = 18, zip_HEAP_SIZE = 2 * zip_L_CODES + 1, zip_H_SHIFT = parseInt((zip_HASH_BITS + zip_MIN_MATCH - 1) / zip_MIN_MATCH, 10), zip_free_queue, 
  zip_qhead, zip_qtail, zip_initflag, zip_outbuf = null, zip_outcnt, zip_outoff, zip_complete, zip_window, zip_d_buf, zip_l_buf, zip_prev, zip_bi_buf, zip_bi_valid, zip_block_start, zip_ins_h, zip_hash_head, zip_prev_match, zip_match_available, zip_match_length, zip_prev_length, zip_strstart, zip_match_start, zip_eofile, zip_lookahead, zip_max_chain_length, zip_max_lazy_match, zip_compr_level, zip_good_match, zip_nice_match, zip_dyn_ltree, zip_dyn_dtree, zip_static_ltree, zip_static_dtree, zip_bl_tree, 
  zip_l_desc, zip_d_desc, zip_bl_desc, zip_bl_count, zip_heap, zip_heap_len, zip_heap_max, zip_depth, zip_length_code, zip_dist_code, zip_base_length, zip_base_dist, zip_flag_buf, zip_last_lit, zip_last_dist, zip_last_flags, zip_flags, zip_flag_bit, zip_opt_len, zip_static_len, zip_deflate_data, zip_deflate_pos, zip_extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], zip_extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 
  9, 10, 10, 11, 11, 12, 12, 13, 13], zip_extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], zip_bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], zip_configuration_table;
  if(zip_LIT_BUFSIZE > zip_INBUFSIZ) {
    runtime.log("error: zip_INBUFSIZ is too small")
  }
  if(zip_WSIZE << 1 > 1 << zip_BITS) {
    runtime.log("error: zip_WSIZE is too large")
  }
  if(zip_HASH_BITS > zip_BITS - 1) {
    runtime.log("error: zip_HASH_BITS is too large")
  }
  if(zip_HASH_BITS < 8 || zip_MAX_MATCH !== 258) {
    runtime.log("error: Code too clever")
  }
  function Zip_DeflateCT() {
    this.fc = 0;
    this.dl = 0
  }
  function Zip_DeflateTreeDesc() {
    this.dyn_tree = null;
    this.static_tree = null;
    this.extra_bits = null;
    this.extra_base = 0;
    this.elems = 0;
    this.max_length = 0;
    this.max_code = 0
  }
  function Zip_DeflateConfiguration(a, b, c, d) {
    this.good_length = a;
    this.max_lazy = b;
    this.nice_length = c;
    this.max_chain = d
  }
  function Zip_DeflateBuffer() {
    this.next = null;
    this.len = 0;
    this.ptr = [];
    this.ptr.length = zip_OUTBUFSIZ;
    this.off = 0
  }
  zip_configuration_table = [new Zip_DeflateConfiguration(0, 0, 0, 0), new Zip_DeflateConfiguration(4, 4, 8, 4), new Zip_DeflateConfiguration(4, 5, 16, 8), new Zip_DeflateConfiguration(4, 6, 32, 32), new Zip_DeflateConfiguration(4, 4, 16, 16), new Zip_DeflateConfiguration(8, 16, 32, 32), new Zip_DeflateConfiguration(8, 16, 128, 128), new Zip_DeflateConfiguration(8, 32, 128, 256), new Zip_DeflateConfiguration(32, 128, 258, 1024), new Zip_DeflateConfiguration(32, 258, 258, 4096)];
  function zip_deflate_start(level) {
    var i;
    if(!level) {
      level = zip_DEFAULT_LEVEL
    }else {
      if(level < 1) {
        level = 1
      }else {
        if(level > 9) {
          level = 9
        }
      }
    }
    zip_compr_level = level;
    zip_initflag = false;
    zip_eofile = false;
    if(zip_outbuf !== null) {
      return
    }
    zip_free_queue = zip_qhead = zip_qtail = null;
    zip_outbuf = [];
    zip_outbuf.length = zip_OUTBUFSIZ;
    zip_window = [];
    zip_window.length = zip_window_size;
    zip_d_buf = [];
    zip_d_buf.length = zip_DIST_BUFSIZE;
    zip_l_buf = [];
    zip_l_buf.length = zip_INBUFSIZ + zip_INBUF_EXTRA;
    zip_prev = [];
    zip_prev.length = 1 << zip_BITS;
    zip_dyn_ltree = [];
    zip_dyn_ltree.length = zip_HEAP_SIZE;
    for(i = 0;i < zip_HEAP_SIZE;i++) {
      zip_dyn_ltree[i] = new Zip_DeflateCT
    }
    zip_dyn_dtree = [];
    zip_dyn_dtree.length = 2 * zip_D_CODES + 1;
    for(i = 0;i < 2 * zip_D_CODES + 1;i++) {
      zip_dyn_dtree[i] = new Zip_DeflateCT
    }
    zip_static_ltree = [];
    zip_static_ltree.length = zip_L_CODES + 2;
    for(i = 0;i < zip_L_CODES + 2;i++) {
      zip_static_ltree[i] = new Zip_DeflateCT
    }
    zip_static_dtree = [];
    zip_static_dtree.length = zip_D_CODES;
    for(i = 0;i < zip_D_CODES;i++) {
      zip_static_dtree[i] = new Zip_DeflateCT
    }
    zip_bl_tree = [];
    zip_bl_tree.length = 2 * zip_BL_CODES + 1;
    for(i = 0;i < 2 * zip_BL_CODES + 1;i++) {
      zip_bl_tree[i] = new Zip_DeflateCT
    }
    zip_l_desc = new Zip_DeflateTreeDesc;
    zip_d_desc = new Zip_DeflateTreeDesc;
    zip_bl_desc = new Zip_DeflateTreeDesc;
    zip_bl_count = [];
    zip_bl_count.length = zip_MAX_BITS + 1;
    zip_heap = [];
    zip_heap.length = 2 * zip_L_CODES + 1;
    zip_depth = [];
    zip_depth.length = 2 * zip_L_CODES + 1;
    zip_length_code = [];
    zip_length_code.length = zip_MAX_MATCH - zip_MIN_MATCH + 1;
    zip_dist_code = [];
    zip_dist_code.length = 512;
    zip_base_length = [];
    zip_base_length.length = zip_LENGTH_CODES;
    zip_base_dist = [];
    zip_base_dist.length = zip_D_CODES;
    zip_flag_buf = [];
    zip_flag_buf.length = parseInt(zip_LIT_BUFSIZE / 8, 10)
  }
  var zip_reuse_queue = function(p) {
    p.next = zip_free_queue;
    zip_free_queue = p
  };
  var zip_new_queue = function() {
    var p;
    if(zip_free_queue !== null) {
      p = zip_free_queue;
      zip_free_queue = zip_free_queue.next
    }else {
      p = new Zip_DeflateBuffer
    }
    p.next = null;
    p.len = p.off = 0;
    return p
  };
  var zip_head1 = function(i) {
    return zip_prev[zip_WSIZE + i]
  };
  var zip_head2 = function(i, val) {
    zip_prev[zip_WSIZE + i] = val;
    return val
  };
  var zip_qoutbuf = function() {
    var q, i;
    if(zip_outcnt !== 0) {
      q = zip_new_queue();
      if(zip_qhead === null) {
        zip_qhead = zip_qtail = q
      }else {
        zip_qtail = zip_qtail.next = q
      }
      q.len = zip_outcnt - zip_outoff;
      for(i = 0;i < q.len;i++) {
        q.ptr[i] = zip_outbuf[zip_outoff + i]
      }
      zip_outcnt = zip_outoff = 0
    }
  };
  var zip_put_byte = function(c) {
    zip_outbuf[zip_outoff + zip_outcnt++] = c;
    if(zip_outoff + zip_outcnt === zip_OUTBUFSIZ) {
      zip_qoutbuf()
    }
  };
  var zip_put_short = function(w) {
    w &= 65535;
    if(zip_outoff + zip_outcnt < zip_OUTBUFSIZ - 2) {
      zip_outbuf[zip_outoff + zip_outcnt++] = w & 255;
      zip_outbuf[zip_outoff + zip_outcnt++] = w >>> 8
    }else {
      zip_put_byte(w & 255);
      zip_put_byte(w >>> 8)
    }
  };
  var zip_INSERT_STRING = function() {
    zip_ins_h = (zip_ins_h << zip_H_SHIFT ^ zip_window[zip_strstart + zip_MIN_MATCH - 1] & 255) & zip_HASH_MASK;
    zip_hash_head = zip_head1(zip_ins_h);
    zip_prev[zip_strstart & zip_WMASK] = zip_hash_head;
    zip_head2(zip_ins_h, zip_strstart)
  };
  var zip_Buf_size = 16;
  var zip_send_bits = function(value, length) {
    if(zip_bi_valid > zip_Buf_size - length) {
      zip_bi_buf |= value << zip_bi_valid;
      zip_put_short(zip_bi_buf);
      zip_bi_buf = value >> zip_Buf_size - zip_bi_valid;
      zip_bi_valid += length - zip_Buf_size
    }else {
      zip_bi_buf |= value << zip_bi_valid;
      zip_bi_valid += length
    }
  };
  var zip_SEND_CODE = function(c, tree) {
    zip_send_bits(tree[c].fc, tree[c].dl)
  };
  var zip_D_CODE = function(dist) {
    return(dist < 256 ? zip_dist_code[dist] : zip_dist_code[256 + (dist >> 7)]) & 255
  };
  var zip_SMALLER = function(tree, n, m) {
    return tree[n].fc < tree[m].fc || tree[n].fc === tree[m].fc && zip_depth[n] <= zip_depth[m]
  };
  var zip_read_buff = function(buff, offset, n) {
    var i;
    for(i = 0;i < n && zip_deflate_pos < zip_deflate_data.length;i++) {
      buff[offset + i] = zip_deflate_data.charCodeAt(zip_deflate_pos++) & 255
    }
    return i
  };
  var zip_fill_window = function() {
    var n, m;
    var more = zip_window_size - zip_lookahead - zip_strstart;
    if(more === -1) {
      more--
    }else {
      if(zip_strstart >= zip_WSIZE + zip_MAX_DIST) {
        for(n = 0;n < zip_WSIZE;n++) {
          zip_window[n] = zip_window[n + zip_WSIZE]
        }
        zip_match_start -= zip_WSIZE;
        zip_strstart -= zip_WSIZE;
        zip_block_start -= zip_WSIZE;
        for(n = 0;n < zip_HASH_SIZE;n++) {
          m = zip_head1(n);
          zip_head2(n, m >= zip_WSIZE ? m - zip_WSIZE : zip_NIL)
        }
        for(n = 0;n < zip_WSIZE;n++) {
          m = zip_prev[n];
          zip_prev[n] = m >= zip_WSIZE ? m - zip_WSIZE : zip_NIL
        }
        more += zip_WSIZE
      }
    }
    if(!zip_eofile) {
      n = zip_read_buff(zip_window, zip_strstart + zip_lookahead, more);
      if(n <= 0) {
        zip_eofile = true
      }else {
        zip_lookahead += n
      }
    }
  };
  var zip_lm_init = function() {
    var j;
    for(j = 0;j < zip_HASH_SIZE;j++) {
      zip_prev[zip_WSIZE + j] = 0
    }
    zip_max_lazy_match = zip_configuration_table[zip_compr_level].max_lazy;
    zip_good_match = zip_configuration_table[zip_compr_level].good_length;
    if(!zip_FULL_SEARCH) {
      zip_nice_match = zip_configuration_table[zip_compr_level].nice_length
    }
    zip_max_chain_length = zip_configuration_table[zip_compr_level].max_chain;
    zip_strstart = 0;
    zip_block_start = 0;
    zip_lookahead = zip_read_buff(zip_window, 0, 2 * zip_WSIZE);
    if(zip_lookahead <= 0) {
      zip_eofile = true;
      zip_lookahead = 0;
      return
    }
    zip_eofile = false;
    while(zip_lookahead < zip_MIN_LOOKAHEAD && !zip_eofile) {
      zip_fill_window()
    }
    zip_ins_h = 0;
    for(j = 0;j < zip_MIN_MATCH - 1;j++) {
      zip_ins_h = (zip_ins_h << zip_H_SHIFT ^ zip_window[j] & 255) & zip_HASH_MASK
    }
  };
  var zip_longest_match = function(cur_match) {
    var chain_length = zip_max_chain_length;
    var scanp = zip_strstart;
    var matchp;
    var len;
    var best_len = zip_prev_length;
    var limit = zip_strstart > zip_MAX_DIST ? zip_strstart - zip_MAX_DIST : zip_NIL;
    var strendp = zip_strstart + zip_MAX_MATCH;
    var scan_end1 = zip_window[scanp + best_len - 1];
    var scan_end = zip_window[scanp + best_len];
    if(zip_prev_length >= zip_good_match) {
      chain_length >>= 2
    }
    do {
      matchp = cur_match;
      if(zip_window[matchp + best_len] !== scan_end || zip_window[matchp + best_len - 1] !== scan_end1 || zip_window[matchp] !== zip_window[scanp] || zip_window[++matchp] !== zip_window[scanp + 1]) {
        continue
      }
      scanp += 2;
      matchp++;
      do {
        ++scanp
      }while(zip_window[scanp] === zip_window[++matchp] && zip_window[++scanp] === zip_window[++matchp] && zip_window[++scanp] === zip_window[++matchp] && zip_window[++scanp] === zip_window[++matchp] && zip_window[++scanp] === zip_window[++matchp] && zip_window[++scanp] === zip_window[++matchp] && zip_window[++scanp] === zip_window[++matchp] && zip_window[++scanp] === zip_window[++matchp] && scanp < strendp);
      len = zip_MAX_MATCH - (strendp - scanp);
      scanp = strendp - zip_MAX_MATCH;
      if(len > best_len) {
        zip_match_start = cur_match;
        best_len = len;
        if(zip_FULL_SEARCH) {
          if(len >= zip_MAX_MATCH) {
            break
          }
        }else {
          if(len >= zip_nice_match) {
            break
          }
        }
        scan_end1 = zip_window[scanp + best_len - 1];
        scan_end = zip_window[scanp + best_len]
      }
      cur_match = zip_prev[cur_match & zip_WMASK]
    }while(cur_match > limit && --chain_length !== 0);
    return best_len
  };
  var zip_ct_tally = function(dist, lc) {
    zip_l_buf[zip_last_lit++] = lc;
    if(dist === 0) {
      zip_dyn_ltree[lc].fc++
    }else {
      dist--;
      zip_dyn_ltree[zip_length_code[lc] + zip_LITERALS + 1].fc++;
      zip_dyn_dtree[zip_D_CODE(dist)].fc++;
      zip_d_buf[zip_last_dist++] = dist;
      zip_flags |= zip_flag_bit
    }
    zip_flag_bit <<= 1;
    if((zip_last_lit & 7) === 0) {
      zip_flag_buf[zip_last_flags++] = zip_flags;
      zip_flags = 0;
      zip_flag_bit = 1
    }
    if(zip_compr_level > 2 && (zip_last_lit & 4095) === 0) {
      var out_length = zip_last_lit * 8;
      var in_length = zip_strstart - zip_block_start;
      var dcode;
      for(dcode = 0;dcode < zip_D_CODES;dcode++) {
        out_length += zip_dyn_dtree[dcode].fc * (5 + zip_extra_dbits[dcode])
      }
      out_length >>= 3;
      if(zip_last_dist < parseInt(zip_last_lit / 2, 10) && out_length < parseInt(in_length / 2, 10)) {
        return true
      }
    }
    return zip_last_lit === zip_LIT_BUFSIZE - 1 || zip_last_dist === zip_DIST_BUFSIZE
  };
  var zip_pqdownheap = function(tree, k) {
    var v = zip_heap[k];
    var j = k << 1;
    while(j <= zip_heap_len) {
      if(j < zip_heap_len && zip_SMALLER(tree, zip_heap[j + 1], zip_heap[j])) {
        j++
      }
      if(zip_SMALLER(tree, v, zip_heap[j])) {
        break
      }
      zip_heap[k] = zip_heap[j];
      k = j;
      j <<= 1
    }
    zip_heap[k] = v
  };
  var zip_gen_bitlen = function(desc) {
    var tree = desc.dyn_tree;
    var extra = desc.extra_bits;
    var base = desc.extra_base;
    var max_code = desc.max_code;
    var max_length = desc.max_length;
    var stree = desc.static_tree;
    var h;
    var n, m;
    var bits;
    var xbits;
    var f;
    var overflow = 0;
    for(bits = 0;bits <= zip_MAX_BITS;bits++) {
      zip_bl_count[bits] = 0
    }
    tree[zip_heap[zip_heap_max]].dl = 0;
    for(h = zip_heap_max + 1;h < zip_HEAP_SIZE;h++) {
      n = zip_heap[h];
      bits = tree[tree[n].dl].dl + 1;
      if(bits > max_length) {
        bits = max_length;
        overflow++
      }
      tree[n].dl = bits;
      if(n > max_code) {
        continue
      }
      zip_bl_count[bits]++;
      xbits = 0;
      if(n >= base) {
        xbits = extra[n - base]
      }
      f = tree[n].fc;
      zip_opt_len += f * (bits + xbits);
      if(stree !== null) {
        zip_static_len += f * (stree[n].dl + xbits)
      }
    }
    if(overflow === 0) {
      return
    }
    do {
      bits = max_length - 1;
      while(zip_bl_count[bits] === 0) {
        bits--
      }
      zip_bl_count[bits]--;
      zip_bl_count[bits + 1] += 2;
      zip_bl_count[max_length]--;
      overflow -= 2
    }while(overflow > 0);
    for(bits = max_length;bits !== 0;bits--) {
      n = zip_bl_count[bits];
      while(n !== 0) {
        m = zip_heap[--h];
        if(m > max_code) {
          continue
        }
        if(tree[m].dl !== bits) {
          zip_opt_len += (bits - tree[m].dl) * tree[m].fc;
          tree[m].fc = bits
        }
        n--
      }
    }
  };
  var zip_bi_reverse = function(code, len) {
    var res = 0;
    do {
      res |= code & 1;
      code >>= 1;
      res <<= 1
    }while(--len > 0);
    return res >> 1
  };
  var zip_gen_codes = function(tree, max_code) {
    var next_code = [];
    next_code.length = zip_MAX_BITS + 1;
    var code = 0;
    var bits;
    var n;
    for(bits = 1;bits <= zip_MAX_BITS;bits++) {
      code = code + zip_bl_count[bits - 1] << 1;
      next_code[bits] = code
    }
    var len;
    for(n = 0;n <= max_code;n++) {
      len = tree[n].dl;
      if(len === 0) {
        continue
      }
      tree[n].fc = zip_bi_reverse(next_code[len]++, len)
    }
  };
  var zip_build_tree = function(desc) {
    var tree = desc.dyn_tree;
    var stree = desc.static_tree;
    var elems = desc.elems;
    var n, m;
    var max_code = -1;
    var node = elems;
    zip_heap_len = 0;
    zip_heap_max = zip_HEAP_SIZE;
    for(n = 0;n < elems;n++) {
      if(tree[n].fc !== 0) {
        zip_heap[++zip_heap_len] = max_code = n;
        zip_depth[n] = 0
      }else {
        tree[n].dl = 0
      }
    }
    var xnew;
    while(zip_heap_len < 2) {
      xnew = zip_heap[++zip_heap_len] = max_code < 2 ? ++max_code : 0;
      tree[xnew].fc = 1;
      zip_depth[xnew] = 0;
      zip_opt_len--;
      if(stree !== null) {
        zip_static_len -= stree[xnew].dl
      }
    }
    desc.max_code = max_code;
    for(n = zip_heap_len >> 1;n >= 1;n--) {
      zip_pqdownheap(tree, n)
    }
    do {
      n = zip_heap[zip_SMALLEST];
      zip_heap[zip_SMALLEST] = zip_heap[zip_heap_len--];
      zip_pqdownheap(tree, zip_SMALLEST);
      m = zip_heap[zip_SMALLEST];
      zip_heap[--zip_heap_max] = n;
      zip_heap[--zip_heap_max] = m;
      tree[node].fc = tree[n].fc + tree[m].fc;
      if(zip_depth[n] > zip_depth[m] + 1) {
        zip_depth[node] = zip_depth[n]
      }else {
        zip_depth[node] = zip_depth[m] + 1
      }
      tree[n].dl = tree[m].dl = node;
      zip_heap[zip_SMALLEST] = node++;
      zip_pqdownheap(tree, zip_SMALLEST)
    }while(zip_heap_len >= 2);
    zip_heap[--zip_heap_max] = zip_heap[zip_SMALLEST];
    zip_gen_bitlen(desc);
    zip_gen_codes(tree, max_code)
  };
  var zip_scan_tree = function(tree, max_code) {
    var n;
    var prevlen = -1;
    var curlen;
    var nextlen = tree[0].dl;
    var count = 0;
    var max_count = 7;
    var min_count = 4;
    if(nextlen === 0) {
      max_count = 138;
      min_count = 3
    }
    tree[max_code + 1].dl = 65535;
    for(n = 0;n <= max_code;n++) {
      curlen = nextlen;
      nextlen = tree[n + 1].dl;
      if(++count < max_count && curlen === nextlen) {
        continue
      }
      if(count < min_count) {
        zip_bl_tree[curlen].fc += count
      }else {
        if(curlen !== 0) {
          if(curlen !== prevlen) {
            zip_bl_tree[curlen].fc++
          }
          zip_bl_tree[zip_REP_3_6].fc++
        }else {
          if(count <= 10) {
            zip_bl_tree[zip_REPZ_3_10].fc++
          }else {
            zip_bl_tree[zip_REPZ_11_138].fc++
          }
        }
      }
      count = 0;
      prevlen = curlen;
      if(nextlen === 0) {
        max_count = 138;
        min_count = 3
      }else {
        if(curlen === nextlen) {
          max_count = 6;
          min_count = 3
        }else {
          max_count = 7;
          min_count = 4
        }
      }
    }
  };
  var zip_build_bl_tree = function() {
    var max_blindex;
    zip_scan_tree(zip_dyn_ltree, zip_l_desc.max_code);
    zip_scan_tree(zip_dyn_dtree, zip_d_desc.max_code);
    zip_build_tree(zip_bl_desc);
    for(max_blindex = zip_BL_CODES - 1;max_blindex >= 3;max_blindex--) {
      if(zip_bl_tree[zip_bl_order[max_blindex]].dl !== 0) {
        break
      }
    }
    zip_opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
    return max_blindex
  };
  var zip_bi_windup = function() {
    if(zip_bi_valid > 8) {
      zip_put_short(zip_bi_buf)
    }else {
      if(zip_bi_valid > 0) {
        zip_put_byte(zip_bi_buf)
      }
    }
    zip_bi_buf = 0;
    zip_bi_valid = 0
  };
  var zip_compress_block = function(ltree, dtree) {
    var dist;
    var lc;
    var lx = 0;
    var dx = 0;
    var fx = 0;
    var flag = 0;
    var code;
    var extra;
    if(zip_last_lit !== 0) {
      do {
        if((lx & 7) === 0) {
          flag = zip_flag_buf[fx++]
        }
        lc = zip_l_buf[lx++] & 255;
        if((flag & 1) === 0) {
          zip_SEND_CODE(lc, ltree)
        }else {
          code = zip_length_code[lc];
          zip_SEND_CODE(code + zip_LITERALS + 1, ltree);
          extra = zip_extra_lbits[code];
          if(extra !== 0) {
            lc -= zip_base_length[code];
            zip_send_bits(lc, extra)
          }
          dist = zip_d_buf[dx++];
          code = zip_D_CODE(dist);
          zip_SEND_CODE(code, dtree);
          extra = zip_extra_dbits[code];
          if(extra !== 0) {
            dist -= zip_base_dist[code];
            zip_send_bits(dist, extra)
          }
        }
        flag >>= 1
      }while(lx < zip_last_lit)
    }
    zip_SEND_CODE(zip_END_BLOCK, ltree)
  };
  var zip_send_tree = function(tree, max_code) {
    var n;
    var prevlen = -1;
    var curlen;
    var nextlen = tree[0].dl;
    var count = 0;
    var max_count = 7;
    var min_count = 4;
    if(nextlen === 0) {
      max_count = 138;
      min_count = 3
    }
    for(n = 0;n <= max_code;n++) {
      curlen = nextlen;
      nextlen = tree[n + 1].dl;
      if(++count < max_count && curlen === nextlen) {
        continue
      }
      if(count < min_count) {
        do {
          zip_SEND_CODE(curlen, zip_bl_tree)
        }while(--count !== 0)
      }else {
        if(curlen !== 0) {
          if(curlen !== prevlen) {
            zip_SEND_CODE(curlen, zip_bl_tree);
            count--
          }
          zip_SEND_CODE(zip_REP_3_6, zip_bl_tree);
          zip_send_bits(count - 3, 2)
        }else {
          if(count <= 10) {
            zip_SEND_CODE(zip_REPZ_3_10, zip_bl_tree);
            zip_send_bits(count - 3, 3)
          }else {
            zip_SEND_CODE(zip_REPZ_11_138, zip_bl_tree);
            zip_send_bits(count - 11, 7)
          }
        }
      }
      count = 0;
      prevlen = curlen;
      if(nextlen === 0) {
        max_count = 138;
        min_count = 3
      }else {
        if(curlen === nextlen) {
          max_count = 6;
          min_count = 3
        }else {
          max_count = 7;
          min_count = 4
        }
      }
    }
  };
  var zip_send_all_trees = function(lcodes, dcodes, blcodes) {
    var rank;
    zip_send_bits(lcodes - 257, 5);
    zip_send_bits(dcodes - 1, 5);
    zip_send_bits(blcodes - 4, 4);
    for(rank = 0;rank < blcodes;rank++) {
      zip_send_bits(zip_bl_tree[zip_bl_order[rank]].dl, 3)
    }
    zip_send_tree(zip_dyn_ltree, lcodes - 1);
    zip_send_tree(zip_dyn_dtree, dcodes - 1)
  };
  var zip_init_block = function() {
    var n;
    for(n = 0;n < zip_L_CODES;n++) {
      zip_dyn_ltree[n].fc = 0
    }
    for(n = 0;n < zip_D_CODES;n++) {
      zip_dyn_dtree[n].fc = 0
    }
    for(n = 0;n < zip_BL_CODES;n++) {
      zip_bl_tree[n].fc = 0
    }
    zip_dyn_ltree[zip_END_BLOCK].fc = 1;
    zip_opt_len = zip_static_len = 0;
    zip_last_lit = zip_last_dist = zip_last_flags = 0;
    zip_flags = 0;
    zip_flag_bit = 1
  };
  var zip_flush_block = function(eof) {
    var opt_lenb, static_lenb;
    var max_blindex;
    var stored_len;
    stored_len = zip_strstart - zip_block_start;
    zip_flag_buf[zip_last_flags] = zip_flags;
    zip_build_tree(zip_l_desc);
    zip_build_tree(zip_d_desc);
    max_blindex = zip_build_bl_tree();
    opt_lenb = zip_opt_len + 3 + 7 >> 3;
    static_lenb = zip_static_len + 3 + 7 >> 3;
    if(static_lenb <= opt_lenb) {
      opt_lenb = static_lenb
    }
    if(stored_len + 4 <= opt_lenb && zip_block_start >= 0) {
      var i;
      zip_send_bits((zip_STORED_BLOCK << 1) + eof, 3);
      zip_bi_windup();
      zip_put_short(stored_len);
      zip_put_short(~stored_len);
      for(i = 0;i < stored_len;i++) {
        zip_put_byte(zip_window[zip_block_start + i])
      }
    }else {
      if(static_lenb === opt_lenb) {
        zip_send_bits((zip_STATIC_TREES << 1) + eof, 3);
        zip_compress_block(zip_static_ltree, zip_static_dtree)
      }else {
        zip_send_bits((zip_DYN_TREES << 1) + eof, 3);
        zip_send_all_trees(zip_l_desc.max_code + 1, zip_d_desc.max_code + 1, max_blindex + 1);
        zip_compress_block(zip_dyn_ltree, zip_dyn_dtree)
      }
    }
    zip_init_block();
    if(eof !== 0) {
      zip_bi_windup()
    }
  };
  var zip_deflate_fast = function() {
    var flush;
    while(zip_lookahead !== 0 && zip_qhead === null) {
      zip_INSERT_STRING();
      if(zip_hash_head !== zip_NIL && zip_strstart - zip_hash_head <= zip_MAX_DIST) {
        zip_match_length = zip_longest_match(zip_hash_head);
        if(zip_match_length > zip_lookahead) {
          zip_match_length = zip_lookahead
        }
      }
      if(zip_match_length >= zip_MIN_MATCH) {
        flush = zip_ct_tally(zip_strstart - zip_match_start, zip_match_length - zip_MIN_MATCH);
        zip_lookahead -= zip_match_length;
        if(zip_match_length <= zip_max_lazy_match) {
          zip_match_length--;
          do {
            zip_strstart++;
            zip_INSERT_STRING()
          }while(--zip_match_length !== 0);
          zip_strstart++
        }else {
          zip_strstart += zip_match_length;
          zip_match_length = 0;
          zip_ins_h = zip_window[zip_strstart] & 255;
          zip_ins_h = (zip_ins_h << zip_H_SHIFT ^ zip_window[zip_strstart + 1] & 255) & zip_HASH_MASK
        }
      }else {
        flush = zip_ct_tally(0, zip_window[zip_strstart] & 255);
        zip_lookahead--;
        zip_strstart++
      }
      if(flush) {
        zip_flush_block(0);
        zip_block_start = zip_strstart
      }
      while(zip_lookahead < zip_MIN_LOOKAHEAD && !zip_eofile) {
        zip_fill_window()
      }
    }
  };
  var zip_deflate_better = function() {
    var flush;
    while(zip_lookahead !== 0 && zip_qhead === null) {
      zip_INSERT_STRING();
      zip_prev_length = zip_match_length;
      zip_prev_match = zip_match_start;
      zip_match_length = zip_MIN_MATCH - 1;
      if(zip_hash_head !== zip_NIL && zip_prev_length < zip_max_lazy_match && zip_strstart - zip_hash_head <= zip_MAX_DIST) {
        zip_match_length = zip_longest_match(zip_hash_head);
        if(zip_match_length > zip_lookahead) {
          zip_match_length = zip_lookahead
        }
        if(zip_match_length === zip_MIN_MATCH && zip_strstart - zip_match_start > zip_TOO_FAR) {
          zip_match_length--
        }
      }
      if(zip_prev_length >= zip_MIN_MATCH && zip_match_length <= zip_prev_length) {
        flush = zip_ct_tally(zip_strstart - 1 - zip_prev_match, zip_prev_length - zip_MIN_MATCH);
        zip_lookahead -= zip_prev_length - 1;
        zip_prev_length -= 2;
        do {
          zip_strstart++;
          zip_INSERT_STRING()
        }while(--zip_prev_length !== 0);
        zip_match_available = 0;
        zip_match_length = zip_MIN_MATCH - 1;
        zip_strstart++;
        if(flush) {
          zip_flush_block(0);
          zip_block_start = zip_strstart
        }
      }else {
        if(zip_match_available !== 0) {
          if(zip_ct_tally(0, zip_window[zip_strstart - 1] & 255)) {
            zip_flush_block(0);
            zip_block_start = zip_strstart
          }
          zip_strstart++;
          zip_lookahead--
        }else {
          zip_match_available = 1;
          zip_strstart++;
          zip_lookahead--
        }
      }
      while(zip_lookahead < zip_MIN_LOOKAHEAD && !zip_eofile) {
        zip_fill_window()
      }
    }
  };
  var zip_ct_init = function() {
    var n;
    var bits;
    var length;
    var code;
    var dist;
    if(zip_static_dtree[0].dl !== 0) {
      return
    }
    zip_l_desc.dyn_tree = zip_dyn_ltree;
    zip_l_desc.static_tree = zip_static_ltree;
    zip_l_desc.extra_bits = zip_extra_lbits;
    zip_l_desc.extra_base = zip_LITERALS + 1;
    zip_l_desc.elems = zip_L_CODES;
    zip_l_desc.max_length = zip_MAX_BITS;
    zip_l_desc.max_code = 0;
    zip_d_desc.dyn_tree = zip_dyn_dtree;
    zip_d_desc.static_tree = zip_static_dtree;
    zip_d_desc.extra_bits = zip_extra_dbits;
    zip_d_desc.extra_base = 0;
    zip_d_desc.elems = zip_D_CODES;
    zip_d_desc.max_length = zip_MAX_BITS;
    zip_d_desc.max_code = 0;
    zip_bl_desc.dyn_tree = zip_bl_tree;
    zip_bl_desc.static_tree = null;
    zip_bl_desc.extra_bits = zip_extra_blbits;
    zip_bl_desc.extra_base = 0;
    zip_bl_desc.elems = zip_BL_CODES;
    zip_bl_desc.max_length = zip_MAX_BL_BITS;
    zip_bl_desc.max_code = 0;
    length = 0;
    for(code = 0;code < zip_LENGTH_CODES - 1;code++) {
      zip_base_length[code] = length;
      for(n = 0;n < 1 << zip_extra_lbits[code];n++) {
        zip_length_code[length++] = code
      }
    }
    zip_length_code[length - 1] = code;
    dist = 0;
    for(code = 0;code < 16;code++) {
      zip_base_dist[code] = dist;
      for(n = 0;n < 1 << zip_extra_dbits[code];n++) {
        zip_dist_code[dist++] = code
      }
    }
    dist >>= 7;
    n = code;
    for(code = n;code < zip_D_CODES;code++) {
      zip_base_dist[code] = dist << 7;
      for(n = 0;n < 1 << zip_extra_dbits[code] - 7;n++) {
        zip_dist_code[256 + dist++] = code
      }
    }
    for(bits = 0;bits <= zip_MAX_BITS;bits++) {
      zip_bl_count[bits] = 0
    }
    n = 0;
    while(n <= 143) {
      zip_static_ltree[n++].dl = 8;
      zip_bl_count[8]++
    }
    while(n <= 255) {
      zip_static_ltree[n++].dl = 9;
      zip_bl_count[9]++
    }
    while(n <= 279) {
      zip_static_ltree[n++].dl = 7;
      zip_bl_count[7]++
    }
    while(n <= 287) {
      zip_static_ltree[n++].dl = 8;
      zip_bl_count[8]++
    }
    zip_gen_codes(zip_static_ltree, zip_L_CODES + 1);
    for(n = 0;n < zip_D_CODES;n++) {
      zip_static_dtree[n].dl = 5;
      zip_static_dtree[n].fc = zip_bi_reverse(n, 5)
    }
    zip_init_block()
  };
  var zip_init_deflate = function() {
    if(zip_eofile) {
      return
    }
    zip_bi_buf = 0;
    zip_bi_valid = 0;
    zip_ct_init();
    zip_lm_init();
    zip_qhead = null;
    zip_outcnt = 0;
    zip_outoff = 0;
    if(zip_compr_level <= 3) {
      zip_prev_length = zip_MIN_MATCH - 1;
      zip_match_length = 0
    }else {
      zip_match_length = zip_MIN_MATCH - 1;
      zip_match_available = 0
    }
    zip_complete = false
  };
  var zip_qcopy = function(buff, off, buff_size) {
    var n, i, j, p;
    n = 0;
    while(zip_qhead !== null && n < buff_size) {
      i = buff_size - n;
      if(i > zip_qhead.len) {
        i = zip_qhead.len
      }
      for(j = 0;j < i;j++) {
        buff[off + n + j] = zip_qhead.ptr[zip_qhead.off + j]
      }
      zip_qhead.off += i;
      zip_qhead.len -= i;
      n += i;
      if(zip_qhead.len === 0) {
        p = zip_qhead;
        zip_qhead = zip_qhead.next;
        zip_reuse_queue(p)
      }
    }
    if(n === buff_size) {
      return n
    }
    if(zip_outoff < zip_outcnt) {
      i = buff_size - n;
      if(i > zip_outcnt - zip_outoff) {
        i = zip_outcnt - zip_outoff
      }
      for(j = 0;j < i;j++) {
        buff[off + n + j] = zip_outbuf[zip_outoff + j]
      }
      zip_outoff += i;
      n += i;
      if(zip_outcnt === zip_outoff) {
        zip_outcnt = zip_outoff = 0
      }
    }
    return n
  };
  var zip_deflate_internal = function(buff, off, buff_size) {
    var n;
    if(!zip_initflag) {
      zip_init_deflate();
      zip_initflag = true;
      if(zip_lookahead === 0) {
        zip_complete = true;
        return 0
      }
    }
    n = zip_qcopy(buff, off, buff_size);
    if(n === buff_size) {
      return buff_size
    }
    if(zip_complete) {
      return n
    }
    if(zip_compr_level <= 3) {
      zip_deflate_fast()
    }else {
      zip_deflate_better()
    }
    if(zip_lookahead === 0) {
      if(zip_match_available !== 0) {
        zip_ct_tally(0, zip_window[zip_strstart - 1] & 255)
      }
      zip_flush_block(1);
      zip_complete = true
    }
    return n + zip_qcopy(buff, n + off, buff_size - n)
  };
  var zip_deflate = function(str, level) {
    var i, j;
    zip_deflate_data = str;
    zip_deflate_pos = 0;
    if(String(typeof level) === "undefined") {
      level = zip_DEFAULT_LEVEL
    }
    zip_deflate_start(level);
    var buff = new Array(1024);
    var aout = [], cbuf = [];
    i = zip_deflate_internal(buff, 0, buff.length);
    while(i > 0) {
      cbuf.length = i;
      for(j = 0;j < i;j++) {
        cbuf[j] = String.fromCharCode(buff[j])
      }
      aout[aout.length] = cbuf.join("");
      i = zip_deflate_internal(buff, 0, buff.length)
    }
    zip_deflate_data = null;
    return aout.join("")
  };
  this.deflate = zip_deflate
};
core.ByteArray = function ByteArray(data) {
  this.pos = 0;
  this.data = data;
  this.readUInt32LE = function() {
    this.pos += 4;
    var d = this.data, pos = this.pos;
    return d[--pos] << 24 | d[--pos] << 16 | d[--pos] << 8 | d[--pos]
  };
  this.readUInt16LE = function() {
    this.pos += 2;
    var d = this.data, pos = this.pos;
    return d[--pos] << 8 | d[--pos]
  }
};
core.ByteArrayWriter = function ByteArrayWriter(encoding) {
  var self = this, data = new runtime.ByteArray(0);
  this.appendByteArrayWriter = function(writer) {
    data = runtime.concatByteArrays(data, writer.getByteArray())
  };
  this.appendByteArray = function(array) {
    data = runtime.concatByteArrays(data, array)
  };
  this.appendArray = function(array) {
    data = runtime.concatByteArrays(data, runtime.byteArrayFromArray(array))
  };
  this.appendUInt16LE = function(value) {
    self.appendArray([value & 255, value >> 8 & 255])
  };
  this.appendUInt32LE = function(value) {
    self.appendArray([value & 255, value >> 8 & 255, value >> 16 & 255, value >> 24 & 255])
  };
  this.appendString = function(string) {
    data = runtime.concatByteArrays(data, runtime.byteArrayFromString(string, encoding))
  };
  this.getLength = function() {
    return data.length
  };
  this.getByteArray = function() {
    return data
  }
};
core.RawInflate = function RawInflate() {
  var zip_WSIZE = 32768;
  var zip_STORED_BLOCK = 0;
  var zip_STATIC_TREES = 1;
  var zip_DYN_TREES = 2;
  var zip_lbits = 9;
  var zip_dbits = 6;
  var zip_INBUFSIZ = 32768;
  var zip_INBUF_EXTRA = 64;
  var zip_slide;
  var zip_wp;
  var zip_fixed_tl = null;
  var zip_fixed_td;
  var zip_fixed_bl, fixed_bd;
  var zip_bit_buf;
  var zip_bit_len;
  var zip_method;
  var zip_eof;
  var zip_copy_leng;
  var zip_copy_dist;
  var zip_tl, zip_td;
  var zip_bl, zip_bd;
  var zip_inflate_data;
  var zip_inflate_pos;
  var zip_MASK_BITS = new Array(0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535);
  var zip_cplens = new Array(3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0);
  var zip_cplext = new Array(0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 99, 99);
  var zip_cpdist = new Array(1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577);
  var zip_cpdext = new Array(0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13);
  var zip_border = new Array(16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15);
  var zip_HuftList = function() {
    this.next = null;
    this.list = null
  };
  var zip_HuftNode = function() {
    this.e = 0;
    this.b = 0;
    this.n = 0;
    this.t = null
  };
  var zip_HuftBuild = function(b, n, s, d, e, mm) {
    this.BMAX = 16;
    this.N_MAX = 288;
    this.status = 0;
    this.root = null;
    this.m = 0;
    var a;
    var c = new Array(this.BMAX + 1);
    var el;
    var f;
    var g;
    var h;
    var i;
    var j;
    var k;
    var lx = new Array(this.BMAX + 1);
    var p;
    var pidx;
    var q;
    var r = new zip_HuftNode;
    var u = new Array(this.BMAX);
    var v = new Array(this.N_MAX);
    var w;
    var x = new Array(this.BMAX + 1);
    var xp;
    var y;
    var z;
    var o;
    var tail;
    tail = this.root = null;
    for(i = 0;i < c.length;i++) {
      c[i] = 0
    }
    for(i = 0;i < lx.length;i++) {
      lx[i] = 0
    }
    for(i = 0;i < u.length;i++) {
      u[i] = null
    }
    for(i = 0;i < v.length;i++) {
      v[i] = 0
    }
    for(i = 0;i < x.length;i++) {
      x[i] = 0
    }
    el = n > 256 ? b[256] : this.BMAX;
    p = b;
    pidx = 0;
    i = n;
    do {
      c[p[pidx]]++;
      pidx++
    }while(--i > 0);
    if(c[0] == n) {
      this.root = null;
      this.m = 0;
      this.status = 0;
      return
    }
    for(j = 1;j <= this.BMAX;j++) {
      if(c[j] != 0) {
        break
      }
    }
    k = j;
    if(mm < j) {
      mm = j
    }
    for(i = this.BMAX;i != 0;i--) {
      if(c[i] != 0) {
        break
      }
    }
    g = i;
    if(mm > i) {
      mm = i
    }
    for(y = 1 << j;j < i;j++, y <<= 1) {
      if((y -= c[j]) < 0) {
        this.status = 2;
        this.m = mm;
        return
      }
    }
    if((y -= c[i]) < 0) {
      this.status = 2;
      this.m = mm;
      return
    }
    c[i] += y;
    x[1] = j = 0;
    p = c;
    pidx = 1;
    xp = 2;
    while(--i > 0) {
      x[xp++] = j += p[pidx++]
    }
    p = b;
    pidx = 0;
    i = 0;
    do {
      if((j = p[pidx++]) != 0) {
        v[x[j]++] = i
      }
    }while(++i < n);
    n = x[g];
    x[0] = i = 0;
    p = v;
    pidx = 0;
    h = -1;
    w = lx[0] = 0;
    q = null;
    z = 0;
    for(;k <= g;k++) {
      a = c[k];
      while(a-- > 0) {
        while(k > w + lx[1 + h]) {
          w += lx[1 + h];
          h++;
          z = (z = g - w) > mm ? mm : z;
          if((f = 1 << (j = k - w)) > a + 1) {
            f -= a + 1;
            xp = k;
            while(++j < z) {
              if((f <<= 1) <= c[++xp]) {
                break
              }
              f -= c[xp]
            }
          }
          if(w + j > el && w < el) {
            j = el - w
          }
          z = 1 << j;
          lx[1 + h] = j;
          q = new Array(z);
          for(o = 0;o < z;o++) {
            q[o] = new zip_HuftNode
          }
          if(tail == null) {
            tail = this.root = new zip_HuftList
          }else {
            tail = tail.next = new zip_HuftList
          }
          tail.next = null;
          tail.list = q;
          u[h] = q;
          if(h > 0) {
            x[h] = i;
            r.b = lx[h];
            r.e = 16 + j;
            r.t = q;
            j = (i & (1 << w) - 1) >> w - lx[h];
            u[h - 1][j].e = r.e;
            u[h - 1][j].b = r.b;
            u[h - 1][j].n = r.n;
            u[h - 1][j].t = r.t
          }
        }
        r.b = k - w;
        if(pidx >= n) {
          r.e = 99
        }else {
          if(p[pidx] < s) {
            r.e = p[pidx] < 256 ? 16 : 15;
            r.n = p[pidx++]
          }else {
            r.e = e[p[pidx] - s];
            r.n = d[p[pidx++] - s]
          }
        }
        f = 1 << k - w;
        for(j = i >> w;j < z;j += f) {
          q[j].e = r.e;
          q[j].b = r.b;
          q[j].n = r.n;
          q[j].t = r.t
        }
        for(j = 1 << k - 1;(i & j) != 0;j >>= 1) {
          i ^= j
        }
        i ^= j;
        while((i & (1 << w) - 1) != x[h]) {
          w -= lx[h];
          h--
        }
      }
    }
    this.m = lx[1];
    this.status = y != 0 && g != 1 ? 1 : 0
  };
  var zip_GET_BYTE = function() {
    if(zip_inflate_data.length == zip_inflate_pos) {
      return-1
    }
    return zip_inflate_data[zip_inflate_pos++]
  };
  var zip_NEEDBITS = function(n) {
    while(zip_bit_len < n) {
      zip_bit_buf |= zip_GET_BYTE() << zip_bit_len;
      zip_bit_len += 8
    }
  };
  var zip_GETBITS = function(n) {
    return zip_bit_buf & zip_MASK_BITS[n]
  };
  var zip_DUMPBITS = function(n) {
    zip_bit_buf >>= n;
    zip_bit_len -= n
  };
  var zip_inflate_codes = function(buff, off, size) {
    var e;
    var t;
    var n;
    if(size == 0) {
      return 0
    }
    n = 0;
    for(;;) {
      zip_NEEDBITS(zip_bl);
      t = zip_tl.list[zip_GETBITS(zip_bl)];
      e = t.e;
      while(e > 16) {
        if(e == 99) {
          return-1
        }
        zip_DUMPBITS(t.b);
        e -= 16;
        zip_NEEDBITS(e);
        t = t.t[zip_GETBITS(e)];
        e = t.e
      }
      zip_DUMPBITS(t.b);
      if(e == 16) {
        zip_wp &= zip_WSIZE - 1;
        buff[off + n++] = zip_slide[zip_wp++] = t.n;
        if(n == size) {
          return size
        }
        continue
      }
      if(e == 15) {
        break
      }
      zip_NEEDBITS(e);
      zip_copy_leng = t.n + zip_GETBITS(e);
      zip_DUMPBITS(e);
      zip_NEEDBITS(zip_bd);
      t = zip_td.list[zip_GETBITS(zip_bd)];
      e = t.e;
      while(e > 16) {
        if(e == 99) {
          return-1
        }
        zip_DUMPBITS(t.b);
        e -= 16;
        zip_NEEDBITS(e);
        t = t.t[zip_GETBITS(e)];
        e = t.e
      }
      zip_DUMPBITS(t.b);
      zip_NEEDBITS(e);
      zip_copy_dist = zip_wp - t.n - zip_GETBITS(e);
      zip_DUMPBITS(e);
      while(zip_copy_leng > 0 && n < size) {
        zip_copy_leng--;
        zip_copy_dist &= zip_WSIZE - 1;
        zip_wp &= zip_WSIZE - 1;
        buff[off + n++] = zip_slide[zip_wp++] = zip_slide[zip_copy_dist++]
      }
      if(n == size) {
        return size
      }
    }
    zip_method = -1;
    return n
  };
  var zip_inflate_stored = function(buff, off, size) {
    var n;
    n = zip_bit_len & 7;
    zip_DUMPBITS(n);
    zip_NEEDBITS(16);
    n = zip_GETBITS(16);
    zip_DUMPBITS(16);
    zip_NEEDBITS(16);
    if(n != (~zip_bit_buf & 65535)) {
      return-1
    }
    zip_DUMPBITS(16);
    zip_copy_leng = n;
    n = 0;
    while(zip_copy_leng > 0 && n < size) {
      zip_copy_leng--;
      zip_wp &= zip_WSIZE - 1;
      zip_NEEDBITS(8);
      buff[off + n++] = zip_slide[zip_wp++] = zip_GETBITS(8);
      zip_DUMPBITS(8)
    }
    if(zip_copy_leng == 0) {
      zip_method = -1
    }
    return n
  };
  var zip_fixed_bd;
  var zip_inflate_fixed = function(buff, off, size) {
    if(zip_fixed_tl == null) {
      var i;
      var l = new Array(288);
      var h;
      for(i = 0;i < 144;i++) {
        l[i] = 8
      }
      for(;i < 256;i++) {
        l[i] = 9
      }
      for(;i < 280;i++) {
        l[i] = 7
      }
      for(;i < 288;i++) {
        l[i] = 8
      }
      zip_fixed_bl = 7;
      h = new zip_HuftBuild(l, 288, 257, zip_cplens, zip_cplext, zip_fixed_bl);
      if(h.status != 0) {
        alert("HufBuild error: " + h.status);
        return-1
      }
      zip_fixed_tl = h.root;
      zip_fixed_bl = h.m;
      for(i = 0;i < 30;i++) {
        l[i] = 5
      }
      zip_fixed_bd = 5;
      h = new zip_HuftBuild(l, 30, 0, zip_cpdist, zip_cpdext, zip_fixed_bd);
      if(h.status > 1) {
        zip_fixed_tl = null;
        alert("HufBuild error: " + h.status);
        return-1
      }
      zip_fixed_td = h.root;
      zip_fixed_bd = h.m
    }
    zip_tl = zip_fixed_tl;
    zip_td = zip_fixed_td;
    zip_bl = zip_fixed_bl;
    zip_bd = zip_fixed_bd;
    return zip_inflate_codes(buff, off, size)
  };
  var zip_inflate_dynamic = function(buff, off, size) {
    var i;
    var j;
    var l;
    var n;
    var t;
    var nb;
    var nl;
    var nd;
    var ll = new Array(286 + 30);
    var h;
    for(i = 0;i < ll.length;i++) {
      ll[i] = 0
    }
    zip_NEEDBITS(5);
    nl = 257 + zip_GETBITS(5);
    zip_DUMPBITS(5);
    zip_NEEDBITS(5);
    nd = 1 + zip_GETBITS(5);
    zip_DUMPBITS(5);
    zip_NEEDBITS(4);
    nb = 4 + zip_GETBITS(4);
    zip_DUMPBITS(4);
    if(nl > 286 || nd > 30) {
      return-1
    }
    for(j = 0;j < nb;j++) {
      zip_NEEDBITS(3);
      ll[zip_border[j]] = zip_GETBITS(3);
      zip_DUMPBITS(3)
    }
    for(;j < 19;j++) {
      ll[zip_border[j]] = 0
    }
    zip_bl = 7;
    h = new zip_HuftBuild(ll, 19, 19, null, null, zip_bl);
    if(h.status != 0) {
      return-1
    }
    zip_tl = h.root;
    zip_bl = h.m;
    n = nl + nd;
    i = l = 0;
    while(i < n) {
      zip_NEEDBITS(zip_bl);
      t = zip_tl.list[zip_GETBITS(zip_bl)];
      j = t.b;
      zip_DUMPBITS(j);
      j = t.n;
      if(j < 16) {
        ll[i++] = l = j
      }else {
        if(j == 16) {
          zip_NEEDBITS(2);
          j = 3 + zip_GETBITS(2);
          zip_DUMPBITS(2);
          if(i + j > n) {
            return-1
          }
          while(j-- > 0) {
            ll[i++] = l
          }
        }else {
          if(j == 17) {
            zip_NEEDBITS(3);
            j = 3 + zip_GETBITS(3);
            zip_DUMPBITS(3);
            if(i + j > n) {
              return-1
            }
            while(j-- > 0) {
              ll[i++] = 0
            }
            l = 0
          }else {
            zip_NEEDBITS(7);
            j = 11 + zip_GETBITS(7);
            zip_DUMPBITS(7);
            if(i + j > n) {
              return-1
            }
            while(j-- > 0) {
              ll[i++] = 0
            }
            l = 0
          }
        }
      }
    }
    zip_bl = zip_lbits;
    h = new zip_HuftBuild(ll, nl, 257, zip_cplens, zip_cplext, zip_bl);
    if(zip_bl == 0) {
      h.status = 1
    }
    if(h.status != 0) {
      return-1
    }
    zip_tl = h.root;
    zip_bl = h.m;
    for(i = 0;i < nd;i++) {
      ll[i] = ll[i + nl]
    }
    zip_bd = zip_dbits;
    h = new zip_HuftBuild(ll, nd, 0, zip_cpdist, zip_cpdext, zip_bd);
    zip_td = h.root;
    zip_bd = h.m;
    if(zip_bd == 0 && nl > 257) {
      return-1
    }
    if(h.status != 0) {
      return-1
    }
    return zip_inflate_codes(buff, off, size)
  };
  var zip_inflate_start = function() {
    var i;
    if(zip_slide == null) {
      zip_slide = new Array(2 * zip_WSIZE)
    }
    zip_wp = 0;
    zip_bit_buf = 0;
    zip_bit_len = 0;
    zip_method = -1;
    zip_eof = false;
    zip_copy_leng = zip_copy_dist = 0;
    zip_tl = null
  };
  var zip_inflate_internal = function(buff, off, size) {
    var n, i;
    n = 0;
    while(n < size) {
      if(zip_eof && zip_method == -1) {
        return n
      }
      if(zip_copy_leng > 0) {
        if(zip_method != zip_STORED_BLOCK) {
          while(zip_copy_leng > 0 && n < size) {
            zip_copy_leng--;
            zip_copy_dist &= zip_WSIZE - 1;
            zip_wp &= zip_WSIZE - 1;
            buff[off + n++] = zip_slide[zip_wp++] = zip_slide[zip_copy_dist++]
          }
        }else {
          while(zip_copy_leng > 0 && n < size) {
            zip_copy_leng--;
            zip_wp &= zip_WSIZE - 1;
            zip_NEEDBITS(8);
            buff[off + n++] = zip_slide[zip_wp++] = zip_GETBITS(8);
            zip_DUMPBITS(8)
          }
          if(zip_copy_leng == 0) {
            zip_method = -1
          }
        }
        if(n == size) {
          return n
        }
      }
      if(zip_method == -1) {
        if(zip_eof) {
          break
        }
        zip_NEEDBITS(1);
        if(zip_GETBITS(1) != 0) {
          zip_eof = true
        }
        zip_DUMPBITS(1);
        zip_NEEDBITS(2);
        zip_method = zip_GETBITS(2);
        zip_DUMPBITS(2);
        zip_tl = null;
        zip_copy_leng = 0
      }
      switch(zip_method) {
        case 0:
          i = zip_inflate_stored(buff, off + n, size - n);
          break;
        case 1:
          if(zip_tl != null) {
            i = zip_inflate_codes(buff, off + n, size - n)
          }else {
            i = zip_inflate_fixed(buff, off + n, size - n)
          }
          break;
        case 2:
          if(zip_tl != null) {
            i = zip_inflate_codes(buff, off + n, size - n)
          }else {
            i = zip_inflate_dynamic(buff, off + n, size - n)
          }
          break;
        default:
          i = -1;
          break
      }
      if(i == -1) {
        if(zip_eof) {
          return 0
        }
        return-1
      }
      n += i
    }
    return n
  };
  var zip_inflate = function(data, size) {
    var i, j;
    zip_inflate_start();
    zip_inflate_data = data;
    zip_inflate_pos = 0;
    var buff = new runtime.ByteArray(size);
    zip_inflate_internal(buff, 0, size);
    zip_inflate_data = null;
    return buff
  };
  this.inflate = zip_inflate
};
/*

 Copyright (C) 2012 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
core.LoopWatchDog = function LoopWatchDog(timeout, maxChecks) {
  var startTime = Date.now(), checks = 0;
  function check() {
    var t;
    if(timeout) {
      t = Date.now();
      if(t - startTime > timeout) {
        runtime.log("alert", "watchdog timeout");
        throw"timeout!";
      }
    }
    if(maxChecks > 0) {
      checks += 1;
      if(checks > maxChecks) {
        runtime.log("alert", "watchdog loop overflow");
        throw"loop overflow";
      }
    }
  }
  this.check = check
};
core.Utils = function Utils() {
  function hashString(value) {
    var hash = 0, i, l;
    for(i = 0, l = value.length;i < l;i += 1) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0
    }
    return hash
  }
  this.hashString = hashString;
  function mergeObjects(destination, source) {
    if(source && Array.isArray(source)) {
      destination = (destination || []).concat(source.map(function(obj) {
        return mergeObjects({}, obj)
      }))
    }else {
      if(source && typeof source === "object") {
        destination = destination || {};
        Object.keys(source).forEach(function(p) {
          destination[p] = mergeObjects(destination[p], source[p])
        })
      }else {
        destination = source
      }
    }
    return destination
  }
  this.mergeObjects = mergeObjects
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
core.DomUtils = function DomUtils() {
  function findStablePoint(container, offset) {
    if(offset < container.childNodes.length) {
      container = container.childNodes[offset];
      offset = 0;
      while(container.firstChild) {
        container = container.firstChild
      }
    }else {
      while(container.lastChild) {
        container = container.lastChild;
        offset = container.nodeType === Node.TEXT_NODE ? container.textContent.length : container.childNodes.length
      }
    }
    return{container:container, offset:offset}
  }
  function splitBoundaries(range) {
    var modifiedNodes = [], end, splitStart;
    if(range.startContainer.nodeType === Node.TEXT_NODE || range.endContainer.nodeType === Node.TEXT_NODE) {
      end = findStablePoint(range.endContainer, range.endOffset);
      range.setEnd(end.container, end.offset);
      if(range.endOffset !== 0 && range.endContainer.nodeType === Node.TEXT_NODE && range.endOffset !== range.endContainer.length) {
        modifiedNodes.push(range.endContainer.splitText(range.endOffset));
        modifiedNodes.push(range.endContainer)
      }
      if(range.startOffset !== 0 && range.startContainer.nodeType === Node.TEXT_NODE && range.startOffset !== range.startContainer.length) {
        splitStart = range.startContainer.splitText(range.startOffset);
        modifiedNodes.push(range.startContainer);
        modifiedNodes.push(splitStart);
        range.setStart(splitStart, 0)
      }
    }
    return modifiedNodes
  }
  this.splitBoundaries = splitBoundaries;
  function containsRange(container, insideRange) {
    return container.compareBoundaryPoints(container.START_TO_START, insideRange) <= 0 && container.compareBoundaryPoints(container.END_TO_END, insideRange) >= 0
  }
  this.containsRange = containsRange;
  function rangesIntersect(range1, range2) {
    return range1.compareBoundaryPoints(range1.END_TO_START, range2) <= 0 && range1.compareBoundaryPoints(range1.START_TO_END, range2) >= 0
  }
  this.rangesIntersect = rangesIntersect;
  function getNodesInRange(range, nodeFilter) {
    var document = range.startContainer.ownerDocument, elements = [], root = (range.commonAncestorContainer), n, treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_ALL, nodeFilter, false);
    treeWalker.currentNode = range.startContainer;
    n = range.startContainer;
    while(n) {
      if(nodeFilter(n) === NodeFilter.FILTER_ACCEPT) {
        elements.push(n)
      }else {
        if(nodeFilter(n) === NodeFilter.FILTER_REJECT) {
          break
        }
      }
      n = n.parentNode
    }
    elements.reverse();
    n = treeWalker.nextNode();
    while(n) {
      elements.push(n);
      n = treeWalker.nextNode()
    }
    return elements
  }
  this.getNodesInRange = getNodesInRange;
  function mergeTextNodes(node, nextNode) {
    var mergedNode = null;
    if(node.nodeType === Node.TEXT_NODE) {
      if(node.length === 0) {
        node.parentNode.removeChild(node);
        if(nextNode.nodeType === Node.TEXT_NODE) {
          mergedNode = nextNode
        }
      }else {
        if(nextNode.nodeType === Node.TEXT_NODE) {
          node.appendData(nextNode.data);
          nextNode.parentNode.removeChild(nextNode)
        }
        mergedNode = node
      }
    }
    return mergedNode
  }
  function normalizeTextNodes(node) {
    if(node && node.nextSibling) {
      node = mergeTextNodes(node, node.nextSibling)
    }
    if(node && node.previousSibling) {
      mergeTextNodes(node.previousSibling, node)
    }
  }
  this.normalizeTextNodes = normalizeTextNodes;
  function rangeContainsNode(limits, node) {
    var range = node.ownerDocument.createRange(), nodeLength = node.nodeType === Node.TEXT_NODE ? node.length : node.childNodes.length, result;
    range.setStart(limits.startContainer, limits.startOffset);
    range.setEnd(limits.endContainer, limits.endOffset);
    result = range.comparePoint(node, 0) === 0 && range.comparePoint(node, nodeLength) === 0;
    range.detach();
    return result
  }
  this.rangeContainsNode = rangeContainsNode;
  function mergeIntoParent(targetNode) {
    var parent = targetNode.parentNode;
    while(targetNode.firstChild) {
      parent.insertBefore(targetNode.firstChild, targetNode)
    }
    parent.removeChild(targetNode);
    return parent
  }
  this.mergeIntoParent = mergeIntoParent;
  function getElementsByTagNameNS(node, namespace, tagName) {
    return Array.prototype.slice.call(node.getElementsByTagNameNS(namespace, tagName))
  }
  this.getElementsByTagNameNS = getElementsByTagNameNS;
  function rangeIntersectsNode(range, node) {
    var nodeLength = node.nodeType === Node.TEXT_NODE ? node.length : node.childNodes.length;
    return range.comparePoint(node, 0) <= 0 && range.comparePoint(node, nodeLength) >= 0
  }
  this.rangeIntersectsNode = rangeIntersectsNode;
  function containsNode(parent, descendant) {
    return parent === descendant || parent.contains(descendant)
  }
  this.containsNode = containsNode;
  function getPositionInContainingNode(node, container) {
    var offset = 0, n;
    while(node.parentNode !== container) {
      runtime.assert(node.parentNode !== null, "parent is null");
      node = (node.parentNode)
    }
    n = container.firstChild;
    while(n !== node) {
      offset += 1;
      n = n.nextSibling
    }
    return offset
  }
  function comparePoints(c1, o1, c2, o2) {
    if(c1 === c2) {
      return o2 - o1
    }
    var comparison = c1.compareDocumentPosition(c2);
    if(comparison === 2) {
      comparison = -1
    }else {
      if(comparison === 4) {
        comparison = 1
      }else {
        if(comparison === 10) {
          o1 = getPositionInContainingNode(c1, c2);
          comparison = o1 < o2 ? 1 : -1
        }else {
          o2 = getPositionInContainingNode(c2, c1);
          comparison = o2 < o1 ? -1 : 1
        }
      }
    }
    return comparison
  }
  this.comparePoints = comparePoints;
  function containsNodeForBrokenWebKit(parent, descendant) {
    return parent === descendant || Boolean(parent.compareDocumentPosition(descendant) & Node.DOCUMENT_POSITION_CONTAINED_BY)
  }
  function init(self) {
    var window = runtime.getWindow(), appVersion, webKitOrSafari;
    if(window === null) {
      return
    }
    appVersion = window.navigator.appVersion.toLowerCase();
    webKitOrSafari = appVersion.indexOf("chrome") === -1 && (appVersion.indexOf("applewebkit") !== -1 || appVersion.indexOf("safari") !== -1);
    if(webKitOrSafari) {
      self.containsNode = containsNodeForBrokenWebKit
    }
  }
  init(this)
};
runtime.loadClass("core.DomUtils");
core.Cursor = function Cursor(document, memberId) {
  var cursorns = "urn:webodf:names:cursor", cursorNode = document.createElementNS(cursorns, "cursor"), anchorNode = document.createElementNS(cursorns, "anchor"), forwardSelection, recentlyModifiedNodes = [], selectedRange, isCollapsed, domUtils = new core.DomUtils;
  function putIntoTextNode(node, container, offset) {
    runtime.assert(Boolean(container), "putCursorIntoTextNode: invalid container");
    var parent = container.parentNode;
    runtime.assert(Boolean(parent), "putCursorIntoTextNode: container without parent");
    runtime.assert(offset >= 0 && offset <= container.length, "putCursorIntoTextNode: offset is out of bounds");
    if(offset === 0) {
      parent.insertBefore(node, container)
    }else {
      if(offset === container.length) {
        parent.insertBefore(node, container.nextSibling)
      }else {
        container.splitText(offset);
        parent.insertBefore(node, container.nextSibling)
      }
    }
  }
  function putIntoContainer(node, container, offset) {
    runtime.assert(Boolean(container), "putCursorIntoContainer: invalid container");
    var n = container.firstChild;
    while(n !== null && offset > 0) {
      n = n.nextSibling;
      offset -= 1
    }
    container.insertBefore(node, n)
  }
  function removeNode(node) {
    if(node.parentNode) {
      recentlyModifiedNodes.push(node.previousSibling);
      recentlyModifiedNodes.push(node.nextSibling);
      node.parentNode.removeChild(node)
    }
  }
  function putNode(node, container, offset) {
    var text, element;
    if(container.nodeType === Node.TEXT_NODE) {
      text = (container);
      putIntoTextNode(node, text, offset)
    }else {
      if(container.nodeType === Node.ELEMENT_NODE) {
        element = (container);
        putIntoContainer(node, element, offset)
      }
    }
    recentlyModifiedNodes.push(node.previousSibling);
    recentlyModifiedNodes.push(node.nextSibling)
  }
  function getStartNode() {
    return forwardSelection ? anchorNode : cursorNode
  }
  function getEndNode() {
    return forwardSelection ? cursorNode : anchorNode
  }
  this.getNode = function() {
    return cursorNode
  };
  this.getAnchorNode = function() {
    return anchorNode.parentNode ? anchorNode : cursorNode
  };
  this.getSelectedRange = function() {
    if(isCollapsed) {
      selectedRange.setStartBefore(cursorNode);
      selectedRange.collapse(true)
    }else {
      selectedRange.setStartAfter(getStartNode());
      selectedRange.setEndBefore(getEndNode())
    }
    return selectedRange
  };
  this.setSelectedRange = function(range, isForwardSelection) {
    if(selectedRange && selectedRange !== range) {
      selectedRange.detach()
    }
    selectedRange = range;
    forwardSelection = isForwardSelection !== false;
    isCollapsed = range.collapsed;
    if(range.collapsed) {
      removeNode(anchorNode);
      removeNode(cursorNode);
      putNode(cursorNode, (range.startContainer), range.startOffset)
    }else {
      removeNode(anchorNode);
      removeNode(cursorNode);
      putNode(getEndNode(), (range.endContainer), range.endOffset);
      putNode(getStartNode(), (range.startContainer), range.startOffset)
    }
    recentlyModifiedNodes.forEach(domUtils.normalizeTextNodes);
    recentlyModifiedNodes.length = 0
  };
  this.remove = function() {
    removeNode(cursorNode);
    recentlyModifiedNodes.forEach(domUtils.normalizeTextNodes);
    recentlyModifiedNodes.length = 0
  };
  function init() {
    cursorNode.setAttributeNS(cursorns, "memberId", memberId);
    anchorNode.setAttributeNS(cursorns, "memberId", memberId)
  }
  init()
};
/*

 Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
core.EventNotifier = function EventNotifier(eventIds) {
  var eventListener = {};
  this.emit = function(eventId, args) {
    var i, subscribers;
    runtime.assert(eventListener.hasOwnProperty(eventId), 'unknown event fired "' + eventId + '"');
    subscribers = eventListener[eventId];
    for(i = 0;i < subscribers.length;i += 1) {
      subscribers[i](args)
    }
  };
  this.subscribe = function(eventId, cb) {
    runtime.assert(eventListener.hasOwnProperty(eventId), 'tried to subscribe to unknown event "' + eventId + '"');
    eventListener[eventId].push(cb);
    runtime.log('event "' + eventId + '" subscribed.')
  };
  this.unsubscribe = function(eventId, cb) {
    var cbIndex;
    runtime.assert(eventListener.hasOwnProperty(eventId), 'tried to unsubscribe from unknown event "' + eventId + '"');
    cbIndex = eventListener[eventId].indexOf(cb);
    runtime.assert(cbIndex !== -1, 'tried to unsubscribe unknown callback from event "' + eventId + '"');
    if(cbIndex !== -1) {
      eventListener[eventId].splice(cbIndex, 1)
    }
    runtime.log('event "' + eventId + '" unsubscribed.')
  };
  function init() {
    var i;
    for(i = 0;i < eventIds.length;i += 1) {
      eventListener[eventIds[i]] = []
    }
  }
  init()
};
core.UnitTest = function UnitTest() {
};
core.UnitTest.prototype.setUp = function() {
};
core.UnitTest.prototype.tearDown = function() {
};
core.UnitTest.prototype.description = function() {
};
core.UnitTest.prototype.tests = function() {
};
core.UnitTest.prototype.asyncTests = function() {
};
core.UnitTest.provideTestAreaDiv = function() {
  var maindoc = runtime.getWindow().document, testarea = maindoc.getElementById("testarea");
  runtime.assert(!testarea, 'Unclean test environment, found a div with id "testarea".');
  testarea = maindoc.createElement("div");
  testarea.setAttribute("id", "testarea");
  maindoc.body.appendChild(testarea);
  return testarea
};
core.UnitTest.cleanupTestAreaDiv = function() {
  var maindoc = runtime.getWindow().document, testarea = maindoc.getElementById("testarea");
  runtime.assert(!!testarea && testarea.parentNode === maindoc.body, 'Test environment broken, found no div with id "testarea" below body.');
  maindoc.body.removeChild(testarea)
};
core.UnitTest.createOdtDocument = function(xml, namespaceMap) {
  var xmlDoc = "<?xml version='1.0' encoding='UTF-8'?>";
  xmlDoc += "<office:document";
  Object.keys(namespaceMap).forEach(function(key) {
    xmlDoc += " xmlns:" + key + '="' + namespaceMap[key] + '"'
  });
  xmlDoc += ">";
  xmlDoc += xml;
  xmlDoc += "</office:document>";
  return runtime.parseXML(xmlDoc)
};
core.UnitTestRunner = function UnitTestRunner() {
  var failedTests = 0, areObjectsEqual;
  function debug(msg) {
    runtime.log(msg)
  }
  function testFailed(msg) {
    failedTests += 1;
    runtime.log("fail", msg)
  }
  function testPassed(msg) {
    runtime.log("pass", msg)
  }
  function areArraysEqual(a, b) {
    var i;
    try {
      if(a.length !== b.length) {
        testFailed("array of length " + a.length + " should be " + b.length + " long");
        return false
      }
      for(i = 0;i < a.length;i += 1) {
        if(a[i] !== b[i]) {
          testFailed(a[i] + " should be " + b[i] + " at array index " + i);
          return false
        }
      }
    }catch(ex) {
      return false
    }
    return true
  }
  function areAttributesEqual(a, b, skipReverseCheck) {
    var aatts = a.attributes, n = aatts.length, i, att, v;
    for(i = 0;i < n;i += 1) {
      att = aatts.item(i);
      if(att.prefix !== "xmlns") {
        v = b.getAttributeNS(att.namespaceURI, att.localName);
        if(!b.hasAttributeNS(att.namespaceURI, att.localName)) {
          testFailed("Attribute " + att.localName + " with value " + att.value + " was not present");
          return false
        }
        if(v !== att.value) {
          testFailed("Attribute " + att.localName + " was " + v + " should be " + att.value);
          return false
        }
      }
    }
    return skipReverseCheck ? true : areAttributesEqual(b, a, true)
  }
  function areNodesEqual(a, b) {
    if(a.nodeType !== b.nodeType) {
      testFailed(a.nodeType + " should be " + b.nodeType);
      return false
    }
    if(a.nodeType === Node.TEXT_NODE) {
      return a.data === b.data
    }
    runtime.assert(a.nodeType === Node.ELEMENT_NODE, "Only textnodes and elements supported.");
    if(a.namespaceURI !== b.namespaceURI || a.localName !== b.localName) {
      testFailed(a.namespaceURI + " should be " + b.namespaceURI);
      return false
    }
    if(!areAttributesEqual(a, b, false)) {
      return false
    }
    var an = a.firstChild, bn = b.firstChild;
    while(an) {
      if(!bn) {
        return false
      }
      if(!areNodesEqual(an, bn)) {
        return false
      }
      an = an.nextSibling;
      bn = bn.nextSibling
    }
    if(bn) {
      return false
    }
    return true
  }
  function isResultCorrect(actual, expected) {
    if(expected === 0) {
      return actual === expected && 1 / actual === 1 / expected
    }
    if(actual === expected) {
      return true
    }
    if(typeof expected === "number" && isNaN(expected)) {
      return typeof actual === "number" && isNaN(actual)
    }
    if(Object.prototype.toString.call(expected) === Object.prototype.toString.call([])) {
      return areArraysEqual(actual, expected)
    }
    if(typeof expected === "object" && typeof actual === "object") {
      if(expected.constructor === Element || expected.constructor === Node) {
        return areNodesEqual(expected, actual)
      }
      return areObjectsEqual(expected, actual)
    }
    return false
  }
  function stringify(v) {
    if(v === 0 && 1 / v < 0) {
      return"-0"
    }
    return String(v)
  }
  function shouldBe(t, a, b) {
    if(typeof a !== "string" || typeof b !== "string") {
      debug("WARN: shouldBe() expects string arguments")
    }
    var exception, av, bv;
    try {
      av = eval(a)
    }catch(e) {
      exception = e
    }
    bv = eval(b);
    if(exception) {
      testFailed(a + " should be " + bv + ". Threw exception " + exception)
    }else {
      if(isResultCorrect(av, bv)) {
        testPassed(a + " is " + b)
      }else {
        if(String(typeof av) === String(typeof bv)) {
          testFailed(a + " should be " + bv + ". Was " + stringify(av) + ".")
        }else {
          testFailed(a + " should be " + bv + " (of type " + typeof bv + "). Was " + av + " (of type " + typeof av + ").")
        }
      }
    }
  }
  function shouldBeNonNull(t, a) {
    var exception, av;
    try {
      av = eval(a)
    }catch(e) {
      exception = e
    }
    if(exception) {
      testFailed(a + " should be non-null. Threw exception " + exception)
    }else {
      if(av !== null) {
        testPassed(a + " is non-null.")
      }else {
        testFailed(a + " should be non-null. Was " + av)
      }
    }
  }
  function shouldBeNull(t, a) {
    shouldBe(t, a, "null")
  }
  areObjectsEqual = function(a, b) {
    var akeys = Object.keys(a), bkeys = Object.keys(b);
    akeys.sort();
    bkeys.sort();
    return areArraysEqual(akeys, bkeys) && Object.keys(a).every(function(key) {
      var aval = a[key], bval = b[key];
      if(!isResultCorrect(aval, bval)) {
        testFailed(aval + " should be " + bval + " for key " + key);
        return false
      }
      return true
    })
  };
  this.areNodesEqual = areNodesEqual;
  this.shouldBeNull = shouldBeNull;
  this.shouldBeNonNull = shouldBeNonNull;
  this.shouldBe = shouldBe;
  this.countFailedTests = function() {
    return failedTests
  }
};
core.UnitTester = function UnitTester() {
  var failedTests = 0, results = {};
  function link(text, code) {
    return"<span style='color:blue;cursor:pointer' onclick='" + code + "'>" + text + "</span>"
  }
  this.runTests = function(TestClass, callback, testNames) {
    var testName = Runtime.getFunctionName(TestClass), tname, runner = new core.UnitTestRunner, test = new TestClass(runner), testResults = {}, i, t, tests, lastFailCount, testNameString = "testName", inBrowser = runtime.type() === "BrowserRuntime";
    if(results.hasOwnProperty(testName)) {
      runtime.log("Test " + testName + " has already run.");
      return
    }
    if(inBrowser) {
      runtime.log("<span>Running " + link(testName, 'runSuite("' + testName + '");') + ": " + test.description() + "</span>")
    }else {
      runtime.log("Running " + testName + ": " + test.description)
    }
    tests = test.tests();
    for(i = 0;i < tests.length;i += 1) {
      t = tests[i];
      tname = Runtime.getFunctionName(t) || t[testNameString];
      if(testNames.length && testNames.indexOf(tname) === -1) {
        continue
      }
      if(inBrowser) {
        runtime.log("<span>Running " + link(tname, 'runTest("' + testName + '","' + tname + '")') + "</span>")
      }else {
        runtime.log("Running " + tname)
      }
      lastFailCount = runner.countFailedTests();
      test.setUp();
      t();
      test.tearDown();
      testResults[tname] = lastFailCount === runner.countFailedTests()
    }
    function runAsyncTests(todo) {
      if(todo.length === 0) {
        results[testName] = testResults;
        failedTests += runner.countFailedTests();
        callback();
        return
      }
      t = todo[0];
      var fname = Runtime.getFunctionName(t);
      runtime.log("Running " + fname);
      lastFailCount = runner.countFailedTests();
      test.setUp();
      t(function() {
        test.tearDown();
        testResults[fname] = lastFailCount === runner.countFailedTests();
        runAsyncTests(todo.slice(1))
      })
    }
    runAsyncTests(test.asyncTests())
  };
  this.countFailedTests = function() {
    return failedTests
  };
  this.results = function() {
    return results
  }
};
core.PositionIterator = function PositionIterator(root, whatToShow, filter, expandEntityReferences) {
  function EmptyTextNodeFilter() {
    this.acceptNode = function(node) {
      if(node.nodeType === Node.TEXT_NODE && node.length === 0) {
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    }
  }
  function FilteredEmptyTextNodeFilter(filter) {
    this.acceptNode = function(node) {
      if(node.nodeType === Node.TEXT_NODE && node.length === 0) {
        return NodeFilter.FILTER_REJECT
      }
      return filter.acceptNode(node)
    }
  }
  var self = this, walker, currentPos, nodeFilter;
  this.nextPosition = function() {
    if(walker.currentNode === root) {
      return false
    }
    if(currentPos === 0 && walker.currentNode.nodeType === Node.ELEMENT_NODE) {
      if(walker.firstChild() === null) {
        currentPos = 1
      }
    }else {
      if(walker.currentNode.nodeType === Node.TEXT_NODE && currentPos + 1 < walker.currentNode.length) {
        currentPos += 1
      }else {
        if(walker.nextSibling() !== null) {
          currentPos = 0
        }else {
          if(walker.parentNode()) {
            currentPos = 1
          }else {
            return false
          }
        }
      }
    }
    return true
  };
  function setAtEnd() {
    var type = walker.currentNode.nodeType;
    if(type === Node.TEXT_NODE) {
      currentPos = walker.currentNode.length - 1
    }else {
      currentPos = type === Node.ELEMENT_NODE ? 1 : 0
    }
  }
  this.previousPosition = function() {
    var moved = true;
    if(currentPos === 0) {
      if(walker.previousSibling() === null) {
        if(!walker.parentNode() || walker.currentNode === root) {
          walker.firstChild();
          return false
        }
        currentPos = 0
      }else {
        setAtEnd()
      }
    }else {
      if(walker.currentNode.nodeType === Node.TEXT_NODE) {
        currentPos -= 1
      }else {
        if(walker.lastChild() !== null) {
          setAtEnd()
        }else {
          if(walker.currentNode === root) {
            moved = false
          }else {
            currentPos = 0
          }
        }
      }
    }
    return moved
  };
  this.container = function() {
    var n = walker.currentNode, t = n.nodeType;
    if(currentPos === 0 && t !== Node.TEXT_NODE) {
      return(n.parentNode)
    }
    return n
  };
  this.rightNode = function() {
    var n = walker.currentNode, nodeType = n.nodeType;
    if(nodeType === Node.TEXT_NODE && currentPos === n.length) {
      n = n.nextSibling;
      while(n && nodeFilter(n) !== 1) {
        n = n.nextSibling
      }
    }else {
      if(nodeType === Node.ELEMENT_NODE && currentPos === 1) {
        n = null
      }
    }
    return n
  };
  this.leftNode = function() {
    var n = walker.currentNode;
    if(currentPos === 0) {
      n = n.previousSibling;
      while(n && nodeFilter(n) !== 1) {
        n = n.previousSibling
      }
    }else {
      if(n.nodeType === Node.ELEMENT_NODE) {
        n = n.lastChild;
        while(n && nodeFilter(n) !== 1) {
          n = n.previousSibling
        }
      }
    }
    return n
  };
  this.getCurrentNode = function() {
    return walker.currentNode
  };
  this.unfilteredDomOffset = function() {
    if(walker.currentNode.nodeType === Node.TEXT_NODE) {
      return currentPos
    }
    var c = 0, n = walker.currentNode;
    if(currentPos === 1) {
      n = n.lastChild
    }else {
      n = n.previousSibling
    }
    while(n) {
      c += 1;
      n = n.previousSibling
    }
    return c
  };
  this.getPreviousSibling = function() {
    var currentNode = walker.currentNode, sibling = walker.previousSibling();
    walker.currentNode = currentNode;
    return sibling
  };
  this.getNextSibling = function() {
    var currentNode = walker.currentNode, sibling = walker.nextSibling();
    walker.currentNode = currentNode;
    return sibling
  };
  this.setUnfilteredPosition = function(container, offset) {
    var filterResult, node;
    runtime.assert(container !== null && container !== undefined, "PositionIterator.setUnfilteredPosition called without container");
    walker.currentNode = container;
    if(container.nodeType === Node.TEXT_NODE) {
      currentPos = offset;
      runtime.assert(offset <= container.length, "Error in setPosition: " + offset + " > " + container.length);
      runtime.assert(offset >= 0, "Error in setPosition: " + offset + " < 0");
      if(offset === container.length) {
        currentPos = undefined;
        if(walker.nextSibling()) {
          currentPos = 0
        }else {
          if(walker.parentNode()) {
            currentPos = 1
          }
        }
        runtime.assert(currentPos !== undefined, "Error in setPosition: position not valid.")
      }
      return true
    }
    filterResult = nodeFilter(container);
    node = container.parentNode;
    while(node && node !== root && filterResult === NodeFilter.FILTER_ACCEPT) {
      filterResult = nodeFilter(node);
      if(filterResult !== NodeFilter.FILTER_ACCEPT) {
        walker.currentNode = node
      }
      node = node.parentNode
    }
    if(offset < container.childNodes.length && filterResult !== NodeFilter.FILTER_REJECT) {
      walker.currentNode = container.childNodes[offset];
      filterResult = nodeFilter(walker.currentNode);
      currentPos = 0
    }else {
      currentPos = offset === 0 ? 0 : 1
    }
    if(filterResult === NodeFilter.FILTER_REJECT) {
      currentPos = 1
    }
    if(filterResult !== NodeFilter.FILTER_ACCEPT) {
      return self.nextPosition()
    }
    runtime.assert(nodeFilter(walker.currentNode) === NodeFilter.FILTER_ACCEPT, "PositionIterater.setUnfilteredPosition call resulted in an non-visible node being set");
    return true
  };
  this.moveToEnd = function() {
    walker.currentNode = root;
    currentPos = 1
  };
  this.moveToEndOfNode = function(node) {
    if(node.nodeType === Node.TEXT_NODE) {
      self.setUnfilteredPosition(node, node.length)
    }else {
      walker.currentNode = node;
      currentPos = 1
    }
  };
  this.getNodeFilter = function() {
    return nodeFilter
  };
  function init() {
    var f;
    if(filter) {
      f = new FilteredEmptyTextNodeFilter(filter)
    }else {
      f = new EmptyTextNodeFilter
    }
    nodeFilter = (f.acceptNode);
    nodeFilter.acceptNode = nodeFilter;
    whatToShow = whatToShow || 4294967295;
    walker = root.ownerDocument.createTreeWalker(root, whatToShow, nodeFilter, expandEntityReferences);
    currentPos = 0;
    if(walker.firstChild() === null) {
      currentPos = 1
    }
  }
  init()
};
runtime.loadClass("core.PositionIterator");
core.PositionFilter = function PositionFilter() {
};
core.PositionFilter.FilterResult = {FILTER_ACCEPT:1, FILTER_REJECT:2, FILTER_SKIP:3};
core.PositionFilter.prototype.acceptPosition = function(point) {
};
(function() {
  return core.PositionFilter
})();
runtime.loadClass("core.PositionFilter");
core.PositionFilterChain = function PositionFilterChain() {
  var filterChain = {}, FILTER_ACCEPT = core.PositionFilter.FilterResult.FILTER_ACCEPT, FILTER_REJECT = core.PositionFilter.FilterResult.FILTER_REJECT;
  this.acceptPosition = function(iterator) {
    var filterName;
    for(filterName in filterChain) {
      if(filterChain.hasOwnProperty(filterName)) {
        if(filterChain[filterName].acceptPosition(iterator) === FILTER_REJECT) {
          return FILTER_REJECT
        }
      }
    }
    return FILTER_ACCEPT
  };
  this.addFilter = function(filterName, filterInstance) {
    filterChain[filterName] = filterInstance
  };
  this.removeFilter = function(filterName) {
    delete filterChain[filterName]
  }
};
core.Async = function Async() {
  this.forEach = function(items, f, callback) {
    var i, l = items.length, itemsDone = 0;
    function end(err) {
      if(itemsDone !== l) {
        if(err) {
          itemsDone = l;
          callback(err)
        }else {
          itemsDone += 1;
          if(itemsDone === l) {
            callback(null)
          }
        }
      }
    }
    for(i = 0;i < l;i += 1) {
      f(items[i], end)
    }
  }
};
/*

 WebODF
 Copyright (c) 2010 Jos van den Oever
 Licensed under the ... License:

 Project home: http://www.webodf.org/
*/
runtime.loadClass("core.RawInflate");
runtime.loadClass("core.ByteArray");
runtime.loadClass("core.ByteArrayWriter");
runtime.loadClass("core.Base64");
core.Zip = function Zip(url, entriesReadCallback) {
  var entries, filesize, nEntries, inflate = (new core.RawInflate).inflate, zip = this, base64 = new core.Base64;
  function crc32(data) {
    var table = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 
    3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 
    453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 
    3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 
    1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 
    1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918E3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117], crc = 
    0, i, iTop = data.length, x = 0, y = 0;
    crc = crc ^ -1;
    for(i = 0;i < iTop;i += 1) {
      y = (crc ^ data[i]) & 255;
      x = table[y];
      crc = crc >>> 8 ^ x
    }
    return crc ^ -1
  }
  function dosTime2Date(dostime) {
    var year = (dostime >> 25 & 127) + 1980, month = (dostime >> 21 & 15) - 1, mday = dostime >> 16 & 31, hour = dostime >> 11 & 15, min = dostime >> 5 & 63, sec = (dostime & 31) << 1, d = new Date(year, month, mday, hour, min, sec);
    return d
  }
  function date2DosTime(date) {
    var y = date.getFullYear();
    return y < 1980 ? 0 : y - 1980 << 25 | date.getMonth() + 1 << 21 | date.getDate() << 16 | date.getHours() << 11 | date.getMinutes() << 5 | date.getSeconds() >> 1
  }
  function ZipEntry(url, stream) {
    var sig, namelen, extralen, commentlen, compressionMethod, compressedSize, uncompressedSize, offset, entry = this;
    function handleEntryData(data, callback) {
      var estream = new core.ByteArray(data), esig = estream.readUInt32LE(), filenamelen, eextralen;
      if(esig !== 67324752) {
        callback("File entry signature is wrong." + esig.toString() + " " + data.length.toString(), null);
        return
      }
      estream.pos += 22;
      filenamelen = estream.readUInt16LE();
      eextralen = estream.readUInt16LE();
      estream.pos += filenamelen + eextralen;
      if(compressionMethod) {
        data = data.slice(estream.pos, estream.pos + compressedSize);
        if(compressedSize !== data.length) {
          callback("The amount of compressed bytes read was " + data.length.toString() + " instead of " + compressedSize.toString() + " for " + entry.filename + " in " + url + ".", null);
          return
        }
        data = inflate(data, uncompressedSize)
      }else {
        data = data.slice(estream.pos, estream.pos + uncompressedSize)
      }
      if(uncompressedSize !== data.length) {
        callback("The amount of bytes read was " + data.length.toString() + " instead of " + uncompressedSize.toString() + " for " + entry.filename + " in " + url + ".", null);
        return
      }
      entry.data = data;
      callback(null, data)
    }
    function load(callback) {
      if(entry.data !== undefined) {
        callback(null, entry.data);
        return
      }
      var size = compressedSize + 34 + namelen + extralen + 256;
      if(size + offset > filesize) {
        size = filesize - offset
      }
      runtime.read(url, offset, size, function(err, data) {
        if(err || data === null) {
          callback(err, data)
        }else {
          handleEntryData(data, callback)
        }
      })
    }
    this.load = load;
    function set(filename, data, compressed, date) {
      entry.filename = filename;
      entry.data = data;
      entry.compressed = compressed;
      entry.date = date
    }
    this.set = set;
    this.error = null;
    if(!stream) {
      return
    }
    sig = stream.readUInt32LE();
    if(sig !== 33639248) {
      this.error = "Central directory entry has wrong signature at position " + (stream.pos - 4).toString() + ' for file "' + url + '": ' + stream.data.length.toString();
      return
    }
    stream.pos += 6;
    compressionMethod = stream.readUInt16LE();
    this.date = dosTime2Date(stream.readUInt32LE());
    stream.readUInt32LE();
    compressedSize = stream.readUInt32LE();
    uncompressedSize = stream.readUInt32LE();
    namelen = stream.readUInt16LE();
    extralen = stream.readUInt16LE();
    commentlen = stream.readUInt16LE();
    stream.pos += 8;
    offset = stream.readUInt32LE();
    this.filename = runtime.byteArrayToString(stream.data.slice(stream.pos, stream.pos + namelen), "utf8");
    stream.pos += namelen + extralen + commentlen
  }
  function handleCentralDirectory(data, callback) {
    var stream = new core.ByteArray(data), i, e;
    entries = [];
    for(i = 0;i < nEntries;i += 1) {
      e = new ZipEntry(url, stream);
      if(e.error) {
        callback(e.error, zip);
        return
      }
      entries[entries.length] = e
    }
    callback(null, zip)
  }
  function handleCentralDirectoryEnd(data, callback) {
    if(data.length !== 22) {
      callback("Central directory length should be 22.", zip);
      return
    }
    var stream = new core.ByteArray(data), sig, disk, cddisk, diskNEntries, cdsSize, cdsOffset;
    sig = stream.readUInt32LE();
    if(sig !== 101010256) {
      callback("Central directory signature is wrong: " + sig.toString(), zip);
      return
    }
    disk = stream.readUInt16LE();
    if(disk !== 0) {
      callback("Zip files with non-zero disk numbers are not supported.", zip);
      return
    }
    cddisk = stream.readUInt16LE();
    if(cddisk !== 0) {
      callback("Zip files with non-zero disk numbers are not supported.", zip);
      return
    }
    diskNEntries = stream.readUInt16LE();
    nEntries = stream.readUInt16LE();
    if(diskNEntries !== nEntries) {
      callback("Number of entries is inconsistent.", zip);
      return
    }
    cdsSize = stream.readUInt32LE();
    cdsOffset = stream.readUInt16LE();
    cdsOffset = filesize - 22 - cdsSize;
    runtime.read(url, cdsOffset, filesize - cdsOffset, function(err, data) {
      if(err || data === null) {
        callback(err, zip)
      }else {
        handleCentralDirectory(data, callback)
      }
    })
  }
  function load(filename, callback) {
    var entry = null, e, i;
    for(i = 0;i < entries.length;i += 1) {
      e = entries[i];
      if(e.filename === filename) {
        entry = e;
        break
      }
    }
    if(entry) {
      if(entry.data) {
        callback(null, entry.data)
      }else {
        entry.load(callback)
      }
    }else {
      callback(filename + " not found.", null)
    }
  }
  function loadAsString(filename, callback) {
    load(filename, function(err, data) {
      if(err || data === null) {
        return callback(err, null)
      }
      var d = runtime.byteArrayToString(data, "utf8");
      callback(null, d)
    })
  }
  function loadContentXmlAsFragments(filename, handler) {
    zip.loadAsString(filename, function(err, data) {
      if(err) {
        return handler.rootElementReady(err)
      }
      handler.rootElementReady(null, data, true)
    })
  }
  function loadAsDataURL(filename, mimetype, callback) {
    load(filename, function(err, data) {
      if(err) {
        return callback(err, null)
      }
      var p = data, chunksize = 45E3, i = 0, dataurl;
      if(!mimetype) {
        if(p[1] === 80 && p[2] === 78 && p[3] === 71) {
          mimetype = "image/png"
        }else {
          if(p[0] === 255 && p[1] === 216 && p[2] === 255) {
            mimetype = "image/jpeg"
          }else {
            if(p[0] === 71 && p[1] === 73 && p[2] === 70) {
              mimetype = "image/gif"
            }else {
              mimetype = ""
            }
          }
        }
      }
      dataurl = "data:" + mimetype + ";base64,";
      while(i < data.length) {
        dataurl += base64.convertUTF8ArrayToBase64(p.slice(i, Math.min(i + chunksize, p.length)));
        i += chunksize
      }
      callback(null, dataurl)
    })
  }
  function loadAsDOM(filename, callback) {
    zip.loadAsString(filename, function(err, xmldata) {
      if(err || xmldata === null) {
        callback(err, null);
        return
      }
      var parser = new DOMParser, dom = parser.parseFromString(xmldata, "text/xml");
      callback(null, dom)
    })
  }
  function save(filename, data, compressed, date) {
    var i, entry;
    for(i = 0;i < entries.length;i += 1) {
      entry = entries[i];
      if(entry.filename === filename) {
        entry.set(filename, data, compressed, date);
        return
      }
    }
    entry = new ZipEntry(url);
    entry.set(filename, data, compressed, date);
    entries.push(entry)
  }
  function writeEntry(entry) {
    var data = new core.ByteArrayWriter("utf8"), length = 0;
    data.appendArray([80, 75, 3, 4, 20, 0, 0, 0, 0, 0]);
    if(entry.data) {
      length = entry.data.length
    }
    data.appendUInt32LE(date2DosTime(entry.date));
    data.appendUInt32LE(crc32(entry.data));
    data.appendUInt32LE(length);
    data.appendUInt32LE(length);
    data.appendUInt16LE(entry.filename.length);
    data.appendUInt16LE(0);
    data.appendString(entry.filename);
    if(entry.data) {
      data.appendByteArray(entry.data)
    }
    return data
  }
  function writeCODEntry(entry, offset) {
    var data = new core.ByteArrayWriter("utf8"), length = 0;
    data.appendArray([80, 75, 1, 2, 20, 0, 20, 0, 0, 0, 0, 0]);
    if(entry.data) {
      length = entry.data.length
    }
    data.appendUInt32LE(date2DosTime(entry.date));
    data.appendUInt32LE(crc32(entry.data));
    data.appendUInt32LE(length);
    data.appendUInt32LE(length);
    data.appendUInt16LE(entry.filename.length);
    data.appendArray([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    data.appendUInt32LE(offset);
    data.appendString(entry.filename);
    return data
  }
  function loadAllEntries(position, callback) {
    if(position === entries.length) {
      callback(null);
      return
    }
    var entry = entries[position];
    if(entry.data !== undefined) {
      loadAllEntries(position + 1, callback);
      return
    }
    entry.load(function(err) {
      if(err) {
        callback(err);
        return
      }
      loadAllEntries(position + 1, callback)
    })
  }
  function createByteArray(successCallback, errorCallback) {
    loadAllEntries(0, function(err) {
      if(err) {
        errorCallback(err);
        return
      }
      var data = new core.ByteArrayWriter("utf8"), i, e, codoffset, codsize, offsets = [0];
      for(i = 0;i < entries.length;i += 1) {
        data.appendByteArrayWriter(writeEntry(entries[i]));
        offsets.push(data.getLength())
      }
      codoffset = data.getLength();
      for(i = 0;i < entries.length;i += 1) {
        e = entries[i];
        data.appendByteArrayWriter(writeCODEntry(e, offsets[i]))
      }
      codsize = data.getLength() - codoffset;
      data.appendArray([80, 75, 5, 6, 0, 0, 0, 0]);
      data.appendUInt16LE(entries.length);
      data.appendUInt16LE(entries.length);
      data.appendUInt32LE(codsize);
      data.appendUInt32LE(codoffset);
      data.appendArray([0, 0]);
      successCallback(data.getByteArray())
    })
  }
  function writeAs(newurl, callback) {
    createByteArray(function(data) {
      runtime.writeFile(newurl, data, callback)
    }, callback)
  }
  function write(callback) {
    writeAs(url, callback)
  }
  this.load = load;
  this.save = save;
  this.write = write;
  this.writeAs = writeAs;
  this.createByteArray = createByteArray;
  this.loadContentXmlAsFragments = loadContentXmlAsFragments;
  this.loadAsString = loadAsString;
  this.loadAsDOM = loadAsDOM;
  this.loadAsDataURL = loadAsDataURL;
  this.getEntries = function() {
    return entries.slice()
  };
  filesize = -1;
  if(entriesReadCallback === null) {
    entries = [];
    return
  }
  runtime.getFileSize(url, function(size) {
    filesize = size;
    if(filesize < 0) {
      entriesReadCallback("File '" + url + "' cannot be read.", zip)
    }else {
      runtime.read(url, filesize - 22, 22, function(err, data) {
        if(err || entriesReadCallback === null || data === null) {
          entriesReadCallback(err, zip)
        }else {
          handleCentralDirectoryEnd(data, entriesReadCallback)
        }
      })
    }
  })
};
core.CSSUnits = function CSSUnits() {
  var sizemap = {"in":1, "cm":2.54, "mm":25.4, "pt":72, "pc":12};
  this.convert = function(value, oldUnit, newUnit) {
    return value * sizemap[newUnit] / sizemap[oldUnit]
  };
  this.convertMeasure = function(measure, newUnit) {
    var value, oldUnit, newMeasure;
    if(measure && newUnit) {
      value = parseFloat(measure);
      oldUnit = measure.replace(value.toString(), "");
      newMeasure = this.convert(value, oldUnit, newUnit)
    }else {
      newMeasure = ""
    }
    return newMeasure.toString()
  };
  this.getUnits = function(measure) {
    return measure.substr(measure.length - 2, measure.length)
  }
};
xmldom.LSSerializerFilter = function LSSerializerFilter() {
};
if(typeof Object.create !== "function") {
  Object["create"] = function(o) {
    var F = function() {
    };
    F.prototype = o;
    return new F
  }
}
xmldom.LSSerializer = function LSSerializer() {
  var self = this;
  function Namespaces(nsmap) {
    function invertMap(map) {
      var m = {}, i;
      for(i in map) {
        if(map.hasOwnProperty(i)) {
          m[map[i]] = i
        }
      }
      return m
    }
    var current = nsmap || {}, currentrev = invertMap(nsmap), levels = [current], levelsrev = [currentrev], level = 0;
    this.push = function() {
      level += 1;
      current = levels[level] = Object.create(current);
      currentrev = levelsrev[level] = Object.create(currentrev)
    };
    this.pop = function() {
      levels[level] = undefined;
      levelsrev[level] = undefined;
      level -= 1;
      current = levels[level];
      currentrev = levelsrev[level]
    };
    this.getLocalNamespaceDefinitions = function() {
      return currentrev
    };
    this.getQName = function(node) {
      var ns = node.namespaceURI, i = 0, p;
      if(!ns) {
        return node.localName
      }
      p = currentrev[ns];
      if(p) {
        return p + ":" + node.localName
      }
      do {
        if(p || !node.prefix) {
          p = "ns" + i;
          i += 1
        }else {
          p = node.prefix
        }
        if(current[p] === ns) {
          break
        }
        if(!current[p]) {
          current[p] = ns;
          currentrev[ns] = p;
          break
        }
        p = null
      }while(p === null);
      return p + ":" + node.localName
    }
  }
  function escapeContent(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/"/g, "&quot;")
  }
  function serializeAttribute(qname, attr) {
    var escapedValue = typeof attr.value === "string" ? escapeContent(attr.value) : attr.value, s = qname + '="' + escapedValue + '"';
    return s
  }
  function startElement(ns, qname, element) {
    var s = "", atts = element.attributes, length, i, attr, attstr = "", accept, prefix, nsmap;
    s += "<" + qname;
    length = atts.length;
    for(i = 0;i < length;i += 1) {
      attr = (atts.item(i));
      if(attr.namespaceURI !== "http://www.w3.org/2000/xmlns/") {
        accept = self.filter ? self.filter.acceptNode(attr) : NodeFilter.FILTER_ACCEPT;
        if(accept === NodeFilter.FILTER_ACCEPT) {
          attstr += " " + serializeAttribute(ns.getQName(attr), attr)
        }
      }
    }
    nsmap = ns.getLocalNamespaceDefinitions();
    for(i in nsmap) {
      if(nsmap.hasOwnProperty(i)) {
        prefix = nsmap[i];
        if(!prefix) {
          s += ' xmlns="' + i + '"'
        }else {
          if(prefix !== "xmlns") {
            s += " xmlns:" + nsmap[i] + '="' + i + '"'
          }
        }
      }
    }
    s += attstr + ">";
    return s
  }
  function serializeNode(ns, node) {
    var s = "", accept = self.filter ? self.filter.acceptNode(node) : NodeFilter.FILTER_ACCEPT, child, qname;
    if(accept === NodeFilter.FILTER_ACCEPT && node.nodeType === Node.ELEMENT_NODE) {
      ns.push();
      qname = ns.getQName(node);
      s += startElement(ns, qname, node)
    }
    if(accept === NodeFilter.FILTER_ACCEPT || accept === NodeFilter.FILTER_SKIP) {
      child = node.firstChild;
      while(child) {
        s += serializeNode(ns, child);
        child = child.nextSibling
      }
      if(node.nodeValue) {
        s += escapeContent(node.nodeValue)
      }
    }
    if(qname) {
      s += "</" + qname + ">";
      ns.pop()
    }
    return s
  }
  this.filter = null;
  this.writeToString = function(node, nsmap) {
    if(!node) {
      return""
    }
    var ns = new Namespaces(nsmap);
    return serializeNode(ns, node)
  }
};
xmldom.RelaxNGParser = function RelaxNGParser() {
  var self = this, rngns = "http://relaxng.org/ns/structure/1.0", xmlnsns = "http://www.w3.org/2000/xmlns/", start, nsmap = {"http://www.w3.org/XML/1998/namespace":"xml"}, parse;
  function RelaxNGParseError(error, context) {
    this.message = function() {
      if(context) {
        error += context.nodeType === 1 ? " Element " : " Node ";
        error += context.nodeName;
        if(context.nodeValue) {
          error += " with value '" + context.nodeValue + "'"
        }
        error += "."
      }
      return error
    }
  }
  function splitToDuos(e) {
    if(e.e.length <= 2) {
      return e
    }
    var o = {name:e.name, e:e.e.slice(0, 2)};
    return splitToDuos({name:e.name, e:[o].concat(e.e.slice(2))})
  }
  function splitQName(name) {
    var r = name.split(":", 2), prefix = "", i;
    if(r.length === 1) {
      r = ["", r[0]]
    }else {
      prefix = r[0]
    }
    for(i in nsmap) {
      if(nsmap[i] === prefix) {
        r[0] = i
      }
    }
    return r
  }
  function splitQNames(def) {
    var i, l = def.names ? def.names.length : 0, name, localnames = [], namespaces = [];
    for(i = 0;i < l;i += 1) {
      name = splitQName(def.names[i]);
      namespaces[i] = name[0];
      localnames[i] = name[1]
    }
    def.localnames = localnames;
    def.namespaces = namespaces
  }
  function trim(str) {
    str = str.replace(/^\s\s*/, "");
    var ws = /\s/, i = str.length - 1;
    while(ws.test(str.charAt(i))) {
      i -= 1
    }
    return str.slice(0, i + 1)
  }
  function copyAttributes(atts, name, names) {
    var a = {}, i, att;
    for(i = 0;i < atts.length;i += 1) {
      att = atts.item(i);
      if(!att.namespaceURI) {
        if(att.localName === "name" && (name === "element" || name === "attribute")) {
          names.push(att.value)
        }
        if(att.localName === "name" || att.localName === "combine" || att.localName === "type") {
          att.value = trim(att.value)
        }
        a[att.localName] = att.value
      }else {
        if(att.namespaceURI === xmlnsns) {
          nsmap[att.value] = att.localName
        }
      }
    }
    return a
  }
  function parseChildren(c, e, elements, names) {
    var text = "", ce;
    while(c) {
      if(c.nodeType === Node.ELEMENT_NODE && c.namespaceURI === rngns) {
        ce = parse(c, elements, e);
        if(ce) {
          if(ce.name === "name") {
            names.push(nsmap[ce.a.ns] + ":" + ce.text);
            e.push(ce)
          }else {
            if(ce.name === "choice" && ce.names && ce.names.length) {
              names = names.concat(ce.names);
              delete ce.names;
              e.push(ce)
            }else {
              e.push(ce)
            }
          }
        }
      }else {
        if(c.nodeType === Node.TEXT_NODE) {
          text += c.nodeValue
        }
      }
      c = c.nextSibling
    }
    return text
  }
  function combineDefines(combine, name, e, siblings) {
    var i, ce;
    for(i = 0;siblings && i < siblings.length;i += 1) {
      ce = siblings[i];
      if(ce.name === "define" && ce.a && ce.a.name === name) {
        ce.e = [{name:combine, e:ce.e.concat(e)}];
        return ce
      }
    }
    return null
  }
  parse = function parse(element, elements, siblings) {
    var e = [], a, ce, i, text, name = element.localName, names = [];
    a = copyAttributes(element.attributes, name, names);
    a.combine = a.combine || undefined;
    text = parseChildren(element.firstChild, e, elements, names);
    if(name !== "value" && name !== "param") {
      text = /^\s*([\s\S]*\S)?\s*$/.exec(text)[1]
    }
    if(name === "value" && a.type === undefined) {
      a.type = "token";
      a.datatypeLibrary = ""
    }
    if((name === "attribute" || name === "element") && a.name !== undefined) {
      i = splitQName(a.name);
      e = [{name:"name", text:i[1], a:{ns:i[0]}}].concat(e);
      delete a.name
    }
    if(name === "name" || name === "nsName" || name === "value") {
      if(a.ns === undefined) {
        a.ns = ""
      }
    }else {
      delete a.ns
    }
    if(name === "name") {
      i = splitQName(text);
      a.ns = i[0];
      text = i[1]
    }
    if(e.length > 1 && (name === "define" || name === "oneOrMore" || name === "zeroOrMore" || name === "optional" || name === "list" || name === "mixed")) {
      e = [{name:"group", e:splitToDuos({name:"group", e:e}).e}]
    }
    if(e.length > 2 && name === "element") {
      e = [e[0]].concat({name:"group", e:splitToDuos({name:"group", e:e.slice(1)}).e})
    }
    if(e.length === 1 && name === "attribute") {
      e.push({name:"text", text:text})
    }
    if(e.length === 1 && (name === "choice" || name === "group" || name === "interleave")) {
      name = e[0].name;
      names = e[0].names;
      a = e[0].a;
      text = e[0].text;
      e = e[0].e
    }else {
      if(e.length > 2 && (name === "choice" || name === "group" || name === "interleave")) {
        e = splitToDuos({name:name, e:e}).e
      }
    }
    if(name === "mixed") {
      name = "interleave";
      e = [e[0], {name:"text"}]
    }
    if(name === "optional") {
      name = "choice";
      e = [e[0], {name:"empty"}]
    }
    if(name === "zeroOrMore") {
      name = "choice";
      e = [{name:"oneOrMore", e:[e[0]]}, {name:"empty"}]
    }
    if(name === "define" && a.combine) {
      ce = combineDefines(a.combine, a.name, e, siblings);
      if(ce) {
        return
      }
    }
    ce = {name:name};
    if(e && e.length > 0) {
      ce.e = e
    }
    for(i in a) {
      if(a.hasOwnProperty(i)) {
        ce.a = a;
        break
      }
    }
    if(text !== undefined) {
      ce.text = text
    }
    if(names && names.length > 0) {
      ce.names = names
    }
    if(name === "element") {
      ce.id = elements.length;
      elements.push(ce);
      ce = {name:"elementref", id:ce.id}
    }
    return ce
  };
  function resolveDefines(def, defines) {
    var i = 0, e, defs, end, name = def.name;
    while(def.e && i < def.e.length) {
      e = def.e[i];
      if(e.name === "ref") {
        defs = defines[e.a.name];
        if(!defs) {
          throw e.a.name + " was not defined.";
        }
        end = def.e.slice(i + 1);
        def.e = def.e.slice(0, i);
        def.e = def.e.concat(defs.e);
        def.e = def.e.concat(end)
      }else {
        i += 1;
        resolveDefines(e, defines)
      }
    }
    e = def.e;
    if(name === "choice") {
      if(!e || !e[1] || e[1].name === "empty") {
        if(!e || !e[0] || e[0].name === "empty") {
          delete def.e;
          def.name = "empty"
        }else {
          e[1] = e[0];
          e[0] = {name:"empty"}
        }
      }
    }
    if(name === "group" || name === "interleave") {
      if(e[0].name === "empty") {
        if(e[1].name === "empty") {
          delete def.e;
          def.name = "empty"
        }else {
          name = def.name = e[1].name;
          def.names = e[1].names;
          e = def.e = e[1].e
        }
      }else {
        if(e[1].name === "empty") {
          name = def.name = e[0].name;
          def.names = e[0].names;
          e = def.e = e[0].e
        }
      }
    }
    if(name === "oneOrMore" && e[0].name === "empty") {
      delete def.e;
      def.name = "empty"
    }
    if(name === "attribute") {
      splitQNames(def)
    }
    if(name === "interleave") {
      if(e[0].name === "interleave") {
        if(e[1].name === "interleave") {
          e = def.e = e[0].e.concat(e[1].e)
        }else {
          e = def.e = [e[1]].concat(e[0].e)
        }
      }else {
        if(e[1].name === "interleave") {
          e = def.e = [e[0]].concat(e[1].e)
        }
      }
    }
  }
  function resolveElements(def, elements) {
    var i = 0, e;
    while(def.e && i < def.e.length) {
      e = def.e[i];
      if(e.name === "elementref") {
        e.id = e.id || 0;
        def.e[i] = elements[e.id]
      }else {
        if(e.name !== "element") {
          resolveElements(e, elements)
        }
      }
      i += 1
    }
  }
  function main(dom, callback) {
    var elements = [], grammar = parse(dom && dom.documentElement, elements, undefined), i, e, defines = {};
    for(i = 0;i < grammar.e.length;i += 1) {
      e = grammar.e[i];
      if(e.name === "define") {
        defines[e.a.name] = e
      }else {
        if(e.name === "start") {
          start = e
        }
      }
    }
    if(!start) {
      return[new RelaxNGParseError("No Relax NG start element was found.")]
    }
    resolveDefines(start, defines);
    for(i in defines) {
      if(defines.hasOwnProperty(i)) {
        resolveDefines(defines[i], defines)
      }
    }
    for(i = 0;i < elements.length;i += 1) {
      resolveDefines(elements[i], defines)
    }
    if(callback) {
      self.rootPattern = callback(start.e[0], elements)
    }
    resolveElements(start, elements);
    for(i = 0;i < elements.length;i += 1) {
      resolveElements(elements[i], elements)
    }
    self.start = start;
    self.elements = elements;
    self.nsmap = nsmap;
    return null
  }
  this.parseRelaxNGDOM = main
};
runtime.loadClass("xmldom.RelaxNGParser");
xmldom.RelaxNG = function RelaxNG() {
  var xmlnsns = "http://www.w3.org/2000/xmlns/", createChoice, createInterleave, createGroup, createAfter, createOneOrMore, createValue, createAttribute, createNameClass, createData, makePattern, notAllowed = {type:"notAllowed", nullable:false, hash:"notAllowed", textDeriv:function() {
    return notAllowed
  }, startTagOpenDeriv:function() {
    return notAllowed
  }, attDeriv:function() {
    return notAllowed
  }, startTagCloseDeriv:function() {
    return notAllowed
  }, endTagDeriv:function() {
    return notAllowed
  }}, empty = {type:"empty", nullable:true, hash:"empty", textDeriv:function() {
    return notAllowed
  }, startTagOpenDeriv:function() {
    return notAllowed
  }, attDeriv:function() {
    return notAllowed
  }, startTagCloseDeriv:function() {
    return empty
  }, endTagDeriv:function() {
    return notAllowed
  }}, text = {type:"text", nullable:true, hash:"text", textDeriv:function() {
    return text
  }, startTagOpenDeriv:function() {
    return notAllowed
  }, attDeriv:function() {
    return notAllowed
  }, startTagCloseDeriv:function() {
    return text
  }, endTagDeriv:function() {
    return notAllowed
  }}, applyAfter, childDeriv, rootPattern;
  function memoize0arg(func) {
    return function() {
      var cache;
      return function() {
        if(cache === undefined) {
          cache = func()
        }
        return cache
      }
    }()
  }
  function memoize1arg(type, func) {
    return function() {
      var cache = {}, cachecount = 0;
      return function(a) {
        var ahash = a.hash || a.toString(), v;
        v = cache[ahash];
        if(v !== undefined) {
          return v
        }
        cache[ahash] = v = func(a);
        v.hash = type + cachecount.toString();
        cachecount += 1;
        return v
      }
    }()
  }
  function memoizeNode(func) {
    return function() {
      var cache = {};
      return function(node) {
        var v, m;
        m = cache[node.localName];
        if(m === undefined) {
          cache[node.localName] = m = {}
        }else {
          v = m[node.namespaceURI];
          if(v !== undefined) {
            return v
          }
        }
        m[node.namespaceURI] = v = func(node);
        return v
      }
    }()
  }
  function memoize2arg(type, fastfunc, func) {
    return function() {
      var cache = {}, cachecount = 0;
      return function(a, b) {
        var v = fastfunc && fastfunc(a, b), ahash, bhash, m;
        if(v !== undefined) {
          return v
        }
        ahash = a.hash || a.toString();
        bhash = b.hash || b.toString();
        m = cache[ahash];
        if(m === undefined) {
          cache[ahash] = m = {}
        }else {
          v = m[bhash];
          if(v !== undefined) {
            return v
          }
        }
        m[bhash] = v = func(a, b);
        v.hash = type + cachecount.toString();
        cachecount += 1;
        return v
      }
    }()
  }
  function unorderedMemoize2arg(type, fastfunc, func) {
    return function() {
      var cache = {}, cachecount = 0;
      return function(a, b) {
        var v = fastfunc && fastfunc(a, b), ahash, bhash, m;
        if(v !== undefined) {
          return v
        }
        ahash = a.hash || a.toString();
        bhash = b.hash || b.toString();
        if(ahash < bhash) {
          m = ahash;
          ahash = bhash;
          bhash = m;
          m = a;
          a = b;
          b = m
        }
        m = cache[ahash];
        if(m === undefined) {
          cache[ahash] = m = {}
        }else {
          v = m[bhash];
          if(v !== undefined) {
            return v
          }
        }
        m[bhash] = v = func(a, b);
        v.hash = type + cachecount.toString();
        cachecount += 1;
        return v
      }
    }()
  }
  function getUniqueLeaves(leaves, pattern) {
    if(pattern.p1.type === "choice") {
      getUniqueLeaves(leaves, pattern.p1)
    }else {
      leaves[pattern.p1.hash] = pattern.p1
    }
    if(pattern.p2.type === "choice") {
      getUniqueLeaves(leaves, pattern.p2)
    }else {
      leaves[pattern.p2.hash] = pattern.p2
    }
  }
  createChoice = memoize2arg("choice", function(p1, p2) {
    if(p1 === notAllowed) {
      return p2
    }
    if(p2 === notAllowed) {
      return p1
    }
    if(p1 === p2) {
      return p1
    }
  }, function(p1, p2) {
    function makeChoice(p1, p2) {
      return{type:"choice", p1:p1, p2:p2, nullable:p1.nullable || p2.nullable, textDeriv:function(context, text) {
        return createChoice(p1.textDeriv(context, text), p2.textDeriv(context, text))
      }, startTagOpenDeriv:memoizeNode(function(node) {
        return createChoice(p1.startTagOpenDeriv(node), p2.startTagOpenDeriv(node))
      }), attDeriv:function(context, attribute) {
        return createChoice(p1.attDeriv(context, attribute), p2.attDeriv(context, attribute))
      }, startTagCloseDeriv:memoize0arg(function() {
        return createChoice(p1.startTagCloseDeriv(), p2.startTagCloseDeriv())
      }), endTagDeriv:memoize0arg(function() {
        return createChoice(p1.endTagDeriv(), p2.endTagDeriv())
      })}
    }
    var leaves = {}, i;
    getUniqueLeaves(leaves, {p1:p1, p2:p2});
    p1 = undefined;
    p2 = undefined;
    for(i in leaves) {
      if(leaves.hasOwnProperty(i)) {
        if(p1 === undefined) {
          p1 = leaves[i]
        }else {
          if(p2 === undefined) {
            p2 = leaves[i]
          }else {
            p2 = createChoice(p2, leaves[i])
          }
        }
      }
    }
    return makeChoice(p1, p2)
  });
  createInterleave = unorderedMemoize2arg("interleave", function(p1, p2) {
    if(p1 === notAllowed || p2 === notAllowed) {
      return notAllowed
    }
    if(p1 === empty) {
      return p2
    }
    if(p2 === empty) {
      return p1
    }
  }, function(p1, p2) {
    return{type:"interleave", p1:p1, p2:p2, nullable:p1.nullable && p2.nullable, textDeriv:function(context, text) {
      return createChoice(createInterleave(p1.textDeriv(context, text), p2), createInterleave(p1, p2.textDeriv(context, text)))
    }, startTagOpenDeriv:memoizeNode(function(node) {
      return createChoice(applyAfter(function(p) {
        return createInterleave(p, p2)
      }, p1.startTagOpenDeriv(node)), applyAfter(function(p) {
        return createInterleave(p1, p)
      }, p2.startTagOpenDeriv(node)))
    }), attDeriv:function(context, attribute) {
      return createChoice(createInterleave(p1.attDeriv(context, attribute), p2), createInterleave(p1, p2.attDeriv(context, attribute)))
    }, startTagCloseDeriv:memoize0arg(function() {
      return createInterleave(p1.startTagCloseDeriv(), p2.startTagCloseDeriv())
    })}
  });
  createGroup = memoize2arg("group", function(p1, p2) {
    if(p1 === notAllowed || p2 === notAllowed) {
      return notAllowed
    }
    if(p1 === empty) {
      return p2
    }
    if(p2 === empty) {
      return p1
    }
  }, function(p1, p2) {
    return{type:"group", p1:p1, p2:p2, nullable:p1.nullable && p2.nullable, textDeriv:function(context, text) {
      var p = createGroup(p1.textDeriv(context, text), p2);
      if(p1.nullable) {
        return createChoice(p, p2.textDeriv(context, text))
      }
      return p
    }, startTagOpenDeriv:function(node) {
      var x = applyAfter(function(p) {
        return createGroup(p, p2)
      }, p1.startTagOpenDeriv(node));
      if(p1.nullable) {
        return createChoice(x, p2.startTagOpenDeriv(node))
      }
      return x
    }, attDeriv:function(context, attribute) {
      return createChoice(createGroup(p1.attDeriv(context, attribute), p2), createGroup(p1, p2.attDeriv(context, attribute)))
    }, startTagCloseDeriv:memoize0arg(function() {
      return createGroup(p1.startTagCloseDeriv(), p2.startTagCloseDeriv())
    })}
  });
  createAfter = memoize2arg("after", function(p1, p2) {
    if(p1 === notAllowed || p2 === notAllowed) {
      return notAllowed
    }
  }, function(p1, p2) {
    return{type:"after", p1:p1, p2:p2, nullable:false, textDeriv:function(context, text) {
      return createAfter(p1.textDeriv(context, text), p2)
    }, startTagOpenDeriv:memoizeNode(function(node) {
      return applyAfter(function(p) {
        return createAfter(p, p2)
      }, p1.startTagOpenDeriv(node))
    }), attDeriv:function(context, attribute) {
      return createAfter(p1.attDeriv(context, attribute), p2)
    }, startTagCloseDeriv:memoize0arg(function() {
      return createAfter(p1.startTagCloseDeriv(), p2)
    }), endTagDeriv:memoize0arg(function() {
      return p1.nullable ? p2 : notAllowed
    })}
  });
  createOneOrMore = memoize1arg("oneormore", function(p) {
    if(p === notAllowed) {
      return notAllowed
    }
    return{type:"oneOrMore", p:p, nullable:p.nullable, textDeriv:function(context, text) {
      return createGroup(p.textDeriv(context, text), createChoice(this, empty))
    }, startTagOpenDeriv:function(node) {
      var oneOrMore = this;
      return applyAfter(function(pf) {
        return createGroup(pf, createChoice(oneOrMore, empty))
      }, p.startTagOpenDeriv(node))
    }, attDeriv:function(context, attribute) {
      var oneOrMore = this;
      return createGroup(p.attDeriv(context, attribute), createChoice(oneOrMore, empty))
    }, startTagCloseDeriv:memoize0arg(function() {
      return createOneOrMore(p.startTagCloseDeriv())
    })}
  });
  function createElement(nc, p) {
    return{type:"element", nc:nc, nullable:false, textDeriv:function() {
      return notAllowed
    }, startTagOpenDeriv:function(node) {
      if(nc.contains(node)) {
        return createAfter(p, empty)
      }
      return notAllowed
    }, attDeriv:function() {
      return notAllowed
    }, startTagCloseDeriv:function() {
      return this
    }}
  }
  function valueMatch(context, pattern, text) {
    return pattern.nullable && /^\s+$/.test(text) || pattern.textDeriv(context, text).nullable
  }
  createAttribute = memoize2arg("attribute", undefined, function(nc, p) {
    return{type:"attribute", nullable:false, nc:nc, p:p, attDeriv:function(context, attribute) {
      if(nc.contains(attribute) && valueMatch(context, p, attribute.nodeValue)) {
        return empty
      }
      return notAllowed
    }, startTagCloseDeriv:function() {
      return notAllowed
    }}
  });
  function createList() {
    return{type:"list", nullable:false, hash:"list", textDeriv:function() {
      return empty
    }}
  }
  createValue = memoize1arg("value", function(value) {
    return{type:"value", nullable:false, value:value, textDeriv:function(context, text) {
      return text === value ? empty : notAllowed
    }, attDeriv:function() {
      return notAllowed
    }, startTagCloseDeriv:function() {
      return this
    }}
  });
  createData = memoize1arg("data", function(type) {
    return{type:"data", nullable:false, dataType:type, textDeriv:function() {
      return empty
    }, attDeriv:function() {
      return notAllowed
    }, startTagCloseDeriv:function() {
      return this
    }}
  });
  applyAfter = function applyAfter(f, p) {
    var result;
    if(p.type === "after") {
      result = createAfter(p.p1, f(p.p2))
    }else {
      if(p.type === "choice") {
        result = createChoice(applyAfter(f, p.p1), applyAfter(f, p.p2))
      }else {
        result = p
      }
    }
    return result
  };
  function attsDeriv(context, pattern, attributes, position) {
    if(pattern === notAllowed) {
      return notAllowed
    }
    if(position >= attributes.length) {
      return pattern
    }
    if(position === 0) {
      position = 0
    }
    var a = attributes.item(position);
    while(a.namespaceURI === xmlnsns) {
      position += 1;
      if(position >= attributes.length) {
        return pattern
      }
      a = attributes.item(position)
    }
    a = attsDeriv(context, pattern.attDeriv(context, attributes.item(position)), attributes, position + 1);
    return a
  }
  function childrenDeriv(context, pattern, walker) {
    var element = walker.currentNode, childNode = walker.firstChild(), childNodes = [], i, p;
    while(childNode) {
      if(childNode.nodeType === Node.ELEMENT_NODE) {
        childNodes.push(childNode)
      }else {
        if(childNode.nodeType === Node.TEXT_NODE && !/^\s*$/.test(childNode.nodeValue)) {
          childNodes.push(childNode.nodeValue)
        }
      }
      childNode = walker.nextSibling()
    }
    if(childNodes.length === 0) {
      childNodes = [""]
    }
    p = pattern;
    for(i = 0;p !== notAllowed && i < childNodes.length;i += 1) {
      childNode = childNodes[i];
      if(typeof childNode === "string") {
        if(/^\s*$/.test(childNode)) {
          p = createChoice(p, p.textDeriv(context, childNode))
        }else {
          p = p.textDeriv(context, childNode)
        }
      }else {
        walker.currentNode = childNode;
        p = childDeriv(context, p, walker)
      }
    }
    walker.currentNode = element;
    return p
  }
  childDeriv = function childDeriv(context, pattern, walker) {
    var childNode = walker.currentNode, p;
    p = pattern.startTagOpenDeriv(childNode);
    p = attsDeriv(context, p, childNode.attributes, 0);
    p = p.startTagCloseDeriv();
    p = childrenDeriv(context, p, walker);
    p = p.endTagDeriv();
    return p
  };
  function addNames(name, ns, pattern) {
    if(pattern.e[0].a) {
      name.push(pattern.e[0].text);
      ns.push(pattern.e[0].a.ns)
    }else {
      addNames(name, ns, pattern.e[0])
    }
    if(pattern.e[1].a) {
      name.push(pattern.e[1].text);
      ns.push(pattern.e[1].a.ns)
    }else {
      addNames(name, ns, pattern.e[1])
    }
  }
  createNameClass = function createNameClass(pattern) {
    var name, ns, hash, i, result;
    if(pattern.name === "name") {
      name = pattern.text;
      ns = pattern.a.ns;
      result = {name:name, ns:ns, hash:"{" + ns + "}" + name, contains:function(node) {
        return node.namespaceURI === ns && node.localName === name
      }}
    }else {
      if(pattern.name === "choice") {
        name = [];
        ns = [];
        addNames(name, ns, pattern);
        hash = "";
        for(i = 0;i < name.length;i += 1) {
          hash += "{" + ns[i] + "}" + name[i] + ","
        }
        result = {hash:hash, contains:function(node) {
          var j;
          for(j = 0;j < name.length;j += 1) {
            if(name[j] === node.localName && ns[j] === node.namespaceURI) {
              return true
            }
          }
          return false
        }}
      }else {
        result = {hash:"anyName", contains:function() {
          return true
        }}
      }
    }
    return result
  };
  function resolveElement(pattern, elements) {
    var element, p, i, hash;
    hash = "element" + pattern.id.toString();
    p = elements[pattern.id] = {hash:hash};
    element = createElement(createNameClass(pattern.e[0]), makePattern(pattern.e[1], elements));
    for(i in element) {
      if(element.hasOwnProperty(i)) {
        p[i] = element[i]
      }
    }
    return p
  }
  makePattern = function makePattern(pattern, elements) {
    var p, i;
    if(pattern.name === "elementref") {
      p = pattern.id || 0;
      pattern = elements[p];
      if(pattern.name !== undefined) {
        return resolveElement(pattern, elements)
      }
      return pattern
    }
    switch(pattern.name) {
      case "empty":
        return empty;
      case "notAllowed":
        return notAllowed;
      case "text":
        return text;
      case "choice":
        return createChoice(makePattern(pattern.e[0], elements), makePattern(pattern.e[1], elements));
      case "interleave":
        p = makePattern(pattern.e[0], elements);
        for(i = 1;i < pattern.e.length;i += 1) {
          p = createInterleave(p, makePattern(pattern.e[i], elements))
        }
        return p;
      case "group":
        return createGroup(makePattern(pattern.e[0], elements), makePattern(pattern.e[1], elements));
      case "oneOrMore":
        return createOneOrMore(makePattern(pattern.e[0], elements));
      case "attribute":
        return createAttribute(createNameClass(pattern.e[0]), makePattern(pattern.e[1], elements));
      case "value":
        return createValue(pattern.text);
      case "data":
        p = pattern.a && pattern.a.type;
        if(p === undefined) {
          p = ""
        }
        return createData(p);
      case "list":
        return createList()
    }
    throw"No support for " + pattern.name;
  };
  this.makePattern = function(pattern, elements) {
    var copy = {}, i;
    for(i in elements) {
      if(elements.hasOwnProperty(i)) {
        copy[i] = elements[i]
      }
    }
    i = makePattern(pattern, copy);
    return i
  };
  this.validate = function validate(walker, callback) {
    var errors;
    walker.currentNode = walker.root;
    errors = childDeriv(null, rootPattern, walker);
    if(!errors.nullable) {
      runtime.log("Error in Relax NG validation: " + errors);
      callback(["Error in Relax NG validation: " + errors])
    }else {
      callback(null)
    }
  };
  this.init = function init(rootPattern1) {
    rootPattern = rootPattern1
  }
};
runtime.loadClass("xmldom.RelaxNGParser");
xmldom.RelaxNG2 = function RelaxNG2() {
  var start, validateNonEmptyPattern, nsmap;
  function RelaxNGParseError(error, context) {
    this.message = function() {
      if(context) {
        error += context.nodeType === Node.ELEMENT_NODE ? " Element " : " Node ";
        error += context.nodeName;
        if(context.nodeValue) {
          error += " with value '" + context.nodeValue + "'"
        }
        error += "."
      }
      return error
    }
  }
  function validateOneOrMore(elementdef, walker, element) {
    var node, i = 0, err;
    do {
      node = walker.currentNode;
      err = validateNonEmptyPattern(elementdef.e[0], walker, element);
      i += 1
    }while(!err && node !== walker.currentNode);
    if(i > 1) {
      walker.currentNode = node;
      return null
    }
    return err
  }
  function qName(node) {
    return nsmap[node.namespaceURI] + ":" + node.localName
  }
  function isWhitespace(node) {
    return node && node.nodeType === Node.TEXT_NODE && /^\s+$/.test(node.nodeValue)
  }
  function validatePattern(elementdef, walker, element, data) {
    if(elementdef.name === "empty") {
      return null
    }
    return validateNonEmptyPattern(elementdef, walker, element, data)
  }
  function validateAttribute(elementdef, walker, element) {
    if(elementdef.e.length !== 2) {
      throw"Attribute with wrong # of elements: " + elementdef.e.length;
    }
    var att, a, l = elementdef.localnames.length, i;
    for(i = 0;i < l;i += 1) {
      a = element.getAttributeNS(elementdef.namespaces[i], elementdef.localnames[i]);
      if(a === "" && !element.hasAttributeNS(elementdef.namespaces[i], elementdef.localnames[i])) {
        a = undefined
      }
      if(att !== undefined && a !== undefined) {
        return[new RelaxNGParseError("Attribute defined too often.", element)]
      }
      att = a
    }
    if(att === undefined) {
      return[new RelaxNGParseError("Attribute not found: " + elementdef.names, element)]
    }
    return validatePattern(elementdef.e[1], walker, element, att)
  }
  function validateTop(elementdef, walker, element) {
    return validatePattern(elementdef, walker, element)
  }
  function validateElement(elementdef, walker) {
    if(elementdef.e.length !== 2) {
      throw"Element with wrong # of elements: " + elementdef.e.length;
    }
    var node = walker.currentNode, type = node ? node.nodeType : 0, error = null;
    while(type > Node.ELEMENT_NODE) {
      if(type !== Node.COMMENT_NODE && (type !== Node.TEXT_NODE || !/^\s+$/.test(walker.currentNode.nodeValue))) {
        return[new RelaxNGParseError("Not allowed node of type " + type + ".")]
      }
      node = walker.nextSibling();
      type = node ? node.nodeType : 0
    }
    if(!node) {
      return[new RelaxNGParseError("Missing element " + elementdef.names)]
    }
    if(elementdef.names && elementdef.names.indexOf(qName(node)) === -1) {
      return[new RelaxNGParseError("Found " + node.nodeName + " instead of " + elementdef.names + ".", node)]
    }
    if(walker.firstChild()) {
      error = validateTop(elementdef.e[1], walker, node);
      while(walker.nextSibling()) {
        type = walker.currentNode.nodeType;
        if(!isWhitespace(walker.currentNode) && type !== Node.COMMENT_NODE) {
          return[new RelaxNGParseError("Spurious content.", walker.currentNode)]
        }
      }
      if(walker.parentNode() !== node) {
        return[new RelaxNGParseError("Implementation error.")]
      }
    }else {
      error = validateTop(elementdef.e[1], walker, node)
    }
    node = walker.nextSibling();
    return error
  }
  function validateChoice(elementdef, walker, element, data) {
    if(elementdef.e.length !== 2) {
      throw"Choice with wrong # of options: " + elementdef.e.length;
    }
    var node = walker.currentNode, err;
    if(elementdef.e[0].name === "empty") {
      err = validateNonEmptyPattern(elementdef.e[1], walker, element, data);
      if(err) {
        walker.currentNode = node
      }
      return null
    }
    err = validatePattern(elementdef.e[0], walker, element, data);
    if(err) {
      walker.currentNode = node;
      err = validateNonEmptyPattern(elementdef.e[1], walker, element, data)
    }
    return err
  }
  function validateInterleave(elementdef, walker, element) {
    var l = elementdef.e.length, n = [l], err, i, todo = l, donethisround, node, subnode, e;
    while(todo > 0) {
      donethisround = 0;
      node = walker.currentNode;
      for(i = 0;i < l;i += 1) {
        subnode = walker.currentNode;
        if(n[i] !== true && n[i] !== subnode) {
          e = elementdef.e[i];
          err = validateNonEmptyPattern(e, walker, element);
          if(err) {
            walker.currentNode = subnode;
            if(n[i] === undefined) {
              n[i] = false
            }
          }else {
            if(subnode === walker.currentNode || e.name === "oneOrMore" || e.name === "choice" && (e.e[0].name === "oneOrMore" || e.e[1].name === "oneOrMore")) {
              donethisround += 1;
              n[i] = subnode
            }else {
              donethisround += 1;
              n[i] = true
            }
          }
        }
      }
      if(node === walker.currentNode && donethisround === todo) {
        return null
      }
      if(donethisround === 0) {
        for(i = 0;i < l;i += 1) {
          if(n[i] === false) {
            return[new RelaxNGParseError("Interleave does not match.", element)]
          }
        }
        return null
      }
      todo = 0;
      for(i = 0;i < l;i += 1) {
        if(n[i] !== true) {
          todo += 1
        }
      }
    }
    return null
  }
  function validateGroup(elementdef, walker, element) {
    if(elementdef.e.length !== 2) {
      throw"Group with wrong # of members: " + elementdef.e.length;
    }
    return validateNonEmptyPattern(elementdef.e[0], walker, element) || validateNonEmptyPattern(elementdef.e[1], walker, element)
  }
  function validateText(elementdef, walker, element) {
    var node = walker.currentNode, type = node ? node.nodeType : 0;
    while(node !== element && type !== 3) {
      if(type === 1) {
        return[new RelaxNGParseError("Element not allowed here.", node)]
      }
      node = walker.nextSibling();
      type = node ? node.nodeType : 0
    }
    walker.nextSibling();
    return null
  }
  validateNonEmptyPattern = function validateNonEmptyPattern(elementdef, walker, element, data) {
    var name = elementdef.name, err = null;
    if(name === "text") {
      err = validateText(elementdef, walker, element)
    }else {
      if(name === "data") {
        err = null
      }else {
        if(name === "value") {
          if(data !== elementdef.text) {
            err = [new RelaxNGParseError("Wrong value, should be '" + elementdef.text + "', not '" + data + "'", element)]
          }
        }else {
          if(name === "list") {
            err = null
          }else {
            if(name === "attribute") {
              err = validateAttribute(elementdef, walker, element)
            }else {
              if(name === "element") {
                err = validateElement(elementdef, walker)
              }else {
                if(name === "oneOrMore") {
                  err = validateOneOrMore(elementdef, walker, element)
                }else {
                  if(name === "choice") {
                    err = validateChoice(elementdef, walker, element, data)
                  }else {
                    if(name === "group") {
                      err = validateGroup(elementdef, walker, element)
                    }else {
                      if(name === "interleave") {
                        err = validateInterleave(elementdef, walker, element)
                      }else {
                        throw name + " not allowed in nonEmptyPattern.";
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return err
  };
  this.validate = function validate(walker, callback) {
    walker.currentNode = walker.root;
    var errors = validatePattern(start.e[0], walker, walker.root);
    callback(errors)
  };
  this.init = function init(start1, nsmap1) {
    start = start1;
    nsmap = nsmap1
  }
};
xmldom.XPathIterator = function XPathIterator() {
};
xmldom.XPath = function() {
  var createXPathPathIterator, parsePredicates;
  function isSmallestPositive(a, b, c) {
    return a !== -1 && (a < b || b === -1) && (a < c || c === -1)
  }
  function parseXPathStep(xpath, pos, end, steps) {
    var location = "", predicates = [], brapos = xpath.indexOf("[", pos), slapos = xpath.indexOf("/", pos), eqpos = xpath.indexOf("=", pos);
    if(isSmallestPositive(slapos, brapos, eqpos)) {
      location = xpath.substring(pos, slapos);
      pos = slapos + 1
    }else {
      if(isSmallestPositive(brapos, slapos, eqpos)) {
        location = xpath.substring(pos, brapos);
        pos = parsePredicates(xpath, brapos, predicates)
      }else {
        if(isSmallestPositive(eqpos, slapos, brapos)) {
          location = xpath.substring(pos, eqpos);
          pos = eqpos
        }else {
          location = xpath.substring(pos, end);
          pos = end
        }
      }
    }
    steps.push({location:location, predicates:predicates});
    return pos
  }
  function parseXPath(xpath) {
    var steps = [], p = 0, end = xpath.length, value;
    while(p < end) {
      p = parseXPathStep(xpath, p, end, steps);
      if(p < end && xpath[p] === "=") {
        value = xpath.substring(p + 1, end);
        if(value.length > 2 && (value[0] === "'" || value[0] === '"')) {
          value = value.slice(1, value.length - 1)
        }else {
          try {
            value = parseInt(value, 10)
          }catch(ignore) {
          }
        }
        p = end
      }
    }
    return{steps:steps, value:value}
  }
  parsePredicates = function parsePredicates(xpath, start, predicates) {
    var pos = start, l = xpath.length, depth = 0;
    while(pos < l) {
      if(xpath[pos] === "]") {
        depth -= 1;
        if(depth <= 0) {
          predicates.push(parseXPath(xpath.substring(start, pos)))
        }
      }else {
        if(xpath[pos] === "[") {
          if(depth <= 0) {
            start = pos + 1
          }
          depth += 1
        }
      }
      pos += 1
    }
    return pos
  };
  xmldom.XPathIterator.prototype.next = function() {
  };
  xmldom.XPathIterator.prototype.reset = function() {
  };
  function XPathNodeIterator() {
    var node, done = false;
    this.setNode = function setNode(n) {
      node = n
    };
    this.reset = function() {
      done = false
    };
    this.next = function next() {
      var val = done ? null : node;
      done = true;
      return val
    }
  }
  function AttributeIterator(it, namespace, localName) {
    this.reset = function reset() {
      it.reset()
    };
    this.next = function next() {
      var node = it.next();
      while(node) {
        node = node.getAttributeNodeNS(namespace, localName);
        if(node) {
          return node
        }
        node = it.next()
      }
      return node
    }
  }
  function AllChildElementIterator(it, recurse) {
    var root = it.next(), node = null;
    this.reset = function reset() {
      it.reset();
      root = it.next();
      node = null
    };
    this.next = function next() {
      while(root) {
        if(node) {
          if(recurse && node.firstChild) {
            node = node.firstChild
          }else {
            while(!node.nextSibling && node !== root) {
              node = node.parentNode
            }
            if(node === root) {
              root = it.next()
            }else {
              node = node.nextSibling
            }
          }
        }else {
          do {
            node = root.firstChild;
            if(!node) {
              root = it.next()
            }
          }while(root && !node)
        }
        if(node && node.nodeType === Node.ELEMENT_NODE) {
          return node
        }
      }
      return null
    }
  }
  function ConditionIterator(it, condition) {
    this.reset = function reset() {
      it.reset()
    };
    this.next = function next() {
      var n = it.next();
      while(n && !condition(n)) {
        n = it.next()
      }
      return n
    }
  }
  function createNodenameFilter(it, name, namespaceResolver) {
    var s = name.split(":", 2), namespace = namespaceResolver(s[0]), localName = s[1];
    return new ConditionIterator(it, function(node) {
      return node.localName === localName && node.namespaceURI === namespace
    })
  }
  function createPredicateFilteredIterator(it, p, namespaceResolver) {
    var nit = new XPathNodeIterator, pit = createXPathPathIterator(nit, p, namespaceResolver), value = p.value;
    if(value === undefined) {
      return new ConditionIterator(it, function(node) {
        nit.setNode(node);
        pit.reset();
        return pit.next()
      })
    }
    return new ConditionIterator(it, function(node) {
      nit.setNode(node);
      pit.reset();
      var n = pit.next();
      return n && n.nodeValue === value
    })
  }
  createXPathPathIterator = function createXPathPathIterator(it, xpath, namespaceResolver) {
    var i, j, step, location, p;
    for(i = 0;i < xpath.steps.length;i += 1) {
      step = xpath.steps[i];
      location = step.location;
      if(location === "") {
        it = new AllChildElementIterator(it, false)
      }else {
        if(location[0] === "@") {
          p = location.slice(1).split(":", 2);
          it = new AttributeIterator(it, namespaceResolver(p[0]), p[1])
        }else {
          if(location !== ".") {
            it = new AllChildElementIterator(it, false);
            if(location.indexOf(":") !== -1) {
              it = createNodenameFilter(it, location, namespaceResolver)
            }
          }
        }
      }
      for(j = 0;j < step.predicates.length;j += 1) {
        p = step.predicates[j];
        it = createPredicateFilteredIterator(it, p, namespaceResolver)
      }
    }
    return it
  };
  function fallback(node, xpath, namespaceResolver) {
    var it = new XPathNodeIterator, i, nodelist, parsedXPath;
    it.setNode(node);
    parsedXPath = parseXPath(xpath);
    it = createXPathPathIterator(it, parsedXPath, namespaceResolver);
    nodelist = [];
    i = it.next();
    while(i) {
      nodelist.push(i);
      i = it.next()
    }
    return nodelist
  }
  function getODFElementsWithXPath(node, xpath, namespaceResolver) {
    var doc = node.ownerDocument, nodes, elements = [], n = null;
    if(!doc || !doc.evaluate) {
      elements = fallback(node, xpath, namespaceResolver)
    }else {
      nodes = doc.evaluate(xpath, node, namespaceResolver, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      n = nodes.iterateNext();
      while(n !== null) {
        if(n.nodeType === Node.ELEMENT_NODE) {
          elements.push(n)
        }
        n = nodes.iterateNext()
      }
    }
    return elements
  }
  xmldom.XPath = function XPath() {
    this.getODFElementsWithXPath = getODFElementsWithXPath
  };
  return xmldom.XPath
}();
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
gui.AnnotationViewManager = function AnnotationViewManager(odfCanvas, odfFragment, annotationsPane) {
  var annotations = [], doc = odfFragment.ownerDocument, odfUtils = new odf.OdfUtils, CONNECTOR_MARGIN = 30, NOTE_MARGIN = 20, window = runtime.getWindow();
  runtime.assert(Boolean(window), "Expected to be run in an environment which has a global window, like a browser.");
  function wrapAnnotation(annotation) {
    var annotationWrapper = doc.createElement("div"), annotationNote = doc.createElement("div"), connectorHorizontal = doc.createElement("div"), connectorAngular = doc.createElement("div"), removeButton = doc.createElement("div"), annotationNode = annotation.node;
    annotationWrapper.className = "annotationWrapper";
    annotationNode.parentNode.insertBefore(annotationWrapper, annotationNode);
    annotationNote.className = "annotationNote";
    annotationNote.appendChild(annotationNode);
    removeButton.className = "annotationRemoveButton";
    annotationNote.appendChild(removeButton);
    connectorHorizontal.className = "annotationConnector horizontal";
    connectorAngular.className = "annotationConnector angular";
    annotationWrapper.appendChild(annotationNote);
    annotationWrapper.appendChild(connectorHorizontal);
    annotationWrapper.appendChild(connectorAngular)
  }
  function unwrapAnnotation(annotation) {
    var annotationNode = annotation.node, annotationWrapper = annotationNode.parentNode.parentNode;
    if(annotationWrapper.localName === "div") {
      annotationWrapper.parentNode.insertBefore(annotationNode, annotationWrapper);
      annotationWrapper.parentNode.removeChild(annotationWrapper)
    }
  }
  function highlightAnnotation(annotation) {
    var annotationNode = annotation.node, annotationEnd = annotation.end, range = doc.createRange(), textNodes;
    if(annotationEnd) {
      range.setStart(annotationNode, annotationNode.childNodes.length);
      range.setEnd(annotationEnd, 0);
      textNodes = odfUtils.getTextNodes(range, false);
      textNodes.forEach(function(n) {
        var container = doc.createElement("span");
        container.className = "annotationHighlight";
        container.setAttribute("annotation", annotationNode.getAttributeNS(odf.Namespaces.officens, "name"));
        n.parentNode.insertBefore(container, n);
        container.appendChild(n)
      })
    }
    range.detach()
  }
  function unhighlightAnnotation(annotation) {
    var annotationName = annotation.node.getAttributeNS(odf.Namespaces.officens, "name"), highlightSpans = doc.querySelectorAll('span.annotationHighlight[annotation="' + annotationName + '"]'), i, container;
    for(i = 0;i < highlightSpans.length;i += 1) {
      container = highlightSpans[i];
      while(container.firstChild) {
        container.parentNode.insertBefore(container.firstChild, container)
      }
      container.parentNode.removeChild(container)
    }
  }
  function lineDistance(point1, point2) {
    var xs = 0, ys = 0;
    xs = point2.x - point1.x;
    xs = xs * xs;
    ys = point2.y - point1.y;
    ys = ys * ys;
    return Math.sqrt(xs + ys)
  }
  function renderAnnotation(annotation) {
    var annotationNote = annotation.node.parentNode, connectorHorizontal = annotationNote.nextSibling, connectorAngular = connectorHorizontal.nextSibling, annotationWrapper = annotationNote.parentNode, connectorAngle = 0, previousAnnotation = annotations[annotations.indexOf(annotation) - 1], previousRect, creatorNode = annotation.node.getElementsByTagNameNS(odf.Namespaces.dcns, "creator")[0], creatorName, zoomLevel = odfCanvas.getZoomLevel();
    annotationNote.style.left = (annotationsPane.getBoundingClientRect().left - annotationWrapper.getBoundingClientRect().left) / zoomLevel + "px";
    annotationNote.style.width = annotationsPane.getBoundingClientRect().width / zoomLevel + "px";
    connectorHorizontal.style.width = parseFloat(annotationNote.style.left) - CONNECTOR_MARGIN + "px";
    if(previousAnnotation) {
      previousRect = previousAnnotation.node.parentNode.getBoundingClientRect();
      if((annotationWrapper.getBoundingClientRect().top - previousRect.bottom) / zoomLevel <= NOTE_MARGIN) {
        annotationNote.style.top = Math.abs(annotationWrapper.getBoundingClientRect().top - previousRect.bottom) / zoomLevel + NOTE_MARGIN + "px"
      }else {
        annotationNote.style.top = "0px"
      }
    }
    connectorAngular.style.left = connectorHorizontal.getBoundingClientRect().width / zoomLevel + "px";
    connectorAngular.style.width = lineDistance({x:connectorAngular.getBoundingClientRect().left / zoomLevel, y:connectorAngular.getBoundingClientRect().top / zoomLevel}, {x:annotationNote.getBoundingClientRect().left / zoomLevel, y:annotationNote.getBoundingClientRect().top / zoomLevel}) + "px";
    connectorAngle = Math.asin((annotationNote.getBoundingClientRect().top - connectorAngular.getBoundingClientRect().top) / (zoomLevel * parseFloat(connectorAngular.style.width)));
    connectorAngular.style.transform = "rotate(" + connectorAngle + "rad)";
    connectorAngular.style.MozTransform = "rotate(" + connectorAngle + "rad)";
    connectorAngular.style.WebkitTransform = "rotate(" + connectorAngle + "rad)";
    connectorAngular.style.msTransform = "rotate(" + connectorAngle + "rad)";
    if(creatorNode) {
      creatorName = window.getComputedStyle((creatorNode), ":before").content;
      if(creatorName && creatorName !== "none") {
        creatorName = creatorName.substring(1, creatorName.length - 1);
        if(creatorNode.firstChild) {
          creatorNode.firstChild.nodeValue = creatorName
        }else {
          creatorNode.appendChild(doc.createTextNode(creatorName))
        }
      }
    }
  }
  function showAnnotationsPane(show) {
    var sizer = odfCanvas.getSizer();
    if(show) {
      annotationsPane.style.display = "inline-block";
      sizer.style.paddingRight = window.getComputedStyle(annotationsPane).width
    }else {
      annotationsPane.style.display = "none";
      sizer.style.paddingRight = 0
    }
    odfCanvas.refreshSize()
  }
  function sortAnnotations() {
    annotations.sort(function(a, b) {
      if(a.node.compareDocumentPosition(b.node) === Node.DOCUMENT_POSITION_FOLLOWING) {
        return-1
      }
      return 1
    })
  }
  function rerenderAnnotations() {
    var i;
    for(i = 0;i < annotations.length;i += 1) {
      renderAnnotation(annotations[i])
    }
  }
  this.rerenderAnnotations = rerenderAnnotations;
  function addAnnotation(annotation) {
    showAnnotationsPane(true);
    annotations.push({node:annotation.node, end:annotation.end});
    sortAnnotations();
    wrapAnnotation(annotation);
    if(annotation.end) {
      highlightAnnotation(annotation)
    }
    rerenderAnnotations()
  }
  this.addAnnotation = addAnnotation;
  function forgetAnnotation(annotation) {
    var index = annotations.indexOf(annotation);
    unwrapAnnotation(annotation);
    unhighlightAnnotation(annotation);
    if(index !== -1) {
      annotations.splice(index, 1)
    }
    if(annotations.length === 0) {
      showAnnotationsPane(false)
    }
  }
  function forgetAnnotations() {
    while(annotations.length) {
      forgetAnnotation(annotations[0])
    }
  }
  this.forgetAnnotations = forgetAnnotations
};
/*

 Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
odf.OdfNodeFilter = function OdfNodeFilter() {
  this.acceptNode = function(node) {
    var result;
    if(node.namespaceURI === "http://www.w3.org/1999/xhtml") {
      result = NodeFilter.FILTER_SKIP
    }else {
      if(node.namespaceURI && node.namespaceURI.match(/^urn:webodf:/)) {
        result = NodeFilter.FILTER_REJECT
      }else {
        result = NodeFilter.FILTER_ACCEPT
      }
    }
    return result
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
odf.Namespaces = function() {
  var dbns = "urn:oasis:names:tc:opendocument:xmlns:database:1.0", dcns = "http://purl.org/dc/elements/1.1/", dr3dns = "urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0", drawns = "urn:oasis:names:tc:opendocument:xmlns:drawing:1.0", chartns = "urn:oasis:names:tc:opendocument:xmlns:chart:1.0", fons = "urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0", formns = "urn:oasis:names:tc:opendocument:xmlns:form:1.0", numberns = "urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0", officens = "urn:oasis:names:tc:opendocument:xmlns:office:1.0", 
  presentationns = "urn:oasis:names:tc:opendocument:xmlns:presentation:1.0", stylens = "urn:oasis:names:tc:opendocument:xmlns:style:1.0", svgns = "urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0", tablens = "urn:oasis:names:tc:opendocument:xmlns:table:1.0", textns = "urn:oasis:names:tc:opendocument:xmlns:text:1.0", xlinkns = "http://www.w3.org/1999/xlink", xmlns = "http://www.w3.org/XML/1998/namespace", webodfns = "urn:webodf", namespaceMap = {"db":dbns, "dc":dcns, "dr3d":dr3dns, "draw":drawns, 
  "chart":chartns, "fo":fons, "form":formns, "numberns":numberns, "office":officens, "presentation":presentationns, "style":stylens, "svg":svgns, "table":tablens, "text":textns, "xlink":xlinkns, "xml":xmlns, "webodf":webodfns}, namespaces;
  function forEachPrefix(cb) {
    var prefix;
    for(prefix in namespaceMap) {
      if(namespaceMap.hasOwnProperty(prefix)) {
        cb(prefix, namespaceMap[prefix])
      }
    }
  }
  function resolvePrefix(prefix) {
    return namespaceMap[prefix] || null
  }
  resolvePrefix.lookupNamespaceURI = resolvePrefix;
  namespaces = function Namespaces() {
  };
  namespaces.forEachPrefix = forEachPrefix;
  namespaces.resolvePrefix = resolvePrefix;
  namespaces.namespaceMap = namespaceMap;
  namespaces.dbns = dbns;
  namespaces.dcns = dcns;
  namespaces.dr3dns = dr3dns;
  namespaces.drawns = drawns;
  namespaces.chartns = chartns;
  namespaces.fons = fons;
  namespaces.formns = formns;
  namespaces.numberns = numberns;
  namespaces.officens = officens;
  namespaces.presentationns = presentationns;
  namespaces.stylens = stylens;
  namespaces.svgns = svgns;
  namespaces.tablens = tablens;
  namespaces.textns = textns;
  namespaces.xlinkns = xlinkns;
  namespaces.xmlns = xmlns;
  namespaces.webodfns = webodfns;
  return namespaces
}();
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("xmldom.XPath");
runtime.loadClass("odf.Namespaces");
odf.StyleInfo = function StyleInfo() {
  var chartns = odf.Namespaces.chartns, dbns = odf.Namespaces.dbns, dr3dns = odf.Namespaces.dr3dns, drawns = odf.Namespaces.drawns, formns = odf.Namespaces.formns, numberns = odf.Namespaces.numberns, officens = odf.Namespaces.officens, presentationns = odf.Namespaces.presentationns, stylens = odf.Namespaces.stylens, tablens = odf.Namespaces.tablens, textns = odf.Namespaces.textns, nsprefixes = {"urn:oasis:names:tc:opendocument:xmlns:chart:1.0":"chart:", "urn:oasis:names:tc:opendocument:xmlns:database:1.0":"db:", 
  "urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0":"dr3d:", "urn:oasis:names:tc:opendocument:xmlns:drawing:1.0":"draw:", "urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0":"fo:", "urn:oasis:names:tc:opendocument:xmlns:form:1.0":"form:", "urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0":"number:", "urn:oasis:names:tc:opendocument:xmlns:office:1.0":"office:", "urn:oasis:names:tc:opendocument:xmlns:presentation:1.0":"presentation:", "urn:oasis:names:tc:opendocument:xmlns:style:1.0":"style:", 
  "urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0":"svg:", "urn:oasis:names:tc:opendocument:xmlns:table:1.0":"table:", "urn:oasis:names:tc:opendocument:xmlns:text:1.0":"chart:", "http://www.w3.org/XML/1998/namespace":"xml:"}, elementstyles = {"text":[{ens:stylens, en:"tab-stop", ans:stylens, a:"leader-text-style"}, {ens:stylens, en:"drop-cap", ans:stylens, a:"style-name"}, {ens:textns, en:"notes-configuration", ans:textns, a:"citation-body-style-name"}, {ens:textns, en:"notes-configuration", 
  ans:textns, a:"citation-style-name"}, {ens:textns, en:"a", ans:textns, a:"style-name"}, {ens:textns, en:"alphabetical-index", ans:textns, a:"style-name"}, {ens:textns, en:"linenumbering-configuration", ans:textns, a:"style-name"}, {ens:textns, en:"list-level-style-number", ans:textns, a:"style-name"}, {ens:textns, en:"ruby-text", ans:textns, a:"style-name"}, {ens:textns, en:"span", ans:textns, a:"style-name"}, {ens:textns, en:"a", ans:textns, a:"visited-style-name"}, {ens:stylens, en:"text-properties", 
  ans:stylens, a:"text-line-through-text-style"}, {ens:textns, en:"alphabetical-index-source", ans:textns, a:"main-entry-style-name"}, {ens:textns, en:"index-entry-bibliography", ans:textns, a:"style-name"}, {ens:textns, en:"index-entry-chapter", ans:textns, a:"style-name"}, {ens:textns, en:"index-entry-link-end", ans:textns, a:"style-name"}, {ens:textns, en:"index-entry-link-start", ans:textns, a:"style-name"}, {ens:textns, en:"index-entry-page-number", ans:textns, a:"style-name"}, {ens:textns, 
  en:"index-entry-span", ans:textns, a:"style-name"}, {ens:textns, en:"index-entry-tab-stop", ans:textns, a:"style-name"}, {ens:textns, en:"index-entry-text", ans:textns, a:"style-name"}, {ens:textns, en:"index-title-template", ans:textns, a:"style-name"}, {ens:textns, en:"list-level-style-bullet", ans:textns, a:"style-name"}, {ens:textns, en:"outline-level-style", ans:textns, a:"style-name"}], "paragraph":[{ens:drawns, en:"caption", ans:drawns, a:"text-style-name"}, {ens:drawns, en:"circle", ans:drawns, 
  a:"text-style-name"}, {ens:drawns, en:"connector", ans:drawns, a:"text-style-name"}, {ens:drawns, en:"control", ans:drawns, a:"text-style-name"}, {ens:drawns, en:"custom-shape", ans:drawns, a:"text-style-name"}, {ens:drawns, en:"ellipse", ans:drawns, a:"text-style-name"}, {ens:drawns, en:"frame", ans:drawns, a:"text-style-name"}, {ens:drawns, en:"line", ans:drawns, a:"text-style-name"}, {ens:drawns, en:"measure", ans:drawns, a:"text-style-name"}, {ens:drawns, en:"path", ans:drawns, a:"text-style-name"}, 
  {ens:drawns, en:"polygon", ans:drawns, a:"text-style-name"}, {ens:drawns, en:"polyline", ans:drawns, a:"text-style-name"}, {ens:drawns, en:"rect", ans:drawns, a:"text-style-name"}, {ens:drawns, en:"regular-polygon", ans:drawns, a:"text-style-name"}, {ens:officens, en:"annotation", ans:drawns, a:"text-style-name"}, {ens:formns, en:"column", ans:formns, a:"text-style-name"}, {ens:stylens, en:"style", ans:stylens, a:"next-style-name"}, {ens:tablens, en:"body", ans:tablens, a:"paragraph-style-name"}, 
  {ens:tablens, en:"even-columns", ans:tablens, a:"paragraph-style-name"}, {ens:tablens, en:"even-rows", ans:tablens, a:"paragraph-style-name"}, {ens:tablens, en:"first-column", ans:tablens, a:"paragraph-style-name"}, {ens:tablens, en:"first-row", ans:tablens, a:"paragraph-style-name"}, {ens:tablens, en:"last-column", ans:tablens, a:"paragraph-style-name"}, {ens:tablens, en:"last-row", ans:tablens, a:"paragraph-style-name"}, {ens:tablens, en:"odd-columns", ans:tablens, a:"paragraph-style-name"}, 
  {ens:tablens, en:"odd-rows", ans:tablens, a:"paragraph-style-name"}, {ens:textns, en:"notes-configuration", ans:textns, a:"default-style-name"}, {ens:textns, en:"alphabetical-index-entry-template", ans:textns, a:"style-name"}, {ens:textns, en:"bibliography-entry-template", ans:textns, a:"style-name"}, {ens:textns, en:"h", ans:textns, a:"style-name"}, {ens:textns, en:"illustration-index-entry-template", ans:textns, a:"style-name"}, {ens:textns, en:"index-source-style", ans:textns, a:"style-name"}, 
  {ens:textns, en:"object-index-entry-template", ans:textns, a:"style-name"}, {ens:textns, en:"p", ans:textns, a:"style-name"}, {ens:textns, en:"table-index-entry-template", ans:textns, a:"style-name"}, {ens:textns, en:"table-of-content-entry-template", ans:textns, a:"style-name"}, {ens:textns, en:"table-index-entry-template", ans:textns, a:"style-name"}, {ens:textns, en:"user-index-entry-template", ans:textns, a:"style-name"}, {ens:stylens, en:"page-layout-properties", ans:stylens, a:"register-truth-ref-style-name"}], 
  "chart":[{ens:chartns, en:"axis", ans:chartns, a:"style-name"}, {ens:chartns, en:"chart", ans:chartns, a:"style-name"}, {ens:chartns, en:"data-label", ans:chartns, a:"style-name"}, {ens:chartns, en:"data-point", ans:chartns, a:"style-name"}, {ens:chartns, en:"equation", ans:chartns, a:"style-name"}, {ens:chartns, en:"error-indicator", ans:chartns, a:"style-name"}, {ens:chartns, en:"floor", ans:chartns, a:"style-name"}, {ens:chartns, en:"footer", ans:chartns, a:"style-name"}, {ens:chartns, en:"grid", 
  ans:chartns, a:"style-name"}, {ens:chartns, en:"legend", ans:chartns, a:"style-name"}, {ens:chartns, en:"mean-value", ans:chartns, a:"style-name"}, {ens:chartns, en:"plot-area", ans:chartns, a:"style-name"}, {ens:chartns, en:"regression-curve", ans:chartns, a:"style-name"}, {ens:chartns, en:"series", ans:chartns, a:"style-name"}, {ens:chartns, en:"stock-gain-marker", ans:chartns, a:"style-name"}, {ens:chartns, en:"stock-loss-marker", ans:chartns, a:"style-name"}, {ens:chartns, en:"stock-range-line", 
  ans:chartns, a:"style-name"}, {ens:chartns, en:"subtitle", ans:chartns, a:"style-name"}, {ens:chartns, en:"title", ans:chartns, a:"style-name"}, {ens:chartns, en:"wall", ans:chartns, a:"style-name"}], "section":[{ens:textns, en:"alphabetical-index", ans:textns, a:"style-name"}, {ens:textns, en:"bibliography", ans:textns, a:"style-name"}, {ens:textns, en:"illustration-index", ans:textns, a:"style-name"}, {ens:textns, en:"index-title", ans:textns, a:"style-name"}, {ens:textns, en:"object-index", 
  ans:textns, a:"style-name"}, {ens:textns, en:"section", ans:textns, a:"style-name"}, {ens:textns, en:"table-of-content", ans:textns, a:"style-name"}, {ens:textns, en:"table-index", ans:textns, a:"style-name"}, {ens:textns, en:"user-index", ans:textns, a:"style-name"}], "ruby":[{ens:textns, en:"ruby", ans:textns, a:"style-name"}], "table":[{ens:dbns, en:"query", ans:dbns, a:"style-name"}, {ens:dbns, en:"table-representation", ans:dbns, a:"style-name"}, {ens:tablens, en:"background", ans:tablens, 
  a:"style-name"}, {ens:tablens, en:"table", ans:tablens, a:"style-name"}], "table-column":[{ens:dbns, en:"column", ans:dbns, a:"style-name"}, {ens:tablens, en:"table-column", ans:tablens, a:"style-name"}], "table-row":[{ens:dbns, en:"query", ans:dbns, a:"default-row-style-name"}, {ens:dbns, en:"table-representation", ans:dbns, a:"default-row-style-name"}, {ens:tablens, en:"table-row", ans:tablens, a:"style-name"}], "table-cell":[{ens:dbns, en:"column", ans:dbns, a:"default-cell-style-name"}, {ens:tablens, 
  en:"table-column", ans:tablens, a:"default-cell-style-name"}, {ens:tablens, en:"table-row", ans:tablens, a:"default-cell-style-name"}, {ens:tablens, en:"body", ans:tablens, a:"style-name"}, {ens:tablens, en:"covered-table-cell", ans:tablens, a:"style-name"}, {ens:tablens, en:"even-columns", ans:tablens, a:"style-name"}, {ens:tablens, en:"covered-table-cell", ans:tablens, a:"style-name"}, {ens:tablens, en:"even-columns", ans:tablens, a:"style-name"}, {ens:tablens, en:"even-rows", ans:tablens, a:"style-name"}, 
  {ens:tablens, en:"first-column", ans:tablens, a:"style-name"}, {ens:tablens, en:"first-row", ans:tablens, a:"style-name"}, {ens:tablens, en:"last-column", ans:tablens, a:"style-name"}, {ens:tablens, en:"last-row", ans:tablens, a:"style-name"}, {ens:tablens, en:"odd-columns", ans:tablens, a:"style-name"}, {ens:tablens, en:"odd-rows", ans:tablens, a:"style-name"}, {ens:tablens, en:"table-cell", ans:tablens, a:"style-name"}], "graphic":[{ens:dr3dns, en:"cube", ans:drawns, a:"style-name"}, {ens:dr3dns, 
  en:"extrude", ans:drawns, a:"style-name"}, {ens:dr3dns, en:"rotate", ans:drawns, a:"style-name"}, {ens:dr3dns, en:"scene", ans:drawns, a:"style-name"}, {ens:dr3dns, en:"sphere", ans:drawns, a:"style-name"}, {ens:drawns, en:"caption", ans:drawns, a:"style-name"}, {ens:drawns, en:"circle", ans:drawns, a:"style-name"}, {ens:drawns, en:"connector", ans:drawns, a:"style-name"}, {ens:drawns, en:"control", ans:drawns, a:"style-name"}, {ens:drawns, en:"custom-shape", ans:drawns, a:"style-name"}, {ens:drawns, 
  en:"ellipse", ans:drawns, a:"style-name"}, {ens:drawns, en:"frame", ans:drawns, a:"style-name"}, {ens:drawns, en:"g", ans:drawns, a:"style-name"}, {ens:drawns, en:"line", ans:drawns, a:"style-name"}, {ens:drawns, en:"measure", ans:drawns, a:"style-name"}, {ens:drawns, en:"page-thumbnail", ans:drawns, a:"style-name"}, {ens:drawns, en:"path", ans:drawns, a:"style-name"}, {ens:drawns, en:"polygon", ans:drawns, a:"style-name"}, {ens:drawns, en:"polyline", ans:drawns, a:"style-name"}, {ens:drawns, en:"rect", 
  ans:drawns, a:"style-name"}, {ens:drawns, en:"regular-polygon", ans:drawns, a:"style-name"}, {ens:officens, en:"annotation", ans:drawns, a:"style-name"}], "presentation":[{ens:dr3dns, en:"cube", ans:presentationns, a:"style-name"}, {ens:dr3dns, en:"extrude", ans:presentationns, a:"style-name"}, {ens:dr3dns, en:"rotate", ans:presentationns, a:"style-name"}, {ens:dr3dns, en:"scene", ans:presentationns, a:"style-name"}, {ens:dr3dns, en:"sphere", ans:presentationns, a:"style-name"}, {ens:drawns, en:"caption", 
  ans:presentationns, a:"style-name"}, {ens:drawns, en:"circle", ans:presentationns, a:"style-name"}, {ens:drawns, en:"connector", ans:presentationns, a:"style-name"}, {ens:drawns, en:"control", ans:presentationns, a:"style-name"}, {ens:drawns, en:"custom-shape", ans:presentationns, a:"style-name"}, {ens:drawns, en:"ellipse", ans:presentationns, a:"style-name"}, {ens:drawns, en:"frame", ans:presentationns, a:"style-name"}, {ens:drawns, en:"g", ans:presentationns, a:"style-name"}, {ens:drawns, en:"line", 
  ans:presentationns, a:"style-name"}, {ens:drawns, en:"measure", ans:presentationns, a:"style-name"}, {ens:drawns, en:"page-thumbnail", ans:presentationns, a:"style-name"}, {ens:drawns, en:"path", ans:presentationns, a:"style-name"}, {ens:drawns, en:"polygon", ans:presentationns, a:"style-name"}, {ens:drawns, en:"polyline", ans:presentationns, a:"style-name"}, {ens:drawns, en:"rect", ans:presentationns, a:"style-name"}, {ens:drawns, en:"regular-polygon", ans:presentationns, a:"style-name"}, {ens:officens, 
  en:"annotation", ans:presentationns, a:"style-name"}], "drawing-page":[{ens:drawns, en:"page", ans:drawns, a:"style-name"}, {ens:presentationns, en:"notes", ans:drawns, a:"style-name"}, {ens:stylens, en:"handout-master", ans:drawns, a:"style-name"}, {ens:stylens, en:"master-page", ans:drawns, a:"style-name"}], "list-style":[{ens:textns, en:"list", ans:textns, a:"style-name"}, {ens:textns, en:"numbered-paragraph", ans:textns, a:"style-name"}, {ens:textns, en:"list-item", ans:textns, a:"style-override"}, 
  {ens:stylens, en:"style", ans:stylens, a:"list-style-name"}], "data":[{ens:stylens, en:"style", ans:stylens, a:"data-style-name"}, {ens:stylens, en:"style", ans:stylens, a:"percentage-data-style-name"}, {ens:presentationns, en:"date-time-decl", ans:stylens, a:"data-style-name"}, {ens:textns, en:"creation-date", ans:stylens, a:"data-style-name"}, {ens:textns, en:"creation-time", ans:stylens, a:"data-style-name"}, {ens:textns, en:"database-display", ans:stylens, a:"data-style-name"}, {ens:textns, 
  en:"date", ans:stylens, a:"data-style-name"}, {ens:textns, en:"editing-duration", ans:stylens, a:"data-style-name"}, {ens:textns, en:"expression", ans:stylens, a:"data-style-name"}, {ens:textns, en:"meta-field", ans:stylens, a:"data-style-name"}, {ens:textns, en:"modification-date", ans:stylens, a:"data-style-name"}, {ens:textns, en:"modification-time", ans:stylens, a:"data-style-name"}, {ens:textns, en:"print-date", ans:stylens, a:"data-style-name"}, {ens:textns, en:"print-time", ans:stylens, 
  a:"data-style-name"}, {ens:textns, en:"table-formula", ans:stylens, a:"data-style-name"}, {ens:textns, en:"time", ans:stylens, a:"data-style-name"}, {ens:textns, en:"user-defined", ans:stylens, a:"data-style-name"}, {ens:textns, en:"user-field-get", ans:stylens, a:"data-style-name"}, {ens:textns, en:"user-field-input", ans:stylens, a:"data-style-name"}, {ens:textns, en:"variable-get", ans:stylens, a:"data-style-name"}, {ens:textns, en:"variable-input", ans:stylens, a:"data-style-name"}, {ens:textns, 
  en:"variable-set", ans:stylens, a:"data-style-name"}], "page-layout":[{ens:presentationns, en:"notes", ans:stylens, a:"page-layout-name"}, {ens:stylens, en:"handout-master", ans:stylens, a:"page-layout-name"}, {ens:stylens, en:"master-page", ans:stylens, a:"page-layout-name"}]}, elements, xpath = new xmldom.XPath;
  function hasDerivedStyles(odfbody, nsResolver, styleElement) {
    var nodes, xp, resolver = nsResolver("style"), styleName = styleElement.getAttributeNS(resolver, "name"), styleFamily = styleElement.getAttributeNS(resolver, "family");
    xp = "//style:*[@style:parent-style-name='" + styleName + "'][@style:family='" + styleFamily + "']";
    nodes = xpath.getODFElementsWithXPath(odfbody, xp, nsResolver);
    if(nodes.length) {
      return true
    }
    return false
  }
  function prefixUsedStyleNames(styleUsingElementsRoot, prefix) {
    var elname = elements[styleUsingElementsRoot.localName], elns = elname && elname[styleUsingElementsRoot.namespaceURI], length = elns ? elns.length : 0, i, stylename, e;
    for(i = 0;i < length;i += 1) {
      stylename = styleUsingElementsRoot.getAttributeNS(elns[i].ns, elns[i].localname);
      if(stylename) {
        styleUsingElementsRoot.setAttributeNS(elns[i].ns, nsprefixes[elns[i].ns] + elns[i].localname, prefix + stylename)
      }
    }
    i = styleUsingElementsRoot.firstChild;
    while(i) {
      if(i.nodeType === Node.ELEMENT_NODE) {
        e = (i);
        prefixUsedStyleNames(e, prefix)
      }
      i = i.nextSibling
    }
  }
  function prefixStyleName(styleElement, prefix) {
    var stylename = styleElement.getAttributeNS(drawns, "name"), ns;
    if(stylename) {
      ns = drawns
    }else {
      stylename = styleElement.getAttributeNS(stylens, "name");
      if(stylename) {
        ns = stylens
      }
    }
    if(ns) {
      styleElement.setAttributeNS(ns, nsprefixes[ns] + "name", prefix + stylename)
    }
  }
  function prefixStyleNames(styleElementsRoot, prefix, styleUsingElementsRoot) {
    var s;
    if(styleElementsRoot) {
      s = styleElementsRoot.firstChild;
      while(s) {
        if(s.nodeType === Node.ELEMENT_NODE) {
          prefixStyleName((s), prefix)
        }
        s = s.nextSibling
      }
      prefixUsedStyleNames(styleElementsRoot, prefix);
      if(styleUsingElementsRoot) {
        prefixUsedStyleNames(styleUsingElementsRoot, prefix)
      }
    }
  }
  function removeRegExpFromUsedStyleNames(styleUsingElementsRoot, regExp) {
    var elname = elements[styleUsingElementsRoot.localName], elns = elname && elname[styleUsingElementsRoot.namespaceURI], length = elns ? elns.length : 0, i, stylename, e;
    for(i = 0;i < length;i += 1) {
      stylename = styleUsingElementsRoot.getAttributeNS(elns[i].ns, elns[i].localname);
      if(stylename) {
        stylename = stylename.replace(regExp, "");
        styleUsingElementsRoot.setAttributeNS(elns[i].ns, nsprefixes[elns[i].ns] + elns[i].localname, stylename)
      }
    }
    i = styleUsingElementsRoot.firstChild;
    while(i) {
      if(i.nodeType === Node.ELEMENT_NODE) {
        e = (i);
        removeRegExpFromUsedStyleNames(e, regExp)
      }
      i = i.nextSibling
    }
  }
  function removeRegExpFromStyleName(styleElement, regExp) {
    var stylename = styleElement.getAttributeNS(drawns, "name"), ns;
    if(stylename) {
      ns = drawns
    }else {
      stylename = styleElement.getAttributeNS(stylens, "name");
      if(stylename) {
        ns = stylens
      }
    }
    if(ns) {
      stylename = stylename.replace(regExp, "");
      styleElement.setAttributeNS(ns, nsprefixes[ns] + "name", stylename)
    }
  }
  function removePrefixFromStyleNames(styleElementsRoot, prefix, styleUsingElementsRoot) {
    var s, regExp = new RegExp("^" + prefix);
    if(styleElementsRoot) {
      s = styleElementsRoot.firstChild;
      while(s) {
        if(s.nodeType === Node.ELEMENT_NODE) {
          removeRegExpFromStyleName((s), regExp)
        }
        s = s.nextSibling
      }
      removeRegExpFromUsedStyleNames(styleElementsRoot, regExp);
      if(styleUsingElementsRoot) {
        removeRegExpFromUsedStyleNames(styleUsingElementsRoot, regExp)
      }
    }
  }
  function determineStylesForNode(node, usedStyles) {
    var elname = elements[node.localName], elns = elname && elname[node.namespaceURI], length = elns ? elns.length : 0, stylename, keyname, map, i;
    for(i = 0;i < length;i += 1) {
      stylename = node.getAttributeNS(elns[i].ns, elns[i].localname);
      if(stylename) {
        usedStyles = usedStyles || {};
        keyname = elns[i].keyname;
        map = usedStyles[keyname] = usedStyles[keyname] || {};
        map[stylename] = 1
      }
    }
    return usedStyles
  }
  function determineUsedStyles(styleUsingElementsRoot, usedStyles) {
    var i, e;
    determineStylesForNode(styleUsingElementsRoot, usedStyles);
    i = styleUsingElementsRoot.firstChild;
    while(i) {
      if(i.nodeType === Node.ELEMENT_NODE) {
        e = (i);
        determineUsedStyles(e, usedStyles)
      }
      i = i.nextSibling
    }
  }
  function StyleDefinition(key, name, family) {
    this.key = key;
    this.name = name;
    this.family = family;
    this.requires = {}
  }
  function getStyleDefinition(stylename, stylefamily, knownStyles) {
    var styleKey = stylename + '"' + stylefamily, styleDefinition = knownStyles[styleKey];
    if(!styleDefinition) {
      styleDefinition = knownStyles[styleKey] = new StyleDefinition(styleKey, stylename, stylefamily)
    }
    return styleDefinition
  }
  function determineDependentStyles(styleUsingElementsRoot, styleScope, knownStyles) {
    var elname = elements[styleUsingElementsRoot.localName], elns = elname && elname[styleUsingElementsRoot.namespaceURI], length = elns ? elns.length : 0, newScopeName = styleUsingElementsRoot.getAttributeNS(stylens, "name"), newScopeFamily = styleUsingElementsRoot.getAttributeNS(stylens, "family"), referencedStyleName, referencedStyleFamily, referencedStyleDef, i, e;
    if(newScopeName && newScopeFamily) {
      styleScope = getStyleDefinition(newScopeName, newScopeFamily, knownStyles)
    }
    if(styleScope) {
      for(i = 0;i < length;i += 1) {
        referencedStyleName = styleUsingElementsRoot.getAttributeNS(elns[i].ns, elns[i].localname);
        if(referencedStyleName) {
          referencedStyleFamily = elns[i].keyname;
          referencedStyleDef = getStyleDefinition(referencedStyleName, referencedStyleFamily, knownStyles);
          styleScope.requires[referencedStyleDef.key] = referencedStyleDef
        }
      }
    }
    i = styleUsingElementsRoot.firstChild;
    while(i) {
      if(i.nodeType === Node.ELEMENT_NODE) {
        e = (i);
        determineDependentStyles(e, styleScope, knownStyles)
      }
      i = i.nextSibling
    }
    return knownStyles
  }
  function inverse(elementstyles) {
    var keyname, i, l, list, item, e = {}, map, array;
    for(keyname in elementstyles) {
      if(elementstyles.hasOwnProperty(keyname)) {
        list = elementstyles[keyname];
        l = list.length;
        for(i = 0;i < l;i += 1) {
          item = list[i];
          map = e[item.en] = e[item.en] || {};
          array = map[item.ens] = map[item.ens] || [];
          array.push({ns:item.ans, localname:item.a, keyname:keyname})
        }
      }
    }
    return e
  }
  function mergeRequiredStyles(styleDependency, usedStyles) {
    var family = usedStyles[styleDependency.family];
    if(!family) {
      family = usedStyles[styleDependency.family] = {}
    }
    family[styleDependency.name] = 1;
    Object.keys((styleDependency.requires)).forEach(function(requiredStyleKey) {
      mergeRequiredStyles((styleDependency.requires[requiredStyleKey]), usedStyles)
    })
  }
  function mergeUsedAutomaticStyles(automaticStylesRoot, usedStyles) {
    var automaticStyles = determineDependentStyles(automaticStylesRoot, null, {});
    Object.keys(automaticStyles).forEach(function(styleKey) {
      var automaticStyleDefinition = automaticStyles[styleKey], usedFamily = usedStyles[automaticStyleDefinition.family];
      if(usedFamily && usedFamily.hasOwnProperty(automaticStyleDefinition.name)) {
        mergeRequiredStyles(automaticStyleDefinition, usedStyles)
      }
    })
  }
  this.UsedStyleList = function(styleUsingElementsRoot, automaticStylesRoot) {
    var usedStyles = {};
    this.uses = function(element) {
      var localName = element.localName, name = element.getAttributeNS(drawns, "name") || element.getAttributeNS(stylens, "name"), keyName, map;
      if(localName === "style") {
        keyName = element.getAttributeNS(stylens, "family")
      }else {
        if(element.namespaceURI === numberns) {
          keyName = "data"
        }else {
          keyName = localName
        }
      }
      map = usedStyles[keyName];
      return map ? map[name] > 0 : false
    };
    determineUsedStyles(styleUsingElementsRoot, usedStyles);
    if(automaticStylesRoot) {
      mergeUsedAutomaticStyles(automaticStylesRoot, usedStyles)
    }
  };
  this.hasDerivedStyles = hasDerivedStyles;
  this.prefixStyleNames = prefixStyleNames;
  this.removePrefixFromStyleNames = removePrefixFromStyleNames;
  this.determineStylesForNode = determineStylesForNode;
  elements = inverse(elementstyles)
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("core.DomUtils");
runtime.loadClass("odf.Namespaces");
odf.OdfUtils = function OdfUtils() {
  var textns = odf.Namespaces.textns, drawns = odf.Namespaces.drawns, whitespaceOnly = /^\s*$/, domUtils = new core.DomUtils;
  function isParagraph(e) {
    var name = e && e.localName;
    return(name === "p" || name === "h") && e.namespaceURI === textns
  }
  this.isParagraph = isParagraph;
  function getParagraphElement(node) {
    while(node && !isParagraph(node)) {
      node = node.parentNode
    }
    return node
  }
  this.getParagraphElement = getParagraphElement;
  this.isWithinTrackedChanges = function(node, container) {
    while(node && node !== container) {
      if(node.namespaceURI === textns && node.localName === "tracked-changes") {
        return true
      }
      node = node.parentNode
    }
    return false
  };
  this.isListItem = function(e) {
    var name = e && e.localName;
    return name === "list-item" && e.namespaceURI === textns
  };
  function isODFWhitespace(text) {
    return/^[ \t\r\n]+$/.test(text)
  }
  this.isODFWhitespace = isODFWhitespace;
  function isGroupingElement(e) {
    var localName = e && e.localName;
    if(/^(span|p|h|a|meta)$/.test(localName) && e.namespaceURI === textns || localName === "span" && e.className === "annotationHighlight") {
      return true
    }
    return false
  }
  this.isGroupingElement = isGroupingElement;
  function isCharacterElement(e) {
    var n = e && e.localName, ns, r = false;
    if(n) {
      ns = e.namespaceURI;
      if(ns === textns) {
        r = n === "s" || n === "tab" || n === "line-break"
      }else {
        if(ns === drawns) {
          r = n === "frame" && e.getAttributeNS(textns, "anchor-type") === "as-char"
        }
      }
    }
    return r
  }
  this.isCharacterElement = isCharacterElement;
  function firstChild(node) {
    while(node.firstChild !== null && isGroupingElement(node)) {
      node = node.firstChild
    }
    return node
  }
  this.firstChild = firstChild;
  function lastChild(node) {
    while(node.lastChild !== null && isGroupingElement(node)) {
      node = node.lastChild
    }
    return node
  }
  this.lastChild = lastChild;
  function previousNode(node) {
    while(!isParagraph(node) && node.previousSibling === null) {
      node = (node.parentNode)
    }
    return isParagraph(node) ? null : lastChild((node.previousSibling))
  }
  this.previousNode = previousNode;
  function nextNode(node) {
    while(!isParagraph(node) && node.nextSibling === null) {
      node = (node.parentNode)
    }
    return isParagraph(node) ? null : firstChild((node.nextSibling))
  }
  this.nextNode = nextNode;
  function scanLeftForNonWhitespace(node) {
    var r = false;
    while(node) {
      if(node.nodeType === Node.TEXT_NODE) {
        if(node.length === 0) {
          node = previousNode(node)
        }else {
          return!isODFWhitespace(node.data.substr(node.length - 1, 1))
        }
      }else {
        if(isCharacterElement(node)) {
          r = true;
          node = null
        }else {
          node = previousNode(node)
        }
      }
    }
    return r
  }
  this.scanLeftForNonWhitespace = scanLeftForNonWhitespace;
  function lookLeftForCharacter(node) {
    var text, r = 0;
    if(node.nodeType === Node.TEXT_NODE && node.length > 0) {
      text = node.data;
      if(!isODFWhitespace(text.substr(text.length - 1, 1))) {
        r = 1
      }else {
        if(text.length === 1) {
          r = scanLeftForNonWhitespace(previousNode(node)) ? 2 : 0
        }else {
          r = isODFWhitespace(text.substr(text.length - 2, 1)) ? 0 : 2
        }
      }
    }else {
      if(isCharacterElement(node)) {
        r = 1
      }
    }
    return r
  }
  this.lookLeftForCharacter = lookLeftForCharacter;
  function lookRightForCharacter(node) {
    var r = false;
    if(node && node.nodeType === Node.TEXT_NODE && node.length > 0) {
      r = !isODFWhitespace(node.data.substr(0, 1))
    }else {
      if(isCharacterElement(node)) {
        r = true
      }
    }
    return r
  }
  this.lookRightForCharacter = lookRightForCharacter;
  function scanLeftForAnyCharacter(node) {
    var r = false;
    node = node && lastChild(node);
    while(node) {
      if(node.nodeType === Node.TEXT_NODE && node.length > 0 && !isODFWhitespace(node.data)) {
        r = true;
        break
      }
      if(isCharacterElement(node)) {
        r = true;
        break
      }
      node = previousNode(node)
    }
    return r
  }
  this.scanLeftForAnyCharacter = scanLeftForAnyCharacter;
  function scanRightForAnyCharacter(node) {
    var r = false;
    node = node && firstChild(node);
    while(node) {
      if(node.nodeType === Node.TEXT_NODE && node.length > 0 && !isODFWhitespace(node.data)) {
        r = true;
        break
      }
      if(isCharacterElement(node)) {
        r = true;
        break
      }
      node = nextNode(node)
    }
    return r
  }
  this.scanRightForAnyCharacter = scanRightForAnyCharacter;
  function isTrailingWhitespace(textnode, offset) {
    if(!isODFWhitespace(textnode.data.substr(offset))) {
      return false
    }
    return!scanRightForAnyCharacter(nextNode(textnode))
  }
  this.isTrailingWhitespace = isTrailingWhitespace;
  function isSignificantWhitespace(textNode, offset) {
    var text = textNode.data, result;
    if(!isODFWhitespace(text[offset])) {
      return false
    }
    if(isCharacterElement(textNode.parentNode)) {
      return false
    }
    if(offset > 0) {
      if(!isODFWhitespace(text[offset - 1])) {
        result = true
      }
    }else {
      if(scanLeftForNonWhitespace(previousNode(textNode))) {
        result = true
      }
    }
    if(result === true) {
      return isTrailingWhitespace(textNode, offset) ? false : true
    }
    return false
  }
  this.isSignificantWhitespace = isSignificantWhitespace;
  this.isDowngradableSpaceElement = function(node) {
    if(node.namespaceURI === textns && node.localName === "s") {
      return scanLeftForNonWhitespace(previousNode(node)) && scanRightForAnyCharacter(nextNode(node))
    }
    return false
  };
  function getFirstNonWhitespaceChild(node) {
    var child = node && node.firstChild;
    while(child && child.nodeType === Node.TEXT_NODE && whitespaceOnly.test(child.nodeValue)) {
      child = child.nextSibling
    }
    return child
  }
  this.getFirstNonWhitespaceChild = getFirstNonWhitespaceChild;
  function parseLength(length) {
    var re = /(-?[0-9]*[0-9][0-9]*(\.[0-9]*)?|0+\.[0-9]*[1-9][0-9]*|\.[0-9]*[1-9][0-9]*)((cm)|(mm)|(in)|(pt)|(pc)|(px)|(%))/, m = re.exec(length);
    if(!m) {
      return null
    }
    return{value:parseFloat(m[1]), unit:m[3]}
  }
  this.parseLength = parseLength;
  function parsePositiveLength(length) {
    var result = parseLength(length);
    if(result && (result.value <= 0 || result.unit === "%")) {
      return null
    }
    return result
  }
  function parseNonNegativeLength(length) {
    var result = parseLength(length);
    if(result && (result.value < 0 || result.unit === "%")) {
      return null
    }
    return result
  }
  this.parseNonNegativeLength = parseNonNegativeLength;
  function parsePercentage(length) {
    var result = parseLength(length);
    if(result && result.unit !== "%") {
      return null
    }
    return result
  }
  function parseFoFontSize(fontSize) {
    return parsePositiveLength(fontSize) || parsePercentage(fontSize)
  }
  this.parseFoFontSize = parseFoFontSize;
  function parseFoLineHeight(lineHeight) {
    return parseNonNegativeLength(lineHeight) || parsePercentage(lineHeight)
  }
  this.parseFoLineHeight = parseFoLineHeight;
  function getImpactedParagraphs(range) {
    var outerContainer = (range.commonAncestorContainer), impactedParagraphs = [];
    if(outerContainer.nodeType === Node.ELEMENT_NODE) {
      impactedParagraphs = domUtils.getElementsByTagNameNS(outerContainer, textns, "p").concat(domUtils.getElementsByTagNameNS(outerContainer, textns, "h"))
    }
    while(outerContainer && !isParagraph(outerContainer)) {
      outerContainer = outerContainer.parentNode
    }
    if(outerContainer) {
      impactedParagraphs.push(outerContainer)
    }
    return impactedParagraphs.filter(function(n) {
      return domUtils.rangeIntersectsNode(range, n)
    })
  }
  this.getImpactedParagraphs = getImpactedParagraphs;
  function isAcceptedNode(node) {
    switch(node.namespaceURI) {
      case odf.Namespaces.drawns:
      ;
      case odf.Namespaces.svgns:
      ;
      case odf.Namespaces.dr3dns:
        return false;
      case odf.Namespaces.textns:
        switch(node.localName) {
          case "note-body":
          ;
          case "ruby-text":
            return false
        }
        break;
      case odf.Namespaces.officens:
        switch(node.localName) {
          case "annotation":
          ;
          case "binary-data":
          ;
          case "event-listeners":
            return false
        }
        break;
      default:
        switch(node.localName) {
          case "editinfo":
            return false
        }
        break
    }
    return true
  }
  function isSignificantTextContent(textNode) {
    return Boolean(getParagraphElement(textNode) && (!isODFWhitespace(textNode.textContent) || isSignificantWhitespace(textNode, 0)))
  }
  function getTextNodes(range, includePartial) {
    var document = range.startContainer.ownerDocument, nodeRange = document.createRange(), textNodes;
    function nodeFilter(node) {
      nodeRange.selectNodeContents(node);
      if(node.nodeType === Node.TEXT_NODE) {
        if(includePartial && domUtils.rangesIntersect(range, nodeRange) || domUtils.containsRange(range, nodeRange)) {
          return isSignificantTextContent(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        }
      }else {
        if(domUtils.rangesIntersect(range, nodeRange)) {
          if(isAcceptedNode(node)) {
            return NodeFilter.FILTER_SKIP
          }
        }
      }
      return NodeFilter.FILTER_REJECT
    }
    textNodes = domUtils.getNodesInRange(range, nodeFilter);
    nodeRange.detach();
    return textNodes
  }
  this.getTextNodes = getTextNodes;
  this.getTextElements = function(range, includeInsignificantWhitespace) {
    var document = range.startContainer.ownerDocument, nodeRange = document.createRange(), elements;
    function nodeFilter(node) {
      var nodeType = node.nodeType;
      nodeRange.selectNodeContents(node);
      if(nodeType === Node.TEXT_NODE) {
        if(domUtils.containsRange(range, nodeRange) && (includeInsignificantWhitespace || isSignificantTextContent(node))) {
          return NodeFilter.FILTER_ACCEPT
        }
      }else {
        if(isCharacterElement(node)) {
          if(domUtils.containsRange(range, nodeRange)) {
            return NodeFilter.FILTER_ACCEPT
          }
        }else {
          if(isAcceptedNode(node) || isGroupingElement(node)) {
            return NodeFilter.FILTER_SKIP
          }
        }
      }
      return NodeFilter.FILTER_REJECT
    }
    elements = domUtils.getNodesInRange(range, nodeFilter);
    nodeRange.detach();
    return elements
  };
  this.getParagraphElements = function(range) {
    var document = range.startContainer.ownerDocument, nodeRange = document.createRange(), elements;
    function nodeFilter(node) {
      nodeRange.selectNodeContents(node);
      if(isParagraph(node)) {
        if(domUtils.rangesIntersect(range, nodeRange)) {
          return NodeFilter.FILTER_ACCEPT
        }
      }else {
        if(isAcceptedNode(node) || isGroupingElement(node)) {
          return NodeFilter.FILTER_SKIP
        }
      }
      return NodeFilter.FILTER_REJECT
    }
    elements = domUtils.getNodesInRange(range, nodeFilter);
    nodeRange.detach();
    return elements
  }
};
/*

 Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("odf.OdfUtils");
odf.TextSerializer = function TextSerializer() {
  var self = this, odfUtils = new odf.OdfUtils;
  function serializeNode(node) {
    var s = "", accept = self.filter ? self.filter.acceptNode(node) : NodeFilter.FILTER_ACCEPT, nodeType = node.nodeType, child;
    if(accept === NodeFilter.FILTER_ACCEPT || accept === NodeFilter.FILTER_SKIP) {
      child = node.firstChild;
      while(child) {
        s += serializeNode(child);
        child = child.nextSibling
      }
    }
    if(accept === NodeFilter.FILTER_ACCEPT) {
      if(nodeType === Node.ELEMENT_NODE && odfUtils.isParagraph(node)) {
        s += "\n"
      }else {
        if(nodeType === Node.TEXT_NODE && node.textContent) {
          s += node.textContent
        }
      }
    }
    return s
  }
  this.filter = null;
  this.writeToString = function(node) {
    if(!node) {
      return""
    }
    return serializeNode(node)
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("core.DomUtils");
runtime.loadClass("core.LoopWatchDog");
runtime.loadClass("odf.Namespaces");
odf.TextStyleApplicator = function TextStyleApplicator(styleNameGenerator, formatting, automaticStyles) {
  var domUtils = new core.DomUtils, textns = odf.Namespaces.textns, stylens = odf.Namespaces.stylens, textProperties = "style:text-properties", webodfns = "urn:webodf:names:scope";
  function StyleLookup(info) {
    function compare(expected, actual) {
      if(typeof expected === "object" && typeof actual === "object") {
        return Object.keys(expected).every(function(key) {
          return compare(expected[key], actual[key])
        })
      }
      return expected === actual
    }
    this.isStyleApplied = function(textNode) {
      var appliedStyle = formatting.getAppliedStylesForElement(textNode);
      return compare(info, appliedStyle)
    }
  }
  function StyleManager(info) {
    var createdStyles = {};
    function createDirectFormat(existingStyleName, document) {
      var derivedStyleInfo, derivedStyleNode;
      derivedStyleInfo = existingStyleName ? formatting.createDerivedStyleObject(existingStyleName, "text", info) : info;
      derivedStyleNode = document.createElementNS(stylens, "style:style");
      formatting.updateStyle(derivedStyleNode, derivedStyleInfo);
      derivedStyleNode.setAttributeNS(stylens, "style:name", styleNameGenerator.generateName());
      derivedStyleNode.setAttributeNS(stylens, "style:family", "text");
      derivedStyleNode.setAttributeNS(webodfns, "scope", "document-content");
      automaticStyles.appendChild(derivedStyleNode);
      return derivedStyleNode
    }
    function getDirectStyle(existingStyleName, document) {
      existingStyleName = existingStyleName || "";
      if(!createdStyles.hasOwnProperty(existingStyleName)) {
        createdStyles[existingStyleName] = createDirectFormat(existingStyleName, document)
      }
      return createdStyles[existingStyleName].getAttributeNS(stylens, "name")
    }
    this.applyStyleToContainer = function(container) {
      var name = getDirectStyle(container.getAttributeNS(textns, "style-name"), container.ownerDocument);
      container.setAttributeNS(textns, "text:style-name", name)
    }
  }
  function isTextSpan(node) {
    return node.localName === "span" && node.namespaceURI === textns
  }
  function moveToNewSpan(startNode, limits) {
    var document = startNode.ownerDocument, originalContainer = (startNode.parentNode), styledContainer, trailingContainer, moveTrailing, node, nextNode, loopGuard = new core.LoopWatchDog(1E3), styledNodes = [];
    if(!isTextSpan(originalContainer)) {
      styledContainer = document.createElementNS(textns, "text:span");
      originalContainer.insertBefore(styledContainer, startNode);
      moveTrailing = false
    }else {
      if(startNode.previousSibling && !domUtils.rangeContainsNode(limits, (originalContainer.firstChild))) {
        styledContainer = originalContainer.cloneNode(false);
        originalContainer.parentNode.insertBefore(styledContainer, originalContainer.nextSibling);
        moveTrailing = true
      }else {
        styledContainer = originalContainer;
        moveTrailing = true
      }
    }
    styledNodes.push(startNode);
    node = startNode.nextSibling;
    while(node && domUtils.rangeContainsNode(limits, node)) {
      loopGuard.check();
      styledNodes.push(node);
      node = node.nextSibling
    }
    styledNodes.forEach(function(node) {
      if(node.parentNode !== styledContainer) {
        styledContainer.appendChild(node)
      }
    });
    if(node && moveTrailing) {
      trailingContainer = styledContainer.cloneNode(false);
      styledContainer.parentNode.insertBefore(trailingContainer, styledContainer.nextSibling);
      while(node) {
        loopGuard.check();
        nextNode = node.nextSibling;
        trailingContainer.appendChild(node);
        node = nextNode
      }
    }
    return(styledContainer)
  }
  this.applyStyle = function(textNodes, limits, info) {
    var textPropsOnly = {}, isStyled, container, styleCache, styleLookup;
    runtime.assert(info && info[textProperties], "applyStyle without any text properties");
    textPropsOnly[textProperties] = info[textProperties];
    styleCache = new StyleManager(textPropsOnly);
    styleLookup = new StyleLookup(textPropsOnly);
    textNodes.forEach(function(n) {
      isStyled = styleLookup.isStyleApplied(n);
      if(isStyled === false) {
        container = moveToNewSpan((n), limits);
        styleCache.applyStyleToContainer(container)
      }
    })
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("odf.Namespaces");
runtime.loadClass("odf.OdfUtils");
runtime.loadClass("xmldom.XPath");
runtime.loadClass("core.CSSUnits");
odf.Style2CSS = function Style2CSS() {
  var drawns = odf.Namespaces.drawns, fons = odf.Namespaces.fons, stylens = odf.Namespaces.stylens, svgns = odf.Namespaces.svgns, tablens = odf.Namespaces.tablens, textns = odf.Namespaces.textns, xlinkns = odf.Namespaces.xlinkns, presentationns = odf.Namespaces.presentationns, familynamespaceprefixes = {"graphic":"draw", "drawing-page":"draw", "paragraph":"text", "presentation":"presentation", "ruby":"text", "section":"text", "table":"table", "table-cell":"table", "table-column":"table", "table-row":"table", 
  "text":"text", "list":"text", "page":"office"}, familytagnames = {"graphic":["circle", "connected", "control", "custom-shape", "ellipse", "frame", "g", "line", "measure", "page", "page-thumbnail", "path", "polygon", "polyline", "rect", "regular-polygon"], "paragraph":["alphabetical-index-entry-template", "h", "illustration-index-entry-template", "index-source-style", "object-index-entry-template", "p", "table-index-entry-template", "table-of-content-entry-template", "user-index-entry-template"], 
  "presentation":["caption", "circle", "connector", "control", "custom-shape", "ellipse", "frame", "g", "line", "measure", "page-thumbnail", "path", "polygon", "polyline", "rect", "regular-polygon"], "drawing-page":["caption", "circle", "connector", "control", "page", "custom-shape", "ellipse", "frame", "g", "line", "measure", "page-thumbnail", "path", "polygon", "polyline", "rect", "regular-polygon"], "ruby":["ruby", "ruby-text"], "section":["alphabetical-index", "bibliography", "illustration-index", 
  "index-title", "object-index", "section", "table-of-content", "table-index", "user-index"], "table":["background", "table"], "table-cell":["body", "covered-table-cell", "even-columns", "even-rows", "first-column", "first-row", "last-column", "last-row", "odd-columns", "odd-rows", "table-cell"], "table-column":["table-column"], "table-row":["table-row"], "text":["a", "index-entry-chapter", "index-entry-link-end", "index-entry-link-start", "index-entry-page-number", "index-entry-span", "index-entry-tab-stop", 
  "index-entry-text", "index-title-template", "linenumbering-configuration", "list-level-style-number", "list-level-style-bullet", "outline-level-style", "span"], "list":["list-item"]}, textPropertySimpleMapping = [[fons, "color", "color"], [fons, "background-color", "background-color"], [fons, "font-weight", "font-weight"], [fons, "font-style", "font-style"]], bgImageSimpleMapping = [[stylens, "repeat", "background-repeat"]], paragraphPropertySimpleMapping = [[fons, "background-color", "background-color"], 
  [fons, "text-align", "text-align"], [fons, "text-indent", "text-indent"], [fons, "padding", "padding"], [fons, "padding-left", "padding-left"], [fons, "padding-right", "padding-right"], [fons, "padding-top", "padding-top"], [fons, "padding-bottom", "padding-bottom"], [fons, "border-left", "border-left"], [fons, "border-right", "border-right"], [fons, "border-top", "border-top"], [fons, "border-bottom", "border-bottom"], [fons, "margin", "margin"], [fons, "margin-left", "margin-left"], [fons, "margin-right", 
  "margin-right"], [fons, "margin-top", "margin-top"], [fons, "margin-bottom", "margin-bottom"], [fons, "border", "border"]], graphicPropertySimpleMapping = [[fons, "background-color", "background-color"], [fons, "min-height", "min-height"], [drawns, "stroke", "border"], [svgns, "stroke-color", "border-color"], [svgns, "stroke-width", "border-width"], [fons, "border", "border"], [fons, "border-left", "border-left"], [fons, "border-right", "border-right"], [fons, "border-top", "border-top"], [fons, 
  "border-bottom", "border-bottom"]], tablecellPropertySimpleMapping = [[fons, "background-color", "background-color"], [fons, "border-left", "border-left"], [fons, "border-right", "border-right"], [fons, "border-top", "border-top"], [fons, "border-bottom", "border-bottom"], [fons, "border", "border"]], tablecolumnPropertySimpleMapping = [[stylens, "column-width", "width"]], tablerowPropertySimpleMapping = [[stylens, "row-height", "height"], [fons, "keep-together", null]], tablePropertySimpleMapping = 
  [[stylens, "width", "width"], [fons, "margin-left", "margin-left"], [fons, "margin-right", "margin-right"], [fons, "margin-top", "margin-top"], [fons, "margin-bottom", "margin-bottom"]], pageContentPropertySimpleMapping = [[fons, "background-color", "background-color"], [fons, "padding", "padding"], [fons, "padding-left", "padding-left"], [fons, "padding-right", "padding-right"], [fons, "padding-top", "padding-top"], [fons, "padding-bottom", "padding-bottom"], [fons, "border", "border"], [fons, 
  "border-left", "border-left"], [fons, "border-right", "border-right"], [fons, "border-top", "border-top"], [fons, "border-bottom", "border-bottom"], [fons, "margin", "margin"], [fons, "margin-left", "margin-left"], [fons, "margin-right", "margin-right"], [fons, "margin-top", "margin-top"], [fons, "margin-bottom", "margin-bottom"]], pageSizePropertySimpleMapping = [[fons, "page-width", "width"], [fons, "page-height", "height"]], borderPropertyMap = {"border":true, "border-left":true, "border-right":true, 
  "border-top":true, "border-bottom":true, "stroke-width":true}, fontFaceDeclsMap = {}, utils = new odf.OdfUtils, documentType, odfRoot, defaultFontSize, xpath = new xmldom.XPath, cssUnits = new core.CSSUnits;
  function getStyleMap(stylesnode) {
    var stylemap = {}, node, name, family, style;
    if(!stylesnode) {
      return stylemap
    }
    node = stylesnode.firstChild;
    while(node) {
      if(node.namespaceURI === stylens && (node.localName === "style" || node.localName === "default-style")) {
        family = node.getAttributeNS(stylens, "family")
      }else {
        if(node.namespaceURI === textns && node.localName === "list-style") {
          family = "list"
        }else {
          if(node.namespaceURI === stylens && (node.localName === "page-layout" || node.localName === "default-page-layout")) {
            family = "page"
          }else {
            family = undefined
          }
        }
      }
      if(family) {
        name = node.getAttributeNS && node.getAttributeNS(stylens, "name");
        if(!name) {
          name = ""
        }
        style = stylemap[family] = stylemap[family] || {};
        style[name] = node
      }
      node = node.nextSibling
    }
    return stylemap
  }
  function findStyle(stylestree, name) {
    if(!name || !stylestree) {
      return null
    }
    if(stylestree[name]) {
      return stylestree[name]
    }
    var n, style;
    for(n in stylestree) {
      if(stylestree.hasOwnProperty(n)) {
        style = findStyle(stylestree[n].derivedStyles, name);
        if(style) {
          return style
        }
      }
    }
    return null
  }
  function addStyleToStyleTree(stylename, stylesmap, stylestree) {
    var style = stylesmap[stylename], parentname, parentstyle;
    if(!style) {
      return
    }
    parentname = style.getAttributeNS(stylens, "parent-style-name");
    parentstyle = null;
    if(parentname) {
      parentstyle = findStyle(stylestree, parentname);
      if(!parentstyle && stylesmap[parentname]) {
        addStyleToStyleTree(parentname, stylesmap, stylestree);
        parentstyle = stylesmap[parentname];
        stylesmap[parentname] = null
      }
    }
    if(parentstyle) {
      if(!parentstyle.derivedStyles) {
        parentstyle.derivedStyles = {}
      }
      parentstyle.derivedStyles[stylename] = style
    }else {
      stylestree[stylename] = style
    }
  }
  function addStyleMapToStyleTree(stylesmap, stylestree) {
    var name;
    for(name in stylesmap) {
      if(stylesmap.hasOwnProperty(name)) {
        addStyleToStyleTree(name, stylesmap, stylestree);
        stylesmap[name] = null
      }
    }
  }
  function createSelector(family, name) {
    var prefix = familynamespaceprefixes[family], namepart, selector;
    if(prefix === null) {
      return null
    }
    if(name) {
      namepart = "[" + prefix + '|style-name="' + name + '"]'
    }else {
      namepart = ""
    }
    if(prefix === "presentation") {
      prefix = "draw";
      if(name) {
        namepart = '[presentation|style-name="' + name + '"]'
      }else {
        namepart = ""
      }
    }
    selector = prefix + "|" + familytagnames[family].join(namepart + "," + prefix + "|") + namepart;
    return selector
  }
  function getSelectors(family, name, node) {
    var selectors = [], n, ss, s;
    selectors.push(createSelector(family, name));
    for(n in node.derivedStyles) {
      if(node.derivedStyles.hasOwnProperty(n)) {
        ss = getSelectors(family, n, node.derivedStyles[n]);
        for(s in ss) {
          if(ss.hasOwnProperty(s)) {
            selectors.push(ss[s])
          }
        }
      }
    }
    return selectors
  }
  function getDirectChild(node, ns, name) {
    if(!node) {
      return null
    }
    var c = node.firstChild, e;
    while(c) {
      if(c.namespaceURI === ns && c.localName === name) {
        e = (c);
        return e
      }
      c = c.nextSibling
    }
    return null
  }
  function fixBorderWidth(value) {
    var index = value.indexOf(" "), width, theRestOfBorderAttributes;
    if(index !== -1) {
      width = value.substring(0, index);
      theRestOfBorderAttributes = value.substring(index)
    }else {
      width = value;
      theRestOfBorderAttributes = ""
    }
    width = utils.parseLength(width);
    if(width && width.unit === "pt" && width.value < 0.75) {
      value = "0.75pt" + theRestOfBorderAttributes
    }
    return value
  }
  function applySimpleMapping(props, mapping) {
    var rule = "", r, value;
    for(r in mapping) {
      if(mapping.hasOwnProperty(r)) {
        r = mapping[r];
        value = props.getAttributeNS(r[0], r[1]);
        if(value) {
          value = value.trim();
          if(borderPropertyMap.hasOwnProperty(r[1])) {
            value = fixBorderWidth(value)
          }
          if(r[2]) {
            rule += r[2] + ":" + value + ";"
          }
        }
      }
    }
    return rule
  }
  function getFontSize(styleNode) {
    var props = getDirectChild((styleNode), stylens, "text-properties");
    if(props) {
      return utils.parseFoFontSize(props.getAttributeNS(fons, "font-size"))
    }
    return null
  }
  function getParentStyleNode(styleNode) {
    var parentStyleName = "", parentStyleFamily = "", parentStyleNode = null, xp;
    if(styleNode.localName === "default-style") {
      return null
    }
    parentStyleName = styleNode.getAttributeNS(stylens, "parent-style-name");
    parentStyleFamily = styleNode.getAttributeNS(stylens, "family");
    if(parentStyleName) {
      xp = "//style:*[@style:name='" + parentStyleName + "'][@style:family='" + parentStyleFamily + "']"
    }else {
      xp = "//style:default-style[@style:family='" + parentStyleFamily + "']"
    }
    parentStyleNode = xpath.getODFElementsWithXPath((odfRoot), xp, odf.Namespaces.resolvePrefix)[0];
    return parentStyleNode
  }
  function getTextProperties(props) {
    var rule = "", fontName, fontSize, value, textDecoration = "", fontSizeRule = "", sizeMultiplier = 1, parentStyle;
    rule += applySimpleMapping(props, textPropertySimpleMapping);
    value = props.getAttributeNS(stylens, "text-underline-style");
    if(value === "solid") {
      textDecoration += " underline"
    }
    value = props.getAttributeNS(stylens, "text-line-through-style");
    if(value === "solid") {
      textDecoration += " line-through"
    }
    if(textDecoration.length) {
      textDecoration = "text-decoration:" + textDecoration + ";";
      rule += textDecoration
    }
    fontName = props.getAttributeNS(stylens, "font-name") || props.getAttributeNS(fons, "font-family");
    if(fontName) {
      value = fontFaceDeclsMap[fontName];
      rule += "font-family: " + (value || fontName) + ";"
    }
    parentStyle = props.parentNode;
    fontSize = getFontSize((parentStyle));
    if(!fontSize) {
      return rule
    }
    while(parentStyle) {
      fontSize = getFontSize((parentStyle));
      if(fontSize) {
        if(fontSize.unit !== "%") {
          fontSizeRule = "font-size: " + fontSize.value * sizeMultiplier + fontSize.unit + ";";
          break
        }
        sizeMultiplier *= fontSize.value / 100
      }
      parentStyle = getParentStyleNode(parentStyle)
    }
    if(!fontSizeRule) {
      fontSizeRule = "font-size: " + parseFloat(defaultFontSize) * sizeMultiplier + cssUnits.getUnits(defaultFontSize) + ";"
    }
    rule += fontSizeRule;
    return rule
  }
  function getParagraphProperties(props) {
    var rule = "", imageProps, url, element, lineHeight;
    rule += applySimpleMapping(props, paragraphPropertySimpleMapping);
    imageProps = props.getElementsByTagNameNS(stylens, "background-image");
    if(imageProps.length > 0) {
      url = imageProps.item(0).getAttributeNS(xlinkns, "href");
      if(url) {
        rule += "background-image: url('odfkit:" + url + "');";
        element = (imageProps.item(0));
        rule += applySimpleMapping(element, bgImageSimpleMapping)
      }
    }
    lineHeight = props.getAttributeNS(fons, "line-height");
    if(lineHeight && lineHeight !== "normal") {
      lineHeight = utils.parseFoLineHeight(lineHeight);
      if(lineHeight.unit !== "%") {
        rule += "line-height: " + lineHeight.value + lineHeight.unit + ";"
      }else {
        rule += "line-height: " + lineHeight.value / 100 + ";"
      }
    }
    return rule
  }
  function hexToRgb(hex) {
    var result, shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b
    });
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {r:parseInt(result[1], 16), g:parseInt(result[2], 16), b:parseInt(result[3], 16)} : null
  }
  function isNumber(n) {
    return!isNaN(parseFloat(n))
  }
  function getGraphicProperties(props) {
    var rule = "", alpha, bgcolor, fill;
    rule += applySimpleMapping(props, graphicPropertySimpleMapping);
    alpha = props.getAttributeNS(drawns, "opacity");
    fill = props.getAttributeNS(drawns, "fill");
    bgcolor = props.getAttributeNS(drawns, "fill-color");
    if(fill === "solid" || fill === "hatch") {
      if(bgcolor && bgcolor !== "none") {
        alpha = isNumber(alpha) ? parseFloat(alpha) / 100 : 1;
        bgcolor = hexToRgb(bgcolor);
        if(bgcolor) {
          rule += "background-color: rgba(" + bgcolor.r + "," + bgcolor.g + "," + bgcolor.b + "," + alpha + ");"
        }
      }else {
        rule += "background: none;"
      }
    }else {
      if(fill === "none") {
        rule += "background: none;"
      }
    }
    return rule
  }
  function getDrawingPageProperties(props) {
    var rule = "";
    rule += applySimpleMapping(props, graphicPropertySimpleMapping);
    if(props.getAttributeNS(presentationns, "background-visible") === "true") {
      rule += "background: none;"
    }
    return rule
  }
  function getTableCellProperties(props) {
    var rule = "";
    rule += applySimpleMapping(props, tablecellPropertySimpleMapping);
    return rule
  }
  function getTableRowProperties(props) {
    var rule = "";
    rule += applySimpleMapping(props, tablerowPropertySimpleMapping);
    return rule
  }
  function getTableColumnProperties(props) {
    var rule = "";
    rule += applySimpleMapping(props, tablecolumnPropertySimpleMapping);
    return rule
  }
  function getTableProperties(props) {
    var rule = "", borderModel;
    rule += applySimpleMapping(props, tablePropertySimpleMapping);
    borderModel = props.getAttributeNS(tablens, "border-model");
    if(borderModel === "collapsing") {
      rule += "border-collapse:collapse;"
    }else {
      if(borderModel === "separating") {
        rule += "border-collapse:separate;"
      }
    }
    return rule
  }
  function addStyleRule(sheet, family, name, node) {
    var selectors = getSelectors(family, name, node), selector = selectors.join(","), rule = "", properties = getDirectChild(node, stylens, "text-properties");
    if(properties) {
      rule += getTextProperties(properties)
    }
    properties = getDirectChild(node, stylens, "paragraph-properties");
    if(properties) {
      rule += getParagraphProperties(properties)
    }
    properties = getDirectChild(node, stylens, "graphic-properties");
    if(properties) {
      rule += getGraphicProperties(properties)
    }
    properties = getDirectChild(node, stylens, "drawing-page-properties");
    if(properties) {
      rule += getDrawingPageProperties(properties)
    }
    properties = getDirectChild(node, stylens, "table-cell-properties");
    if(properties) {
      rule += getTableCellProperties(properties)
    }
    properties = getDirectChild(node, stylens, "table-row-properties");
    if(properties) {
      rule += getTableRowProperties(properties)
    }
    properties = getDirectChild(node, stylens, "table-column-properties");
    if(properties) {
      rule += getTableColumnProperties(properties)
    }
    properties = getDirectChild(node, stylens, "table-properties");
    if(properties) {
      rule += getTableProperties(properties)
    }
    if(rule.length === 0) {
      return
    }
    rule = selector + "{" + rule + "}";
    try {
      sheet.insertRule(rule, sheet.cssRules.length)
    }catch(e) {
      throw e;
    }
  }
  function getNumberRule(node) {
    var style = node.getAttributeNS(stylens, "num-format"), suffix = node.getAttributeNS(stylens, "num-suffix"), prefix = node.getAttributeNS(stylens, "num-prefix"), stylemap = {1:"decimal", "a":"lower-latin", "A":"upper-latin", "i":"lower-roman", "I":"upper-roman"}, content = prefix || "";
    if(stylemap.hasOwnProperty(style)) {
      content += " counter(list, " + stylemap[style] + ")"
    }else {
      if(style) {
        content += "'" + style + "';"
      }else {
        content += " ''"
      }
    }
    if(suffix) {
      content += " '" + suffix + "'"
    }
    return"content: " + content + ";"
  }
  function getImageRule() {
    var rule = "content: none;";
    return rule
  }
  function getBulletRule(node) {
    var bulletChar = node.getAttributeNS(textns, "bullet-char");
    return"content: '" + bulletChar + "';"
  }
  function addListStyleRule(sheet, name, node, itemrule) {
    var selector = 'text|list[text|style-name="' + name + '"]', level = node.getAttributeNS(textns, "level"), itemSelector, listItemRule, listLevelProps = utils.getFirstNonWhitespaceChild(node), listLevelLabelAlign = utils.getFirstNonWhitespaceChild(listLevelProps), labelAlignAttr, bulletIndent, listIndent, bulletWidth, rule;
    if(listLevelLabelAlign) {
      labelAlignAttr = listLevelLabelAlign.attributes;
      bulletIndent = labelAlignAttr["fo:text-indent"] ? labelAlignAttr["fo:text-indent"].value : undefined;
      listIndent = labelAlignAttr["fo:margin-left"] ? labelAlignAttr["fo:margin-left"].value : undefined
    }
    if(!bulletIndent) {
      bulletIndent = "-0.6cm"
    }
    if(bulletIndent.charAt(0) === "-") {
      bulletWidth = bulletIndent.substring(1)
    }else {
      bulletWidth = "-" + bulletIndent
    }
    level = level && parseInt(level, 10);
    while(level > 1) {
      selector += " > text|list-item > text|list";
      level -= 1
    }
    itemSelector = selector;
    itemSelector += " > text|list-item > *:not(text|list):first-child";
    if(listIndent !== undefined) {
      listItemRule = itemSelector + "{margin-left:" + listIndent + ";}";
      sheet.insertRule(listItemRule, sheet.cssRules.length)
    }
    selector += " > text|list-item > *:not(text|list):first-child:before";
    rule = itemrule;
    rule = selector + "{" + rule + ";";
    rule += "counter-increment:list;";
    rule += "margin-left:" + bulletIndent + ";";
    rule += "width:" + bulletWidth + ";";
    rule += "display:inline-block}";
    try {
      sheet.insertRule(rule, sheet.cssRules.length)
    }catch(e) {
      throw e;
    }
  }
  function addPageStyleRules(sheet, node) {
    var rule = "", imageProps, url, element, contentLayoutRule = "", pageSizeRule = "", props = node.getElementsByTagNameNS(stylens, "page-layout-properties")[0], masterStyles = props.parentNode.parentNode.parentNode.masterStyles, masterPages, masterStyleName = "", i;
    rule += applySimpleMapping(props, pageContentPropertySimpleMapping);
    imageProps = props.getElementsByTagNameNS(stylens, "background-image");
    if(imageProps.length > 0) {
      url = imageProps.item(0).getAttributeNS(xlinkns, "href");
      if(url) {
        rule += "background-image: url('odfkit:" + url + "');";
        element = (imageProps.item(0));
        rule += applySimpleMapping(element, bgImageSimpleMapping)
      }
    }
    if(documentType === "presentation") {
      if(masterStyles) {
        masterPages = masterStyles.getElementsByTagNameNS(stylens, "master-page");
        for(i = 0;i < masterPages.length;i += 1) {
          if(masterPages[i].getAttributeNS(stylens, "page-layout-name") === props.parentNode.getAttributeNS(stylens, "name")) {
            masterStyleName = masterPages[i].getAttributeNS(stylens, "name");
            contentLayoutRule = "draw|page[draw|master-page-name=" + masterStyleName + "] {" + rule + "}";
            pageSizeRule = "office|body, draw|page[draw|master-page-name=" + masterStyleName + "] {" + applySimpleMapping(props, pageSizePropertySimpleMapping) + " }";
            try {
              sheet.insertRule(contentLayoutRule, sheet.cssRules.length);
              sheet.insertRule(pageSizeRule, sheet.cssRules.length)
            }catch(e1) {
              throw e1;
            }
          }
        }
      }
    }else {
      if(documentType === "text") {
        contentLayoutRule = "office|text {" + rule + "}";
        rule = "";
        pageSizeRule = "office|body {" + "width: " + props.getAttributeNS(fons, "page-width") + ";" + "}";
        try {
          sheet.insertRule(contentLayoutRule, sheet.cssRules.length);
          sheet.insertRule(pageSizeRule, sheet.cssRules.length)
        }catch(e2) {
          throw e2;
        }
      }
    }
  }
  function addListStyleRules(sheet, name, node) {
    var n = node.firstChild, e, itemrule;
    while(n) {
      if(n.namespaceURI === textns) {
        e = (n);
        if(n.localName === "list-level-style-number") {
          itemrule = getNumberRule(e);
          addListStyleRule(sheet, name, e, itemrule)
        }else {
          if(n.localName === "list-level-style-image") {
            itemrule = getImageRule();
            addListStyleRule(sheet, name, e, itemrule)
          }else {
            if(n.localName === "list-level-style-bullet") {
              itemrule = getBulletRule(e);
              addListStyleRule(sheet, name, e, itemrule)
            }
          }
        }
      }
      n = n.nextSibling
    }
  }
  function addRule(sheet, family, name, node) {
    if(family === "list") {
      addListStyleRules(sheet, name, node)
    }else {
      if(family === "page") {
        addPageStyleRules(sheet, node)
      }else {
        addStyleRule(sheet, family, name, node)
      }
    }
  }
  function addRules(sheet, family, name, node) {
    addRule(sheet, family, name, node);
    var n;
    for(n in node.derivedStyles) {
      if(node.derivedStyles.hasOwnProperty(n)) {
        addRules(sheet, family, n, node.derivedStyles[n])
      }
    }
  }
  this.style2css = function(doctype, stylesheet, fontFaceMap, styles, autostyles) {
    var doc, styletree, tree, name, rule, family, stylenodes, styleautonodes;
    while(stylesheet.cssRules.length) {
      stylesheet.deleteRule(stylesheet.cssRules.length - 1)
    }
    doc = null;
    if(styles) {
      doc = styles.ownerDocument;
      odfRoot = styles.parentNode
    }
    if(autostyles) {
      doc = autostyles.ownerDocument;
      odfRoot = autostyles.parentNode
    }
    if(!doc) {
      return
    }
    odf.Namespaces.forEachPrefix(function(prefix, ns) {
      rule = "@namespace " + prefix + " url(" + ns + ");";
      try {
        stylesheet.insertRule(rule, stylesheet.cssRules.length)
      }catch(ignore) {
      }
    });
    fontFaceDeclsMap = fontFaceMap;
    documentType = doctype;
    defaultFontSize = runtime.getWindow().getComputedStyle(document.body, null).getPropertyValue("font-size") || "12pt";
    stylenodes = getStyleMap(styles);
    styleautonodes = getStyleMap(autostyles);
    styletree = {};
    for(family in familynamespaceprefixes) {
      if(familynamespaceprefixes.hasOwnProperty(family)) {
        tree = styletree[family] = {};
        addStyleMapToStyleTree(stylenodes[family], tree);
        addStyleMapToStyleTree(styleautonodes[family], tree);
        for(name in tree) {
          if(tree.hasOwnProperty(name)) {
            addRules(stylesheet, family, name, tree[name])
          }
        }
      }
    }
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("core.Base64");
runtime.loadClass("core.Zip");
runtime.loadClass("xmldom.LSSerializer");
runtime.loadClass("odf.StyleInfo");
runtime.loadClass("odf.Namespaces");
runtime.loadClass("odf.OdfNodeFilter");
odf.OdfContainer = function() {
  var styleInfo = new odf.StyleInfo, officens = "urn:oasis:names:tc:opendocument:xmlns:office:1.0", manifestns = "urn:oasis:names:tc:opendocument:xmlns:manifest:1.0", webodfns = "urn:webodf:names:scope", nodeorder = ["meta", "settings", "scripts", "font-face-decls", "styles", "automatic-styles", "master-styles", "body"], automaticStylePrefix = (new Date).getTime() + "_webodf_", base64 = new core.Base64, documentStylesScope = "document-styles", documentContentScope = "document-content";
  function getDirectChild(node, ns, name) {
    node = node ? node.firstChild : null;
    while(node) {
      if(node.localName === name && node.namespaceURI === ns) {
        return(node)
      }
      node = node.nextSibling
    }
    return null
  }
  function getNodePosition(child) {
    var i, l = nodeorder.length;
    for(i = 0;i < l;i += 1) {
      if(child.namespaceURI === officens && child.localName === nodeorder[i]) {
        return i
      }
    }
    return-1
  }
  function OdfStylesFilter(styleUsingElementsRoot, automaticStyles) {
    var usedStyleList = new styleInfo.UsedStyleList(styleUsingElementsRoot, automaticStyles), odfNodeFilter = new odf.OdfNodeFilter;
    this.acceptNode = function(node) {
      var result = odfNodeFilter.acceptNode(node);
      if(result === NodeFilter.FILTER_ACCEPT && node.parentNode === automaticStyles && node.nodeType === Node.ELEMENT_NODE) {
        if(usedStyleList.uses((node))) {
          result = NodeFilter.FILTER_ACCEPT
        }else {
          result = NodeFilter.FILTER_REJECT
        }
      }
      return result
    }
  }
  function OdfContentFilter(styleUsingElementsRoot, automaticStyles) {
    var odfStylesFilter = new OdfStylesFilter(styleUsingElementsRoot, automaticStyles);
    this.acceptNode = function(node) {
      var result = odfStylesFilter.acceptNode(node);
      if(result === NodeFilter.FILTER_ACCEPT && node.parentNode && node.parentNode.namespaceURI === odf.Namespaces.textns && (node.parentNode.localName === "s" || node.parentNode.localName === "tab")) {
        result = NodeFilter.FILTER_REJECT
      }
      return result
    }
  }
  function setChild(node, child) {
    if(!child) {
      return
    }
    var childpos = getNodePosition(child), pos, c = node.firstChild;
    if(childpos === -1) {
      return
    }
    while(c) {
      pos = getNodePosition(c);
      if(pos !== -1 && pos > childpos) {
        break
      }
      c = c.nextSibling
    }
    node.insertBefore(child, c)
  }
  function ODFElement() {
  }
  function ODFDocumentElement(odfcontainer) {
    this.OdfContainer = odfcontainer
  }
  ODFDocumentElement.prototype = new ODFElement;
  ODFDocumentElement.prototype.constructor = ODFDocumentElement;
  ODFDocumentElement.namespaceURI = officens;
  ODFDocumentElement.localName = "document";
  function OdfPart(name, mimetype, container, zip) {
    var self = this;
    this.size = 0;
    this.type = null;
    this.name = name;
    this.container = container;
    this.url = null;
    this.mimetype = null;
    this.document = null;
    this.onreadystatechange = null;
    this.onchange = null;
    this.EMPTY = 0;
    this.LOADING = 1;
    this.DONE = 2;
    this.state = this.EMPTY;
    this.load = function() {
      if(zip === null) {
        return
      }
      this.mimetype = mimetype;
      zip.loadAsDataURL(name, mimetype, function(err, url) {
        if(err) {
          runtime.log(err)
        }
        self.url = url;
        if(self.onchange) {
          self.onchange(self)
        }
        if(self.onstatereadychange) {
          self.onstatereadychange(self)
        }
      })
    }
  }
  OdfPart.prototype.load = function() {
  };
  OdfPart.prototype.getUrl = function() {
    if(this.data) {
      return"data:;base64," + base64.toBase64(this.data)
    }
    return null
  };
  odf.OdfContainer = function OdfContainer(url, onstatereadychange) {
    var self = this, zip, partMimetypes = {}, contentElement;
    this.onstatereadychange = onstatereadychange;
    this.onchange = null;
    this.state = null;
    this.rootElement = null;
    function removeProcessingInstructions(element) {
      var n = element.firstChild, next, e;
      while(n) {
        next = n.nextSibling;
        if(n.nodeType === Node.ELEMENT_NODE) {
          e = (n);
          removeProcessingInstructions(e)
        }else {
          if(n.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
            element.removeChild(n)
          }
        }
        n = next
      }
    }
    function setAutomaticStylesScope(stylesRootElement, scope) {
      var n = stylesRootElement && stylesRootElement.firstChild;
      while(n) {
        if(n.nodeType === Node.ELEMENT_NODE) {
          n.setAttributeNS(webodfns, "scope", scope)
        }
        n = n.nextSibling
      }
    }
    function cloneStylesInScope(stylesRootElement, scope) {
      var copy = null, n, s, scopeAttrValue;
      if(stylesRootElement) {
        copy = stylesRootElement.cloneNode(true);
        n = copy.firstChild;
        while(n) {
          s = n.nextSibling;
          if(n.nodeType === Node.ELEMENT_NODE) {
            scopeAttrValue = n.getAttributeNS(webodfns, "scope");
            if(scopeAttrValue && scopeAttrValue !== scope) {
              copy.removeChild(n)
            }
          }
          n = s
        }
      }
      return copy
    }
    function importRootNode(xmldoc) {
      var doc = self.rootElement.ownerDocument, node;
      if(xmldoc) {
        removeProcessingInstructions(xmldoc.documentElement);
        try {
          node = doc.importNode(xmldoc.documentElement, true)
        }catch(ignore) {
        }
      }
      return node
    }
    function setState(state) {
      self.state = state;
      if(self.onchange) {
        self.onchange(self)
      }
      if(self.onstatereadychange) {
        self.onstatereadychange(self)
      }
    }
    function setRootElement(root) {
      contentElement = null;
      self.rootElement = root;
      root.fontFaceDecls = getDirectChild(root, officens, "font-face-decls");
      root.styles = getDirectChild(root, officens, "styles");
      root.automaticStyles = getDirectChild(root, officens, "automatic-styles");
      root.masterStyles = getDirectChild(root, officens, "master-styles");
      root.body = getDirectChild(root, officens, "body");
      root.meta = getDirectChild(root, officens, "meta")
    }
    function handleFlatXml(xmldoc) {
      var root = importRootNode(xmldoc);
      if(!root || root.localName !== "document" || root.namespaceURI !== officens) {
        setState(OdfContainer.INVALID);
        return
      }
      setRootElement((root));
      setState(OdfContainer.DONE)
    }
    function handleStylesXml(xmldoc) {
      var node = importRootNode(xmldoc), root = self.rootElement;
      if(!node || node.localName !== "document-styles" || node.namespaceURI !== officens) {
        setState(OdfContainer.INVALID);
        return
      }
      root.fontFaceDecls = getDirectChild(node, officens, "font-face-decls");
      setChild(root, root.fontFaceDecls);
      root.styles = getDirectChild(node, officens, "styles");
      setChild(root, root.styles);
      root.automaticStyles = getDirectChild(node, officens, "automatic-styles");
      setAutomaticStylesScope(root.automaticStyles, documentStylesScope);
      setChild(root, root.automaticStyles);
      root.masterStyles = getDirectChild(node, officens, "master-styles");
      setChild(root, root.masterStyles);
      styleInfo.prefixStyleNames(root.automaticStyles, automaticStylePrefix, root.masterStyles)
    }
    function handleContentXml(xmldoc) {
      var node = importRootNode(xmldoc), root, automaticStyles, fontFaceDecls, c;
      if(!node || node.localName !== "document-content" || node.namespaceURI !== officens) {
        setState(OdfContainer.INVALID);
        return
      }
      root = self.rootElement;
      fontFaceDecls = getDirectChild(node, officens, "font-face-decls");
      if(root.fontFaceDecls && fontFaceDecls) {
        c = fontFaceDecls.firstChild;
        while(c) {
          root.fontFaceDecls.appendChild(c);
          c = fontFaceDecls.firstChild
        }
      }else {
        if(fontFaceDecls) {
          root.fontFaceDecls = fontFaceDecls;
          setChild(root, fontFaceDecls)
        }
      }
      automaticStyles = getDirectChild(node, officens, "automatic-styles");
      setAutomaticStylesScope(automaticStyles, documentContentScope);
      if(root.automaticStyles && automaticStyles) {
        c = automaticStyles.firstChild;
        while(c) {
          root.automaticStyles.appendChild(c);
          c = automaticStyles.firstChild
        }
      }else {
        if(automaticStyles) {
          root.automaticStyles = automaticStyles;
          setChild(root, automaticStyles)
        }
      }
      root.body = getDirectChild(node, officens, "body");
      setChild(root, root.body)
    }
    function handleMetaXml(xmldoc) {
      var node = importRootNode(xmldoc), root;
      if(!node || node.localName !== "document-meta" || node.namespaceURI !== officens) {
        return
      }
      root = self.rootElement;
      root.meta = getDirectChild(node, officens, "meta");
      setChild(root, root.meta)
    }
    function handleSettingsXml(xmldoc) {
      var node = importRootNode(xmldoc), root;
      if(!node || node.localName !== "document-settings" || node.namespaceURI !== officens) {
        return
      }
      root = self.rootElement;
      root.settings = getDirectChild(node, officens, "settings");
      setChild(root, root.settings)
    }
    function handleManifestXml(xmldoc) {
      var node = importRootNode(xmldoc), root, n;
      if(!node || node.localName !== "manifest" || node.namespaceURI !== manifestns) {
        return
      }
      root = self.rootElement;
      root.manifest = node;
      n = root.manifest.firstChild;
      while(n) {
        if(n.nodeType === Node.ELEMENT_NODE && n.localName === "file-entry" && n.namespaceURI === manifestns) {
          partMimetypes[n.getAttributeNS(manifestns, "full-path")] = n.getAttributeNS(manifestns, "media-type")
        }
        n = n.nextSibling
      }
    }
    function loadNextComponent(remainingComponents) {
      var component = remainingComponents.shift(), filepath, callback;
      if(component) {
        filepath = (component[0]);
        callback = (component[1]);
        zip.loadAsDOM(filepath, function(err, xmldoc) {
          callback(xmldoc);
          if(err || self.state === OdfContainer.INVALID) {
            return
          }
          loadNextComponent(remainingComponents)
        })
      }else {
        setState(OdfContainer.DONE)
      }
    }
    function loadComponents() {
      var componentOrder = [["styles.xml", handleStylesXml], ["content.xml", handleContentXml], ["meta.xml", handleMetaXml], ["settings.xml", handleSettingsXml], ["META-INF/manifest.xml", handleManifestXml]];
      loadNextComponent(componentOrder)
    }
    function createDocumentElement(name) {
      var s = "";
      odf.Namespaces.forEachPrefix(function(prefix, ns) {
        s += " xmlns:" + prefix + '="' + ns + '"'
      });
      return'<?xml version="1.0" encoding="UTF-8"?><office:' + name + " " + s + ' office:version="1.2">'
    }
    function serializeMetaXml() {
      var serializer = new xmldom.LSSerializer, s = createDocumentElement("document-meta");
      serializer.filter = new odf.OdfNodeFilter;
      s += serializer.writeToString(self.rootElement.meta, odf.Namespaces.namespaceMap);
      s += "</office:document-meta>";
      return s
    }
    function createManifestEntry(fullPath, mediaType) {
      var element = document.createElementNS(manifestns, "manifest:file-entry");
      element.setAttributeNS(manifestns, "manifest:full-path", fullPath);
      element.setAttributeNS(manifestns, "manifest:media-type", mediaType);
      return element
    }
    function serializeManifestXml() {
      var header = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n', xml = '<manifest:manifest xmlns:manifest="' + manifestns + '"></manifest:manifest>', manifest = (runtime.parseXML(xml)), manifestRoot = getDirectChild(manifest, manifestns, "manifest"), serializer = new xmldom.LSSerializer, fullPath;
      for(fullPath in partMimetypes) {
        if(partMimetypes.hasOwnProperty(fullPath)) {
          manifestRoot.appendChild(createManifestEntry(fullPath, partMimetypes[fullPath]))
        }
      }
      serializer.filter = new odf.OdfNodeFilter;
      return header + serializer.writeToString(manifest, odf.Namespaces.namespaceMap)
    }
    function serializeSettingsXml() {
      var serializer = new xmldom.LSSerializer, s = createDocumentElement("document-settings");
      serializer.filter = new odf.OdfNodeFilter;
      s += serializer.writeToString(self.rootElement.settings, odf.Namespaces.namespaceMap);
      s += "</office:document-settings>";
      return s
    }
    function serializeStylesXml() {
      var nsmap = odf.Namespaces.namespaceMap, serializer = new xmldom.LSSerializer, automaticStyles = cloneStylesInScope(self.rootElement.automaticStyles, documentStylesScope), masterStyles = self.rootElement.masterStyles && self.rootElement.masterStyles.cloneNode(true), s = createDocumentElement("document-styles");
      styleInfo.removePrefixFromStyleNames(automaticStyles, automaticStylePrefix, masterStyles);
      serializer.filter = new OdfStylesFilter(masterStyles, automaticStyles);
      s += serializer.writeToString(self.rootElement.fontFaceDecls, nsmap);
      s += serializer.writeToString(self.rootElement.styles, nsmap);
      s += serializer.writeToString(automaticStyles, nsmap);
      s += serializer.writeToString(masterStyles, nsmap);
      s += "</office:document-styles>";
      return s
    }
    function serializeContentXml() {
      var nsmap = odf.Namespaces.namespaceMap, serializer = new xmldom.LSSerializer, automaticStyles = cloneStylesInScope(self.rootElement.automaticStyles, documentContentScope), s = createDocumentElement("document-content");
      serializer.filter = new OdfContentFilter(self.rootElement.body, automaticStyles);
      s += serializer.writeToString(automaticStyles, nsmap);
      s += serializer.writeToString(self.rootElement.body, nsmap);
      s += "</office:document-content>";
      return s
    }
    function createElement(Type) {
      var original = document.createElementNS(Type.namespaceURI, Type.localName), method, iface = new Type;
      for(method in iface) {
        if(iface.hasOwnProperty(method)) {
          original[method] = iface[method]
        }
      }
      return original
    }
    function loadFromXML(url, callback) {
      runtime.loadXML(url, function(err, dom) {
        if(err) {
          callback(err)
        }else {
          handleFlatXml(dom)
        }
      })
    }
    this.setRootElement = setRootElement;
    this.getContentElement = function() {
      var body;
      if(!contentElement) {
        body = self.rootElement.body;
        contentElement = body.getElementsByTagNameNS(officens, "text")[0] || body.getElementsByTagNameNS(officens, "presentation")[0] || body.getElementsByTagNameNS(officens, "spreadsheet")[0]
      }
      return contentElement
    };
    this.getDocumentType = function() {
      var content = self.getContentElement();
      return content && content.localName
    };
    this.getPart = function(partname) {
      return new OdfPart(partname, partMimetypes[partname], self, zip)
    };
    this.getPartData = function(url, callback) {
      zip.load(url, callback)
    };
    function createEmptyTextDocument() {
      var emptyzip = new core.Zip("", null), data = runtime.byteArrayFromString("application/vnd.oasis.opendocument.text", "utf8"), root = self.rootElement, text = document.createElementNS(officens, "text");
      emptyzip.save("mimetype", data, false, new Date);
      function addToplevelElement(memberName, realLocalName) {
        var element;
        if(!realLocalName) {
          realLocalName = memberName
        }
        element = document.createElementNS(officens, realLocalName);
        root[memberName] = element;
        root.appendChild(element)
      }
      addToplevelElement("meta");
      addToplevelElement("settings");
      addToplevelElement("scripts");
      addToplevelElement("fontFaceDecls", "font-face-decls");
      addToplevelElement("styles");
      addToplevelElement("automaticStyles", "automatic-styles");
      addToplevelElement("masterStyles", "master-styles");
      addToplevelElement("body");
      root.body.appendChild(text);
      setState(OdfContainer.DONE);
      return emptyzip
    }
    function fillZip() {
      var data, date = new Date;
      data = runtime.byteArrayFromString(serializeSettingsXml(), "utf8");
      zip.save("settings.xml", data, true, date);
      data = runtime.byteArrayFromString(serializeMetaXml(), "utf8");
      zip.save("meta.xml", data, true, date);
      data = runtime.byteArrayFromString(serializeStylesXml(), "utf8");
      zip.save("styles.xml", data, true, date);
      data = runtime.byteArrayFromString(serializeContentXml(), "utf8");
      zip.save("content.xml", data, true, date);
      data = runtime.byteArrayFromString(serializeManifestXml(), "utf8");
      zip.save("META-INF/manifest.xml", data, true, date)
    }
    function createByteArray(successCallback, errorCallback) {
      fillZip();
      zip.createByteArray(successCallback, errorCallback)
    }
    this.createByteArray = createByteArray;
    function saveAs(newurl, callback) {
      fillZip();
      zip.writeAs(newurl, function(err) {
        callback(err)
      })
    }
    this.saveAs = saveAs;
    this.save = function(callback) {
      saveAs(url, callback)
    };
    this.getUrl = function() {
      return url
    };
    this.state = OdfContainer.LOADING;
    this.rootElement = createElement(ODFDocumentElement);
    if(url) {
      zip = new core.Zip(url, function(err, zipobject) {
        zip = zipobject;
        if(err) {
          loadFromXML(url, function(xmlerr) {
            if(err) {
              zip.error = err + "\n" + xmlerr;
              setState(OdfContainer.INVALID)
            }
          })
        }else {
          loadComponents()
        }
      })
    }else {
      zip = createEmptyTextDocument()
    }
  };
  odf.OdfContainer.EMPTY = 0;
  odf.OdfContainer.LOADING = 1;
  odf.OdfContainer.DONE = 2;
  odf.OdfContainer.INVALID = 3;
  odf.OdfContainer.SAVING = 4;
  odf.OdfContainer.MODIFIED = 5;
  odf.OdfContainer.getContainer = function(url) {
    return new odf.OdfContainer(url, null)
  };
  return odf.OdfContainer
}();
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("core.Base64");
runtime.loadClass("xmldom.XPath");
runtime.loadClass("odf.OdfContainer");
odf.FontLoader = function() {
  var xpath = new xmldom.XPath, base64 = new core.Base64;
  function getEmbeddedFontDeclarations(fontFaceDecls) {
    var decls = {}, fonts, i, font, name, uris, href, family;
    if(!fontFaceDecls) {
      return decls
    }
    fonts = xpath.getODFElementsWithXPath(fontFaceDecls, "style:font-face[svg:font-face-src]", odf.Namespaces.resolvePrefix);
    for(i = 0;i < fonts.length;i += 1) {
      font = fonts[i];
      name = font.getAttributeNS(odf.Namespaces.stylens, "name");
      family = font.getAttributeNS(odf.Namespaces.svgns, "font-family");
      uris = xpath.getODFElementsWithXPath(font, "svg:font-face-src/svg:font-face-uri", odf.Namespaces.resolvePrefix);
      if(uris.length > 0) {
        href = uris[0].getAttributeNS(odf.Namespaces.xlinkns, "href");
        decls[name] = {href:href, family:family}
      }
    }
    return decls
  }
  function addFontToCSS(name, font, fontdata, stylesheet) {
    var cssFamily = font.family || name, rule = "@font-face { font-family: '" + cssFamily + "'; src: " + "url(data:application/x-font-ttf;charset=binary;base64," + base64.convertUTF8ArrayToBase64(fontdata) + ') format("truetype"); }';
    try {
      stylesheet.insertRule(rule, stylesheet.cssRules.length)
    }catch(e) {
      runtime.log("Problem inserting rule in CSS: " + runtime.toJson(e) + "\nRule: " + rule)
    }
  }
  function loadFontIntoCSS(embeddedFontDeclarations, odfContainer, pos, stylesheet, callback) {
    var name, i = 0, n;
    for(n in embeddedFontDeclarations) {
      if(embeddedFontDeclarations.hasOwnProperty(n)) {
        if(i === pos) {
          name = n;
          break
        }
        i += 1
      }
    }
    if(!name) {
      if(callback) {
        callback()
      }
      return
    }
    odfContainer.getPartData(embeddedFontDeclarations[name].href, function(err, fontdata) {
      if(err) {
        runtime.log(err)
      }else {
        addFontToCSS(name, embeddedFontDeclarations[name], fontdata, stylesheet)
      }
      loadFontIntoCSS(embeddedFontDeclarations, odfContainer, pos + 1, stylesheet, callback)
    })
  }
  function loadFontsIntoCSS(embeddedFontDeclarations, odfContainer, stylesheet) {
    loadFontIntoCSS(embeddedFontDeclarations, odfContainer, 0, stylesheet)
  }
  odf.FontLoader = function FontLoader() {
    this.loadFonts = function(odfContainer, stylesheet) {
      var embeddedFontDeclarations, fontFaceDecls = odfContainer.rootElement.fontFaceDecls;
      while(stylesheet.cssRules.length) {
        stylesheet.deleteRule(stylesheet.cssRules.length - 1)
      }
      if(fontFaceDecls) {
        embeddedFontDeclarations = getEmbeddedFontDeclarations(fontFaceDecls);
        loadFontsIntoCSS(embeddedFontDeclarations, odfContainer, stylesheet)
      }
    }
  };
  return odf.FontLoader
}();
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
odf.StyleNameGenerator = function StyleNameGenerator(prefix, formatting) {
  var reportedNames = {};
  this.generateName = function() {
    var name, existingNames = {}, startIndex = 0;
    formatting.getAllStyleNames().forEach(function(styleName) {
      existingNames[styleName] = true
    });
    do {
      name = prefix + startIndex;
      startIndex += 1
    }while(reportedNames[name] || existingNames[name]);
    reportedNames[name] = true;
    return name
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("core.Utils");
runtime.loadClass("odf.StyleNameGenerator");
runtime.loadClass("odf.Namespaces");
runtime.loadClass("odf.OdfContainer");
runtime.loadClass("odf.StyleInfo");
runtime.loadClass("odf.OdfUtils");
runtime.loadClass("odf.TextStyleApplicator");
odf.Formatting = function Formatting() {
  var self = this, odfContainer, styleInfo = new odf.StyleInfo, svgns = odf.Namespaces.svgns, stylens = odf.Namespaces.stylens, textns = odf.Namespaces.textns, numberns = odf.Namespaces.numberns, odfUtils = new odf.OdfUtils, utils = new core.Utils, builtInDefaultStyleAttributesByFamily = {"paragraph":{"style:paragraph-properties":{"fo:text-align":"left"}}};
  function getBuiltInDefaultStyleAttributes(styleFamily) {
    var result, builtInDefaultStyleAttributes = builtInDefaultStyleAttributesByFamily[styleFamily];
    if(builtInDefaultStyleAttributes) {
      result = utils.mergeObjects({}, builtInDefaultStyleAttributes)
    }else {
      result = null
    }
    return result
  }
  this.setOdfContainer = function(odfcontainer) {
    odfContainer = odfcontainer
  };
  function getFontMap() {
    var fontFaceDecls = odfContainer.rootElement.fontFaceDecls, fontFaceDeclsMap = {}, node, name, family;
    node = fontFaceDecls && fontFaceDecls.firstChild;
    while(node) {
      if(node.nodeType === Node.ELEMENT_NODE) {
        name = node.getAttributeNS(stylens, "name");
        if(name) {
          family = node.getAttributeNS(svgns, "font-family");
          if(family || node.getElementsByTagNameNS(svgns, "font-face-uri")[0]) {
            fontFaceDeclsMap[name] = family
          }
        }
      }
      node = node.nextSibling
    }
    return fontFaceDeclsMap
  }
  this.getFontMap = getFontMap;
  this.getAvailableParagraphStyles = function() {
    var node = odfContainer.rootElement.styles && odfContainer.rootElement.styles.firstChild, p_family, p_name, p_displayName, paragraphStyles = [], style;
    while(node) {
      if(node.nodeType === Node.ELEMENT_NODE && node.localName === "style" && node.namespaceURI === stylens) {
        style = node;
        p_family = style.getAttributeNS(stylens, "family");
        if(p_family === "paragraph") {
          p_name = style.getAttributeNS(stylens, "name");
          p_displayName = style.getAttributeNS(stylens, "display-name") || p_name;
          if(p_name && p_displayName) {
            paragraphStyles.push({name:p_name, displayName:p_displayName})
          }
        }
      }
      node = node.nextSibling
    }
    return paragraphStyles
  };
  this.isStyleUsed = function(styleElement) {
    var hasDerivedStyles, isUsed;
    hasDerivedStyles = styleInfo.hasDerivedStyles(odfContainer.rootElement, odf.Namespaces.resolvePrefix, styleElement);
    isUsed = (new styleInfo.UsedStyleList(odfContainer.rootElement.styles)).uses(styleElement) || (new styleInfo.UsedStyleList(odfContainer.rootElement.automaticStyles)).uses(styleElement) || (new styleInfo.UsedStyleList(odfContainer.rootElement.body)).uses(styleElement);
    return hasDerivedStyles || isUsed
  };
  function getDefaultStyleElement(family) {
    var node = odfContainer.rootElement.styles.firstChild;
    while(node) {
      if(node.nodeType === Node.ELEMENT_NODE && node.namespaceURI === stylens && node.localName === "default-style" && node.getAttributeNS(stylens, "family") === family) {
        return node
      }
      node = node.nextSibling
    }
    return null
  }
  this.getDefaultStyleElement = getDefaultStyleElement;
  function getStyleElement(styleName, family, styleElements) {
    var node, nodeStyleName, styleListElement;
    styleElements = styleElements || [odfContainer.rootElement.automaticStyles, odfContainer.rootElement.styles];
    styleListElement = styleElements.shift();
    while(styleListElement) {
      node = styleListElement.firstChild;
      while(node) {
        if(node.nodeType === Node.ELEMENT_NODE) {
          nodeStyleName = node.getAttributeNS(stylens, "name");
          if(node.namespaceURI === stylens && node.localName === "style" && node.getAttributeNS(stylens, "family") === family && nodeStyleName === styleName) {
            return node
          }
          if(family === "list-style" && node.namespaceURI === textns && node.localName === "list-style" && nodeStyleName === styleName) {
            return node
          }
          if(family === "data" && node.namespaceURI === numberns && nodeStyleName === styleName) {
            return node
          }
        }
        node = node.nextSibling
      }
      styleListElement = styleElements.shift()
    }
    return null
  }
  this.getStyleElement = getStyleElement;
  function getStyleAttributes(styleNode) {
    var i, propertiesMap = {}, propertiesNode = styleNode.firstChild;
    while(propertiesNode) {
      if(propertiesNode.nodeType === Node.ELEMENT_NODE && propertiesNode.namespaceURI === stylens) {
        propertiesMap[propertiesNode.nodeName] = {};
        for(i = 0;i < propertiesNode.attributes.length;i += 1) {
          propertiesMap[propertiesNode.nodeName][propertiesNode.attributes[i].name] = propertiesNode.attributes[i].value
        }
      }
      propertiesNode = propertiesNode.nextSibling
    }
    for(i = 0;i < styleNode.attributes.length;i += 1) {
      propertiesMap[styleNode.attributes[i].name] = styleNode.attributes[i].value
    }
    return propertiesMap
  }
  this.getStyleAttributes = getStyleAttributes;
  function mapObjOntoNode(node, properties) {
    Object.keys(properties).forEach(function(key) {
      var parts = key.split(":"), prefix = parts[0], localName = parts[1], ns = odf.Namespaces.resolvePrefix(prefix), value = properties[key], element;
      if(typeof value === "object" && Object.keys(value).length) {
        element = node.getElementsByTagNameNS(ns, localName)[0] || node.ownerDocument.createElementNS(ns, key);
        node.appendChild(element);
        mapObjOntoNode(element, value)
      }else {
        if(ns) {
          node.setAttributeNS(ns, key, value)
        }
      }
    })
  }
  function getInheritedStyleAttributes(styleNode, includeSystemDefault) {
    var styleListElement = odfContainer.rootElement.styles, parentStyleName, propertiesMap, inheritedPropertiesMap = {}, styleFamily = styleNode.getAttributeNS(stylens, "family"), node = styleNode;
    while(node) {
      propertiesMap = getStyleAttributes(node);
      inheritedPropertiesMap = utils.mergeObjects(propertiesMap, inheritedPropertiesMap);
      parentStyleName = node.getAttributeNS(stylens, "parent-style-name");
      if(parentStyleName) {
        node = getStyleElement(parentStyleName, styleFamily, [styleListElement])
      }else {
        node = null
      }
    }
    node = getDefaultStyleElement(styleFamily);
    if(node) {
      propertiesMap = getStyleAttributes(node);
      inheritedPropertiesMap = utils.mergeObjects(propertiesMap, inheritedPropertiesMap)
    }
    if(includeSystemDefault) {
      propertiesMap = getBuiltInDefaultStyleAttributes(styleFamily);
      if(propertiesMap) {
        inheritedPropertiesMap = utils.mergeObjects(propertiesMap, inheritedPropertiesMap)
      }
    }
    return inheritedPropertiesMap
  }
  this.getInheritedStyleAttributes = getInheritedStyleAttributes;
  this.getFirstCommonParentStyleNameOrSelf = function(styleName) {
    var automaticStyleElementList = odfContainer.rootElement.automaticStyles, styleElementList = odfContainer.rootElement.styles, styleElement;
    styleElement = getStyleElement(styleName, "paragraph", [automaticStyleElementList]);
    while(styleElement) {
      styleName = styleElement.getAttributeNS(stylens, "parent-style-name");
      styleElement = getStyleElement(styleName, "paragraph", [automaticStyleElementList])
    }
    styleElement = getStyleElement(styleName, "paragraph", [styleElementList]);
    if(!styleElement) {
      return null
    }
    return styleName
  };
  this.hasParagraphStyle = function(styleName) {
    return Boolean(getStyleElement(styleName, "paragraph"))
  };
  function buildStyleChain(node, collectedChains) {
    var parent = node.nodeType === Node.TEXT_NODE ? node.parentNode : node, nodeStyles, appliedStyles = [], chainKey = "", foundContainer = false;
    while(parent) {
      if(!foundContainer && odfUtils.isGroupingElement(parent)) {
        foundContainer = true
      }
      nodeStyles = styleInfo.determineStylesForNode((parent));
      if(nodeStyles) {
        appliedStyles.push(nodeStyles)
      }
      parent = parent.parentNode
    }
    if(foundContainer) {
      appliedStyles.forEach(function(usedStyleMap) {
        Object.keys(usedStyleMap).forEach(function(styleFamily) {
          Object.keys(usedStyleMap[styleFamily]).forEach(function(styleName) {
            chainKey += "|" + styleFamily + ":" + styleName + "|"
          })
        })
      });
      if(collectedChains) {
        collectedChains[chainKey] = appliedStyles
      }
    }
    return foundContainer ? appliedStyles : undefined
  }
  function calculateAppliedStyle(styleChain) {
    var mergedChildStyle = {orderedStyles:[]};
    styleChain.forEach(function(elementStyleSet) {
      Object.keys((elementStyleSet)).forEach(function(styleFamily) {
        var styleName = Object.keys(elementStyleSet[styleFamily])[0], styleElement, parentStyle, displayName;
        styleElement = getStyleElement(styleName, styleFamily);
        if(styleElement) {
          parentStyle = getInheritedStyleAttributes((styleElement));
          mergedChildStyle = utils.mergeObjects(parentStyle, mergedChildStyle);
          displayName = styleElement.getAttributeNS(stylens, "display-name")
        }else {
          runtime.log("No style element found for '" + styleName + "' of family '" + styleFamily + "'")
        }
        mergedChildStyle.orderedStyles.push({name:styleName, family:styleFamily, displayName:displayName})
      })
    });
    return mergedChildStyle
  }
  this.getAppliedStyles = function(textNodes) {
    var styleChains = {}, styles = [];
    textNodes.forEach(function(n) {
      buildStyleChain(n, styleChains)
    });
    Object.keys(styleChains).forEach(function(key) {
      styles.push(calculateAppliedStyle(styleChains[key]))
    });
    return styles
  };
  this.getAppliedStylesForElement = function(node) {
    var styleChain;
    styleChain = buildStyleChain(node);
    return styleChain ? calculateAppliedStyle(styleChain) : undefined
  };
  this.applyStyle = function(memberId, textNodes, limits, info) {
    var textStyles = new odf.TextStyleApplicator(new odf.StyleNameGenerator("auto" + utils.hashString(memberId) + "_", self), self, odfContainer.rootElement.automaticStyles);
    textStyles.applyStyle(textNodes, limits, info)
  };
  function getAllStyleNames() {
    var styleElements = [odfContainer.rootElement.automaticStyles, odfContainer.rootElement.styles], node, styleNames = [];
    styleElements.forEach(function(styleListElement) {
      node = styleListElement.firstChild;
      while(node) {
        if(node.nodeType === Node.ELEMENT_NODE) {
          if(node.namespaceURI === stylens && node.localName === "style" || node.namespaceURI === textns && node.localName === "list-style") {
            styleNames.push(node.getAttributeNS(stylens, "name"))
          }
        }
        node = node.nextSibling
      }
    });
    return styleNames
  }
  this.getAllStyleNames = getAllStyleNames;
  this.updateStyle = function(styleNode, properties) {
    var fontName, fontFaceNode;
    mapObjOntoNode(styleNode, properties);
    fontName = properties["style:text-properties"] && properties["style:text-properties"]["style:font-name"];
    if(fontName && !getFontMap().hasOwnProperty(fontName)) {
      fontFaceNode = styleNode.ownerDocument.createElementNS(stylens, "style:font-face");
      fontFaceNode.setAttributeNS(stylens, "style:name", fontName);
      fontFaceNode.setAttributeNS(svgns, "svg:font-family", fontName);
      odfContainer.rootElement.fontFaceDecls.appendChild(fontFaceNode)
    }
  };
  function isAutomaticStyleElement(styleNode) {
    return styleNode.parentNode === odfContainer.rootElement.automaticStyles
  }
  this.createDerivedStyleObject = function(parentStyleName, family, overrides) {
    var originalStyleElement = (getStyleElement(parentStyleName, family)), newStyleObject;
    runtime.assert(Boolean(originalStyleElement), "No style element found for '" + parentStyleName + "' of family '" + family + "'");
    if(isAutomaticStyleElement(originalStyleElement)) {
      newStyleObject = getStyleAttributes(originalStyleElement)
    }else {
      newStyleObject = {"style:parent-style-name":parentStyleName}
    }
    newStyleObject["style:family"] = family;
    utils.mergeObjects(newStyleObject, overrides);
    return newStyleObject
  };
  this.getDefaultTabStopDistance = function() {
    var defaultParagraph = getDefaultStyleElement("paragraph"), paragraphProperties = defaultParagraph && defaultParagraph.getAttributeNS(stylens, "paragraph-properties"), tabStopDistance = paragraphProperties && paragraphProperties.getAttributeNS(stylens, "tab-stop-distance");
    if(!tabStopDistance) {
      tabStopDistance = "1.25cm"
    }
    return odfUtils.parseNonNegativeLength(tabStopDistance)
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("core.DomUtils");
runtime.loadClass("odf.OdfContainer");
runtime.loadClass("odf.Formatting");
runtime.loadClass("xmldom.XPath");
runtime.loadClass("odf.FontLoader");
runtime.loadClass("odf.Style2CSS");
runtime.loadClass("odf.OdfUtils");
runtime.loadClass("gui.AnnotationViewManager");
odf.OdfCanvas = function() {
  function LoadingQueue() {
    var queue = [], taskRunning = false;
    function run(task) {
      taskRunning = true;
      runtime.setTimeout(function() {
        try {
          task()
        }catch(e) {
          runtime.log(e)
        }
        taskRunning = false;
        if(queue.length > 0) {
          run(queue.pop())
        }
      }, 10)
    }
    this.clearQueue = function() {
      queue.length = 0
    };
    this.addToQueue = function(loadingTask) {
      if(queue.length === 0 && !taskRunning) {
        return run(loadingTask)
      }
      queue.push(loadingTask)
    }
  }
  function PageSwitcher(css) {
    var sheet = css.sheet, position = 1;
    function updateCSS() {
      while(sheet.cssRules.length > 0) {
        sheet.deleteRule(0)
      }
      sheet.insertRule("#shadowContent draw|page {display:none;}", 0);
      sheet.insertRule("office|presentation draw|page {display:none;}", 1);
      sheet.insertRule("#shadowContent draw|page:nth-of-type(" + position + ") {display:block;}", 2);
      sheet.insertRule("office|presentation draw|page:nth-of-type(" + position + ") {display:block;}", 3)
    }
    this.showFirstPage = function() {
      position = 1;
      updateCSS()
    };
    this.showNextPage = function() {
      position += 1;
      updateCSS()
    };
    this.showPreviousPage = function() {
      if(position > 1) {
        position -= 1;
        updateCSS()
      }
    };
    this.showPage = function(n) {
      if(n > 0) {
        position = n;
        updateCSS()
      }
    };
    this.css = css;
    this.destroy = function(callback) {
      css.parentNode.removeChild(css);
      callback()
    }
  }
  function listenEvent(eventTarget, eventType, eventHandler) {
    if(eventTarget.addEventListener) {
      eventTarget.addEventListener(eventType, eventHandler, false)
    }else {
      if(eventTarget.attachEvent) {
        eventType = "on" + eventType;
        eventTarget.attachEvent(eventType, eventHandler)
      }else {
        eventTarget["on" + eventType] = eventHandler
      }
    }
  }
  function removeEvent(eventTarget, eventType, eventHandler) {
    var onVariant = "on" + eventType;
    if(eventTarget.removeEventListener) {
      eventTarget.removeEventListener(eventType, eventHandler, false)
    }else {
      if(eventTarget.detachEvent) {
        eventTarget.detachEvent(onVariant, eventHandler)
      }else {
        if(eventTarget[onVariant] === eventHandler) {
          eventTarget[onVariant] = null
        }
      }
    }
  }
  function SelectionWatcher(element) {
    var selection = [], listeners = [];
    function isAncestorOf(ancestor, descendant) {
      while(descendant) {
        if(descendant === ancestor) {
          return true
        }
        descendant = descendant.parentNode
      }
      return false
    }
    function fallsWithin(element, range) {
      return isAncestorOf(element, range.startContainer) && isAncestorOf(element, range.endContainer)
    }
    function getCurrentSelection() {
      var s = [], current = runtime.getWindow().getSelection(), i, r;
      for(i = 0;i < current.rangeCount;i += 1) {
        r = current.getRangeAt(i);
        if(r !== null && fallsWithin(element, r)) {
          s.push(r)
        }
      }
      return s
    }
    function rangesNotEqual(rangeA, rangeB) {
      if(rangeA === rangeB) {
        return false
      }
      if(rangeA === null || rangeB === null) {
        return true
      }
      return rangeA.startContainer !== rangeB.startContainer || rangeA.startOffset !== rangeB.startOffset || rangeA.endContainer !== rangeB.endContainer || rangeA.endOffset !== rangeB.endOffset
    }
    function emitNewSelection() {
      var i, l = listeners.length;
      for(i = 0;i < l;i += 1) {
        listeners[i](element, selection)
      }
    }
    function copySelection(selection) {
      var s = [selection.length], i, oldr, r, doc = element.ownerDocument;
      for(i = 0;i < selection.length;i += 1) {
        oldr = selection[i];
        r = doc.createRange();
        r.setStart(oldr.startContainer, oldr.startOffset);
        r.setEnd(oldr.endContainer, oldr.endOffset);
        s[i] = r
      }
      return s
    }
    function checkSelection() {
      var s = getCurrentSelection(), i;
      if(s.length === selection.length) {
        for(i = 0;i < s.length;i += 1) {
          if(rangesNotEqual(s[i], selection[i])) {
            break
          }
        }
        if(i === s.length) {
          return
        }
      }
      selection = s;
      selection = copySelection(s);
      emitNewSelection()
    }
    this.addListener = function(eventName, handler) {
      var i, l = listeners.length;
      for(i = 0;i < l;i += 1) {
        if(listeners[i] === handler) {
          return
        }
      }
      listeners.push(handler)
    };
    this.destroy = function(callback) {
      removeEvent(element, "mouseup", checkSelection);
      removeEvent(element, "keyup", checkSelection);
      removeEvent(element, "keydown", checkSelection);
      callback()
    };
    listenEvent(element, "mouseup", checkSelection);
    listenEvent(element, "keyup", checkSelection);
    listenEvent(element, "keydown", checkSelection)
  }
  var drawns = odf.Namespaces.drawns, fons = odf.Namespaces.fons, officens = odf.Namespaces.officens, stylens = odf.Namespaces.stylens, svgns = odf.Namespaces.svgns, tablens = odf.Namespaces.tablens, textns = odf.Namespaces.textns, xlinkns = odf.Namespaces.xlinkns, xmlns = odf.Namespaces.xmlns, presentationns = odf.Namespaces.presentationns, window = runtime.getWindow(), xpath = new xmldom.XPath, utils = new odf.OdfUtils, domUtils = new core.DomUtils, shadowContent;
  function clear(element) {
    while(element.firstChild) {
      element.removeChild(element.firstChild)
    }
  }
  function handleStyles(odfcontainer, formatting, stylesxmlcss) {
    var style2css = new odf.Style2CSS;
    style2css.style2css(odfcontainer.getDocumentType(), stylesxmlcss.sheet, formatting.getFontMap(), odfcontainer.rootElement.styles, odfcontainer.rootElement.automaticStyles)
  }
  function handleFonts(odfContainer, fontcss) {
    var fontLoader = new odf.FontLoader;
    fontLoader.loadFonts(odfContainer, fontcss.sheet)
  }
  function getMasterPage(odfContainer, masterPageName) {
    if(!masterPageName) {
      return null
    }
    var masterStyles = odfContainer.rootElement.masterStyles, masterPages = masterStyles.getElementsByTagNameNS(stylens, "master-page"), masterPage = null, i;
    for(i = 0;i < masterPages.length;i += 1) {
      if(masterPages[i].getAttributeNS(stylens, "name") === masterPageName) {
        masterPage = masterPages[i];
        break
      }
    }
    return masterPage
  }
  function setFramePosition(odfContainer, id, frame, stylesheet) {
    frame.setAttribute("styleid", id);
    var rule, anchor = frame.getAttributeNS(textns, "anchor-type"), x = frame.getAttributeNS(svgns, "x"), y = frame.getAttributeNS(svgns, "y"), width = frame.getAttributeNS(svgns, "width"), height = frame.getAttributeNS(svgns, "height"), minheight = frame.getAttributeNS(fons, "min-height"), minwidth = frame.getAttributeNS(fons, "min-width"), masterPageName = frame.getAttributeNS(drawns, "master-page-name"), masterPage = null, j, clonedPage, clonedNode, pageNumber = 0, pageNumberContainer, node, document = 
    odfContainer.rootElement.ownerDocument;
    masterPage = getMasterPage(odfContainer, masterPageName);
    if(masterPage) {
      clonedPage = document.createElementNS(drawns, "draw:page");
      node = masterPage.firstElementChild;
      j = 0;
      while(node) {
        if(node.getAttributeNS(presentationns, "placeholder") !== "true") {
          clonedNode = node.cloneNode(true);
          clonedPage.appendChild(clonedNode);
          setFramePosition(odfContainer, id + "_" + j, (clonedNode), stylesheet)
        }
        node = node.nextElementSibling;
        j += 1
      }
      shadowContent.appendChild(clonedPage);
      pageNumber = shadowContent.getElementsByTagNameNS(drawns, "page").length;
      pageNumberContainer = clonedPage.getElementsByTagNameNS(textns, "page-number")[0];
      if(pageNumberContainer) {
        while(pageNumberContainer.firstChild) {
          pageNumberContainer.removeChild(pageNumberContainer.firstChild)
        }
        pageNumberContainer.appendChild(document.createTextNode(pageNumber))
      }
      setFramePosition(odfContainer, id, clonedPage, stylesheet);
      clonedPage.setAttributeNS(drawns, "draw:master-page-name", masterPage.getAttributeNS(stylens, "name"))
    }
    if(anchor === "as-char") {
      rule = "display: inline-block;"
    }else {
      if(anchor || x || y) {
        rule = "position: absolute;"
      }else {
        if(width || height || minheight || minwidth) {
          rule = "display: block;"
        }
      }
    }
    if(x) {
      rule += "left: " + x + ";"
    }
    if(y) {
      rule += "top: " + y + ";"
    }
    if(width) {
      rule += "width: " + width + ";"
    }
    if(height) {
      rule += "height: " + height + ";"
    }
    if(minheight) {
      rule += "min-height: " + minheight + ";"
    }
    if(minwidth) {
      rule += "min-width: " + minwidth + ";"
    }
    if(rule) {
      rule = "draw|" + frame.localName + '[styleid="' + id + '"] {' + rule + "}";
      stylesheet.insertRule(rule, stylesheet.cssRules.length)
    }
  }
  function getUrlFromBinaryDataElement(image) {
    var node = image.firstChild;
    while(node) {
      if(node.namespaceURI === officens && node.localName === "binary-data") {
        return"data:image/png;base64," + node.textContent.replace(/[\r\n\s]/g, "")
      }
      node = node.nextSibling
    }
    return""
  }
  function setImage(id, container, image, stylesheet) {
    image.setAttribute("styleid", id);
    var url = image.getAttributeNS(xlinkns, "href"), part;
    function callback(url) {
      var rule;
      if(url) {
        rule = "background-image: url(" + url + ");";
        rule = 'draw|image[styleid="' + id + '"] {' + rule + "}";
        stylesheet.insertRule(rule, stylesheet.cssRules.length)
      }
    }
    if(url) {
      try {
        part = container.getPart(url);
        part.onchange = function(part) {
          callback(part.url)
        };
        part.load()
      }catch(e) {
        runtime.log("slight problem: " + e)
      }
    }else {
      url = getUrlFromBinaryDataElement(image);
      callback(url)
    }
  }
  function formatParagraphAnchors(odfbody) {
    var runtimens = "urn:webodf", n, i, nodes = xpath.getODFElementsWithXPath(odfbody, ".//*[*[@text:anchor-type='paragraph']]", odf.Namespaces.resolvePrefix);
    for(i = 0;i < nodes.length;i += 1) {
      n = nodes[i];
      if(n.setAttributeNS) {
        n.setAttributeNS(runtimens, "containsparagraphanchor", true)
      }
    }
  }
  function modifyTables(odffragment) {
    var i, tableCells, node;
    function modifyTableCell(node) {
      if(node.hasAttributeNS(tablens, "number-columns-spanned")) {
        node.setAttribute("colspan", node.getAttributeNS(tablens, "number-columns-spanned"))
      }
      if(node.hasAttributeNS(tablens, "number-rows-spanned")) {
        node.setAttribute("rowspan", node.getAttributeNS(tablens, "number-rows-spanned"))
      }
    }
    tableCells = odffragment.getElementsByTagNameNS(tablens, "table-cell");
    for(i = 0;i < tableCells.length;i += 1) {
      node = (tableCells.item(i));
      modifyTableCell(node)
    }
  }
  function modifyLinks(odffragment) {
    var i, links, node;
    function modifyLink(node) {
      var url, clickHandler;
      if(!node.hasAttributeNS(xlinkns, "href")) {
        return
      }
      url = node.getAttributeNS(xlinkns, "href");
      if(url[0] === "#") {
        url = url.substring(1);
        clickHandler = function() {
          var bookmarks = xpath.getODFElementsWithXPath(odffragment, "//text:bookmark-start[@text:name='" + url + "']", odf.Namespaces.resolvePrefix);
          if(bookmarks.length === 0) {
            bookmarks = xpath.getODFElementsWithXPath(odffragment, "//text:bookmark[@text:name='" + url + "']", odf.Namespaces.resolvePrefix)
          }
          if(bookmarks.length > 0) {
            bookmarks[0].scrollIntoView(true)
          }
          return false
        }
      }else {
        clickHandler = function() {
          window.open(url)
        }
      }
      node.onclick = clickHandler
    }
    links = odffragment.getElementsByTagNameNS(textns, "a");
    for(i = 0;i < links.length;i += 1) {
      node = (links.item(i));
      modifyLink(node)
    }
  }
  function expandSpaceElements(odffragment) {
    var spaces, doc = odffragment.ownerDocument;
    function expandSpaceElement(space) {
      var j, count;
      while(space.firstChild) {
        space.removeChild(space.firstChild)
      }
      space.appendChild(doc.createTextNode(" "));
      count = parseInt(space.getAttributeNS(textns, "c"), 10);
      if(count > 1) {
        space.removeAttributeNS(textns, "c");
        for(j = 1;j < count;j += 1) {
          space.parentNode.insertBefore(space.cloneNode(true), space)
        }
      }
    }
    spaces = domUtils.getElementsByTagNameNS(odffragment, textns, "s");
    spaces.forEach(expandSpaceElement)
  }
  function expandTabElements(odffragment) {
    var tabs;
    tabs = domUtils.getElementsByTagNameNS(odffragment, textns, "tab");
    tabs.forEach(function(tab) {
      tab.textContent = "\t"
    })
  }
  function modifyImages(container, odfbody, stylesheet) {
    var node, frames, i;
    frames = [];
    node = odfbody.firstChild;
    while(node && node !== odfbody) {
      if(node.namespaceURI === drawns) {
        frames[frames.length] = node
      }
      if(node.firstChild) {
        node = node.firstChild
      }else {
        while(node && node !== odfbody && !node.nextSibling) {
          node = node.parentNode
        }
        if(node && node.nextSibling) {
          node = node.nextSibling
        }
      }
    }
    for(i = 0;i < frames.length;i += 1) {
      node = frames[i];
      setFramePosition(container, "frame" + String(i), node, stylesheet)
    }
    formatParagraphAnchors(odfbody)
  }
  function setVideo(container, plugin) {
    var video, source, url, doc = plugin.ownerDocument, part;
    url = plugin.getAttributeNS(xlinkns, "href");
    function callback(url, mimetype) {
      var ns = doc.documentElement.namespaceURI;
      if(mimetype.substr(0, 6) === "video/") {
        video = doc.createElementNS(ns, "video");
        video.setAttribute("controls", "controls");
        source = doc.createElementNS(ns, "source");
        source.setAttribute("src", url);
        source.setAttribute("type", mimetype);
        video.appendChild(source);
        plugin.parentNode.appendChild(video)
      }else {
        plugin.innerHtml = "Unrecognised Plugin"
      }
    }
    if(url) {
      try {
        part = container.getPart(url);
        part.onchange = function(part) {
          callback(part.url, part.mimetype)
        };
        part.load()
      }catch(e) {
        runtime.log("slight problem: " + e)
      }
    }else {
      runtime.log("using MP4 data fallback");
      url = getUrlFromBinaryDataElement(plugin);
      callback(url, "video/mp4")
    }
  }
  function getNumberRule(node) {
    var style = node.getAttributeNS(stylens, "num-format"), suffix = node.getAttributeNS(stylens, "num-suffix"), prefix = node.getAttributeNS(stylens, "num-prefix"), rule = "", stylemap = {1:"decimal", "a":"lower-latin", "A":"upper-latin", "i":"lower-roman", "I":"upper-roman"}, content;
    content = prefix || "";
    if(stylemap.hasOwnProperty(style)) {
      content += " counter(list, " + stylemap[style] + ")"
    }else {
      if(style) {
        content += "'" + style + "';"
      }else {
        content += " ''"
      }
    }
    if(suffix) {
      content += " '" + suffix + "'"
    }
    rule = "content: " + content + ";";
    return rule
  }
  function getImageRule() {
    var rule = "content: none;";
    return rule
  }
  function getBulletRule(node) {
    var bulletChar = node.getAttributeNS(textns, "bullet-char");
    return"content: '" + bulletChar + "';"
  }
  function getBulletsRule(node) {
    var itemrule;
    if(node) {
      if(node.localName === "list-level-style-number") {
        itemrule = getNumberRule(node)
      }else {
        if(node.localName === "list-level-style-image") {
          itemrule = getImageRule()
        }else {
          if(node.localName === "list-level-style-bullet") {
            itemrule = getBulletRule(node)
          }
        }
      }
    }
    return itemrule
  }
  function loadLists(odffragment, stylesheet) {
    var i, lists, node, id, continueList, styleName, rule, listMap = {}, parentList, listStyles, listStyleMap = {}, bulletRule;
    listStyles = window.document.getElementsByTagNameNS(textns, "list-style");
    for(i = 0;i < listStyles.length;i += 1) {
      node = (listStyles.item(i));
      styleName = node.getAttributeNS(stylens, "name");
      if(styleName) {
        listStyleMap[styleName] = node
      }
    }
    lists = odffragment.getElementsByTagNameNS(textns, "list");
    for(i = 0;i < lists.length;i += 1) {
      node = (lists.item(i));
      id = node.getAttributeNS(xmlns, "id");
      if(id) {
        continueList = node.getAttributeNS(textns, "continue-list");
        node.setAttribute("id", id);
        rule = "text|list#" + id + " > text|list-item > *:first-child:before {";
        styleName = node.getAttributeNS(textns, "style-name");
        if(styleName) {
          node = listStyleMap[styleName];
          bulletRule = getBulletsRule((utils.getFirstNonWhitespaceChild(node)))
        }
        if(continueList) {
          parentList = listMap[continueList];
          while(parentList) {
            continueList = parentList;
            parentList = listMap[continueList]
          }
          rule += "counter-increment:" + continueList + ";";
          if(bulletRule) {
            bulletRule = bulletRule.replace("list", continueList);
            rule += bulletRule
          }else {
            rule += "content:counter(" + continueList + ");"
          }
        }else {
          continueList = "";
          if(bulletRule) {
            bulletRule = bulletRule.replace("list", id);
            rule += bulletRule
          }else {
            rule += "content: counter(" + id + ");"
          }
          rule += "counter-increment:" + id + ";";
          stylesheet.insertRule("text|list#" + id + " {counter-reset:" + id + "}", stylesheet.cssRules.length)
        }
        rule += "}";
        listMap[id] = continueList;
        if(rule) {
          stylesheet.insertRule(rule, stylesheet.cssRules.length)
        }
      }
    }
  }
  function addWebODFStyleSheet(document) {
    var head = document.getElementsByTagName("head")[0], style, href;
    if(String(typeof webodf_css) !== "undefined") {
      style = document.createElementNS(head.namespaceURI, "style");
      style.setAttribute("media", "screen, print, handheld, projection");
      style.appendChild(document.createTextNode(webodf_css))
    }else {
      style = document.createElementNS(head.namespaceURI, "link");
      href = "webodf.css";
      if(runtime.currentDirectory) {
        href = runtime.currentDirectory() + "/../" + href
      }
      style.setAttribute("href", href);
      style.setAttribute("rel", "stylesheet")
    }
    style.setAttribute("type", "text/css");
    head.appendChild(style);
    return(style)
  }
  function addStyleSheet(document) {
    var head = document.getElementsByTagName("head")[0], style = document.createElementNS(head.namespaceURI, "style"), text = "";
    style.setAttribute("type", "text/css");
    style.setAttribute("media", "screen, print, handheld, projection");
    odf.Namespaces.forEachPrefix(function(prefix, ns) {
      text += "@namespace " + prefix + " url(" + ns + ");\n"
    });
    style.appendChild(document.createTextNode(text));
    head.appendChild(style);
    return(style)
  }
  odf.OdfCanvas = function OdfCanvas(element) {
    runtime.assert(element !== null && element !== undefined, "odf.OdfCanvas constructor needs DOM element");
    runtime.assert(element.ownerDocument !== null && element.ownerDocument !== undefined, "odf.OdfCanvas constructor needs DOM");
    var self = this, doc = (element.ownerDocument), odfcontainer, formatting = new odf.Formatting, selectionWatcher = new SelectionWatcher(element), pageSwitcher, sizer, annotationsPane, allowAnnotations = false, annotationManager, webodfcss, fontcss, stylesxmlcss, positioncss, zoomLevel = 1, eventHandlers = {}, loadingQueue = new LoadingQueue;
    function loadImages(container, odffragment, stylesheet) {
      var i, images, node;
      function loadImage(name, container, node, stylesheet) {
        loadingQueue.addToQueue(function() {
          setImage(name, container, node, stylesheet)
        })
      }
      images = odffragment.getElementsByTagNameNS(drawns, "image");
      for(i = 0;i < images.length;i += 1) {
        node = (images.item(i));
        loadImage("image" + String(i), container, node, stylesheet)
      }
    }
    function loadVideos(container, odffragment) {
      var i, plugins, node;
      function loadVideo(container, node) {
        loadingQueue.addToQueue(function() {
          setVideo(container, node)
        })
      }
      plugins = odffragment.getElementsByTagNameNS(drawns, "plugin");
      for(i = 0;i < plugins.length;i += 1) {
        node = (plugins.item(i));
        loadVideo(container, node)
      }
    }
    function addEventListener(eventType, eventHandler) {
      var handlers = eventHandlers[eventType];
      if(handlers === undefined) {
        handlers = eventHandlers[eventType] = []
      }
      if(eventHandler && handlers.indexOf(eventHandler) === -1) {
        handlers.push(eventHandler)
      }
    }
    function fireEvent(eventType, args) {
      if(!eventHandlers.hasOwnProperty(eventType)) {
        return
      }
      var handlers = eventHandlers[eventType], i;
      for(i = 0;i < handlers.length;i += 1) {
        handlers[i].apply(null, args)
      }
    }
    function fixContainerSize() {
      var odfdoc = sizer.firstChild;
      if(!odfdoc) {
        return
      }
      if(zoomLevel > 1) {
        sizer.style.MozTransformOrigin = "center top";
        sizer.style.WebkitTransformOrigin = "center top";
        sizer.style.OTransformOrigin = "center top";
        sizer.style.msTransformOrigin = "center top"
      }else {
        sizer.style.MozTransformOrigin = "left top";
        sizer.style.WebkitTransformOrigin = "left top";
        sizer.style.OTransformOrigin = "left top";
        sizer.style.msTransformOrigin = "left top"
      }
      sizer.style.WebkitTransform = "scale(" + zoomLevel + ")";
      sizer.style.MozTransform = "scale(" + zoomLevel + ")";
      sizer.style.OTransform = "scale(" + zoomLevel + ")";
      sizer.style.msTransform = "scale(" + zoomLevel + ")";
      element.style.width = Math.round(zoomLevel * sizer.offsetWidth) + "px";
      element.style.height = Math.round(zoomLevel * sizer.offsetHeight) + "px"
    }
    function handleContent(container, odfnode) {
      var css = positioncss.sheet;
      clear(element);
      sizer = doc.createElementNS(element.namespaceURI, "div");
      sizer.style.display = "inline-block";
      sizer.style.background = "white";
      sizer.appendChild(odfnode);
      element.appendChild(sizer);
      annotationsPane = doc.createElementNS(element.namespaceURI, "div");
      annotationsPane.id = "annotationsPane";
      shadowContent = doc.createElementNS(element.namespaceURI, "div");
      shadowContent.id = "shadowContent";
      shadowContent.style.position = "absolute";
      shadowContent.style.top = 0;
      shadowContent.style.left = 0;
      container.getContentElement().appendChild(shadowContent);
      modifyImages(container, odfnode.body, css);
      modifyTables(odfnode.body);
      modifyLinks(odfnode.body);
      expandSpaceElements(odfnode.body);
      expandTabElements(odfnode.body);
      loadImages(container, odfnode.body, css);
      loadVideos(container, odfnode.body);
      loadLists(odfnode.body, css);
      sizer.insertBefore(shadowContent, sizer.firstChild);
      fixContainerSize()
    }
    function modifyAnnotations(odffragment) {
      var annotationNodes = domUtils.getElementsByTagNameNS(odffragment, officens, "annotation"), annotationEnds = domUtils.getElementsByTagNameNS(odffragment, officens, "annotation-end"), currentAnnotationName, i;
      function matchAnnotationEnd(element) {
        return currentAnnotationName === element.getAttributeNS(officens, "name")
      }
      for(i = 0;i < annotationNodes.length;i += 1) {
        currentAnnotationName = annotationNodes[i].getAttributeNS(officens, "name");
        annotationManager.addAnnotation({node:annotationNodes[i], end:annotationEnds.filter(matchAnnotationEnd)[0] || null})
      }
      annotationManager.rerenderAnnotations()
    }
    function handleAnnotations(odfnode) {
      if(allowAnnotations) {
        if(!annotationsPane.parentNode) {
          sizer.appendChild(annotationsPane);
          fixContainerSize()
        }
        if(annotationManager) {
          annotationManager.forgetAnnotations()
        }
        annotationManager = new gui.AnnotationViewManager(self, odfnode.body, annotationsPane);
        modifyAnnotations(odfnode.body)
      }else {
        if(annotationsPane.parentNode) {
          sizer.removeChild(annotationsPane);
          annotationManager.forgetAnnotations();
          fixContainerSize()
        }
      }
    }
    function refreshOdf(suppressEvent) {
      function callback() {
        clear(element);
        element.style.display = "inline-block";
        var odfnode = odfcontainer.rootElement;
        element.ownerDocument.importNode(odfnode, true);
        formatting.setOdfContainer(odfcontainer);
        handleFonts(odfcontainer, fontcss);
        handleStyles(odfcontainer, formatting, stylesxmlcss);
        handleContent(odfcontainer, odfnode);
        handleAnnotations(odfnode);
        if(!suppressEvent) {
          fireEvent("statereadychange", [odfcontainer])
        }
      }
      if(odfcontainer.state === odf.OdfContainer.DONE) {
        callback()
      }else {
        runtime.log("WARNING: refreshOdf called but ODF was not DONE.");
        runtime.setTimeout(function later_cb() {
          if(odfcontainer.state === odf.OdfContainer.DONE) {
            callback()
          }else {
            runtime.log("will be back later...");
            runtime.setTimeout(later_cb, 500)
          }
        }, 100)
      }
    }
    this.refreshCSS = function() {
      handleStyles(odfcontainer, formatting, stylesxmlcss);
      fixContainerSize()
    };
    this.refreshSize = function() {
      fixContainerSize()
    };
    this.odfContainer = function() {
      return odfcontainer
    };
    this.slidevisibilitycss = function() {
      return pageSwitcher.css
    };
    this.setOdfContainer = function(container, suppressEvent) {
      odfcontainer = container;
      refreshOdf(suppressEvent === true)
    };
    function load(url) {
      loadingQueue.clearQueue();
      element.innerHTML = "loading " + url;
      element.removeAttribute("style");
      odfcontainer = new odf.OdfContainer(url, function(container) {
        odfcontainer = container;
        refreshOdf(false)
      })
    }
    this["load"] = load;
    this.load = load;
    this.save = function(callback) {
      odfcontainer.save(callback)
    };
    this.addListener = function(eventName, handler) {
      switch(eventName) {
        case "selectionchange":
          selectionWatcher.addListener(eventName, handler);
          break;
        case "click":
          listenEvent(element, eventName, handler);
          break;
        default:
          addEventListener(eventName, handler);
          break
      }
    };
    this.getFormatting = function() {
      return formatting
    };
    this.getAnnotationManager = function() {
      return annotationManager
    };
    this.refreshAnnotations = function() {
      handleAnnotations(odfcontainer.rootElement)
    };
    this.rerenderAnnotations = function() {
      if(annotationManager) {
        annotationManager.rerenderAnnotations()
      }
    };
    this.getSizer = function() {
      return sizer
    };
    this.enableAnnotations = function(allow) {
      if(allow !== allowAnnotations) {
        allowAnnotations = allow;
        if(odfcontainer) {
          handleAnnotations(odfcontainer.rootElement)
        }
      }
    };
    this.addAnnotation = function(annotation) {
      if(annotationManager) {
        annotationManager.addAnnotation(annotation)
      }
    };
    this.forgetAnnotations = function() {
      if(annotationManager) {
        annotationManager.forgetAnnotations()
      }
    };
    this.setZoomLevel = function(zoom) {
      zoomLevel = zoom;
      fixContainerSize()
    };
    this.getZoomLevel = function() {
      return zoomLevel
    };
    this.fitToContainingElement = function(width, height) {
      var realWidth = element.offsetWidth / zoomLevel, realHeight = element.offsetHeight / zoomLevel;
      zoomLevel = width / realWidth;
      if(height / realHeight < zoomLevel) {
        zoomLevel = height / realHeight
      }
      fixContainerSize()
    };
    this.fitToWidth = function(width) {
      var realWidth = element.offsetWidth / zoomLevel;
      zoomLevel = width / realWidth;
      fixContainerSize()
    };
    this.fitSmart = function(width, height) {
      var realWidth, realHeight, newScale;
      realWidth = element.offsetWidth / zoomLevel;
      realHeight = element.offsetHeight / zoomLevel;
      newScale = width / realWidth;
      if(height !== undefined) {
        if(height / realHeight < newScale) {
          newScale = height / realHeight
        }
      }
      zoomLevel = Math.min(1, newScale);
      fixContainerSize()
    };
    this.fitToHeight = function(height) {
      var realHeight = element.offsetHeight / zoomLevel;
      zoomLevel = height / realHeight;
      fixContainerSize()
    };
    this.showFirstPage = function() {
      pageSwitcher.showFirstPage()
    };
    this.showNextPage = function() {
      pageSwitcher.showNextPage()
    };
    this.showPreviousPage = function() {
      pageSwitcher.showPreviousPage()
    };
    this.showPage = function(n) {
      pageSwitcher.showPage(n);
      fixContainerSize()
    };
    this.getElement = function() {
      return element
    };
    this.destroy = function(callback) {
      var head = doc.getElementsByTagName("head")[0];
      if(annotationsPane && annotationsPane.parentNode) {
        annotationsPane.parentNode.removeChild(annotationsPane)
      }
      if(sizer) {
        element.removeChild(sizer)
      }
      head.removeChild(webodfcss);
      head.removeChild(fontcss);
      head.removeChild(stylesxmlcss);
      head.removeChild(positioncss);
      selectionWatcher.destroy(function(err) {
        if(err) {
          callback(err)
        }else {
          pageSwitcher.destroy(callback)
        }
      })
    };
    function init() {
      webodfcss = addWebODFStyleSheet(doc);
      pageSwitcher = new PageSwitcher(addStyleSheet(doc));
      fontcss = addStyleSheet(doc);
      stylesxmlcss = addStyleSheet(doc);
      positioncss = addStyleSheet(doc)
    }
    init()
  };
  return odf.OdfCanvas
}();
runtime.loadClass("odf.OdfCanvas");
odf.CommandLineTools = function CommandLineTools() {
  this.roundTrip = function(inputfilepath, outputfilepath, callback) {
    function onready(odfcontainer) {
      if(odfcontainer.state === odf.OdfContainer.INVALID) {
        return callback("Document " + inputfilepath + " is invalid.")
      }
      if(odfcontainer.state === odf.OdfContainer.DONE) {
        odfcontainer.saveAs(outputfilepath, function(err) {
          callback(err)
        })
      }else {
        callback("Document was not completely loaded.")
      }
    }
    var odfcontainer = new odf.OdfContainer(inputfilepath, onready);
    return odfcontainer
  };
  this.render = function(inputfilepath, document, callback) {
    var body = document.getElementsByTagName("body")[0], odfcanvas;
    while(body.firstChild) {
      body.removeChild(body.firstChild)
    }
    odfcanvas = new odf.OdfCanvas(body);
    odfcanvas.addListener("statereadychange", function(err) {
      callback(err)
    });
    odfcanvas.load(inputfilepath)
  }
};
/*

 Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
ops.Server = function Server() {
};
ops.Server.prototype.connect = function(timeout, cb) {
};
ops.Server.prototype.networkStatus = function() {
};
ops.Server.prototype.login = function(login, password, successCb, failCb) {
};
ops.Server.prototype.joinSession = function(userId, sessionId, successCb, failCb) {
};
ops.Server.prototype.leaveSession = function(sessionId, memberId, successCb, failCb) {
};
ops.Server.prototype.getGenesisUrl = function(sessionId) {
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
ops.Operation = function Operation() {
};
ops.Operation.prototype.init = function(data) {
};
ops.Operation.prototype.transform = function(otherOp, hasPriority) {
};
ops.Operation.prototype.execute = function(odtDocument) {
};
ops.Operation.prototype.spec = function() {
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
ops.OpAddCursor = function OpAddCursor() {
  var self = this, memberid, timestamp;
  this.init = function(data) {
    memberid = data.memberid;
    timestamp = data.timestamp
  };
  this.transform = function(otherOp, hasPriority) {
    return[self]
  };
  this.execute = function(odtDocument) {
    var cursor = odtDocument.getCursor(memberid);
    if(cursor) {
      return false
    }
    cursor = new ops.OdtCursor(memberid, odtDocument);
    odtDocument.addCursor(cursor);
    odtDocument.emit(ops.OdtDocument.signalCursorAdded, cursor);
    return true
  };
  this.spec = function() {
    return{optype:"AddCursor", memberid:memberid, timestamp:timestamp}
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("core.DomUtils");
runtime.loadClass("odf.Namespaces");
runtime.loadClass("odf.OdfUtils");
gui.StyleHelper = function StyleHelper(formatting) {
  var domUtils = new core.DomUtils, odfUtils = new odf.OdfUtils, textns = odf.Namespaces.textns;
  function getAppliedStyles(range) {
    var container, nodes;
    if(range.collapsed) {
      container = range.startContainer;
      if(container.hasChildNodes() && range.startOffset < container.childNodes.length) {
        container = container.childNodes[range.startOffset]
      }
      nodes = [container]
    }else {
      nodes = odfUtils.getTextNodes(range, true)
    }
    return formatting.getAppliedStyles(nodes)
  }
  this.getAppliedStyles = getAppliedStyles;
  this.applyStyle = function(memberId, range, info) {
    var nextTextNodes = domUtils.splitBoundaries(range), textNodes = odfUtils.getTextNodes(range, false), limits;
    limits = {startContainer:range.startContainer, startOffset:range.startOffset, endContainer:range.endContainer, endOffset:range.endOffset};
    formatting.applyStyle(memberId, textNodes, limits, info);
    nextTextNodes.forEach(domUtils.normalizeTextNodes)
  };
  function hasTextPropertyValue(range, propertyName, propertyValue) {
    var hasOtherValue = true, styles, properties, i;
    styles = getAppliedStyles(range);
    for(i = 0;i < styles.length;i += 1) {
      properties = styles[i]["style:text-properties"];
      hasOtherValue = !properties || properties[propertyName] !== propertyValue;
      if(hasOtherValue) {
        break
      }
    }
    return!hasOtherValue
  }
  this.isBold = function(range) {
    return hasTextPropertyValue(range, "fo:font-weight", "bold")
  };
  this.isItalic = function(range) {
    return hasTextPropertyValue(range, "fo:font-style", "italic")
  };
  this.hasUnderline = function(range) {
    return hasTextPropertyValue(range, "style:text-underline-style", "solid")
  };
  this.hasStrikeThrough = function(range) {
    return hasTextPropertyValue(range, "style:text-line-through-style", "solid")
  };
  function hasParagraphPropertyValue(range, propertyName, propertyValues) {
    var nodes = odfUtils.getParagraphElements(range), isStyleChecked = {}, isDefaultParagraphStyleChecked = false, paragraphStyleName, paragraphStyleElement, paragraphStyleAttributes, properties;
    while(nodes.length > 0) {
      paragraphStyleName = nodes[0].getAttributeNS(textns, "style-name");
      if(paragraphStyleName) {
        if(!isStyleChecked[paragraphStyleName]) {
          paragraphStyleElement = formatting.getStyleElement(paragraphStyleName, "paragraph");
          isStyleChecked[paragraphStyleName] = true
        }
      }else {
        if(!isDefaultParagraphStyleChecked) {
          isDefaultParagraphStyleChecked = true;
          paragraphStyleElement = formatting.getDefaultStyleElement("paragraph")
        }else {
          paragraphStyleElement = undefined
        }
      }
      if(paragraphStyleElement) {
        paragraphStyleAttributes = formatting.getInheritedStyleAttributes((paragraphStyleElement), true);
        properties = paragraphStyleAttributes["style:paragraph-properties"];
        if(properties && propertyValues.indexOf(properties[propertyName]) === -1) {
          return false
        }
      }
      nodes.pop()
    }
    return true
  }
  this.isAlignedLeft = function(range) {
    return hasParagraphPropertyValue(range, "fo:text-align", ["left", "start"])
  };
  this.isAlignedCenter = function(range) {
    return hasParagraphPropertyValue(range, "fo:text-align", ["center"])
  };
  this.isAlignedRight = function(range) {
    return hasParagraphPropertyValue(range, "fo:text-align", ["right", "end"])
  };
  this.isAlignedJustified = function(range) {
    return hasParagraphPropertyValue(range, "fo:text-align", ["justify"])
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("gui.StyleHelper");
runtime.loadClass("odf.OdfUtils");
ops.OpApplyDirectStyling = function OpApplyDirectStyling() {
  var memberid, timestamp, position, length, setProperties, odfUtils = new odf.OdfUtils;
  this.init = function(data) {
    memberid = data.memberid;
    timestamp = data.timestamp;
    position = parseInt(data.position, 10);
    length = parseInt(data.length, 10);
    setProperties = data.setProperties
  };
  this.transform = function(otherOp, hasPriority) {
    return null
  };
  function getRange(odtDocument) {
    var point1 = length >= 0 ? position : position + length, point2 = length >= 0 ? position + length : position, p1 = odtDocument.getIteratorAtPosition(point1), p2 = length ? odtDocument.getIteratorAtPosition(point2) : p1, range = odtDocument.getDOM().createRange();
    range.setStart(p1.container(), p1.unfilteredDomOffset());
    range.setEnd(p2.container(), p2.unfilteredDomOffset());
    return range
  }
  this.execute = function(odtDocument) {
    var range = getRange(odtDocument), impactedParagraphs = odfUtils.getImpactedParagraphs(range), styleHelper = new gui.StyleHelper(odtDocument.getFormatting());
    styleHelper.applyStyle(memberid, range, setProperties);
    range.detach();
    odtDocument.getOdfCanvas().refreshCSS();
    impactedParagraphs.forEach(function(n) {
      odtDocument.emit(ops.OdtDocument.signalParagraphChanged, {paragraphElement:n, memberId:memberid, timeStamp:timestamp})
    });
    odtDocument.getOdfCanvas().rerenderAnnotations();
    return true
  };
  this.spec = function() {
    return{optype:"ApplyDirectStyling", memberid:memberid, timestamp:timestamp, position:position, length:length, setProperties:setProperties}
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
ops.OpRemoveCursor = function OpRemoveCursor() {
  var self = this, optype = "RemoveCursor", memberid, timestamp;
  this.init = function(data) {
    memberid = data.memberid;
    timestamp = data.timestamp
  };
  this.transform = function(otherOp, hasPriority) {
    var otherOpspec = otherOp.spec(), result = [self];
    if(otherOpspec.optype === optype && otherOpspec.memberid === memberid) {
      result = []
    }
    return result
  };
  this.execute = function(odtDocument) {
    if(!odtDocument.removeCursor(memberid)) {
      return false
    }
    return true
  };
  this.spec = function() {
    return{optype:optype, memberid:memberid, timestamp:timestamp}
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
ops.OpMoveCursor = function OpMoveCursor() {
  var self = this, memberid, timestamp, position, length;
  this.init = function(data) {
    memberid = data.memberid;
    timestamp = data.timestamp;
    position = parseInt(data.position, 10);
    length = data.length !== undefined ? parseInt(data.length, 10) : 0
  };
  function countSteps(number, stepCounter, positionFilter) {
    if(number > 0) {
      return stepCounter.countForwardSteps(number, positionFilter)
    }
    if(number < 0) {
      return-stepCounter.countBackwardSteps(-number, positionFilter)
    }
    return 0
  }
  this.merge = function(otherOpspec) {
    if(otherOpspec.optype === "MoveCursor" && otherOpspec.memberid === memberid) {
      position = otherOpspec.position;
      length = otherOpspec.length;
      timestamp = otherOpspec.timestamp;
      return true
    }
    return false
  };
  this.transform = function(otherOp, hasPriority) {
    var otherOpspec = otherOp.spec(), otherOptype = otherOpspec.optype, end = position + length, otherOpspecEnd, result = [self];
    switch(otherOptype) {
      case "RemoveText":
        otherOpspecEnd = otherOpspec.position + otherOpspec.length;
        if(otherOpspecEnd <= position) {
          position -= otherOpspec.length
        }else {
          if(otherOpspec.position < end) {
            if(position < otherOpspec.position) {
              if(otherOpspecEnd < end) {
                length = length - otherOpspec.length
              }else {
                length = otherOpspec.position - position
              }
            }else {
              position = otherOpspec.position;
              if(otherOpspecEnd < end) {
                length = end - otherOpspecEnd
              }else {
                length = 0
              }
            }
          }
        }
        break;
      case "SplitParagraph":
        if(otherOpspec.position < position) {
          position += 1
        }else {
          if(otherOpspec.position <= end) {
            length += 1
          }
        }
        break;
      case "AddAnnotation":
        if(otherOpspec.position < position) {
          position += 1
        }else {
          if(otherOpspec.position < end) {
            length += 1
          }
        }
        break;
      case "InsertText":
        if(otherOpspec.position < position) {
          position += otherOpspec.text.length
        }else {
          if(otherOpspec.position <= end) {
            length += otherOpspec.text.length
          }
        }
        break;
      case "RemoveCursor":
        if(otherOpspec.memberid === memberid) {
          result = []
        }
        break;
      case "InsertTable":
        result = null;
        break
    }
    return result
  };
  this.execute = function(odtDocument) {
    var cursor = odtDocument.getCursor(memberid), oldPosition = odtDocument.getCursorPosition(memberid), positionFilter = odtDocument.getPositionFilter(), number = position - oldPosition, stepsToSelectionStart, stepsToSelectionEnd, stepCounter;
    if(!cursor) {
      return false
    }
    stepCounter = cursor.getStepCounter();
    stepsToSelectionStart = countSteps(number, stepCounter, positionFilter);
    cursor.move(stepsToSelectionStart);
    if(length) {
      stepsToSelectionEnd = countSteps(length, stepCounter, positionFilter);
      cursor.move(stepsToSelectionEnd, true)
    }
    odtDocument.emit(ops.OdtDocument.signalCursorMoved, cursor);
    return true
  };
  this.spec = function() {
    return{optype:"MoveCursor", memberid:memberid, timestamp:timestamp, position:position, length:length}
  }
};
/*

 Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
ops.OpInsertTable = function OpInsertTable() {
  var self = this, optype = "InsertTable", memberid, timestamp, initialRows, initialColumns, position, tableName, tableStyleName, tableColumnStyleName, tableCellStyleMatrix, tablens = "urn:oasis:names:tc:opendocument:xmlns:table:1.0", textns = "urn:oasis:names:tc:opendocument:xmlns:text:1.0";
  this.init = function(data) {
    memberid = data.memberid;
    timestamp = data.timestamp;
    position = parseInt(data.position, 10);
    initialRows = parseInt(data.initialRows, 10);
    initialColumns = parseInt(data.initialColumns, 10);
    tableName = data.tableName;
    tableStyleName = data.tableStyleName;
    tableColumnStyleName = data.tableColumnStyleName;
    tableCellStyleMatrix = data.tableCellStyleMatrix
  };
  this.transform = function(otherOp, hasPriority) {
    var otherOpspec = otherOp.spec(), otherOptype = otherOpspec.optype, result = [self];
    switch(otherOptype) {
      case optype:
        result = null;
        break;
      case "AddAnnotation":
        if(otherOpspec.position < position) {
          position += 1
        }
        break;
      case "SplitParagraph":
        if(otherOpspec.position < position) {
          position += 1
        }else {
          if(otherOpspec.position === position && !hasPriority) {
            position += 1;
            result = null
          }
        }
        break;
      case "InsertText":
        if(otherOpspec.position < position) {
          position += otherOpspec.text.length
        }else {
          if(otherOpspec.position === position && !hasPriority) {
            position += otherOpspec.text.length;
            result = null
          }
        }
        break;
      case "RemoveText":
        if(otherOpspec.position + otherOpspec.length <= position) {
          position -= otherOpspec.length
        }else {
          if(otherOpspec.position < position) {
            position = otherOpspec.position
          }
        }
        break
    }
    return result
  };
  function getCellStyleName(row, column) {
    var rowStyles;
    if(tableCellStyleMatrix.length === 1) {
      rowStyles = tableCellStyleMatrix[0]
    }else {
      if(tableCellStyleMatrix.length === 3) {
        switch(row) {
          case 0:
            rowStyles = tableCellStyleMatrix[0];
            break;
          case initialRows - 1:
            rowStyles = tableCellStyleMatrix[2];
            break;
          default:
            rowStyles = tableCellStyleMatrix[1];
            break
        }
      }else {
        rowStyles = tableCellStyleMatrix[row]
      }
    }
    if(rowStyles.length === 1) {
      return rowStyles[0]
    }
    if(rowStyles.length === 3) {
      switch(column) {
        case 0:
          return rowStyles[0];
        case initialColumns - 1:
          return rowStyles[2];
        default:
          return rowStyles[1]
      }
    }
    return rowStyles[column]
  }
  function createTableNode(document) {
    var tableNode = document.createElementNS(tablens, "table:table"), columns = document.createElementNS(tablens, "table:table-column"), row, cell, paragraph, rowCounter, columnCounter, cellStyleName;
    if(tableStyleName) {
      tableNode.setAttributeNS(tablens, "table:style-name", tableStyleName)
    }
    if(tableName) {
      tableNode.setAttributeNS(tablens, "table:name", tableName)
    }
    columns.setAttributeNS(tablens, "table:number-columns-repeated", initialColumns);
    if(tableColumnStyleName) {
      columns.setAttributeNS(tablens, "table:style-name", tableColumnStyleName)
    }
    tableNode.appendChild(columns);
    for(rowCounter = 0;rowCounter < initialRows;rowCounter += 1) {
      row = document.createElementNS(tablens, "table:table-row");
      for(columnCounter = 0;columnCounter < initialColumns;columnCounter += 1) {
        cell = document.createElementNS(tablens, "table:table-cell");
        cellStyleName = getCellStyleName(rowCounter, columnCounter);
        if(cellStyleName) {
          cell.setAttributeNS(tablens, "table:style-name", cellStyleName)
        }
        paragraph = document.createElementNS(textns, "text:p");
        cell.appendChild(paragraph);
        row.appendChild(cell)
      }
      tableNode.appendChild(row)
    }
    return tableNode
  }
  this.execute = function(odtDocument) {
    var domPosition = odtDocument.getPositionInTextNode(position), rootNode = odtDocument.getRootNode(), previousSibling, tableNode;
    if(domPosition) {
      tableNode = createTableNode(odtDocument.getDOM());
      previousSibling = odtDocument.getParagraphElement(domPosition.textNode);
      rootNode.insertBefore(tableNode, previousSibling ? previousSibling.nextSibling : undefined);
      odtDocument.getOdfCanvas().refreshSize();
      odtDocument.emit(ops.OdtDocument.signalTableAdded, {tableElement:tableNode, memberId:memberid, timeStamp:timestamp});
      odtDocument.getOdfCanvas().rerenderAnnotations();
      return true
    }
    return false
  };
  this.spec = function() {
    return{optype:optype, memberid:memberid, timestamp:timestamp, position:position, initialRows:initialRows, initialColumns:initialColumns, tableName:tableName, tableStyleName:tableStyleName, tableColumnStyleName:tableColumnStyleName, tableCellStyleMatrix:tableCellStyleMatrix}
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
ops.OpInsertText = function OpInsertText() {
  var self = this, space = " ", tab = "\t", optype = "InsertText", memberid, timestamp, position, text;
  this.init = function(data) {
    memberid = data.memberid;
    timestamp = data.timestamp;
    position = parseInt(data.position, 10);
    text = data.text
  };
  this.merge = function(otherOpspec) {
    if(otherOpspec.optype === optype && otherOpspec.memberid === memberid && otherOpspec.position === position + text.length) {
      text = text + otherOpspec.text;
      timestamp = otherOpspec.timestamp;
      return true
    }
    return false
  };
  this.transform = function(otherOp, hasPriority) {
    var otherOpspec = otherOp.spec(), otherOptype = otherOpspec.optype, result = [self];
    switch(otherOptype) {
      case optype:
        if(otherOpspec.position < position) {
          position += otherOpspec.text.length
        }else {
          if(otherOpspec.position === position && !hasPriority) {
            position += otherOpspec.text.length;
            result = null
          }
        }
        break;
      case "AddAnnotation":
        if(otherOpspec.position < position) {
          position += 1
        }
        break;
      case "SplitParagraph":
        if(otherOpspec.position < position) {
          position += 1
        }else {
          if(otherOpspec.position === position && !hasPriority) {
            position += 1;
            result = null
          }
        }
        break;
      case "InsertTable":
        result = null;
        break;
      case "RemoveText":
        if(otherOpspec.position + otherOpspec.length <= position) {
          position -= otherOpspec.length
        }else {
          if(otherOpspec.position < position) {
            position = otherOpspec.position
          }
        }
        break
    }
    return result
  };
  function triggerLayoutInWebkit(textNode) {
    var parent = textNode.parentNode, next = textNode.nextSibling;
    parent.removeChild(textNode);
    parent.insertBefore(textNode, next)
  }
  function requiresSpaceElement(text, index) {
    return text[index] === space && (index === 0 || text[index - 1] === space)
  }
  this.execute = function(odtDocument) {
    var domPosition, previousNode, parentElement, nextNode, ownerDocument = odtDocument.getDOM(), paragraphElement, textns = "urn:oasis:names:tc:opendocument:xmlns:text:1.0", toInsertIndex = 0, spaceTag, spaceElement, i;
    function insertTextNode(toInsertText) {
      parentElement.insertBefore(ownerDocument.createTextNode(toInsertText), nextNode)
    }
    odtDocument.upgradeWhitespacesAtPosition(position);
    domPosition = odtDocument.getPositionInTextNode(position, memberid);
    if(domPosition) {
      previousNode = domPosition.textNode;
      nextNode = previousNode.nextSibling;
      parentElement = previousNode.parentNode;
      paragraphElement = odtDocument.getParagraphElement(previousNode);
      for(i = 0;i < text.length;i += 1) {
        if(requiresSpaceElement(text, i) || text[i] === tab) {
          if(toInsertIndex === 0) {
            if(domPosition.offset !== previousNode.length) {
              nextNode = previousNode.splitText(domPosition.offset)
            }
            if(0 < i) {
              previousNode.appendData(text.substring(0, i))
            }
          }else {
            if(toInsertIndex < i) {
              insertTextNode(text.substring(toInsertIndex, i))
            }
          }
          toInsertIndex = i + 1;
          spaceTag = text[i] === space ? "text:s" : "text:tab";
          spaceElement = ownerDocument.createElementNS(textns, spaceTag);
          spaceElement.appendChild(ownerDocument.createTextNode(text[i]));
          parentElement.insertBefore(spaceElement, nextNode)
        }
      }
      if(toInsertIndex === 0) {
        previousNode.insertData(domPosition.offset, text)
      }else {
        if(toInsertIndex < text.length) {
          insertTextNode(text.substring(toInsertIndex))
        }
      }
      triggerLayoutInWebkit(previousNode);
      if(previousNode.length === 0) {
        previousNode.parentNode.removeChild(previousNode)
      }
      if(position > 0) {
        odtDocument.downgradeWhitespacesAtPosition(position - 1);
        if(position > 1) {
          odtDocument.downgradeWhitespacesAtPosition(position - 2)
        }
      }
      odtDocument.downgradeWhitespacesAtPosition(position);
      odtDocument.downgradeWhitespacesAtPosition(position + text.length);
      odtDocument.getOdfCanvas().refreshSize();
      odtDocument.emit(ops.OdtDocument.signalParagraphChanged, {paragraphElement:paragraphElement, memberId:memberid, timeStamp:timestamp});
      odtDocument.getOdfCanvas().rerenderAnnotations();
      return true
    }
    return false
  };
  this.spec = function() {
    return{optype:optype, memberid:memberid, timestamp:timestamp, position:position, text:text}
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("odf.Namespaces");
runtime.loadClass("odf.OdfUtils");
runtime.loadClass("core.DomUtils");
ops.OpRemoveText = function OpRemoveText() {
  var self = this, optype = "RemoveText", memberid, timestamp, position, length, odfUtils, domUtils, editinfons = "urn:webodf:names:editinfo";
  this.init = function(data) {
    runtime.assert(data.length >= 0, "OpRemoveText only supports positive lengths");
    memberid = data.memberid;
    timestamp = data.timestamp;
    position = parseInt(data.position, 10);
    length = parseInt(data.length, 10);
    odfUtils = new odf.OdfUtils;
    domUtils = new core.DomUtils
  };
  this.transform = function(otherOp, hasPriority) {
    var otherOpspec = otherOp.spec(), otherOptype = otherOpspec.optype, end = position + length, otherOpspecEnd, helperOp, result = [self];
    switch(otherOptype) {
      case optype:
        otherOpspecEnd = otherOpspec.position + otherOpspec.length;
        if(otherOpspecEnd <= position) {
          position -= otherOpspec.length
        }else {
          if(otherOpspec.position < end) {
            if(position < otherOpspec.position) {
              if(otherOpspecEnd < end) {
                length = length - otherOpspec.length
              }else {
                length = otherOpspec.position - position
              }
            }else {
              if(otherOpspecEnd < end) {
                position = otherOpspec.position;
                length = end - otherOpspecEnd
              }else {
                result = []
              }
            }
          }
        }
        break;
      case "InsertText":
        if(otherOpspec.position <= position) {
          position += otherOpspec.text.length
        }else {
          if(otherOpspec.position < end) {
            length = otherOpspec.position - position;
            helperOp = new ops.OpRemoveText;
            helperOp.init({memberid:memberid, timestamp:timestamp, position:otherOpspec.position + otherOpspec.text.length, length:end - otherOpspec.position});
            result = [helperOp, self]
          }
        }
        break;
      case "SplitParagraph":
        if(otherOpspec.position <= position) {
          position += 1
        }else {
          if(otherOpspec.position < end) {
            length = otherOpspec.position - position;
            helperOp = new ops.OpRemoveText;
            helperOp.init({memberid:memberid, timestamp:timestamp, position:otherOpspec.position + 1, length:end - otherOpspec.position});
            result = [helperOp, self]
          }
        }
        break;
      case "InsertTable":
        result = null;
        break;
      case "AddAnnotation":
      ;
      case "RemoveAnnotation":
        result = null;
        break;
      case "ApplyDirectStyling":
        result = null;
        break
    }
    return result
  };
  function CollapsingRules(rootNode) {
    function isEmpty(node) {
      var childNode;
      if(odfUtils.isCharacterElement(node)) {
        return false
      }
      if(node.nodeType === Node.TEXT_NODE) {
        return node.textContent.length === 0
      }
      childNode = node.firstChild;
      while(childNode) {
        if(!isEmpty(childNode)) {
          return false
        }
        childNode = childNode.nextSibling
      }
      return true
    }
    this.isEmpty = isEmpty;
    function isCollapsibleContainer(node) {
      return!odfUtils.isParagraph(node) && node !== rootNode && isEmpty(node)
    }
    function mergeChildrenIntoParent(node) {
      var parent = domUtils.mergeIntoParent(node);
      if(isCollapsibleContainer(parent)) {
        return mergeChildrenIntoParent(parent)
      }
      return parent
    }
    this.mergeChildrenIntoParent = mergeChildrenIntoParent
  }
  function mergeParagraphs(first, second, collapseRules) {
    var child, mergeForward, destination = first, source = second, secondParent, insertionPoint;
    if(collapseRules.isEmpty(first)) {
      mergeForward = true;
      if(second.parentNode !== first.parentNode) {
        secondParent = second.parentNode;
        first.parentNode.insertBefore(second, first.nextSibling)
      }
      source = first;
      destination = second;
      insertionPoint = destination.getElementsByTagNameNS(editinfons, "editinfo")[0] || destination.firstChild
    }
    while(source.hasChildNodes()) {
      child = mergeForward ? source.lastChild : source.firstChild;
      source.removeChild(child);
      if(child.localName !== "editinfo") {
        destination.insertBefore(child, insertionPoint)
      }
    }
    if(secondParent && collapseRules.isEmpty(secondParent)) {
      collapseRules.mergeChildrenIntoParent(secondParent)
    }
    collapseRules.mergeChildrenIntoParent(source);
    return destination
  }
  function stepsToRange(odtDocument) {
    var iterator, filter = odtDocument.getPositionFilter(), startContainer, startOffset, endContainer, endOffset, remainingLength = length, range = odtDocument.getDOM().createRange();
    iterator = odtDocument.getIteratorAtPosition(position);
    startContainer = iterator.container();
    startOffset = iterator.unfilteredDomOffset();
    while(remainingLength && iterator.nextPosition()) {
      endContainer = iterator.container();
      endOffset = iterator.unfilteredDomOffset();
      if(filter.acceptPosition(iterator) === NodeFilter.FILTER_ACCEPT) {
        remainingLength -= 1
      }
    }
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
    domUtils.splitBoundaries(range);
    return range
  }
  this.execute = function(odtDocument) {
    var paragraphElement, destinationParagraph, range, textNodes, paragraphs, collapseRules = new CollapsingRules(odtDocument.getRootNode());
    odtDocument.upgradeWhitespacesAtPosition(position);
    odtDocument.upgradeWhitespacesAtPosition(position + length);
    range = stepsToRange(odtDocument);
    paragraphElement = odtDocument.getParagraphElement(range.startContainer);
    textNodes = odtDocument.getTextElements(range, true);
    paragraphs = odtDocument.getParagraphElements(range);
    range.detach();
    textNodes.forEach(function(element) {
      collapseRules.mergeChildrenIntoParent(element)
    });
    destinationParagraph = paragraphs.reduce(function(destination, paragraph) {
      return mergeParagraphs(destination, paragraph, collapseRules)
    });
    odtDocument.downgradeWhitespacesAtPosition(position);
    odtDocument.fixCursorPositions();
    odtDocument.getOdfCanvas().refreshSize();
    odtDocument.emit(ops.OdtDocument.signalParagraphChanged, {paragraphElement:destinationParagraph || paragraphElement, memberId:memberid, timeStamp:timestamp});
    odtDocument.emit(ops.OdtDocument.signalCursorMoved, odtDocument.getCursor(memberid));
    odtDocument.getOdfCanvas().rerenderAnnotations();
    return true
  };
  this.spec = function() {
    return{optype:optype, memberid:memberid, timestamp:timestamp, position:position, length:length}
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
ops.OpSplitParagraph = function OpSplitParagraph() {
  var self = this, optype = "SplitParagraph", memberid, timestamp, position, odfUtils = new odf.OdfUtils;
  this.init = function(data) {
    memberid = data.memberid;
    timestamp = data.timestamp;
    position = parseInt(data.position, 10)
  };
  this.transform = function(otherOp, hasPriority) {
    var otherOpspec = otherOp.spec(), otherOptype = otherOpspec.optype, result = [self];
    switch(otherOptype) {
      case optype:
        if(otherOpspec.position < position) {
          position += 1
        }else {
          if(otherOpspec.position === position && !hasPriority) {
            position += 1;
            result = null
          }
        }
        break;
      case "AddAnnotation":
        if(otherOpspec.position < position) {
          position += 1
        }
        break;
      case "InsertText":
        if(otherOpspec.position < position) {
          position += otherOpspec.text.length
        }else {
          if(otherOpspec.position === position && !hasPriority) {
            position += otherOpspec.text.length;
            result = null
          }
        }
        break;
      case "InsertTable":
        result = null;
        break;
      case "RemoveText":
        if(otherOpspec.position + otherOpspec.length <= position) {
          position -= otherOpspec.length
        }else {
          if(otherOpspec.position < position) {
            position = otherOpspec.position
          }
        }
        break
    }
    return result
  };
  this.execute = function(odtDocument) {
    var domPosition, paragraphNode, targetNode, node, splitNode, splitChildNode, keptChildNode;
    odtDocument.upgradeWhitespacesAtPosition(position);
    domPosition = odtDocument.getPositionInTextNode(position, memberid);
    if(!domPosition) {
      return false
    }
    paragraphNode = odtDocument.getParagraphElement(domPosition.textNode);
    if(!paragraphNode) {
      return false
    }
    if(odfUtils.isListItem(paragraphNode.parentNode)) {
      targetNode = paragraphNode.parentNode
    }else {
      targetNode = paragraphNode
    }
    if(domPosition.offset === 0) {
      keptChildNode = domPosition.textNode.previousSibling;
      splitChildNode = null
    }else {
      keptChildNode = domPosition.textNode;
      if(domPosition.offset >= domPosition.textNode.length) {
        splitChildNode = null
      }else {
        splitChildNode = (domPosition.textNode.splitText(domPosition.offset))
      }
    }
    node = domPosition.textNode;
    while(node !== targetNode) {
      node = node.parentNode;
      splitNode = node.cloneNode(false);
      if(!keptChildNode) {
        node.parentNode.insertBefore(splitNode, node);
        keptChildNode = splitNode;
        splitChildNode = node
      }else {
        if(splitChildNode) {
          splitNode.appendChild(splitChildNode)
        }
        while(keptChildNode.nextSibling) {
          splitNode.appendChild(keptChildNode.nextSibling)
        }
        node.parentNode.insertBefore(splitNode, node.nextSibling);
        keptChildNode = node;
        splitChildNode = splitNode
      }
    }
    if(odfUtils.isListItem(splitChildNode)) {
      splitChildNode = splitChildNode.childNodes[0]
    }
    if(domPosition.textNode.length === 0) {
      domPosition.textNode.parentNode.removeChild(domPosition.textNode)
    }
    odtDocument.fixCursorPositions(memberid);
    odtDocument.getOdfCanvas().refreshSize();
    odtDocument.emit(ops.OdtDocument.signalParagraphChanged, {paragraphElement:paragraphNode, memberId:memberid, timeStamp:timestamp});
    odtDocument.emit(ops.OdtDocument.signalParagraphChanged, {paragraphElement:splitChildNode, memberId:memberid, timeStamp:timestamp});
    odtDocument.getOdfCanvas().rerenderAnnotations();
    return true
  };
  this.spec = function() {
    return{optype:optype, memberid:memberid, timestamp:timestamp, position:position}
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
ops.OpSetParagraphStyle = function OpSetParagraphStyle() {
  var self = this, optype = "SetParagraphStyle", memberid, timestamp, position, styleName, textns = "urn:oasis:names:tc:opendocument:xmlns:text:1.0";
  this.init = function(data) {
    memberid = data.memberid;
    timestamp = data.timestamp;
    position = data.position;
    styleName = data.styleName
  };
  this.transform = function(otherOp, hasPriority) {
    var otherOpspec = otherOp.spec(), otherOpType = otherOpspec.optype, result = [self];
    switch(otherOpType) {
      case "RemoveStyle":
        if(otherOpspec.styleName === styleName && otherOpspec.styleFamily === "paragraph") {
          styleName = ""
        }
        break
    }
    return result
  };
  this.execute = function(odtDocument) {
    var iterator, paragraphNode;
    iterator = odtDocument.getIteratorAtPosition(position);
    paragraphNode = odtDocument.getParagraphElement(iterator.container());
    if(paragraphNode) {
      if(styleName !== "") {
        paragraphNode.setAttributeNS(textns, "text:style-name", styleName)
      }else {
        paragraphNode.removeAttributeNS(textns, "style-name")
      }
      odtDocument.getOdfCanvas().refreshSize();
      odtDocument.emit(ops.OdtDocument.signalParagraphChanged, {paragraphElement:paragraphNode, timeStamp:timestamp, memberId:memberid});
      odtDocument.getOdfCanvas().rerenderAnnotations();
      return true
    }
    return false
  };
  this.spec = function() {
    return{optype:optype, memberid:memberid, timestamp:timestamp, position:position, styleName:styleName}
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("odf.Namespaces");
ops.OpUpdateParagraphStyle = function OpUpdateParagraphStyle() {
  var self = this, optype = "UpdateParagraphStyle", memberid, timestamp, styleName, setProperties, removedProperties, paragraphPropertiesName = "style:paragraph-properties", textPropertiesName = "style:text-properties", stylens = odf.Namespaces.stylens;
  function removedAttributesFromStyleNode(node, removedAttributeNames) {
    var i, attributeNameParts, attributeNameList = removedAttributeNames ? removedAttributeNames.split(",") : [];
    for(i = 0;i < attributeNameList.length;i += 1) {
      attributeNameParts = attributeNameList[i].split(":");
      node.removeAttributeNS(odf.Namespaces.resolvePrefix(attributeNameParts[0]), attributeNameParts[1])
    }
  }
  function dropShadowedAttributes(properties, removedProperties, shadowingProperties, shadowingRemovedProperties) {
    var value, i, name, removedPropertyNames, shadowingRemovedPropertyNames = shadowingRemovedProperties && shadowingRemovedProperties.attributes ? shadowingRemovedProperties.attributes.split(",") : [];
    if(properties && (shadowingProperties || shadowingRemovedPropertyNames.length > 0)) {
      Object.keys(properties).forEach(function(key) {
        value = properties[key];
        if(shadowingProperties && shadowingProperties[key] !== undefined || shadowingRemovedPropertyNames && shadowingRemovedPropertyNames.indexOf(key) !== -1) {
          if(typeof value !== "object") {
            delete properties[key]
          }
        }
      })
    }
    if(removedProperties && removedProperties.attributes && (shadowingProperties || shadowingRemovedPropertyNames.length > 0)) {
      removedPropertyNames = removedProperties.attributes.split(",");
      for(i = 0;i < removedPropertyNames.length;i += 1) {
        name = removedPropertyNames[i];
        if(shadowingProperties && shadowingProperties[name] !== undefined || shadowingRemovedPropertyNames && shadowingRemovedPropertyNames.indexOf(name) !== -1) {
          removedPropertyNames.splice(i, 1);
          i -= 1
        }
      }
      if(removedPropertyNames.length > 0) {
        removedProperties.attributes = removedPropertyNames.join(",")
      }else {
        delete removedProperties.attributes
      }
    }
  }
  function hasProperties(properties) {
    var key;
    for(key in properties) {
      if(properties.hasOwnProperty(key)) {
        return true
      }
    }
    return false
  }
  function hasRemovedProperties(properties) {
    var key;
    for(key in properties) {
      if(properties.hasOwnProperty(key)) {
        if(key !== "attributes" || properties.attributes.length > 0) {
          return true
        }
      }
    }
    return false
  }
  function dropShadowedProperties(otherOpspec, propertiesName) {
    var sp = setProperties ? setProperties[propertiesName] : null, rp = removedProperties ? removedProperties[propertiesName] : null;
    dropShadowedAttributes(sp, rp, otherOpspec.setProperties ? otherOpspec.setProperties[propertiesName] : null, otherOpspec.removedProperties ? otherOpspec.removedProperties[propertiesName] : null);
    if(sp && !hasProperties(sp)) {
      delete setProperties[propertiesName]
    }
    if(rp && !hasRemovedProperties(rp)) {
      delete removedProperties[propertiesName]
    }
  }
  function dropStyleReferencingAttributes(deletedStyleName) {
    if(setProperties) {
      ["style:parent-style-name", "style:next-style-name"].forEach(function(attributeName) {
        if(setProperties[attributeName] === deletedStyleName) {
          delete setProperties[attributeName]
        }
      })
    }
  }
  this.init = function(data) {
    memberid = data.memberid;
    timestamp = data.timestamp;
    styleName = data.styleName;
    setProperties = data.setProperties;
    removedProperties = data.removedProperties
  };
  this.transform = function(otherOp, hasPriority) {
    var otherOpspec = otherOp.spec(), otherOpType = otherOpspec.optype, result = [self];
    switch(otherOpType) {
      case optype:
        if(otherOpspec.styleName === styleName) {
          if(!hasPriority) {
            dropShadowedProperties(otherOpspec, paragraphPropertiesName);
            dropShadowedProperties(otherOpspec, textPropertiesName);
            dropShadowedAttributes(setProperties || null, removedProperties || null, otherOpspec.setProperties || null, otherOpspec.removedProperties || null);
            if(!(setProperties && hasProperties(setProperties)) && !(removedProperties && hasRemovedProperties(removedProperties))) {
              result = []
            }
          }
        }
        break;
      case "RemoveStyle":
        if(otherOpspec.styleFamily === "paragraph") {
          if(otherOpspec.styleName === styleName) {
            result = []
          }else {
            dropStyleReferencingAttributes(otherOpspec.styleName)
          }
        }
        break
    }
    return result
  };
  this.execute = function(odtDocument) {
    var formatting = odtDocument.getFormatting(), styleNode, paragraphPropertiesNode, textPropertiesNode;
    if(styleName !== "") {
      styleNode = odtDocument.getParagraphStyleElement(styleName)
    }else {
      styleNode = formatting.getDefaultStyleElement("paragraph")
    }
    if(styleNode) {
      paragraphPropertiesNode = styleNode.getElementsByTagNameNS(stylens, "paragraph-properties")[0];
      textPropertiesNode = styleNode.getElementsByTagNameNS(stylens, "text-properties")[0];
      if(setProperties) {
        formatting.updateStyle(styleNode, setProperties)
      }
      if(removedProperties) {
        if(removedProperties[paragraphPropertiesName]) {
          removedAttributesFromStyleNode(paragraphPropertiesNode, removedProperties[paragraphPropertiesName].attributes);
          if(paragraphPropertiesNode.attributes.length === 0) {
            styleNode.removeChild(paragraphPropertiesNode)
          }
        }
        if(removedProperties[textPropertiesName]) {
          removedAttributesFromStyleNode(textPropertiesNode, removedProperties[textPropertiesName].attributes);
          if(textPropertiesNode.attributes.length === 0) {
            styleNode.removeChild(textPropertiesNode)
          }
        }
        removedAttributesFromStyleNode(styleNode, removedProperties.attributes)
      }
      odtDocument.getOdfCanvas().refreshCSS();
      odtDocument.emit(ops.OdtDocument.signalParagraphStyleModified, styleName);
      odtDocument.getOdfCanvas().rerenderAnnotations();
      return true
    }
    return false
  };
  this.spec = function() {
    return{optype:optype, memberid:memberid, timestamp:timestamp, styleName:styleName, setProperties:setProperties, removedProperties:removedProperties}
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("odf.Namespaces");
ops.OpAddStyle = function OpAddStyle() {
  var self = this, memberid, timestamp, styleName, styleFamily, isAutomaticStyle, setProperties, stylens = odf.Namespaces.stylens;
  this.init = function(data) {
    memberid = data.memberid;
    timestamp = data.timestamp;
    styleName = data.styleName;
    styleFamily = data.styleFamily;
    isAutomaticStyle = data.isAutomaticStyle === "true" || data.isAutomaticStyle === true;
    setProperties = data.setProperties
  };
  function dropStyleReferencingAttributes(deletedStyleName) {
    if(setProperties) {
      ["style:parent-style-name", "style:next-style-name"].forEach(function(attributeName) {
        if(setProperties[attributeName] === deletedStyleName) {
          delete setProperties[attributeName]
        }
      })
    }
  }
  this.transform = function(otherOp, hasPriority) {
    var otherOpspec = otherOp.spec();
    if(otherOpspec.optype === "RemoveStyle" && otherOpspec.styleFamily === styleFamily) {
      dropStyleReferencingAttributes(otherOpspec.styleName)
    }
    return[self]
  };
  this.execute = function(odtDocument) {
    var odfContainer = odtDocument.getOdfCanvas().odfContainer(), formatting = odtDocument.getFormatting(), dom = odtDocument.getDOM(), styleNode = dom.createElementNS(stylens, "style:style");
    if(!styleNode) {
      return false
    }
    if(setProperties) {
      formatting.updateStyle(styleNode, setProperties)
    }
    styleNode.setAttributeNS(stylens, "style:family", styleFamily);
    styleNode.setAttributeNS(stylens, "style:name", styleName);
    if(isAutomaticStyle) {
      odfContainer.rootElement.automaticStyles.appendChild(styleNode)
    }else {
      odfContainer.rootElement.styles.appendChild(styleNode)
    }
    odtDocument.getOdfCanvas().refreshCSS();
    if(!isAutomaticStyle) {
      odtDocument.emit(ops.OdtDocument.signalCommonStyleCreated, {name:styleName, family:styleFamily})
    }
    return true
  };
  this.spec = function() {
    return{optype:"AddStyle", memberid:memberid, timestamp:timestamp, styleName:styleName, styleFamily:styleFamily, isAutomaticStyle:isAutomaticStyle, setProperties:setProperties}
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
ops.OpRemoveStyle = function OpRemoveStyle() {
  var self = this, optype = "RemoveStyle", memberid, timestamp, styleName, styleFamily;
  this.init = function(data) {
    memberid = data.memberid;
    timestamp = data.timestamp;
    styleName = data.styleName;
    styleFamily = data.styleFamily
  };
  function getStyleReferencingAttributes(setProperties) {
    var attributes = [];
    if(setProperties) {
      ["style:parent-style-name", "style:next-style-name"].forEach(function(attributeName) {
        if(setProperties[attributeName] === styleName) {
          attributes.push(attributeName)
        }
      })
    }
    return attributes
  }
  this.transform = function(otherOp, hasPriority) {
    var otherOpspec = otherOp.spec(), otherOpType = otherOpspec.optype, helperOp, setAttributes, result = [self];
    switch(otherOpType) {
      case optype:
        if(otherOpspec.styleName === styleName && otherOpspec.styleFamily === styleFamily) {
          result = []
        }
        break;
      case "UpdateParagraphStyle":
        if(styleFamily === "paragraph") {
          setAttributes = getStyleReferencingAttributes(otherOpspec.setProperties);
          if(setAttributes.length > 0) {
            helperOp = new ops.OpUpdateParagraphStyle;
            helperOp.init({memberid:memberid, timestamp:timestamp, styleName:otherOpspec.styleName, removedProperties:{attributes:setAttributes.join(",")}});
            result = [helperOp, self]
          }
        }
        break;
      case "AddStyle":
        if(otherOpspec.styleFamily === styleFamily) {
          setAttributes = getStyleReferencingAttributes(otherOpspec.setProperties);
          if(setAttributes.length > 0) {
            helperOp = new ops.OpUpdateParagraphStyle;
            helperOp.init({memberid:memberid, timestamp:timestamp, styleName:otherOpspec.styleName, removedProperties:{attributes:setAttributes.join(",")}});
            result = [helperOp, self]
          }
        }
        break;
      case "SetParagraphStyle":
        if(styleFamily === "paragraph" && otherOpspec.styleName === styleName) {
          otherOpspec.styleName = "";
          helperOp = new ops.OpSetParagraphStyle;
          helperOp.init(otherOpspec);
          result = [helperOp, self]
        }
        break
    }
    return result
  };
  this.execute = function(odtDocument) {
    var styleNode = odtDocument.getStyleElement(styleName, styleFamily);
    if(!styleNode) {
      return false
    }
    styleNode.parentNode.removeChild(styleNode);
    odtDocument.getOdfCanvas().refreshCSS();
    odtDocument.emit(ops.OdtDocument.signalCommonStyleDeleted, {name:styleName, family:styleFamily});
    return true
  };
  this.spec = function() {
    return{optype:optype, memberid:memberid, timestamp:timestamp, styleName:styleName, styleFamily:styleFamily}
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
ops.OpAddAnnotation = function OpAddAnnotation() {
  var self = this, optype = "AddAnnotation", memberid, timestamp, position, length, name;
  this.init = function(data) {
    memberid = data.memberid;
    timestamp = parseInt(data.timestamp, 10);
    position = parseInt(data.position, 10);
    length = parseInt(data.length, 10) || 0;
    name = data.name
  };
  this.transform = function(otherOp, hasPriority) {
    var otherOpspec = otherOp.spec(), otherOptype = otherOpspec.optype, end = position + length, result = [self];
    switch(otherOptype) {
      case optype:
        if(otherOpspec.position < position) {
          position += 1
        }else {
          if(otherOpspec.position === position && !hasPriority) {
            position += 1;
            result = null
          }
        }
        break;
      case "InsertText":
        if(otherOpspec.position <= position) {
          position += otherOpspec.text.length
        }else {
          if(otherOpspec.position <= end) {
            length += otherOpspec.text.length
          }
        }
        break;
      case "SplitParagraph":
        if(otherOpspec.position <= position) {
          position += 1
        }else {
          if(otherOpspec.position <= end) {
            length += 1
          }
        }
        break;
      case "InsertTable":
        result = null;
        break;
      case "RemoveText":
        if(otherOpspec.position + otherOpspec.length <= position) {
          position -= otherOpspec.length
        }else {
          if(otherOpspec.position < position) {
            position = otherOpspec.position
          }
        }
        break
    }
    return result
  };
  function createAnnotationNode(odtDocument, date) {
    var annotationNode, creatorNode, dateNode, listNode, listItemNode, paragraphNode, doc = odtDocument.getDOM();
    annotationNode = doc.createElementNS(odf.Namespaces.officens, "office:annotation");
    annotationNode.setAttributeNS(odf.Namespaces.officens, "office:name", name);
    creatorNode = doc.createElementNS(odf.Namespaces.dcns, "dc:creator");
    creatorNode.setAttributeNS(odf.Namespaces.webodfns + ":names:editinfo", "editinfo:memberid", memberid);
    dateNode = doc.createElementNS(odf.Namespaces.dcns, "dc:date");
    dateNode.appendChild(doc.createTextNode(date.toISOString()));
    listNode = doc.createElementNS(odf.Namespaces.textns, "text:list");
    listItemNode = doc.createElementNS(odf.Namespaces.textns, "text:list-item");
    paragraphNode = doc.createElementNS(odf.Namespaces.textns, "text:p");
    listItemNode.appendChild(paragraphNode);
    listNode.appendChild(listItemNode);
    annotationNode.appendChild(creatorNode);
    annotationNode.appendChild(dateNode);
    annotationNode.appendChild(listNode);
    return annotationNode
  }
  function createAnnotationEnd(odtDocument) {
    var annotationEnd, doc = odtDocument.getDOM();
    annotationEnd = doc.createElementNS(odf.Namespaces.officens, "office:annotation-end");
    annotationEnd.setAttributeNS(odf.Namespaces.officens, "office:name", name);
    return annotationEnd
  }
  function insertNodeAtPosition(odtDocument, node, insertPosition) {
    var previousNode, parentNode, domPosition = odtDocument.getPositionInTextNode(insertPosition, memberid);
    if(domPosition) {
      previousNode = domPosition.textNode;
      parentNode = previousNode.parentNode;
      if(domPosition.offset !== previousNode.length) {
        previousNode.splitText(domPosition.offset)
      }
      parentNode.insertBefore(node, previousNode.nextSibling);
      if(previousNode.length === 0) {
        parentNode.removeChild(previousNode)
      }
    }
  }
  function countSteps(number, stepCounter, positionFilter) {
    if(number > 0) {
      return stepCounter.countForwardSteps(number, positionFilter)
    }
    if(number < 0) {
      return-stepCounter.countBackwardSteps(-number, positionFilter)
    }
    return 0
  }
  this.execute = function(odtDocument) {
    var annotation = {}, positionFilter = odtDocument.getPositionFilter(), cursor = odtDocument.getCursor(memberid), oldCursorPosition = odtDocument.getCursorPosition(memberid), lengthToMove = position - oldCursorPosition - 1, stepsToParagraph;
    annotation.node = createAnnotationNode(odtDocument, new Date(timestamp));
    if(!annotation.node) {
      return false
    }
    if(length) {
      annotation.end = createAnnotationEnd(odtDocument);
      if(!annotation.end) {
        return false
      }
      insertNodeAtPosition(odtDocument, annotation.end, position + length)
    }
    insertNodeAtPosition(odtDocument, annotation.node, position);
    if(cursor) {
      stepsToParagraph = countSteps(lengthToMove, cursor.getStepCounter(), positionFilter);
      cursor.move(stepsToParagraph);
      odtDocument.emit(ops.OdtDocument.signalCursorMoved, cursor)
    }
    odtDocument.getOdfCanvas().addAnnotation(annotation);
    return true
  };
  this.spec = function() {
    return{optype:optype, memberid:memberid, timestamp:timestamp, position:position, length:length, name:name}
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("odf.Namespaces");
runtime.loadClass("core.DomUtils");
ops.OpRemoveAnnotation = function OpRemoveAnnotation() {
  var memberid, timestamp, position, length, domUtils;
  this.init = function(data) {
    memberid = data.memberid;
    timestamp = data.timestamp;
    position = parseInt(data.position, 10);
    length = parseInt(data.length, 10);
    domUtils = new core.DomUtils
  };
  this.transform = function(otherOp, hasPriority) {
    return null
  };
  this.execute = function(odtDocument) {
    var iterator = odtDocument.getIteratorAtPosition(position), container = iterator.container(), annotationName, annotationNode = null, annotationEnd = null, cursors;
    while(!(container.namespaceURI === odf.Namespaces.officens && container.localName === "annotation")) {
      container = container.parentNode
    }
    if(container === null) {
      return false
    }
    annotationNode = container;
    annotationName = annotationNode.getAttributeNS(odf.Namespaces.officens, "name");
    if(annotationName) {
      annotationEnd = domUtils.getElementsByTagNameNS(odtDocument.getRootNode(), odf.Namespaces.officens, "annotation-end").filter(function(element) {
        return annotationName === element.getAttributeNS(odf.Namespaces.officens, "name")
      })[0] || null
    }
    odtDocument.getOdfCanvas().forgetAnnotations();
    cursors = domUtils.getElementsByTagNameNS(annotationNode, odf.Namespaces.webodfns + ":names:cursor", "cursor");
    while(cursors.length) {
      annotationNode.parentNode.insertBefore(cursors.pop(), annotationNode)
    }
    annotationNode.parentNode.removeChild(annotationNode);
    if(annotationEnd) {
      annotationEnd.parentNode.removeChild(annotationEnd)
    }
    odtDocument.fixCursorPositions();
    odtDocument.getOdfCanvas().refreshAnnotations();
    return true
  };
  this.spec = function() {
    return{optype:"RemoveAnnotation", memberid:memberid, timestamp:timestamp, position:position, length:length}
  }
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("ops.OpAddCursor");
runtime.loadClass("ops.OpApplyDirectStyling");
runtime.loadClass("ops.OpRemoveCursor");
runtime.loadClass("ops.OpMoveCursor");
runtime.loadClass("ops.OpInsertTable");
runtime.loadClass("ops.OpInsertText");
runtime.loadClass("ops.OpRemoveText");
runtime.loadClass("ops.OpSplitParagraph");
runtime.loadClass("ops.OpSetParagraphStyle");
runtime.loadClass("ops.OpUpdateParagraphStyle");
runtime.loadClass("ops.OpAddStyle");
runtime.loadClass("ops.OpRemoveStyle");
runtime.loadClass("ops.OpAddAnnotation");
runtime.loadClass("ops.OpRemoveAnnotation");
ops.OperationFactory = function OperationFactory() {
  var specs;
  this.register = function(specName, specConstructor) {
    specs[specName] = specConstructor
  };
  this.create = function(spec) {
    var op = null, specConstructor = specs[spec.optype];
    if(specConstructor) {
      op = specConstructor(spec);
      op.init(spec)
    }
    return op
  };
  function constructor(OperationType) {
    return function() {
      return new OperationType
    }
  }
  function init() {
    specs = {AddCursor:constructor(ops.OpAddCursor), ApplyDirectStyling:constructor(ops.OpApplyDirectStyling), InsertTable:constructor(ops.OpInsertTable), InsertText:constructor(ops.OpInsertText), RemoveText:constructor(ops.OpRemoveText), SplitParagraph:constructor(ops.OpSplitParagraph), SetParagraphStyle:constructor(ops.OpSetParagraphStyle), UpdateParagraphStyle:constructor(ops.OpUpdateParagraphStyle), AddStyle:constructor(ops.OpAddStyle), RemoveStyle:constructor(ops.OpRemoveStyle), MoveCursor:constructor(ops.OpMoveCursor), 
    RemoveCursor:constructor(ops.OpRemoveCursor), AddAnnotation:constructor(ops.OpAddAnnotation), RemoveAnnotation:constructor(ops.OpRemoveAnnotation)}
  }
  init()
};
runtime.loadClass("core.Cursor");
runtime.loadClass("core.DomUtils");
runtime.loadClass("core.PositionIterator");
runtime.loadClass("core.PositionFilter");
runtime.loadClass("core.LoopWatchDog");
runtime.loadClass("odf.OdfUtils");
gui.SelectionMover = function SelectionMover(cursor, rootNode) {
  var odfUtils, domUtils, positionIterator, cachedXOffset, timeoutHandle, FILTER_ACCEPT = core.PositionFilter.FilterResult.FILTER_ACCEPT;
  function getIteratorAtCursor() {
    positionIterator.setUnfilteredPosition(cursor.getNode(), 0);
    return positionIterator
  }
  function getMaximumNodePosition(node) {
    return node.nodeType === Node.TEXT_NODE ? node.textContent.length : node.childNodes.length
  }
  function getClientRect(clientRectangles, useRightEdge) {
    var rectangle, simplifiedRectangle = null;
    if(clientRectangles) {
      rectangle = useRightEdge ? clientRectangles[clientRectangles.length - 1] : clientRectangles[0]
    }
    if(rectangle) {
      simplifiedRectangle = {top:rectangle.top, left:useRightEdge ? rectangle.right : rectangle.left, bottom:rectangle.bottom}
    }
    return simplifiedRectangle
  }
  function getVisibleRect(container, offset, range, useRightEdge) {
    var rectangle, nodeType = container.nodeType;
    range.setStart(container, offset);
    range.collapse(!useRightEdge);
    rectangle = getClientRect(range.getClientRects(), useRightEdge === true);
    if(!rectangle && offset > 0) {
      range.setStart(container, offset - 1);
      range.setEnd(container, offset);
      rectangle = getClientRect(range.getClientRects(), true)
    }
    if(!rectangle) {
      if(nodeType === Node.ELEMENT_NODE && container.childNodes[offset - 1]) {
        rectangle = getVisibleRect(container, offset - 1, range, true)
      }else {
        if(container.nodeType === Node.TEXT_NODE && offset > 0) {
          rectangle = getVisibleRect(container, offset - 1, range, true)
        }else {
          if(container.previousSibling) {
            rectangle = getVisibleRect(container.previousSibling, getMaximumNodePosition(container.previousSibling), range, true)
          }else {
            if(container.parentNode && container.parentNode !== rootNode) {
              rectangle = getVisibleRect(container.parentNode, 0, range, false)
            }else {
              range.selectNode(rootNode);
              rectangle = getClientRect(range.getClientRects(), false)
            }
          }
        }
      }
    }
    runtime.assert(Boolean(rectangle), "No visible rectangle found");
    return(rectangle)
  }
  function doMove(steps, extend, move) {
    var left = steps, iterator = getIteratorAtCursor(), initialRect, range = (rootNode.ownerDocument.createRange()), selectionRange = cursor.getSelectedRange() ? cursor.getSelectedRange().cloneRange() : rootNode.ownerDocument.createRange(), newRect, horizontalMovement, o, c, isForwardSelection, window = runtime.getWindow();
    initialRect = getVisibleRect(iterator.container(), iterator.unfilteredDomOffset(), range);
    while(left > 0 && move()) {
      left -= 1
    }
    if(extend) {
      c = iterator.container();
      o = iterator.unfilteredDomOffset();
      if(selectionRange.comparePoint(c, o) === -1) {
        selectionRange.setStart(c, o);
        isForwardSelection = false
      }else {
        selectionRange.setEnd(c, o)
      }
    }else {
      selectionRange.setStart(iterator.container(), iterator.unfilteredDomOffset());
      selectionRange.collapse(true)
    }
    cursor.setSelectedRange(selectionRange, isForwardSelection);
    iterator = getIteratorAtCursor();
    newRect = getVisibleRect(iterator.container(), iterator.unfilteredDomOffset(), range);
    horizontalMovement = newRect.top === initialRect.top ? true : false;
    if(horizontalMovement || cachedXOffset === undefined) {
      cachedXOffset = newRect.left
    }
    window.clearTimeout(timeoutHandle);
    timeoutHandle = window.setTimeout(function() {
      cachedXOffset = undefined
    }, 2E3);
    range.detach();
    return steps - left
  }
  this.movePointForward = function(steps, extend) {
    return doMove(steps, extend, positionIterator.nextPosition)
  };
  this.movePointBackward = function(steps, extend) {
    return doMove(steps, extend, positionIterator.previousPosition)
  };
  function isPositionWalkable(filter) {
    var iterator = getIteratorAtCursor();
    if(filter.acceptPosition(iterator) === FILTER_ACCEPT) {
      return true
    }
    return false
  }
  function countForwardSteps(steps, filter) {
    var iterator = getIteratorAtCursor(), watch = new core.LoopWatchDog(1E3), stepCount = 0, count = 0;
    while(steps > 0 && iterator.nextPosition()) {
      stepCount += 1;
      watch.check();
      if(filter.acceptPosition(iterator) === FILTER_ACCEPT) {
        count += stepCount;
        stepCount = 0;
        steps -= 1
      }
    }
    return count
  }
  function convertForwardStepsBetweenFilters(steps, filter1, filter2) {
    var iterator = getIteratorAtCursor(), watch = new core.LoopWatchDog(1E3), stepCount = 0, count = 0;
    while(steps > 0 && iterator.nextPosition()) {
      watch.check();
      if(filter2.acceptPosition(iterator) === FILTER_ACCEPT) {
        stepCount += 1;
        if(filter1.acceptPosition(iterator) === FILTER_ACCEPT) {
          count += stepCount;
          stepCount = 0;
          steps -= 1
        }
      }
    }
    return count
  }
  function convertBackwardStepsBetweenFilters(steps, filter1, filter2) {
    var iterator = getIteratorAtCursor(), watch = new core.LoopWatchDog(1E3), stepCount = 0, count = 0;
    while(steps > 0 && iterator.previousPosition()) {
      watch.check();
      if(filter2.acceptPosition(iterator) === FILTER_ACCEPT) {
        stepCount += 1;
        if(filter1.acceptPosition(iterator) === FILTER_ACCEPT) {
          count += stepCount;
          stepCount = 0;
          steps -= 1
        }
      }
    }
    return count
  }
  function countBackwardSteps(steps, filter) {
    var iterator = getIteratorAtCursor(), watch = new core.LoopWatchDog(1E3), stepCount = 0, count = 0;
    while(steps > 0 && iterator.previousPosition()) {
      stepCount += 1;
      watch.check();
      if(filter.acceptPosition(iterator) === FILTER_ACCEPT) {
        count += stepCount;
        stepCount = 0;
        steps -= 1
      }
    }
    return count
  }
  function countStepsToValidPosition(filter) {
    var iterator = getIteratorAtCursor(), paragraphNode = odfUtils.getParagraphElement(iterator.getCurrentNode()), count;
    count = -countBackwardSteps(1, filter);
    if(count === 0 || paragraphNode && paragraphNode !== odfUtils.getParagraphElement(iterator.getCurrentNode())) {
      count = countForwardSteps(1, filter)
    }
    return count
  }
  function countLineSteps(filter, direction, iterator) {
    var c = iterator.container(), count = 0, bestContainer = null, bestOffset, bestXDiff = 10, xDiff, bestCount = 0, top, left, lastTop, rect, range = (rootNode.ownerDocument.createRange()), watch = new core.LoopWatchDog(1E3);
    rect = getVisibleRect(c, iterator.unfilteredDomOffset(), range);
    top = rect.top;
    if(cachedXOffset === undefined) {
      left = rect.left
    }else {
      left = cachedXOffset
    }
    lastTop = top;
    while((direction < 0 ? iterator.previousPosition() : iterator.nextPosition()) === true) {
      watch.check();
      if(filter.acceptPosition(iterator) === FILTER_ACCEPT) {
        count += 1;
        c = iterator.container();
        rect = getVisibleRect(c, iterator.unfilteredDomOffset(), range);
        if(rect.top !== top) {
          if(rect.top !== lastTop && lastTop !== top) {
            break
          }
          lastTop = rect.top;
          xDiff = Math.abs(left - rect.left);
          if(bestContainer === null || xDiff < bestXDiff) {
            bestContainer = c;
            bestOffset = iterator.unfilteredDomOffset();
            bestXDiff = xDiff;
            bestCount = count
          }
        }
      }
    }
    if(bestContainer !== null) {
      iterator.setUnfilteredPosition(bestContainer, (bestOffset));
      count = bestCount
    }else {
      count = 0
    }
    range.detach();
    return count
  }
  function countLinesSteps(lines, filter) {
    var iterator = getIteratorAtCursor(), stepCount = 0, count = 0, direction = lines < 0 ? -1 : 1;
    lines = Math.abs(lines);
    while(lines > 0) {
      stepCount += countLineSteps(filter, direction, iterator);
      if(stepCount === 0) {
        break
      }
      count += stepCount;
      lines -= 1
    }
    return count * direction
  }
  function countStepsToLineBoundary(direction, filter) {
    var fnNextPos, increment, lastRect, rect, onSameLine, iterator = getIteratorAtCursor(), paragraphNode = odfUtils.getParagraphElement(iterator.getCurrentNode()), count = 0, range = (rootNode.ownerDocument.createRange());
    if(direction < 0) {
      fnNextPos = iterator.previousPosition;
      increment = -1
    }else {
      fnNextPos = iterator.nextPosition;
      increment = 1
    }
    lastRect = getVisibleRect(iterator.container(), iterator.unfilteredDomOffset(), range);
    while(fnNextPos.call(iterator)) {
      if(filter.acceptPosition(iterator) === FILTER_ACCEPT) {
        if(odfUtils.getParagraphElement(iterator.getCurrentNode()) !== paragraphNode) {
          break
        }
        rect = getVisibleRect(iterator.container(), iterator.unfilteredDomOffset(), range);
        if(rect.bottom !== lastRect.bottom) {
          onSameLine = rect.top >= lastRect.top && rect.bottom < lastRect.bottom || rect.top <= lastRect.top && rect.bottom > lastRect.bottom;
          if(!onSameLine) {
            break
          }
        }
        count += increment;
        lastRect = rect
      }
    }
    range.detach();
    return count
  }
  function countStepsToPosition(targetNode, targetOffset, filter) {
    runtime.assert(targetNode !== null, "SelectionMover.countStepsToPosition called with element===null");
    var iterator = getIteratorAtCursor(), c = iterator.container(), o = iterator.unfilteredDomOffset(), steps = 0, watch = new core.LoopWatchDog(1E3), comparison;
    iterator.setUnfilteredPosition(targetNode, targetOffset);
    targetNode = iterator.container();
    runtime.assert(Boolean(targetNode), "SelectionMover.countStepsToPosition: positionIterator.container() returned null");
    targetOffset = iterator.unfilteredDomOffset();
    iterator.setUnfilteredPosition(c, o);
    comparison = domUtils.comparePoints(targetNode, targetOffset, iterator.container(), iterator.unfilteredDomOffset());
    if(comparison < 0) {
      while(iterator.nextPosition()) {
        watch.check();
        if(filter.acceptPosition(iterator) === FILTER_ACCEPT) {
          steps += 1
        }
        if(iterator.container() === targetNode) {
          if(iterator.unfilteredDomOffset() === targetOffset) {
            return steps
          }
        }
      }
    }else {
      if(comparison > 0) {
        while(iterator.previousPosition()) {
          watch.check();
          if(filter.acceptPosition(iterator) === FILTER_ACCEPT) {
            steps -= 1;
            if(domUtils.comparePoints(targetNode, targetOffset, iterator.container(), iterator.unfilteredDomOffset()) <= 0) {
              break
            }
          }
        }
      }
    }
    return steps
  }
  this.getStepCounter = function() {
    return{countForwardSteps:countForwardSteps, countBackwardSteps:countBackwardSteps, convertForwardStepsBetweenFilters:convertForwardStepsBetweenFilters, convertBackwardStepsBetweenFilters:convertBackwardStepsBetweenFilters, countLinesSteps:countLinesSteps, countStepsToLineBoundary:countStepsToLineBoundary, countStepsToPosition:countStepsToPosition, isPositionWalkable:isPositionWalkable, countStepsToValidPosition:countStepsToValidPosition}
  };
  function init() {
    odfUtils = new odf.OdfUtils;
    domUtils = new core.DomUtils;
    positionIterator = gui.SelectionMover.createPositionIterator(rootNode);
    var range = rootNode.ownerDocument.createRange();
    range.setStart(positionIterator.container(), positionIterator.unfilteredDomOffset());
    range.collapse(true);
    cursor.setSelectedRange(range)
  }
  init()
};
gui.SelectionMover.createPositionIterator = function(rootNode) {
  function CursorFilter() {
    this.acceptNode = function(node) {
      if(node.namespaceURI === "urn:webodf:names:cursor" || node.namespaceURI === "urn:webodf:names:editinfo") {
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    }
  }
  var filter = new CursorFilter;
  return new core.PositionIterator(rootNode, 5, filter, false)
};
(function() {
  return gui.SelectionMover
})();
/*

 Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("ops.OpAddCursor");
runtime.loadClass("ops.OpRemoveCursor");
runtime.loadClass("ops.OpMoveCursor");
runtime.loadClass("ops.OpInsertTable");
runtime.loadClass("ops.OpInsertText");
runtime.loadClass("ops.OpRemoveText");
runtime.loadClass("ops.OpSplitParagraph");
runtime.loadClass("ops.OpSetParagraphStyle");
runtime.loadClass("ops.OpAddStyle");
runtime.loadClass("ops.OpUpdateParagraphStyle");
runtime.loadClass("ops.OpRemoveStyle");
ops.OperationTransformer = function OperationTransformer() {
  var operationFactory;
  function transformOpVsOp(opA, opB) {
    var oldOpB, opATransformResult, opBTransformResult;
    runtime.log("Crosstransforming:");
    runtime.log(runtime.toJson(opA.spec()));
    runtime.log(runtime.toJson(opB.spec()));
    oldOpB = operationFactory.create(opB.spec());
    opBTransformResult = opB.transform(opA, true);
    opATransformResult = opA.transform(oldOpB, false);
    if(!opATransformResult || !opBTransformResult) {
      return null
    }
    return{opsA:opATransformResult, opsB:opBTransformResult}
  }
  function transformOpListVsOp(opsA, opB) {
    var b, transformResult, transformListResult, transformedOpsA = [], transformedOpsB = [];
    while(opsA.length > 0 && opB) {
      transformResult = transformOpVsOp(opsA.shift(), (opB));
      if(!transformResult) {
        return null
      }
      transformedOpsA = transformedOpsA.concat(transformResult.opsA);
      if(transformResult.opsB.length === 0) {
        transformedOpsA = transformedOpsA.concat(opsA);
        opB = null;
        break
      }
      if(transformResult.opsB.length > 1) {
        for(b = 0;b < transformResult.opsB.length - 1;b += 1) {
          transformListResult = transformOpListVsOp(opsA, transformResult.opsB[b]);
          if(!transformListResult) {
            return null
          }
          transformedOpsB = transformedOpsB.concat(transformListResult.opsB);
          opsA = transformListResult.opsA
        }
      }
      opB = transformResult.opsB.pop()
    }
    if(opB) {
      transformedOpsB.push(opB)
    }
    return{opsA:transformedOpsA, opsB:transformedOpsB}
  }
  this.setOperationFactory = function(f) {
    operationFactory = f
  };
  this.transform = function(opspecsA, opspecsB) {
    var c, s, opsA = [], clientOp, serverOp, transformResult, transformedOpsB = [];
    for(c = 0;c < opspecsA.length;c += 1) {
      clientOp = operationFactory.create(opspecsA[c]);
      if(!clientOp) {
        return null
      }
      opsA.push(clientOp)
    }
    for(s = 0;s < opspecsB.length;s += 1) {
      serverOp = operationFactory.create(opspecsB[s]);
      transformResult = transformOpListVsOp(opsA, serverOp);
      if(!transformResult) {
        return null
      }
      opsA = transformResult.opsA;
      transformedOpsB = transformedOpsB.concat(transformResult.opsB)
    }
    return{opsA:opsA, opsB:transformedOpsB}
  }
};
runtime.loadClass("core.Cursor");
runtime.loadClass("gui.SelectionMover");
ops.OdtCursor = function OdtCursor(memberId, odtDocument) {
  var self = this, selectionMover, cursor;
  this.removeFromOdtDocument = function() {
    cursor.remove()
  };
  this.move = function(number, extend) {
    var moved = 0;
    if(number > 0) {
      moved = selectionMover.movePointForward(number, extend)
    }else {
      if(number <= 0) {
        moved = -selectionMover.movePointBackward(-number, extend)
      }
    }
    self.handleUpdate();
    return moved
  };
  this.handleUpdate = function() {
  };
  this.getStepCounter = function() {
    return selectionMover.getStepCounter()
  };
  this.getMemberId = function() {
    return memberId
  };
  this.getNode = function() {
    return cursor.getNode()
  };
  this.getAnchorNode = function() {
    return cursor.getAnchorNode()
  };
  this.getSelectedRange = function() {
    return cursor.getSelectedRange()
  };
  this.getOdtDocument = function() {
    return odtDocument
  };
  function init() {
    cursor = new core.Cursor(odtDocument.getDOM(), memberId);
    selectionMover = new gui.SelectionMover(cursor, odtDocument.getRootNode())
  }
  init()
};
/*

 Copyright (C) 2012 KO GmbH <aditya.bhatt@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
ops.EditInfo = function EditInfo(container, odtDocument) {
  var editInfoNode, editHistory = {};
  function sortEdits() {
    var arr = [], memberid;
    for(memberid in editHistory) {
      if(editHistory.hasOwnProperty(memberid)) {
        arr.push({"memberid":memberid, "time":editHistory[memberid].time})
      }
    }
    arr.sort(function(a, b) {
      return a.time - b.time
    });
    return arr
  }
  this.getNode = function() {
    return editInfoNode
  };
  this.getOdtDocument = function() {
    return odtDocument
  };
  this.getEdits = function() {
    return editHistory
  };
  this.getSortedEdits = function() {
    return sortEdits()
  };
  this.addEdit = function(memberid, timestamp) {
    editHistory[memberid] = {time:timestamp}
  };
  this.clearEdits = function() {
    editHistory = {}
  };
  this.destroy = function(callback) {
    if(container.parentNode) {
      container.removeChild(editInfoNode)
    }
    callback()
  };
  function init() {
    var editInfons = "urn:webodf:names:editinfo", dom = odtDocument.getDOM();
    editInfoNode = dom.createElementNS(editInfons, "editinfo");
    container.insertBefore(editInfoNode, container.firstChild)
  }
  init()
};
gui.Avatar = function Avatar(parentElement, avatarInitiallyVisible) {
  var self = this, handle, image, pendingImageUrl, displayShown = "block", displayHidden = "none";
  this.setColor = function(color) {
    image.style.borderColor = color
  };
  this.setImageUrl = function(url) {
    if(self.isVisible()) {
      image.src = url
    }else {
      pendingImageUrl = url
    }
  };
  this.isVisible = function() {
    return handle.style.display === displayShown
  };
  this.show = function() {
    if(pendingImageUrl) {
      image.src = pendingImageUrl;
      pendingImageUrl = undefined
    }
    handle.style.display = displayShown
  };
  this.hide = function() {
    handle.style.display = displayHidden
  };
  this.markAsFocussed = function(isFocussed) {
    handle.className = isFocussed ? "active" : ""
  };
  this.destroy = function(callback) {
    parentElement.removeChild(handle);
    callback()
  };
  function init() {
    var document = (parentElement.ownerDocument), htmlns = document.documentElement.namespaceURI;
    handle = document.createElementNS(htmlns, "div");
    image = document.createElementNS(htmlns, "img");
    image.width = 64;
    image.height = 64;
    handle.appendChild(image);
    handle.style.width = "64px";
    handle.style.height = "70px";
    handle.style.position = "absolute";
    handle.style.top = "-80px";
    handle.style.left = "-34px";
    handle.style.display = avatarInitiallyVisible ? displayShown : displayHidden;
    parentElement.appendChild(handle)
  }
  init()
};
runtime.loadClass("gui.Avatar");
runtime.loadClass("ops.OdtCursor");
gui.Caret = function Caret(cursor, avatarInitiallyVisible, blinkOnRangeSelect) {
  var span, avatar, cursorNode, shouldBlink = false, blinking = false, blinkTimeout;
  function blink(reset) {
    if(!shouldBlink || !cursorNode.parentNode) {
      return
    }
    if(!blinking || reset) {
      if(reset && blinkTimeout !== undefined) {
        runtime.clearTimeout(blinkTimeout)
      }
      blinking = true;
      span.style.opacity = reset || span.style.opacity === "0" ? "1" : "0";
      blinkTimeout = runtime.setTimeout(function() {
        blinking = false;
        blink(false)
      }, 500)
    }
  }
  function getCaretClientRectWithMargin(caretElement, margin) {
    var caretRect = caretElement.getBoundingClientRect();
    return{left:caretRect.left - margin.left, top:caretRect.top - margin.top, right:caretRect.right + margin.right, bottom:caretRect.bottom + margin.bottom}
  }
  this.refreshCursorBlinking = function() {
    if(blinkOnRangeSelect || cursor.getSelectedRange().collapsed) {
      shouldBlink = true;
      blink(true)
    }else {
      shouldBlink = false;
      span.style.opacity = "0"
    }
  };
  this.setFocus = function() {
    shouldBlink = true;
    avatar.markAsFocussed(true);
    blink(true)
  };
  this.removeFocus = function() {
    shouldBlink = false;
    avatar.markAsFocussed(false);
    span.style.opacity = "1"
  };
  this.show = function() {
    span.style.visibility = "visible";
    avatar.markAsFocussed(true)
  };
  this.hide = function() {
    span.style.visibility = "hidden";
    avatar.markAsFocussed(false)
  };
  this.setAvatarImageUrl = function(url) {
    avatar.setImageUrl(url)
  };
  this.setColor = function(newColor) {
    span.style.borderColor = newColor;
    avatar.setColor(newColor)
  };
  this.getCursor = function() {
    return cursor
  };
  this.getFocusElement = function() {
    return span
  };
  this.toggleHandleVisibility = function() {
    if(avatar.isVisible()) {
      avatar.hide()
    }else {
      avatar.show()
    }
  };
  this.showHandle = function() {
    avatar.show()
  };
  this.hideHandle = function() {
    avatar.hide()
  };
  this.ensureVisible = function() {
    var canvasElement = cursor.getOdtDocument().getOdfCanvas().getElement(), canvasContainerElement = canvasElement.parentNode, caretRect, canvasContainerRect, horizontalMargin = canvasContainerElement.offsetWidth - canvasContainerElement.clientWidth + 5, verticalMargin = canvasContainerElement.offsetHeight - canvasContainerElement.clientHeight + 5;
    caretRect = getCaretClientRectWithMargin(span, {top:verticalMargin, left:horizontalMargin, bottom:verticalMargin, right:horizontalMargin});
    canvasContainerRect = canvasContainerElement.getBoundingClientRect();
    if(caretRect.top < canvasContainerRect.top) {
      canvasContainerElement.scrollTop -= canvasContainerRect.top - caretRect.top
    }else {
      if(caretRect.bottom > canvasContainerRect.bottom) {
        canvasContainerElement.scrollTop += caretRect.bottom - canvasContainerRect.bottom
      }
    }
    if(caretRect.left < canvasContainerRect.left) {
      canvasContainerElement.scrollLeft -= canvasContainerRect.left - caretRect.left
    }else {
      if(caretRect.right > canvasContainerRect.right) {
        canvasContainerElement.scrollLeft += caretRect.right - canvasContainerRect.right
      }
    }
  };
  this.destroy = function(callback) {
    avatar.destroy(function(err) {
      if(err) {
        callback(err)
      }else {
        cursorNode.removeChild(span);
        callback()
      }
    })
  };
  function init() {
    var dom = cursor.getOdtDocument().getDOM(), htmlns = dom.documentElement.namespaceURI;
    span = dom.createElementNS(htmlns, "span");
    cursorNode = cursor.getNode();
    cursorNode.appendChild(span);
    avatar = new gui.Avatar(cursorNode, avatarInitiallyVisible)
  }
  init()
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
gui.KeyboardHandler = function KeyboardHandler() {
  var modifier = gui.KeyboardHandler.Modifier, defaultBinding = null, bindings = {};
  function getModifiers(e) {
    var modifiers = modifier.None;
    if(e.metaKey) {
      modifiers |= modifier.Meta
    }
    if(e.ctrlKey) {
      modifiers |= modifier.Ctrl
    }
    if(e.altKey) {
      modifiers |= modifier.Alt
    }
    if(e.shiftKey) {
      modifiers |= modifier.Shift
    }
    return modifiers
  }
  function getKeyCombo(keyCode, modifiers) {
    if(!modifiers) {
      modifiers = modifier.None
    }
    return keyCode + ":" + modifiers
  }
  this.setDefault = function(callback) {
    defaultBinding = callback
  };
  this.bind = function(keyCode, modifiers, callback) {
    var keyCombo = getKeyCombo(keyCode, modifiers);
    runtime.assert(bindings.hasOwnProperty(keyCombo) === false, "tried to overwrite the callback handler of key combo: " + keyCombo);
    bindings[keyCombo] = callback
  };
  this.unbind = function(keyCode, modifiers) {
    var keyCombo = getKeyCombo(keyCode, modifiers);
    delete bindings[keyCombo]
  };
  this.reset = function() {
    defaultBinding = null;
    bindings = {}
  };
  this.handleEvent = function(e) {
    var keyCombo = getKeyCombo(e.keyCode, getModifiers(e)), callback = bindings[keyCombo], handled = false;
    if(callback) {
      handled = callback()
    }else {
      if(defaultBinding !== null) {
        handled = defaultBinding(e)
      }
    }
    if(handled) {
      if(e.preventDefault) {
        e.preventDefault()
      }else {
        e.returnValue = false
      }
    }
  }
};
gui.KeyboardHandler.Modifier = {None:0, Meta:1, Ctrl:2, Alt:4, Shift:8, MetaShift:9, CtrlShift:10, AltShift:12};
gui.KeyboardHandler.KeyCode = {Backspace:8, Tab:9, Clear:12, Enter:13, End:35, Home:36, Left:37, Up:38, Right:39, Down:40, Delete:46, A:65, B:66, C:67, D:68, E:69, F:70, G:71, H:72, I:73, J:74, K:75, L:76, M:77, N:78, O:79, P:80, Q:81, R:82, S:83, T:84, U:85, V:86, W:87, X:88, Y:89, Z:90};
(function() {
  return gui.KeyboardHandler
})();
/*

 Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("odf.Namespaces");
runtime.loadClass("xmldom.LSSerializer");
runtime.loadClass("odf.OdfNodeFilter");
runtime.loadClass("odf.TextSerializer");
gui.Clipboard = function Clipboard() {
  var xmlSerializer, textSerializer, filter;
  this.setDataFromRange = function(e, range) {
    var result = true, setDataResult, clipboard = e.clipboardData, window = runtime.getWindow(), document = range.startContainer.ownerDocument, fragmentContainer;
    if(!clipboard && window) {
      clipboard = window.clipboardData
    }
    if(clipboard) {
      fragmentContainer = document.createElement("span");
      fragmentContainer.appendChild(range.cloneContents());
      setDataResult = clipboard.setData("text/plain", textSerializer.writeToString(fragmentContainer));
      result = result && setDataResult;
      setDataResult = clipboard.setData("text/html", xmlSerializer.writeToString(fragmentContainer, odf.Namespaces.namespaceMap));
      result = result && setDataResult;
      e.preventDefault()
    }else {
      result = false
    }
    return result
  };
  function init() {
    xmlSerializer = new xmldom.LSSerializer;
    textSerializer = new odf.TextSerializer;
    filter = new odf.OdfNodeFilter;
    xmlSerializer.filter = filter;
    textSerializer.filter = filter
  }
  init()
};
/*

 Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("core.EventNotifier");
runtime.loadClass("ops.OpApplyDirectStyling");
runtime.loadClass("gui.StyleHelper");
gui.DirectTextStyler = function DirectTextStyler(session, inputMemberId) {
  var self = this, odtDocument = session.getOdtDocument(), styleHelper = new gui.StyleHelper(odtDocument.getFormatting()), eventNotifier = new core.EventNotifier([gui.DirectTextStyler.textStylingChanged]), isBoldValue = false, isItalicValue = false, hasUnderlineValue = false, hasStrikeThroughValue = false, fontSizeValue, fontNameValue;
  function get(obj, keys) {
    var i = 0, key = keys[i];
    while(key && obj) {
      obj = obj[key];
      i += 1;
      key = keys[i]
    }
    return keys.length === i ? obj : undefined
  }
  function getCommonValue(objArray, keys) {
    var value = get(objArray[0], keys);
    return objArray.every(function(obj) {
      return value === get(obj, keys)
    }) ? value : undefined
  }
  function updatedCachedValues() {
    var cursor = odtDocument.getCursor(inputMemberId), range = cursor && cursor.getSelectedRange(), currentSelectionStyles = range && styleHelper.getAppliedStyles(range), fontSize, diffMap;
    function noteChange(oldValue, newValue, id) {
      if(oldValue !== newValue) {
        if(diffMap === undefined) {
          diffMap = {}
        }
        diffMap[id] = newValue
      }
      return newValue
    }
    isBoldValue = noteChange(isBoldValue, range ? styleHelper.isBold(range) : false, "isBold");
    isItalicValue = noteChange(isItalicValue, range ? styleHelper.isItalic(range) : false, "isItalic");
    hasUnderlineValue = noteChange(hasUnderlineValue, range ? styleHelper.hasUnderline(range) : false, "hasUnderline");
    hasStrikeThroughValue = noteChange(hasStrikeThroughValue, range ? styleHelper.hasStrikeThrough(range) : false, "hasStrikeThrough");
    fontSize = currentSelectionStyles && getCommonValue(currentSelectionStyles, ["style:text-properties", "fo:font-size"]);
    fontSizeValue = noteChange(fontSizeValue, fontSize && parseFloat(fontSize), "fontSize");
    fontNameValue = noteChange(fontNameValue, currentSelectionStyles && getCommonValue(currentSelectionStyles, ["style:text-properties", "style:font-name"]), "fontName");
    if(diffMap) {
      eventNotifier.emit(gui.DirectTextStyler.textStylingChanged, diffMap)
    }
  }
  function onCursorAdded(cursor) {
    if(cursor.getMemberId() === inputMemberId) {
      updatedCachedValues()
    }
  }
  function onCursorRemoved(memberId) {
    if(memberId === inputMemberId) {
      updatedCachedValues()
    }
  }
  function onCursorMoved(cursor) {
    if(cursor.getMemberId() === inputMemberId) {
      updatedCachedValues()
    }
  }
  function onParagraphStyleModified() {
    updatedCachedValues()
  }
  function onParagraphChanged(args) {
    var cursor = odtDocument.getCursor(inputMemberId);
    if(cursor && odtDocument.getParagraphElement(cursor.getNode()) === args.paragraphElement) {
      updatedCachedValues()
    }
  }
  function toggle(predicate, toggleMethod) {
    var cursor = odtDocument.getCursor(inputMemberId);
    if(!cursor) {
      return false
    }
    toggleMethod(!predicate(cursor.getSelectedRange()));
    return true
  }
  function formatTextSelection(propertyName, propertyValue) {
    var selection = odtDocument.getCursorSelection(inputMemberId), op = new ops.OpApplyDirectStyling, properties = {};
    properties[propertyName] = propertyValue;
    op.init({memberid:inputMemberId, position:selection.position, length:selection.length, setProperties:{"style:text-properties":properties}});
    session.enqueue(op)
  }
  function setBold(checked) {
    var value = checked ? "bold" : "normal";
    formatTextSelection("fo:font-weight", value)
  }
  this.setBold = setBold;
  function setItalic(checked) {
    var value = checked ? "italic" : "normal";
    formatTextSelection("fo:font-style", value)
  }
  this.setItalic = setItalic;
  function setHasUnderline(checked) {
    var value = checked ? "solid" : "none";
    formatTextSelection("style:text-underline-style", value)
  }
  this.setHasUnderline = setHasUnderline;
  function setHasStrikethrough(checked) {
    var value = checked ? "solid" : "none";
    formatTextSelection("style:text-line-through-style", value)
  }
  this.setHasStrikethrough = setHasStrikethrough;
  function setFontSize(value) {
    formatTextSelection("fo:font-size", value + "pt")
  }
  this.setFontSize = setFontSize;
  function setFontName(value) {
    formatTextSelection("style:font-name", value)
  }
  this.setFontName = setFontName;
  this.toggleBold = toggle.bind(self, styleHelper.isBold, setBold);
  this.toggleItalic = toggle.bind(self, styleHelper.isItalic, setItalic);
  this.toggleUnderline = toggle.bind(self, styleHelper.hasUnderline, setHasUnderline);
  this.toggleStrikethrough = toggle.bind(self, styleHelper.hasStrikeThrough, setHasStrikethrough);
  this.isBold = function() {
    return isBoldValue
  };
  this.isItalic = function() {
    return isItalicValue
  };
  this.hasUnderline = function() {
    return hasUnderlineValue
  };
  this.hasStrikeThrough = function() {
    return hasStrikeThroughValue
  };
  this.fontSize = function() {
    return fontSizeValue
  };
  this.fontName = function() {
    return fontNameValue
  };
  this.subscribe = function(eventid, cb) {
    eventNotifier.subscribe(eventid, cb)
  };
  this.unsubscribe = function(eventid, cb) {
    eventNotifier.unsubscribe(eventid, cb)
  };
  this.destroy = function(callback) {
    odtDocument.unsubscribe(ops.OdtDocument.signalCursorAdded, onCursorAdded);
    odtDocument.unsubscribe(ops.OdtDocument.signalCursorRemoved, onCursorRemoved);
    odtDocument.unsubscribe(ops.OdtDocument.signalCursorMoved, onCursorMoved);
    odtDocument.unsubscribe(ops.OdtDocument.signalParagraphStyleModified, onParagraphStyleModified);
    odtDocument.unsubscribe(ops.OdtDocument.signalParagraphChanged, onParagraphChanged);
    callback()
  };
  function init() {
    odtDocument.subscribe(ops.OdtDocument.signalCursorAdded, onCursorAdded);
    odtDocument.subscribe(ops.OdtDocument.signalCursorRemoved, onCursorRemoved);
    odtDocument.subscribe(ops.OdtDocument.signalCursorMoved, onCursorMoved);
    odtDocument.subscribe(ops.OdtDocument.signalParagraphStyleModified, onParagraphStyleModified);
    odtDocument.subscribe(ops.OdtDocument.signalParagraphChanged, onParagraphChanged);
    updatedCachedValues()
  }
  init()
};
gui.DirectTextStyler.textStylingChanged = "textStyling/changed";
(function() {
  return gui.DirectTextStyler
})();
/*

 Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("core.EventNotifier");
runtime.loadClass("core.Utils");
runtime.loadClass("odf.OdfUtils");
runtime.loadClass("ops.OpAddStyle");
runtime.loadClass("ops.OpSetParagraphStyle");
runtime.loadClass("gui.StyleHelper");
gui.DirectParagraphStyler = function DirectParagraphStyler(session, inputMemberId, styleNameGenerator) {
  var odtDocument = session.getOdtDocument(), utils = new core.Utils, odfUtils = new odf.OdfUtils, styleHelper = new gui.StyleHelper(odtDocument.getFormatting()), eventNotifier = new core.EventNotifier([gui.DirectParagraphStyler.paragraphStylingChanged]), isAlignedLeftValue, isAlignedCenterValue, isAlignedRightValue, isAlignedJustifiedValue;
  function updatedCachedValues() {
    var cursor = odtDocument.getCursor(inputMemberId), range = cursor && cursor.getSelectedRange(), diffMap;
    function noteChange(oldValue, newValue, id) {
      if(oldValue !== newValue) {
        if(diffMap === undefined) {
          diffMap = {}
        }
        diffMap[id] = newValue
      }
      return newValue
    }
    isAlignedLeftValue = noteChange(isAlignedLeftValue, range ? styleHelper.isAlignedLeft(range) : false, "isAlignedLeft");
    isAlignedCenterValue = noteChange(isAlignedCenterValue, range ? styleHelper.isAlignedCenter(range) : false, "isAlignedCenter");
    isAlignedRightValue = noteChange(isAlignedRightValue, range ? styleHelper.isAlignedRight(range) : false, "isAlignedRight");
    isAlignedJustifiedValue = noteChange(isAlignedJustifiedValue, range ? styleHelper.isAlignedJustified(range) : false, "isAlignedJustified");
    if(diffMap) {
      eventNotifier.emit(gui.DirectParagraphStyler.paragraphStylingChanged, diffMap)
    }
  }
  function onCursorAdded(cursor) {
    if(cursor.getMemberId() === inputMemberId) {
      updatedCachedValues()
    }
  }
  function onCursorRemoved(memberId) {
    if(memberId === inputMemberId) {
      updatedCachedValues()
    }
  }
  function onCursorMoved(cursor) {
    if(cursor.getMemberId() === inputMemberId) {
      updatedCachedValues()
    }
  }
  function onParagraphStyleModified() {
    updatedCachedValues()
  }
  function onParagraphChanged(args) {
    var cursor = odtDocument.getCursor(inputMemberId);
    if(cursor && odtDocument.getParagraphElement(cursor.getNode()) === args.paragraphElement) {
      updatedCachedValues()
    }
  }
  this.isAlignedLeft = function() {
    return isAlignedLeftValue
  };
  this.isAlignedCenter = function() {
    return isAlignedCenterValue
  };
  this.isAlignedRight = function() {
    return isAlignedRightValue
  };
  this.isAlignedJustified = function() {
    return isAlignedJustifiedValue
  };
  function applyParagraphDirectStyling(applyDirectStyling) {
    var range = odtDocument.getCursor(inputMemberId).getSelectedRange(), position = odtDocument.getCursorPosition(inputMemberId), paragraphs = odfUtils.getParagraphElements(range), formatting = odtDocument.getFormatting();
    paragraphs.forEach(function(paragraph) {
      var paragraphStartPoint = position + odtDocument.getDistanceFromCursor(inputMemberId, paragraph, 0), paragraphStyleName = paragraph.getAttributeNS(odf.Namespaces.textns, "style-name"), newParagraphStyleName = styleNameGenerator.generateName(), opAddStyle, opSetParagraphStyle, paragraphProperties;
      paragraphStartPoint += 1;
      if(paragraphStyleName) {
        paragraphProperties = formatting.createDerivedStyleObject(paragraphStyleName, "paragraph", {})
      }
      paragraphProperties = applyDirectStyling(paragraphProperties || {});
      opAddStyle = new ops.OpAddStyle;
      opAddStyle.init({memberid:inputMemberId, styleName:newParagraphStyleName, styleFamily:"paragraph", isAutomaticStyle:true, setProperties:paragraphProperties});
      opSetParagraphStyle = new ops.OpSetParagraphStyle;
      opSetParagraphStyle.init({memberid:inputMemberId, styleName:newParagraphStyleName, position:paragraphStartPoint});
      session.enqueue(opAddStyle);
      session.enqueue(opSetParagraphStyle)
    })
  }
  function applySimpleParagraphDirectStyling(styleOverrides) {
    applyParagraphDirectStyling(function(paragraphStyle) {
      return utils.mergeObjects(paragraphStyle, styleOverrides)
    })
  }
  function alignParagraph(alignment) {
    applySimpleParagraphDirectStyling({"style:paragraph-properties":{"fo:text-align":alignment}})
  }
  this.alignParagraphLeft = function() {
    alignParagraph("left");
    return true
  };
  this.alignParagraphCenter = function() {
    alignParagraph("center");
    return true
  };
  this.alignParagraphRight = function() {
    alignParagraph("right");
    return true
  };
  this.alignParagraphJustified = function() {
    alignParagraph("justify");
    return true
  };
  function modifyParagraphIndent(direction, paragraphStyle) {
    var tabStopDistance = odtDocument.getFormatting().getDefaultTabStopDistance(), paragraphProperties = paragraphStyle["style:paragraph-properties"], indentValue = paragraphProperties && paragraphProperties["fo:margin-left"], indent = indentValue && odfUtils.parseLength(indentValue), newIndent;
    if(indent && indent.unit === tabStopDistance.unit) {
      newIndent = indent.value + direction * tabStopDistance.value + indent.unit
    }else {
      newIndent = direction * tabStopDistance.value + tabStopDistance.unit
    }
    return utils.mergeObjects(paragraphStyle, {"style:paragraph-properties":{"fo:margin-left":newIndent}})
  }
  this.indent = function() {
    applyParagraphDirectStyling(modifyParagraphIndent.bind(null, 1));
    return true
  };
  this.outdent = function() {
    applyParagraphDirectStyling(modifyParagraphIndent.bind(null, -1));
    return true
  };
  this.subscribe = function(eventid, cb) {
    eventNotifier.subscribe(eventid, cb)
  };
  this.unsubscribe = function(eventid, cb) {
    eventNotifier.unsubscribe(eventid, cb)
  };
  this.destroy = function(callback) {
    odtDocument.unsubscribe(ops.OdtDocument.signalCursorAdded, onCursorAdded);
    odtDocument.unsubscribe(ops.OdtDocument.signalCursorRemoved, onCursorRemoved);
    odtDocument.unsubscribe(ops.OdtDocument.signalCursorMoved, onCursorMoved);
    odtDocument.unsubscribe(ops.OdtDocument.signalParagraphStyleModified, onParagraphStyleModified);
    odtDocument.unsubscribe(ops.OdtDocument.signalParagraphChanged, onParagraphChanged);
    callback()
  };
  function init() {
    odtDocument.subscribe(ops.OdtDocument.signalCursorAdded, onCursorAdded);
    odtDocument.subscribe(ops.OdtDocument.signalCursorRemoved, onCursorRemoved);
    odtDocument.subscribe(ops.OdtDocument.signalCursorMoved, onCursorMoved);
    odtDocument.subscribe(ops.OdtDocument.signalParagraphStyleModified, onParagraphStyleModified);
    odtDocument.subscribe(ops.OdtDocument.signalParagraphChanged, onParagraphChanged);
    updatedCachedValues()
  }
  init()
};
gui.DirectParagraphStyler.paragraphStylingChanged = "paragraphStyling/changed";
(function() {
  return gui.DirectParagraphStyler
})();
/*

 Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
gui.TextManipulator = function TextManipulator(session, inputMemberId) {
  var odtDocument = session.getOdtDocument();
  function createOpRemoveSelection(selection) {
    var op = new ops.OpRemoveText;
    op.init({memberid:inputMemberId, position:selection.position, length:selection.length});
    return op
  }
  function toForwardSelection(selection) {
    if(selection.length < 0) {
      selection.position += selection.length;
      selection.length = -selection.length
    }
    return selection
  }
  this.enqueueParagraphSplittingOps = function() {
    var selection = toForwardSelection(odtDocument.getCursorSelection(inputMemberId)), op;
    if(selection.length > 0) {
      op = createOpRemoveSelection(selection);
      session.enqueue(op)
    }
    op = new ops.OpSplitParagraph;
    op.init({memberid:inputMemberId, position:selection.position});
    session.enqueue(op);
    return true
  };
  this.removeTextByBackspaceKey = function() {
    var selection = toForwardSelection(odtDocument.getCursorSelection(inputMemberId)), op = null;
    if(selection.length === 0) {
      if(selection.position > 0 && odtDocument.getPositionInTextNode(selection.position - 1)) {
        op = new ops.OpRemoveText;
        op.init({memberid:inputMemberId, position:selection.position - 1, length:1});
        session.enqueue(op)
      }
    }else {
      op = createOpRemoveSelection(selection);
      session.enqueue(op)
    }
    return op !== null
  };
  this.removeTextByDeleteKey = function() {
    var selection = toForwardSelection(odtDocument.getCursorSelection(inputMemberId)), op = null;
    if(selection.length === 0) {
      if(odtDocument.getPositionInTextNode(selection.position + 1)) {
        op = new ops.OpRemoveText;
        op.init({memberid:inputMemberId, position:selection.position, length:1});
        session.enqueue(op)
      }
    }else {
      op = createOpRemoveSelection(selection);
      session.enqueue(op)
    }
    return op !== null
  };
  this.removeCurrentSelection = function() {
    var selection = toForwardSelection(odtDocument.getCursorSelection(inputMemberId)), op;
    if(selection.length !== 0) {
      op = createOpRemoveSelection(selection);
      session.enqueue(op)
    }
    return true
  };
  function insertText(text) {
    var selection = toForwardSelection(odtDocument.getCursorSelection(inputMemberId)), op = null;
    if(selection.length > 0) {
      op = createOpRemoveSelection(selection);
      session.enqueue(op)
    }
    op = new ops.OpInsertText;
    op.init({memberid:inputMemberId, position:selection.position, text:text});
    session.enqueue(op)
  }
  this.insertText = insertText
};
(function() {
  return gui.TextManipulator
})();
runtime.loadClass("core.DomUtils");
runtime.loadClass("core.Utils");
runtime.loadClass("odf.OdfUtils");
runtime.loadClass("ops.OpAddCursor");
runtime.loadClass("ops.OpRemoveCursor");
runtime.loadClass("ops.OpMoveCursor");
runtime.loadClass("ops.OpInsertText");
runtime.loadClass("ops.OpRemoveText");
runtime.loadClass("ops.OpSplitParagraph");
runtime.loadClass("ops.OpSetParagraphStyle");
runtime.loadClass("ops.OpRemoveAnnotation");
runtime.loadClass("gui.Clipboard");
runtime.loadClass("gui.KeyboardHandler");
runtime.loadClass("gui.DirectTextStyler");
runtime.loadClass("gui.DirectParagraphStyler");
runtime.loadClass("gui.TextManipulator");
gui.SessionController = function() {
  var FILTER_ACCEPT = core.PositionFilter.FilterResult.FILTER_ACCEPT;
  gui.SessionController = function SessionController(session, inputMemberId, args) {
    var window = (runtime.getWindow()), odtDocument = session.getOdtDocument(), utils = new core.Utils, domUtils = new core.DomUtils, odfUtils = new odf.OdfUtils, clipboard = new gui.Clipboard, keyDownHandler = new gui.KeyboardHandler, keyPressHandler = new gui.KeyboardHandler, keyboardMovementsFilter = new core.PositionFilterChain, baseFilter = odtDocument.getPositionFilter(), clickStartedWithinContainer = false, styleNameGenerator = new odf.StyleNameGenerator("auto" + utils.hashString(inputMemberId) + 
    "_", odtDocument.getFormatting()), undoManager = null, textManipulator = new gui.TextManipulator(session, inputMemberId), directTextStyler = args && args.directStylingEnabled ? new gui.DirectTextStyler(session, inputMemberId) : null, directParagraphStyler = args && args.directStylingEnabled ? new gui.DirectParagraphStyler(session, inputMemberId, styleNameGenerator) : null;
    runtime.assert(window !== null, "Expected to be run in an environment which has a global window, like a browser.");
    keyboardMovementsFilter.addFilter("BaseFilter", baseFilter);
    keyboardMovementsFilter.addFilter("RootFilter", odtDocument.createRootFilter(inputMemberId));
    function listenEvent(eventTarget, eventType, eventHandler, includeDirect) {
      var onVariant = "on" + eventType, bound = false;
      if(eventTarget.attachEvent) {
        bound = eventTarget.attachEvent(onVariant, eventHandler)
      }
      if(!bound && eventTarget.addEventListener) {
        eventTarget.addEventListener(eventType, eventHandler, false);
        bound = true
      }
      if((!bound || includeDirect) && eventTarget.hasOwnProperty(onVariant)) {
        eventTarget[onVariant] = eventHandler
      }
    }
    function removeEvent(eventTarget, eventType, eventHandler) {
      var onVariant = "on" + eventType;
      if(eventTarget.detachEvent) {
        eventTarget.detachEvent(onVariant, eventHandler)
      }
      if(eventTarget.removeEventListener) {
        eventTarget.removeEventListener(eventType, eventHandler, false)
      }
      if(eventTarget[onVariant] === eventHandler) {
        eventTarget[onVariant] = null
      }
    }
    function cancelEvent(event) {
      if(event.preventDefault) {
        event.preventDefault()
      }else {
        event.returnValue = false
      }
    }
    function dummyHandler(e) {
      cancelEvent(e)
    }
    function createOpMoveCursor(position, length) {
      var op = new ops.OpMoveCursor;
      op.init({memberid:inputMemberId, position:position, length:length || 0});
      return op
    }
    function countStepsToNode(targetNode, targetOffset) {
      var iterator = gui.SelectionMover.createPositionIterator(odtDocument.getRootNode()), canvasElement = odtDocument.getOdfCanvas().getElement(), node;
      node = targetNode;
      if(!node) {
        return null
      }
      while(node !== canvasElement) {
        if(node.namespaceURI === "urn:webodf:names:cursor" && node.localName === "cursor" || node.namespaceURI === "urn:webodf:names:editinfo" && node.localName === "editinfo") {
          break
        }
        node = node.parentNode;
        if(!node) {
          return null
        }
      }
      if(node !== canvasElement && targetNode !== node) {
        targetNode = node.parentNode;
        targetOffset = Array.prototype.indexOf.call(targetNode.childNodes, node)
      }
      iterator.setUnfilteredPosition(targetNode, targetOffset);
      return odtDocument.getDistanceFromCursor(inputMemberId, iterator.container(), iterator.unfilteredDomOffset())
    }
    function caretPositionFromPoint(x, y) {
      var doc = odtDocument.getDOM(), result;
      if(doc.caretRangeFromPoint) {
        result = doc.caretRangeFromPoint(x, y);
        return{container:result.startContainer, offset:result.startOffset}
      }
      if(doc.caretPositionFromPoint) {
        result = doc.caretPositionFromPoint(x, y);
        return{container:result.offsetNode, offset:result.offset}
      }
      return null
    }
    function findClosestPosition(node) {
      var canvasElement = odtDocument.getOdfCanvas().getElement(), newNode = odtDocument.getRootNode(), newOffset = 0, beforeCanvas, iterator;
      beforeCanvas = canvasElement.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_PRECEDING;
      if(!beforeCanvas) {
        iterator = gui.SelectionMover.createPositionIterator(newNode);
        iterator.moveToEnd();
        newNode = iterator.container();
        newOffset = iterator.unfilteredDomOffset()
      }
      return{node:newNode, offset:newOffset}
    }
    function isTextSpan(node) {
      return node.namespaceURI === odf.Namespaces.textns && node.localName === "span"
    }
    function expandToWordBoundaries(selection) {
      var alphaNumeric = /[A-Za-z0-9]/, iterator = gui.SelectionMover.createPositionIterator(odtDocument.getRootNode()), isForwardSelection = domUtils.comparePoints(selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset) > 0, startPoint, endPoint, currentNode, c;
      if(isForwardSelection) {
        startPoint = {node:selection.anchorNode, offset:selection.anchorOffset};
        endPoint = {node:selection.focusNode, offset:selection.focusOffset}
      }else {
        startPoint = {node:selection.focusNode, offset:selection.focusOffset};
        endPoint = {node:selection.anchorNode, offset:selection.anchorOffset}
      }
      iterator.setUnfilteredPosition(startPoint.node, startPoint.offset);
      while(iterator.previousPosition()) {
        currentNode = iterator.getCurrentNode();
        if(currentNode.nodeType === Node.TEXT_NODE) {
          c = currentNode.data[iterator.unfilteredDomOffset()];
          if(!alphaNumeric.test(c)) {
            break
          }
        }else {
          if(!isTextSpan(currentNode)) {
            break
          }
        }
        startPoint.node = iterator.container();
        startPoint.offset = iterator.unfilteredDomOffset()
      }
      iterator.setUnfilteredPosition(endPoint.node, endPoint.offset);
      do {
        currentNode = iterator.getCurrentNode();
        if(currentNode.nodeType === Node.TEXT_NODE) {
          c = currentNode.data[iterator.unfilteredDomOffset()];
          if(!alphaNumeric.test(c)) {
            break
          }
        }else {
          if(!isTextSpan(currentNode)) {
            break
          }
        }
      }while(iterator.nextPosition());
      endPoint.node = iterator.container();
      endPoint.offset = iterator.unfilteredDomOffset();
      if(isForwardSelection) {
        selection.anchorNode = startPoint.node;
        selection.anchorOffset = startPoint.offset;
        selection.focusNode = endPoint.node;
        selection.focusOffset = endPoint.offset
      }else {
        selection.focusNode = startPoint.node;
        selection.focusOffset = startPoint.offset;
        selection.anchorNode = endPoint.node;
        selection.anchorOffset = endPoint.offset
      }
    }
    function expandToParagraphBoundaries(selection) {
      var anchorParagraph = odtDocument.getParagraphElement(selection.anchorNode), focusParagraph = odtDocument.getParagraphElement(selection.focusNode);
      if(anchorParagraph) {
        selection.anchorNode = anchorParagraph;
        selection.anchorOffset = 0
      }
      if(focusParagraph) {
        selection.focusNode = focusParagraph;
        selection.focusOffset = focusParagraph.childNodes.length
      }
    }
    function mutableSelection(selection) {
      return{anchorNode:selection.anchorNode, anchorOffset:selection.anchorOffset, focusNode:selection.focusNode, focusOffset:selection.focusOffset}
    }
    function getSelection(e) {
      var canvasElement = odtDocument.getOdfCanvas().getElement(), selection = mutableSelection(window.getSelection()), clickCount = e.detail, anchorNodeInsideCanvas, focusNodeInsideCanvas, caretPos, node;
      if(selection.anchorNode === null && selection.focusNode === null) {
        caretPos = caretPositionFromPoint(e.clientX, e.clientY);
        if(!caretPos) {
          return null
        }
        selection.anchorNode = (caretPos.container);
        selection.anchorOffset = caretPos.offset;
        selection.focusNode = selection.anchorNode;
        selection.focusOffset = selection.anchorOffset
      }
      runtime.assert(selection.anchorNode !== null && selection.focusNode !== null, "anchorNode is null or focusNode is null");
      anchorNodeInsideCanvas = domUtils.containsNode(canvasElement, selection.anchorNode);
      focusNodeInsideCanvas = domUtils.containsNode(canvasElement, selection.focusNode);
      if(!anchorNodeInsideCanvas && !focusNodeInsideCanvas) {
        return null
      }
      if(!anchorNodeInsideCanvas) {
        node = findClosestPosition(selection.anchorNode);
        selection.anchorNode = node.node;
        selection.anchorOffset = node.offset
      }
      if(!focusNodeInsideCanvas) {
        node = findClosestPosition(selection.focusNode);
        selection.focusNode = node.node;
        selection.focusOffset = node.offset
      }
      if(clickCount === 2) {
        expandToWordBoundaries(selection)
      }else {
        if(clickCount === 3) {
          expandToParagraphBoundaries(selection)
        }
      }
      canvasElement.focus();
      return selection
    }
    function getFirstWalkablePositionInNode(node) {
      var position = 0, iterator = gui.SelectionMover.createPositionIterator(odtDocument.getRootNode()), watch = new core.LoopWatchDog(1E3), inside = false;
      while(iterator.nextPosition()) {
        watch.check();
        inside = Boolean(node.compareDocumentPosition(iterator.container()) & Node.DOCUMENT_POSITION_CONTAINED_BY);
        if(baseFilter.acceptPosition(iterator) === FILTER_ACCEPT) {
          if(inside) {
            break
          }
          position += 1
        }
      }
      return position
    }
    function getWalkableNodeLength(node) {
      var length = 0, iterator = gui.SelectionMover.createPositionIterator(odtDocument.getRootNode()), inside = false;
      iterator.setUnfilteredPosition(node, 0);
      do {
        inside = Boolean(node.compareDocumentPosition(iterator.container()) & Node.DOCUMENT_POSITION_CONTAINED_BY);
        if(!inside && node !== iterator.container()) {
          break
        }
        if(baseFilter.acceptPosition(iterator) === FILTER_ACCEPT) {
          length += 1
        }
      }while(iterator.nextPosition());
      return length
    }
    function removeAnnotation(annotationNode) {
      var position, length, op;
      position = getFirstWalkablePositionInNode(annotationNode);
      length = getWalkableNodeLength(annotationNode);
      op = new ops.OpRemoveAnnotation;
      op.init({memberid:inputMemberId, position:position, length:length});
      session.enqueue(op)
    }
    function selectRange(e) {
      runtime.setTimeout(function() {
        var selection = getSelection(e), oldPosition, stepsToAnchor, stepsToFocus, op;
        if(selection === null) {
          return
        }
        stepsToAnchor = countStepsToNode(selection.anchorNode, selection.anchorOffset);
        if(selection.focusNode === selection.anchorNode && selection.focusOffset === selection.anchorOffset) {
          stepsToFocus = stepsToAnchor
        }else {
          stepsToFocus = countStepsToNode(selection.focusNode, selection.focusOffset)
        }
        if(stepsToFocus !== null && stepsToFocus !== 0 || stepsToAnchor !== null && stepsToAnchor !== 0) {
          oldPosition = odtDocument.getCursorPosition(inputMemberId);
          op = createOpMoveCursor(oldPosition + stepsToAnchor, stepsToFocus - stepsToAnchor);
          session.enqueue(op)
        }
      }, 0)
    }
    function handleContextMenu(e) {
      selectRange(e)
    }
    function extendCursorByAdjustment(lengthAdjust) {
      var selection = odtDocument.getCursorSelection(inputMemberId), stepCounter = odtDocument.getCursor(inputMemberId).getStepCounter(), newLength;
      if(lengthAdjust !== 0) {
        lengthAdjust = lengthAdjust > 0 ? stepCounter.convertForwardStepsBetweenFilters(lengthAdjust, keyboardMovementsFilter, baseFilter) : -stepCounter.convertBackwardStepsBetweenFilters(-lengthAdjust, keyboardMovementsFilter, baseFilter);
        newLength = selection.length + lengthAdjust;
        session.enqueue(createOpMoveCursor(selection.position, newLength))
      }
    }
    function moveCursorByAdjustment(positionAdjust) {
      var position = odtDocument.getCursorPosition(inputMemberId), stepCounter = odtDocument.getCursor(inputMemberId).getStepCounter();
      if(positionAdjust !== 0) {
        positionAdjust = positionAdjust > 0 ? stepCounter.convertForwardStepsBetweenFilters(positionAdjust, keyboardMovementsFilter, baseFilter) : -stepCounter.convertBackwardStepsBetweenFilters(-positionAdjust, keyboardMovementsFilter, baseFilter);
        position = position + positionAdjust;
        session.enqueue(createOpMoveCursor(position, 0))
      }
    }
    function moveCursorToLeft() {
      moveCursorByAdjustment(-1);
      return true
    }
    function moveCursorToRight() {
      moveCursorByAdjustment(1);
      return true
    }
    function extendSelectionToLeft() {
      extendCursorByAdjustment(-1);
      return true
    }
    function extendSelectionToRight() {
      extendCursorByAdjustment(1);
      return true
    }
    function moveCursorByLine(direction, extend) {
      var paragraphNode = odtDocument.getParagraphElement(odtDocument.getCursor(inputMemberId).getNode()), steps;
      runtime.assert(Boolean(paragraphNode), "SessionController: Cursor outside paragraph");
      steps = odtDocument.getCursor(inputMemberId).getStepCounter().countLinesSteps(direction, keyboardMovementsFilter);
      if(extend) {
        extendCursorByAdjustment(steps)
      }else {
        moveCursorByAdjustment(steps)
      }
    }
    function moveCursorUp() {
      moveCursorByLine(-1, false);
      return true
    }
    function moveCursorDown() {
      moveCursorByLine(1, false);
      return true
    }
    function extendSelectionUp() {
      moveCursorByLine(-1, true);
      return true
    }
    function extendSelectionDown() {
      moveCursorByLine(1, true);
      return true
    }
    function moveCursorToLineBoundary(direction, extend) {
      var steps = odtDocument.getCursor(inputMemberId).getStepCounter().countStepsToLineBoundary(direction, keyboardMovementsFilter);
      if(extend) {
        extendCursorByAdjustment(steps)
      }else {
        moveCursorByAdjustment(steps)
      }
    }
    function moveCursorToLineStart() {
      moveCursorToLineBoundary(-1, false);
      return true
    }
    function moveCursorToLineEnd() {
      moveCursorToLineBoundary(1, false);
      return true
    }
    function extendSelectionToLineStart() {
      moveCursorToLineBoundary(-1, true);
      return true
    }
    function extendSelectionToLineEnd() {
      moveCursorToLineBoundary(1, true);
      return true
    }
    function extendSelectionToParagraphStart() {
      var paragraphNode = odtDocument.getParagraphElement(odtDocument.getCursor(inputMemberId).getNode()), iterator, node, steps;
      runtime.assert(Boolean(paragraphNode), "SessionController: Cursor outside paragraph");
      steps = odtDocument.getDistanceFromCursor(inputMemberId, paragraphNode, 0);
      iterator = gui.SelectionMover.createPositionIterator(odtDocument.getRootNode());
      iterator.setUnfilteredPosition(paragraphNode, 0);
      while(steps === 0 && iterator.previousPosition()) {
        node = iterator.getCurrentNode();
        if(odfUtils.isParagraph(node)) {
          steps = odtDocument.getDistanceFromCursor(inputMemberId, node, 0)
        }
      }
      extendCursorByAdjustment(steps);
      return true
    }
    function extendSelectionToParagraphEnd() {
      var paragraphNode = odtDocument.getParagraphElement(odtDocument.getCursor(inputMemberId).getNode()), iterator, node, steps;
      runtime.assert(Boolean(paragraphNode), "SessionController: Cursor outside paragraph");
      iterator = gui.SelectionMover.createPositionIterator(odtDocument.getRootNode());
      iterator.moveToEndOfNode(paragraphNode);
      steps = odtDocument.getDistanceFromCursor(inputMemberId, iterator.container(), iterator.unfilteredDomOffset());
      while(steps === 0 && iterator.nextPosition()) {
        node = iterator.getCurrentNode();
        if(odfUtils.isParagraph(node)) {
          iterator.moveToEndOfNode(node);
          steps = odtDocument.getDistanceFromCursor(inputMemberId, iterator.container(), iterator.unfilteredDomOffset())
        }
      }
      extendCursorByAdjustment(steps);
      return true
    }
    function moveCursorToDocumentBoundary(direction, extend) {
      var iterator = gui.SelectionMover.createPositionIterator(odtDocument.getRootNode()), steps;
      if(direction > 0) {
        iterator.moveToEnd()
      }
      steps = odtDocument.getDistanceFromCursor(inputMemberId, iterator.container(), iterator.unfilteredDomOffset());
      if(extend) {
        extendCursorByAdjustment(steps)
      }else {
        moveCursorByAdjustment(steps)
      }
    }
    function moveCursorToDocumentStart() {
      moveCursorToDocumentBoundary(-1, false);
      return true
    }
    function moveCursorToDocumentEnd() {
      moveCursorToDocumentBoundary(1, false);
      return true
    }
    function extendSelectionToDocumentStart() {
      moveCursorToDocumentBoundary(-1, true);
      return true
    }
    function extendSelectionToDocumentEnd() {
      moveCursorToDocumentBoundary(1, true);
      return true
    }
    function extendSelectionToEntireDocument() {
      var iterator = gui.SelectionMover.createPositionIterator(odtDocument.getRootNode()), steps;
      steps = -odtDocument.getDistanceFromCursor(inputMemberId, iterator.container(), iterator.unfilteredDomOffset());
      iterator.moveToEnd();
      steps += odtDocument.getDistanceFromCursor(inputMemberId, iterator.container(), iterator.unfilteredDomOffset());
      session.enqueue(createOpMoveCursor(0, steps));
      return true
    }
    function maintainCursorSelection() {
      var cursor = odtDocument.getCursor(inputMemberId), selection = window.getSelection();
      if(cursor) {
        selection.removeAllRanges();
        selection.addRange(cursor.getSelectedRange().cloneRange())
      }
    }
    function stringFromKeyPress(event) {
      if(event.which === null) {
        return String.fromCharCode(event.keyCode)
      }
      if(event.which !== 0 && event.charCode !== 0) {
        return String.fromCharCode(event.which)
      }
      return null
    }
    function handleCut(e) {
      var cursor = odtDocument.getCursor(inputMemberId), selectedRange = cursor.getSelectedRange();
      if(selectedRange.collapsed) {
        return
      }
      if(clipboard.setDataFromRange(e, cursor.getSelectedRange())) {
        textManipulator.removeCurrentSelection()
      }else {
        runtime.log("Cut operation failed")
      }
    }
    function handleBeforeCut() {
      var cursor = odtDocument.getCursor(inputMemberId), selectedRange = cursor.getSelectedRange();
      return selectedRange.collapsed !== false
    }
    function handleCopy(e) {
      var cursor = odtDocument.getCursor(inputMemberId), selectedRange = cursor.getSelectedRange();
      if(selectedRange.collapsed) {
        return
      }
      if(!clipboard.setDataFromRange(e, cursor.getSelectedRange())) {
        runtime.log("Cut operation failed")
      }
    }
    function handlePaste(e) {
      var plainText;
      if(window.clipboardData && window.clipboardData.getData) {
        plainText = window.clipboardData.getData("Text")
      }else {
        if(e.clipboardData && e.clipboardData.getData) {
          plainText = e.clipboardData.getData("text/plain")
        }
      }
      if(plainText) {
        textManipulator.insertText(plainText);
        cancelEvent(e)
      }
    }
    function handleBeforePaste() {
      return false
    }
    function updateUndoStack(op) {
      if(undoManager) {
        undoManager.onOperationExecuted(op)
      }
    }
    function forwardUndoStackChange(e) {
      odtDocument.emit(ops.OdtDocument.signalUndoStackChanged, e)
    }
    function undo() {
      if(undoManager) {
        undoManager.moveBackward(1);
        maintainCursorSelection();
        return true
      }
      return false
    }
    function redo() {
      if(undoManager) {
        undoManager.moveForward(1);
        maintainCursorSelection();
        return true
      }
      return false
    }
    function filterMouseClicks(e) {
      clickStartedWithinContainer = e.target && domUtils.containsNode(odtDocument.getOdfCanvas().getElement(), e.target)
    }
    function handleMouseUp(event) {
      var target = event.target, annotationNode = null;
      if(target.className === "annotationRemoveButton") {
        annotationNode = domUtils.getElementsByTagNameNS(target.parentNode, odf.Namespaces.officens, "annotation")[0];
        removeAnnotation(annotationNode)
      }else {
        if(clickStartedWithinContainer) {
          selectRange(event)
        }
      }
    }
    this.startEditing = function() {
      var canvasElement, op;
      canvasElement = odtDocument.getOdfCanvas().getElement();
      listenEvent(canvasElement, "keydown", keyDownHandler.handleEvent);
      listenEvent(canvasElement, "keypress", keyPressHandler.handleEvent);
      listenEvent(canvasElement, "keyup", dummyHandler);
      listenEvent(canvasElement, "beforecut", handleBeforeCut, true);
      listenEvent(canvasElement, "cut", handleCut);
      listenEvent(canvasElement, "copy", handleCopy);
      listenEvent(canvasElement, "beforepaste", handleBeforePaste, true);
      listenEvent(canvasElement, "paste", handlePaste);
      listenEvent(window, "mousedown", filterMouseClicks);
      listenEvent(window, "mouseup", handleMouseUp);
      listenEvent(canvasElement, "contextmenu", handleContextMenu);
      odtDocument.subscribe(ops.OdtDocument.signalOperationExecuted, maintainCursorSelection);
      odtDocument.subscribe(ops.OdtDocument.signalOperationExecuted, updateUndoStack);
      op = new ops.OpAddCursor;
      op.init({memberid:inputMemberId});
      session.enqueue(op);
      if(undoManager) {
        undoManager.saveInitialState()
      }
    };
    this.endEditing = function() {
      var canvasElement, op;
      odtDocument.unsubscribe(ops.OdtDocument.signalOperationExecuted, updateUndoStack);
      odtDocument.unsubscribe(ops.OdtDocument.signalOperationExecuted, maintainCursorSelection);
      canvasElement = odtDocument.getOdfCanvas().getElement();
      removeEvent(canvasElement, "keydown", keyDownHandler.handleEvent);
      removeEvent(canvasElement, "keypress", keyPressHandler.handleEvent);
      removeEvent(canvasElement, "keyup", dummyHandler);
      removeEvent(canvasElement, "cut", handleCut);
      removeEvent(canvasElement, "beforecut", handleBeforeCut);
      removeEvent(canvasElement, "copy", handleCopy);
      removeEvent(canvasElement, "paste", handlePaste);
      removeEvent(canvasElement, "beforepaste", handleBeforePaste);
      removeEvent(window, "mousedown", filterMouseClicks);
      removeEvent(window, "mouseup", handleMouseUp);
      removeEvent(canvasElement, "contextmenu", handleContextMenu);
      op = new ops.OpRemoveCursor;
      op.init({memberid:inputMemberId});
      session.enqueue(op);
      if(undoManager) {
        undoManager.resetInitialState()
      }
    };
    this.getInputMemberId = function() {
      return inputMemberId
    };
    this.getSession = function() {
      return session
    };
    this.setUndoManager = function(manager) {
      if(undoManager) {
        undoManager.unsubscribe(gui.UndoManager.signalUndoStackChanged, forwardUndoStackChange)
      }
      undoManager = manager;
      if(undoManager) {
        undoManager.setOdtDocument(odtDocument);
        undoManager.setPlaybackFunction(function(op) {
          op.execute(odtDocument)
        });
        undoManager.subscribe(gui.UndoManager.signalUndoStackChanged, forwardUndoStackChange)
      }
    };
    this.getUndoManager = function() {
      return undoManager
    };
    this.getDirectTextStyler = function() {
      return directTextStyler
    };
    this.getDirectParagraphStyler = function() {
      return directParagraphStyler
    };
    this.getTextManipulator = function() {
      return textManipulator
    };
    this.destroy = function(callback) {
      var destroyDirectTextStyler = directTextStyler ? directTextStyler.destroy : function(cb) {
        cb()
      }, destroyDirectParagraphStyler = directParagraphStyler ? directParagraphStyler.destroy : function(cb) {
        cb()
      };
      destroyDirectTextStyler(function(err) {
        if(err) {
          callback(err)
        }else {
          destroyDirectParagraphStyler(callback)
        }
      })
    };
    function init() {
      var isMacOS = window.navigator.appVersion.toLowerCase().indexOf("mac") !== -1, modifier = gui.KeyboardHandler.Modifier, keyCode = gui.KeyboardHandler.KeyCode;
      keyDownHandler.bind(keyCode.Tab, modifier.None, function() {
        textManipulator.insertText("\t");
        return true
      });
      keyDownHandler.bind(keyCode.Left, modifier.None, moveCursorToLeft);
      keyDownHandler.bind(keyCode.Right, modifier.None, moveCursorToRight);
      keyDownHandler.bind(keyCode.Up, modifier.None, moveCursorUp);
      keyDownHandler.bind(keyCode.Down, modifier.None, moveCursorDown);
      keyDownHandler.bind(keyCode.Backspace, modifier.None, textManipulator.removeTextByBackspaceKey);
      keyDownHandler.bind(keyCode.Delete, modifier.None, textManipulator.removeTextByDeleteKey);
      keyDownHandler.bind(keyCode.Left, modifier.Shift, extendSelectionToLeft);
      keyDownHandler.bind(keyCode.Right, modifier.Shift, extendSelectionToRight);
      keyDownHandler.bind(keyCode.Up, modifier.Shift, extendSelectionUp);
      keyDownHandler.bind(keyCode.Down, modifier.Shift, extendSelectionDown);
      keyDownHandler.bind(keyCode.Home, modifier.None, moveCursorToLineStart);
      keyDownHandler.bind(keyCode.End, modifier.None, moveCursorToLineEnd);
      keyDownHandler.bind(keyCode.Home, modifier.Ctrl, moveCursorToDocumentStart);
      keyDownHandler.bind(keyCode.End, modifier.Ctrl, moveCursorToDocumentEnd);
      keyDownHandler.bind(keyCode.Home, modifier.Shift, extendSelectionToLineStart);
      keyDownHandler.bind(keyCode.End, modifier.Shift, extendSelectionToLineEnd);
      keyDownHandler.bind(keyCode.Up, modifier.CtrlShift, extendSelectionToParagraphStart);
      keyDownHandler.bind(keyCode.Down, modifier.CtrlShift, extendSelectionToParagraphEnd);
      keyDownHandler.bind(keyCode.Home, modifier.CtrlShift, extendSelectionToDocumentStart);
      keyDownHandler.bind(keyCode.End, modifier.CtrlShift, extendSelectionToDocumentEnd);
      if(isMacOS) {
        keyDownHandler.bind(keyCode.Clear, modifier.None, textManipulator.removeCurrentSelection);
        keyDownHandler.bind(keyCode.Left, modifier.Meta, moveCursorToLineStart);
        keyDownHandler.bind(keyCode.Right, modifier.Meta, moveCursorToLineEnd);
        keyDownHandler.bind(keyCode.Home, modifier.Meta, moveCursorToDocumentStart);
        keyDownHandler.bind(keyCode.End, modifier.Meta, moveCursorToDocumentEnd);
        keyDownHandler.bind(keyCode.Left, modifier.MetaShift, extendSelectionToLineStart);
        keyDownHandler.bind(keyCode.Right, modifier.MetaShift, extendSelectionToLineEnd);
        keyDownHandler.bind(keyCode.Up, modifier.AltShift, extendSelectionToParagraphStart);
        keyDownHandler.bind(keyCode.Down, modifier.AltShift, extendSelectionToParagraphEnd);
        keyDownHandler.bind(keyCode.Up, modifier.MetaShift, extendSelectionToDocumentStart);
        keyDownHandler.bind(keyCode.Down, modifier.MetaShift, extendSelectionToDocumentEnd);
        keyDownHandler.bind(keyCode.A, modifier.Meta, extendSelectionToEntireDocument);
        if(directTextStyler) {
          keyDownHandler.bind(keyCode.B, modifier.Meta, directTextStyler.toggleBold);
          keyDownHandler.bind(keyCode.I, modifier.Meta, directTextStyler.toggleItalic);
          keyDownHandler.bind(keyCode.U, modifier.Meta, directTextStyler.toggleUnderline)
        }
        if(directParagraphStyler) {
          keyDownHandler.bind(keyCode.L, modifier.MetaShift, directParagraphStyler.alignParagraphLeft);
          keyDownHandler.bind(keyCode.E, modifier.MetaShift, directParagraphStyler.alignParagraphCenter);
          keyDownHandler.bind(keyCode.R, modifier.MetaShift, directParagraphStyler.alignParagraphRight);
          keyDownHandler.bind(keyCode.J, modifier.MetaShift, directParagraphStyler.alignParagraphJustified)
        }
        keyDownHandler.bind(keyCode.Z, modifier.Meta, undo);
        keyDownHandler.bind(keyCode.Z, modifier.MetaShift, redo)
      }else {
        keyDownHandler.bind(keyCode.A, modifier.Ctrl, extendSelectionToEntireDocument);
        if(directTextStyler) {
          keyDownHandler.bind(keyCode.B, modifier.Ctrl, directTextStyler.toggleBold);
          keyDownHandler.bind(keyCode.I, modifier.Ctrl, directTextStyler.toggleItalic);
          keyDownHandler.bind(keyCode.U, modifier.Ctrl, directTextStyler.toggleUnderline)
        }
        if(directParagraphStyler) {
          keyDownHandler.bind(keyCode.L, modifier.CtrlShift, directParagraphStyler.alignParagraphLeft);
          keyDownHandler.bind(keyCode.E, modifier.CtrlShift, directParagraphStyler.alignParagraphCenter);
          keyDownHandler.bind(keyCode.R, modifier.CtrlShift, directParagraphStyler.alignParagraphRight);
          keyDownHandler.bind(keyCode.J, modifier.CtrlShift, directParagraphStyler.alignParagraphJustified)
        }
        keyDownHandler.bind(keyCode.Z, modifier.Ctrl, undo);
        keyDownHandler.bind(keyCode.Z, modifier.CtrlShift, redo)
      }
      keyPressHandler.setDefault(function(e) {
        var text = stringFromKeyPress(e);
        if(text && !(e.altKey || e.ctrlKey || e.metaKey)) {
          textManipulator.insertText(text);
          return true
        }
        return false
      });
      keyPressHandler.bind(keyCode.Enter, modifier.None, textManipulator.enqueueParagraphSplittingOps)
    }
    init()
  };
  return gui.SessionController
}();
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
ops.MemberModel = function MemberModel() {
};
ops.MemberModel.prototype.getMemberDetailsAndUpdates = function(memberId, subscriber) {
};
ops.MemberModel.prototype.unsubscribeMemberDetailsUpdates = function(memberId, subscriber) {
};
ops.MemberModel.prototype.close = function(callback) {
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
ops.TrivialMemberModel = function TrivialMemberModel() {
  this.getMemberDetailsAndUpdates = function(memberId, subscriber) {
    subscriber(memberId, {memberid:memberId, fullname:"Unknown", color:"black", imageurl:"avatar-joe.png"})
  };
  this.unsubscribeMemberDetailsUpdates = function(memberId, subscriber) {
  };
  this.close = function(cb) {
    cb()
  }
};
/*

 Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
ops.OperationRouter = function OperationRouter() {
};
ops.OperationRouter.prototype.setOperationFactory = function(f) {
};
ops.OperationRouter.prototype.setPlaybackFunction = function(playback_func) {
};
ops.OperationRouter.prototype.push = function(op) {
};
ops.OperationRouter.prototype.close = function(callback) {
};
ops.OperationRouter.prototype.getHasLocalUnsyncedOpsAndUpdates = function(subscriber) {
};
ops.OperationRouter.prototype.unsubscribeHasLocalUnsyncedOpsUpdates = function(subscriber) {
};
/*

 Copyright (C) 2012 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
ops.TrivialOperationRouter = function TrivialOperationRouter() {
  var operationFactory, playbackFunction;
  this.setOperationFactory = function(f) {
    operationFactory = f
  };
  this.setPlaybackFunction = function(playback_func) {
    playbackFunction = playback_func
  };
  this.push = function(op) {
    var timedOp, opspec = op.spec();
    opspec.timestamp = (new Date).getTime();
    timedOp = operationFactory.create(opspec);
    playbackFunction(timedOp)
  };
  this.close = function(cb) {
    cb()
  };
  this.getHasLocalUnsyncedOpsAndUpdates = function(subscriber) {
    subscriber(true)
  };
  this.unsubscribeHasLocalUnsyncedOpsUpdates = function(subscriber) {
  }
};
gui.EditInfoHandle = function EditInfoHandle(parentElement) {
  var edits = [], handle, document = (parentElement.ownerDocument), htmlns = document.documentElement.namespaceURI, editinfons = "urn:webodf:names:editinfo";
  function renderEdits() {
    var i, infoDiv, colorSpan, authorSpan, timeSpan;
    handle.innerHTML = "";
    for(i = 0;i < edits.length;i += 1) {
      infoDiv = document.createElementNS(htmlns, "div");
      infoDiv.className = "editInfo";
      colorSpan = document.createElementNS(htmlns, "span");
      colorSpan.className = "editInfoColor";
      colorSpan.setAttributeNS(editinfons, "editinfo:memberid", edits[i].memberid);
      authorSpan = document.createElementNS(htmlns, "span");
      authorSpan.className = "editInfoAuthor";
      authorSpan.setAttributeNS(editinfons, "editinfo:memberid", edits[i].memberid);
      timeSpan = document.createElementNS(htmlns, "span");
      timeSpan.className = "editInfoTime";
      timeSpan.setAttributeNS(editinfons, "editinfo:memberid", edits[i].memberid);
      timeSpan.innerHTML = edits[i].time;
      infoDiv.appendChild(colorSpan);
      infoDiv.appendChild(authorSpan);
      infoDiv.appendChild(timeSpan);
      handle.appendChild(infoDiv)
    }
  }
  this.setEdits = function(editArray) {
    edits = editArray;
    renderEdits()
  };
  this.show = function() {
    handle.style.display = "block"
  };
  this.hide = function() {
    handle.style.display = "none"
  };
  this.destroy = function(callback) {
    parentElement.removeChild(handle);
    callback()
  };
  function init() {
    handle = document.createElementNS(htmlns, "div");
    handle.setAttribute("class", "editInfoHandle");
    handle.style.display = "none";
    parentElement.appendChild(handle)
  }
  init()
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("ops.EditInfo");
runtime.loadClass("gui.EditInfoHandle");
gui.EditInfoMarker = function EditInfoMarker(editInfo, initialVisibility) {
  var self = this, editInfoNode, handle, marker, editinfons = "urn:webodf:names:editinfo", decay1, decay2, decayTimeStep = 1E4;
  function applyDecay(opacity, delay) {
    return runtime.getWindow().setTimeout(function() {
      marker.style.opacity = opacity
    }, delay)
  }
  function deleteDecay(timer) {
    runtime.getWindow().clearTimeout(timer)
  }
  function setLastAuthor(memberid) {
    marker.setAttributeNS(editinfons, "editinfo:memberid", memberid)
  }
  this.addEdit = function(memberid, timestamp) {
    var age = Date.now() - timestamp;
    editInfo.addEdit(memberid, timestamp);
    handle.setEdits(editInfo.getSortedEdits());
    setLastAuthor(memberid);
    if(decay1) {
      deleteDecay(decay1)
    }
    if(decay2) {
      deleteDecay(decay2)
    }
    if(age < decayTimeStep) {
      applyDecay(1, 0);
      decay1 = applyDecay(0.5, decayTimeStep - age);
      decay2 = applyDecay(0.2, decayTimeStep * 2 - age)
    }else {
      if(age >= decayTimeStep && age < decayTimeStep * 2) {
        applyDecay(0.5, 0);
        decay2 = applyDecay(0.2, decayTimeStep * 2 - age)
      }else {
        applyDecay(0.2, 0)
      }
    }
  };
  this.getEdits = function() {
    return editInfo.getEdits()
  };
  this.clearEdits = function() {
    editInfo.clearEdits();
    handle.setEdits([]);
    if(marker.hasAttributeNS(editinfons, "editinfo:memberid")) {
      marker.removeAttributeNS(editinfons, "editinfo:memberid")
    }
  };
  this.getEditInfo = function() {
    return editInfo
  };
  this.show = function() {
    marker.style.display = "block"
  };
  this.hide = function() {
    self.hideHandle();
    marker.style.display = "none"
  };
  this.showHandle = function() {
    handle.show()
  };
  this.hideHandle = function() {
    handle.hide()
  };
  this.destroy = function(callback) {
    editInfoNode.removeChild(marker);
    handle.destroy(function(err) {
      if(err) {
        callback(err)
      }else {
        editInfo.destroy(callback)
      }
    })
  };
  function init() {
    var dom = editInfo.getOdtDocument().getDOM(), htmlns = dom.documentElement.namespaceURI;
    marker = dom.createElementNS(htmlns, "div");
    marker.setAttribute("class", "editInfoMarker");
    marker.onmouseover = function() {
      self.showHandle()
    };
    marker.onmouseout = function() {
      self.hideHandle()
    };
    editInfoNode = editInfo.getNode();
    editInfoNode.appendChild(marker);
    handle = new gui.EditInfoHandle(editInfoNode);
    if(!initialVisibility) {
      self.hide()
    }
  }
  init()
};
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("gui.Caret");
runtime.loadClass("ops.TrivialMemberModel");
runtime.loadClass("ops.EditInfo");
runtime.loadClass("gui.EditInfoMarker");
gui.SessionViewOptions = function() {
  this.editInfoMarkersInitiallyVisible = true;
  this.caretAvatarsInitiallyVisible = true;
  this.caretBlinksOnRangeSelect = true
};
gui.SessionView = function() {
  function configOption(userValue, defaultValue) {
    return userValue !== undefined ? Boolean(userValue) : defaultValue
  }
  function SessionView(viewOptions, session, caretManager) {
    var avatarInfoStyles, editInfons = "urn:webodf:names:editinfo", editInfoMap = {}, showEditInfoMarkers = configOption(viewOptions.editInfoMarkersInitiallyVisible, true), showCaretAvatars = configOption(viewOptions.caretAvatarsInitiallyVisible, true), blinkOnRangeSelect = configOption(viewOptions.caretBlinksOnRangeSelect, true);
    function createAvatarInfoNodeMatch(nodeName, memberId, pseudoClass) {
      return nodeName + '[editinfo|memberid^="' + memberId + '"]' + pseudoClass
    }
    function getAvatarInfoStyle(nodeName, memberId, pseudoClass) {
      var node = avatarInfoStyles.firstChild, nodeMatch = createAvatarInfoNodeMatch(nodeName, memberId, pseudoClass);
      while(node) {
        if(node.nodeType === Node.TEXT_NODE && node.data.indexOf(nodeMatch) === 0) {
          return node
        }
        node = node.nextSibling
      }
      return null
    }
    function setAvatarInfoStyle(memberId, name, color) {
      function setStyle(nodeName, rule, pseudoClass) {
        var styleRule = createAvatarInfoNodeMatch(nodeName, memberId, pseudoClass) + rule, styleNode = getAvatarInfoStyle(nodeName, memberId, pseudoClass);
        if(styleNode) {
          styleNode.data = styleRule
        }else {
          avatarInfoStyles.appendChild(document.createTextNode(styleRule))
        }
      }
      setStyle("div.editInfoMarker", "{ background-color: " + color + "; }", "");
      setStyle("span.editInfoColor", "{ background-color: " + color + "; }", "");
      setStyle("span.editInfoAuthor", '{ content: "' + name + '"; }', ":before");
      setStyle("dc|creator", '{ content: "' + name + '"; display: none;}', ":before");
      setStyle("dc|creator", "{ background-color: " + color + "; }", "")
    }
    function highlightEdit(element, memberId, timestamp) {
      var editInfo, editInfoMarker, id = "", editInfoNode = element.getElementsByTagNameNS(editInfons, "editinfo")[0];
      if(editInfoNode) {
        id = editInfoNode.getAttributeNS(editInfons, "id");
        editInfoMarker = editInfoMap[id]
      }else {
        id = Math.random().toString();
        editInfo = new ops.EditInfo(element, session.getOdtDocument());
        editInfoMarker = new gui.EditInfoMarker(editInfo, showEditInfoMarkers);
        editInfoNode = element.getElementsByTagNameNS(editInfons, "editinfo")[0];
        editInfoNode.setAttributeNS(editInfons, "id", id);
        editInfoMap[id] = editInfoMarker
      }
      editInfoMarker.addEdit(memberId, new Date(timestamp))
    }
    function setEditInfoMarkerVisibility(visible) {
      var editInfoMarker, keyname;
      for(keyname in editInfoMap) {
        if(editInfoMap.hasOwnProperty(keyname)) {
          editInfoMarker = editInfoMap[keyname];
          if(visible) {
            editInfoMarker.show()
          }else {
            editInfoMarker.hide()
          }
        }
      }
    }
    function setCaretAvatarVisibility(visible) {
      caretManager.getCarets().forEach(function(caret) {
        if(visible) {
          caret.showHandle()
        }else {
          caret.hideHandle()
        }
      })
    }
    this.showEditInfoMarkers = function() {
      if(showEditInfoMarkers) {
        return
      }
      showEditInfoMarkers = true;
      setEditInfoMarkerVisibility(showEditInfoMarkers)
    };
    this.hideEditInfoMarkers = function() {
      if(!showEditInfoMarkers) {
        return
      }
      showEditInfoMarkers = false;
      setEditInfoMarkerVisibility(showEditInfoMarkers)
    };
    this.showCaretAvatars = function() {
      if(showCaretAvatars) {
        return
      }
      showCaretAvatars = true;
      setCaretAvatarVisibility(showCaretAvatars)
    };
    this.hideCaretAvatars = function() {
      if(!showCaretAvatars) {
        return
      }
      showCaretAvatars = false;
      setCaretAvatarVisibility(showCaretAvatars)
    };
    this.getSession = function() {
      return session
    };
    this.getCaret = function(memberid) {
      return caretManager.getCaret(memberid)
    };
    function renderMemberData(memberId, memberData) {
      var caret = caretManager.getCaret(memberId);
      if(!memberData) {
        runtime.log('MemberModel sent undefined data for member "' + memberId + '".');
        return
      }
      if(caret) {
        caret.setAvatarImageUrl(memberData.imageurl);
        caret.setColor(memberData.color)
      }
      setAvatarInfoStyle(memberId, memberData.fullname, memberData.color)
    }
    function onCursorAdded(cursor) {
      var memberId = cursor.getMemberId(), memberModel = session.getMemberModel();
      caretManager.registerCursor(cursor, showCaretAvatars, blinkOnRangeSelect);
      renderMemberData(memberId, null);
      memberModel.getMemberDetailsAndUpdates(memberId, renderMemberData);
      runtime.log("+++ View here +++ eagerly created an Caret for '" + memberId + "'! +++")
    }
    function onCursorRemoved(memberid) {
      var hasMemberEditInfo = false, keyname;
      for(keyname in editInfoMap) {
        if(editInfoMap.hasOwnProperty(keyname) && editInfoMap[keyname].getEditInfo().getEdits().hasOwnProperty(memberid)) {
          hasMemberEditInfo = true;
          break
        }
      }
      if(!hasMemberEditInfo) {
        session.getMemberModel().unsubscribeMemberDetailsUpdates(memberid, renderMemberData)
      }
    }
    function onParagraphChanged(info) {
      highlightEdit(info.paragraphElement, info.memberId, info.timeStamp)
    }
    this.destroy = function(callback) {
      var odtDocument = session.getOdtDocument(), memberModel = session.getMemberModel(), editInfoArray = Object.keys(editInfoMap).map(function(keyname) {
        return editInfoMap[keyname]
      });
      odtDocument.unsubscribe(ops.OdtDocument.signalCursorAdded, onCursorAdded);
      odtDocument.unsubscribe(ops.OdtDocument.signalCursorRemoved, onCursorRemoved);
      odtDocument.unsubscribe(ops.OdtDocument.signalParagraphChanged, onParagraphChanged);
      caretManager.getCarets().forEach(function(caret) {
        memberModel.unsubscribeMemberDetailsUpdates(caret.getCursor().getMemberId(), renderMemberData)
      });
      avatarInfoStyles.parentNode.removeChild(avatarInfoStyles);
      (function destroyEditInfo(i, err) {
        if(err) {
          callback(err)
        }else {
          if(i < editInfoArray.length) {
            editInfoArray[i].destroy(function(err) {
              destroyEditInfo(i + 1, err)
            })
          }else {
            callback()
          }
        }
      })(0, undefined)
    };
    function init() {
      var odtDocument = session.getOdtDocument(), head = document.getElementsByTagName("head")[0];
      odtDocument.subscribe(ops.OdtDocument.signalCursorAdded, onCursorAdded);
      odtDocument.subscribe(ops.OdtDocument.signalCursorRemoved, onCursorRemoved);
      odtDocument.subscribe(ops.OdtDocument.signalParagraphChanged, onParagraphChanged);
      avatarInfoStyles = document.createElementNS(head.namespaceURI, "style");
      avatarInfoStyles.type = "text/css";
      avatarInfoStyles.media = "screen, print, handheld, projection";
      avatarInfoStyles.appendChild(document.createTextNode("@namespace editinfo url(urn:webodf:names:editinfo);"));
      avatarInfoStyles.appendChild(document.createTextNode("@namespace dc url(http://purl.org/dc/elements/1.1/);"));
      head.appendChild(avatarInfoStyles)
    }
    init()
  }
  return SessionView
}();
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("gui.Caret");
gui.CaretManager = function CaretManager(sessionController) {
  var carets = {}, window = runtime.getWindow();
  function getCaret(memberId) {
    return carets.hasOwnProperty(memberId) ? carets[memberId] : null
  }
  function getCarets() {
    return Object.keys(carets).map(function(memberid) {
      return carets[memberid]
    })
  }
  function getCanvasElement() {
    return sessionController.getSession().getOdtDocument().getOdfCanvas().getElement()
  }
  function removeCaret(memberId) {
    if(memberId === sessionController.getInputMemberId()) {
      getCanvasElement().removeAttribute("tabindex")
    }
    delete carets[memberId]
  }
  function refreshLocalCaretBlinking(cursor) {
    var caret, memberId = cursor.getMemberId();
    if(memberId === sessionController.getInputMemberId()) {
      caret = getCaret(memberId);
      if(caret) {
        caret.refreshCursorBlinking()
      }
    }
  }
  function ensureLocalCaretVisible(info) {
    var caret;
    if(info.memberId === sessionController.getInputMemberId()) {
      caret = getCaret(info.memberId);
      if(caret) {
        caret.ensureVisible()
      }
    }
  }
  function focusLocalCaret() {
    var caret = getCaret(sessionController.getInputMemberId());
    if(caret) {
      caret.setFocus()
    }
  }
  function blurLocalCaret() {
    var caret = getCaret(sessionController.getInputMemberId());
    if(caret) {
      caret.removeFocus()
    }
  }
  function showLocalCaret() {
    var caret = getCaret(sessionController.getInputMemberId());
    if(caret) {
      caret.show()
    }
  }
  function hideLocalCaret() {
    var caret = getCaret(sessionController.getInputMemberId());
    if(caret) {
      caret.hide()
    }
  }
  this.registerCursor = function(cursor, caretAvatarInitiallyVisible, blinkOnRangeSelect) {
    var memberid = cursor.getMemberId(), canvasElement = getCanvasElement(), caret = new gui.Caret(cursor, caretAvatarInitiallyVisible, blinkOnRangeSelect);
    carets[memberid] = caret;
    if(memberid === sessionController.getInputMemberId()) {
      runtime.log("Starting to track input on new cursor of " + memberid);
      cursor.handleUpdate = caret.ensureVisible;
      canvasElement.setAttribute("tabindex", 0);
      canvasElement.focus()
    }
    return caret
  };
  this.getCaret = getCaret;
  this.getCarets = getCarets;
  this.destroy = function(callback) {
    var odtDocument = sessionController.getSession().getOdtDocument(), canvasElement = getCanvasElement(), caretArray = getCarets();
    odtDocument.unsubscribe(ops.OdtDocument.signalParagraphChanged, ensureLocalCaretVisible);
    odtDocument.unsubscribe(ops.OdtDocument.signalCursorMoved, refreshLocalCaretBlinking);
    odtDocument.unsubscribe(ops.OdtDocument.signalCursorRemoved, removeCaret);
    canvasElement.removeEventListener("focus", focusLocalCaret, false);
    canvasElement.removeEventListener("blur", blurLocalCaret, false);
    window.removeEventListener("focus", showLocalCaret, false);
    window.removeEventListener("blur", hideLocalCaret, false);
    (function destroyCaret(i, err) {
      if(err) {
        callback(err)
      }else {
        if(i < caretArray.length) {
          caretArray[i].destroy(function(err) {
            destroyCaret(i + 1, err)
          })
        }else {
          callback()
        }
      }
    })(0, undefined)
  };
  function init() {
    var odtDocument = sessionController.getSession().getOdtDocument(), canvasElement = getCanvasElement();
    odtDocument.subscribe(ops.OdtDocument.signalParagraphChanged, ensureLocalCaretVisible);
    odtDocument.subscribe(ops.OdtDocument.signalCursorMoved, refreshLocalCaretBlinking);
    odtDocument.subscribe(ops.OdtDocument.signalCursorRemoved, removeCaret);
    canvasElement.addEventListener("focus", focusLocalCaret, false);
    canvasElement.addEventListener("blur", blurLocalCaret, false);
    window.addEventListener("focus", showLocalCaret, false);
    window.addEventListener("blur", hideLocalCaret, false)
  }
  init()
};
runtime.loadClass("xmldom.XPath");
runtime.loadClass("odf.Namespaces");
gui.PresenterUI = function() {
  var xpath = new xmldom.XPath, window = runtime.getWindow();
  return function PresenterUI(odf_element) {
    var self = this;
    self.setInitialSlideMode = function() {
      self.startSlideMode("single")
    };
    self.keyDownHandler = function(ev) {
      if(ev.target.isContentEditable) {
        return
      }
      if(ev.target.nodeName === "input") {
        return
      }
      switch(ev.keyCode) {
        case 84:
          self.toggleToolbar();
          break;
        case 37:
        ;
        case 8:
          self.prevSlide();
          break;
        case 39:
        ;
        case 32:
          self.nextSlide();
          break;
        case 36:
          self.firstSlide();
          break;
        case 35:
          self.lastSlide();
          break
      }
    };
    self.root = function() {
      return self.odf_canvas.odfContainer().rootElement
    };
    self.firstSlide = function() {
      self.slideChange(function(old, pc) {
        return 0
      })
    };
    self.lastSlide = function() {
      self.slideChange(function(old, pc) {
        return pc - 1
      })
    };
    self.nextSlide = function() {
      self.slideChange(function(old, pc) {
        return old + 1 < pc ? old + 1 : -1
      })
    };
    self.prevSlide = function() {
      self.slideChange(function(old, pc) {
        return old < 1 ? -1 : old - 1
      })
    };
    self.slideChange = function(indexChanger) {
      var pages = self.getPages(self.odf_canvas.odfContainer().rootElement), last = -1, i = 0, newidx, pagelist;
      pages.forEach(function(tuple) {
        var node = tuple[1];
        if(node.hasAttribute("slide_current")) {
          last = i;
          node.removeAttribute("slide_current")
        }
        i += 1
      });
      newidx = indexChanger(last, pages.length);
      if(newidx === -1) {
        newidx = last
      }
      pages[newidx][1].setAttribute("slide_current", "1");
      pagelist = document.getElementById("pagelist");
      pagelist.selectedIndex = newidx;
      if(self.slide_mode === "cont") {
        window.scrollBy(0, pages[newidx][1].getBoundingClientRect().top - 30)
      }
    };
    self.selectSlide = function(idx) {
      self.slideChange(function(old, pc) {
        if(idx >= pc) {
          return-1
        }
        if(idx < 0) {
          return-1
        }
        return idx
      })
    };
    self.scrollIntoContView = function(idx) {
      var pages = self.getPages(self.odf_canvas.odfContainer().rootElement);
      if(pages.length === 0) {
        return
      }
      window.scrollBy(0, pages[idx][1].getBoundingClientRect().top - 30)
    };
    self.getPages = function(root) {
      var pagenodes = root.getElementsByTagNameNS(odf.Namespaces.drawns, "page"), pages = [], i;
      for(i = 0;i < pagenodes.length;i += 1) {
        pages.push([pagenodes[i].getAttribute("draw:name"), pagenodes[i]])
      }
      return pages
    };
    self.fillPageList = function(odfdom_root, html_select) {
      var pages = self.getPages(odfdom_root), i, html_option, res, page_denom;
      while(html_select.firstChild) {
        html_select.removeChild(html_select.firstChild)
      }
      for(i = 0;i < pages.length;i += 1) {
        html_option = document.createElement("option");
        res = xpath.getODFElementsWithXPath(pages[i][1], './draw:frame[@presentation:class="title"]//draw:text-box/text:p', xmldom.XPath);
        page_denom = res.length > 0 ? res[0].textContent : pages[i][0];
        html_option.textContent = i + 1 + ": " + page_denom;
        html_select.appendChild(html_option)
      }
    };
    self.startSlideMode = function(mode) {
      var pagelist = document.getElementById("pagelist"), css = self.odf_canvas.slidevisibilitycss().sheet;
      self.slide_mode = mode;
      while(css.cssRules.length > 0) {
        css.deleteRule(0)
      }
      self.selectSlide(0);
      if(self.slide_mode === "single") {
        css.insertRule("draw|page { position:fixed; left:0px;top:30px; z-index:1; }", 0);
        css.insertRule("draw|page[slide_current]  { z-index:2;}", 1);
        css.insertRule("draw|page  { -webkit-transform: scale(1);}", 2);
        self.fitToWindow();
        window.addEventListener("resize", self.fitToWindow, false)
      }else {
        if(self.slide_mode === "cont") {
          window.removeEventListener("resize", self.fitToWindow, false)
        }
      }
      self.fillPageList(self.odf_canvas.odfContainer().rootElement, pagelist)
    };
    self.toggleToolbar = function() {
      var css, found, i;
      css = self.odf_canvas.slidevisibilitycss().sheet;
      found = -1;
      for(i = 0;i < css.cssRules.length;i += 1) {
        if(css.cssRules[i].cssText.substring(0, 8) === ".toolbar") {
          found = i;
          break
        }
      }
      if(found > -1) {
        css.deleteRule(found)
      }else {
        css.insertRule(".toolbar { position:fixed; left:0px;top:-200px; z-index:0; }", 0)
      }
    };
    self.fitToWindow = function() {
      function ruleByFactor(f) {
        return"draw|page { \n" + "-moz-transform: scale(" + f + "); \n" + "-moz-transform-origin: 0% 0%; " + "-webkit-transform-origin: 0% 0%; -webkit-transform: scale(" + f + "); " + "-o-transform-origin: 0% 0%; -o-transform: scale(" + f + "); " + "-ms-transform-origin: 0% 0%; -ms-transform: scale(" + f + "); " + "}"
      }
      var pages = self.getPages(self.root()), factorVert = (window.innerHeight - 40) / pages[0][1].clientHeight, factorHoriz = (window.innerWidth - 10) / pages[0][1].clientWidth, factor = factorVert < factorHoriz ? factorVert : factorHoriz, css = self.odf_canvas.slidevisibilitycss().sheet;
      css.deleteRule(2);
      css.insertRule(ruleByFactor(factor), 2)
    };
    self.load = function(url) {
      self.odf_canvas.load(url)
    };
    self.odf_element = odf_element;
    self.odf_canvas = new odf.OdfCanvas(self.odf_element);
    self.odf_canvas.addListener("statereadychange", self.setInitialSlideMode);
    self.slide_mode = "undefined";
    document.addEventListener("keydown", self.keyDownHandler, false)
  }
}();
runtime.loadClass("core.PositionIterator");
runtime.loadClass("core.Cursor");
gui.XMLEdit = function XMLEdit(element, stylesheet) {
  var simplecss, cssprefix, documentElement, walker = null;
  if(!element.id) {
    element.id = "xml" + String(Math.random()).substring(2)
  }
  cssprefix = "#" + element.id + " ";
  simplecss = cssprefix + "*," + cssprefix + ":visited, " + cssprefix + ":link {display:block; margin: 0px; margin-left: 10px; font-size: medium; color: black; background: white; font-variant: normal; font-weight: normal; font-style: normal; font-family: sans-serif; text-decoration: none; white-space: pre-wrap; height: auto; width: auto}\n" + cssprefix + ":before {color: blue; content: '<' attr(customns_name) attr(customns_atts) '>';}\n" + cssprefix + ":after {color: blue; content: '</' attr(customns_name) '>';}\n" + 
  cssprefix + "{overflow: auto;}\n";
  function listenEvent(eventTarget, eventType, eventHandler) {
    if(eventTarget.addEventListener) {
      eventTarget.addEventListener(eventType, eventHandler, false)
    }else {
      if(eventTarget.attachEvent) {
        eventType = "on" + eventType;
        eventTarget.attachEvent(eventType, eventHandler)
      }else {
        eventTarget["on" + eventType] = eventHandler
      }
    }
  }
  function cancelEvent(event) {
    if(event.preventDefault) {
      event.preventDefault()
    }else {
      event.returnValue = false
    }
  }
  function isCaretMoveCommand(charCode) {
    if(charCode >= 16 && charCode <= 20) {
      return true
    }
    if(charCode >= 33 && charCode <= 40) {
      return true
    }
    return false
  }
  function syncSelectionWithWalker() {
    var sel = element.ownerDocument.defaultView.getSelection(), r;
    if(!sel || sel.rangeCount <= 0 || !walker) {
      return
    }
    r = sel.getRangeAt(0);
    walker.setPoint(r.startContainer, r.startOffset)
  }
  function syncWalkerWithSelection() {
    var sel = element.ownerDocument.defaultView.getSelection(), n, r;
    sel.removeAllRanges();
    if(!walker || !walker.node()) {
      return
    }
    n = walker.node();
    r = n.ownerDocument.createRange();
    r.setStart(n, walker.position());
    r.collapse(true);
    sel.addRange(r)
  }
  function handleKeyDown(event) {
    var charCode = event.charCode || event.keyCode;
    walker = null;
    if(walker && charCode === 39) {
      syncSelectionWithWalker();
      walker.stepForward();
      syncWalkerWithSelection()
    }else {
      if(walker && charCode === 37) {
        syncSelectionWithWalker();
        walker.stepBackward();
        syncWalkerWithSelection()
      }else {
        if(isCaretMoveCommand(charCode)) {
          return
        }
      }
    }
    cancelEvent(event)
  }
  function handleClick(event) {
    cancelEvent(event)
  }
  function initElement(element) {
    listenEvent(element, "click", handleClick);
    listenEvent(element, "keydown", handleKeyDown);
    listenEvent(element, "drop", cancelEvent);
    listenEvent(element, "dragend", cancelEvent);
    listenEvent(element, "beforepaste", cancelEvent);
    listenEvent(element, "paste", cancelEvent)
  }
  function cleanWhitespace(node) {
    var n = node.firstChild, p, re = /^\s*$/;
    while(n && n !== node) {
      p = n;
      n = n.nextSibling || n.parentNode;
      if(p.nodeType === Node.TEXT_NODE && re.test(p.nodeValue)) {
        p.parentNode.removeChild(p)
      }
    }
  }
  function setCssHelperAttributes(node) {
    var atts, attsv, a, i;
    atts = node.attributes;
    attsv = "";
    for(i = atts.length - 1;i >= 0;i -= 1) {
      a = atts.item(i);
      attsv = attsv + " " + a.nodeName + '="' + a.nodeValue + '"'
    }
    node.setAttribute("customns_name", node.nodeName);
    node.setAttribute("customns_atts", attsv)
  }
  function addExplicitAttributes(node) {
    var n = node.firstChild;
    while(n && n !== node) {
      if(n.nodeType === Node.ELEMENT_NODE) {
        addExplicitAttributes(n)
      }
      n = n.nextSibling || n.parentNode
    }
    setCssHelperAttributes(node);
    cleanWhitespace(node)
  }
  function getNamespacePrefixes(node, prefixes) {
    var n = node.firstChild, atts, att, i;
    while(n && n !== node) {
      if(n.nodeType === Node.ELEMENT_NODE) {
        getNamespacePrefixes(n, prefixes);
        atts = n.attributes;
        for(i = atts.length - 1;i >= 0;i -= 1) {
          att = atts.item(i);
          if(att.namespaceURI === "http://www.w3.org/2000/xmlns/") {
            if(!prefixes[att.nodeValue]) {
              prefixes[att.nodeValue] = att.localName
            }
          }
        }
      }
      n = n.nextSibling || n.parentNode
    }
  }
  function generateUniquePrefixes(prefixes) {
    var taken = {}, ns, p, n = 0;
    for(ns in prefixes) {
      if(prefixes.hasOwnProperty(ns) && ns) {
        p = prefixes[ns];
        if(!p || taken.hasOwnProperty(p) || p === "xmlns") {
          do {
            p = "ns" + n;
            n += 1
          }while(taken.hasOwnProperty(p));
          prefixes[ns] = p
        }
        taken[p] = true
      }
    }
  }
  function createCssFromXmlInstance(node) {
    var prefixes = {}, css = "@namespace customns url(customns);\n";
    getNamespacePrefixes(node, prefixes);
    generateUniquePrefixes(prefixes);
    return css
  }
  function updateCSS() {
    var css = element.ownerDocument.createElement("style"), text = createCssFromXmlInstance(element);
    css.type = "text/css";
    text = text + simplecss;
    css.appendChild(element.ownerDocument.createTextNode(text));
    stylesheet = stylesheet.parentNode.replaceChild(css, stylesheet)
  }
  function getXML() {
    return documentElement
  }
  function setXML(xml) {
    var node = xml.documentElement || xml;
    node = element.ownerDocument.importNode(node, true);
    documentElement = node;
    addExplicitAttributes(node);
    while(element.lastChild) {
      element.removeChild(element.lastChild)
    }
    element.appendChild(node);
    updateCSS();
    walker = new core.PositionIterator(node)
  }
  initElement(element);
  this.updateCSS = updateCSS;
  this.setXML = setXML;
  this.getXML = getXML
};
/*

 Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
gui.UndoManager = function UndoManager() {
};
gui.UndoManager.prototype.subscribe = function(signal, callback) {
};
gui.UndoManager.prototype.unsubscribe = function(signal, callback) {
};
gui.UndoManager.prototype.setOdtDocument = function(newDocument) {
};
gui.UndoManager.prototype.saveInitialState = function() {
};
gui.UndoManager.prototype.resetInitialState = function() {
};
gui.UndoManager.prototype.setPlaybackFunction = function(playback_func) {
};
gui.UndoManager.prototype.hasUndoStates = function() {
};
gui.UndoManager.prototype.hasRedoStates = function() {
};
gui.UndoManager.prototype.moveForward = function(states) {
};
gui.UndoManager.prototype.moveBackward = function(states) {
};
gui.UndoManager.prototype.onOperationExecuted = function(op) {
};
gui.UndoManager.signalUndoStackChanged = "undoStackChanged";
gui.UndoManager.signalUndoStateCreated = "undoStateCreated";
gui.UndoManager.signalUndoStateModified = "undoStateModified";
(function() {
  return gui.UndoManager
})();
/*

 Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
gui.UndoStateRules = function UndoStateRules() {
  function getOpType(op) {
    return op.spec().optype
  }
  this.getOpType = getOpType;
  function getOpPosition(op) {
    return op.spec().position
  }
  function isEditOperation(op) {
    switch(getOpType(op)) {
      case "MoveCursor":
      ;
      case "AddCursor":
      ;
      case "RemoveCursor":
        return false;
      default:
        return true
    }
  }
  this.isEditOperation = isEditOperation;
  function canAggregateOperation(optype) {
    switch(optype) {
      case "RemoveText":
      ;
      case "InsertText":
        return true;
      default:
        return false
    }
  }
  function isSameDirectionOfTravel(recentEditOps, thisOp) {
    var existing1 = getOpPosition(recentEditOps[recentEditOps.length - 2]), existing2 = getOpPosition(recentEditOps[recentEditOps.length - 1]), thisPos = getOpPosition(thisOp), direction = existing2 - existing1;
    return existing2 === thisPos - direction
  }
  function isContinuousOperation(recentEditOps, thisOp) {
    var optype = getOpType(thisOp);
    if(canAggregateOperation(optype) && optype === getOpType(recentEditOps[0])) {
      if(recentEditOps.length === 1) {
        return true
      }
      if(isSameDirectionOfTravel(recentEditOps, thisOp)) {
        return true
      }
    }
    return false
  }
  function isPartOfOperationSet(operation, lastOperations) {
    if(isEditOperation(operation)) {
      if(lastOperations.length === 0) {
        return true
      }
      return isEditOperation(lastOperations[lastOperations.length - 1]) && isContinuousOperation(lastOperations.filter(isEditOperation), operation)
    }
    return true
  }
  this.isPartOfOperationSet = isPartOfOperationSet
};
/*

 Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("core.DomUtils");
runtime.loadClass("gui.UndoManager");
runtime.loadClass("gui.UndoStateRules");
gui.TrivialUndoManager = function TrivialUndoManager(defaultRules) {
  var self = this, cursorns = "urn:webodf:names:cursor", domUtils = new core.DomUtils, initialDoc, initialState = [], playFunc, odtDocument, currentUndoState = [], undoStates = [], redoStates = [], eventNotifier = new core.EventNotifier([gui.UndoManager.signalUndoStackChanged, gui.UndoManager.signalUndoStateCreated, gui.UndoManager.signalUndoStateModified, gui.TrivialUndoManager.signalDocumentRootReplaced]), undoRules = defaultRules || new gui.UndoStateRules;
  function emitStackChange() {
    eventNotifier.emit(gui.UndoManager.signalUndoStackChanged, {undoAvailable:self.hasUndoStates(), redoAvailable:self.hasRedoStates()})
  }
  function mostRecentUndoState() {
    return undoStates[undoStates.length - 1]
  }
  function completeCurrentUndoState() {
    if(currentUndoState !== initialState && currentUndoState !== mostRecentUndoState()) {
      undoStates.push(currentUndoState)
    }
  }
  function removeNode(node) {
    var sibling = node.previousSibling || node.nextSibling;
    node.parentNode.removeChild(node);
    domUtils.normalizeTextNodes(sibling)
  }
  function removeCursors(root) {
    domUtils.getElementsByTagNameNS(root, cursorns, "cursor").forEach(removeNode);
    domUtils.getElementsByTagNameNS(root, cursorns, "anchor").forEach(removeNode)
  }
  function values(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key]
    })
  }
  function extractCursorStates(undoStates) {
    var addCursor = {}, moveCursor = {}, requiredAddOps = {}, remainingAddOps, operations = undoStates.pop();
    odtDocument.getCursors().forEach(function(cursor) {
      requiredAddOps[cursor.getMemberId()] = true
    });
    remainingAddOps = Object.keys(requiredAddOps).length;
    function processOp(op) {
      var spec = op.spec();
      if(!requiredAddOps[spec.memberid]) {
        return
      }
      switch(spec.optype) {
        case "AddCursor":
          if(!addCursor[spec.memberid]) {
            addCursor[spec.memberid] = op;
            delete requiredAddOps[spec.memberid];
            remainingAddOps -= 1
          }
          break;
        case "MoveCursor":
          if(!moveCursor[spec.memberid]) {
            moveCursor[spec.memberid] = op
          }
          break
      }
    }
    while(operations && remainingAddOps > 0) {
      operations.reverse();
      operations.forEach(processOp);
      operations = undoStates.pop()
    }
    return values(addCursor).concat(values(moveCursor))
  }
  this.subscribe = function(signal, callback) {
    eventNotifier.subscribe(signal, callback)
  };
  this.unsubscribe = function(signal, callback) {
    eventNotifier.unsubscribe(signal, callback)
  };
  this.hasUndoStates = function() {
    return undoStates.length > 0
  };
  this.hasRedoStates = function() {
    return redoStates.length > 0
  };
  this.setOdtDocument = function(newDocument) {
    odtDocument = newDocument
  };
  this.resetInitialState = function() {
    undoStates.length = 0;
    redoStates.length = 0;
    initialState.length = 0;
    currentUndoState.length = 0;
    initialDoc = null;
    emitStackChange()
  };
  this.saveInitialState = function() {
    var odfContainer = odtDocument.getOdfCanvas().odfContainer(), annotationManager = odtDocument.getOdfCanvas().getAnnotationManager();
    if(annotationManager) {
      annotationManager.forgetAnnotations()
    }
    initialDoc = odfContainer.rootElement.cloneNode(true);
    odtDocument.getOdfCanvas().refreshAnnotations();
    removeCursors(initialDoc);
    completeCurrentUndoState();
    undoStates.unshift(initialState);
    currentUndoState = initialState = extractCursorStates(undoStates);
    undoStates.length = 0;
    redoStates.length = 0;
    emitStackChange()
  };
  this.setPlaybackFunction = function(playback_func) {
    playFunc = playback_func
  };
  this.onOperationExecuted = function(op) {
    redoStates.length = 0;
    if(undoRules.isEditOperation(op) && currentUndoState === initialState || !undoRules.isPartOfOperationSet(op, currentUndoState)) {
      completeCurrentUndoState();
      currentUndoState = [op];
      undoStates.push(currentUndoState);
      eventNotifier.emit(gui.UndoManager.signalUndoStateCreated, {operations:currentUndoState});
      emitStackChange()
    }else {
      currentUndoState.push(op);
      eventNotifier.emit(gui.UndoManager.signalUndoStateModified, {operations:currentUndoState})
    }
  };
  this.moveForward = function(states) {
    var moved = 0, redoOperations;
    while(states && redoStates.length) {
      redoOperations = redoStates.pop();
      undoStates.push(redoOperations);
      redoOperations.forEach(playFunc);
      states -= 1;
      moved += 1
    }
    if(moved) {
      currentUndoState = mostRecentUndoState();
      emitStackChange()
    }
    return moved
  };
  this.moveBackward = function(states) {
    var odfCanvas = odtDocument.getOdfCanvas(), odfContainer = odfCanvas.odfContainer(), moved = 0;
    while(states && undoStates.length) {
      redoStates.push(undoStates.pop());
      states -= 1;
      moved += 1
    }
    if(moved) {
      odfContainer.setRootElement(initialDoc.cloneNode(true));
      odfCanvas.setOdfContainer(odfContainer, true);
      eventNotifier.emit(gui.TrivialUndoManager.signalDocumentRootReplaced, {});
      odtDocument.getCursors().forEach(function(cursor) {
        odtDocument.removeCursor(cursor.getMemberId())
      });
      initialState.forEach(playFunc);
      undoStates.forEach(function(ops) {
        ops.forEach(playFunc)
      });
      odfCanvas.refreshCSS();
      currentUndoState = mostRecentUndoState() || initialState;
      emitStackChange()
    }
    return moved
  }
};
gui.TrivialUndoManager.signalDocumentRootReplaced = "documentRootReplaced";
(function() {
  return gui.TrivialUndoManager
})();
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("core.EventNotifier");
runtime.loadClass("core.DomUtils");
runtime.loadClass("odf.OdfUtils");
runtime.loadClass("odf.Namespaces");
runtime.loadClass("gui.SelectionMover");
runtime.loadClass("gui.StyleHelper");
runtime.loadClass("core.PositionFilterChain");
ops.OdtDocument = function OdtDocument(odfCanvas) {
  var self = this, odfUtils, domUtils, cursors = {}, eventNotifier = new core.EventNotifier([ops.OdtDocument.signalCursorAdded, ops.OdtDocument.signalCursorRemoved, ops.OdtDocument.signalCursorMoved, ops.OdtDocument.signalParagraphChanged, ops.OdtDocument.signalParagraphStyleModified, ops.OdtDocument.signalCommonStyleCreated, ops.OdtDocument.signalCommonStyleDeleted, ops.OdtDocument.signalTableAdded, ops.OdtDocument.signalOperationExecuted, ops.OdtDocument.signalUndoStackChanged]), FILTER_ACCEPT = 
  core.PositionFilter.FilterResult.FILTER_ACCEPT, FILTER_REJECT = core.PositionFilter.FilterResult.FILTER_REJECT, filter;
  function getRootNode() {
    var element = odfCanvas.odfContainer().getContentElement(), localName = element && element.localName;
    runtime.assert(localName === "text", "Unsupported content element type '" + localName + "'for OdtDocument");
    return element
  }
  function RootFilter(memberId) {
    function isRoot(node) {
      if(node.namespaceURI === odf.Namespaces.officens && node.localName === "text" || node.namespaceURI === odf.Namespaces.officens && node.localName === "annotation") {
        return true
      }
      return false
    }
    function getRoot(node) {
      while(!isRoot(node)) {
        node = (node.parentNode)
      }
      return node
    }
    this.acceptPosition = function(iterator) {
      var node = iterator.container(), cursorNode = cursors[memberId].getNode();
      if(getRoot(node) === getRoot(cursorNode)) {
        return FILTER_ACCEPT
      }
      return FILTER_REJECT
    }
  }
  function TextPositionFilter() {
    function checkLeftRight(container, leftNode, rightNode) {
      var r, firstPos, rightOfChar;
      if(leftNode) {
        r = odfUtils.lookLeftForCharacter(leftNode);
        if(r === 1) {
          return FILTER_ACCEPT
        }
        if(r === 2 && (odfUtils.scanRightForAnyCharacter(rightNode) || odfUtils.scanRightForAnyCharacter(odfUtils.nextNode(container)))) {
          return FILTER_ACCEPT
        }
      }
      firstPos = leftNode === null && odfUtils.isParagraph(container);
      rightOfChar = odfUtils.lookRightForCharacter(rightNode);
      if(firstPos) {
        if(rightOfChar) {
          return FILTER_ACCEPT
        }
        return odfUtils.scanRightForAnyCharacter(rightNode) ? FILTER_REJECT : FILTER_ACCEPT
      }
      if(!rightOfChar) {
        return FILTER_REJECT
      }
      leftNode = leftNode || odfUtils.previousNode(container);
      return odfUtils.scanLeftForAnyCharacter(leftNode) ? FILTER_REJECT : FILTER_ACCEPT
    }
    this.acceptPosition = function(iterator) {
      var container = iterator.container(), nodeType = container.nodeType, offset, text, leftChar, rightChar, leftNode, rightNode, r;
      if(nodeType !== Node.ELEMENT_NODE && nodeType !== Node.TEXT_NODE) {
        return FILTER_REJECT
      }
      if(nodeType === Node.TEXT_NODE) {
        if(!odfUtils.isGroupingElement(container.parentNode) || odfUtils.isWithinTrackedChanges(container.parentNode, getRootNode())) {
          return FILTER_REJECT
        }
        offset = iterator.unfilteredDomOffset();
        text = container.data;
        runtime.assert(offset !== text.length, "Unexpected offset.");
        if(offset > 0) {
          leftChar = text.substr(offset - 1, 1);
          if(!odfUtils.isODFWhitespace(leftChar)) {
            return FILTER_ACCEPT
          }
          if(offset > 1) {
            leftChar = text.substr(offset - 2, 1);
            if(!odfUtils.isODFWhitespace(leftChar)) {
              r = FILTER_ACCEPT
            }else {
              if(!odfUtils.isODFWhitespace(text.substr(0, offset))) {
                return FILTER_REJECT
              }
            }
          }else {
            leftNode = odfUtils.previousNode(container);
            if(odfUtils.scanLeftForNonWhitespace(leftNode)) {
              r = FILTER_ACCEPT
            }
          }
          if(r === FILTER_ACCEPT) {
            return odfUtils.isTrailingWhitespace(container, offset) ? FILTER_REJECT : FILTER_ACCEPT
          }
          rightChar = text.substr(offset, 1);
          if(odfUtils.isODFWhitespace(rightChar)) {
            return FILTER_REJECT
          }
          return odfUtils.scanLeftForAnyCharacter(odfUtils.previousNode(container)) ? FILTER_REJECT : FILTER_ACCEPT
        }
        leftNode = iterator.leftNode();
        rightNode = container;
        container = (container.parentNode);
        r = checkLeftRight(container, leftNode, rightNode)
      }else {
        if(!odfUtils.isGroupingElement(container) || odfUtils.isWithinTrackedChanges(container, getRootNode())) {
          r = FILTER_REJECT
        }else {
          leftNode = iterator.leftNode();
          rightNode = iterator.rightNode();
          r = checkLeftRight(container, leftNode, rightNode)
        }
      }
      return r
    }
  }
  function getIteratorAtPosition(position) {
    var iterator = gui.SelectionMover.createPositionIterator(getRootNode());
    position += 1;
    while(position > 0 && iterator.nextPosition()) {
      if(filter.acceptPosition(iterator) === FILTER_ACCEPT) {
        position -= 1
      }
    }
    return iterator
  }
  this.getIteratorAtPosition = getIteratorAtPosition;
  function getPositionInTextNode(position, memberid) {
    var iterator = gui.SelectionMover.createPositionIterator(getRootNode()), lastTextNode = null, node, nodeOffset = 0, cursorNode = null, originalPosition = position;
    runtime.assert(position >= 0, "position must be >= 0");
    if(filter.acceptPosition(iterator) === FILTER_ACCEPT) {
      node = iterator.container();
      if(node.nodeType === Node.TEXT_NODE) {
        lastTextNode = (node);
        nodeOffset = 0
      }
    }else {
      position += 1
    }
    while(position > 0 || lastTextNode === null) {
      if(!iterator.nextPosition()) {
        return null
      }
      if(filter.acceptPosition(iterator) === FILTER_ACCEPT) {
        position -= 1;
        node = iterator.container();
        if(node.nodeType === Node.TEXT_NODE) {
          if(node !== lastTextNode) {
            lastTextNode = (node);
            nodeOffset = iterator.unfilteredDomOffset()
          }else {
            nodeOffset += 1
          }
        }else {
          if(lastTextNode !== null) {
            if(position === 0) {
              nodeOffset = lastTextNode.length;
              break
            }
            lastTextNode = null
          }else {
            if(position === 0) {
              lastTextNode = getRootNode().ownerDocument.createTextNode("");
              node.insertBefore(lastTextNode, iterator.rightNode());
              nodeOffset = 0;
              break
            }
          }
        }
      }
    }
    if(lastTextNode === null) {
      return null
    }
    if(memberid && cursors[memberid] && self.getCursorPosition(memberid) === originalPosition) {
      cursorNode = cursors[memberid].getNode();
      while(nodeOffset === 0 && cursorNode.nextSibling && cursorNode.nextSibling.localName === "cursor") {
        cursorNode.parentNode.insertBefore(cursorNode, cursorNode.nextSibling.nextSibling)
      }
      if(lastTextNode.length > 0) {
        lastTextNode = getRootNode().ownerDocument.createTextNode("");
        nodeOffset = 0;
        cursorNode.parentNode.insertBefore(lastTextNode, cursorNode.nextSibling)
      }
      while(nodeOffset === 0 && lastTextNode.previousSibling && lastTextNode.previousSibling.localName === "cursor") {
        node = lastTextNode.previousSibling;
        if(lastTextNode.length > 0) {
          lastTextNode = getRootNode().ownerDocument.createTextNode("")
        }
        node.parentNode.insertBefore(lastTextNode, node);
        if(cursorNode === node) {
          break
        }
      }
    }
    while(lastTextNode.previousSibling && lastTextNode.previousSibling.nodeType === Node.TEXT_NODE) {
      lastTextNode.previousSibling.appendData(lastTextNode.data);
      nodeOffset = lastTextNode.previousSibling.length;
      lastTextNode = (lastTextNode.previousSibling);
      lastTextNode.parentNode.removeChild(lastTextNode.nextSibling)
    }
    return{textNode:lastTextNode, offset:nodeOffset}
  }
  function getParagraphElement(node) {
    return odfUtils.getParagraphElement(node)
  }
  function getStyleElement(styleName, styleFamily) {
    return odfCanvas.getFormatting().getStyleElement(styleName, styleFamily)
  }
  this.getStyleElement = getStyleElement;
  function getParagraphStyleElement(styleName) {
    return getStyleElement(styleName, "paragraph")
  }
  function getParagraphStyleAttributes(styleName) {
    var node = getParagraphStyleElement(styleName);
    if(node) {
      return odfCanvas.getFormatting().getInheritedStyleAttributes(node)
    }
    return null
  }
  function upgradeWhitespaceToElement(textNode, offset) {
    runtime.assert(textNode.data[offset] === " ", "upgradeWhitespaceToElement: textNode.data[offset] should be a literal space");
    var space = textNode.ownerDocument.createElementNS(odf.Namespaces.textns, "text:s");
    space.appendChild(textNode.ownerDocument.createTextNode(" "));
    textNode.deleteData(offset, 1);
    if(offset > 0) {
      textNode = (textNode.splitText(offset))
    }
    textNode.parentNode.insertBefore(space, textNode);
    return space
  }
  function upgradeWhitespacesAtPosition(position) {
    var iterator = getIteratorAtPosition(position), container, offset, i;
    iterator.previousPosition();
    iterator.previousPosition();
    for(i = -1;i <= 1;i += 1) {
      container = iterator.container();
      offset = iterator.unfilteredDomOffset();
      if(container.nodeType === Node.TEXT_NODE && container.data[offset] === " " && odfUtils.isSignificantWhitespace(container, offset)) {
        container = upgradeWhitespaceToElement((container), offset);
        iterator.moveToEndOfNode(container)
      }
      iterator.nextPosition()
    }
  }
  this.upgradeWhitespacesAtPosition = upgradeWhitespacesAtPosition;
  this.downgradeWhitespacesAtPosition = function(position) {
    var iterator = getIteratorAtPosition(position), container, offset, firstSpaceElementChild, lastSpaceElementChild;
    container = iterator.container();
    offset = iterator.unfilteredDomOffset();
    while(!odfUtils.isCharacterElement(container) && container.childNodes[offset]) {
      container = container.childNodes[offset];
      offset = 0
    }
    if(container.nodeType === Node.TEXT_NODE) {
      container = container.parentNode
    }
    if(odfUtils.isDowngradableSpaceElement(container)) {
      firstSpaceElementChild = container.firstChild;
      lastSpaceElementChild = container.lastChild;
      domUtils.mergeIntoParent(container);
      if(lastSpaceElementChild !== firstSpaceElementChild) {
        domUtils.normalizeTextNodes(lastSpaceElementChild)
      }
      domUtils.normalizeTextNodes(firstSpaceElementChild)
    }
  };
  this.getParagraphStyleElement = getParagraphStyleElement;
  this.getParagraphElement = getParagraphElement;
  this.getParagraphStyleAttributes = getParagraphStyleAttributes;
  this.getPositionInTextNode = getPositionInTextNode;
  this.fixCursorPositions = function(localMemberId) {
    var memberId, cursor, stepCounter, steps, rootConstrainedFilter = new core.PositionFilterChain;
    rootConstrainedFilter.addFilter("BaseFilter", self.getPositionFilter());
    for(memberId in cursors) {
      if(cursors.hasOwnProperty(memberId)) {
        rootConstrainedFilter.addFilter("RootFilter", self.createRootFilter(memberId));
        cursor = cursors[memberId];
        stepCounter = cursor.getStepCounter();
        if(!stepCounter.isPositionWalkable(rootConstrainedFilter)) {
          steps = stepCounter.countStepsToValidPosition(rootConstrainedFilter);
          cursor.move(steps);
          if(memberId === localMemberId) {
            self.emit(ops.OdtDocument.signalCursorMoved, cursor)
          }
        }else {
          if(self.getCursorSelection(memberId).length === 0) {
            cursor.move(0)
          }
        }
        rootConstrainedFilter.removeFilter("RootFilter")
      }
    }
  };
  this.getWalkableParagraphLength = function(paragraph) {
    var iterator = getIteratorAtPosition(0), length = 0;
    iterator.setUnfilteredPosition(paragraph, 0);
    do {
      if(getParagraphElement(iterator.container()) !== paragraph) {
        return length
      }
      if(filter.acceptPosition(iterator) === FILTER_ACCEPT) {
        length += 1
      }
    }while(iterator.nextPosition());
    return length
  };
  this.getDistanceFromCursor = function(memberid, node, offset) {
    var counter, cursor = cursors[memberid], steps = 0;
    runtime.assert(node !== null && node !== undefined, "OdtDocument.getDistanceFromCursor called without node");
    if(cursor) {
      counter = cursor.getStepCounter().countStepsToPosition;
      steps = counter(node, offset, filter)
    }
    return steps
  };
  this.getCursorPosition = function(memberid) {
    return-self.getDistanceFromCursor(memberid, getRootNode(), 0)
  };
  this.getCursorSelection = function(memberid) {
    var counter, cursor = cursors[memberid], focusPosition = 0, stepsToAnchor = 0;
    if(cursor) {
      counter = cursor.getStepCounter().countStepsToPosition;
      focusPosition = -counter(getRootNode(), 0, filter);
      stepsToAnchor = counter(cursor.getAnchorNode(), 0, filter)
    }
    return{position:focusPosition + stepsToAnchor, length:-stepsToAnchor}
  };
  this.getPositionFilter = function() {
    return filter
  };
  this.getOdfCanvas = function() {
    return odfCanvas
  };
  this.getRootNode = getRootNode;
  this.getDOM = function() {
    return(getRootNode().ownerDocument)
  };
  this.getCursor = function(memberid) {
    return cursors[memberid]
  };
  this.getCursors = function() {
    var list = [], i;
    for(i in cursors) {
      if(cursors.hasOwnProperty(i)) {
        list.push(cursors[i])
      }
    }
    return list
  };
  this.addCursor = function(cursor) {
    runtime.assert(Boolean(cursor), "OdtDocument::addCursor without cursor");
    var distanceToFirstTextNode = cursor.getStepCounter().countForwardSteps(1, filter), memberid = cursor.getMemberId();
    runtime.assert(Boolean(memberid), "OdtDocument::addCursor has cursor without memberid");
    runtime.assert(!cursors[memberid], "OdtDocument::addCursor is adding a duplicate cursor with memberid " + memberid);
    cursor.move(distanceToFirstTextNode);
    cursors[memberid] = cursor
  };
  this.removeCursor = function(memberid) {
    var cursor = cursors[memberid];
    if(cursor) {
      cursor.removeFromOdtDocument();
      delete cursors[memberid];
      self.emit(ops.OdtDocument.signalCursorRemoved, memberid);
      return true
    }
    return false
  };
  this.getMetaData = function(metadataId) {
    var node = odfCanvas.odfContainer().rootElement.firstChild;
    while(node && node.localName !== "meta") {
      node = node.nextSibling
    }
    node = node && node.firstChild;
    while(node && node.localName !== metadataId) {
      node = node.nextSibling
    }
    node = node && node.firstChild;
    while(node && node.nodeType !== Node.TEXT_NODE) {
      node = node.nextSibling
    }
    return node ? node.data : null
  };
  this.getFormatting = function() {
    return odfCanvas.getFormatting()
  };
  this.getTextElements = function(range, includeInsignificantWhitespace) {
    return odfUtils.getTextElements(range, includeInsignificantWhitespace)
  };
  this.getParagraphElements = function(range) {
    return odfUtils.getParagraphElements(range)
  };
  this.emit = function(eventid, args) {
    eventNotifier.emit(eventid, args)
  };
  this.subscribe = function(eventid, cb) {
    eventNotifier.subscribe(eventid, cb)
  };
  this.unsubscribe = function(eventid, cb) {
    eventNotifier.unsubscribe(eventid, cb)
  };
  this.createRootFilter = function(inputMemberId) {
    return new RootFilter(inputMemberId)
  };
  this.close = function(callback) {
    callback()
  };
  this.destroy = function(callback) {
    callback()
  };
  function init() {
    filter = new TextPositionFilter;
    odfUtils = new odf.OdfUtils;
    domUtils = new core.DomUtils
  }
  init()
};
ops.OdtDocument.signalCursorAdded = "cursor/added";
ops.OdtDocument.signalCursorRemoved = "cursor/removed";
ops.OdtDocument.signalCursorMoved = "cursor/moved";
ops.OdtDocument.signalParagraphChanged = "paragraph/changed";
ops.OdtDocument.signalTableAdded = "table/added";
ops.OdtDocument.signalCommonStyleCreated = "style/created";
ops.OdtDocument.signalCommonStyleDeleted = "style/deleted";
ops.OdtDocument.signalParagraphStyleModified = "paragraphstyle/modified";
ops.OdtDocument.signalOperationExecuted = "operation/executed";
ops.OdtDocument.signalUndoStackChanged = "undo/changed";
(function() {
  return ops.OdtDocument
})();
/*

 Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>

 @licstart
 The JavaScript code in this page is free software: you can redistribute it
 and/or modify it under the terms of the GNU Affero General Public License
 (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.  The code is distributed
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

 As additional permission under GNU AGPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 As a special exception to the AGPL, any HTML file which merely makes function
 calls to this code, and for that purpose includes it by reference shall be
 deemed a separate work for copyright law purposes. In addition, the copyright
 holders of this code give you permission to combine this code with free
 software libraries that are released under the GNU LGPL. You may copy and
 distribute such a system following the terms of the GNU AGPL for this code
 and the LGPL for the libraries. If you modify this code, you may extend this
 exception to your version of the code, but you are not obligated to do so.
 If you do not wish to do so, delete this exception statement from your
 version.

 This license applies to this entire compilation.
 @licend
 @source: http://www.webodf.org/
 @source: http://gitorious.org/webodf/webodf/
*/
runtime.loadClass("ops.TrivialMemberModel");
runtime.loadClass("ops.TrivialOperationRouter");
runtime.loadClass("ops.OperationFactory");
runtime.loadClass("ops.OdtDocument");
ops.Session = function Session(odfCanvas) {
  var self = this, operationFactory = new ops.OperationFactory, odtDocument = new ops.OdtDocument(odfCanvas), memberModel = new ops.TrivialMemberModel, operationRouter = null;
  this.setMemberModel = function(uModel) {
    memberModel = uModel
  };
  this.setOperationFactory = function(opFactory) {
    operationFactory = opFactory;
    if(operationRouter) {
      operationRouter.setOperationFactory(operationFactory)
    }
  };
  this.setOperationRouter = function(opRouter) {
    operationRouter = opRouter;
    opRouter.setPlaybackFunction(function(op) {
      op.execute(odtDocument);
      odtDocument.emit(ops.OdtDocument.signalOperationExecuted, op)
    });
    opRouter.setOperationFactory(operationFactory)
  };
  this.getMemberModel = function() {
    return memberModel
  };
  this.getOperationFactory = function() {
    return operationFactory
  };
  this.getOdtDocument = function() {
    return odtDocument
  };
  this.enqueue = function(operation) {
    operationRouter.push(operation)
  };
  this.close = function(callback) {
    operationRouter.close(function(err) {
      if(err) {
        callback(err)
      }else {
        memberModel.close(function(err) {
          if(err) {
            callback(err)
          }else {
            odtDocument.close(callback)
          }
        })
      }
    })
  };
  this.destroy = function(callback) {
    odtDocument.destroy(callback)
  };
  function init() {
    self.setOperationRouter(new ops.TrivialOperationRouter)
  }
  init()
};
var webodf_css = "@namespace draw url(urn:oasis:names:tc:opendocument:xmlns:drawing:1.0);\n@namespace fo url(urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0);\n@namespace office url(urn:oasis:names:tc:opendocument:xmlns:office:1.0);\n@namespace presentation url(urn:oasis:names:tc:opendocument:xmlns:presentation:1.0);\n@namespace style url(urn:oasis:names:tc:opendocument:xmlns:style:1.0);\n@namespace svg url(urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0);\n@namespace table url(urn:oasis:names:tc:opendocument:xmlns:table:1.0);\n@namespace text url(urn:oasis:names:tc:opendocument:xmlns:text:1.0);\n@namespace runtimens url(urn:webodf); /* namespace for runtime only */\n@namespace cursor url(urn:webodf:names:cursor);\n@namespace editinfo url(urn:webodf:names:editinfo);\n@namespace annotation url(urn:webodf:names:annotation);\n@namespace dc url(http://purl.org/dc/elements/1.1/);\n\noffice|document > *, office|document-content > * {\n  display: none;\n}\noffice|body, office|document {\n  display: inline-block;\n  position: relative;\n}\n\ntext|p, text|h {\n  display: block;\n  padding: 0;\n  margin: 0;\n  line-height: normal;\n  position: relative;\n  min-height: 1.3em; /* prevent empty paragraphs and headings from collapsing if they are empty */\n}\n*[runtimens|containsparagraphanchor] {\n  position: relative;\n}\ntext|s {\n    white-space: pre;\n}\ntext|tab {\n  display: inline;\n  white-space: pre;\n}\ntext|line-break {\n  content: \" \";\n  display: block;\n}\ntext|tracked-changes {\n  /*Consumers that do not support change tracking, should ignore changes.*/\n  display: none;\n}\noffice|binary-data {\n  display: none;\n}\noffice|text {\n  display: block;\n  text-align: left;\n  overflow: visible;\n  word-wrap: break-word;\n}\n\noffice|text::selection {\n    /** Let's not draw selection highlight that overflows into the office|text\n     * node when selecting content across several paragraphs\n     */\n    background: transparent;\n}\noffice|text * draw|text-box {\n    /** only for text documents */\n    display: block;\n    border: 1px solid #d3d3d3;\n}\noffice|spreadsheet {\n  display: block;\n  border-collapse: collapse;\n  empty-cells: show;\n  font-family: sans-serif;\n  font-size: 10pt;\n  text-align: left;\n  page-break-inside: avoid;\n  overflow: hidden;\n}\noffice|presentation {\n  display: inline-block;\n  text-align: left;\n}\n#shadowContent {\n  display: inline-block;\n  text-align: left;\n}\ndraw|page {\n  display: block;\n  position: relative;\n  overflow: hidden;\n}\npresentation|notes, presentation|footer-decl, presentation|date-time-decl {\n    display: none;\n}\n@media print {\n  draw|page {\n    border: 1pt solid black;\n    page-break-inside: avoid;\n  }\n  presentation|notes {\n    /*TODO*/\n  }\n}\noffice|spreadsheet text|p {\n  border: 0px;\n  padding: 1px;\n  margin: 0px;\n}\noffice|spreadsheet table|table {\n  margin: 3px;\n}\noffice|spreadsheet table|table:after {\n  /* show sheet name the end of the sheet */\n  /*content: attr(table|name);*/ /* gives parsing error in opera */\n}\noffice|spreadsheet table|table-row {\n  counter-increment: row;\n}\noffice|spreadsheet table|table-row:before {\n  width: 3em;\n  background: #cccccc;\n  border: 1px solid black;\n  text-align: center;\n  content: counter(row);\n  display: table-cell;\n}\noffice|spreadsheet table|table-cell {\n  border: 1px solid #cccccc;\n}\ntable|table {\n  display: table;\n}\ndraw|frame table|table {\n  width: 100%;\n  height: 100%;\n  background: white;\n}\ntable|table-header-rows {\n  display: table-header-group;\n}\ntable|table-row {\n  display: table-row;\n}\ntable|table-column {\n  display: table-column;\n}\ntable|table-cell {\n  width: 0.889in;\n  display: table-cell;\n  word-break: break-all; /* prevent long words from extending out the table cell */\n}\ndraw|frame {\n  display: block;\n}\ndraw|image {\n  display: block;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n  background-repeat: no-repeat;\n  background-size: 100% 100%;\n  -moz-background-size: 100% 100%;\n}\n/* only show the first image in frame */\ndraw|frame > draw|image:nth-of-type(n+2) {\n  display: none;\n}\ntext|list:before {\n    display: none;\n    content:\"\";\n}\ntext|list {\n    counter-reset: list;\n}\ntext|list-item {\n    display: block;\n}\ntext|number {\n    display:none;\n}\n\ntext|a {\n    color: blue;\n    text-decoration: underline;\n    cursor: pointer;\n}\ntext|note-citation {\n    vertical-align: super;\n    font-size: smaller;\n}\ntext|note-body {\n    display: none;\n}\ntext|note:hover text|note-citation {\n    background: #dddddd;\n}\ntext|note:hover text|note-body {\n    display: block;\n    left:1em;\n    max-width: 80%;\n    position: absolute;\n    background: #ffffaa;\n}\nsvg|title, svg|desc {\n    display: none;\n}\nvideo {\n    width: 100%;\n    height: 100%\n}\n\n/* below set up the cursor */\ncursor|cursor {\n    display: inline;\n    width: 0px;\n    height: 1em;\n    /* making the position relative enables the avatar to use\n       the cursor as reference for its absolute position */\n    position: relative;\n    z-index: 1;\n}\ncursor|cursor > span {\n    display: inline;\n    position: absolute;\n    top: 5%; /* push down the caret; 0px can do the job, 5% looks better, 10% is a bit over */\n    height: 1em;\n    border-left: 2px solid black;\n    outline: none;\n}\n\ncursor|cursor > div {\n    padding: 3px;\n    box-shadow: 0px 0px 5px rgba(50, 50, 50, 0.75);\n    border: none !important;\n    border-radius: 5px;\n    opacity: 0.3;\n}\n\ncursor|cursor > div > img {\n    border-radius: 5px;\n}\n\ncursor|cursor > div.active {\n    opacity: 0.8;\n}\n\ncursor|cursor > div:after {\n    content: ' ';\n    position: absolute;\n    width: 0px;\n    height: 0px;\n    border-style: solid;\n    border-width: 8.7px 5px 0 5px;\n    border-color: black transparent transparent transparent;\n\n    top: 100%;\n    left: 43%;\n}\n\n\n.editInfoMarker {\n    position: absolute;\n    width: 10px;\n    height: 100%;\n    left: -20px;\n    opacity: 0.8;\n    top: 0;\n    border-radius: 5px;\n    background-color: transparent;\n    box-shadow: 0px 0px 5px rgba(50, 50, 50, 0.75);\n}\n.editInfoMarker:hover {\n    box-shadow: 0px 0px 8px rgba(0, 0, 0, 1);\n}\n\n.editInfoHandle {\n    position: absolute;\n    background-color: black;\n    padding: 5px;\n    border-radius: 5px;\n    opacity: 0.8;\n    box-shadow: 0px 0px 5px rgba(50, 50, 50, 0.75);\n    bottom: 100%;\n    margin-bottom: 10px;\n    z-index: 3;\n    left: -25px;\n}\n.editInfoHandle:after {\n    content: ' ';\n    position: absolute;\n    width: 0px;\n    height: 0px;\n    border-style: solid;\n    border-width: 8.7px 5px 0 5px;\n    border-color: black transparent transparent transparent;\n\n    top: 100%;\n    left: 5px;\n}\n.editInfo {\n    font-family: sans-serif;\n    font-weight: normal;\n    font-style: normal;\n    text-decoration: none;\n    color: white;\n    width: 100%;\n    height: 12pt;\n}\n.editInfoColor {\n    float: left;\n    width: 10pt;\n    height: 10pt;\n    border: 1px solid white;\n}\n.editInfoAuthor {\n    float: left;\n    margin-left: 5pt;\n    font-size: 10pt;\n    text-align: left;\n    height: 12pt;\n    line-height: 12pt;\n}\n.editInfoTime {\n    float: right;\n    margin-left: 30pt;\n    font-size: 8pt;\n    font-style: italic;\n    color: yellow;\n    height: 12pt;\n    line-height: 12pt;\n}\n\n.annotationWrapper {\n    display: inline;\n    position: relative;\n}\n\n.annotationRemoveButton:before {\n    content: '\u00d7';\n    color: white;\n    padding: 5px;\n    line-height: 1em;\n}\n\n.annotationRemoveButton {\n    width: 20px;\n    height: 20px;\n    border-radius: 10px;\n    background-color: black;\n    box-shadow: 0px 0px 5px rgba(50, 50, 50, 0.75);\n    position: absolute;\n    top: -10px;\n    left: -10px;\n    z-index: 3;\n    text-align: center;\n    font-family: sans-serif;\n    font-style: normal;\n    font-weight: normal;\n    text-decoration: none;\n    font-size: 15px;\n}\n.annotationRemoveButton:hover {\n    cursor: pointer;\n    box-shadow: 0px 0px 5px rgba(0, 0, 0, 1);\n}\n\n.annotationNote {\n    width: 4cm;\n    position: absolute;\n    display: inline;\n    z-index: 10;\n}\n.annotationNote > office|annotation {\n    display: block;\n    text-align: left;\n}\n\n.annotationConnector {\n    position: absolute;\n    display: inline;\n    z-index: 2;\n    border-top: 1px dashed brown;\n}\n.annotationConnector.angular {\n    -moz-transform-origin: left top;\n    -webkit-transform-origin: left top;\n    -ms-transform-origin: left top;\n    transform-origin: left top;\n}\n.annotationConnector.horizontal {\n    left: 0;\n}\n.annotationConnector.horizontal:before {\n    content: '';\n    display: inline;\n    position: absolute;\n    width: 0px;\n    height: 0px;\n    border-style: solid;\n    border-width: 8.7px 5px 0 5px;\n    border-color: brown transparent transparent transparent;\n    top: -1px;\n    left: -5px;\n}\n\noffice|annotation {\n    width: 100%;\n    height: 100%;\n    display: none;\n    background: rgb(198, 238, 184);\n    background: -moz-linear-gradient(90deg, rgb(198, 238, 184) 30%, rgb(180, 196, 159) 100%);\n    background: -webkit-linear-gradient(90deg, rgb(198, 238, 184) 30%, rgb(180, 196, 159) 100%);\n    background: -o-linear-gradient(90deg, rgb(198, 238, 184) 30%, rgb(180, 196, 159) 100%);\n    background: -ms-linear-gradient(90deg, rgb(198, 238, 184) 30%, rgb(180, 196, 159) 100%);\n    background: linear-gradient(180deg, rgb(198, 238, 184) 30%, rgb(180, 196, 159) 100%);\n    box-shadow: 0 3px 4px -3px #ccc;\n}\n\noffice|annotation > dc|creator {\n    display: block;\n    font-size: 10pt;\n    font-weight: normal;\n    font-style: normal;\n    font-family: sans-serif;\n    color: white;\n    background-color: brown;\n    padding: 4px;\n}\noffice|annotation > dc|date {\n    display: block;\n    font-size: 10pt;\n    font-weight: normal;\n    font-style: normal;\n    font-family: sans-serif;\n    border: 4px solid transparent;\n}\noffice|annotation > text|list {\n    display: block;\n    padding: 5px;\n}\n\n/* This is very temporary CSS. This must go once\n * we start bundling webodf-default ODF styles for annotations.\n */\noffice|annotation text|p {\n    font-size: 10pt;\n    color: black;\n    font-weight: normal;\n    font-style: normal;\n    text-decoration: none;\n    font-family: sans-serif;\n}\n\ndc|*::selection {\n    background: transparent;\n}\ndc|*::-moz-selection {\n    background: transparent;\n}\n\n#annotationsPane {\n    background-color: #EAEAEA;\n    width: 4cm;\n    height: 100%;\n    display: none;\n    position: absolute;\n    outline: 1px solid #ccc;\n}\n\n.annotationHighlight {\n    background-color: yellow;\n    position: relative;\n}\n";

