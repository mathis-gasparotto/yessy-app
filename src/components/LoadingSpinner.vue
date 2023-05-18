<template>
  <div class="spinner-container">
    <q-spinner-gears size="100px" color="primary" />
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner'
}
</script>

<style lang="scss" scoped>
.spinner {
  &-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
