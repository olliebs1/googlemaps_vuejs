import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Font Awesome 
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { faDiamondTurnRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


const app = createApp(App);
// library.add(faDiamondTurnRight)

app.component('font-awesome-icon', FontAwesomeIcon).use(router).mount('#app')
