function Titles() {
    var self = this
    self.currentOption = ko.observable()
    self.selectedCategory = ko.observable()
    self.availableCategories = ko.observableArray([])
    self.titlesData = ko.observableArray([])
    self.currentPage
    self.currentCategory
    self.currentCountry
    self.currentYear

    function findImage(id) {
        for (let i = 0; i < IMAGES.length; i++) {
            if (IMAGES[i].id === id) {
                if (IMAGES[i].img_url === "none") {
                    return "http://www.thestahlman.com/Common/images/jquery/galleria/image-not-found.png"
                } else {
                    return IMAGES[i].img_url
                }
            }
        }
        return "http://www.thestahlman.com/Common/images/jquery/galleria/image-not-found.png"
    }

    self.categoryChanged = function (val, page = 1,clearData=false) {
        if (clearData) self.titlesData([])
        self.currentPage = page
        self.currentOption("categoria")
        self.currentCategory = val

        $.ajax({
            type: "GET",
            url: "http://192.168.160.58/netflix/api/Search/TitlesWithCategories?categories=" +
                String(val) +
                "&page=" + page + "&pagesize=15",
            success: function (data) {
                data.Titles.forEach(element => {
                    element.img = findImage(element.Id)
                });
                ko.utils.arrayPushAll(self.titlesData, data.Titles)
            }
        });
        $("#accordionData").removeClass("d-none")
        $("#loadMoreButton").removeClass("d-none")

    }

    self.loadCategories = function () {
        $.ajax({
            type: "GET",
            url: "http://192.168.160.58/netflix/api/Categories?page=1&pagesize=42",
            success: function (data) {
                self.availableCategories(data.Categories)
            }
        });
    }


    self.mapSelect = function (id, page = 1,clearData =false) {
        if (clearData) self.titlesData([])
        self.currentPage = page
        self.currentOption("mapa")
        self.currentCountry = id

        $.ajax({
            type: "GET",
            url: "http://192.168.160.58/netflix/api/Countries/" + id + "?page=" + page + "&pagesize=15",
            success: function (data) {
                data.Titles.forEach(element => {
                    element.img = findImage(element.Id)
                });
                ko.utils.arrayPushAll(self.titlesData, data.Titles)
            }
        });
        $("#accordionData").removeClass("d-none")
        $("#loadMoreButton").removeClass("d-none")


    }

    self.yearSelect = function (year, page = 1,clearData=false) {
        if (clearData) self.titlesData([])
        self.currentPage = page
        self.currentOption("ano")
        self.currentYear = year
        $.ajax({
            type: "GET",
            url: "http://192.168.160.58/netflix/api/TitlesByYear?year=" + year +
                "&page=" + page + "&pagesize=15",
            success: function (data) {
                data.Titles.forEach(element => {
                    element.img = findImage(element.Id)
                });
                ko.utils.arrayPushAll(self.titlesData, data.Titles)
            }
        });
        $("#accordionData").removeClass("d-none")
        $("#loadMoreButton").removeClass("d-none")

    }

    self.loadMore = function () {
        switch (self.currentOption()) {
            case "categoria":
                self.categoryChanged(self.currentCategory,++self.currentPage)
                break;
            case "ano":
                self.yearSelect(self.currentYear,++self.currentPage)
                break;
            case "mapa":
                self.mapSelect(self.currentCountry,++self.currentPage)
                break;
        }
    }

    self.init = function () {
        self.loadCategories()
    }

    self.init()
}