/* 
 * @description Класс timer 
 */

/**
 * @description Функция конструктор для создания объекта типа timer
 * @description Имитация текущегов времени 
 * @param {type} app
 * @returns {timer}
 */
function timer (app) {
    this.app = app;
    this.startTime = null;
    this.currentTime = null;
    this.init = function () {
        var programs = settings.programs.collection;
        for (var i = 0; i < programs.length; i++) {
            if (this.startTime === null) {
                this.startTime = programs[i]["start"];
            } else {
                if (this.startTime > programs[i]["start"]) {
                    this.startTime = programs[i]["start"];
                }
            }
        }
        this.currentTime = this.startTime + 32000;
        return this;
    };
    /**
     * @description Фунция запуска timer
     * @returns {undefined}
     */
    this.run = function () {
        setInterval(function (that) {
            if (that.currentTime === null) { that.currentTime = that.startTime; }
            that.currentTime = that.currentTime + 1;   
        }, 1000, this);
    };
    /**
     * @description Функция получения времени
     * @returns {String}
     */
    this.getTime = function () {
        var date = new Date(this.currentTime * 1000);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        return correction(hours) + ":" + correction(minutes);
    };
    
    this.getDate = function () {
        var date = new Date(this.currentTime * 1000);
        var day = date.getDate();
        var numberDay = settings.days[date.getDay()];
        var month = settings.months[date.getMonth()];
        return correction(day) + " " + month + " " + numberDay;
    };
    /**
     * @description Функция получнения даты в формате unix time
     * @returns {Number|.settings.programs.collection.start}
     */
    this.getUnixTime = function () {
        return this.currentTime ;
    };
    this.getCurrentTime = function () {
        return this.currentTime ;
    };
}