
<template>
  <div id="risk-sheets">    
    <table class="table table-sm table-bordered">    
      <tr v-if="!loading" class="mx-3 mb-3 mt-2 py-4 edit-action" @click.prevent="editRisk" data-cy="risk_row" @mouseup.right="openContextMenu" @contextmenu.prevent="">
       <td class="oneFive">{{risk.text}}</td>
       <td class="eight">{{risk.riskApproach.charAt(0).toUpperCase() + risk.riskApproach.slice(1) }}</td>
       <td class="eight pt-2 font-sm">
            <span v-if="(risk.priorityLevelName) == 'Very Low'" class="gray2">{{risk.priorityLevelName}}</span> 
            <span v-if="(risk.priorityLevelName) == 'Low'" class="green1">{{risk.priorityLevelName}}</span> 
            <span v-if="(risk.priorityLevelName) == 'Moderate'" class="yellow1"> {{risk.priorityLevelName}} </span> 
            <span v-if="(risk.priorityLevelName) == 'High'" class="orange1"> {{risk.priorityLevelName}} </span> 
            <span v-if="(risk.priorityLevelName) == 'Extreme'" class="red1"> {{risk.priorityLevelName}}</span> 
       </td>
       <td class="eight">{{formatDate(risk.startDate)}}</td>
       <td class="seven">{{formatDate(risk.dueDate)}}</td>
       <td class="twelve" >
          <span v-if="(risk.responsibleUsers.length > 0) && (risk.responsibleUsers[0] !== null)"> <span class="badge mr-1 font-sm badge-secondary badge-pill">R</span>{{risk.responsibleUsers[0].name}} <br></span> 
          <span v-if="(risk.accountableUsers.length > 0) && (risk.accountableUsers[0] !== null)"> <span class="badge mr-1 font-sm badge-secondary badge-pill">A</span>{{risk.accountableUsers[0].name}}<br></span>   
           <!-- Consulted Users and Informed Users are toggle values         -->
          <span :class="{'show-all': getToggleRACI }" >             
             <span v-if="(risk.consultedUsers.length > 0) && (risk.consultedUsers[0] !== null)"> <span class="badge mr-1 font-sm badge-secondary badge-pill">C</span>{{JSON.stringify(risk.consultedUsers.map(consultedUsers => (consultedUsers.name))).replace(/]|[['"]/g, ' ')}}<br></span> 
             <span v-if="(risk.informedUsers.length > 0) && (risk.informedUsers[0] !== null)"> <span class="badge font-sm badge-secondary mr-1 badge-pill">I</span>{{JSON.stringify(risk.informedUsers.map(informedUsers => (informedUsers.name))).replace(/]|[['"]/g, ' ')}}</span>      
         </span>        
        </td>
        <td class="eight">{{risk.progress + "%"}}</td>
        <td class="eight" v-if="risk.isOverdue"><h5>x</h5></td>
        <td class="eight" v-else></td>
        <td class="eight" v-if="(risk.watched) == true"><h5>x</h5></td>
        <td class="eight" v-else></td>
       <td class="oneEight" v-if="(risk.notesUpdatedAt.length) > 0">
           <span class="toolTip" v-tooltip="('By: ' + risk.notes[0].user.fullName)">        
           {{moment(risk.notesUpdatedAt[0]).format('DD MMM YYYY, h:mm a')}}
           </span>
           <br> {{risk.notes[0].body}}
        </td>
        <td v-else class="oneEight">No Updates</td>
      </tr>
      <!-- The context-menu appears only if table row is right-clicked -->
      <RiskContextMenu
        :facilities="facilities"
        :facilityGroups="facilityGroups"
        :risk="risk"
        :display="showContextMenu"
        ref="menu"
        @open-risk="editRisk">  
      </RiskContextMenu>
    </table>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from "vuex"
  // import IssueForm from "./../issues/issue_form"
  import RiskContextMenu from "../../../shared/RiskContextMenu"
  import moment from 'moment'
  Vue.prototype.moment = moment

  export default {
    name: 'RiskSheets',
    components: {
      RiskContextMenu 
    },
    props: {
      fromView: {
        type: String,
        default: 'map_view'
      },
      risk: Object
    },
    data() {
      return {
        loading: true,
        now: new Date().toISOString(),
        DV_risk: {},
        DV_edit_risk: {},
        has_risk: false,
        showContextMenu: false
      }
    },
    mounted() {
      if (this.risk) {
        this.loading = false
        this.DV_risk = this.risk
      }
    },
    methods: {
      ...mapMutations([
        'updateRisksHash',
        'setRiskForManager',
        'setToggleRACI',
        'SET_RISK_FORM_OPEN',
        'SET_SELECTED_RISK'
      ]),
      ...mapActions([
        'riskDeleted',
        'taskUpdated',
        'updateWatchedRisks'
      ]),
      editRisk() {
        this.DV_edit_risk = this.DV_risk;
        this.$router.push(`/programs/${this.$route.params.programId}/sheet/projects/${this.$route.params.projectId}/risks/${this.DV_edit_risk.id}`);
      },
      toggleWatched() {
        if (this.DV_risk.watched) {
          var confirm = window.confirm(`Are you sure, you want to remove this risk from on-watch?`)
          if (!confirm) {return}
        }
        this.DV_risk = {...this.DV_risk, watched: !this.DV_risk.watched}
        this.updateWatchedRisks(this.DV_risk)
      },   
      openContextMenu(e) {
        e.preventDefault();
        this.$refs.menu.open(e);
      },
    },
    computed: {
      ...mapGetters([
        'facilities',
        'facilityGroups',
        'managerView',
        'currentRisks',
        'currentIssues',
        'viewPermit',
        'getToggleRACI',
      ]),
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.risks[salut]
      },
      is_overdue() {
        return this.DV_risk.progress !== 100 && new Date(this.DV_risk.dueDate).getTime() < new Date().getTime()
      },
      facility() {
        return this.facilities.find(f => f.id == this.DV_risk.facilityId)
      },
      facilityGroup() {
        return this.facilityGroups.find(f => f.id == this.facility.facilityGroupId)
      },
      C_editForManager() {
        return this.managerView.risk && this.managerView.risk.id == this.DV_risk.id
      }
    },
    watch: {
      risk: {
        handler(value) {
          this.DV_risk = Object.assign({}, value)
        },
        deep: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  .t_actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      font-size: 13px;
    }
    .empty_box,
    .check_box {
      font-size: 16px;
    }
  }
  table {
    table-layout: fixed ;
    width: 100% ;
    margin-bottom: 0 !important;
    overflow: auto;
  }
  .toolTip {
    background-color: #6c757d;
    font-size: .75rem;
    padding:1px;
    color: #fff;
    border-radius: 3px;
  }
  .seven {
    width: 7%;
  }
  .eight {
    width: 8%;
  }
  .nine {
    width: 9%;
  }
  .ten {
    width: 10%;
  }
  .twelve {
    width: 12%;
  }
  .oneFive {
    width: 15%;
  }
  .sixteen {
    width: 16%;
  }
  .oneEight{
    width: 18%;
  }
  .pg-content {
    width: 100%;
    height: 20px;
    font-weight: bold;
  }
  td {
    overflow-wrap: break-word;
  }
  .risk_form_modal.sweet-modal-overlay {
    z-index: 10000001;
  }
  .risk_form_modal.sweet-modal-overlay /deep/ .sweet-modal {
    min-width: 30vw;
    max-height: 80vh;
    .sweet-content {
      padding-top: 30px;
      text-align: unset;
    }
    .modal_close_btn {
      display: flex;
      position: absolute;
      top: 20px;
      right: 30px;
      font-size: 20px;
      cursor: pointer;
    }
    .fa-long-arrow-alt-right {
      margin-bottom: 1rem !important;
      margin-left: 1rem !important;
      height: .8em !important;
    }
    .onHover:hover {
      cursor: pointer !important;
      background-color: rgba(91, 192, 222, 0.3) !important;
      border-left: solid rgb(91, 192, 222) !important;
    }
    .form-inside-modal {
      form {
        position: inherit !important;
      }
    }
  }
    .red1 {
    background-color: #d9534f;
  }
  .yellow1 {
    background-color: yellow;  
    color:#383838;  
    display: block;
  }
  .orange1 {
    background-color: #f0ad4e;
  }
  .green1 {
    background-color: rgb(92,184,92);
  }  
  .gray2 {
    background-color: #ededed;
  }
  .green1, .orange1, .red1, .yellow1, .gray2 {
    display: inline;   
    border-radius: 2px; 
    padding: 1px 1px;
    box-shadow: 0 1px 2.5px rgba(56,56, 56,0.19), 0 1.5px 1.5px rgba(56,56,56,0.23);
  }
   .green1, .orange1, .red1 {   
    color:#fff;   
  }
</style>
