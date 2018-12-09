import * as monaco from 'monaco-editor';

export const defaultMonacoLanguage = 'typescript';
export const defaultMonacoData = [ 'function x() {',
'\tconsole.log("Hello world!");',
'}'].join('\n');

export enum NoteType {Code, Link, Text}

export interface Note {
    id: number;
    name: string;
    notebookId: number;
    order: number;
    type?: NoteType;
    data?: string;
    language?: string;
    imageSource?: string;
    isNewNote?: boolean;
    isDeletedNote?: boolean;
}


export interface Notebook {
    id: number;
    name: string;
    order: number;
    imageSource?: string;
    owner?: string;
    updated?: Date;
    sharedWith?: string;
    isNewNotebook?: boolean;
}
