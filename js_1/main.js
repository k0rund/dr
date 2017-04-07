
var app = new app ();
app.init = function () {
    loading.remove();
    this.createListChannel();
    this.t = new timer (this);
    this.t.init().run();
    this.p = new page (this);
    this.p.createStructure();
    this.p.createHeader();
};
app.getData();

function Channel() {
    this.listPrograms = new Array();
    this.index = null;
    this.epgChannelId = null;
}