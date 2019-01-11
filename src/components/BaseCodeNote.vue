<template>
    <v-flex ma-0 pa-0 order-md2 class="app-base-note" app>
        <v-card dark tile>
            <v-card-title>
                <v-layout pa-0 align-content-center row>
                    <img class="app-file-img" src="../assets/typescirpt_logo.png">
                    <v-text-field
                        class="app-file-name-input"
                        v-model="fileName"
                        label="Name"
                        hint="File name"
                        persistent-hint
                        required
                        @change="changeName"
                    ></v-text-field>
                    <v-select
                        hint="Pick a notebook"
                        persistent-hint
                        :items="notebooksNames"
                        label="Notebook"
                        solo
                        color="primary"
                        :menu-props="{height: '30'}"
                        @change="changeNotebook"
                    ></v-select>
                    <v-select
                        v-model="monacoLangauge"
                        class="app-language-select"
                        hint="Pick a language"
                        persistent-hint
                        :items="monacoLangauges"
                        label="Languages"
                        solo
                        color="primary"
                        :menu-props="{height: '30'}"
                        @change="changeLanguage"
                    ></v-select>
                    <v-select
                        v-model="monacoTheme"
                        hint="Pick a theme"
                        persistent-hint
                        :items="monacoThemes"
                        label="Theme"
                        solo
                        color="primary"
                        :menu-props="{height: '30'}"
                        @change="changeTheme"
                    ></v-select>
                </v-layout>
            </v-card-title>
            <v-responsive class="app-monaco-editor-container">
                <div :id="editorContainerId"></div>
            </v-responsive>
            <v-card-actions>
                <v-btn block color="success"
                @click="saveCodeNoteContent"
                :disabled="activeNote && activeNote.isDeletedNote">Save</v-btn>
                <v-btn block color="warn"
                :disabled="activeNote && activeNote.isDeletedNote">Cancle</v-btn>
                <v-btn block color="error" @click="openConfirmForm">Delete</v-btn>
                <v-btn block color="info">Upload file</v-btn>
                <v-btn block color="info">Save to file</v-btn>
            </v-card-actions>
        </v-card>
        <v-dialog v-model="dialogFromVisible" max-width="500">
            <component :is="componentId" :message="confirmeMessage" v-on:on-confirme="onDeleteConfirme"></component>
        </v-dialog>
    </v-flex>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { mapState, mapMutations, mapActions } from 'vuex';
import * as monaco from 'monaco-editor';
import { createEditor, getLanguagesList } from '@/utils/monaco/monaco.helpers';
import { Note, NoteType, Notebook } from '@/utils/orm.models';
import { defaultMonacoLanguage } from '@/utils/orm.models';
import AppActionConfirmeForm from '@/components/BaseActionConfirmeForm.vue';

@Component({
    name: 'app-base-note',
    components: {
        'app-action-confirme-form': AppActionConfirmeForm,
    },
    computed: {
        ...mapState(['activeNote']),
        ...mapState(['notebooks']),
    },
    methods: {
        ...mapMutations(['changeActiveNoteLanguage', 'changeActiveNoteData']),
        ...mapMutations(['changeNotebookForActiveNote', 'deleteActiveNoteFromStore']),
        ...mapMutations(['changeActiveNoteName']),
        ...mapActions(['saveNoteActiveToStore']),
    },
})
export default class BaseCodeNote extends Vue {
    private readonly editorContainerId = 'app-monaco-editor';
    private fileName = 'main.ts';
    private monacoInstance!: monaco.editor.IStandaloneCodeEditor;
    private monacoLangauges = getLanguagesList();
    private monacoLangauge = '';
    private monacoThemes = ['vs', 'vs-dark', 'hc-black'];
    private monacoTheme = 'vs-dark';
    private monacoInstanceModified = false;
    private dialogFromVisible = false;
    private componentId = '';
    private confirmeMessage = '';
    private get notebooksNames() {
        let notebookNames = [] as string[];
        const notebooksList = (this as any).notebooks as Notebook[];
        if (notebooksList) {
            notebookNames = notebooksList.map((v) => v.name);
        }
        return notebookNames;
    }
    private mounted() {
        this.setEditorHeight();
        this.updateCodeEditor();
        window.addEventListener('resize', this.onWindowResize());
    }
    private updateCodeEditor() {
        let result = '';
        const activeNote = this.$store.state.activeNote as Note;
        if (this.isCodeNote(activeNote) && activeNote.language && activeNote.data) {
            result = activeNote.name;
            this.monacoLangauge = activeNote.language;
            this.fileName = activeNote.name;
            this.disposeMonacoModel();
            this.createNewMonacoEditor(this.editorContainerId, activeNote.language, activeNote.data);
        }
        return result;
    }
    private isCodeNote(note: Note | undefined) {
        if (!note) {
            return undefined;
        }
        if (note.language
            && note.type === NoteType.Code
            && note.data
            && document.querySelector(`#${this.editorContainerId}`)) {
            return true;
        }
        return false;
    }
    private setEditorHeight() {
        const windowHeight = window.innerHeight;
        const toolBarHeight = 40;
        const cardTitleHeight = (this.$el.querySelector('.v-card__title') as HTMLElement).clientHeight;
        const cardActionsHeight = (this.$el.querySelector('.v-card__actions') as HTMLElement).clientHeight;
        const editorHeight = windowHeight - toolBarHeight - cardTitleHeight - cardActionsHeight;
        (this.$el.querySelector('.app-monaco-editor-container') as HTMLElement).style.height = `${editorHeight}px`;
        (this.$el.querySelector(`#${this.editorContainerId}`) as HTMLElement).style.height = `${editorHeight}px`;
    }
    private onWindowResize() {
        return () => {
            this.setEditorHeight();
            if (this.monacoInstance) {
                this.monacoInstance.layout();
            }
        };
    }
    private changeLanguage(languageId: string) {
        this.disposeMonacoModel();
        this.createNewMonacoEditor(this.editorContainerId, languageId, '//* Code goes here');
        (this as any).changeActiveNoteLanguage(languageId);
    }
    private changeName(name: string) {
        (this as any).changeActiveNoteName(name);
    }
    private changeTheme(themeId: string) {
        monaco.editor.setTheme(themeId);
    }
    private disposeMonacoModel() {
        if (this.monacoInstance) {
            const model = this.monacoInstance.getModel();
            if (model) {
                model.dispose();
            }
        }
    }
    private createNewMonacoEditor(selector: string, languageId: string, data: string) {
        this.monacoInstance = createEditor(selector, languageId, data);
        this.monacoInstance.onDidChangeModelContent((ev: monaco.editor.IModelContentChangedEvent) => {
            this.monacoInstanceModified = true;
        });
    }
    private saveCodeNoteContent() {
        if (this.monacoInstance && this.monacoInstanceModified) {
            (this as any).changeActiveNoteData(this.monacoInstance.getValue());
            (this as any).saveNoteActiveToStore();
        }
    }
    private changeNotebook(notebookId: number) {
        if (notebookId !== undefined) {
            (this as any).changeNotebookForActiveNote(notebookId);
        }
    }
    private openConfirmForm() {
        this.dialogFromVisible = true;
        this.confirmeMessage = 'Do you want to delete note?';
        this.componentId = 'app-action-confirme-form';
    }
    private onDeleteConfirme(confirmed: boolean) {
        this.dialogFromVisible = false;
        this.componentId = '';
        if (confirmed) {
            (this as any).deleteActiveNoteFromStore();
        }
    }
    @Watch('activeNote', {deep: true, immediate: true})
    private onactiveNoteChange() {
        this.updateCodeEditor();
    }
}

</script>
<style lang="scss">
#app-monaco-editor {
  min-height: 50vh;
}
.app-monaco-editor-container {
    overflow: visible;
    * {
        overflow: visible;
    }
}
.v-card__title {
  padding: 3px;
  .app-file-name-input {
    margin-left: 10px;
  }
  .app-language-select {
    margin-right: 10px;
    margin-left: 10px;
  }
  .app-file-img {
    width: 3%;
    height: 3%;
    align-self: center;
  }
}
</style>
