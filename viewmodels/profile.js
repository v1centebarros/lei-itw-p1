function Profile() {
    var self = this

    self.titleData = ko.observable()

    self.titlesData = ko.observableArray([])
    self.metaData = {
        favs: [],
        watchLater: [],
        seen: []
    }

    self.favsData = ko.observableArray()
    self.seenData = ko.observableArray()
    self.watchLaterData = ko.observableArray()
    
    
    self.updateLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data))
    }

    function findImage(id) {
        for (let i = 0; i< IMAGES.length;i++){
            if (IMAGES[i].id === id){
                if (IMAGES[i].img_url === "none"){
                    return "https://cdn.pixabay.com/photo/2017/02/01/00/26/cranium-2028555_960_720.png"
                }else {
                    return IMAGES[i].img_url
                }
            }
        }
        return "https://cdn.pixabay.com/photo/2017/02/01/00/26/cranium-2028555_960_720.png"
    }





    self.loadData = function (array) { 
        let temp = []
        for (e in array) {
            $.ajax({
                type: "GET",
                url: "http://192.168.160.58/netflix/api/Titles/" + array[e],
                async: false,
                success: function (data) {
                    data.img = findImage(data.Id)
                    temp.push(data)
                }
            });
        }
        return temp
    }




    self.loadTitleModal = function (id) {
        if (id !== undefined) {
            $.ajax({
                type: "GET",
                url: "http://192.168.160.58/netflix/api/Titles/" + id,
                success: function (data) {
                    data.img = findImage(data.Id)
                    self.titleData(data)
                    self.checkButtons(id)
                },
            })
            $("#titleModal").modal("show")
        } else {
            self.titleData(undefined)
        }
    }

    self.checkButtons = function (id) {
        for (let k in self.metaData) {
            if (self.metaData[k].includes(String(id))) {
                document.getElementById(k + '-button').classList.add("active")
            }
        }
    }

    self.updateMetaData = function (id, name) {
        if (!$('#' + name + '-button').hasClass("active")) {
            //Adicionar à lista de favoritos
            if (!self.metaData[name].includes(id))
            self.metaData[name].push(String(id))

            self.updateLocalStorage(name, self.metaData[name])
            $('#' + name + '-button').addClass("active")
        } else {
            //Remover do favoritos
            self.metaData[name].splice(self.metaData[name].indexOf(id), 1)
            self.updateLocalStorage(name, self.metaData[name])

            $('#' + name + '-button').removeClass("active")
        }
        self.watchLaterData(self.loadData(self.metaData.watchLater))
        self.seenData(self.loadData(self.metaData.seen))
        self.favsData(self.loadData(self.metaData.favs))
    }


    self.init = function () {
        for (let k in self.metaData) {
            if (localStorage.getItem(k) != null) {
                self.metaData[k] = JSON.parse(localStorage.getItem(k))
            } else {
                self.metaData[k] = []
            }
        }


        self.watchLaterData(self.loadData(self.metaData.watchLater))
        self.seenData(self.loadData(self.metaData.seen))
        self.favsData(self.loadData(self.metaData.favs))
    }


    self.init()

}