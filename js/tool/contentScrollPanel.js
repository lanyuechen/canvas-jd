this.jd=this.jd||{};
(function()
{
    var ContentScrollPanel=function($dom)
    {

        this.init($dom);
    };

    var p=ContentScrollPanel.prototype;

    p.init=function($dom)
    {
        this.$dom=$dom;
        this.$mask=this.$dom.children(".mask");
        this.$scrollPanel=this.$dom.children(".mask").children(".scrollPanel");
        this.$scrollBar=this.$dom.children(".scrollBar");
        this.$dragger=this.$dom.children(".scrollBar").children(".dragger");
        //
        this.isDown=false;
        this.mouseDownY=0;
        this.downY=0;
        console.log("init");
        this.reset();
    };

    p.reset = function()
    {
        console.log(this.$scrollPanel.height());
        console.log(this.$mask.height());
        if(this.$scrollPanel.height()> this.$mask.height())
        {

            this.initDragger();
            this.setDraggerHeight();
            this.initMouseWheel();
            //
            /*var cur = this;
            this.$dom.mouseenter(function(){
                cur.$scrollBar.fadeIn();
            });
            this.$dom.mouseleave(function(){
                cur.$scrollBar.fadeOut();
            });*/
        }
        else
        {
            this.$dom.unbind();
            this.$scrollPanel.css("top",0);
            this.$scrollBar.hide();
        }
    }

    p.initDragger = function()
    {
        var cur=this;
        this.$dragger.mousedown(function(event){
            cur.isDown=true;
            cur.mouseDownY=event.pageY;
            cur.downY=cur.$dragger.position().top;
			return false;
        });
        $(document).mouseup(function(event){
            cur.isDown=false;
        });
        $(document).mousemove(function(event){
            if(cur.isDown){
                event.preventDefault();
                var posY=event.pageY-cur.mouseDownY+cur.downY;
                cur.wheelStep(posY);
            }
        });
    };

    p.setDraggerHeight = function()
    {
        var per = this.$mask.height()/this.$scrollPanel.height();
        this.$dragger.css("height",this.$scrollBar.height()*per);
    }
	
	 p.wheelStep = function(posY)
    {
        if(posY<0) posY=0;
        var bottomY=this.$scrollBar.height()-this.$dragger.height();
        if(posY>bottomY) posY=bottomY;
        this.$dragger.css("top",posY);

        //
        var per=this.$dragger.position().top/bottomY;
        this.$scrollPanel.css("top",-(this.$scrollPanel.height()-this.$mask.height())*per);
    }
	
	p.initMouseWheel = function()
    {
        var cur = this;
        this.$dom.mousewheel(function(event, delta, deltaX, deltaY){
            var posY = cur.$dragger.position().top;
            posY += delta*(-10);
            cur.wheelStep(posY);
			return false;
        });
    }
    jd.ContentScrollPanel=ContentScrollPanel;
})();