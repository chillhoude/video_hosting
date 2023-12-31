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
            console.log(response.data)
            this.videos = response.data;
            let all_month = ' января, февраля, марта, апреля, мая, июня, июля, августа, сентября, октября, ноября, декабря'.split(',')
            for(let i=0; i<this.videos.length;i++){
                date_video = new Date(this.videos[i].date_view);
                this.videos[i].date_view = date_video.getDate() + all_month[date_video.getMonth()]
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

        })
    }
})