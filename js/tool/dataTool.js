this.jd = this.jd||{};
(function(){
    var DataTool = function(url,hasSum)
    {
        //hasSum默认为false,hasSum为true，说明既有各排名的数据，也有总数据
        this.hasSum = arguments[1] ? arguments[1]:false;
        this.init(url);
    };

    var p = DataTool.prototype;
    p.eventDispatcher=$({});
    p.tween = { "per":0 };
    p.fristTween = true;
    p.isTest = false;
    p.apiUrl = "";
    p.apiAry = [];
    p.apiId = 0;

    p.init= function(url)
    {
        this.eventDispatcher=$({});
        this.tween = { "per":0 };
        this.fristTween = true;
        this.isTest = false;
        this.apiUrl = "";
        this.apiAry = [];
        this.apiId = 0;
        //
        this.initBrandMap();
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

    p.initBrandMap = function()
    {
        this.brandMap = { };
        for (var i in this.brandMapJson.data)
        {
            var key = "_"+this.brandMapJson.data[i]["brand_id"];
            var value = this.brandMapJson.data[i];
            this.brandMap[key] = value;
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
                //console.log(json);
                cur.eventDispatcher.trigger("complete",json);
                cur.setDataAry(json);
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
        var cur = this;
        $.getJSON(this.apiAry[this.apiId],function(json){
            //console.log(json);
            cur.setDataAry(json);
            cur.setSum(json);
            cur.startTween();
            cur.apiId++;
        });
    };

    //---------------------------------------------ary-----------------------------------------//
    //处理数组，将brand_id值的前前加“_”，设置startNum/startNum/num
    p.setDataAry = function(json)
    {
        console.log(json);
        var ary = json["dataContents"];
        ary.sort(function(a,b)
        {
            //return a["num"] < b["num"]?1:-1;
            //safari下如果两个值相同，会不稳定，不按原来的元素位置排序，因此判断一下如果两个值相同则用两个元素原来的排序
            return b["num"] - a["num"] || ary.indexOf(a) - ary.indexOf(b);
        });
        this.dataAry = [];
        for (var i = 0; i < ary.length; i++ )
        {
            var obj = { };
            obj["brand_id"] = "_" + ary[i]["brand_id"];
            obj["startNum"] = 0;
            obj["num"] = obj["startNum"];
            obj["endNum"] = ary[i]["num"];
            //把logo增加到数据中去
            if(this.brandMap[obj["brand_id"]] == undefined)
            {
                //在映射表中找不到对应的logo
                obj["logo"] = "images/defaultLogo.png";
            }
            else
            {
                obj["logo"] = this.brandMap[obj["brand_id"]]["logo"];
            }

            this.dataAry.push(obj);
        }
        this.checkDataAry();
		//复制原来的数组
        this.oldDataAry = this.dataAry.slice(0);
    };

    //检测数据数组中是否有与原来相同的项，如果有，设置startNum;
    p.checkDataAry = function()
    {
        if (this.oldDataAry)
        {
            for (var i in this.dataAry)
            {
                for (var j in this.oldDataAry)
                {
                    //如果上次数据中存在此条数据,则将起数据设为上次的结束数据
                    if (this.dataAry[i]["brand_id"] == this.oldDataAry[j]["brand_id"])
                    {
                        this.dataAry[i]["startNum"] = this.oldDataAry[j]["endNum"];
                        /* if(this.dataAry[i]["endNum"] < this.oldDataAry[j]["endNum"])
                        {
                            this.dataAry[i]["endNum"] = this.oldDataAry[j]["endNum"];
                        } */
                        break;
                    }
                    else
                    {
                        this.dataAry[i]["startNum"] = this.oldDataAry[this.oldDataAry.length-1]["endNum"];
                    }
                }
            }
        }
    };

    //---------------------------------------------sum-----------------------------------------//
    p.setSum = function(json)
    {
        if(this.hasSum)
        {
            this.sum = {};
            var num = json["sum"];
            //
            num = parseInt(num);
            this.sum["startNum"] = 0;
            this.sum["num"] = this.sum["startNum"];
            this.sum["endNum"] = num;
            //
            this.checkSum();
            this.oldSumNum = num;
        }
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
    p.tween = { "per":0 };
    p.fristTween = true;
    p.startTween = function()
    {
        var timeValue = 20;
        if (this.fristTween)
        {
            timeValue = 10;
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
        //
        for (var i in this.dataAry)
        {
            this.dataAry[i]["num"] = Math.ceil(this.dataAry[i]["startNum"] + (this.dataAry[i]["endNum"] - this.dataAry[i]["startNum"]) * this.tween["per"]);
        }
        var cur = this;
        this.dataAry.sort(function(a,b)
        {
            //return a["num"] > b["num"]?1:-1
            //safari下如果两个值相同，会不稳定，不按原来的元素位置排序，因此判断一下如果两个值相同则用两个元素原来的排序
            return b["num"] - a["num"] || cur.dataAry.indexOf(a) - cur.dataAry.indexOf(b);
        });
        //
        if(this.hasSum)
        {
            this.sum["num"] = Math.ceil(this.sum["startNum"] + (this.sum["endNum"] - this.sum["startNum"]) * this.tween["per"]);
            //trigger的第二个参数可是一个object，如果要传多个，需用数组，如果只有一个，该参数必需是一个Object
            this.eventDispatcher.trigger("updateData",[this.dataAry,this.sum]);
        }
        else
        {
            this.eventDispatcher.trigger("updateData",[this.dataAry,0]);
        }
    };

    p.completeFun = function()
    {
        this.tween["per"] = 0;
        this.loadApi();
        if(this.isTest)
        {
            if (this.apiId < 2) this.loadApiTest();
        }
    };
	
	//
	p.brandMapJson = {
        "data": [
            {
                "name": "linktop",
                "brand_id": 86464,
                "logo": "images/logo/childrenGaragelogo/linktop.png"
            },
            {
                "name": "荣耀",
                "brand_id": 119502,
                "logo": "images/logo/childrenGaragelogo/rongyao.png"
            },
            {
                "name": "阿巴町",
                "brand_id": 82375,
                "logo": "images/logo/childrenGaragelogo/abbaTing.png"
            },
            {
                "name": "酷多啦",
                "brand_id": 93493,
                "logo": "images/logo/childrenGaragelogo/cool.png"
            },
            {
                "name": "糖猫",
                "brand_id": 88981,
                "logo": "images/logo/childrenGaragelogo/sugarCat.png"
            },
            {
                "name": "小天才",
                "brand_id": 50457,
                "logo": "images/logo/childrenGaragelogo/genius.png"
            },
            {
                "name": "宏基",
                "brand_id": 8354,
                "logo": "images/logo/computerBrandlogo/Acer-new1.png"
            },
            {
                "name": "宏基",
                "brand_id": 32714,
                "logo": "images/logo/computerBrandlogo/Acer-new1.png"
            },
            {
                "name": "华硕",
                "brand_id": 8551,
                "logo": "images/logo/computerBrandlogo/ASUS.png"
            },
            {
                "name": "Tinkpad",
                "brand_id": 11518,
                "logo": "images/logo/computerBrandlogo/tinkpad.png"
            },
            {
                "name": "戴尔",
                "brand_id": 5821,
                "logo": "images/logo/computerBrandlogo/dell.png"
            },
            {
                "name": "联想",
                "brand_id": 11516,
                "logo": "images/logo/computerBrandlogo/lenovo.png"
            },
            {
                "name": "联想",
                "brand_id": 11515,
                "logo": "images/logo/computerBrandlogo/lenovo.png"
            },
            {
                "name": "联想",
                "brand_id": 45996,
                "logo": "images/logo/computerBrandlogo/lenovo.png"
            },
            {
                "name": "联想",
                "brand_id": 11517,
                "logo": "images/logo/computerBrandlogo/lenovo.png"
            },
            {
                "name": "联想",
                "brand_id": 11519,
                "logo": "images/logo/computerBrandlogo/lenovo.png"
            },
            {
                "name": "宏基",
                "brand_id": 8354,
                "logo": "images/logo/computerLibrarylogo/Acer-new1.png"
            },
            {
                "name": "宏基",
                "brand_id": 32714,
                "logo": "images/logo/computerLibrarylogo/Acer-new1.png"
            },
            {
                "name": "华硕",
                "brand_id": 8551,
                "logo": "images/logo/computerLibrarylogo/ASUS.png"
            },
            {
                "name": "三星",
                "brand_id": 15127,
                "logo": "images/logo/computerLibrarylogo/samsung.png"
            },
            {
                "name": "三星",
                "brand_id": 108838,
                "logo": "images/logo/computerLibrarylogo/samsung.png"
            },
            {
                "name": "Tinkpad",
                "brand_id": 11518,
                "logo": "images/logo/computerLibrarylogo/tinkpad.png"
            },
            {
                "name": "戴尔",
                "brand_id": 5821,
                "logo": "images/logo/computerLibrarylogo/dell.png"
            },
            {
                "name": "惠普",
                "brand_id": 8740,
                "logo": "images/logo/computerLibrarylogo/hp.png"
            },
            {
                "name": "联想",
                "brand_id": 11516,
                "logo": "images/logo/computerLibrarylogo/lenovo.png"
            },
            {
                "name": "联想",
                "brand_id": 11515,
                "logo": "images/logo/computerLibrarylogo/lenovo.png"
            },
            {
                "name": "联想",
                "brand_id": 45996,
                "logo": "images/logo/computerLibrarylogo/lenovo.png"
            },
            {
                "name": "联想",
                "brand_id": 11517,
                "logo": "images/logo/computerLibrarylogo/lenovo.png"
            },
            {
                "name": "联想",
                "brand_id": 11519,
                "logo": "images/logo/computerLibrarylogo/lenovo.png"
            },
            {
                "name": "清华同方",
                "brand_id": 14523,
                "logo": "images/logo/computerLibrarylogo/qhtf.png"
            },
            {
                "name": "神州",
                "brand_id": 15539,
                "logo": "images/logo/computerLibrarylogo/hasee.png"
            },
            {
                "name": "苹果",
                "brand_id": 137291,
                "logo": "images/logo/Flatlogo/appleFlat.png"
            },
            {
                "name": "苹果",
                "brand_id": 133507,
                "logo": "images/logo/Flatlogo/appleFlat.png"
            },
            {
                "name": "苹果",
                "brand_id": 14026,
                "logo": "images/logo/Flatlogo/appleFlat.png"
            },
            {
                "name": "微软",
                "brand_id": 17440,
                "logo": "images/logo/Flatlogo/microsoft.png"
            },
            {
                "name": "诺基亚",
                "brand_id": 13539,
                "logo": "images/logo/Flatlogo/microsoft.png"
            },
            {
                "name": "荣耀",
                "brand_id": 119502,
                "logo": "images/logo/Flatlogo/rongyao.png"
            },
            {
                "name": "三星",
                "brand_id": 15127,
                "logo": "images/logo/Flatlogo/samsung.png"
            },
            {
                "name": "三星",
                "brand_id": 108838,
                "logo": "images/logo/Flatlogo/samsung.png"
            },
            {
                "name": "联想",
                "brand_id": 11516,
                "logo": "images/logo/Flatlogo/lenovo.png"
            },
            {
                "name": "联想",
                "brand_id": 11515,
                "logo": "images/logo/Flatlogo/lenovo.png"
            },
            {
                "name": "联想",
                "brand_id": 45996,
                "logo": "images/logo/Flatlogo/lenovo.png"
            },
            {
                "name": "联想",
                "brand_id": 11517,
                "logo": "images/logo/Flatlogo/lenovo.png"
            },
            {
                "name": "联想",
                "brand_id": 11519,
                "logo": "images/logo/Flatlogo/lenovo.png"
            },
            {
                "name": "七彩虹",
                "brand_id": 22215,
                "logo": "images/logo/Flatlogo/rainbow.png"
            },
            {
                "name": "七彩虹",
                "brand_id": 14098,
                "logo": "images/logo/Flatlogo/rainbow.png"
            },
            {
                "name": "七彩虹",
                "brand_id": 137128,
                "logo": "images/logo/Flatlogo/rainbow.png"
            },
            {
                "name": "台电",
                "brand_id": 16571,
                "logo": "images/logo/Flatlogo/Technology.png"
            },
            {
                "name": "beats",
                "brand_id": 21360,
                "logo": "images/logo/headsetBrandlogo/beats.png"
            },
            {
                "name": "bose",
                "brand_id": 68382,
                "logo": "images/logo/headsetBrandlogo/bose.png"
            },
            {
                "name": "索尼",
                "brand_id": 16538,
                "logo": "images/logo/headsetBrandlogo/sony.png"
            },
            {
                "name": "森海塞尔",
                "brand_id": 15196,
                "logo": "images/logo/headsetBrandlogo/Sennheiser.png"
            },
            {
                "name": "铁三角",
                "brand_id": 17052,
                "logo": "images/logo/headsetBrandlogo/Irontriangle.png"
            },
            {
                "name": "三星",
                "brand_id": 108838,
                "logo": "images/logo/Imagelogo/samsung.png"
            },
            {
                "name": "三星",
                "brand_id": 15127,
                "logo": "images/logo/Imagelogo/samsung.png"
            },
            {
                "name": "索尼",
                "brand_id": 16538,
                "logo": "images/logo/Imagelogo/sony.png"
            },
            {
                "name": "奥林巴斯",
                "brand_id": 3690,
                "logo": "images/logo/Imagelogo/Olympus.png"
            },
            {
                "name": "富士",
                "brand_id": 7195,
                "logo": "images/logo/Imagelogo/Fuji.png"
            },
            {
                "name": "富士",
                "brand_id": 114245,
                "logo": "images/logo/Imagelogo/Fuji.png"
            },
            {
                "name": "富士",
                "brand_id": 113240,
                "logo": "images/logo/Imagelogo/Fuji.png"
            },
            {
                "name": "佳能",
                "brand_id": 8983,
                "logo": "images/logo/Imagelogo/canon.png"
            },
            {
                "name": "卡西欧",
                "brand_id": 10107,
                "logo": "images/logo/Imagelogo/CASIO.png"
            },
            {
                "name": "尼康",
                "brand_id": 13392,
                "logo": "images/logo/Imagelogo/Nikon.png"
            },
            {
                "name": "松下",
                "brand_id": 16407,
                "logo": "images/logo/Imagelogo/Panasonic.png"
            },
            {
                "name": "摩托罗拉",
                "brand_id": 13066,
                "logo": "images/logo/IntelligentWatchlogo/moto_360.png"
            },
            {
                "name": "三星",
                "brand_id": 15127,
                "logo": "images/logo/IntelligentWatchlogo/samsung.png"
            },
            {
                "name": "三星",
                "brand_id": 108838,
                "logo": "images/logo/IntelligentWatchlogo/samsung.png"
            },
            {
                "name": "ticwatch",
                "brand_id": 121867,
                "logo": "images/logo/IntelligentWatchlogo/ticwatch.png"
            },
            {
                "name": "WeLoop",
                "brand_id": 76324,
                "logo": "images/logo/IntelligentWatchlogo/WeLoop.png"
            },
            {
                "name": "aigo",
                "brand_id": 70936,
                "logo": "images/logo/MobilePowersupplylogo/aigo.png"
            },
            {
                "name": "小米",
                "brand_id": 18374,
                "logo": "images/logo/MobilePowersupplylogo/mi.png"
            },
            {
                "name": "小米",
                "brand_id": 133787,
                "logo": "images/logo/MobilePowersupplylogo/mi.png"
            },
            {
                "name": "爱国者",
                "brand_id": 45097,
                "logo": "images/logo/MobilePowersupplylogo/Patriot.png"
            },
            {
                "name": "爱国者",
                "brand_id": 3236,
                "logo": "images/logo/MobilePowersupplylogo/Patriot.png"
            },
            {
                "name": "倍斯特",
                "brand_id": 4728,
                "logo": "images/logo/MobilePowersupplylogo/Double.png"
            },
            {
                "name": "飞毛腿",
                "brand_id": 35345,
                "logo": "images/logo/MobilePowersupplylogo/Scud.png"
            },
            {
                "name": "飞毛腿",
                "brand_id": 6746,
                "logo": "images/logo/MobilePowersupplylogo/Scud.png"
            },
            {
                "name": "罗马仕",
                "brand_id": 11831,
                "logo": "images/logo/MobilePowersupplylogo/RomeShi.png"
            },
            {
                "name": "品胜",
                "brand_id": 14006,
                "logo": "images/logo/MobilePowersupplylogo/PISEN.png"
            },
            {
                "name": "羽博",
                "brand_id": 20306,
                "logo": "images/logo/MobilePowersupplylogo/Yoobao.png"
            },
            {
                "name": "欣码",
                "brand_id": 52357,
                "logo": "images/logo/officeEquipmentlogo/SINMARK.png"
            },
            {
                "name": "爱普生",
                "brand_id": 3339,
                "logo": "images/logo/officeEquipmentlogo/epson.png"
            },
            {
                "name": "大行",
                "brand_id": 5720,
                "logo": "images/logo/officeEquipmentlogo/asing.png"
            },
            {
                "name": "得力",
                "brand_id": 5934,
                "logo": "images/logo/officeEquipmentlogo/deli.png"
            },
            {
                "name": "惠普",
                "brand_id": 8740,
                "logo": "images/logo/officeEquipmentlogo/hp.png"
            },
            {
                "name": "惠通",
                "brand_id": 8744,
                "logo": "images/logo/officeEquipmentlogo/huitong.png"
            },
            {
                "name": "佳能",
                "brand_id": 8983,
                "logo": "images/logo/officeEquipmentlogo/canon.png"
            },
            {
                "name": "拉卡拉",
                "brand_id": 10710,
                "logo": "images/logo/officeEquipmentlogo/lakala.png"
            },
            {
                "name": "小米",
                "brand_id": 18374,
                "logo": "images/logo/routerlogo/mi.png"
            },
            {
                "name": "小米",
                "brand_id": 133787,
                "logo": "images/logo/routerlogo/mi.png"
            },
            {
                "name": "荣耀",
                "brand_id": 119502,
                "logo": "images/logo/routerlogo/rongyao.png"
            },
            {
                "name": "磊科",
                "brand_id": 11299,
                "logo": "images/logo/routerlogo/Netcore.png"
            },
            {
                "name": "水星",
                "brand_id": 16163,
                "logo": "images/logo/routerlogo/Mercury.png"
            },
            {
                "name": "腾达",
                "brand_id": 16790,
                "logo": "images/logo/routerlogo/Tengda.png"
            },
            {
                "name": "腾达",
                "brand_id": 32287,
                "logo": "images/logo/routerlogo/Tengda.png"
            },
            {
                "name": "迅捷",
                "brand_id": 18868,
                "logo": "images/logo/routerlogo/Fast.png"
            },
            {
                "name": "苹果",
                "brand_id": 137291,
                "logo": "images/logo/mobileBrandlogo/apple.png"
            },
            {
                "name": "苹果",
                "brand_id": 133507,
                "logo": "images/logo/mobileBrandlogo/apple.png"
            },
            {
                "name": "htc",
                "brand_id": 1115,
                "logo": "images/logo/mobileBrandlogo/htc.png"
            },
            {
                "name": "华为",
                "brand_id": 8557,
                "logo": "images/logo/newlogo/honorrong.png"
            },
            {
                "name": "坚果",
                "brand_id": 44905,
                "logo": "images/logo/mobileBrandlogo/jianguo.png"
            },
            {
                "name": "金立",
                "brand_id": 9420,
                "logo": "images/logo/mobileBrandlogo/jinli.png"
            },
            {
                "name": "酷派",
                "brand_id": 10640,
                "logo": "images/logo/mobileBrandlogo/kupai.png"
            },
            {
                "name": "酷派",
                "brand_id": 54269,
                "logo": "images/logo/mobileBrandlogo/kupai.png"
            },
            {
                "name": "乐视",
                "brand_id": 11188,
                "logo": "images/logo/mobileBrandlogo/leshi.png"
            },
            {
                "name": "乐视",
                "brand_id": 107775,
                "logo": "images/logo/mobileBrandlogo/leshi.png"
            },
            {
                "name": "魅族",
                "brand_id": 12669,
                "logo": "images/logo/mobileBrandlogo/meizu.png"
            },
            {
                "name": "小米",
                "brand_id": 18374,
                "logo": "images/logo/mobileBrandlogo/mi.png"
            },
            {
                "name": "小米",
                "brand_id": 133787,
                "logo": "images/logo/mobileBrandlogo/mi.png"
            },
            {
                "name": "努比亚",
                "brand_id": 27094,
                "logo": "images/logo/mobileBrandlogo/nubia.png"
            },
            {
                "name": "oppo",
                "brand_id": 2032,
                "logo": "images/logo/mobileBrandlogo/oppo.png"
            },
            {
                "name": "奇酷",
                "brand_id": 135609,
                "logo": "images/logo/mobileBrandlogo/qiku.png"
            },
            {
                "name": "荣耀",
                "brand_id": 119502,
                "logo": "images/logo/mobileBrandlogo/rongyao.png"
            },
            {
                "name": "三星",
                "brand_id": 15127,
                "logo": "images/logo/mobileBrandlogo/samsung.png"
            },
            {
                "name": "三星",
                "brand_id": 108838,
                "logo": "images/logo/mobileBrandlogo/samsung.png"
            },
            {
                "name": "vivo",
                "brand_id": 25591,
                "logo": "images/logo/mobileBrandlogo/vivo.png"
            },
            {
                "name": "zuk",
                "brand_id": 134922,
                "logo": "images/logo/mobileBrandlogo/zuk.png"
            },
            {
                "name": "Fitbit",
                "brand_id": 67299,
                "logo": "images/logo/SmartBraceletlogo/Fitbit.png"
            },
            {
                "name": "jawbone",
                "brand_id": 1258,
                "logo": "images/logo/SmartBraceletlogo/jawbone.png"
            },
            {
                "name": "小米",
                "brand_id": 18374,
                "logo": "images/logo/SmartBraceletlogo/mi.png"
            },
            {
                "name": "小米",
                "brand_id": 133787,
                "logo": "images/logo/SmartBraceletlogo/mi.png"
            },
            {
                "name": "misfit",
                "brand_id": 49668,
                "logo": "images/logo/SmartBraceletlogo/misfit.png"
            },
            {
                "name": "荣耀",
                "brand_id": 119502,
                "logo": "images/logo/SmartBraceletlogo/rongyao.png"
            },
            {
                "name": "乐心",
                "brand_id": 11211,
                "logo": "images/logo/SmartBraceletlogo/LIFESENSE.png"
            },
            {
                "name": "东芝",
                "brand_id": 42252,
                "logo": "images/logo/storageCategorylogo/dongzhi.png"
            },
            {
                "name": "东芝",
                "brand_id": 6345,
                "logo": "images/logo/storageCategorylogo/dongzhi.png"
            },
            {
                "name": "金士顿",
                "brand_id": 9495,
                "logo": "images/logo/storageCategorylogo/jinshidun.png"
            },
            {
                "name": "闪迪",
                "brand_id": 15341,
                "logo": "images/logo/storageCategorylogo/sandisk.png"
            },
            {
                "name": "西部数据",
                "brand_id": 17861,
                "logo": "images/logo/storageCategorylogo/xibushuju.png"
            },
            {
                "name": "希捷",
                "brand_id": 17941,
                "logo": "images/logo/storageCategorylogo/xijie.png"
            },
            {
                "name": "大显",
                "brand_id": 36654,
                "logo": "images/logo/newlogo/daxian.png"
            },
            {
                "name": "3M",
                "brand_id": 32,
                "logo": "images/logo/newlogo/3M.png"
            },
            {
                "name": "武极",
                "brand_id": 79238,
                "logo": "images/logo/newlogo/wuji.png"
            },
            {
                "name": "极途gimit",
                "brand_id": 43618,
                "logo": "images/logo/newlogo/gimit.png"
            },
            {
                "name": "乔安",
                "brand_id": 14375,
                "logo": "images/logo/newlogo/jooan.png"
            },
            {
                "name": "雅视威",
                "brand_id": 122934,
                "logo": "images/logo/newlogo/yestv.png"
            },
            {
                "name": "锤子",
                "brand_id": 91515,
                "logo": "images/logo/newlogo/smartisan.png"
            },
            {
                "name": "中兴",
                "brand_id": 21011,
                "logo": "images/logo/newlogo/zte.png"
            },
            {
                "name": "酷比魔方",
                "brand_id": 10618,
                "logo": "images/logo/newlogo/cube.png"
            },
            {
                "name": "橙派",
                "brand_id": 43617,
                "logo": "images/logo/newlogo/cpad.png"
            },
			{
            "name": "腾龙",
            "brand_id": 16795,
            "logo": "images/logo/newlogo/tamron.png"
            },
            {
                "name": "盛凡智尊",
                "brand_id": 68667,
                "logo": "images/logo/newlogo/shengfanzhizun.png"
            },
            {
                "name": "沃士达",
                "brand_id": 17763,
                "logo": "images/logo/newlogo/woshida.png"
            },
            {
                "name": "tumetimes",
                "brand_id": 96904,
                "logo": "images/logo/newlogo/tumetimes.png"
            },
            {
                "name": "小蚁",
                "brand_id": 61672,
                "logo": "images/logo/newlogo/yi.png"
            },
            {
                "name": "嘉尔祥电子",
                "brand_id": 124409,
                "logo": "images/logo/newlogo/jiaerxiang.png"
            },
            {
                "name": "一加",
                "brand_id": 63032,
                "logo": "images/logo/newlogo/oneplus.png"
            },
            {
                "name": "格之格",
                "brand_id": 7459,
                "logo": "images/logo/newlogo/gzg.png"
            },
            {
                "name": "派克",
                "brand_id": 13848,
                "logo": "images/logo/newlogo/pk.png"
            },
            {
                "name": "天威",
                "brand_id": 16941,
                "logo": "images/logo/newlogo/tw.png"
            },
            {
                "name": "兄弟",
                "brand_id": 18720,
                "logo": "images/logo/newlogo/brother.png"
            },
            {
                "name": "真彩",
                "brand_id": 20776,
                "logo": "images/logo/newlogo/zc.png"
            },
			{
                "name": "百乐",
                "brand_id": 22539,
                "logo": "images/logo/newlogo/baile.png"
            },
			{
                "name": "毕加索",
                "brand_id":4862,
                "logo": "images/logo/newlogo/bjs.png"
            },
			{
                "name": "晨光",
                "brand_id":5401,
                "logo": "images/logo/newlogo/chenguang.png"
            },
			{
                "name": "晨光",
                "brand_id":29075,
                "logo": "images/logo/newlogo/chenguang.png"
            },
			{
                "name": "凌美",
                "brand_id":24240,
                "logo": "images/logo/newlogo/lamy.png"
            },
			{
                "name": "马可",
                "brand_id":26979,
                "logo": "images/logo/newlogo/mk.png"
            },
			{
                "name": "施耐德",
                "brand_id":15816,
                "logo": "images/logo/newlogo/sld.png"
            },
			{
                "name": "施耐德",
                "brand_id":49497,
                "logo": "images/logo/newlogo/sld.png"
            },
			{
                "name": "英雄",
                "brand_id":19875,
                "logo": "images/logo/newlogo/hero.png"
            },
			{
                "name": "爱宝",
                "brand_id":3169,
                "logo": "images/logo/newlogo/aibao.png"
            },
			{
                "name": "惠朗",
                "brand_id":8736,
                "logo": "images/logo/newlogo/huilang.png"
            },
			{
                "name": "诺为",
                "brand_id":13570,
                "logo": "images/logo/newlogo/lw.png"
            },
			{
                "name": "极米",
                "brand_id":66648,
                "logo": "images/logo/newlogo/jimi.png"
            },
            {
                "name": "gopro",
                "brand_id":54035,
                "logo": "images/logo/newlogo/gopro.png"
            },
			{
                "name": "明基",
                "brand_id":12985,
                "logo": "images/logo/newlogo/benq.png"
            }
        ]
    };
	//

    jd.DataTool = DataTool;
})();