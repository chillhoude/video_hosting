new Vue({
    el:'#video_found',
    data:{
        search_str:window.location.pathname.slice(8),
        videos:[]
    },
    methods:{},
    created(){
        axios.get('/api/video/?search='+this.search_str)
        .then(response=>{
            this.videos = response.data;
            console.log(this.videos)
        })
    }
})