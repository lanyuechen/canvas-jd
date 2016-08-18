this.jd = this.jd||{};
(function(){
    var DataTool_3c = function(url)
    {
        this.init(url);
    };

    var p = DataTool_3c.prototype;
    p.tween = { "per":0 };
    p.fristTween = true;
    p.eventDispatcher=$({});
    p.isTest = false;
    p.apiUrl = "";
    p.apiAry = [];
    p.apiId = 0;

    p.reset = function(id)
    {
        if(this.myTween)
        {
            this.myTween.pause();
            this.dataAry[id]["num"] = 0;
            this.dataAry[id]["startNum"] = 0;
            this.myTween.resume(0);
            this.myTween.timeScale(5);
        }
    };

    p.init= function(url)
    {
        this.tween = { "per":0 };
        this.fristTween = true;
        this.eventDispatcher=$({});
        this.isTest = false;
        this.apiUrl = "";
        this.apiAry = [];
        this.apiId = 0;
        if(url.constructor == String)
        {
            this.isTest = false;
            this.apiUrl = url;
            this.loadApi();
        }
        if(url.constructor == Array)
        {
            this.isTest = true;
            this.apiAry = url;
            this.apiId = 0;
            this.loadApiTest();
        }
    };

    //正式接口
    p.loadApi = function()
    {
        var cur = this;
        $.ajax({
            type:"GET",
            dataType: "jsonp",
            url:cur.apiUrl,
            success: function(json){
                console.log(json);
                cur.setDataAry(cur.jsonToAry(json));
                cur.startTween();
                cur.startTween();
            }
        });
    };

    //测试用接口，本地数据
    p.loadApiTest = function()
    {
        console.log(this.apiAry[this.apiId]);
        var cur = this;
        $.getJSON(this.apiAry[this.apiId],function(json){
            console.log(json);
            cur.setDataAry(cur.jsonToAry(json));
            cur.startTween();
            cur.apiId++;
        });
    };
    

    //---------------------------------------------sum-----------------------------------------//
    p.jsonToAry = function(json)
    {
        var ary = json["dataContents"];
        var tempAry = [];
        for(var i in ary)
        {
            //总销量
            if(ary[i]["type"] == 4)
            {
                tempAry[0] = ary[i]["num"];
            }
            //手机销量
            if(ary[i]["type"] == 1)
            {
                tempAry[1] = ary[i]["num"];
            }
            //IT销量
            if(ary[i]["type"] == 2)
            {
                tempAry[2] = ary[i]["num"];
            }
            //数码销量
            if(ary[i]["type"] == 3)
            {
                tempAry[3] = ary[i]["num"];
            }
        }
        return tempAry;
    };

    p.setDataAry = function(ary)
    {
        console.log(ary);
        this.dataAry = [];
        for (var i = 0; i < ary.length; i++ )
        {
            var obj = { };
            obj["startNum"] = 0;
            obj["num"] = obj["startNum"];
            obj["endNum"] = ary[i];
            this.dataAry.push(obj);
        }
        this.checkDataAry();
        //复制原来的数组
        this.oldDataAry = this.dataAry.slice(0);
    };


    p.checkDataAry = function()
    {
        if (this.oldDataAry)
        {
            for (var i in this.dataAry)
            {
                //将本次起始值设为上一次的结束值
                this.dataAry[i]["startNum"] = this.oldDataAry[i]["endNum"];
                if(this.dataAry[i]["endNum"] < this.oldDataAry[i]["endNum"])
                {
                    this.dataAry[i]["endNum"] = this.oldDataAry[i]["endNum"];
                }
            }
        }
    };

    //==============================================tween===================================//
    p.startTween = function()
    {
        var timeValue = 20;
        if (this.fristTween)
        {
            timeValue = 8;
            this.fristTween = false;
        }
        this.myTween =TweenLite.to(this.tween, timeValue,
            {
                per:1,
                ease:Linear.easeNone,
                onUpdateScope:this,
                onUpdate:function(){
                    this.updateFun();
                },
                onCompleteScope:this,
                onComplete:function(){
                    this.completeFun();
                }
            });
    };

    p.updateFun = function()
    {
        for (var i=0;i<this.dataAry.length; i++)
        {
            this.dataAry[i]["num"] = Math.ceil(this.dataAry[i]["startNum"] + (this.dataAry[i]["endNum"] - this.dataAry[i]["startNum"]) * this.tween["per"]);
        }
        //
		//trigger的第二个参数可是一个object，如果要传多个，需用数组，如果只有一个，该参数必需是一个Object
		this.eventDispatcher.trigger("updateData",[this.dataAry]);
    };

    p.completeFun = function()
    {
        console.log("complete");
        this.tween["per"] = 0;
        this.myTween.timeScale(1);
        this.loadApi();
        if(this.isTest)
        {
            if (this.apiId < 2) this.loadApiTest();
        }
    };
	
    jd.DataTool_3c = DataTool_3c;
})();