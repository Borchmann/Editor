var BABYLON;
(function (BABYLON) {
    var EDITOR;
    (function (EDITOR) {
        var Tools = (function () {
            function Tools() {
            }
            /**
            * Returns a vector3 string from a vector3
            */
            Tools.GetStringFromVector3 = function (vector) {
                return "" + vector.x + ", " + vector.y + ", " + vector.z;
            };
            /**
            * Returns a vector3 from a vector3 string
            */
            Tools.GetVector3FromString = function (vector) {
                var values = vector.split(",");
                return BABYLON.Vector3.FromArray([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
            };
            /**
            * Opens a window popup
            */
            Tools.OpenWindowPopup = function (url, width, height) {
                var popup = null;
                var features = [
                    "width=" + width,
                    "height=" + height,
                    "top=" + window.screenY + Math.max(window.outerHeight - height, 0) / 2,
                    "left=" + window.screenX + Math.max(window.outerWidth - width, 0) / 2,
                    "status=no",
                    "resizable=yes",
                    "toolbar=no",
                    "menubar=no",
                    "scrollbars=yes"
                ];
                popup = window.open(url, "Dumped Frame Buffer", features.join(","));
                popup.focus();
                return popup;
            };
            /**
            * Opens a file browser. Checks if electron then open the dialog
            * else open the classic file browser of the browser
            */
            Tools.OpenFileBrowser = function (core, elementName, onChange, isOpenScene) {
                if (isOpenScene === void 0) { isOpenScene = false; }
                if (this.CheckIfElectron()) {
                    var dialog = require("electron").remote.dialog;
                    dialog.showOpenDialog({ properties: ["openFile", "multiSelections"] }, function (filenames) {
                        EDITOR.ElectronHelper.CreateFilesFromFileNames(filenames, isOpenScene, function (files) {
                            onChange({ target: { files: files } });
                        });
                    });
                }
                else {
                    var inputFiles = $(elementName);
                    inputFiles.change(function (data) {
                        onChange(data);
                    }).click();
                }
            };
            /**
            * Normlalizes the given URI
            */
            Tools.NormalizeUri = function (uri) {
                while (uri.indexOf("\\") !== -1)
                    uri = uri.replace("\\", "/");
                return uri;
            };
            /**
            * Returns the file extension
            */
            Tools.GetFileExtension = function (filename) {
                var index = filename.lastIndexOf(".");
                if (index < 0)
                    return filename;
                return filename.substring(index + 1);
            };
            /**
            * Returns the filename without extension
            */
            Tools.GetFilenameWithoutExtension = function (filename, withPath) {
                var lastDot = filename.lastIndexOf(".");
                var lastSlash = filename.lastIndexOf("/");
                return filename.substring(withPath ? 0 : lastSlash + 1, lastDot);
            };
            /**
            * Returns the file type for the given extension
            */
            Tools.GetFileType = function (extension) {
                switch (extension) {
                    case "png": return "image/png";
                    case "jpg":
                    case "jpeg": return "image/jpeg";
                    case "bmp": return "image/bmp";
                    case "tga": return "image/targa";
                    case "dds": return "image/vnd.ms-dds";
                    case "wav":
                    case "wave": return "audio/wav";
                    //case "audio/x-wav";
                    case "mp3": return "audio/mp3";
                    case "mpg":
                    case "mpeg": return "audio/mpeg";
                    //case "audio/mpeg3";
                    //case "audio/x-mpeg-3";
                    case "ogg": return "audio/ogg";
                    default: return "";
                }
            };
            /**
            * Returns the base URL of the window
            */
            Tools.GetBaseURL = function () {
                if (this.CheckIfElectron())
                    return __dirname + "/";
                var url = window.location.href;
                url = url.replace(BABYLON.Tools.GetFilename(url), "");
                return url;
            };
            /**
            * Checks if the editor is running in an
            * Electron window
            */
            Tools.CheckIfElectron = function () {
                var process = window.process;
                return process !== undefined;
            };
            /**
            * Creates an input element
            */
            Tools.CreateFileInpuElement = function (id) {
                var input = $("#" + id);
                if (!input[0]) {
                    $("#BABYLON-EDITOR-UTILS").append(EDITOR.GUI.GUIElement.CreateElement("input type=\"file\"", id, "display: none;"));
                    input = $("#" + id);
                }
                return input;
            };
            /**
            * Beautify a variable name (escapes + upper case)
            */
            Tools.BeautifyName = function (name) {
                var result = name[0].toUpperCase();
                for (var i = 1; i < name.length; i++) {
                    var char = name[i];
                    if (char === char.toUpperCase())
                        result += " ";
                    result += name[i];
                }
                return result;
            };
            /**
            * Cleans an editor project
            */
            Tools.CleanProject = function (project) {
                project.renderTargets = project.renderTargets || [];
                project.sounds = project.sounds || [];
                project.customMetadatas = project.customMetadatas || {};
                project.physicsEnabled = project.physicsEnabled || false;
            };
            /**
            * Returns the constructor name of an object
            */
            Tools.GetConstructorName = function (obj) {
                var ctrName = (obj && obj.constructor) ? obj.constructor.name : "";
                if (ctrName === "") {
                    ctrName = typeof obj;
                }
                return ctrName;
            };
            /**
            * Converts a boolean to integer
            */
            Tools.BooleanToInt = function (value) {
                return (value === true) ? 1.0 : 0.0;
            };
            /**
            * Converts a number to boolean
            */
            Tools.IntToBoolean = function (value) {
                return !(value === 0.0);
            };
            /**
            * Returns a particle system by its name
            */
            Tools.GetParticleSystemByName = function (scene, name) {
                for (var i = 0; i < scene.particleSystems.length; i++) {
                    if (scene.particleSystems[i].name === name)
                        return scene.particleSystems[i];
                }
                return null;
            };
            /**
            * Converts a string to an array buffer
            */
            Tools.ConvertStringToArray = function (str) {
                var len = str.length;
                var array = new Uint8Array(len);
                for (var i = 0; i < len; i++)
                    array[i] = str.charCodeAt(i);
                return array;
            };
            /**
            * Converts a base64 string to array buffer
            * Largely used to convert images, converted into base64 string
            */
            Tools.ConvertBase64StringToArrayBuffer = function (base64String) {
                var binString = window.atob(base64String.split(",")[1]);
                return Tools.ConvertStringToArray(binString);
            };
            /**
            * Adds a new file into the FilesInput class
            */
            Tools.CreateFileFromURL = function (url, callback, isTexture) {
                if (isTexture === void 0) { isTexture = false; }
                var filename = BABYLON.Tools.GetFilename(url);
                var filenameLower = filename.toLowerCase();
                if (isTexture && EDITOR.FilesInput.FilesToLoad[filenameLower]) {
                    callback(EDITOR.FilesInput.FilesToLoad[filenameLower]);
                    return;
                }
                else if (!isTexture && EDITOR.FilesInput.FilesToLoad[filenameLower]) {
                    callback(EDITOR.FilesInput.FilesToLoad[filenameLower]);
                    return;
                }
                BABYLON.Tools.LoadFile(url, function (data) {
                    var file = Tools.CreateFile(new Uint8Array(data), filename);
                    if (isTexture)
                        BABYLON.FilesInput.FilesToLoad[filename.toLowerCase()] = file;
                    else
                        BABYLON.FilesInput.FilesToLoad[filename.toLowerCase()] = file;
                    if (callback)
                        callback(file);
                }, null, null, true, function () {
                    BABYLON.Tools.Error("Cannot create file from file url : " + url);
                });
            };
            /**
            * Creates a new file object
            */
            Tools.CreateFile = function (array, filename) {
                if (array === null)
                    return null;
                /*
                var file = new File([new Blob([array])], BABYLON.Tools.GetFilename(filename), {
                    type: Tools.GetFileType(Tools.GetFileExtension(filename))
                });
                */
                // Fix for Edge, only work with "Blob" instead of "File""
                var file = new Blob([array], { type: Tools.GetFileType(Tools.GetFileExtension(filename)) });
                file.name = BABYLON.Tools.GetFilename(filename);
                return file;
            };
            /**
            * Loads, create a base64 texture and creates the associated
            * texture file
            */
            Tools.LoadAndCreateBase64Texture = function (url, scene, callback) {
                BABYLON.Tools.LoadFile(url, function (data) {
                    //debugger;
                    var filename = BABYLON.Tools.GetFilename(url);
                    var base64 = BABYLON.Tools.EncodeArrayBufferTobase64(data);
                    var texture = BABYLON.Texture.CreateFromBase64String(base64, filename, scene, false, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
                    texture.name = texture.name.replace("data:", "");
                    texture.url = texture.url.replace("data:", "");
                    BABYLON.FilesInput.FilesToLoad[filename] = Tools.CreateFile(new Uint8Array(data), filename);
                    callback(texture);
                }, null, null, true);
            };
            return Tools;
        }());
        EDITOR.Tools = Tools;
    })(EDITOR = BABYLON.EDITOR || (BABYLON.EDITOR = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.editor.tools.js.map
