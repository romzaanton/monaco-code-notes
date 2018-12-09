<template>
    <v-layout column dark ma-2 color="primary">
        <v-flex>
            <v-alert :value="true" type="error">You have related notes for the notebook.</v-alert>
        </v-flex>
        <v-flex>
            <h6>
                <span>Would you like to transfer all nodes to another notebook?</span>
            </h6>
        </v-flex>
        <v-flex>
            <v-subheader class="grey--text">Transfer to</v-subheader>
            <v-select
                hint="Select notebook"
                persistent-hint
                :items="notebooks"
                solo
                dark
                color="primary"
                :menu-props="{height: '30'}"
            ></v-select>
        </v-flex>
        <v-flex align-self-end>
            <v-btn color="light-blue darken-4">Transfer</v-btn>
            <v-btn color="error">Delete</v-btn>
        </v-flex>
    </v-layout>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Notebook } from '@/utils/orm.models';
@Component({
    name: 'app-transfer-notes-from',
})
export default class TransferNotesForm extends Vue {
    private get notebooks() {
        const notebookArray = this.$store.state.notebooks as Notebook[];
        return notebookArray.map((v) => v.name);
    }
}
</script>
