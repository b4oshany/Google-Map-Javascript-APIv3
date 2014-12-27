/**
* Initialize google map.
* @function initialize
* 
*/
function GMaps(map_canvas, main_cords){
    this.map = null;
    this.brandUrl = 'https://developers.google.com/maps/';
    this.brand = 'Google Maps JavaScript API';
    this.markers = {};
    this.placeService = null;
    this.map_canvas = map_canvas;
    this.mapOptions = {
        zoom: 12,
        center:  {lat: 18.0030, lng: -76.7446},
    };
    this.nearbyPlacesQueryFor = {
        location: this.mapOptions.center,
        radius: 150,
        types: [],
    };
    if(main_cords){
        this.mapOptions.center = main_cords;
        this.nearbyPlacesQueryFor.location = main_cords;
    }
    this.initialize = function() {
        this.map = new google.maps.Map(document.getElementById(this.map_canvas),
            this.mapOptions);
        GMaps.isAvailable = true;
    };
    this.createMarker = function(content, place, options){
        var map = this.map
        var marker = new google.maps.Marker({
            map: map,
            place: place,
            attribution: {
                source: this.brand,
                webUrl: this.brandUrl
            }            
        });
        var infoWindow = GMaps.createInfoWindow(content);
        marker.addListener('click', function(){
            infoWindow.open(map, this);
        });
        this.markers[place.placeId] = marker;
        return marker;
    };
    this.initiateSearchService = function(){
        return new google.maps.places.PlacesService(this.map);
    };
    this.nearbyPlacesSearch = function(place, callback){
        var service = this.initiateSearchService();
        if(callback == undefined)
            callback = this.mapNearbyPlaces;
        var nearbyOptions = {
            location: place.location,
            radius: this.nearbyPlacesQueryFor.radius
        }
        service.nearbySearch(nearbyOptions, callback)
    };
    this.mapNearbyPlaces = function(results, status){
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                GMaps.activeObject.createMarker(GMaps.nearbyPlacesResultFormat(place),
                    GMaps.createPlaceByLocation(place.place_id, place.geometry.location));
            }
        }
    };
    this.requestPlaceInfo = function(place, placesNearbyTitle, infoWindowContent){
        // Initiate a place request object.
        var service = this.initiateSearchService();
        gmap = this;
        // Request Details about the Place using the Place Id.
        service.getDetails(place, function(placeResult, status) {
            // Add a marker, using the Place Id and Location instead of the position
            // attribute.
            content = (infoWindowContent != undefined)? infoWindowContent(placeResult):"Nearby Places";
            var placeGeo = {
                placeId: placeResult.place_id,
                location: placeResult.geometry.location
            }
            gmap.createMarker(content, placeGeo);
            GMaps.activeObject = gmap;
            gmap.nearbyPlacesSearch(place);
            gmap.map.setZoom(18);
            gmap.map.setCenter(place.location);
        });
    };
    this.placeMarker = function(location) {
      var marker = new google.maps.Marker({
          position: location,
          map: this.map
      });
      this.map.setCenter(location);
    };
    this.clickToAddMaker = function(){
        var gmap = this;
        google.maps.event.addListener(this.map, 'click', function(event) {
            gmap.placeMarker(event.latLng);
        });
    };
}

GMaps.createInfoWindow = function(content){
    return new google.maps.InfoWindow({
        content: content
    });
};
GMaps.createCords = function(lat, long){
    return (GMaps.isAvailable)? new google.maps.LatLng(lat, long) : {lat: lat, lng: long};
};
GMaps.createPlaceByLocation = function(placeId, location){
    return {
        // Location/place id.
        placeId: placeId,
        // Cordinates of place.
        location: location
        // query: 'stanley park vancouver bc canada'                
    }
};
GMaps.geometryToCords = function(place){
    var cords = place.geometry.location;
    return GMaps.createCords(cords.k, cords.D);
}
GMaps.nearbyPlacesResultFormat = function(place){
    var img = document.createElement("img");
    img.src = place.icon;
    var name = document.createElement("h3");
    name.innerHTML = place.name;
    var article = document.createElement("article");
    article.setAttribute("place_id", place.place_id);
    article.setAttribute("reference", place.reference);
    article.setAttribute("scope", place.scope);
    var tags = document.createElement("p");
    tags.innerHTML = place.types.toString();
    article.appendChild(img, name, tags);
    return article;
}
GMaps.activeObject = null;
GMaps.isAvaliable = false;


/**
* Detect type of device used to the view the site and adjust the map accordingly to the size.
*/
function detectBrowser() {
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map-canvas");

  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    mapdiv.style.width = '100%';
    mapdiv.style.height = '100%';
  } else {
    mapdiv.style.width = '600px';
    mapdiv.style.height = '800px';
  }
}

