<template>
  <nav>
    <div>
      <img src="/assets/microhealthllc.png" alt="Microhealth Logo" height="35">
    </div>
    <div>
      <ul class="routes">
        <li class="active"><i class="el-icon-map-location"></i> Map</li>
        <li><i class="el-icon-tickets"></i> Sheet</li>
        <li><i class="el-icon-c-scale-to-original"></i> Kanban</li>
        <li><i class="el-icon-s-fold"></i> Gantt</li>
        <li><i class="el-icon-map-location"></i> Team</li>
      </ul>
    </div>
    <div>
      <ul>
        <li>Admin Panel</li>
        <li>Help</li>
        <li><i class="el-icon-setting"></i></li>
        <li><i class="el-icon-user"></i></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {

}
</script>

<style scoped lang="scss">
* {
  margin: 0;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 25px 10px 25px;
  border-bottom: 1px solid gray;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
ul {
  list-style-type: none;
  display: flex;
  li {
    margin-left: 10px;
  }
  li:hover {
    color: #007bff;
    cursor: pointer;
  }
}
.routes {
  font-weight: 600;
}
.active {
  color: #007bff;
}
</style>