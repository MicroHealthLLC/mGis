<template>
  <div id="members" data-cy="members_view" class="mt-2">
     <div class="container my-2 p-4 wrapper" style="background-color:#ededed; border-radius: 4px" > 
        <h2 class="mt-1 mb-1"><span><i class="fas fa-users mr-2"></i></span>Team</h2>  
           <div class="mb-0 p-b-0">
            <el-row class="mb-2">
             <el-col :span="9">
             <div class="input-group w-100 task-search-bar">
                <div class="input-group-prepend">
                <span class="input-group-text" id="search-addon"><i class="fa fa-search"></i></span>
                </div>
               <input type="search"
                class="form-control form-control-sm"
                placeholder="Search All"
                aria-label="Search"
                aria-describedby="search-addon"
                v-model="filters[0].value"
                data-cy="search_team_member">
            </div>
            </el-col>            
            <div class="total" data-cy="team_total">                 
              <button
                @click.prevent="exportToPdf"
                v-tooltip="`Export to PDF`"
                id="printBtn"
                class="btn btn-md exportBtns text-light">
                <font-awesome-icon icon="file-pdf" />              
              </button>     
               <button
                v-tooltip="`Export to Excel`"
                @click.prevent="exportToExcel('table', 'Team Members List')"
                class="btn btn-md exportBtns text-light">
                <font-awesome-icon icon="file-excel"/>         
              </button> 
              <button class="btn btn-md btn-info team-total">
                Team Total: {{tableData.length}}
                </button>
              </div>
            </el-row>

           </div>              
        <data-tables 
          :data="tableData"  
          ref="table" 
          id="teamMemberTableId"
          class="teamMembersList"
          data-cy="team_members_list"       
          :header-cell-style="tableHeaderColor"
          :pagination-props="{ pageSizes: [15, 25, 50, 100, 200] }"
          layout="table, pagination"
          :table-props="tableProps"
          width="100%"
          :filters="filters">
        <el-table-column
            prop="id"
            label="#"
            width="55"
            sortable="custom">
        </el-table-column>        
        <el-table-column
          v-for="title in titles"
          :prop="title.prop"
          :label="title.label"
          :key="title.label"
          sortable="custom">
        </el-table-column>
        <el-table-column
            prop="email"
            label="Email"
            width="200"
            sortable="custom">
        </el-table-column>
      </data-tables>
     </div>
     <div style="display:none">
        <table class="table table-sm table-bordered" ref="table">        
          <thead>
            <tr>
              <th></th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Position</th>
              <th>Organization</th>
              <th>Phone Number</th>
              <th>Email</th>                     
            </tr>
          </thead>
          <tbody>          
            <tr v-for="(user, i) in orderedUsers">        
              <td class="text-center">{{i+1}}</td>
              <td>{{user.firstName}}</td>
              <td>{{user.lastName}}</td>
              <td>{{user.title}}</td>
              <td>{{user.organization}}</td>             
              <td>{{user.phoneNumber}}</td>
              <td>{{user.email}}</td>                        
            </tr>
          </tbody>
        </table>
     </div>
  </div>

</template>

<script>
import {library} from '@fortawesome/fontawesome-svg-core'
import {faFilePdf} from '@fortawesome/free-solid-svg-icons'
import {mapGetters, mapActions} from 'vuex'
import VueDataTables from 'vue-data-tables'
import {jsPDF} from "jspdf"
import 'jspdf-autotable'
Vue.use(VueDataTables)
library.add(faFilePdf)
ELEMENT.locale(ELEMENT.lang.en)
  export default {
    name: "MembersView",
     data() {
      return {
        uri :'data:application/vnd.ms-excel;base64,',
        template:'<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="https://www.w3.org/TR/2018/SPSD-html401-20180327/"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64: function(s){ return window.btoa(unescape(encodeURIComponent(s))) },
        format: function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) },
        search: '',
        total: 0,
        totalRows: 1,
        tableProps: {
          stripe: true,         
        defaultSort: {
          prop: 'id',
          order: 'ascending'
        },          
       },
        filters: [
        {
          prop: ['id', 'firstName', 'lastName', 'title', 'organization', 'email', 'phoneNumber'],
          value: ''
        }
        ],
        layout: 'table, pagination',
        titles: [{         
          prop: "firstName",
          label: "First Name"
          }, {
          prop: "lastName",
          label: "Last Name"
          }, {
          prop: "title",
          label: "Position"
          }, {
          prop: "organization",
          label: "Organization"       
          }, {  
          prop: "phoneNumber",
          label: "Phone Number"
        }]
      }
    },
     computed: {
      ...mapGetters([
        'activeProjectUsers'
      ]),
      tableData() {
        return this.activeProjectUsers
      },
      orderedUsers: function() {     
        return _.orderBy(this.activeProjectUsers, 'lastName', 'asc')    
      }
     },
     methods: { 
       tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background-color: #606266;color: #383838;'
        }
       },
      exportToPdf() {
        const doc = new jsPDF("l")
        const html = this.$refs.table.innerHTML
        var headers = ["id", "First Name", "Last Name","Position", "Organization", "Phone Number", "Email"]
        var thead = $("<thead>")
        var tr = $("<tr>")
        for(var h of headers){
          tr.append($("<th>",{text: h}))
        }
        thead.append(tr)
        $(".el-table__body").append(thead)
        doc.autoTable({html: '.el-table .el-table__body-wrapper .el-table__body' })
        doc.save("Team_Members_list.pdf")
        thead.remove()
      }, 
      exportToExcel(table, name){      
        if (!table.nodeType) table = this.$refs.table
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        window.location.href = this.uri + this.base64(this.format(this.template, ctx))
      }
    },     
  }
</script>
<style scoped lang="scss">
  /deep/.el-table {
    padding-top: 0px;
    margin-top:-1.5rem;
    width: 100%;
    margin-bottom: 6px;
    border-top: solid #ededed 1.8px;    
  }
  .wrapper {
     box-shadow: 0 5px 5px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23);
  }
    /deep/.el-table thead {
    color: #383838;
  }
  /deep/.el-pagination, .total {
    text-align: end;
    margin-bottom:2rem;
  }
  .team-total {
    box-shadow: 0 2.5px 5px rgba(56,56, 56,0.19), 0 3px 3px rgba(56,56,56,0.23);
  }
  input[type=search] {
    color: #383838;
    text-align: left;
    cursor: pointer;
    display: block;
 }
</style>