/**
 * @description Функция конструктор для создания класса получения данных с сервера
 * @returns {downloader}
 */
function downloader () {
    var app = null;
    var app = this.app;
    this.getDataJson = function (app) {
        this.app = app;
        fethDataCannels(app);
    }
    /**
     * @description Функция получения данных по каналам
     * @param {type} obj
     * @returns {undefined}
     */
    function fethDataCannels(obj) {
        app = obj;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'channels.json', true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status != 200) {
                throw new Error(xhr.statusText);
            } else {
                settings["channels"] = JSON.parse(xhr.responseText);
                fethDataProgramms();
            }
        }
    }
    /**
     * @description Функция получения данных по программам
     * @param {type} obj
     * @returns {undefined}
     */
    function fethDataProgramms(obj) {
        var that = obj;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'programms.json', true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status != 200) {
                throw new Error(xhr.statusText);
            } else {
                settings["programs"] = JSON.parse(xhr.responseText);
                app.init();
            }
        }
    }
}

