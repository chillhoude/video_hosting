new Vue({
    el:'#seach_field',
    data:{
        search_str:'',
    },
    methods:{
        search(){
            if (this.search_str.length != 0)
            {
                window.location.href = 'search='+this.search_str
            }
            else
            {
                console.log(window.localStorage)
            }
        }
    },
    created(){
    }
})
