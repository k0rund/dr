function app () {
    /**
     * @description Функция получения данных по каналам и программам
     * @returns {undefined}
     */
    this.getData = function () {
        var d = new downloader ();
        d.getDataJson(this);
    };
    /**
     * @description Функция создания списка каналов с программами
     * @returns {undefined}
     */
    this.createListChannel = function () {
        var coutnChannels = null;
        var countProgramms = null;
        var minTime = null;
        var channels = settings.channels;
        var programs = settings.programs;
        var listChannels = [];
        coutnChannels = settings.channels.collection.length;
        countPrograms = settings.programs.collection.length;

        for (var j = 0; j < coutnChannels; j++) {
            var ch = new Channel();
            ch.index = j;
            ch.epgChannelId = channels.collection[j].epg_channel_id;
            for (var i = 0; i < countPrograms; i++) {
                var obj = programs.collection[i];
                for (var key in obj) {
                    if (!programs.collection[i].hasOwnProperty(key)) {
                        continue;
                    }
                    if (obj[key] === channels.collection[j].epg_channel_id) {
                        ch.listPrograms.push(programs.collection[i]);
                        if (minTime === null) {
                            minTime = programs.collection[i]["start"];
                        } else {
                            if (minTime > programs.collection[i]["start"]) {
                                minTime = programs.collection[i]["start"];
                            }
                        }
                    }
                }
            }
            listChannels.push(ch);
        }
        settings["listChannels"] = listChannels;
    }
    
}




