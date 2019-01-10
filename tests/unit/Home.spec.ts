import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import Home from '@/views/Home.vue';
import AppSideBar from '@/components/TheSideBar.vue';
import AppToolBar from '@/components/TheToolBar.vue';
import AppCodeNote from '@/components/BaseCodeNote.vue';
import VueRouter from 'vue-router'
import Vuetify from 'vuetify';

jest.mock('monaco-editor', () => ({
    get: () => {
        console.log(`Mock monaco editor`);
    },
}));


Vue.use(Vuetify);
Vue.use(VueRouter);



describe('Home.vue', () => {
    test('render home view', () => {
        const wrapper = shallowMount(Home);
        expect(wrapper.isVisible()).toBe(true);
        expect(wrapper.contains(AppToolBar)).toBe(true);
        expect(wrapper.contains(AppSideBar)).toBe(true);
        expect(wrapper.contains(AppCodeNote)).toBe(true);
    });
});