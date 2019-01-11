<template>
  <v-card dark>
    <v-card-title primary-title>
      <h6 class="subheading">Selet notebook for new note</h6>
    </v-card-title>
    <v-card-text>
      <v-select
          :items="notebooks"
          item-text="name"
          label="Select nootebook"
          solo
          dense
          return-object
          @change="onSelect($event)"
        >
        </v-select>
    </v-card-text>
    <v-card-actions>
      <v-btn flat color="light-blue" @click="createNewNote">Create new note</v-btn>
      <v-btn flat color="light-blue" @click="$emit('close-dialog', true)">Cancle</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapState, mapMutations } from 'vuex';
import { Notebook } from '@/utils/orm.models';

@Component({
  name: 'app-notebook-select-dialog',
  computed: {
    ...mapState(['notebooks']),
  },
  methods: {
    ...mapMutations(['setOpenedNotebook', 'addNewNoteToStore']),
  },
})
export default class AppNotebookSelectDialog extends Vue {
  private selectedNotebook!: number;
  private onSelect(notebook: Notebook) {
    if (notebook) {
      this.selectedNotebook = notebook.id;
    }
  }
  private createNewNote() {
    if (this.selectedNotebook) {
      (this as any).setOpenedNotebook(this.selectedNotebook);
      (this as any).addNewNoteToStore();
      this.$router.push({path: 'codeNotes'});
     }
  }
}
</script>
<style lang="scss" scoped>
</style>
