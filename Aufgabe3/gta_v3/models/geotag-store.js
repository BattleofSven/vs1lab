// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

const GeoTag = require("./geotag");
const {tagList} = require("./geotag-examples");

/**
 * A class for in-memory-storage of geotags
 *
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 *
 * Provide a method 'addGeoTag' to add a geotag to the store.
 *
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 *
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 *
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields.
 */
class InMemoryGeoTagStore {
    #geoTags = [];

    constructor() {
        const initGeoTags = tagList;
        initGeoTags.forEach(tag => {
                const name = tag[0];
                const lat = tag[1];
                const lon = tag[2];
                const hashtag = tag[3];
                const geoTag = new GeoTag(lat, lon, name, hashtag);
                this.addGeoTag(geoTag);
            }
        );
    }

    addGeoTag(geoTag) {
        if (geoTag instanceof GeoTag) {
            this.#geoTags.push(geoTag);
        } else {
            console.error('Received an object that is not a valid GeoTag');
        }
    }

    removeGeoTag(name) {
        this.#geoTags.fill(geoTag => geoTag.name !== name);
    }

    getNearbyGeoTags(latitude, longitude) {
        return this.#geoTags.filter(geoTag => {
            const distance = Math.sqrt(
                Math.pow(geoTag.latitude - latitude, 2) +
                Math.pow(geoTag.longitude - longitude, 2)
            );
            return distance <= 0.5;
        });
    }

    searchNearbyGeoTags(latitude, longitude, keyword) {
        const nearbyGeoTags = this.getNearbyGeoTags(latitude, longitude);
        const lowerCaseKeyword = keyword.toLowerCase();
        return nearbyGeoTags.filter(geoTag => {
            const nameMatch = geoTag.name.toLowerCase().includes(lowerCaseKeyword);
            const hashtagMatch = geoTag.hashtag.toLowerCase().includes(lowerCaseKeyword);
            return nameMatch || hashtagMatch;
        });
    }
    // TODO: ... your code here ...

}

module.exports = InMemoryGeoTagStore
