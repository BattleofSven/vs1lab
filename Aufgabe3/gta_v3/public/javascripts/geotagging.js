// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");



/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...
function updateLocation() {
    const latitudeInput = document.getElementById('latitude-input');
    const longitudeInput = document.getElementById('longitude-input');

    const mapElement = document.getElementById('map');
    const tagsJson = mapElement.getAttribute('data-tags');
    const tagListArray = JSON.parse(tagsJson);

    const setupMap = (lat, lon) => {
        const mapManager = new MapManager();
        mapManager.initMap(lat, lon);
        mapManager.updateMarkers(lat, lon, tagListArray);

        const mapView = document.getElementById('mapView');
        if (mapView) {
            mapView.remove();
        }
    };

    if (latitudeInput.value && longitudeInput.value) {
        return;
    }

    if (latitudeInput.value && longitudeInput.value && latitudeInput.value !== "0") {
        setupMap(latitudeInput.value, longitudeInput.value);
    }
    else {
        LocationHelper.findLocation((location) => {
            latitudeInput.value = location.latitude;
            longitudeInput.value = location.longitude;
            document.getElementById('search-latitude').value = location.latitude;
            document.getElementById('search-longitude').value = location.longitude;

            setupMap(location.latitude, location.longitude);
        });
    }
}


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});