new Vue({
    el:'.playlist',
    data:{playlist:[]},
    created(){
        axios.get(`/api/playlist/${document.location.pathname.split('/')[2]}/`)
        .then(request=>{
            this.playlist = request.data[0]
            this.playlist.video.push(this.playlist.video[0])
            console.log(this.playlist)
        })

    }
})