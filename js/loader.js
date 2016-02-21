THREE.Cache.enabled = true;

var loaderFiles = require('./loader-files');
var _ = require('underscore');
var jsonLoadFunction = require('./functions').loadJSON;

function load(url, onLoad, name){
    var scope = this;

    var texturePath = this.texturePath && ( typeof this.texturePath === "string" ) ? this.texturePath : THREE.Loader.prototype.extractUrlBase( url );

    var loader = new THREE.XHRLoader( this.manager );
    loader.setCrossOrigin( this.crossOrigin );
    loader.setWithCredentials( this.withCredentials );
    loader.load( url, function ( text ) {

        var json = JSON.parse( text );
        var metadata = json.metadata;

        if ( metadata !== undefined ) {

            if ( metadata.type === 'object' ) {

                console.error( 'THREE.JSONLoader: ' + url + ' should be loaded with THREE.ObjectLoader instead.' );
                return;

            }

            if ( metadata.type === 'scene' ) {

                console.error( 'THREE.JSONLoader: ' + url + ' should be loaded with THREE.SceneLoader instead.' );
                return;

            }

        }

        var object = scope.parse( json, texturePath );
        onLoad( object.geometry, object.materials, name );

    });
}

var Loader = function() {
    _.bindAll(this, 'onLoadModel', 'onLoadImage', 'onLoadJson');

    this.ASSETS_LOADED = 'assetsLoaded';

    this.fileLength = 0;
    this.fileCount = 0;

    this.jsonLoader = new THREE.JSONLoader();
    this.jsonLoader.load = load;
    this.imageLoader = new THREE.ImageLoader();
};

THREE.EventDispatcher.prototype.apply( Loader.prototype );

Loader.prototype.start = function(){
    var modelFiles = loaderFiles.models;
    var imageFiles = loaderFiles.images;
    var jsonFiles  = loaderFiles.json;


    if(modelFiles.length > -1) {
        modelFiles.forEach(function (modelFile) {
            var jsonFileUrl = modelFile.directory;
            var jsonFileName = modelFile.name;
            this.jsonLoader.load(jsonFileUrl, this.onLoadModel, jsonFileName)

            this.fileLength++;
        }.bind(this));
    }

    if(imageFiles.length > -1) {
        imageFiles.forEach(function (imageFile) {
            var imageFileUrl = imageFile.directory;
            var imageFileName = imageFile.name;
            //console.log(imageFileUrl);
            this.imageLoader.load(imageFileUrl, this.onLoadImage);
            this.fileLength++;
        }.bind(this));
    }

    if(jsonFiles.length > -1) {
        jsonFiles.forEach(function (jsonFile) {
            var jsonName = jsonFile.name;
            var jsonUrl = jsonFile.directory;

            jsonLoadFunction(this.onLoadJson, jsonUrl, jsonName);

            this.fileLength++;
        }.bind(this));
    }


    if(this.fileLength == 0){
        this.dispatchEvent({type: this.ASSETS_LOADED});
    }
};

Loader.prototype.onLoadModel = function(geometry, materials, name){
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.computeMorphNormals();

    window.app.assets.model[name] = {geometry: geometry, material: materials[0]};

    this.fileCount++;
    //console.log(this.fileCount + "/" + this.fileLength);
    if(this.fileCount == this.fileLength) this.loaded();
};

Loader.prototype.onLoadImage = function(image){
    this.fileCount++;
    //console.log(this.fileCount + "/" + this.fileLength);
    if(this.fileCount == this.fileLength) this.loaded();
};

Loader.prototype.onLoadJson = function(response, fileName){
    var dataJson = JSON.parse(response);
    //https://www.instagram.com/kenji_special/
    window.app.assets.json[fileName] = dataJson;
    this.fileCount++;
    //console.log(this.fileCount + "/" + this.fileLength);
    if(this.fileCount == this.fileLength) this.loaded();
};

Loader.prototype.loaded = function(){
    var imageFiles = loaderFiles.images;
    imageFiles.forEach(function(imageFile){
        var imageFileUrl  = imageFile.directory;
        var imageFileName = imageFile.name;
        var image = THREE.Cache.get(imageFileUrl);
        var texture = new THREE.Texture(image);
        texture.magFilter = texture.minFilter = THREE.LinearFilter;
        texture.needsUpdate = true;

        window.app.assets.texture[imageFileName] = texture;
    });

    this.dispatchEvent({type: this.ASSETS_LOADED});
}

Loader.prototype.getRate = function(){
    return this.fileCount / this.fileLength ? this.fileCount / this.fileLength : 0;
};

module.exports = Loader;
