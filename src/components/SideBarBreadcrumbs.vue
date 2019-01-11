<template>
  <v-breadcrumbs dark :items="breadcrumbs" divider=">">
    <template slot="item" slot-scope="props">
      <span disabled class="app-breadcrumbs-text">{{ props.item.text }}</span>
    </template>
  </v-breadcrumbs>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Notebook, Note } from '@/utils/orm.models';

@Component({
  name: 'app-sidebar-breadcrumbs',
})
export default class AppSidebarBreadcrumbs extends Vue {
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
}

</script>
<style lang="scss" scoped>
.app-breadcrumbs-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 125px;
  color: #01579b !important;
  font-weight: bold;
}
</style>

