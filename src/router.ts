import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import CodeNote from '@/components/BaseCodeNote.vue';
import NotebooksList from '@/components/BaseNotebooksList.vue';
import AllNotesList from '@/components/BaseAllNotesList.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/',
          component: AllNotesList,
        },
        {
          path: '/notebooks',
          component: NotebooksList,
        },
        {
          path: '/codeNotes',
          component: CodeNote,
        },
      ],
    },
  ],
});
