this.jd = this.jd||{};
(function(){
    var Mainframe = function()
    {
        this.init();
    };
    var p = Mainframe.prototype;

    p.apiMap ={
        "c3":"http://data.jd.com/digitalBUData?type=api1_7b620454_c139_4f9f_8b36_20a9d3b0079d",
        "phone_1":"http://data.jd.com/digitalBUData?type=api2_bbcb7456_8612_4a08_b929_39144be56a6f",
        "phone_2":"http://data.jd.com/digitalBUData?type=api3_9fa85a38_3a1c_4c7b_a203_b66e9c421032",
        "phone_3":"http://data.jd.com/digitalBUData?type=api4_6c221ee6_a9ee_49be_8122_c731376db69b",
        "phone_4":"http://data.jd.com/digitalBUData?type=api12_c975c5d8_5e0a_4955_a89a_8fcb9909e20f",
        "it_1":"http://data.jd.com/digitalBUData?type=api6_98b22c38_961c_4476_b01b_dd880b8216f1",
        "it_2":"http://data.jd.com/digitalBUData?type=api7_39d38582_77fe_4b21_8d37_eecff2b73e8a",
        "it_3":"http://data.jd.com/digitalBUData?type=api5_4528844d_caa1_4e28_b128_8e015b37b485",
        "it_4":"http://data.jd.com/digitalBUData?type=api10_45bf8560_5985_40e9_9cb3_4dfd62efd60e",
        "it_5":"http://data.jd.com/digitalBUData?type=api13_2e79a3a0_1540_476e_bdb1_39eb5cac09ad",
        "digital_1":"http://data.jd.com/digitalBUData?type=api8_eb83b8ec_450d_411a_ab63_05e0193cc01e",
        "digital_2":"http://data.jd.com/digitalBUData?type=api9_3f994396_32fe_44ab_adcd_42c587b79d3e"
    };

    p.init = function()
    {
        this.initDom();
        this.initNav();
        this.initSubNav();
        this.initDashboard();
        new jd.ContentScrollPanel($(".dashboardContainer"));
    };

    p.initDom = function()
    {
        this.$navPanel = $(".navPanel");
        this.$nav = $(".navPanel .nav");
        this.$subNavContainer = $(".subNavContainer");
        this.$subNavScrollPanel = $(".subNavContainer .subNavScrollPanel");
        this.$subNavGroup = $(".subNavContainer .subNavScrollPanel .subNavGroup");
        this.$subNav = $(".subNavContainer .subNavScrollPanel .subNavGroup .subNav");
        this.$dashboardContainer = $(".dashboardContainer");
        this.$item = $(".itemContainer .item");
        this.$c3Item = $(".itemContainer .c3");
        this.$phone1Item = $(".itemContainer .phone_1");
    };

    p.initNav = function()
    {
        var cur = this;
        this.$nav.mouseenter(function(){
            var id = cur.$nav.index(this);
            var targetX=0;
            if(id == 1 || id==2 || id==3)
            {
                cur.subNavOpen();
                var n = id-1;
                targetY = $(this).offset().top;
                targetX = -cur.$subNavGroup.eq(n).position().left;
                var targetW = 350
                if(id ==1) targetW = 320;
                if(id ==2) targetW = 330;
                if(id ==3) targetW = 300;
                targetH = cur.$subNavGroup.eq(n).children(".subNav").length*50+60;
                cur.$subNavContainer.css({"height":targetH,"top":targetY,"width":targetW});
                cur.$subNavScrollPanel.css({"left":targetX});
            }
            else
            {
                cur.subNavClose();
            }
        });
        this.$nav.mouseleave(function(){
			var id = cur.$nav.index(this);
            if(id == 1 || id==2 || id==3)
            {
                cur.subNavClose();
            }
        });
        this.$nav.click(function(){
            var id = cur.$nav.index(this);
            if(id == 0)
            {
                cur.toOpen();
            }
            if(id ==4)
            {
                if(cur.isOpen)
                {
                    cur.toClose("about.html");
                }
                else
                {
                    $("#wbstSubFrame").attr("src","about.html");
                }
            }
        });
    };

    p.navPanelToRight = function()
    {
        this.$navPanel.animate({"left":"100%","margin-left":"-50px"},800);
    };

    p.navPanelToLeft = function()
    {
        this.$navPanel.animate({"left":0,"margin-left":0},800);
    };

    //------------------------------------------------subNav  start------------------------------------------------//
    p.initSubNav = function()
    {
        var cur = this;
        this.$subNavContainer.css({"left":"60px"});
        this.$subNav.mouseenter(function(){
           $(this).css({"background-color":"#0eb5f3",color:"#FFFFFF"});
           $(this).children(".titleArrow").css({"opacity":1});
        });
        this.$subNav.mouseleave(function(){
            $(this).css({"background-color":"transparent",color:"#0eb5f3"});
            $(this).children(".titleArrow").css({"opacity":0});
        });
        this.$subNav.click(function(){
            var url = $(this).attr("suburl");
            if(cur.isOpen)
            {
                cur.toClose(url);
            }
            else
            {
                $("#wbstSubFrame").attr("src",url);
            }
        });
        //
        this.$subNavContainer.mouseenter(function(){
            cur.cancelSubNavClose();
        });
        this.$subNavContainer.mouseleave(function(){
            cur.subNavClose();
        });
    };
    p.cancelSubNavClose = function()
    {
        if(this.closeTimer)
        {
            clearTimeout(this.closeTimer);
        }
    };
    p.subNavOpen = function()
    {
        this.cancelSubNavClose();
        if(this.isOpen)
        {
            this.$subNavContainer.children(".leftArrow").hide();
            this.$subNavContainer.children(".rightArrow").show();
        }
        else
        {
            this.$subNavContainer.children(".leftArrow").show();
            this.$subNavContainer.children(".rightArrow").hide();
        }
		this.$subNavContainer.show();
        this.$subNavContainer.css({"opacity":1});
    };
    p.subNavClose = function()
    {
        var cur = this;
        this.closeTimer =setTimeout(function(){
            cur.$subNavContainer.css({"opacity":0,"height":0});
        },300);
    };

    p.subNavContainerToLeft = function()
    {
		this.$subNavContainer.hide();
        this.$subNavContainer.css({"left":"60px","right":"auto"});
    };
    p.subNavContainerToRight = function()
    {
		this.$subNavContainer.hide();
        this.$subNavContainer.css({"right":"50px","left":"auto"});
    };
    //------------------------------------------------subNav  end------------------------------------------------//

    //----------------------------------------------dashboard  start----------------------------------------------//
    p.isOpen = false;
    p.toOpen = function()
    {
        if(!this.isOpen)
        {
            this.isOpen = true;
            this.dashboardOpen();
            this.navPanelToRight();
            this.subNavContainerToRight();
            $("#wbstSubFrame").attr("src","");
        }
    };
    p.toClose = function(url)
    {
        if(this.isOpen)
        {
            this.isOpen = false;
            this.navPanelToLeft();
            this.subNavContainerToLeft();
            this.$dashboardContainer.stop().animate({"left":"-100%"},800,function(){
                $("#wbstSubFrame").attr("src",url);
            });
        }
    };

    p.initDashboard = function()
    {
        var cur = this;
        this.$item.click(function(){
            var url = $(this).attr("suburl");
            cur.toClose(url);
        });
        this.initSubComponent();
    };
    p.dashboardOpen = function()
    {
        this.isOpen = true;
        this.$dashboardContainer.animate({"left":0},800);
    };

    p.initSubComponent = function()
    {
        this.init3C(this.apiMap["c3"]);
        this.initPhone_1(this.apiMap["phone_1"])
        this.initItem();
    };

    p.init3C = function(url)
    {
        var cur = this;
        var dataTool = new jd.DataTool_3c(url);
        dataTool.eventDispatcher.bind("updateData",function(e,ary){
            cur.$c3Item.find(".strongNum").text(cur.formatNum(ary[0]["num"].toString()));
            cur.$c3Item.find(".num").text(cur.formatNum(ary[0]["num"].toString()));
        });
    };

    p.initPhone_1 = function(url)
    {
        var cur = this;
        var dataTool = new jd.DataTool_sum(url);
        dataTool.eventDispatcher.bind("updateData",function(e,sum){
            cur.$phone1Item.find(".strongNum").text(cur.formatNum(sum["num"].toString()));
            cur.$phone1Item.find(".num").text(cur.formatNum(sum["num"].toString()));
        });
    };

    p.initItem = function()
    {
        this.initItemFun($(".itemContainer .it_1 .txt .strongNum"),this.apiMap["it_1"]);
        this.initItemFun($(".itemContainer .it_2 .txt .strongNum"),this.apiMap["it_2"]);
        this.initItemFun($(".itemContainer .it_3 .txt .strongNum"),this.apiMap["it_3"]);
        this.initItemFun($(".itemContainer .digital_1 .txt .strongNum"),this.apiMap["digital_1"]);
    };
    p.initItemFun = function($dom,url)
    {
        var cur = this;
        var dataTool = new jd.DataTool(url,true);
        dataTool.eventDispatcher.bind("updateData",function(e,ary,sum){
            $dom.text(cur.formatNum(sum["num"].toString()));
            //console.log(sum["num"]);
            //console.log(sum["num"])
        });
        dataTool.eventDispatcher.bind("complete",function(e,json) {
            console.log(json["sum"]);
            console.log("=========================");
        });
    };

    p.formatNum = function(str)
    {
        if (str.length <= 3)
        {
            return str;
        }
        else
        {
            return this.formatNum(str.substr(0, str.length - 3)) + ',' + str.substr(str.length - 3);
        }
    };


    //----------------------------------------------dashboard  end----------------------------------------------//

    jd.Mainframe = Mainframe;
})();