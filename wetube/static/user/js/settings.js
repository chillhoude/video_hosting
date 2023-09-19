new Vue({
    el:'.user',
    data:{
        username:'',
        first_name:'',
        last_name:'',
        avatar:'',
        email:'',
        bio:''
    },
    created(){
        axios.get('/api/user/settings/user/',{
            headers:{
                'Authorization':`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
            }
        })
        .then(response=>{
            console.log(response.data)
            this.username = response.data[0]['username']
            this.first_name = response.data[0]['first_name']
            this.last_name = response.data[0]['last_name']
            this.avatar = response.data[0]['avatar']
            this.email = response.data[0]['email']
            this.bio = response.data[0]['bio']
        })
    },
    methods:{
        avatarSelector(){
            document.getElementById('file-avatar').click()
        },
        sendDataUser(){
            let formData = new FormData()
            console.log()
            if(document.getElementById('file-avatar').files[0] != undefined){
                formData.append('avatar',document.getElementById('file-avatar').files[0])
            }
            formData.append('bio',this.bio)
            formData.append('email',this.email)
            formData.append('last_name',this.last_name)
            formData.append('first_name',this.first_name)
            formData.append('username',this.username)
            axios.post('/api/user/set/user/',formData,{
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken':"{{ csrf_token }}",
                    'Authorization':`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
                }
            })
        }
    }
})