(function(window){
    window.UI = {};
})(window);
/***************************************************************************************
            Player Box
                    - wei.wang
 ****************************************************************************************/
/*
Excemple:
var musicOp = {
    config:{

    },
    songs:[
        {

            label:"melody",
            singer:"陶喆",
            src:"/mp3/melody.mp3",
            coverImg:""
        },
        {
            id:"112",
            label:"喜欢你",
            singer:"beyong",
            src:"/mp3/BEYOND - 喜欢你.mp3",
            coverImg:""
        }
    ]
};

 var mb = new  MusicBox($('#host'),musicOp);
*/
(function(w){

    var templateStr = '<div id="myAudio">\
                                    <audio id="audioControl">\
                                    </audio>\
                                    <div class="player-panel">\
                                        <div class="main-panel">\
                                            <div class="music-box">\
                                                <div id="musicCover" draggable="true" class="music-show">\
                                                    <img id="coverImg" src="images/music-default-cover.jpg">\
                                                </div>\
                                                <div id="trackInfot" class="track-info">\
                                                    <a id="songName"></a> - <a id="songSinger"></a>\
                                                </div>\
                                            </div>\
                                            <div class="duration-info">\
                                                <div id="currentTime" class="postime">00:00</div>\
                                                <div class="progress-host">\
                                                    <div id="progressBox" class="progress-box">\
                                                        <div id="loadBar" class="load-bar"></div>\
                                                        <div id="progressBar" class="progress-bar"></div>\
                                                    </div>\
                                                </div>\
                                                <div id="durationTime" class="durtime">00:00</div>\
                                            </div>\
                                        </div>\
                                        <div class="left-panel">\
                                            <ul class="play-btn">\
                                                <li id="preBtn" title="上一首[←]" class="play-btn-icon icon-first"></li>\
                                                <li id="playBtn" title="播放/暂停[空格键]" class="play-btn-icon icon-play"></li>\
                                                <li id="nextBtn" title="下一首[→]" class="play-btn-icon icon-last"></li>\
                                            </ul>\
                                        </div>\
                                        <div class="right-panel">\
                                            <div class="volume-box">\
                                                <div id="muteBtn" class="volume-on"></div>\
                                                <div class="volume-host">\
                                                    <div id="volumeBox" class="progress-box">\
                                                        <div id="volumeBar" class="progress-bar" style="width:100%"></div>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>';
    function formatTime(time) {
        if(time === NaN)return "0:0";
        var minutes = parseInt(time/60);
        var seconds = parseInt(time%60);
        seconds<10 && (seconds = "0" + seconds);
        return minutes + ":" + seconds;
    }
    var MusicBox = function(host,option){
        var self = this;
        self.option = option;
        //Parameter
        self.songs = {};
        self._order = true;
        self._autoplay = true;
        self.songsIndex = [];
        self.currentIndex = 0;//顺序播放时当前播放到的歌曲在列表中的序号
        self.currentObj = null;//当前播放的歌曲信息
        self.endFunc = null;//歌曲结束后触发的事件
        self.loadedmetadataFunc = null;//加载一首歌曲后触发事件
        //Dom
        self._hostDom = host;
        self._rootDom = $(templateStr);
        self._musicCoverDom = null;/*旋转封面Dom*/
        self._coverImgDom = null;/*封面*/
        self._songNameDom = null;/*歌曲名称Dom*/
        self._songSingerDom = null;/*歌手Dom*/
        self._currentTimeDom = null;/*当前播放到的时间*/
        self._durationTimeDom = null;/*歌曲持续总时间*/
        self._progressBoxDom = null;/*进度条背景*/
        self._loadBarDom = null;/*加载进度条*/
        self._progressBarDom = null;/*进度条*/
        self._preBtnDom = null;/*上一曲按钮*/
        self._playBtnDom = null;/*播放按钮*/
        self._nextBtnDom = null;/*下一曲按钮*/
        self._muteBtnDom = null;/*静音按钮*/
        self._volumeBoxDom = null;/*音量条背景*/
        self._volumeBar = null;/*音量条拖拽条*/

        self._audioControl = null;/*播放器控件*/


        var _f = {
            initDom:function(){
                if(self._hostDom)
                    $(self._hostDom).append(self._rootDom);
                else
                    $('body').append(self._rootDom);
                self._musicCoverDom = $("#musicCover");
                self._coverImgDom = $("#coverImg");
                self._songNameDom = $("#songName");
                self._songSingerDom = $("#songSinger");
                self._currentTimeDom = $("#currentTime");
                self._durationTimeDom = $("#durationTime");
                self._progressBoxDom = $("#progressBox");
                self._loadBarDom = $("#loadBar");
                self._progressBarDom = $("#progressBar");
                self._preBtnDom = $("#preBtn");
                self._playBtnDom = $("#playBtn");
                self._nextBtnDom = $("#nextBtn");
                self._muteBtnDom = $("#muteBtn");
                self._volumeBoxDom = $("#volumeBox");
                self._volumeBar = $("#volumeBar");
                self._audioControl = $("#audioControl")[0];
            },
            initEvent:function(){
                var $AudioControl = $(self._audioControl);
                $AudioControl.bind("loadedmetadata",function(){
                    var totalTime = formatTime(self._audioControl.duration);
                    var title = self.currentObj.label;
                    var singer = self.currentObj.singer;
                    self._durationTimeDom.text(totalTime);
                    self._songNameDom.text(title);
                    self._songSingerDom.text(singer);
                    if(self.currentObj.coverImg)
                        self._coverImgDom.src = self.currentObj.coverImg;
                    if(self.loadedmetadataFunc)
                        self.loadedmetadataFunc({control:self,data:self.currentObj});
                    if(self._autoplay)
                        self.play();
                    console.log("loaded Meta Data : "+JSON.stringify(self.currentObj))
                });
                $AudioControl.bind("timeupdate",function(){
                    var duration = self._audioControl.duration;
                    var curTime = self._audioControl.currentTime;
                    var percentage = curTime/duration * 100;
                    self._progressBarDom.css("width",percentage + "%");

                    var passedTime = formatTime(curTime);
                    self._currentTimeDom.text(passedTime);
                });
                $AudioControl.bind("progress",function(){
                    if (self._audioControl.buffered.length == 1) {
                        // only one range
                        if (self._audioControl.buffered.start(0) == 0) {
                            // The one range starts at the beginning and ends at
                            // the end of the video, so the whole thing is loaded
                            var buffered = self._audioControl.buffered.end(0);
                            var percentage = buffered/self._audioControl.duration * 100;
                            self._loadBarDom.css("width",percentage + "%");
                        }
                    }
                });
                $AudioControl.bind("ended",function(){
                    self.pause();
                    if(self.endFunc){
                        self.endFunc();
                    }else if(self._autoplay){
                        if(self._order){
                            self.next();
                        }else{
                            self.currentIndex = parseInt(Math.random()*self.songsIndex.length);
                            self.currentObj = self.songs[self.songsIndex[self.currentIndex]];
                            self._audioControl.src = self.currentObj.src;
                        }
                    }

                });
                /* 拖拽本地歌曲 播放*/
                function handleFiles(files) {
                    var sources = "";
                    var len = files.length;
                    var url;
                    for (var i = 0; i < len; i++) {
                        url = createObjectURL(files[i]);
                        self.addSong({label:files[i].name,singer:"本地",src:url});
                        self.currentIndex = (self.songsIndex.length-1);
                        self.currentObj =  self.songs[self.songsIndex[self.currentIndex]];
                        self._audioControl.src = self.currentObj.src;
                        self.play();
                    }
                }

                function createObjectURL(file) {
                    if (window.URL) {
                        return window.URL.createObjectURL(file);
                    } else if (window.webkitURL) {
                        return window.webkit.createObjectURL(file);
                    } else {
                        return null;
                    }
                }
                function revokeObjectURL(url) {
                    if (window.URL) {
                        window.URL.revokeObjectURL(url);
                    } else if (window.webkitURL) {
                        window.webkitURL.revokeObjectURL(url);
                    }
                }
                self._rootDom.bind("dragenter",dragenter = function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
                self._rootDom.bind("dragover",dragover = function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
                self._rootDom.bind("drop",drop = function(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    var dt = e.originalEvent.dataTransfer;
                    var files = dt.files;

                    handleFiles(files);
                });

                /*控制按键*/
                //播放键
                self._playBtnDom.click(function(){
                    if(self._audioControl.paused){
                        self.play();
                    }else{
                        self.pause();
                    }
                });
                //下一曲
                self._nextBtnDom.click(function(){
                    self.next();
                });
                //上一曲
                self._preBtnDom.click(function(){
                    self.pre();
                });
                $(document).keydown(function(ev){
                    switch(ev.keyCode){
                        case 32:
                            if(self._audioControl.paused){
                                self.play();
                            }else{
                                self.pause();
                            }
                            break;
                        case 37:
                            self.pre();
                            break;
                        case 39:
                            self.next();
                            break;
                    }
                });

                //音量控制
                $('#muteBtn').click(function(){
                    self.mute();
                });
                self._volumeBar.mousedown(starDrag = function(ev) {
                    ev.preventDefault();
                    var width = self._volumeBoxDom.width();
                    var origWidth = self._volumeBar.width();      /*滑块初始位置*/
                    var origX = ev.clientX;                     /*鼠标初始位置*/
                    var target = this;
                    $(document).mousemove(doDrag = function(ev){
                        ev.preventDefault();
                        var moveX = ev.clientX - origX;        /*计算鼠标移动的距离*/
                        var curLeft = origWidth + moveX;         /*用鼠标移动的距离表示滑块的移动距离*/
                        (curLeft < 0) && (curLeft = 0);
                        (curLeft > width) && (curLeft = width);
                        curLeft = (curLeft/width)*100;
                        self.volume(curLeft);
                        //console.log(curLeft);
                    });
                    $(document).mouseup(stopDrag = function(){
                        $(document).unbind("mousemove",doDrag);
                        $(document).unbind("mouseup",stopDrag);
                    });
                });

                //进度控制
                self._progressBarDom.mousedown(pstarDrag = function(ev) {
                    ev.preventDefault();
                    var width = self._progressBoxDom.width();
                    var origWidth = self._progressBarDom.width();      /*滑块初始位置*/
                    var origX = ev.clientX;                     /*鼠标初始位置*/
                    var target = this;
                    $(document).mousemove(pdoDrag = function(ev){
                        ev.preventDefault();
                        var moveX = ev.clientX - origX;        /*计算鼠标移动的距离*/
                        var curLeft = origWidth + moveX;         /*用鼠标移动的距离表示滑块的移动距离*/
                        (curLeft < 0) && (curLeft = 0);
                        (curLeft > width) && (curLeft = width);
                        curLeft = (curLeft/width)*100;
                        self.progress(curLeft);
                        //console.log(curLeft);
                    });
                    $(document).mouseup(pstopDrag = function(){
                        $(document).unbind("mousemove",pdoDrag);
                        $(document).unbind("mouseup",pstopDrag);
                    });
                });

            },
            init:function(){
                this.initDom();
                this.initEvent();
                self.initSongs(self.option.songs);
            }
        }
        _f.init();
    }

    MusicBox.prototype = {
        /*单曲循环*/
        loop:function(val){
            var self = this;
            if(val!=null){
                self._audioControl.loop = val;
            }else{
                return self._audioControl.loop;
            }
        },
        order:function(val){
            var self = this;
            if(val!=null){
                self._order = val
            }else{
                return self._order;
            }
        },
        autoplay:function(val){
            var self = this;
            if(val!=null){
                self._autoplay = val;
            }else{
                self._autoplay;
            }
        },
        play:function(){
            var self = this;
            self._audioControl.play();
            self._musicCoverDom.addClass("music-show-play");
            self._playBtnDom.addClass("icon-pause");
            self._playBtnDom.removeClass("icon-play");
        },
        pause:function(){
            var self = this;
            self._audioControl.pause();
            self._musicCoverDom.removeClass("music-show-play");
            self._playBtnDom.removeClass("icon-pause");
            self._playBtnDom.addClass("icon-play");
        },
        volume:function(val){
            var self = this;
            if(val<=0){
                self.mute();
                return;
            }
            if(val>100){
                return;
            }
            self._muteBtnDom.removeClass("volume-mute");
            self._muteBtnDom.addClass("volume-on");
            self._volumeBar.css("width",val+"%");
            self._audioControl.volume = (val/100);
        },
        mute:function(){
            var self = this;
            self._muteBtnDom.addClass("volume-mute");
            self._volumeBar.css("width","0%");
            self._audioControl.volume = 0;
        },
        progress:function(val){
            if(val<0 || val>100){
                return;
            }
            var self = this;

            var toTime = self._audioControl.duration*(val/100);
            self._progressBarDom.css("width",val + "%");

            var currentTime = formatTime(toTime);
            self._currentTimeDom.text(currentTime);
            self._audioControl.currentTime = toTime;
        },
        next:function(){
            var self = this;
            var songCont = self.songsIndex.length;
            if(songCont<=0)return;
            self.currentIndex++;
            self.currentIndex = self.currentIndex<songCont?self.currentIndex:0;
            self.currentObj = self.songs[self.songsIndex[self.currentIndex]];
            self._audioControl.src = self.currentObj.src;
            self.play();
        },
        pre:function(){
            var self = this;
            var songCont = self.songsIndex.length;
            if(songCont<=0)return;
            self.currentIndex--;
            self.currentIndex = self.currentIndex>=0?self.currentIndex:songCont-1;
            self.currentObj = self.songs[self.songsIndex[self.currentIndex]];
            self._audioControl.src = self.currentObj.src;
            self.play();
        },
        initSongs:function(val){
            var self = this;
            self.songs = {};
            self.currentIndex = 0;
            self.currentObj = null;
            self.songsIndex = [];
            $('#audioControl').html("");
            if(val && val.constructor == Array){
                for(var i = 0;i<val.length;i++){
                    var song = val[i];
                    self.addSong(song);
                }
            }
            self.currentObj =  self.songs[self.songsIndex[self.currentIndex]];
        },
        addSong:function(val){
            if(!val)return;
            var self = this;
            var songid = val.id || "song_"+parseInt(Math.random()*1000000);
            val.id = songid;
            self.songs[songid] = val;
            self.songsIndex.push(songid);
            $('#audioControl').append('<source songid="'+val.id+'" title="'+val.label+'" singer="'+val.singer+'" src="'+val.src+'" />');
        }
    }
    w.MusicBox = MusicBox;
})(window.UI);





/***************************************************************************************
            Show img box
                    - wei.wang
 ****************************************************************************************/

/*
* excemple:
*  var host = document.getElementById("host");
 var imgs = [
 {img:"../images/bgshow/da.jpg"},
 {img:"../images/bgshow/da2.jpg"},
 {img:"../images/bgshow/da3.jpg"}]
 var imgs2 = [
 {img:"../images/bgshow/da.jpg"}]
 var imgs3 = []
 var bgImgBox = new BgImgBox(host,{
 imgs:imgs,
 config:{}
 });
 bgImgBox.play();
* */
(function(w){
    var createBody = function(){
        /*
         <div class="bg-img-box">
         <ol>
         <li style="background-image:url(../images/bgshow/da2.jpg)"></li>
         <li style="background-image:url(../images/bgshow/da.jpg)"></li>
         </ol>
         <div class="background-dot"></div>
         </div>
         */
        var rootDom = document.createElement("div");
        rootDom.className = "bg-img-box";
        var ol = document.createElement("ol");
        var dot = document.createElement("div");
        dot.className = "background-dot";
        rootDom.appendChild(ol);
        rootDom.appendChild(dot);
        return {rootDom:rootDom, ol:ol,dot:dot};
    }

    var createListItem = function(i,o){
        var item = document.createElement("li");
        item.style.backgroundImage = "url("+ o.img +")";
        item.style.display = "none";
        item.id="img_"+i;
        return item;
    }

    var BgImgBox = function(host, option){
        if(!option) return;
        this.host = host;
        this.imgArr = option.imgs || [];
        for( var i in option.config){
            this.config[i] = option.config[i];
        }
        var self = this;
        var _f = {
            init:function(){
                var doms =  createBody();
                self.rootDom = doms.rootDom;
                self.ol = doms.ol;
                self.dot = doms.dot;
                self.forceLayout();
                self.initImgList();
            }
        }
        _f.init();
    }
    BgImgBox.prototype = {
        // parameter
        imgArr: [],
        config: {loop:true/*是否自动循环*/, loopTime:9000/*自动循环时间毫秒*/},
        nextImg:null,/*下一张展示的图片*/
        currentImg:null,/*当前展示的图片*/
        imgCount:0,
        interval:null,/*循环定时器*/
        //dom
        host:null,
        rootDom:null,
        ol:null,
        dot:null,
        imgDomList:[],
        setImg:function(arr,callback){
            var self = this;
            $(self.ol).fadeOut(function(){
                $(self.ol).html("");
                $(self.ol).show();
                self.imgArr = arr;
                self.initImgList();
                if(callback)callback()
            });

        },
        initImgList: function(){
            var self = this;
            self.currentImg = null;
            self.nextImg = null;
            self.imgDomList = [];
            var l = self.imgCount = self.imgArr.length;
            for(var i = 0 ;i < l ; i++){
                var o = self.imgArr[i];
                self.imgDomList.push(createListItem(i,o));
            }

            if(self.imgCount>0){
                self.currentImg = 0;
                $(self.ol).append(self.imgDomList[self.currentImg]);
                self.imgDomList[self.currentImg].load = true;
                $(self.imgDomList[self.currentImg]).fadeIn();
            }
            if(self.imgCount>1){
                self.nextImg = 1;
                $(self.ol).append(self.imgDomList[1]);
                self.imgDomList[1].load = true;
            }
        },
        stop:function(){
            clearInterval(this.interval);
        },
        play: function(){
            var self = this;
            if(self.imgCount>1){
                self.interval = setInterval(function(){
                    self.next();
                },self.config.loopTime)
            }
        },
        pre:function(){
            var self = this;
            if(self.imgCount<=0)
                return;
            var preIndex = self.currentImg-1>=0?self.currentImg-1:self.imgCount-1;
            var preDom = self.imgDomList[preIndex];
            if(!preDom.load){
                $(self.ol).append(preDom);
            }
            $(preDom).fadeIn();
            $(self.imgDomList[self.currentImg]).fadeOut();
            self.nextImg = self.currentImg;
            self.currentImg = preIndex;
        },
        next: function(){
            var self = this;
            if(self.imgCount<=1){
                self.stop();
                return;
            }
            $(self.imgDomList[self.currentImg]).fadeOut();
            $(self.imgDomList[self.nextImg]).fadeIn();
            self.currentImg = self.nextImg;
            self.nextImg++;
            if(self.nextImg<self.imgCount){
                if(!self.imgDomList[self.nextImg].load)$(self.ol).append(self.imgDomList[self.nextImg]);
            }else{
                self.nextImg = 0;
            }
        },
        forceLayout: function(){
            if(this.host)
                this.host.appendChild(this.rootDom);
        }
    }
    w.BgImgBox = BgImgBox;
})(window.UI);