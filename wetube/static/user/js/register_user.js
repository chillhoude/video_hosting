new Vue({
    el:'.form-registr',
    data:{
        login:'',
        email:'',
        password:'',
        errors:[]
    },
    methods:{
        RegistrUser(){
            axios.post('/auth/users/',{
                'username':this.login,
                'password':this.password,
                'email':this.email
            })
            
            .catch(errorResponse=>{
                this.errors = Object.values(errorResponse.response.data)
            })
            .then(response=>{
            })
            
        },
        countError(){
            console.log(this.errors)
        },
    },
})