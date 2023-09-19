new Vue({
    el:'.user_main',
    data:{
        username:document.location.pathname.split('/')[2],
        user:[],
        communityMassage:[]
    },
    created(){
        axios.get('/api/user/'+this.username+'/')
        .then(request=>{
            this.user = request.data[0];
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
        axios.get('/api/commentcommunity/user/'+document.location.pathname.split('/')[2]+'/')
        .then(request=>{
            this.communityMassage = request.data;
            console.log(this.communityMassage)
        })
    }
}) 

new Vue({
    el:'#content-community',
    data:{
        communityMassage:[]
    },
    created(){
        axios.get('/api/commentcommunity/user/'+document.location.pathname.split('/')[2]+'/')
        .then(request=>{
            this.communityMassage = request.data;
            console.log(this.communityMassage)
        })
    }
})