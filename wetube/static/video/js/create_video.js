new Vue ({
    el:'.video',
    data:{
        user:[],
        video:document.getElementById('video_file'),
        title_image:document.getElementById('title_image'),
        title:'',
        description:'',
        error_text:'',
    },
    created(){
        axios.get('/api/user/me/preview/',{
            headers:{
                Authorization:`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
            }
        })
        .then(reqeust=>{
            this.user = reqeust.data[0]
        })
    },
    methods:{
        openVideoFile(){
            this.video = document.getElementById('video_file')
            
            return document.getElementById('video_file').click()
        },
        openImageFile(){
            return document.getElementById('title_image_file').click()
        },
        createVideoAxio(){
            let VideoForm = new FormData
            if(this.video.files[0] != undefined){
                VideoForm.append('video',this.video.files[0])
                this.error_text =''
            }
            else{
                document.getElementById('video-p').style['color'] = 'red'
                document.styleSheets[3].cssRules[17].style['display']='flex'
                document.styleSheets[3].cssRules[20].style['background-color']='red'
                setTimeout(()=>{
                    document.getElementById('video-p').style['color'] = 'black'
                    document.styleSheets[3].cssRules[17].style['display']='none'
                    document.styleSheets[3].cssRules[20].style['background-color']='white'
                },7000)
                return this.error_text = "Отсутствует видео файл"
            }
            if (document.getElementById('title_image_file').files[0] != undefined){
                this.error_text =''
                VideoForm.append('title_image',document.getElementById('title_image_file').files[0])
            }
            else{
                document.getElementById('img-p').style['color'] = 'red'
                document.styleSheets[3].cssRules[19].style['background-color']='red'
                document.styleSheets[3].cssRules[17].style['display']='flex'
                setTimeout(()=>{
                    document.styleSheets[3].cssRules[19].style['background-color']='white'
                    document.getElementById('img-p').style['color'] = 'black'
                    document.styleSheets[3].cssRules[17].style['display']='none'
                },7000)
                return this.error_text = "Отсутствует файл 'заставки' видео"
            }
            if (this.title != ''){
                VideoForm.append('title',this.title)
            }
            else{
                document.styleSheets[3].cssRules[17].style['display']='flex'
                document.getElementById('name_video_p').style['color'] ='red'
                this.error_text = 'Осутствует название видео'
                setTimeout(()=>{
                    document.styleSheets[3].cssRules[17].style['display']='none'
                    document.getElementById('name_video_p').style['color'] ='black'
                    this.error_text =''
                },7500)
                return false
            }
            if(this.description != ''){
                VideoForm.append('description',this.description)
            }
            else{
                document.styleSheets[3].cssRules[17].style['display']='flex'
                document.getElementById('description_video_p').style['color'] ='red'
                this.error_text = 'Осутствует описание видео'
                setTimeout(()=>{
                    document.styleSheets[3].cssRules[17].style['display']='none'
                    document.getElementById('description_video_p').style['color'] ='black'
                    this.error_text =''
                },7500)
                return false
            }
            VideoForm.append('genre',document.getElementById('genre').value)
            VideoForm.append('status',document.getElementById('status').value)
            VideoForm.append('avtor',this.user.id)
            axios.post('/api/video/',VideoForm,{
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': document.cookie.split(';')[0].split('=')[1],
                    Authorization:`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
            }})
            .then(reqest=>{
                document.location.pathname = `/me/${this.user.username}/`
            })
        }
    }
})
document.getElementById('video_file').addEventListener('change',function(){
    if(this.value){
        document.getElementById('svg-video').style['display'] = 'none';
        document.getElementById('video-self').style['display'] = 'flex'
        document.getElementById('video-self').src = URL.createObjectURL(document.getElementById('video_file').files[0])
    }
    else{
        document.getElementById('svg-video').style['display'] = 'flex';
        document.getElementById('video-self').style['display'] = 'none'
    }
})
document.getElementById('title_image_file').addEventListener('change',function(){
    if(this.value){
        document.getElementById('svg-image').style['display'] = 'none';
        document.getElementById('image_video').style['display'] = 'flex'
        document.getElementById('image_video').src = URL.createObjectURL(document.getElementById('title_image_file').files[0])
    }
    else{
        document.getElementById('svg-image').style['display'] = 'flex';
        document.getElementById('image_video').style['display'] = 'none'
    }
})
// document.getElementById('svg-image').classList.add('Class-name')