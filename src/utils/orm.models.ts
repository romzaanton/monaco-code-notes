import * as monaco from 'monaco-editor';

export enum NoteType {Code, Link, Text}

export interface Note {
    id: number;
    name: string;
    notebook: string;
    type?: NoteType;
    data?: string[];
    language?: monaco.languages.ILanguageExtensionPoint;
    imageSource?: string;
}


export interface Notebook {
    id: number;
    name: string;
    imageSource?: string;
}
