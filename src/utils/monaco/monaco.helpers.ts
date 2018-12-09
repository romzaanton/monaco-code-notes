import * as monaco from 'monaco-editor';


function setMonacoEnvVariables() {
  (window as any).MonacoEnvironment = {
    getWorkerUrl(moduleId: string, label: any) {
      if (label === 'json') {
        return './json.worker.bundle.js';
      }
      if (label === 'css') {
        return './css.worker.bundle.js';
      }
      if (label === 'html') {
        return './html.worker.bundle.js';
      }
      if (label === 'typescript' || label === 'javascript') {
        return './ts.worker.bundle.js';
      }
      return './editor.worker.bundle.js';
    },
  };
}

export function createEditor(selector: string, language: string, mockup: string) {
  setMonacoEnvVariables();
  const viewContainer = document.getElementById(selector);
  let monacoEditor;
  if (viewContainer !== null) {
    monacoEditor = monaco.editor.create(viewContainer, {
      value: mockup,
      language,
      folding: true,
      cursorStyle: 'line',
      cursorWidth: 10,
      cursorBlinking: 'solid',
      overviewRulerBorder: true,
      fixedOverflowWidgets: true,
      disableLayerHinting: true,
      selectionHighlight: true,
      roundedSelection: true,
      multiCursorMergeOverlapping: false,
      ariaLabel: '|',
      theme: 'vs-dark',
    });
  } else {
    throw new Error(`Illegible selector ${selector} for monaco editor create`);
  }
  return monacoEditor;
}

export function getLanguagesList() {
    return monaco.languages.getLanguages().map((v) => v.id);
}
