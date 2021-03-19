<template>
  <div>
    <nav>
      <div>
        <img
          src="/assets/microhealthllc.png"
          alt="Microhealth Logo"
          height="35"
        />
      </div>
      <div>
        <ul class="routes">
          <li><i class="el-icon-map-location"></i> Map</li>
          <li class="active"><i class="el-icon-tickets"></i> Sheet</li>
          <li><i class="el-icon-c-scale-to-original"></i> Kanban</li>
          <li><i class="el-icon-s-fold"></i> Gantt</li>
          <li><i class="el-icon-user"></i> Team</li>
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
    <div class="sub-navbar">
      <h6>
        <i class="fas fa-building" style="font-size: 16px; margin-right: 10px"></i>
        <span style="color:#007bff">Program Name</span>
        <el-icon class="el-icon-arrow-right" style="font-size: 12px"></el-icon>
        <span style="color:#007bff">Project Name</span>
        <el-icon class="el-icon-arrow-right" style="font-size: 12px"></el-icon>
        <span style="color:#007bff">Tasks</span>
        <el-icon class="el-icon-arrow-right" style="font-size: 12px"></el-icon>
        Task Name
      </h6>
    </div>
    <div class="sub-navbar lower-navbar-tabs">
      <div class="lower-active">Overview</div>
      <div>Tasks</div>
      <div>Issues</div>
      <div>Risks</div>
      <div>Notes</div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
* {
  margin: 0;
}
img {
  margin-bottom: 15px;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 72px;
  padding: 0 20px;
}
ul {
  list-style-type: none;
  display: flex;
  height: 100%;
  li {
    margin-left: 10px;
    padding: 0 10px 5px 10px;
  }
  li:hover {
    color: #007bff;
    cursor: pointer;
  }
}
.routes {
  // font-weight: 600;
}
.active {
  color: #007bff;
  border-top: 1px solid #d8d0d0;
  border-left: 1px solid #d8d0d0;
  border-right: 1px solid #d8d0d0;
  box-shadow: 1px 1px 0 #fff;
  box-sizing: content-box;
  // border-bottom: 5px solid #007bff;
}
.sub-navbar {
  // background-color: #1c326e;
  // color: white;
  padding: 10px 0 5px 240px;
  border-top: 1px solid rgb(233, 223, 223);
  border-bottom: 1px solid #dcdcdc;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 100;
}
.lower-navbar-tabs {
  background-color: #007bff;
  color: white;
  display: flex;
  justify-content: space-evenly;
  padding: 0;
  margin-left: 61px;
}
.lower-active {
  border-bottom: 5px solid white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>