export const state = () => ({
    scroll: 0,
    image: '',
    title: '',
    search: false,
    recommends: [],
})
export const mutations = {
    setScroll(state, data) {
        // console.log(data)
        state.scroll = data
    },
    setImage(state, data){
        state.image = `url(${data}) no-repeat`
    },
    setTitle(state, data) {
        state.title = data
    },
    toggleSearch(state){
        state.search = !state.search
    },
    setRecommends(state, data) {
        state.recommends = data;
    },
}
