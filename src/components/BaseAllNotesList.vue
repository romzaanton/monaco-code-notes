<template>
  <v-layout class="app-all-notes-list" column>
    <v-flex xs12 sm12 mt-2 ml-1 pa-1>
      <v-toolbar height="45" dark>
        <v-toolbar-title>
          <h6 class="subheading white--text" ma-1>
            All notes
          </h6>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn outline color="info" small>Add</v-btn>
        <v-btn outline color="error" small>Delete</v-btn>
      </v-toolbar>
      <v-data-table
        v-if="notes.length > 0"
        :headers="headers"
        :items="notes"
        :pagination.sync="pagnition"
        class="app-all-notes-table"
        dark
        mt-2
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.language }}</td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapState } from 'vuex';
import { Note } from '@/utils/orm.models';
import { getAllNotes } from '@/utils/indexedDB/notesStorage';
@Component({
  name: 'app-all-notes-list',
  computed: {
    ...mapState(['notes']),
  },
})
export default class AppAllNotesList extends Vue {
  private pagnition = {
    descending: false,
    page: 1,
    rowsPerPage: 20,
    sortBy: 'id',
    totalItems: 100,
  };
  get headers() {
    return [
      {
        text: 'id',
        value: 'id',
        align: 'center',
        sortable: true,
      },
      {
        text: 'Name',
        value: 'name',
        align: 'left',
        sortable: true,
      },
      {
        text: 'Language',
        value: 'language',
        align: 'left',
        sortable: true,
      },

    ];
  }

}
</script>
<style lang="scss" scoped>
</style>

