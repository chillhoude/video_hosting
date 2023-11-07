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
            this.status_video = request.data.status
            this.genre = request.data.genre
        })
        axios.get('/api/user/me/preview/',{
            headers:{
                Authorization:`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
            }
        })
        .then(reqeust=>{
            this.user = reqeust.data[0]
        })
    },
    methods:{
        selectVideoFile(){
            return document.getElementById('video_file').click()

        },
        selectTitleImageFile(){
            return document.getElementById('title_image').click()
        },
        sendDataVideo(){
            let formData = new FormData()
            if(document.getElementById('video_file').files[0] != undefined){
                formData.append('video',document.getElementById('video_file').files[0])
            }
            if (document.getElementById('title_image').files[0] != undefined){
                formData.append('title_image',document.getElementById('title_image').files[0])
            }
            formData.append('title',this.title)
            formData.append('description',this.description)
            formData.append('genre',document.getElementById('genre').value)
            formData.append('status',document.getElementById('status').value)
            formData.append('avtor',this.user.id)
            axios.put(`/api/video/${document.location.pathname.split('/')[2]}/`,formData,{
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': document.cookie.split(';')[0].split('=')[1],
                    Authorization:`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
                }
            })
            .then(
                document.location.pathname = `/me/${this.user.username}/`
            )
        },
        
    }
})
function videoPlay(video){
    video.play()
}
function videoPause(video){
    video.pause()
}
function showApllyDelete(){
    document.styleSheets[3].cssRules[19].style['display'] = 'block'
    document.styleSheets[3].cssRules[0].style['filter']='blur(5px)'
}
function closeMenuDelete(){
    document.styleSheets[3].cssRules[19].style['display'] = 'none'
    document.styleSheets[3].cssRules[0].style['filter']='blur(0px)'
}
function acceptDelete(){
    axios.delete(`/api/video/${document.location.pathname.split('/')[2]}/`,{
        headers:{
            Authorization:`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
        }
    })
    .then(reqeust=>{
        document.location.pathname = '/'
    })
}