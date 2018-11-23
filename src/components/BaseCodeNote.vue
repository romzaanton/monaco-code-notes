<template>
    <v-flex ma-0 pa-0 order-md2 class="app-base-note" app>
        <v-card dark tile>
            <v-card-title>
                <v-layout pa-0 align-content-center row>
                    <img class="app-file-img" src="../assets/typescirpt_logo.png"/>
                    <v-text-field
                        class="app-file-name-input"
                        v-model="fileName"
                        label="Name"
                        hint="File name"
                        persistent-hint
                        required
                    ></v-text-field>
                    <v-select
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
                <v-btn block color="success">Save</v-btn>
                <v-btn block color="error">Cancle</v-btn>
                <v-btn block color="info">Upload file</v-btn>
                <v-btn block color="info">Save to file</v-btn>
            </v-card-actions>
        </v-card>
    </v-flex>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import * as monaco from 'monaco-editor';
import { createEditor, getLanguagesList } from '@/utils/monaco/monaco.helpers';
import {
    testInitialLanguage,
    testInitialMockup,
} from '../../tests/mockup/monaco.mockup';

@Component({
    name: 'app-base-note',
})
export default class BaseCodeNote extends Vue {
    private readonly editorContainerId = 'app-monaco-editor';
    private fileName = 'main.ts';
    private monacoInstance!: monaco.editor.IStandaloneCodeEditor;
    private monacoLangauges = getLanguagesList();
    private monacoThemes = ['vs', 'vs-dark', 'hc-black'];
    private mounted() {
        this.setEditorHeight();
        this.monacoInstance = createEditor(this.editorContainerId, testInitialLanguage, testInitialMockup);
        window.addEventListener('resize', this.onWindowResize());
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
            this.monacoInstance.layout();
        };
    }
    private changeLanguage(languageId: string) {
        if (this.monacoInstance) {
            const model = this.monacoInstance.getModel();
            if (model) {
                model.dispose();
            }
        }
        this.monacoInstance = createEditor(this.editorContainerId, languageId, '//* Code goes here');
    }
    private changeTheme(themeId: string) {
        monaco.editor.setTheme(themeId);
    }
}

</script>
<style lang="scss" scoped>
.app-base-note {
  background-color: #333333;
}
#app-monaco-editor {
  min-height: 50vh;
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
