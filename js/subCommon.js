this.jd = this.jd||{};
(function(){
    var SubCommon = function()
    {
        //this.init();
        this.createCommonElement();
    };

    var p = SubCommon.prototype;

    p.init= function()
    {
         if (self != top)
        {
            //当前页面被iframe
            if($('#wbstSubFrame', parent.document).length ==0)
            {
                //当前页面不是被自身的框架iframe 而是被京东iframe
                console.log("=====当前页面不是被自身的框架iframe 而是被京东iframe")
                this.createCommonElement();
            }
        }
        else
        {
            //当前页面没有被iframe
            console.log("=====当前页面没有被iframe")
            this.createCommonElement();
        }
    };

    //创建页面单独呈现时需要的框架中的元素，如 背景图、logo 等
    p.createCommonElement = function()
    {
        $(document.body).append(" <img class='jdLogo' src='images/jdLogo.png'/>");
        $(document.body).append(" <img class='slogan' src='images/slogan.png'/>");
        $(document.body).addClass("bg");
    };

    jd.SubCommon = SubCommon;
})();