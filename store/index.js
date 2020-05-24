export const state = () => ({
    scroll: 0,
    image: '',
    title: '',
    search: false
})
export const mutations = {
    setScroll(state, data) {
        state.scroll = data
    },
    setImage(state, data){
        state.image = 'url(' + data + ') no-repeat'
    },
    setTitle(state, data) {
        state.title = data
    },
    setSearch(state, data){
        state.search = data
    }
}
