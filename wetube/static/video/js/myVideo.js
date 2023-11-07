new Vue({
    el:'.content',
    data:{
        videos:[],
    },
    created(){
        axios.get('/api/video/authuser-video/',{
            headers:{
                Authorization:`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
        }})
        .then(request=>{
            this.videos = request.data
            for(let i=0;i<this.videos.length;i++){
                if (this.videos[i].views_counter == 1){
                    this.videos[i].views_counter = this.videos[i].views_counter + ' просмотр'
                }
                else if (this.videos[i].views_counter>1){
                    this.videos[i].views_counter = this.videos[i].views_counter + ' просмотра'
                }
                else if (this.videos[i].views_counter>4||this.videos[i].views_counter==0){
                    this.videos[i].views_counter = this.videos[i].views_counter + ' просмотров'
                }
            }
            console.log(this.videos[0])
        })
    },
    methods:{
        showMenuOptions(video_id){
            document.querySelector(".content").addEventListener('click',function({target}){
                if(document.getElementById(`video_${video_id}`).style['display'] == 'flex'){
                    document.getElementById(`video_${video_id}`).style['display']='none'
                }
                else{
                    document.getElementById(`video_${video_id}`).style['display']='flex'
                }
            })
        },
        changeVideo(video_id){
            console.log(video_id)
        },
        deleteVideo(video_id){
            console.log(video_id)
        }
    }
})
function hideMenu(video_id){
    
}