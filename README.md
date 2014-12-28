Google-Map-Javascript-APIv3
===========================

Google Map Javascript API version 3, written in Object Orientated Programming for better control over Google Map.

## Getting Started
```HTML
<div id="map-canvas"></div>
<script src="https://maps.googleapis.com/maps/api/js?key=APIKey&region=JAM&callback=mapInitializer&signed_in=true&libraries=places" type="text/javascript"></script>
<script="gmap.js"></script>
```

```Javascript
function mapInitializer(){

    // Create GMaps object and pass in the map canvas id as an argument. 
    var gmap = new GMaps('map-canvas');
    // Initiate the loading of google map data.
    gmap.initialize();
    // Set showPlacesNearby to false, to ensure no nearby places are
    // shown (by default they are shown since showPlacesNearby is set to true).
    gmap.settings.showPlacesNearby = false;
    // The cordinates of a restaurant in Sydney, US.
    var pyr = GMaps.createCords(-33.8665433,151.1956316);
    // Create a place object based on google place_id and place cordinates. 
    var place = GMaps.createPlaceByLocation('ChIJN1t_tDeuEmsRUsoyG83frY4', pyr);
    // Center the first result of the query on the map.
    gmap.settings.placeCenter = true
    // Add marker to map.
    gmap.createMarker('Google Sydney', place);
}
```

In addition you can request a place information by doing the following:

```Javascript
    // Center the first result of the query on the map.
    gmap.settings.placeCenter = true
    // Request information for Sydney.
    gmap.requestPlaceInfo(place);
```

Another way of getting a place is to search by text as seen below.

```Javascript
    // Center the first result of the query on the map.
    gmap.settings.placeCenter = true
    // Search for a place in Jamaica called 'Kingston'.
    gmap.textSearch("Kingston");
```

The snippet below is how to add a marker and make it draggable after a search is done.

```Javascript    
    // Get the property address string.
    var address = $(".property_address address").text();
    // Limit the result to one.
    gmap.settings.limitResults = 1;
    // Perform a search query based on the address string.
    // In addition, override the default callback function by supplying a function as the
    // the second argument. This function takes in the results of the search and the status.
    gmap.textSearch(address, function(results, status){
        // Use the actually default callback function to filter places but override the
        // creation of markers by supply a function as the third argument in the mapQueryResult function. This function
        // takes in the current indexed place and the index number within the filter process.
        gmap.mapQueryResult(results, status, function(place, index){
            // Note. We don't have to manage the result status since it is already been taken care of by the mapQueryResult function.
            // Now that we are in the filtering process of places, we can create markers or do anything we like.
            // In this case, I'm adding additional options (i.e. allow the marker to be draggable)
            // to the marker.
            gmap.createMarker(
                GMaps.formatQueryResult(place),
                place.geometry.location,
                { draggable: true }
            );
        });
    });
```

Author
----------
[Oshane Bailey]

[Oshane Bailey]: https://github.com/b4oshany
