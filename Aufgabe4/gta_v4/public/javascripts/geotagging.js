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
let mapManager = null;
function updateLocation(geoTagsArray) {
    const latitudeInput = document.getElementById('latitude-input');
    const longitudeInput = document.getElementById('longitude-input');

    let tagsToDisplay = geoTagsArray;

    if (!tagsToDisplay) {
        const mapElement = document.getElementById('map');
        const tagsJson = mapElement ? mapElement.getAttribute('data-tags') : '[]';
        tagsToDisplay = JSON.parse(tagsJson || '[]');
    }

    const setupMap = (lat, lon) => {
        if (!mapManager) {
            mapManager = new MapManager();
            mapManager.initMap(lat, lon);
        }
        mapManager.updateMarkers(lat, lon, tagsToDisplay);

        const mapView = document.getElementById('mapView');
        if (mapView) {
            mapView.remove();
        }
    };

    if (!(latitudeInput.value && longitudeInput.value)) {
        LocationHelper.findLocation((location) => {
            document.getElementById('latitude-input').value = location.latitude;
            document.getElementById('longitude-input').value = location.longitude;

            document.getElementById('search-latitude').value = location.latitude;
            document.getElementById('search-longitude').value = location.longitude;

            setupMap(location.latitude, location.longitude);
        });
    } else {
        setupMap(latitudeInput.value, longitudeInput.value)
    }
}


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
    const taggingForm = document.getElementById('tag-form');
    if (taggingForm) {
        taggingForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('name-input').value;
            const latitude = parseFloat(document.getElementById('latitude-input').value);
            const longitude = parseFloat(document.getElementById('longitude-input').value);
            const hashtag = document.getElementById('hashtag-input').value;

            fetch('/api/geotags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ latitude, longitude, name, hashtag })
            })
                .then(response => {
                    return response.json();
                })
                .then(newTag => {
                    taggingForm.reset();

                    document.getElementById('latitude-input').value = latitude;
                    document.getElementById('longitude-input').value = longitude;

                    triggerDiscoverySearch();
                })
                .catch(error => console.error("Error:", error));
        });
    }

    const discoveryForm = document.getElementById('discoveryFilterForm');
    if (discoveryForm) {
        discoveryForm.addEventListener('submit', (event) => {
            event.preventDefault();
            triggerDiscoverySearch();
        });
    }
});

function updateDiscoveryWidget(geoTagsArray) {
    updateLocation(geoTagsArray);
    const discoveryList = document.getElementById('discoveryResults');
    if (discoveryList) {
        discoveryList.innerHTML = '';

        geoTagsArray.forEach(tag => {
            const li = document.createElement('li');
            li.textContent = `${tag.name} ( ${tag.latitude},${tag.longitude}) ${tag.hashtag} `;
            discoveryList.appendChild(li);
        });
    }
}

function triggerDiscoverySearch() {
    const latitude = parseFloat(document.getElementById('latitude-input').value);
    const longitude = parseFloat(document.getElementById('longitude-input').value);
    const searchTerm = document.getElementById('search-input')?.value || "";

    const params = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        searchTerm: searchTerm
    });

    fetch(`/api/geotags?${params.toString()}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(geoTags => {
            updateDiscoveryWidget(geoTags);
        })
}