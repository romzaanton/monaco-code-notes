const MonacoWebpackPlugin  = require('monaco-editor-webpack-plugin');
module.exports = {
    filenameHashing: false,
    configureWebpack: {
        entry: {
            'editor.worker.bundle': './node_modules/monaco-editor/esm/vs/editor/editor.worker.js',
            'json.worker.bundle': './node_modules/monaco-editor/esm/vs/language/json/json.worker',
            'css.worker.bundle': './node_modules/monaco-editor/esm/vs/language/css/css.worker',
            'html.worker.bundle': './node_modules/monaco-editor/esm/vs/language/html/html.worker',
            'ts.worker.bundle': './node_modules/monaco-editor/esm/vs/language/typescript/ts.worker',
        },
        plugins: [new MonacoWebpackPlugin()],
    }
  }