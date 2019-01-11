<template>
  <v-list dense>
    <v-list-tile>
      <app-sidebar-breadcrumbs/>
    </v-list-tile>
    <v-divider></v-divider>
    <v-list-tile avatar @click="$router.push({ path: 'notebooks' })">
      <v-list-tile-action>
        <v-icon>list</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>Notebooks</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-divider></v-divider>
    <v-list-tile avatar @click="$router.push({ path: '/' })">
      <v-list-tile-action>
        <v-icon>assignment</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
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
    <v-list class="app-sidebar-notebooks">
      <v-list-tile v-for="notebook in notebooks" :key="notebook.id" :data-notebookId="notebook.id" @click="openSideNotesList">
        <v-list-tile-action>
          <v-icon dark>folder</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-text="notebook.name"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-divider></v-divider>
  </v-list>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Notebook, Note } from '@/utils/orm.models';
import { mapState, mapMutations } from 'vuex';
import AppSidebarBreadcrumbs from '@/components/SideBarBreadcrumbs.vue';

@Component({
  name: 'app-sidebar-main-content',
  components: {
    AppSidebarBreadcrumbs,
  },
  computed: {
    ...mapState(['activeNote', 'notebooks']),
  },
  methods: {
    ...mapMutations(['addNewNoteToStore', 'setOpenedNotebook']),
  },
})
export default class AppSidebarMainContent extends Vue {
  private addNewNode() {
    (this as any).addNewNoteToStore();
  }
  private openSideNotesList(ev: Event) {
    const element = ev.currentTarget as HTMLElement;
    const notebookId = parseInt((element.dataset.notebookid as string), 10);
    if (element && notebookId !== undefined) {
        (this as any).setOpenedNotebook(notebookId);
        this.$emit('open-note-list');
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

