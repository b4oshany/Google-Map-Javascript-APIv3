Google-Map-Javascript-APIv3
===========================

Google Map Javascript API version 3, written in Object Orientated Programming for better control over Google Map.

## Example
Include the Google map api asynchronously..
```HTML
<script src="https://maps.googleapis.com/maps/api/js?key=APIKey&amp;region=JAM&amp;callback=mapInitializer&amp;signed_in=true&amp;libraries=places" type="text/javascript"></script>
```

```Javascript
function mapInitializer(){

    // Create GMaps object passing the map canvas id. 
    var gmap = new GMaps('map-canvas');
    // Initiate the loading of google map data.
    gmap.initialize();
    // Set showPlacesNearby to false, to ensure no nearby places are shown (by default they are shown since showPlacesNearby is set to true).
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
