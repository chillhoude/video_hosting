new Vue({
    el:".video",
    data:{
        title:'',
        description:'',
        video:'',
        title_image:'',
        status_video:'',
        genre:'',
        user:[],
    },
    created(){
        axios.get(`/api/video/${document.location.pathname.split('/')[2]}/change/`)
        .then(request=>{
            console.log(request.data)
            this.title = request.data.title
            this.description = request.data.description
            this.video = request.data.video
            this.title_image = request.data.title_image
            this.status_video = request.data.statusq
            this.genre = request.data.genre
        })
    },
    methods:{
        selectVideoFile(){
            document.getElementById('video-file').click()

        },
        selectTitleImageFile(){
            return document.getElementById('title_image').click()
        }
    }
})
function videoPlay(video){
    video.play()
}
function videoPause(video){
    video.pause()
}