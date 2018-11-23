module.exports = {
    filenameHashing: false,
    configureWebpack: {
        entry: {
            'editor.worker.bundle': './node_modules/monaco-editor/esm/vs/editor/editor.worker.js',
            'json.worker.bundle': './node_modules/monaco-editor/esm/vs/language/json/json.worker.js',
            'css.worker.bundle': './node_modules/monaco-editor/esm/vs/language/css/css.worker.js',
            'html.worker.bundle': './node_modules/monaco-editor/esm/vs/language/html/html.worker.js',
            'ts.worker.bundle': './node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js',
        }
    }
  }