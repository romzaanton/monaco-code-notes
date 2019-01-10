import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import TheToolBar from '@/components/TheToolBar.vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('TheToolBar.vue', () => {
    test('render tool bar', () => {
        const wrapper = shallowMount(TheToolBar);
        expect(wrapper.isVisible()).toBe(true);
    })
});