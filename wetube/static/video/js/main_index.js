new Vue({
    el: '#video_shield',
    data:{
        videos:[],
        user_id:''
    },
    methods: {
        reqeustOnVideo(el){
            window.location = `${window.location.href}${el}/`
        },
        videosSetData(response){
            this.videos = response.data;
            for(let i =0;i<this.videos.length;i++){
                if (this.videos[i].views_counter==1){
                    this.videos[i].views_counter =`${this.videos[i].views_counter} просмотр`
                }
                else if (this.videos[i].views_counter>1){
                    this.videos[i].views_counter = `${this.videos[i].views_counter} просмотра`
                }
                else if (this.videos[i].views_counter>4||this.videos[i].views_counter==0){
                    this.videos[i].views_counter = `${this.videos[i].views_counter} просмотров` 
                }
            }
        }
    },
    created(){
        if(document.cookie.split(';').find(el=>el.length === 51) == undefined){
            axios.get('/api/video/')
            .then(response => {
                this.videosSetData(response)
            })
        }
        else{
            this.user_id=document.cookie.split(';').find(el=>el.length === 51).split('=')[1]
            axios.get('/api/video/',{
                headers:{
                      
                    'Authorization':'Token ' + this.user_id
                }
            })
            .then(response => {
                this.videosSetData(response)})
        }
        
    },
})