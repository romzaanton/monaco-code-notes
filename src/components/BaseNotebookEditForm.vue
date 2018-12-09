<template>
    <v-card dark>
        <v-card-title>Create new notebook</v-card-title>
        <v-card-text pa-10>
            <v-form mt-10>
                <v-text-field 
                label="Notebook name"
                hint="Enter notebook name..."
                :counter="50"
                v-model="notebookeName"
                dark></v-text-field>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="light-blue darken-4"
            @click="saveNewNotebook"
            >Save</v-btn>
            <v-btn color="grey darken-1">Cancel</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component({
    name: 'app-notebook-edit-form',
})
export default class NotebookEditForm extends Vue {
    private notebookeName = '';
    private saveNewNotebook() {
        const name = this.notebookeName.trim();
        if (name !== '') {
            this.$store.dispatch('saveNewNotebook', name);
        }
        this.$emit('close-dialog');
    }
}
</script>
<style lang="scss" scoped>
</style>
