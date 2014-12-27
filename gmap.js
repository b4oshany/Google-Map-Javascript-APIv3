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
    /**
    * @property {object} settings                           - GMaps object settings.
    * @property {boolean} showPlacesNearby                  - Set to true if places nearby should be shown near
    *   the default or centered location.
    * @property {object} location                           - The default location of the map. This is also used by
    *   the queries.
    * @property {boolean} placeCenter                       - Set to true, if the current contexted place is to be set as a the
    *   center of the map.
    * @property {boolean} clearMapOnQuery                   - Clear the map any time a new search is made. This is done to
    *   facilitate new map data vs old map data.
    * @property {int} limitResults                          - Set the amount of search results to be shown on the map.
    */
    this.settings = {
        showPlacesNearby: false,
        location: {lat: 18.0030, lng: -76.7446},
        limitResults: 10,
        placeCenter: false,
        clearMapOnSearch: true
    }
    /**
    * @property {int} zoom                                  - Zoom Level of the map, which ranges from 1-22.
    *   This can be invoke throw the map.setZooom method.
    * @property {object} center                             - Set the given location as the center of the map.
    *   This can be invoke through the map.setCenter function. 
    */
    this.mapOptions = {
        zoom: 12
    };
    /**
    * @property {object} queryBy                            - Type of queries that can be done.
    * @property {object} queryBy.map                        - The map to be queried.
    * @property {object} queryBy.nearbyPlaces               - Query places by nearby palces.
    * @property {object} queryBy.nearbyPlaces.location      - Location of object.
    * @property {int} queryBy.nearbyPlaces.radius           - Radius (in meters) of the location to be query.
    * @property {string[]} queryBy.nearbyPlaces.types       - List of types of places to be return in the query result.
    * @property {object} queryBy.text                       - Query places by string.
    * @property {string} queryBy.text.query                 - Query text to search for places.
    * @proeprty {boolean} queryBy.text.openNow              - Set to true if only business or places that are currently open
    *   should be include in the result.
    * @property {object} queryBy.text.bounds                - (google.maps.LatLngBounds) Boundary of the places to be query.
    * @property {object} queryBy.text.location              - (google.maps.LatLng) Location of the place to be query.
    * @property {string[]} queryBy.text.types               - List of types of places to be return in the query result.
    * @property {int} queryBy.text.radius                   - Radius of the location to be query.
    */
    this.queryBy = {
        map: this,
        center: true,
        updateLocation: function(location){
            this.nearbyPlaces.location = location;
        },
        nearbyPlaces: {
            location: this.mapOptions.center,
            radius: 150,
            types: [],
        },
        text: {
            query: '',
            openNow: false,
            types: [],
        }
    };
    if(main_cords != undefined){
        this.mapOptions.center = main_cords;
        this.queryBy.updateLocation(main_cords);
    }
    /**
    * Initiate google maps.
    */
    this.initialize = function() {
        GMaps.activeMap = this;
        this.map = new google.maps.Map(document.getElementById(this.map_canvas),
            this.mapOptions);
        GMaps.isAvailable = true;
    };
    /**
    * Create a marker and add it to the map.
    * @return google.maps.Marker
    */
    this.createMarker = function(content, place, options){
        GMaps.activeMap = this;
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
        if(this.settings.showPlacesNearby){
            this.nearbyPlacesSearch(place);
        }
        this.setCenter(place);
        return marker;
    };
    /**
    * Create a place service.
    * @return google.maps.palces.PlacesService
    */
    this.initiateSearchService = function(){
        GMaps.activeMap = this;
        return new google.maps.places.PlacesService(this.map);
    };
    /**
    * Perform a nearby search.
    */
    this.nearbyPlacesSearch = function(place, callback, options){
        var service = this.initiateSearchService();
        if(callback == undefined)
            callback = this.mapQueryResult;
        options = this.queryBy.nearbyPlaces;
        options.location = place.location;
        service.nearbySearch(options, callback)
    };
    /**
    * Perform the text search.
    * @param {string} searchText                        - Text to query by.
    * @callback {resultCallback} callback               - Callback function to render
    *   the query result. By default it uses GMaps.mapQueryResult function.
    * @param {object} options                           - Additional query options.
    */
    this.textSearch = function(searchText, callback, options){
        var service = this.initiateSearchService();
        if(callback == undefined)
            callback = this.mapQueryResult;
        options = this.queryBy.text;
        options.query = searchText;
        if(this.settings.clearMapOnSearch)
            this.clearMap();
        service.textSearch(options, callback);
    }
    /**
    * Add the query result to the map.
    */
    this.mapQueryResult = function(results, status){
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length && i < GMaps.activeMap.settings.limitResults; i++) {
                var place = results[i];
                GMaps.activeMap.createMarker(GMaps.formatQueryResult(place),
                    GMaps.createPlaceByLocation(place.place_id, place.geometry.location));
            }
        }
    };
    /**
    * Request information of a location.
    * @param {object} place Location object.
    * @param {object} InfoWindow to add the place information.
    */
    this.requestPlaceInfo = function(place, infoWindowContent){
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
            gmap.map.setZoom(18);
            if(gmap.settings.showPlacesNearby){
                gmap.nearbyPlacesSearch(place);
                gmap.map.setCenter(place.location);
            }
        });
    };
    /**
    * Place marker on the map and center it.
    */
    this.placeMarker = function(location) {
      var marker = new google.maps.Marker({
          position: location,
          map: this.map
      });
    };
    /**
    * Add Marker when the map is clicked.
    */
    this.clickToAddMaker = function(){
        var gmap = this;
        google.maps.event.addListener(this.map, 'click', function(event) {
            gmap.placeMarker(event.latLng);
        });
    };
    /**
    * Clear map of all markers.
    */
    this.clearMap = function(){
        for(x in this.markers){
            this.markers[x].setMap(null);
        }
        this.markers = [];
    }
    /**
    * Set the given place as the center of the map.
    * In addition, it ensure no other place can be set as the center without the interaction.
    * @param {object} place                                 - Place object.
    */
    this.setCenter = function(place){
        if(this.settings.placeCenter){
            this.map.setCenter(place.location);
            this.mapOptions = place.location;
            this.settings.placeCenter = false;
        }
    }
}

/**
* Create an Google Map InfoWindow.
* @return google.maps.InfoWindow
*/
GMaps.createInfoWindow = function(content){
    return new google.maps.InfoWindow({
        content: content
    });
};

/**
* Create a cordinate object.
* @return google.maps.LatLng|object.
*/
GMaps.createCords = function(lat, long){
    return (GMaps.isAvailable)? new google.maps.LatLng(lat, long) : {lat: lat, lng: long};
};

/**
* Create place by placeId and location.
* @return object.
*/
GMaps.createPlaceByLocation = function(placeId, location){
    return {
        // Location/place id.
        placeId: placeId,
        // Cordinates of place.
        location: location
        // query: 'stanley park vancouver bc canada'                
    }
};

/**
* Create a boundary on map.
* @param {object} southWestCords                             - South west cordinates of the boundary.
* @param {object} northEastCords                             - North east cordinates of the boundary.
* @return google.maps.LatLngBounds.
*/
GMaps.createBoundary = function(southWestCords, northEastCords){
    return google.maps.LatLngBounds(southWestCords, northEastCords);
}

/**
* Extract the cordinates from a place geometry.
* @return google.maps.LatLng|object
*/
GMaps.geometryToCords = function(place){
    var cords = place.geometry.location;
    return GMaps.createCords(cords.k, cords.D);
}

/**
* Generate a HTML layout for the query result.
* @return DOMHTMLDocument.
*/
GMaps.formatQueryResult = function(place){
    var img = document.createElement("img");
    img.src = place.icon;
    var name = document.createElement("h3");
    var article = document.createElement("article");
    article.setAttribute("place_id", place.place_id);
    article.setAttribute("reference", place.reference);
    article.setAttribute("scope", place.scope);
    var tags = document.createElement("p");
    tags.innerHTML = place.types.toString();
    name.appendChild(img);
    name.innerHTML += place.name;
    article.appendChild(name);
    article.appendChild(tags);
    return article;
} 
GMaps.activeMap = null;
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

