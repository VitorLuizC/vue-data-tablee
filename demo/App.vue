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
      <span
        class="data-tablee-icon"
        slot="sort-icon"
        slot-scope="{ sortment, sorted, arrow }"
      >
        {{ sorted ? arrow + ' ' + (sortment === 'ascending' ? 'ASC' : 'DESC') : '' }}
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
  @import url('https://fonts.googleapis.com/css?family=Nunito+Sans:400,700');

  .data-tablee {
    overflow: hidden;
    border: 1px solid #eaedef;
    border-radius: 5px;
    border-spacing: 0;
  }

  .data-tablee-cell {
    position: relative;
    min-height: calc(27px + 4px);
    padding: 18px;
    border-top: 1px solid #eaedef;

    .data-tablee-row:first-child > & { border-top: 0; }

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
  }

  .data-tablee-text {
    font-size: 13px;
    font-family: 'Nunito Sans', sans-serif;
    font-weight: 400;
    color: #5e6684;
  }

  .data-tablee-cell.-header {
    background-color: #fdfdfd;

    & > .data-tablee-text,
    & > .data-tablee-icon {
      display: inline-block;
      font-size: 12px;
      font-family: 'Nunito Sans', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      color: #bec0d3;
    }

    & > .data-tablee-icon {
      opacity: 0;
      transition: opacity .3s ease,
                  transform .3s ease;
    }

    &.-sortable { cursor: pointer; }

    &.-sorting > .data-tablee-icon,
    &.-sortable:hover > .data-tablee-icon { opacity: 1; }

    &.-sorting:active > .data-tablee-icon {
      transition: transform .1s ease;
      transform: scale(1.5);
    }
  }

  .data-tablee-text { line-height: 1; }
</style>
