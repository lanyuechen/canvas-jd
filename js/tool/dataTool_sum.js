this.jd = this.jd||{};
(function(){
    var DataTool_sum = function(url)
    {
        this.init(url);
    };

    var p = DataTool_sum.prototype;
    p.tween = { "per":0 };
    p.fristTween = true;
    p.eventDispatcher=$({});
    p.isTest = false;
    p.apiUrl = "";
    p.apiAry = [];
    p.apiId = 0;

    p.init= function(url)
    {
        this.tween = { "per":0 };
        this.fristTween = true;
        this.eventDispatcher=$({});
        this.isTest = false;
        this.apiUrl = "";
        this.apiAry = [];
        this.apiId = 0;
        //
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
                cur.setSum(json);
                cur.startTween();
            }
        });
		/*var cur = this;
		$.getJSON("data/it_3.json",function(json){
			cur.setDataAry(json);
            cur.startTween();
		});*/
    };

    //测试用接口，本地数据
    p.loadApiTest = function()
    {
        console.log(this.apiAry[this.apiId]);
        var cur = this;
        $.getJSON(this.apiAry[this.apiId],function(json){
            console.log(json);
            cur.setSum(json);
            cur.startTween();
            cur.apiId++;
        });
    };


    //---------------------------------------------sum-----------------------------------------//
    p.setSum = function(json)
    {
        this.sum = {};
        var num = json["dataContents"][0]["sum"];
        //
        num = parseInt(num);
        this.sum["startNum"] = 0;
        this.sum["num"] = this.sum["startNum"];
        this.sum["endNum"] = num;
        //
        this.checkSum();
        this.oldSumNum = num;
    };

    p.checkSum = function()
    {
        if (this.oldSumNum)
        {
            this.sum["startNum"] = this.oldSumNum;
            if(this.sum["endNum"] < this.oldSumNum)
            {
                this.sum["endNum"] = this.oldSumNum;
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
        TweenLite.to(this.tween, timeValue,
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
        this.sum["num"] = Math.ceil(this.sum["startNum"] + (this.sum["endNum"] - this.sum["startNum"]) * this.tween["per"]);
		//trigger的第二个参数可是一个object，如果要传多个，需用数组，如果只有一个，该参数必需是一个Object
		this.eventDispatcher.trigger("updateData",[this.sum]);
    };

    p.completeFun = function()
    {
        console.log("complete");
        this.tween["per"] = 0;
        this.loadApi();
        if(this.isTest)
        {
            if (this.apiId < 2) this.loadApiTest();
        }
    };
	//

    jd.DataTool_sum = DataTool_sum;
})();