<template>
  <section>
    <!-- Simple DataTable -->
    <data-tablee
      :rows="rows"
      :cols="cols"
      sort-external
      align="right"
      selectable
    />

    <!-- DataTable using slots to customize sort-icon and rows -->
    <data-tablee
      :rows="rows"
      :cols="cols"
      empty="-"
    >
      <span
        class="data-tablee-icon"
        slot="sort-icon"
        slot-scope="{ sortment, sorted, arrow }"
      >
        {{ sorted ? arrow + ' ' + (sortment === 'ascending' ? 'ASC' : 'DESC') : '' }}
      </span>

      <template
        slot="row"
        slot-scope="{ row, index }"
      >
				<td class="data-tablee-cell -content data-tablee-text" >{{ index }}</td>
        <td class="data-tablee-cell -content data-tablee-text" >{{ row.name }}</td>
        <td class="data-tablee-cell -content data-tablee-text" >{{ row.birth_date }}</td>
        <td class="data-tablee-cell -content data-tablee-text" >{{ row.gender }}</td>
        <td class="data-tablee-cell -content data-tablee-text" >{{ row.address.city }}</td>
      </template>
    </data-tablee>
  </section>
</template>

<script>
  import users from './users'

  const cols = [
    {
      label: 'Name',
      field: 'name'
    },
    {
      label: 'Birth Date',
      field: 'birth_date',
      align: 'center',
      sort: (a, b) => new Date(a).getTime() - new Date(b).getTime() // Custom sort function
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

  export default {
    data () {
      return {
        cols,
        rows: users
      }
    }
  }
</script>

<style src="../dist/vue-data-tablee.css"></style>
