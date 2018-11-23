import { Module } from 'vuex';

interface ViewEventState {
    drawerVisible: boolean;
}

export const ViewEventModule: Module<ViewEventState, any> =  {
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
