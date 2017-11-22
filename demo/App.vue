<template>
  <data-tablee
    :rows="rows"
    :cols="cols"
    empty="-"
  />
</template>

<script>
  import users from './users'

  export default {
    data () {
      return {
        rows: users,
        cols: [
          {
            label: 'Name',
            field: 'name'
          },
          {
            label: 'Birth Date',
            field: 'birth_date'
          },
          {
            label: 'Gender',
            field: 'gender'
          },
          {
            label: 'City',
            field: 'address.city'
          }
        ]
      }
    }
  }

</script>
