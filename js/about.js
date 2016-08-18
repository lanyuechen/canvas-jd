this.jd = this.jd||{};
(function(){
    var About = function()
    {
        this.init();
    };

    var p = About.prototype;

    p.init = function()
    {
        this.initDom();
        this.initLoader();
        this.initShare();
    };

    p.initDom = function()
    {
        this.canvasContainer = document.getElementById("container3d");
        this.$shareItem = $(".sharePanel .iconContainer .icon");
    };

    p.initShare = function()
    {
        this.shareData = {
            "title":"京东11.11实时数据战报",
            "url":top.window.location.href,
            "pic":"http://misc.360buyimg.com/lib/img/e/logo-201305.png",
            "des":"硬派大片拉起序幕，京东3C决战11.11！京东3C汇聚手机、IT、数码三大强势品类重磅促销，打造11.11期间B2C平台真正主场。手机8亿优惠卷放送、IT疯狂2小时狂促、数码100万件商品对折，共同为亿万消费者奉上超级购物盛宴！买3C信京东！硬货硬实力！"
        };
        //
        var cur = this;
        this.$shareItem.click(function(){
            var id = cur.$shareItem.index(this);
            cur.toShare(id);
        });
    };

    p.toShare = function(id)
    {
        if(id == 0)
        {
            this.shareToWeibo(this.shareData["title"],this.shareData["url"],this.shareData["pic"]);
        }
        if(id ==1)
        {
            this.shareToQoze(this.shareData["title"],this.shareData["url"],this.shareData["pic"],this.shareData["des"]);
        }
        if(id ==2)
        {
            this.shareToQQ(this.shareData["title"],this.shareData["url"],this.shareData["pic"]);
        }
        if(id ==3)
        {
            this.shareToRenren(this.shareData["title"],this.shareData["url"],this.shareData["pic"],this.shareData["des"]);
        }
    };

    p.shareToWeibo = function(title,url,pic)
    {
        var allUrl = "http://service.weibo.com/share/share.php?title="+encodeURIComponent(title)+"&url="+encodeURIComponent(url)+"&pic="+encodeURIComponent(pic);
        this.openShare(allUrl);
    };

    p.shareToQoze = function(title,url,pic,des)
    {
        var allUrl="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+encodeURIComponent(url)+"&title="+encodeURIComponent(title)+"&pics="+encodeURIComponent(pic)+"&summary="+encodeURIComponent(des);

        this.openShare(allUrl);
    };

    p.shareToQQ = function(title,url,pic)
    {
        var allUrl = "http://connect.qq.com/widget/shareqq/index.html?url="+encodeURIComponent(url)+"&site="+encodeURIComponent(title)+"&pics="+encodeURIComponent(pic);
        this.openShare(allUrl);
    };

    p.shareToRenren = function(title,url,pic,des)
    {
        var allUrl = "http://widget.renren.com/dialog/share?resourceUrl="+encodeURIComponent(url)+"&srcUrl="+encodeURIComponent(url)+"&title="+encodeURIComponent(title)+"&pic="+encodeURIComponent(pic)+"&description="+encodeURIComponent(des);
        this.openShare(allUrl);
    };


    p.openShare = function(url)
    {
        window.open (url, 'newwindow', 'height=500, width=800, top=0, left=0, toolbar=no');
    };

    //======================================================   loader    start ===================================================//
    p.resourcesMap ={};
    p.initLoader = function()
    {
        var cur = this;
        var resourcesAry = [
            {id:"intro", type:"texture", url:"images/about/intro.png"},
            {id:"spark", type:"texture", url:"images/spark1.png"},
        ];
        this.loader = new jd.ThreeGroupLoader();
        this.loader.$eventDispatcher.bind('loadProgress',function(e,data){
            //console.log(data);
        });
        this.loader.$eventDispatcher.bind('loadComplete',function(e,data){
            cur.resourcesMap = data;
            cur.init3d();
        });
        this.loader.load(resourcesAry);
    };
    //======================================================   loader    end ===================================================//


    //======================================================   threejs    start =============================================//
    /*------------------------------threejs common part start---------------------------------------------------------*/
     p.init3d=function()
    {
        this.initRender();
        this.initCamera();
        this.initScene();
        this.initObject();
        this.initLight();
        this.initResize();
    };
    p.initRender=function()
    {
        this.renderer = new THREE.WebGLRenderer({ antialias: true ,alpha:true});
        this.renderer.autoClear = false;
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.canvasContainer.appendChild( this.renderer.domElement );
    };

    p.initCamera=function()
    {
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera( 30, width / height, 0.1, 8000 );
        this.camera.position.set(0, 0, 1500);
        //
       /* this.camera = new THREE.PerspectiveCamera( 60, width / height, 0.1, 10000 );
        this.camera.position.set(0, 0, 500);*/
        //
        this.cameraOrtho = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 1, 10 );
        this.cameraOrtho.position.z = 10;
    };

    p.initScene = function()
    {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog( 0x000000, 0, 100000 );
        //
        this.sceneOrtho = new THREE.Scene();
    };

    p.initLight = function ()
    {

    };

    p.initObject=function()
    {
        this.initContainer();
        this.createParticleMaterial();
        this.createBgParticle();
        this.initIntro();
     
    };

    p.render = function()
    {
        if(this.renderer)
        {
            //this.container.rotation.y += 0.005;
            this.bgParticleRender();
            this.renderer.render( this.scene, this.camera );
            this.renderer.render( this.sceneOrtho, this.cameraOrtho );
        }
    };

    p.initResize = function()
    {
        var cur = this;
        window.addEventListener( 'resize', function(){
            cur.resizeFun();
        }, false );
        this.resizeFun();
    };

    p.resizeFun = function()
    {
        var width = window.innerWidth;
        var height = window.innerHeight;
        //
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        //
        this.cameraOrtho.left = - width / 2;
        this.cameraOrtho.right = width / 2;
        this.cameraOrtho.top = height / 2;
        this.cameraOrtho.bottom = - height / 2;
        this.cameraOrtho.zoom = height/900;
        this.cameraOrtho.updateProjectionMatrix();
        //
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    };
    /*-------------------------------threejs common part end ---------------------------------------------------------*/

    p.initContainer = function()
    {
        this.container = new THREE.Object3D();
        this.scene.add(this.container);
        //this.container.rotation.x= 0.1;
    };

    //创建粒子材质
    p.createParticleMaterial = function()
    {
        var texture = this.resourcesMap["spark"]["result"];
        this.particleMaterial = new THREE.ShaderMaterial( {
            uniforms: {
                color:    { type: "c", value: new THREE.Color( 0xffffff ) },
                opacity:  { type: "f", value: 1 },
                texture:  { type: "t", value: texture }
            },
            vertexShader:   document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
            blending:       THREE.AdditiveBlending,
            depthTest:      false,
            transparent:    true
        });
    };

    /*---------------------------------------------- intro start-----------------------------------------------*/
    p.initIntro = function()
    {
        var texture = this.resourcesMap["intro"]["result"];
        var w = texture.image.width;
        var h = texture.image.height;
        var geometry = new THREE.PlaneGeometry( w, h, 10,10 );
        var material = new THREE.MeshBasicMaterial( { map: texture/*,alphaMap:map*/, side: THREE.DoubleSide,transparent:true,depthTest:false,opacity:0 } );
        this.intro = new THREE.Mesh( geometry, material );
        this.container.add( this.intro );
        this.intro.position.y = 50;
        this.intro.position.z = -800;
        this.intro.rotation.x = -1.5;
        //
        this.introAppear();
    };

    p.introAppear = function()
    {
        TweenLite.to(this.intro.material, 1.5, { delay:1, opacity:1});
        TweenLite.to(this.intro.rotation, 1, { delay:1, x:0});
        TweenLite.to(this.intro.position, 1, { delay:1, z:0});
    };
    /*---------------------------------------------- intro end-----------------------------------------------*/

    /*---------------------------------------------- bgParticle start-----------------------------------------------*/
    p.createBgParticle = function(id)
    {
        var particleNum = 1500;
        var positionAry = new Float32Array(particleNum*3);
        var vYAry = new Float32Array(particleNum);
        var colorAry = new Float32Array(particleNum*3);
        var opacityAry = new Float32Array( particleNum );
        var sizeAry = new Float32Array( particleNum );

        var color = new THREE.Color( 0xde3ed4 );
        //
        var i = particleNum;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            //
            positionAry[i3] = 4000*(Math.random()-0.5);
            positionAry[i3+1] = 2000*(Math.random()-0.5);
            positionAry[i3+2] = -5000*(Math.random());
            //
            vYAry[i] = 3*Math.random()+1;
            opacityAry[i] = 0.2+0.5*Math.random();
            sizeAry[i] = 4*Math.random()+2;
            color.toArray( colorAry, i * 3 );
        }
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positionAry, 3 ) );
        geometry.addAttribute( 'vY', new THREE.BufferAttribute( vYAry, 1 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colorAry, 3 ) );
        geometry.addAttribute( 'customOpacity', new THREE.BufferAttribute( opacityAry, 1 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizeAry, 1 ) );
        //
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.customOpacity.needsUpdate = true;
        //
        this.bgParticle = new THREE.Points( geometry, this.particleMaterial );
        this.scene.add(this.bgParticle);
    };

    p.bgParticleRender = function()
    {
        var positionAry = this.bgParticle.geometry.attributes.position.array;
        var vY = this.bgParticle.geometry.attributes.vY.array;
        var opacityAry = this.bgParticle.geometry.attributes.customOpacity.array;
        //
        var i = vY.length;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            positionAry[i3+2] += vY[i];
            if(positionAry[i3+2] > 1000)
            {
                positionAry[i3+2] = -5000;
            }
        }
        this.bgParticle.geometry.attributes.position.needsUpdate = true;
        this.bgParticle.geometry.attributes.customOpacity.needsUpdate = true;
        this.bgParticle.geometry.attributes.customColor.needsUpdate = true;
        this.bgParticle.geometry.attributes.size.needsUpdate = true;
    };
    /*---------------------------------------------- bgParticle end-----------------------------------------------*/

    //=================================================   threejs    end ==============================================//
    jd.About = About;
})();