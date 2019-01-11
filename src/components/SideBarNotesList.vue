<template>
  <v-list two-line>
    <v-list-tile @click="$emit('change-state-to-main')">
      <v-list-tile-action>
        <v-icon>chevron_right</v-icon>
      </v-list-tile-action>
    </v-list-tile>
    <v-subheader>{{openedNotebook ? openedNotebook.name : ''}}</v-subheader>
    <v-divider></v-divider>
    <v-list-tile
      v-for="note in notesList" 
      :key="note.id"
      :data-id="note.id"
      @click="openNote"
    >
      <v-list-tile-content>
        <v-list-tile-title>{{ note.name }}</v-list-tile-title>
        <v-list-tile-sub-title>{{ note.data }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Notebook, Note } from '@/utils/orm.models';
import { mapState, mapMutations } from 'vuex';

@Component({
  name: 'app-sidebar-notes-list',
  computed: {
    ...mapState(['openedNotebook', 'notes']),
  },
  methods: {
    ...mapMutations(['setActiveNote']),
  },
})
export default class AppSidebarNotesList extends Vue {
  get notesList() {
    const activeNotebook = this.$store.state.openedNotebook as Notebook;
    return (this.$store.state.notes as Note[])
      .filter((value) => value.notebookId === activeNotebook.id);
  }
  private openNote(ev: Event) {
    const element = ev.currentTarget as HTMLElement;
    const noteId = parseInt((element.dataset.id as string), 10);
    if (element && noteId) {
      (this as any).setActiveNote(noteId);
      this.$router.push({ path: 'codeNotes'});
    }
  }
}
</script>
