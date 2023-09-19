new Vue({
    el:'#content-mainpage',
    data:{
        new_video:[],
        popular_video:[],
        video_scroll : document.getElementById('div_scroll'),
        username:document.location.pathname.split('/')[2],
    },
    methods:{
        left_scroll(){
            this.video_scroll.style.marginLeft = 0 + 'px';
        },
        right_scroll(){
            this.video_scroll.style.marginLeft = -250 * 5 + 'px';
            console.log(this.video_scroll.style.left)
        }
    },
    created(){
        axios.get('/api/video/popular/'+this.username+'/')
        .then(request=>{
            this.popular_video = request.data;
            for(let i = 0; i<this.popular_video.length;i++){
                if (this.popular_video[i].views_counter == 1){
                    this.popular_video[i].views_counter = this.popular_video[i].views_counter + ' просмотр'
                }
                else if (this.popular_video[i].views_counter>1){
                    this.popular_video[i].views_counter = this.popular_video[i].views_counter + ' просмотра'
                }
                else if (this.popular_video[i].views_counter>4||this.popular_video[i].views_counter==0){
                    this.popular_video[i].views_counter = this.popular_video[i].views_counter + ' просмотров'
                }
                let all_month = ' января, февраля, марта, апреля, мая, июня, июля, августа, сентября, октября, ноября, декабря'.split(',')
                let date_video = new Date(this.popular_video[i].date_public)
                this.popular_video[i].date_public = date_video.getDate() + all_month[date_video.getMonth()]
            }
        })
        axios.get('/api/video/new/'+this.username+'/')
        .then(request=>{
            this.new_video = request.data;
            for(let i = 0; i<this.new_video.length;i++){
                if (this.new_video[i].views_counter==1){
                    this.new_video[i].views_counter = this.new_video[i].views_counter + ' просмотр'
                }
                else if (this.new_video[i].views_counter>1){
                    this.new_video[i].views_counter = this.new_video[i].views_counter + ' просмотра'
                }
                else if (this.new_video[i].views_counter>4||this.new_video[i].views_counter==0){
                    this.new_video[i].views_counter = this.new_video[i].views_counter + ' просмотров'
                }
                let all_month = ' января, февраля, марта, апреля, мая, июня, июля, августа, сентября, октября, ноября, декабря'.split(',')
                let date_video = new Date(this.new_video[i].date_public)
                this.new_video[i].date_public = date_video.getDate() + all_month[date_video.getMonth()]
            }
        })
        
        
        
    }
})
new Vue({
    el:'#content-video',
    data:{
        new_video:[],
    },
    created(){
        axios.get('/api/video/new/'+document.location.pathname.split('/')[2]+'/')
        .then(request=>{
            this.new_video = request.data;
            for(let i = 0; i<this.new_video.length;i++){
                if (this.new_video[i].views_counter==1){
                    this.new_video[i].views_counter = this.new_video[i].views_counter + ' просмотр'
                }
                else if (this.new_video[i].views_counter>1){
                    this.new_video[i].views_counter = this.new_video[i].views_counter + ' просмотра'
                }
                else if (this.new_video[i].views_counter>4||this.new_video[i].views_counter==0){
                    this.new_video[i].views_counter = this.new_video[i].views_counter + ' просмотров'
                }
                let all_month = ' января, февраля, марта, апреля, мая, июня, июля, августа, сентября, октября, ноября, декабря'.split(',')
                let date_video = new Date(this.new_video[i].date_public)
                this.new_video[i].date_public = date_video.getDate() + all_month[date_video.getMonth()]
            }
        })
        
    }
        
})
new Vue({
    el:'#content-playlists',
    data:{
        playlists:[],
    },
    created(){
        axios.get('/api/playlist/user-playlist/'+document.location.pathname.split('/')[2]+'/')
        .then(request=>{
            this.playlists = request.data;
        })
        
    }
        
})
