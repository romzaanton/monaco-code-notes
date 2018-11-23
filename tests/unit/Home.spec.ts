import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Home from '@/views/Home.vue';
import Vuetify from 'vuetify';

describe('Home.vue', () => {
  it('renders props.msg when passed', () => {
    Vue.use(Vuetify);
    const wrapper = shallowMount(Home);
    expect(wrapper.isVisible()).toBe(true);
  });
});
