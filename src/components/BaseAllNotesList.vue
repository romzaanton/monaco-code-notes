<template>
  <v-layout class="app-all-notes-list" column>
    <v-flex xs12 sm12 mt-2 ml-1 pa-1>
      <v-toolbar height="45" dark>
        <v-toolbar-title>
          <h6 class="subheading white--text" ma-1>All notes</h6>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn outline color="info" small @click="notebookSelectDialogIsActive = true">
          <v-icon left small dark>add</v-icon>
          Add note
        </v-btn>
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
        <template slot="items" slot-scope="props" >
          <tr 
            @dblclick="openCurrentNode($event)" 
            :data-note-id="props.item.id" 
            :data-notebook-id="props.item.notebookId"
          >
            <td class="text-xs-center">{{ props.item.id }}</td>
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.language }}</td>
            <td class="text-xs-left">{{ notebooks.find(v => v.id === props.item.notebookId).name }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
    <v-dialog v-model="notebookSelectDialogIsActive">
      <app-notebook-select-dialog @close-dialog="notebookSelectDialogIsActive = false"/>
    </v-dialog>
  </v-layout>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapState, mapMutations } from 'vuex';
import { Note } from '@/utils/orm.models';
import { getAllNotes } from '@/utils/indexedDB/notesStorage';
import AppNotebookSelectDialog from '@/components/BaseAllNotesListSelectDialog.vue';
@Component({
  name: 'app-all-notes-list',
  components: {
    AppNotebookSelectDialog,
  },
  computed: {
    ...mapState(['notes', 'notebooks']),
  },
  methods: {
    ...mapMutations(['setOpenedNotebook', 'setActiveNote']),
  },
})
export default class AppAllNotesList extends Vue {
  private notebookSelectDialogIsActive = false;
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
      {
        text: 'Notebook',
        value: 'notebookId',
        align: 'left',
        sortable: true,
      },

    ];
  }
  private openCurrentNode(ev: Event) {
    const element = ev.currentTarget;
    if (element && element instanceof HTMLTableRowElement) {
      (this as any).setOpenedNotebook(parseInt((element.dataset.notebookId as string), 10));
      (this as any).setActiveNote(parseInt((element.dataset.noteId as string), 10));
      this.$router.push({path: 'codeNotes'});
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

