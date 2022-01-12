function Home() {
    var self = this

    self.titleData = ko.observable()

    self.titlesData = ko.observableArray([])
    self.metaData = {
        favs: [],
        watchLater: [],
        seen: []
    }

    self.currentCategory = ko.observable()
    //Paginação
    self.currentPage = ko.observable(1)
    self.lastPage = ko.observable()
    self.pageNumbers = ko.observableArray([1,2,3])

    self.navigate = function (val) { 
        if (val === "next" && self.currentPage() < self.lastPage()){
            self.currentPage(self.currentPage()+1)
        } else if (val === "previous" && self.currentPage()>1){
            self.currentPage(self.currentPage()-1)
      
        } else if (val !== "next" && val !== "previous"){
            self.currentPage(val)
        }
        self.getTitlesData(self.currentCategory(),self.currentPage(), 24)

        if (self.currentPage() === 1) {
            $('#previousButton').addClass("disabled")
        } else {
            $('#previousButton').removeClass("disabled")
        }

        if (self.currentPage() === self.lastPage()) {
            $('#nextButton').addClass("disabled")
        } else {
            $('#nextButton').removeClass("disabled")
        }
    }


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

    self.getTitlesData = function (apiUrl, page, pagesize) {
        $.ajax({
            type: "GET",
            url: apiUrl + "?page=" + page + "&pagesize=" + pagesize,
            success: function (data) {
                data.Titles.forEach(element => {
                    element.img = findImage(element.Id)
                });
                self.titlesData(data.Titles)
                self.currentPage(data.CurrentPage)
                self.lastPage(data.TotalPages)
            }
        })
    }

    self.categoryChanged = function (selectedCategory) {
        switch (selectedCategory) {
            case "latest":
                self.currentCategory ("http://192.168.160.58/netflix/api/LastTitles")
                
                break
            case "movies":
                self.currentCategory("http://192.168.160.58/netflix/api/Movies")
                break
            case "series":
                self.currentCategory("http://192.168.160.58/netflix/api/Series")
                break
            default:
                self.currentCategory("http://192.168.160.58/netflix/api/LastTitles")
                break
        }
        self.currentPage(1)
        self.getTitlesData(self.currentCategory(), self.currentPage(), 24)
    }

    self.loadTitleModal = function (id) {
        if (id !== undefined) {
            $.ajax({
                type: "GET",
                url: "http://192.168.160.58/netflix/api/Titles/" + id,
                success: function (data) {
                    data.img = findImage(data.Id)
                    console.log(data.img)
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
    }


    self.init = function () {
        for (let k in self.metaData) {
            if (localStorage.getItem(k) != null) {
                self.metaData[k] = JSON.parse(localStorage.getItem(k))
            } else {
                self.metaData[k] = []
            }
        }

        $('.page-number').click(function (e) { 
            $('.page-number').removeClass("active")
            $(this).addClass("active")
        });
        

    }

    self.init()

}