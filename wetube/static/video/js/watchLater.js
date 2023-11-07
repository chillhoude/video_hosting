new Vue({
    el:".content",
    data:{
        videos:[]
    },
    created(){
         axios.get('/api/video/watch-later/',{
            headers:{
                Authorization:`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
         }
        })
        .then(request=>{
            this.videos = request.data
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
                let all_month = ' января, февраля, марта, апреля, мая, июня, июля, августа, сентября, октября, ноября, декабря'.split(',')
                let date_video = new Date(this.videos[i].date_public)
                this.videos[i].date_public = date_video.getDate() + all_month[date_video.getMonth()]
                
            }
        })
    }
})