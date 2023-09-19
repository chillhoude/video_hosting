new Vue({
    el:'.user',
    data:{user:[]},
    created(){
        axios.get('/api/user/auth/page/',{
            headers:{
                'Authorization':`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
            }
        })
        .then(reqest=>{
            this.user = reqest.data[0];
            if (this.user.count_subscriber >= 5 || this.user.count_subscriber == 0){
                this.user.count_subscriber = this.user.count_subscriber + ' подписчиков';
            }
            else if (this.user.count_subscriber == 1){
                this.user.count_subscriber = this.user.count_subscriber + ' подписчик';
            }
            else{
                this.user.count_subscriber = this.user.count_subscriber + ' подписчика';
            }
        })
    }
})
new Vue({
    el:'#video',
    data:{
        videos:[]
    },
    methods:{
    },
    created(){
        axios.get(`/api/video/new/${document.location.pathname.split('/')[2]}/`)
        .then(request=>{
            this.videos = request.data
            this.videos[0].title = 'jkasdhklasdhjalisdjalsdjalsdj'
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
                let all_month = ' января, февраля, марта, апреля, мая, июня, июля, августа, сентября, октября, ноября, декабря'.split(',')
                let date_video = new Date(this.videos[i].date_public)
                this.videos[i].date_public = date_video.getDate() + all_month[date_video.getMonth()]
            }
        })
    }
})
new Vue({
    el:'#playlists',
    data:{
        playlists:[],
    },
    created(){
        axios.get(`/api/playlist/owner/${document.location.pathname.split('/')[2]}/`)
        .then(request=>{
            this.playlists = request.data
        })
    }
        
})
new Vue({
    el:'#community',
    data:{
        communityMassage:[],
        massage:'',
        user:[],
        saaa:'jhasdhajdhadjhads'
    },
    created(){
        axios.get('/api/commentcommunity/user/'+document.location.pathname.split('/')[2]+'/')
        .then(request=>{
            this.communityMassage = request.data;
            console.log(this.communityMassage)
        })
        axios.get('/api/user/me/preview/',{
            headers:{
                'Authorization':`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
        }})
        .then(request=>{
            this.user = request.data[0]
        })
    },
    methods:{
        sendMassage(){
            axios.post(`/api/commentcommunity/`,{
                "text":this.massage,
                "avtor":this.user.id
            },
            {
                headers:{
                    'Authorization':`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
            }})
            .then(response=>{
                this.communityMassage.unshift(response.data)
                this.massage =''
            })
        }
    }        
})

