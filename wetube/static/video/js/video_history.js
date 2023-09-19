new Vue({
    el:'.history',
    data:{
        videos:[],
        sorted_video:{}
    },
    created(){
        axios.get('/api/video/history/',{
            headers:{  
                Authorization:`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
            }
        })
        .then(response => {
            this.videos = response.data;
            let all_month = ' января, февраля, марта, апреля, мая, июня, июля, августа, сентября, октября, ноября, декабря'.split(',')
            for(let i=0; i<this.videos.length;i++){
                date_video = new Date(this.videos[i].date);
                this.videos[i].date = date_video.getDate() + all_month[date_video.getMonth()]
                this.videos[i].video_image = `/galery/${this.videos[i].video_image}`
                this.videos[i].avtor_avatar = `/galery/${this.videos[i].avtor_avatar}`
                if (this.videos[i].counter_view==1){
                    this.videos[i].counter_view =`${this.videos[i].counter_view} просмотр`
                }
                else if (this.videos[i].counter_view>1){
                    this.videos[i].counter_view = `${this.videos[i].counter_view} просмотра`
                }
                else if (this.videos[i].counter_view>4||this.videos[i].counter_view==0){
                    this.videos[i].counter_view = `${this.videos[i].counter_view} просмотров` 
                }
            }

        })
    }
})