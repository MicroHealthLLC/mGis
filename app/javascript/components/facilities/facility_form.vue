<template>
  <form id="facilities-form" @submit.prevent="saveFacilitiy" class="mx-auto needs-validations" accept-charset="UTF-8">
    <div v-if="showErrors" class="text-danger mb-3">Please fill the required feilds before submitting</div>
    <div class="form-group">
      <label>Facility Name:</label>
      <input name="Facility Name" v-validate="'required'" type="text" class="form-control" v-model="DV_facility.facilityName" placeholder="Microhealthllc facility" :class="{'form-control': true, 'error': errors.has('Facility Name') }" />
      <div v-show="errors.has('Facility Name')" class="text-danger">{{ errors.first('Facility Name') }}</div>
    </div>
    <div class="form-group">
      <label>Facility Group:</label>
      <select name="Facility Group" class="form-control" v-model="DV_facility.facilityGroupId" v-validate="'required'" :class="{'form-control': true, 'error': errors.has('Facility Group')}">
        <option
          v-for="region in regions"
          :value="region.id"
          >
          {{region.name}}
        </option>
      </select>
      <span v-show="errors.has('Facility Group')" class="text-danger">{{ errors.first('Facility Group') }}</span>
    </div>
    <div class="form-group">
      <label>Street Address:</label>
      <GmapAutocomplete
        name="Street Address"
        @place_changed="updateAddress"
        class="form-control"
        :value="DV_facility.address"
        @input="DV_facility.address=$event.target.value"
        :class="{'error': errors.has('Street Address')}"
        @keypress.enter="$event.preventDefault"
      />
      <div v-show="errors.has('Street Address')" class="text-danger">{{ errors.first('Street Address') }}</div>
    </div>
    <div class="form-group">
      <label>Point of Contact:</label>
      <input name="Point of Contact" v-validate="'required'" type="text" class="form-control" placeholder="John. Doe" v-model="DV_facility.pointOfContact" :class="{'form-control': true, 'error': errors.has('Point of Contact') }" />
      <div v-show="errors.has('Point of Contact')" class="text-danger">{{ errors.first('Point of Contact') }}</div>
    </div>
    <div class="form-group">
      <label>Phone Number:</label>
      <vue-tel-input
        v-model="DV_facility.phoneNumber"
        :required="true"
        :valid-characters-only="true"
        :only-countries="['US', 'CA']"
        name="phonenumber"
        default-country="US"
        @input="checkPhoneValidation"
        class="form-control"
        :class="{'error': errors.has('phonenumber')}"
      />
      <div v-show="errors.has('phonenumber')" class="text-danger">{{ errors.first('phonenumber') }}</div>
    </div>
    <div class="form-group">
      <label>Email:</label>
      <input name="email" v-validate="'required|email'" type="text" class="form-control" placeholder="johndoe@example.com" v-model="DV_facility.email" :class="{'form-control': true, 'error': errors.has('email') }" />
      <div v-show="errors.has('email')" class="text-danger">{{ errors.first('email') }}</div>
    </div>
    <div class="form-group">
      <label>Description:</label>
      <textarea class="form-control" placeholder="briefly describe here.." v-model="DV_facility.notes" rows="5"></textarea>
    </div>
    <div class="d-flex flex-row-reverse form-group mt-4">
      <button :disabled="!readyToSave" class="btn btn-success w-0">Save</button>
      <button @click.prevent="$emit('close-facility')" class="btn btn-outline-secondary w-0 mr-1">Cancel</button>
    </div>
  </form>
</template>

<script>
  import http from '../../common/http'

  export default {
    name: 'Facilitiesform',
    props: ['facility', 'regions'],

    data() {
      return {
        DV_facility: {
          facilityName: '',
          facilityGroupId: '',
          address: '',
          pointOfContact: '',
          phoneNumber: '',
          email: '',
          notes: '',
          lat: '',
          lng: ''
        },
        showErrors: false,
        addressLoading: false,
        address: {},
        addresses: []
      }
    },
    mounted() {
      if (this.facility) {
        this.DV_facility = this.facility
        this.address.formatted_address = this.facility.address
      }
    },
    methods: {
      saveFacilitiy() {
        this.$validator.validate().then((success) => {
          if (!(this.isAddressPresent() && success)) {
            this.showErrors = true
            return
          }
          var data = {facility: this.DV_facility}
          if (this.facility && this.facility.id) {
            http.put(`/projects/${this.$route.params.projectId}/facilities/${this.facility.id}.json`, data)
              .then((res) => {
                this.$emit('facility-update', res.data.facility);
              })
              .catch((err) => {
                console.error(err)
              })
          }
          else {
            http.post(`/projects/${this.$route.params.projectId}/facilities.json`, data)
              .then((res) => {
                this.$emit('facility-created', res.data.facility);
              })
              .catch((err) => {
                console.error(err)
              })
          }
        });
      },
      isAddressPresent() {
        let valid = false
        if (this.DV_facility.address) {
          this.errors.remove("Street Address")
          valid = true
        } else {
          this.errors.add({field: "Street Address", msg: "Street address is required"})
        }
        this.$forceUpdate()
        return valid
      },
      updateAddress(address) {
        this.address = address
      },
      checkPhoneValidation(input, {isValid}) {
        if (isValid) {
          this.errors.remove("phonenumber")
        } else {
          this.errors.add({field: "phonenumber", msg: "Please provide a valid Phone number"})
        }
      }
    },
    computed: {
      readyToSave() {
        return (
          this.DV_facility &&
          this.exists(this.DV_facility.facilityName) &&
          this.exists(this.DV_facility.facilityGroupId) &&
          this.exists(this.DV_facility.address) &&
          this.exists(this.DV_facility.pointOfContact) &&
          this.exists(this.DV_facility.phoneNumber) &&
          this.exists(this.DV_facility.email)
        );
      },
    },
    watch: {
      facility: {
        handler: function(value) {
          this.DV_facility = value
        },
        deep: true
      },
      address: {
        handler: function(value) {
          this.DV_facility.address = value.formatted_address
          this.errors.remove("Street Address")
          if (value.geometry) {
            this.DV_facility.lat = value.geometry.location.lat()
            this.DV_facility.lng = value.geometry.location.lng()
          }
        }, deep: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .street-address /deep/ .multiselect__select {
    display: none;
  }
  .form-control.error {
    border-color: #E84444;
  }

</style>
