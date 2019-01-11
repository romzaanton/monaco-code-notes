<template>
  <v-flex xs12 sm12 mt-1>
    <v-toolbar height="45" dark>
      <v-toolbar-title>
        <h6 class="subheading white--text" ma-1>All notebooks</h6>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outline color="info" small @click="openEditForm">
        <v-icon left small dark>add</v-icon>Add notebook
      </v-btn>
    </v-toolbar>
    <v-data-table dark :headers="headers" :items="notebooks" search>
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.name }}</td>
        <td class="text-xs-center">{{ props.item.owner }}</td>
        <td class="text-xs-center">{{ props.item.updated }}</td>
        <td class="text-xs-center">{{ props.item.sharedWith }}</td>
        <td class="text-xs-center pa-0 ma-0">
          <v-btn class="ma-0" icon small @click="deleteItem(props.item)">
            <v-icon small>delete</v-icon>
          </v-btn>
          <v-btn class="ma-0" icon small>
            <v-icon small>edit</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="editFormVisible">
      <component v-bind:is="dialogComponent" v-on:close-dialog="closeDialog"></component>
    </v-dialog>
  </v-flex>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { mapState, mapGetters, mapActions } from 'vuex';
import { Notebook, Note } from '@/utils/orm.models';
import AppNotebookEditForm from '@/components/BaseNotebookEditForm.vue';
import AppTransferNotesForm from '@/components/BaseTransferNotesForm.vue';

@Component({
  name: 'app-Notebook-list',
  computed: {
    ...mapState(['notebooks']),
    ...mapGetters(['getRelatedNotes']),
  },
  components: {
    AppNotebookEditForm,
    'app-transfer-notes-form': AppTransferNotesForm,
  },
})
export default class NotebooksList extends Vue {
  private editFormVisible = false;
  private dialogComponent = '';
  private get headers() {
    return [
      {
        text: '#',
        align: 'center',
        sortable: false,
        value: 'id',
      },
      {
        text: 'Title',
        align: 'center',
        sortable: false,
        value: 'name',
      },
      {
        text: 'Owner',
        align: 'center',
        sortable: false,
        value: 'owner',
      },
      {
        text: 'Updated',
        align: 'center',
        sortable: false,
        value: 'updated',
      },
      {
        text: 'Shared with',
        align: 'center',
        sortable: false,
        value: 'sharedWith',
      },
      {
        text: 'Action',
        align: 'center',
        sortable: false,
        value: 'id',
      },
    ];
  }
  private openEditForm() {
    this.editFormVisible = true;
    this.dialogComponent = 'app-notebook-edit-form';
  }
  private deleteItem(value: Notebook) {
    const relatedNotes = this.$store.getters.getRelatedNotes(value) as Note[];
    if (relatedNotes.length > 0) {
      this.editFormVisible = true;
      this.dialogComponent = 'app-transfer-notes-form';
    } else {
      this.$store.dispatch('deleteNotebook', value);
    }
  }
  private closeDialog() {
    this.editFormVisible = false;
    this.dialogComponent = '';
  }
}
</script>
<style lang="sass" scoped>

</style>
