const state={
    isCollapse:false,
    select:[]
}
const actions={

}
const mutations={
    collapseMenu(state){
        state.isCollapse=!state.isCollapse
    }
}
const getter={

}
export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getter
}