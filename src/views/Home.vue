<template>
  <div class="app-home">
    <app-tool-bar></app-tool-bar>
    <app-side-bar></app-side-bar>
    <v-content>
      <v-container pa-0 ma-0 fluid grid-list-md>
        <v-layout row justify-start fill-height pa-0 ma-0>
          <app-code-note></app-code-note>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppSideBar from '@/components/TheSideBar.vue';
import AppToolBar from '@/components/TheToolBar.vue';
import AppCodeNote from '@/components/BaseCodeNote.vue';

@Component({
  name: 'app-home',
  components: {
    AppSideBar,
    AppToolBar,
    AppCodeNote,
  },
})
export default class Home extends Vue { }
</script>
<style lang="scss" scoped>
.app-home {
  overflow: hidden;
}
</style>
