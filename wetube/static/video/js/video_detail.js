new Vue({
    el:'.video',
    data:{
        pk:document.location.pathname,
        video:{},
        user_id:''
    },
    methods:{
        like(){
            axios.post(`/api/video${document.location.pathname}like/`,{},{
                headers:{
                    'Authorization':`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
                }
            })
            .then(response=>{
                if (response.data['context']=='plus like'){
                    this.video['like_count'] += 1
                }
                else if(response.data['context']=='minus like'){
                    this.video['like_count'] -= 1
                }
                else if(response.data['context']=='plus like,minus dislike'){
                    this.video['like_count'] += 1
                    this.video['dislike_count'] -= 1
                }
            })
        },
        dislike(){
            axios.post(`/api/video${document.location.pathname}dislike/`,{},{
                headers:{
                    'Authorization':`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
                }
            })
            .then(response=>{
                if (response.data['context']=='plus dislike'){
                    this.video['dislike_count'] += 1
                }
                else if(response.data['context']=='minus dislike'){
                    this.video['dislike_count'] -= 1
                }
                else if(response.data['context']=='minus like,plus dislike'){
                    this.video['like_count'] -= 1
                    this.video['dislike_count'] += 1
                }
            })
        },
        addWatchLater(){
            axios.post(`/api/video${document.location.pathname}watch-later/`,{},{
                headers:{
                    'Authorization':`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
                }
            })
        },
        addToPlaylist(){
            document.styleSheets[2].cssRules[28].style['display']='flex'
            document.styleSheets[2].cssRules[27].style['filter']='blur(1.2em)'
            document.styleSheets[2].cssRules[29].style['overflow'] = 'hidden'
        },
        share(){
            document.styleSheets[2].cssRules[21].style['display']='flex'
            document.styleSheets[2].cssRules[27].style['filter']='blur(1.2em)'
            document.styleSheets[2].cssRules[29].style['overflow'] = 'hidden'
        },
        showAllDiv(){
            document.styleSheets[3].cssRules[10].style['display'] = 'none'
            document.styleSheets[3].cssRules[9].style['height'] = 'auto'
        },
        videoSetData(response){
            console.log(response.data[0])
            this.video = response.data[0];
            date_video = new Date(response.data[0].date_public);
            let all_month = ' января, февраля, марта, апреля, мая, июня, июля, августа, сентября, октября, ноября, декабря'.split(',')
            this.video.date_public = date_video.getDate() + all_month[date_video.getMonth()]
            // строка просмотров
            if (this.video.views_counter==1){
                this.video.views_counter_str =`${this.video.views_counter} просмотр`
            }
            else if (this.video.views_counter>1){
                this.video.views_counter_str = `${this.video.views_counter} просмотра`
            }
            else if (this.video.views_counter>4||this.video.views_counter==0){
                this.video.views_counter_str = `${this.video.views_counter} просмотров` 
            }
            // строка с лайками
            if (this.video.like_set==1){
                this.video.like_set_str =`${this.video.like_set} лайк`
            }
            else if (this.video.like_set>1){
                this.video.like_set_str = `${this.video.like_set} лайка`
            }
            else if (this.video.like_set>4||this.video.like_set==0){
                this.video.like_set_str = `${this.video.like_set} лайков` 
            }
            // строка с дизлайками
            if (this.video.dislike_set==1){
                this.video.dislike_set_str =`${this.video.dislike_set} дизлайк`
            }
            else if (this.video.dislike_set>1){
                this.video.dislike_set_str = `${this.video.dislike_set} дизлайка`
            }
            else if (this.video.dislike_set>4||this.video.dislike_set==0){
                this.video.dislike_set_str = `${this.video.dislike_set} дизлайков` 
            }
            if (this.video.description.split(' ').length >20||this.video.description.split('\r\n').length >2){
                this.heigth = 'big'
                document.styleSheets[3].cssRules[9].style['height'] = '96px'
            }
            else{
                document.styleSheets[3].cssRules[9].style['height'] = '72px'
                this.heigth = 'small'
            }
        }
    },
    created(){
        if(document.cookie.split(';').find(el=>el.length === 51) == undefined){
            axios.get('/api/video'+ this.pk)
            .then(response =>{
                this.videoSetData(response)})
        }
        else{
            this.user_id = document.cookie.split(';').find(el=>el.length === 51) == undefined;
            axios.get('/api/video'+ this.pk,{
                headers:{
                    'Authorization':`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
                }
            })
            .then(response =>{
                this.videoSetData(response)
            })
        }
            
    },
})
new Vue({
    el:'.content-comment',
    data:{
        pk:document.location.pathname,
        comments:[],
        comment_text:'',
        user_id:'',
        change:false,
        index_comment_change:[]
    },
    methods:{
        show_menu(comment_id){
            console.log()
            if(document.getElementById(`comment${comment_id}`).style.display == '' || document.getElementById(`comment${comment_id}`).style.display == 'none'){
                document.styleSheets[2].cssRules[29].style['overflow'] = 'hidden'
                document.getElementById(`comment${comment_id}`).style.display = 'flex'
            }
                
            else{
                document.getElementById(`comment${comment_id}`).style.display = 'none'
                document.styleSheets[2].cssRules[29].style['overflow'] = 'auto'

            }
        },
        insert_massage(index){
            this.comment_text = this.comments[index].comment
            this.change = true
            this.index_comment_change = index
            document.getElementById(`comment${this.comments[this.index_comment_change].id}`).style.display = 'none'
        },
        update_massage(){
            if (this.comment_text.length != 0){
                axios.put(`/api/comment/${this.comments[this.index_comment_change].id}/`,
                {
                    comment:this.comment_text,
                    video:this.pk
                },{headers:
                    {Authorization:`Token ${this.user_id}`}}
                )
                .then(request=>{
                    this.change = false
                    this.comment_text = ''
                    this.comments[this.index_comment_change].comment = request.data.comment
                })
            }
        },
        delete_massage(index){
            axios.delete(`/api/comment/${this.comments[index].id}/`)
            .then(response=>{
                document.getElementById(`comment${this.comments[index].id}`).style.display = 'none'
                this.comments.splice(index,1)
            })
        },
        send_massage(){
            if(this.comment_text.length !=0 && this.user_id!=''){
                axios.post(`/api/comment/${this.pk}/`,{
                    'comment':this.comment_text
                },{
                    headers:{
                        'Authorization':`Token ${this.user_id}`
                    }
                })
                .then(request=>{
                    request.data['response'].avtor_img = `/galery/${request.data['response'].avtor_img}`
                    this.comments.unshift(request.data['response'])
                    this.comment_text = ''
                })
                
            }
            else{
                console.log('Error')
            }
        },
        
 
    },
    created(){
        
        for(let i=0;i<2;i++){
            this.pk = this.pk.replace('/','')
        }
        if(document.cookie.split(';').find(el=>el.length === 51) == undefined){
            this.user_id =''
            axios.get(`/api/comment/${this.pk}/`)
            .then(response =>{
                this.comments = response.data;
                for(let i=0;i<this.comments.length;i++){
                    this.comments[i].avtor_img = `/galery/${this.comments[i].avtor_img}`
                }
            })
        }
        else{
            this.user_id =document.cookie.split(';').find(el=>el.length === 51).split('=')[1]
            axios.get(`/api/comment/${this.pk}/`,{
                headers:{
                    Authorization:`Token ${this.user_id}`
                }
            })
            .then(response =>{
                this.comments = response.data;
                for(let i=0;i<this.comments.length;i++){
                    this.comments[i].avtor_img = `/galery/${this.comments[i].avtor_img}`
                }
            })
        }
    },
})

new Vue({
    el:'#same-video',
    data:{
        request_data:{},
        self_video:document.location.pathname,
    },
    created(){
        for(var i = 0; i<=2;i++){
            this.self_video = this.self_video.replace('/','')
        }
        let video_id = document.location.pathname;
        axios.get(`/api/video${video_id}sc/`)
        .then(response =>{
            this.request_data = response.data;
            for(let i =0;i<this.request_data.length;i++){
                if (this.request_data[i].views_counter==1){
                    this.request_data[i].views_counter =`${this.request_data[i].views_counter} просмотр`
                }
                else if (this.request_data[i].views_counter>1){
                    this.request_data[i].views_counter = `${this.request_data[i].views_counter} просмотра`
                }
                else if (this.request_data[i].views_counter>4||this.request_data[i].views_counter==0){
                    this.request_data[i].views_counter = `${this.request_data[i].views_counter} просмотров` 
                }
            }
        })
    },
    
})

const content = document.querySelector('.content')
content.addEventListener('click',function({target}){
    if(target!=document.getElementById('more-menu-radio') && target!=document.getElementsByClassName('more-menu')[0] ){
        document.getElementById('more-menu-radio').checked = false
    }
    
})