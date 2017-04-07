/**
 * @description Обект старница 
 * @description Создание структуры DOM и отображение данных
 * @param {type} app
 * @returns {page}
 */
function page (app) {
    this.app = app;
    
    this.createStructure = function () {
        var page = elem({el:"div",id:"page", class: "flex"});
        this.header = elem({el:"header",id:"header", class: "flex"});
        this.main = elem({el:"main",id:"main", class: "flex"});
        this.footer = elem({el:"footer",id:"footer", class: "flex"});
        appendChilds(page,[this.header,this.main,this.footer]);
        general.appendChild(page);
    };
    this.createHeader = function () {
        this.headerLeft = elem({id:"headerLeft", class: "flex"});
        this.headerCenter = elem({id:"headerСenter", class: "flex"});
        this.headerRight = elem({id:"headerRight", class: "flex"});
        appendChilds(this.header,[this.headerLeft,this.headerCenter,this.headerRight]);
        
        this.headerPage = new header ();
        this.headerPage.show(this);
        
        this.mainPage = new mainBlock(this);
        pageObj = this.mainPage;
        this.mainPage.init().show();
        
        this.footerPage = new footer ();
        this.footerPage.show(this);
        
        timeIndicator(app.t.getUnixTime());
        
    };

}

function header () {
    this.parent = null;
    
    this.show = function (el){
        this.parent = el;
        this.createLeft ();
        this.updateDateTime();
        this.createCenter();
        this.createRight();
    };
    /**
     * @description Функция создания и отображения блока с логотипом и временем
     * @returns {undefined}
     */
    this.createLeft = function () {
        this.logo = elem({class: " logo flex"});
        this.dateTime = elem({class: "dateTime flex"});
        this.date = elem({class: " date flex"});
        this.time = elem({class: "time flex"});
        
        this.time.innerHTML = this.parent.app.t.getTime();
        this.date.innerHTML = this.parent.app.t.getDate();
        
        appendChilds(this.dateTime,[this.date,this.time]);
        appendChilds(this.parent.headerLeft,[this.logo,this.dateTime]);
    };
    /**
     * @description Функция обновления времени (верх страницы раядом с логотипом)
     * @returns {undefined}
     * @description Функция 
     */
    this.updateDateTime  = function() {
        setInterval(function (that) {
            that.time.innerHTML = that.parent.app.t.getTime();
            that.date.innerHTML = that.parent.app.t.getDate();
        }, 1000, this);
    };
    this.createCenter = function () {
        var parent = this.parent.headerCenter;
        for (var i = -3; i < 8; i++) {
            var date = new Date((this.parent.app.t.getUnixTime() + (86400 * i)) * 1000);
            var div = document.createElement('div');
            var line = document.createElement('div');
            var text = document.createElement('div');
            div.className = "dayCalendar flex";
            line.className = "line";
            if (i === 0) {
                div.classList.add("today");
                div.classList.add("selected");
                text.innerHTML = "СЕГОДНЯ";
            } else if (i === 1) {
                div.classList.add("tomorrow");
                text.innerHTML = "ЗАВТРА";
            } else {
                text.innerHTML = settings.days[date.getDay()];
            }
            div.appendChild(text);
            div.appendChild(line);
            parent.appendChild(div);
        }
    };
    this.createRight = function () {
        var parent = this.parent.headerRight;
        parent.innerHTML = "TB-ГИД";
    };
}

function mainBlock(el) {
    this.app = el.app;
    el.page = this;
    this.parent = el.main;
    
    this.init = function () {
        this.tmp = elem({id: "tmp", class: "flex"});
        appendChilds(this.parent,[this.tmp]);
        this.tmpBlock = elem({id: "tmpBlock", class: "flex"})
        appendChilds(this.tmp,[this.tmpBlock]);
        var raz = this.tmp.offsetWidth - this.tmpBlock.offsetWidth;
        var o = raz % 60;
        settings["titleChannelWidth"] = this.tmpBlock.offsetWidth + o;
        settings["programsBlockWidth"] = raz - o;
        this.tmp.remove();
        return this;
    }
    
    this.show = function () {
        this.createStructure();
        this.showBlockTime();
        this.setPeriods();
        this.showCurrentTimePeriod();
        this.showChannels();
    };
    this.createStructure = function () {
        this.time = elem({id: "time", class: "flex"});
        this.schedule = elem({id: "schedule", class: "flex"});
        appendChilds(this.parent,[this.time, this.schedule]);
    };
    this.showBlockTime = function  () {
        this.timeTitle = elem({id: "timeTitle", class: "flex"});
        this.timeTitle.style.width = settings.titleChannelWidth + "px";
        this.timeTitle.innerHTML = "TB";
        this.timePeriod = elem({id: "timePeriod", class: "flex"});
        this.timePeriod.style.width = settings.programsBlockWidth + "px";
        appendChilds(this.time,[this.timeTitle, this.timePeriod]);
    };
    this.setPeriods = function () {
        var listTime = [];
        var now = new Date(this.app.t.getCurrentTime() * 1000);
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);

        for (var i = 0; i < 48; i++) {
            var date = new Date(now.getTime() + (1800000 * i));
            var hour = correction(date.getHours());
            var min = correction(date.getMinutes());
            listTime.push(date.getTime() / 1000);
        }
        this.listTime = listTime;
    };
    /**
     * @description Функция для отображеия текущего временного интервала
     * @param {type} time
     * @returns {undefined}
     */
    this.showCurrentTimePeriod = function (time = null) {
        var index = null;
        var lt = this.listTime;
        var currentTime = this.app.t.getCurrentTime();
        if (time !== null) {
            currentTime = time;
        }
        for (var i = 0; i < lt.length; i++) {
            if (lt[i] > currentTime) {
                index = i;
                break;
            }
        }
        if (index === null) {
            var time = lt[lt.length - 1] + 1800;
            if (time > currentTime) {
                index = 0;
            }
        }
        
        var fullSize = document.getElementById('timePeriod').offsetWidth;
        var firstSize = (fullSize / 2) * (1 / 3);
        var periods = settings.periods;
        
        var div = document.createElement('div');
        div.style.width = firstSize + "px";
        timePeriod.appendChild(div);
        div = document.createElement('div');
        
        if (index % 2 === 0) {
            if (index === 0) {
                div.innerHTML = periods[47];
            } else {
                div.innerHTML = periods[index - 1];
            }
            div.style.width = (fullSize / 2) + "px";
            timePeriod.appendChild(div);
            div = document.createElement('div');
            div.innerHTML = periods[index];
            div.style.width = ((fullSize / 2) - firstSize) + "px";
            timePeriod.appendChild(div);
            var finish = lt[index] + 1200;
            var start = finish - 3600;
            
        } else {

            if (currentTime >= lt[index] - 600) {
                div.innerHTML = periods[index];
                div.style.width = (fullSize / 2) + "px";
                timePeriod.appendChild(div);
                div = document.createElement('div');
                div.innerHTML = periods[index + 1];
                div.style.width = ((fullSize / 2) - firstSize) + "px";
                timePeriod.appendChild(div);
                var start = lt[index] - 600;
                var finish = start + 3600;
                
            } else {
                if (index === 1) {
                    div.innerHTML = periods[46];
                } else {
                    div.innerHTML = periods[index - 2];
                }
                div.style.width = (fullSize / 2) + "px";
                timePeriod.appendChild(div);
                div = document.createElement('div');
                div.innerHTML = periods[index - 1];
                div.style.width = ((fullSize / 2) - firstSize) + "px";
                timePeriod.appendChild(div);
                var finish = lt[index] - 601;
                var start = finish - 3600;
            }
        }
        timePeriod.setAttribute('data-finish', finish);
    }
    this.showChannels = function () {
       this.createChannel();
    };
    
    this.createChannel = function () {
        if (this.currentIndex === undefined) {
            this.startIndex = 0;
            this.currentIndex = 0;
            this.position = 0;
        }
        var countChannels = this.countChannels();
        var selected = 0;
        var channels = settings.listChannels;
        var height = this.schedule.offsetHeight / (countChannels);
        this.countCh = countChannels - 2;
        for (var i = this.currentIndex, k = 0; i < channels.length && k < (this.countCh); i++, k++){
            selected = 0;
            var ch = this.createStructureBlockChannel();
            if (k === this.position) {
                ch.channel.style.height = (height * 3) + "px";
                ch.channelTitle.classList.add("selected");
                selected = 1;
            }
            ch.channelTitle.innerHTML = settings.channels.collection[channels[i].index].title;
            createProgramms (ch.programsBlock, i, this, selected);
        }
        this.showSelectedElementInfo();
        showSelectedElement();
        
        
    };
    /**
     * @description Функция отображения данных по выбранной программе
     * @returns {undefined}
     */
    this.showSelectedElementInfo = function () {
        var selectProgram = document.getElementsByClassName('selectProgram')[0];
        ///var widthPrograms = document.getElementsByClassName('selectProgram')[0];
        var tmp = parents(selectProgram, {"class": "programsBlock"});
        var descriptionBlock = tmp.nextElementSibling;
        descriptionBlock.style.height = (tmp.offsetHeight * 2) + "px";
        
        var title = elem({class:"titleProgram flex"});
        var time = elem({class:"timeProgram flex"});
        var subTitle = elem({class:"subTitleProgram flex"});
        
        var start = parseInt(selectProgram.getAttribute("data-start"),10);
        var finish = start +  parseInt(selectProgram.getAttribute("data-duration"),10);
        var st = correction(new Date (start * 1000).getHours()) + ":" + correction(new Date (start * 1000).getMinutes());
        var fn = correction(new Date (finish * 1000).getHours()) + ":" + correction(new Date (finish * 1000).getMinutes());
        title.innerHTML = selectProgram.getAttribute("data-title");
        time.innerHTML = st +"-"+ fn;
        var text = elem({class:"subTitleProgramText"});
        text.innerHTML = selectProgram.getAttribute("data-description");
        appendChilds(subTitle,[text]);
        appendChilds(descriptionBlock,[title,time,subTitle]);
        
    }
    /**
     * @description Функция отображение программ для канала
     * @param {type} parent
     * @param {type} indexChannel
     * @param {type} objPage
     * @param {type} selected
     * @returns {undefined}
     */
    function createProgramms (parent, indexChannel, objPage, selected) {
        var prog = settings.listChannels[indexChannel].listPrograms;
        
        var widthPrograms = document.getElementsByClassName('programsBlock')[0].offsetWidth;
        var w = parseInt(widthPrograms / 60, 10);
        var finish = parseInt(timePeriod.getAttribute("data-finish"),10);
        var start = finish - 3600;
        var select = 0;
        var insertElem = 0;
        var pr;
        for (var i = 0 ; i < prog.length; i++) {
            if (finish > prog[i].start && prog[i].start + prog[i].duration > start) {
                pr = elem({class:"channelProgram flex"});
                if (prog[i].start < start) {
                    if (prog[i].start + prog[i].duration >= finish) {
                        pr.style.width = widthPrograms + "px";
                    } else {
                        pr.classList.add("first");
                        pr.style.width = ((prog[i].start + prog[i].duration - start) / 60 * w) + "px";
                        pr.classList.add("br");
                    }
                    if (select === 0 && selected === 1) {
                        if(pageObj.left === undefined) {
                            pr.classList.add("selectProgram");
                            objPage.selectProgram = [indexChannel,i]
                        }
                    }
                    insertElem++;
                } else if (prog[i].start >= start) {
                    if (prog[i].start + prog[i].duration >= finish) {
                        if (insertElem > 0) {
                            pr.style.width = ((finish - prog[i].start) / 60 * w) + "px";
                        } else {
                            //pr.style.width = widthPrograms + "px\n\
                            pr.style.marginLeft = ((prog[i].start - start) / 60 * w) + "px";
                            pr.style.width = ((prog[i].duration) / 60 * w) + "px";
                            
                            if (select === 0 && selected === 1) {
                                if (pageObj.left === undefined) {
                                    if (pageObj.left === undefined) {
                                        pr.classList.add("selectProgram");
                                        objPage.selectProgram = [indexChannel, i]
                                    }
                                }
                            }
                        }
                        insertElem++;
                    } else if (prog[i].start + prog[i].duration <= finish) {
                        if (insertElem === 0) {
                            pr.style.marginLeft = ((prog[i].start - start) / 60 * w) + "px";
                            pr.style.width = ((prog[i].duration) / 60 * w) + "px";
                            pr.classList.add("br");
                            if (select === 0 && selected === 1) {
                                if (pageObj.left === undefined) {
                                    pr.classList.add("selectProgram");
                                    objPage.selectProgram = [indexChannel, i]
                                }
                            }

                        } else {
                            pr.style.width = ((prog[i].duration) / 60 * w) + "px";
                            pr.classList.add("br");
                        }
                        insertElem++;
                    }
                }
                pr.setAttribute('data-channelId', prog[i].channel_id);
                pr.setAttribute('data-start', prog[i].start);
                pr.setAttribute('data-duration', prog[i].duration);
                pr.setAttribute('data-prog_id', prog[i].id);
                pr.setAttribute('data-description', prog[i].program.description);
                pr.setAttribute('data-title', prog[i].title);
                var title = document.createElement('div');
                title.className = "info";
                title.innerHTML = prog[i].title;
                pr.appendChild(title);
                parent.appendChild(pr);
            } 

        }
        if (select === 0 && insertElem > 0 && selected === 1) {
            if (pageObj.left === true) {
                pr.classList.add("selectProgram");
                objPage.selectProgram = [indexChannel, i];
                pageObj.left = undefined;
            }
        }
        if (insertElem === 0) {
            var el = elem({class: "channelProgram empty flex"})
            el.innerHTML = "В данный момент нет программ";
            parent.appendChild(el);
            if (objPage.selectProgram === undefined) {
                el.classList.add("selectProgram");
                objPage.selectProgram = [indexChannel,i]
            }
        }  
    }
    /**
     * @description Функция для создания структуры блока канал
     * @returns {mainBlock.createStructureBlockChannel.pageAnonym$41}
     */
    this.createStructureBlockChannel = function () {
        var margin = this.margin;
        var countChannels = this.countChannels();
        var height = this.schedule.offsetHeight / (countChannels);
        var channel = elem({class: " channel flex"});
        channel.style.height = (height - margin) + "px";
        channel.style.marginTop = margin + "px";
        this.schedule.appendChild(channel);
        var channelTitle = elem({class: " channelTitle flex"});
        channelTitle.style.width = (settings.titleChannelWidth - margin) + "px";
        channelTitle.style.marginRight = margin + "px";
        var channelPrograms = elem({class: " channelPrograms flex"});
        channelPrograms.style.width = settings.programsBlockWidth + "px";
        appendChilds(channel,[channelTitle, channelPrograms]);
        channelPrograms.style.width = settings.programsBlockWidth + "px";
        var programsBlock = elem({class: "programsBlock flex"});
        programsBlock.style.height = channelPrograms.offsetHeight + "px";
        var programsDescription = elem({class: "descriptionBlock flex"});
        appendChilds(channelPrograms,[programsBlock, programsDescription]);
        return {channel:channel,channelTitle:channelTitle,channelPrograms:channelPrograms,programsBlock:programsBlock,programsDescription:programsDescription};
    };
    /**
     * @description Функция получения количества отображаемых каналов
     * @description в зависимости от высоты окна
     * @returns {Number}
     */
    this.countChannels = function () {
        var count = 7
        this.margin = 5;
        if (this.schedule.offsetHeight > 500) {
            count = 10;
            this.margin = 5;
        } 
        return count;
    };
    this.nextIndex = function () {
        var channels = settings.listChannels;
        var finish = parseInt(timePeriod.getAttribute("data-finish"),10);
        var start = finish - 3600;
        var channelsLength = channels.length;
        for (var i = this.indexCurrent; i < channels.length; i++){
            var prog = channels[i].listPrograms;
            for (var j = 0; j < prog.length; j++){
                if (finish > prog[j].start && prog[j].start + prog[j].duration > start) {
                    return i;
                }
            }
        }
        ruturn -1;
    };
    
    
};
/**
 * @description Функция для отображения footer страницы
 * @returns {footer}
 */
function footer () {
    
    this.parent = null;
    var parent = this.parent;
    this.show = function (el) {
        this.parent = el;
        var footer = '<div class="footer flex">'+
                    '<div class="blockNavigation flex">'+
                        '<div class="left btn icon flex"></div>'+
                        '<div class="bottom  icon btn flex"></div>'+
                        '<div class="top icon btn flex"></div>'+
                        '<div class="right icon btn flex"></div>'+
                        '<div class="toNow btn flex"></div>'+
                    '</div>'+
                '</div>';
        this.parent.footer.innerHTML = footer;
        var btn = document.getElementsByClassName('btn');
        bind(btn, handler, this);
    };
    

    function bind(btn, handler, obj) {
        var obj = obj;
        for (var i = 0; i < btn.length; i++) {
            btn[i].addEventListener("click", handler);
        }
    }

    function unbind(btn, handler) {
        for (var i = 0; i < btn.length; i++) {
            btn[i].removeEventListener("click", handler);
        }
    }
    /**
     * @description Функция обработчик нажатия на кнопки выбора программ и каналов
     * @param {Object} e
     * @returns {undefined}
     */
    handler = function (e) {

        if (e.target.classList.contains("top") === true) {
            pageObj.currentIndex = pageObj.currentIndex - 1;
            if (pageObj.currentIndex < 0 && pageObj.position  > 0) {
                pageObj.currentIndex = 0;
                pageObj.position = pageObj.position - 1;
            } else if (pageObj.currentIndex < 0 && pageObj.position === 0) {
                pageObj.position = 0;
                pageObj.currentIndex = 0;
            };
            if (pageObj.position > 2) {
                pageObj.position --;
                pageObj.currentIndex = pageObj.currentIndex + 1;
            };
            
            schedule.remove();
            pageObj.schedule = elem({id: "schedule", class: "flex"});
            main.appendChild(pageObj.schedule);
            pageObj.showChannels();

        } 
        else if ((e.target.classList.contains("bottom") === true)) {
            pageObj.currentIndex = pageObj.currentIndex + 1;
            if (pageObj.currentIndex > 0 && pageObj.position  < 2) {
                pageObj.currentIndex = 0;
                pageObj.position = pageObj.position + 1;
            } else if (pageObj.currentIndex > 0 && pageObj.position === 2) {
                pageObj.position = 2;
            } 
            if (pageObj.currentIndex + pageObj.countCh  > settings.listChannels.length -1 
                    && pageObj.position < pageObj.countCh) {
                pageObj.currentIndex =  pageObj.currentIndex - 1;
                pageObj.position  = pageObj.position + 1;
            }
            if (pageObj.position >= pageObj.countCh) {
                pageObj.position  = pageObj.position - 1;
            }
            schedule.remove();
            pageObj.schedule = elem({id: "schedule", class: "flex"});
            main.appendChild(pageObj.schedule);
            pageObj.showChannels();
            
        } 
        else if ((e.target.classList.contains("left") === true)) {
             var selected = document.getElementsByClassName('selectProgram')[0];
            var prev = selected.previousElementSibling;
            if (prev !== null) {
                selected.classList.remove("selectProgram");
                prev.classList.add("selectProgram");
                document.getElementsByClassName('titleProgram')[0].remove();
                document.getElementsByClassName('timeProgram')[0].remove();
                document.getElementsByClassName('subTitleProgram')[0].remove();
                showSelectedElement();
                pageObj.showSelectedElementInfo();
            } else {
                var ft = parseInt(timePeriod.getAttribute("data-finish"),10);
                t = ft - 3610;
                time.remove();
                schedule.remove();
                pageObj.left = true;
                pageObj.createStructure();
                pageObj.showBlockTime();
                pageObj.setPeriods();
                pageObj.showCurrentTimePeriod(t);
                pageObj.showChannels();
                timeIndicator();
            }
            
        } else if ((e.target.classList.contains("right") === true)) {
            
            var selected = document.getElementsByClassName('selectProgram')[0];
            var next = selected.nextElementSibling;
            if (next !== null) {
                selected.classList.remove("selectProgram");
                next.classList.add("selectProgram");
                document.getElementsByClassName('titleProgram')[0].remove();
                document.getElementsByClassName('timeProgram')[0].remove();
                document.getElementsByClassName('subTitleProgram')[0].remove();
                showSelectedElement();
                pageObj.showSelectedElementInfo();
            } else {
                var ft = parseInt(timePeriod.getAttribute("data-finish"),10);
                t = ft + 1000;
                time.remove();
                schedule.remove();
                
                pageObj.createStructure();
                pageObj.showBlockTime();
                pageObj.setPeriods();
                pageObj.showCurrentTimePeriod(t);
                pageObj.showChannels();
                timeIndicator();
            }
            
        } else {
            
            t = pageObj.app.t.getUnixTime();
            time.remove();
            schedule.remove();

            pageObj.createStructure();
            pageObj.showBlockTime();
            pageObj.setPeriods();
            pageObj.showCurrentTimePeriod(t);
            pageObj.showChannels();
            timeIndicator();
        }
    }
}
/**
 * @descripiption Функция для отображения рамки над выбранной программой
 * @returns {undefined}
 */
function showSelectedElement() {
    var selected = document.getElementsByClassName('selectProgram')[0];
    var data = selected.getBoundingClientRect();
    if (document.getElementsByClassName('selectedFrame')[0] !== undefined) {
        document.getElementsByClassName('selectedFrame')[0].remove();
    }
    
    var frame = document.createElement('div');
    
    frame.className = "selectedFrame";
    frame.style.width = (data.width + 5) + "px";
    frame.style.height = (data.height + 10) + "px";
    frame.style.top = (- 5) + "px";
    frame.style.left = (data.left - 5) + "px";
    frame.style.left = (- 5) + "px";
    frame.style.zIndex = 100;
    frame.style.border = "5px";
    frame.style.borderStyle = "solid";
    frame.style.borderColor = "rgb(255, 255, 255)";
    frame.style.position = "absolute";
    if (selected.nextElementSibling === null) {
        var tmpFinish = parseInt(timePeriod.getAttribute("data-finish"),10);
        var st = parseInt(selected.getAttribute("data-start"),10);
        var fin= parseInt(selected.getAttribute("data-duration"),10) + st;
        if (tmpFinish < fin) {
            frame.style.borderRight = "0px";
        }
    }
    
    selected.appendChild(frame);
}
/**
 * @descripiption Функция для отображения иникатора времени (красная полоска)
 * @param {int} unix Дата в формате unix
 */
function timeIndicator() {
    if (document.getElementsByClassName('timeIndicator')[0] !== undefined) {
        document.getElementsByClassName('timeIndicator')[0].remove();
    }
    var unix = pageObj.app.t.getUnixTime();
    var t = parseInt(document.getElementById('timePeriod').getAttribute("data-finish"), 10);
    if (t - 3599 < unix && unix < t) {
        var parent = document.getElementById('timePeriod');
        var timeIndicator = document.createElement('div');
        var data = parent.getBoundingClientRect();
        var finish = parseInt(parent.getAttribute("data-finish"), 10);
        var f = data.width;
        var ratio = data.width / 60;
        var s = (finish - unix) / 60 * ratio;
        var channelsContainerHeight = schedule.offsetHeight;
        var timePeriod = document.getElementById("timePeriod");

        timeIndicator.className = "timeIndicator flex";
        timeIndicator.style.top = (data.height - 3) + "px";
        timeIndicator.style.height = (channelsContainerHeight + 2) + "px";
        timeIndicator.style.left = (f - s) + "px";
        timeIndicator.style.transition = "left " + ((finish - unix)) + "s cubic-bezier(1, 1, 1, 1)";
        timePeriod.appendChild(timeIndicator);

        function handler() {
            parent.removeChild(timeIndicator);
        }
        function run(timeIndicator) {
            timeIndicator.style.left = (data.width - 1) + "px";
            timeIndicator.addEventListener('transitionend', handler);
        }
        setTimeout(run, 100, timeIndicator);
    }

}