<template>
  <div class="page-container">
    <q-page class="flex flex-center page column add-bet bg-2">
      <div class="page-content">
        <div class="add-bet__header flex flex-center column q-py-md">
          <q-icon name="fa fa-trophy" color="white" size="30px"></q-icon>
          <h1 class="add-bet__header-title text-h6">Choix du salon</h1>
          <div class="add-bet__header-dots flex flex-center">
            <q-icon name="circle" size="17px" color="secondary"></q-icon>
            <q-icon name="circle" size="17px" color="white"></q-icon>
            <q-icon name="circle" size="17px" color="white"></q-icon>
          </div>
        </div>
      </div>
      <div class="add-bet__choices flex flex-center column">
        <div class="add-bet__choice-public flex flex-center column clickable">
          <h2 class="add-bet__choice-text text-h4 text-bold">Pari Public</h2>
          <q-icon class="add-bet__choice-icon" name="public" color="white" size="100px"></q-icon>
        </div>
        <div class="add-bet__choice-private flex flex-center column clickable">
          <h2 class="add-bet__choice-text text-h4 text-bold">Pari Privé</h2>
          <q-icon class="add-bet__choice-icon" name="lock" color="white" size="100px"></q-icon>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPage'
}
</script>

<style lang="scss" scoped>
.add-bet {
  &__header {
    background-color: $primary;
    width: 90%;
    margin: auto;
    color: white;
    border-radius: 10px;
    &-title {
      margin: 0;
    }
    &-dots {
      gap: 10px;
    }
  }
  &__choice {
    &s {
      width: 100%;
      height: 65vh;
    }
    &-text {
      margin: 0;
      color: white;
      margin: 0;
    }
    &-public, &-private {
      height: 50%;
      width: 100%;
    }
    &-public {
      background-color: $secondary;
      border-radius: 15px 15px 0 0;
    }
    &-private {
      background-color: $primary;
    }
  }
}
</style>
