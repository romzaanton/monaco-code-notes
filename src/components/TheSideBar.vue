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
            <v-list-tile avatar @click>
                <v-list-tile-action>
                    <v-icon>assignment</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>All notes</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile avatar @click>
                <v-list-tile-action>
                    <v-icon>list</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>Notebooks</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-treeview :items="notesTree" color="primary">
                <template slot="prepend" slot-scope="{ item, open, leaf }">
                    <v-icon v-if="!item.file && !leaf" small>{{ open ? 'folder_open' : 'folder' }}</v-icon>
                    <v-icon v-if="leaf" small>note</v-icon>
                </template>
            </v-treeview>
            <v-divider></v-divider>
        </v-list>
    </v-navigation-drawer>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MainStore from '@/store/store';
import { getMainDb, functionSaveTestMockupToStore } from '@/utils/indexedDB/notesStorage';
import { mapState, mapActions } from 'vuex';

@Component({
    name: 'app-side-bar',
    computed: {
        ...mapState('ViewEventModule', ['drawerVisible']),
        ...mapState(['notesTree']),
    },
    methods: {
        ...mapActions(['getNodeTree']),
    },
})
export default class SideBar extends Vue {
    private created() {
        if (!Vue.config.productionTip) {
            functionSaveTestMockupToStore();
            (this as any).getNodeTree();
        }
    }
}
</script>
<style lang="scss">
.app-side-bar-drawer {
  background-color: #333333 !important;
  color: #ffffff;
}
</style>
