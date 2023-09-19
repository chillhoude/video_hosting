new Vue({
    el:'#user_check',
    data:{
        user_id:'',
        auth_user:[],
    },
    created(){
        if(document.cookie.split(';').find(el=>el.length === 51) == undefined){
            this.user_id=''
        }
        else{
            this.user_id=document.cookie.split(';').find(el=>el.length === 51).split('=')[1]
        }
        if(this.user_id.length != 0){
            axios.get('/api/user/me/preview/',{
                headers:{
                    'Authorization':`Token ${document.cookie.split(';').find(el=>el.length === 51).split('=')[1]}`
                }
              })
            .then(response=>{
                this.auth_user=response.data[0];
            })
        }
        
    }
        
})
