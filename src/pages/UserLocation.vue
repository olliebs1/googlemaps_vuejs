<template>
    <div>
        <section class="ui two column centered grid" style="position: relative; z-index: 1;"> 
            <div class="column">
                <form action="" class="ui segment large form">
                    <div class="ui message red" v-show="error">{{ error }}</div>
                    <div class="ui segment" v-if="singleSearch">
                        <div class="field">
                            <div class="ui right icon input large" :class="{loading:originSpinner}">
                                <input type="text" placeholder="Search Map" v-model="origin" id="originAutoComplete">
                                <i class="dot circle link icon" @click="originLocatorButtonPressed"></i>
                            </div>
                        </div>
                        <button class="ui right inverted primary button" @click="directionSearch">Directions</button>
                    </div>
                    <div class="ui segment" v-else>
                        <div class="field">
                            <div class="ui right icon input large" :class="{loading:originSpinner}">
                                <input type="text" placeholder="Origin" v-model="origin" id="originAutoComplete">
                                <i class="dot circle link icon" @click="originLocatorButtonPressed"></i>
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui right icon input large" :class="{loading:destinationSpinner}">
                                <input type="text" placeholder="Destination" v-model="destination" id="destinationAutoComplete">
                                <i class="dot circle link icon" @click="destinationLocatorButtonPressed"></i>
                            </div>
                        </div>
                        <button class="ui right inverted primary button" v-if="directionButton">Directions</button>
                        <div class="ui buttons" v-else>
                        <button class="ui button">Cancel</button>
                        <div class="or"></div>
                        <button class="ui primary button">Direct</button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
        <section id="map"></section>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            origin: "",
            destination: "",
            singleSearch: true,
            directionButton: true,
            cancelSwitch: false,
            error: "",
            originSpinner: false,
            destinationSpinner: false,
        }
    },
    mounted() {
        let originAutocomplete = new google.maps.places.Autocomplete(
            document.getElementById("originAutoComplete")
        );
        originAutocomplete.addListener("place_changed", () => {
           let place = autocomplete.getPlace();
           this.showUserLocationOnTheMap(place.geometry.location.lat(), place.geometry.location.lng())
        });
        this.originLocatorButtonPressed();
    },
    methods: {
        directionSearch() {
            this.singleSearch = false;
            this.directionButton = false;
            this.cancelSwitch = true;

             let destinationAutocomplete = new google.maps.places.Autocomplete(
            document.getElementById("originAutoComplete")
        );
        destinationAutocomplete.addListener("place_changed", () => {
           let place = autocomplete.getPlace();
           this.showUserLocationOnTheMap(place.geometry.location.lat(), place.geometry.location.lng())
        });
        },
        originLocatorButtonPressed() {
            this.spinner = true;
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                        this.getOriginFrom(position.coords.latitude, position.coords.longitude
                        );
                        this.showUserLocationOnTheMap(position.coords.latitude, position.coords.longitude)
                    },
                    error => {
                        this.error = "Locator is unable to find the address. Please enter your address manually.";
                        this.spinner = false;
                    }
                );
            } else {
                this.error = error.message
                this.spinner = false;
            }
        },
        destinationLocatorButtonPressed() {
            this.spinner = true;
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                        this.getDestinationFrom(position.coords.latitude, position.coords.longitude
                        );
                        this.showUserLocationOnTheMap(position.coords.latitude, position.coords.longitude)
                    },
                    error => {
                        this.error = "Locator is unable to find the address. Please enter your address manually.";
                        this.spinner = false;
                    }
                );
            } else {
                this.error = error.message
                this.spinner = false;
            }
        },
        getOriginFrom(lat, long) {
            axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=APIKEY")
                 .then(response => {
                     if(response.data.error_message) {
                         this.error = response.data.error_message
                     } else {
                         this.origin = response.data.results[0].formatted_address
                     }
                    this.spinner = false;
                })
                .catch(error => {
                    this.error = error.message
                    this.spinner = false;
                })
        },
        getDestinationFrom(lat, long) {
            axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=APIKEY")
                 .then(response => {
                     if(response.data.error_message) {
                         this.error = response.data.error_message
                     } else {
                         this.destination = response.data.results[0].formatted_address
                     }
                    this.spinner = false;
                })
                .catch(error => {
                    this.error = error.message
                    this.spinner = false;
                })
        },
        showUserLocationOnTheMap(latitude, longitude) {
            let map = new google.maps.Map(document.getElementById("map"), {
                zoom: 13,
                center: new google.maps.LatLng(latitude, longitude),
            });
            new google.maps.Marker({
                position: new google.maps.LatLng(latitude, longitude),
                map:map
            })
        }
    }
}
</script>


<style>
.ui.button, .dot.circle.icon {
    background-color: #ff5a5f;
    color: white;
}
.pac-icon {
    display: none;
}
.pac-item {
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
}
.pac-item:hover {
    background-color: #ececec;   
}
.pac-item-query {
    font-size: 16px;
}

#map {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>