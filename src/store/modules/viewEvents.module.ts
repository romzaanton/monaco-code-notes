import { Module } from 'vuex';
import { MainState } from '@/store/store';

interface ViewEventState {
    drawerVisible: boolean;
}

export const ViewEventModule: Module<ViewEventState, MainState> =  {
    namespaced: true,
    state: {
        drawerVisible: false,
    },
    mutations: {
        setDrawerVisibility(state: ViewEventState) {
            state.drawerVisible = !state.drawerVisible;
        },
    },
};
