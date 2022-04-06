<template>
    <section class="ui two column centered grid"> 
        <div class="column">
            <form action="" class="ui segment large form">
                <div class="ui message red" v-show="error">{{ error }}</div>
                <div class="ui segment">
                    <div class="field">
                        <div class="ui right icon input large" :class="{loading:spinner}">
                            <input type="text" placeholder="Enter Your Address" v-model="address">
                            <i class="dot circle link icon" @click="locatorButtonPressed"></i>
                        </div>
                    </div>
                    <button class="ui button">Go!</button>
                </div>
            </form>
        </div>
    </section>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            address: "",
            error: "",
            spinner: false,
        }
    },
    methods: {
        locatorButtonPressed() {
            this.spinner = true;
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                        this.getAddressFrom(position.coords.latitude, position.coords.longitude);
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
        getAddressFrom(lat, long) {
            console.log(process.env.VUE_APP_APIKEY)
            axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=APIKEY")
                 .then(response => {
                     if(response.data.error_message) {
                         this.error = response.data.error_message
                     } else {
                         this.address = response.data.results[0].formatted_address
                     }
                    this.spinner = false;
                })
                .catch(error => {
                    this.error = error.message
                    this.spinner = false;
                })
        }
    }
}
</script>


<style scoped>
.ui.button, .dot.circle.icon {
    background-color: #ff5a5f;
    color: white;
}
</style>