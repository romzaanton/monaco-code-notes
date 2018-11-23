<template>
    <v-toolbar app absolute clipped-left dark ma-0 pa-0 color="primary" height="40px">
        <v-toolbar-side-icon
        @click="setDrawerVisibility"
        ></v-toolbar-side-icon>
        <v-toolbar-title class="white--text">Monaco-notes</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
            <v-icon>more_vert</v-icon>
        </v-btn>
    </v-toolbar>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapMutations } from 'vuex';
@Component({
    name: 'app-tool-bar',
    methods: {
        ...mapMutations('ViewEventModule', ['setDrawerVisibility']),
    },
})
export default class ToolBar extends Vue { }
</script>
