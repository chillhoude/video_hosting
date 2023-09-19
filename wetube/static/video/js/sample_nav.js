new Vue({
    el:'.navigation',
    data:{user_id:''},
    created(){
        if(document.cookie.split(';').find(el=>el.length === 51) == undefined){
            this.user_id=''
        }
        else{
            this.user_id=document.cookie.split(';').find(el=>el.length === 51).split('=')[1]
        }
    }
})
new Vue({
    el:'.link-video',
    data:{
        link:document.location
    },
    methods:{
        closeShareLink(){
            document.styleSheets[2].cssRules[21].style['display']='none'
            document.styleSheets[2].cssRules[27].style['filter']='blur(0px)'
            document.styleSheets[2].cssRules[29].style['overflow'] = 'auto'
        },
    }
})
new Vue({
    el:'.list-playlist',
    data:{
        playlists:[],
        video_id:document.location.pathname
    },
    created(){
        for(let i=0;i<2;i++){
            this.video_id = this.video_id.replace('/','')
        }
        if(document.cookie.split(';').find(el=>el.length === 51) != undefined && this.video_id.length !=0){
            axios.get('/api/playlist/reqeust-user/',{
                headers:{
                    'Authorization':`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
                },
                params:{'video_id':this.video_id}
            })
            .then(response=>{
                this.playlists = response.data
                console.log(response.data   )
            })
        }
    },
    methods:{
        closeAddPlaylist(){
            document.styleSheets[2].cssRules[28].style['display']='none'
            document.styleSheets[2].cssRules[27].style['filter']='blur(0px)'
            document.styleSheets[2].cssRules[29].style['overflow'] = 'auto'
        },
        addVideo(id){
            axios.post(`/api/playlist/${id}/update-video/`,{'video':this.video_id})
            .then(response=>{
                console.log(response.data)
            })
            document.styleSheets[2].cssRules[28].style['display']='none'
            document.styleSheets[2].cssRules[27].style['filter']='blur(0px)'
            document.styleSheets[2].cssRules[29].style['overflow'] = 'auto'
        },
        openCreatePlaylist(){
            document.styleSheets[2].cssRules[32].style['display']='flex'
            document.styleSheets[2].cssRules[28].style['display']='none'
            document.styleSheets[2].cssRules[29].style['overflow'] = 'hidden'
        },
    }
})
new Vue({
    el:'.create-playlist',
    data:{
        user:[],
        name_playlist:'',
        error_massage:'',
    },
    created(){
        if(document.cookie.split(';').find(el=>el.length === 51) != undefined){
            axios.get('/api/user/me/preview/',{
                headers:{
                'Authorization':`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
                }
            })
            .then(response=>{
                this.user = response.data[0]
            })
        }
    },
        
    methods:{
        closeCreatePlaylist(){
            document.styleSheets[2].cssRules[32].style['display']='none'
            document.styleSheets[2].cssRules[27].style['filter']='blur(0px)'
            document.styleSheets[2].cssRules[29].style['overflow'] = 'auto'
        },
        createPlaylist(){
            if (this.name_playlist.length != 0){
                axios.post('/api/playlist/',{
                    "name":this.name_playlist,
                    "avtor":this.user.id
                },{
                    headers:{
                    'Authorization':`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
                }
                })
                .then(response=>{
                    document.styleSheets[2].cssRules[32].style['display']='none'
                    document.styleSheets[2].cssRules[27].style['filter']='blur(0px)'
                    document.styleSheets[2].cssRules[29].style['overflow'] = 'auto'
                })
            }
            else{
                this.error_massage = 'Введите название плейлиста!'
                document.styleSheets[2].cssRules[48].style['display'] = 'flex'
                document.styleSheets[2].cssRules[42].style['border'] = '1px solid red'
                setTimeout(()=>{
                    document.styleSheets[2].cssRules[42].style['border'] = '1px solid #aaaaaa'
                },3500)
                setTimeout(()=>{
                    document.styleSheets[2].cssRules[48].style['display'] = 'none'
                },4500)
            }
            
        }
    }
})