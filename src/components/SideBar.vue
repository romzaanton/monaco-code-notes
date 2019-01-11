<template>
  <v-navigation-drawer
    dark
    fixed
    clipped
    v-bind:permanent="drawerVisible"
    class="app-sidebar-drawer"
    app
    v-bind:value="drawerVisible"
  >
    <app-sidebar-main-content v-if="sideBarContent === 'main'" v-on:open-note-list="sideBarContent = 'notes'"/>
    <app-sidebar-notes-list v-else-if="sideBarContent === 'notes'" v-on:change-state-to-main="sideBarContent = 'main'"/>
  </v-navigation-drawer>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapState, mapActions } from 'vuex';
import { functionSaveTestMockupToStore } from '@/utils/indexedDB/notesStorage';
import AppSidebarMainContent from '@/components/SideBarMainList.vue';
import AppSidebarNotesList from '@/components/SideBarNotesList.vue';

type SideBarContent = 'main' | 'notes';

@Component({
  name: 'app-side-bar',
  components: {
    AppSidebarMainContent,
    AppSidebarNotesList,
  },
  computed: {
    ...mapState('ViewEventModule', ['drawerVisible']),
  },
  methods: {
    ...mapActions(['getAllDataFromIndexedDb']),
  },
})
export default class SideBar extends Vue {
  private sideBarContent: SideBarContent = 'main';
  private created() {
    (this as any).getAllDataFromIndexedDb();
    if (!Vue.config.productionTip) {
      functionSaveTestMockupToStore();
    }
  }
}
</script>
<style lang="scss">
.app-sidebar-drawer {
  background-color: #333333 !important;
  color: #ffffff;
}
.app-recycle-notes-list {
    width: 100%;
}
</style>
