<template>
  <section>
    <data-tablee
      :rows="rows"
      :cols="cols"
    />
    <data-tablee
      :rows="rows"
      :cols="cols"
      empty="-"
    >
      <span slot="sort-icon" slot-scope="{ sortment, sorted }">
        {{ !sorted ? '' : sortment === 'descending' ? '\\/' : '/\\' }}
      </span>
    </data-tablee>  
  </section>
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
            field: 'birth_date',
            sort: (a, b) => new Date(a).getTime() - new Date(b).getTime()
          },
          {
            label: '',
            field: 'gender',
            sort: false
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

<style>
  :root
    --data-tablee-border-color: red
    --data-tablee-cell-padding: 15px
</style>
