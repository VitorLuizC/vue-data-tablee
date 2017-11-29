<template>
  <section>
    <c-table
      :rows="rows"
      :cols="cols"
    />
    <c-table
      :rows="rows"
      :cols="cols"
      empty="-"
    >
      <span
        class="c-table-icon"
        slot="sort-icon"
        slot-scope="{ sortment, sorted, arrow }"
      >
        {{ sorted ? arrow + ' ' + (sortment === 'ascending' ? 'ASC' : 'DESC') : '' }}
      </span>

      <tr
        slot="row"
        slot-scope="{ row, classy }"
        :class="classy"
      >
        <td class="c-table-cell -content c-table-text" >{{ row.name }}</td>
        <td class="c-table-cell -content c-table-text" >{{ row.birth_date }}</td>
        <td class="c-table-cell -content c-table-text" >{{ row.gender }}</td>
        <td class="c-table-cell -content c-table-text" >{{ row.address.city }}</td>
      </tr>
    </c-table>
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
            align: 'center',
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
  @import url('https://fonts.googleapis.com/css?family=Nunito+Sans:400,700');

  .c-table {
    overflow: hidden;
    border: 1px solid #eaedef;
    border-radius: 5px;
    border-spacing: 0;
  }

  .c-table-cell {
    position: relative;
    min-height: calc(27px + 4px);
    padding: 18px;
    border-top: 1px solid #eaedef;

    .c-table-row:first-child > & { border-top: 0; }

    &::before {
      position: absolute;
      left: 0;
      top: 50%;
      display: block;
      width: 1px;
      height: 27px;
      background-color: #eaedef;
      transform: translateY(-50%);
      content: '';

      &:first-child { content: none; }
    }

    &.-right { text-align: right; }
    &.-left { text-align: left; }
    &.-center { text-align: center; }
  }

  .c-table-text {
    font-size: 13px;
    font-family: 'Nunito Sans', sans-serif;
    font-weight: 400;
    color: #5e6684;
  }

  .c-table-cell.-header {
    background-color: #fdfdfd;

    & > .c-table-text,
    & > .c-table-icon {
      display: inline-block;
      font-size: 12px;
      font-family: 'Nunito Sans', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      color: #bec0d3;
    }

    & > .c-table-icon {
      opacity: 0;
      transition: opacity .3s ease,
                  transform .3s ease;
    }

    &.-sortable {
      cursor: pointer;

      & > .c-table-icon { opacity: .2; }

      &:hover > .c-table-icon { opacity: .8; }

      &:active > .c-table-icon {
        transition: transform .1s ease;
        transform: scale(1.5);
      }

      &.-right { padding-right: 6px; }
    }

    &.-sorting > .c-table-icon { opacity: 1; }
  }

  .c-table-text { line-height: 1; }
</style>
