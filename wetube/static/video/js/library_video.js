new Vue({
    el:'.history_viewed',
    data:{
        request_data_history:{}
    },
    created(){
        axios.get('/api/video/history/',{
            headers:{
                Authorization:`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
            }
        })
        .then(response=>{
            
            this.request_data_history=response.data
            for(let i=0; i<this.request_data_history.length; i++){
                if (this.request_data_history[i].views_counter==1){
                    this.request_data_history[i].views_counter = this.request_data_history[i].views_counter + ' просмотр'
                }
                else if (this.request_data_history[i].views_counter>1){
                    this.request_data_history[i].views_counter = this.request_data_history[i].views_counter + ' просмотра'
                }
                else if (this.request_data_history[i].views_counter>4||this.request_data_history[i].views_counter==0){
                    this.request_data_history[i].views_counter = this.request_data_history[i].views_counter + ' просмотров'
                }
            }
        })
    }
})

new Vue({
    el:'.like',
    data:{
        request_data_like:{},
    },
    created(){
        axios.get('/api/video/like/',{
            headers:{
                Authorization:`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
            }
        })
        .then(response=>{
            
            this.request_data_like = response.data;
            console.log(this.request_data_like)
            for(let i=0; i<this.request_data_like.length; i++){
                if (this.request_data_like[i].views_counter==1){
                    this.request_data_like[i].views_counter = this.request_data_like[i].views_counter + ' просмотр'
                }
                else if (this.request_data_like[i].views_counter>1){
                    this.request_data_like[i].views_counter = this.request_data_like[i].views_counter + ' просмотра'
                }
                else if (this.request_data_like[i].views_counter>4||this.request_data_like[i].views_counter==0){
                    this.request_data_like[i].views_counter = this.request_data_like[i].views_counter + ' просмотров'
                }
            }
        })
    }
        
})
new Vue({
    el:'.watch_later',
    data:{
        request_data_watch_later:[],
    },
    created(){
        axios.get('/api/video/watch-later/',{
            headers:{
                Authorization:`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
            }
        })
        .then(response=>{
            this.request_data_watch_later = response.data;
            for(let i =0;i<this.request_data_watch_later.length;i++){
                if (this.request_data_watch_later[i].views_counter==1){
                    this.request_data_watch_later[i].views_counter = this.request_data_watch_later[i].views_counter + ' просмотр'
                }
                else if (this.request_data_watch_later[i].views_counter>1){
                    this.request_data_watch_later[i].views_counter = this.request_data_watch_later[i].views_counter + ' просмотра'
                }
                else if (this.request_data_watch_later[i].views_counter>4||this.request_data_watch_later[i].views_counter==0){
                    this.request_data_watch_later[i].views_counter = this.request_data_watch_later[i].views_counter + ' просмотров'
                }
            }
        })
    }
        
})
new Vue({
    el:'.saved_playlist',
    data:{
        request_data_saved_playlist:[],
    },
    created(){
        axios.get('/api/playlist/saved-playlist/',{
            headers:{
                Authorization:`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
            }
        })
        .then(response=>{
            this.request_data_saved_playlist = response.data;
        })
    }
        
})