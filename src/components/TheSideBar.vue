<template>
  <v-navigation-drawer
    dark
    fixed
    clipped
    v-bind:permanent="drawerVisible"
    class="app-side-bar-drawer"
    app
    v-bind:value="drawerVisible"
  >
    <v-list dense>
      <v-list-tile>
        <v-list-tile-content>
          <v-breadcrumbs dark :items="breadcrumbs" divider=">">
            <template slot="item" slot-scope="props">
              <span disabled class="app-breadcrumbs-text">{{ props.item.text }}</span>
            </template>
          </v-breadcrumbs>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile avatar @click>
        <v-list-tile-action>
          <v-icon>assignment</v-icon>
        </v-list-tile-action>
        <v-list-tile-content @click="$router.push({ path: '/' })">
          <v-list-tile-title>All notes</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
      <v-list-tile avatar @click="addNewNode" class="light-blue darken-4">
        <v-list-tile-action>
          <v-icon small>add</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Create new note</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
      <v-list-tile avatar @click="navigateToNotebooksList">
        <v-list-tile-action>
          <v-icon>list</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Notebooks</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
      <v-treeview
        hoverable
        transition
        activatable
        open-on-click
        :active.sync="activeNotes"
        :open.sync="openedNotebooks"
        :items="notesTree"
        color="primary"
      >
        <template slot="prepend" slot-scope="{ item, open, leaf }">
          <v-icon v-if="!item.file && !leaf" small>{{ open ? 'folder_open' : 'folder' }}</v-icon>
          <v-icon v-if="leaf" small>note</v-icon>
        </template>
      </v-treeview>
      <v-layout row>
        <v-list expand dense class="app-recycle-notes-list">
          <v-list-group 
          no-action
          :prepend-icon="'delete_forever'"
          v-model="activeRecycle">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  <span>Recylce bin</span>
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
            v-for="note in recycle"
            :key="note.id"
            @click="onActiveRecycleNoteChange(note)">
              <v-list-tile-content>
                <v-list-tile-title>{{ note.name }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-layout>
      <v-divider></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { mapState, mapActions, mapMutations } from 'vuex';
import MainStore from '@/store/store';
import { getMainDb, functionSaveTestMockupToStore } from '@/utils/indexedDB/notesStorage';
import { Notebook, Note } from '@/utils/orm.models';

@Component({
  name: 'app-side-bar',
  computed: {
    ...mapState('ViewEventModule', ['drawerVisible']),
    ...mapState(['notesTree', 'openedNotebook', 'activeNote', 'recycle']),
  },
  methods: {
    ...mapActions(['getNodeTree']),
    ...mapMutations(['addNewNoteToStore', 'showDeletedNote']),
  },
})
export default class SideBar extends Vue {
  private activeNotes: Note[] = [];
  private openedNotebooks: Notebook[] = [];
  private activeRecycle = [];
  private get breadcrumbs() {
    const result = [];
    const notebook = this.$store.state.openedNotebook as Notebook;
    const note = this.$store.state.activeNote as Note;
    if (notebook) {
      result.push({
        text: notebook.name,
      });
    }
    if (note) {
      result.push({
        text: note.name,
      });
    }
    return result;
  }
  private created() {
    if (!Vue.config.productionTip) {
      functionSaveTestMockupToStore();
      (this as any).getNodeTree();
    }
  }
  private navigateToNotebooksList() {
    this.desyncActiveNotes();
    this.$router.push({ path: 'notebooks' });
  }
  private addNewNode() {
    (this as any).addNewNoteToStore();
  }
  @Watch('activeNotes', { deep: true, immediate: true })
  private onActiveNoteBookChange(newValue: number[]) {
    if (newValue.length > 0) {
      this.$store.commit('setActiveNote', newValue[0]);
      this.$router.push({ path: '/' });
    }
  }
  @Watch('openedNotebooks', { deep: true, immediate: true })
  private onOpenNoteBookChange(newValue: number[]) {
    if (newValue.length > 0) {
      this.$store.commit('setOpenedNotebook', newValue[newValue.length - 1]);
      this.$router.push({ path: '/' });
    }
  }
  private onActiveRecycleNoteChange(newValue: Note) {
      this.desyncActiveNotes();
      this.$store.commit('showDeletedNote', newValue);
      this.$router.push({ path: '/' });
  }
  private desyncActiveNotes() {
      this.activeNotes = [];
      this.openedNotebooks = [];
  }
}
</script>
<style lang="scss">
.app-side-bar-drawer {
  background-color: #333333 !important;
  color: #ffffff;
}
.app-breadcrumbs-text {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 125px;
    color: #01579b!important;
    font-weight: bold;
}
.app-recycle-notes-list {
    width: 100%;
}
</style>
