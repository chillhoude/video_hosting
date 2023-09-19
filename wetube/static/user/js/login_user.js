new Vue({
    el:'.form-login',
    data:{
        username:'',
        password:'',
        auth_token:{},
        remember_me:false,
        user_id:document.cookie.split(';').find(el=>el.length === 51)
    },
    methods:{
        buttonPress(){
            axios.post('/auth/token/login/',{
                'username':this.username,
                'password':this.password,
                
            })
            .then(response =>{
                document.cookie=`sessionid=${response.data['auth_token']}; path=/ `;
                window.location.href='http://127.0.0.1:8000/';
            })
        },

    },
    created(){
        if (this.user_id != null){
            document.cookie = this.user_id + ';path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;'
        }
    }
})
