<template>
  <div class="page-container">
    <q-page class="flex flex-center column add-bet">
      <div class="add-bet__header">
        <q-icon name="fa fa-trophy" color="white" size="30px"></q-icon>
        <h1 class="add-bet__header-title text-h6">Choix du salon</h1>
        <div class="add-bet__header-dots">
          <q-icon name="fa fa-ellipsis-v" size="30px" color="white"></q-icon>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
export default {
  name: 'AddBetPage'
}
</script>

<style lang="scss" scoped>
.add-bet {
  .add-bet__header {
    background-color: $primary;
    width: 100%;
    height: 100px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .add-bet__header-title {
      color: white;
      margin-left: 10px;
    }
    .add-bet__header-dots {
      position: absolute;
      right: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      height: 100%;
    }
  }
}
</style>
