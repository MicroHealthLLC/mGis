import                           'core-js/stable'
import                           'regenerator-runtime/runtime'
import                           'vue-multiselect/dist/vue-multiselect.min.css'
import                           'vue2-datepicker/index.css'
import                           'bootstrap-vue/dist/bootstrap-vue.css'
import _                    from 'lodash'
import Multiselect          from 'vue-multiselect'
import VModal               from 'vue-js-modal'
import * as VueGoogleMaps   from 'vue2-google-maps'
import GmapCustomMarker     from 'vue2-gmap-custom-marker'
import App                  from '../App.vue'
import router               from 'routers/dashboard'
import store                from './../store'
import utils                from './../mixins/utils'
import VeeValidate          from 'vee-validate'
import GmapCluster          from 'vue2-google-maps/dist/components/cluster'
import VueTelInput          from 'vue-tel-input'
import DatePicker           from 'vuejs-datepicker'
import VueSlideBar          from 'vue-slide-bar'
import FadeLoader           from 'vue-spinner/src/FadeLoader.vue'
import VTooltip             from 'v-tooltip'
import V2DatePicker         from 'vue2-datepicker'
import GanttElastic         from 'gantt-elastic'
import GanttElasticHeader   from 'gantt-elastic-header'
import VuePaginate          from 'vue-paginate'
import vco                  from "v-click-outside"
import { FontAwesomeIcon }  from '@fortawesome/vue-fontawesome'

Vue.use(vco)
Vue.mixin(utils)
Vue.use(VTooltip)
Vue.use(VModal)
Vue.use(VueTelInput)
Vue.use(VuePaginate)
Vue.component('loader', FadeLoader)
Vue.component('gantt-elastic', GanttElastic)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('gantt-elastic-header', GanttElasticHeader)
Vue.component('vue-slide-bar', VueSlideBar)
Vue.component('date-picker', DatePicker)
Vue.component('v2-date-picker', V2DatePicker)
Vue.component('GmapCluster', GmapCluster)
Vue.component('GmapCustomMarker', GmapCustomMarker)
Vue.component('multiselect', Multiselect)
Vue.config.productionTip = false
Vue.use(VeeValidate,  { fieldsBagName: 'veeFields' })

Vue.use(VueGoogleMaps, {
  load: {
    key: window.google_api_key,
    libraries: 'places',
  },
  installComponents: true
})

var current_user = JSON.parse(window.current_user.replace(/&quot;/g,'"'))
var permissions = {}
for (var key in current_user.privilege) {
  if (['id', 'created_at', 'updated_at', 'user_id'].includes(key)) continue
  var value = current_user.privilege[key]
  permissions[key] = {
    read: value.includes('R'),
    write: value.includes('W'),
    delete: value.includes('D')
  }
}

Vue.prototype.$currentUser = current_user
Vue.prototype.$permissions = permissions

// eslint-disable-next-line no-unused-vars
const mGisApp = new Vue({
  router,
  store,
  el: '#app',
  template: '<App />',
  components: { App }
})
