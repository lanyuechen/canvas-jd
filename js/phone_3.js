this.jd = this.jd||{};
(function(){
    var Phone_3 = function()
    {
        this.init();
    };

    var p = Phone_3.prototype;
    p.topNum = 3;
    p.showNum = 0;
    p.space = 96.5;

    p.init = function()
    {
        this.initDom();
        this.initLoader();
    };

    p.initDom = function()
    {
        this.canvasContainer = document.getElementById("container3d");
    };

    //====================================================   loader    start ===============================================//
    p.resourcesMap ={};
    p.initLoader = function()
    {
        var cur = this;
        var resourcesAry = [
            {id:"title", type:"texture", url:"images/phone_3/title.png"},
            {id:"numLine", type:"texture", url:"images/it_1/numLine.png"},
            {id:"bgLine", type:"texture", url:"images/phone_3/bgLine.png"},
            {id:"lightMC", type:"texture", url:"images/phone_3/lightMC.png"},
            {id:"spark", type:"texture", url:"images/spark1.png"},
            {id:"sortNum_1", type:"texture", url:"images/num/num_1.png"},
            {id:"sortNum_2", type:"texture", url:"images/num/num_2.png"},
            {id:"sortNum_3", type:"texture", url:"images/num/num_3.png"}
        ];
        this.loader = new jd.ThreeGroupLoader();
        this.loader.$eventDispatcher.bind('loadProgress',function(e,data){
            //console.log(data);
        });
        this.loader.$eventDispatcher.bind('loadComplete',function(e,data){
            $(".loading").fadeOut();
            //
            cur.resourcesMap = data;
            cur.init3d();
            cur.initData();
        });
        this.loader.load(resourcesAry);
    };
    //====================================================   loader    end =================================================//

    //======================================================   data    start ===================================================//
    p.initData = function()
    {
        var cur = this;
        //var apiUrl =  ["data/it_1.json", "data/it_1_2.json"];
        var apiUrl = "http://data.jd.com/digitalBUData?type=api4_6c221ee6_a9ee_49be_8122_c731376db69b";
        this.dataTool = new jd.DataTool(apiUrl);
        this.dataTool.eventDispatcher.bind("updateData",function(e,ary,sum){
            //scope3["component3"].update(ary);
            cur.dataUpdate(ary,sum);
        });
    };

    p.dataUpdate = function(ary,sum)
    {
        //this.numItemUpdate(ary);
        this.logoUpdate(ary);
    };
    //======================================================   data    end ===================================================//


    //======================================================   threejs    start ===================================================//
    /*------------------------------threejs common part start--------------------------------------------*/
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
        this.camera = new THREE.PerspectiveCamera( 30, width / height, 1, 5000 );
        this.camera.position.set(0, 0, 1500);
        //
        this.titleCamera = new THREE.PerspectiveCamera( 48, width / height, 1, 3000 );
        this.titleCamera.position.set(0, 0, 1000);
    };

    p.initScene = function()
    {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog( 0x000000, 0, 100000 );
        //
        this.titleScene = new THREE.Scene();
    };

    p.initLight = function ()
    {

    };

    p.initObject=function()
    {
        this.initContainer();
        this.createTitle();
        this.createParticleMaterial();
        this.createLight();
        this.createInnerParticle();
        this.innerParticleAppear();
        this.createBgParticle();
        this.createBgLine();
        this.bgLineAppear();
        this.createSortNum();
        this.sortNumAppear();
        this.createLogo();
    };

    p.render = function()
    {
        if(this.renderer)
        {
            //this.container.rotation.y +=0.01;
            this.innerParticleRender();
            this.bgParticleRender();
            this.renderer.render( this.scene, this.camera );
            this.renderer.render( this.titleScene, this.titleCamera );
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
        this.camera.aspect = width/ height;
        this.camera.updateProjectionMatrix();
        this.titleCamera.aspect = width/ height;
        this.titleCamera.updateProjectionMatrix();
        this.renderer.setSize( width, height );
    };
    /*------------------------------threejs common part end--------------------------------------------*/

    p.initContainer = function()
    {
        this.container = new THREE.Object3D();
        this.scene.add(this.container);
        this.container.position.set(0,-250,0);
        //this.container.rotation.x = 0.2;
    };

    /*-------------------------------------------------- title start--------------------------------------------------*/
    p.createTitle = function()
    {
        var material = new THREE.SpriteMaterial( { map:this.resourcesMap["title"]["result"] } );
        this.title = new THREE.Sprite( material );
        this.titleScene.add(this.title);
        var width = material.map.image.width;
        var height = material.map.image.height;
        this.title.scale.set( width, height, 1 );
        this.title.position.y = 350;
    };
    //
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
    /*-------------------------------------------------- title end--------------------------------------------------*/


    /*--------------------------------------------- innerParticle  start  ----------------------------------------------*/
    p.createInnerParticle = function()
    {
        this.innerParticleItemAry =[];
        for(var i =0; i<this.topNum; i++)
        {
            var r;
            var d;
            var num
            if(i==0)
            {
                r=400;
                d=100;
                num = 4000;
            }
            if(i==1)
            {
                r=250;
                d=100;
                num = 2000;
            }
            if(i==2)
            {
                r = 100;
                d = 100;
                num = 1000;
            }
            var innerParticle = this.createInnerParticleItem(r,d,num);
            this.container.add(innerParticle);
            this.innerParticleItemAry.push(innerParticle);
        }
    };


    p.totalAngle = 80*(Math.PI/180);
    p.startAngle = 50*(Math.PI/180);

    //半径、内外半度距离、粒子数量
    p.createInnerParticleItem = function(r,d,num)
    {
        var particleNum = num;
        var positionAry = new Float32Array(particleNum*3);
        var rAry = new Float32Array( particleNum);
        var innerRAry = new Float32Array( particleNum);
        var outRAry =  new Float32Array( particleNum);
        var rVAry = new Float32Array( particleNum);
        var angleAry = new Float32Array( particleNum );
        var colorAry = new Float32Array(particleNum*3);
        var opacityAry = new Float32Array( particleNum );
        var sizeAry = new Float32Array( particleNum );

        var color = new THREE.Color( 0x02d3fe );
        //
        var i = particleNum;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            angleAry[i] = (i/particleNum)*this.totalAngle;
            //
            rAry[i] = r-d*Math.random();
            innerRAry[i] = r-d;
            outRAry[i] = r;

            rVAry[i] = -(Math.random()*0.5+0.5);
            //
            positionAry[i3] = rAry[i]*Math.cos(this.startAngle+angleAry[i]);
            positionAry[i3+1] = rAry[i]*Math.sin(this.startAngle+angleAry[i]);
            positionAry[i3+2] = 40*(Math.random()-0.5);
            //
            //
            opacityAry[i] = 0.8;
            sizeAry[i] = Math.random()*3+1;
            color.toArray( colorAry, i * 3 );
        }
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positionAry, 3 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colorAry, 3 ) );
        geometry.addAttribute( 'r', new THREE.BufferAttribute( rAry, 1 ) );
        geometry.addAttribute( 'innerR', new THREE.BufferAttribute( innerRAry, 1 ) );
        geometry.addAttribute( 'outR', new THREE.BufferAttribute( outRAry, 1 ) );
        geometry.addAttribute( 'rV', new THREE.BufferAttribute( rVAry, 1 ) );
        geometry.addAttribute( 'angle', new THREE.BufferAttribute( angleAry, 1 ) );
        geometry.addAttribute( 'customOpacity', new THREE.BufferAttribute( opacityAry, 1 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizeAry, 1 ) );
        //
        var particles = new THREE.Points( geometry, this.particleMaterial );
        geometry.attributes.position.needsUpdate = true;
        return particles;
    };

    p.innerParticleAppear = function()
    {
        this.container.rotation.y =180*(Math.PI/180);
        TweenLite.to(this.container.rotation, 3, { delay:0,y:0});
    };

    p.innerParticleItemAppear = function(innerParticle)
    {
       /* var vY = innerParticle.geometry.attributes.vY.array;
        //
        var i = vY.length;
        while(i>0)
        {
            i--;
            vY[i] = Math.random()*1.5+0.5;
        }*/
    };

    p.innerParticleRender = function()
    {
        var ary = this.innerParticleItemAry;
        for(i=0; i<ary.length;i++)
        {
            this.innerParticleItemRender(ary[i],i);
        }
    };

    p.innerParticleItemRender = function(innerParticle,id)
    {
        var positionAry = innerParticle.geometry.attributes.position.array;
        var rAry = innerParticle.geometry.attributes.r.array;
        var innerRAry = innerParticle.geometry.attributes.innerR.array;
        var outRAry = innerParticle.geometry.attributes.outR.array;
        var rVAry = innerParticle.geometry.attributes.rV.array;
        var angleAry = innerParticle.geometry.attributes.angle.array;
        var opacityAry = innerParticle.geometry.attributes.customOpacity.array;

        var i = rAry.length;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            //
            rAry[i] += rVAry[i];
            opacityAry[i] -=0.008;
            if(opacityAry[i]<0)
            {
                opacityAry[i] =0;
            }

            if(rAry[i] <= innerRAry[i])
            {
                opacityAry[i] =Math.random()*0.3+0.7;
                rAry[i]= outRAry[i];
            }
            //
            positionAry[i3] = rAry[i]*Math.cos(this.startAngle+angleAry[i]);
            positionAry[i3+1] = rAry[i]*Math.sin(this.startAngle+angleAry[i]);

            //positionAry[i3+2] = 0;
        }
        innerParticle.geometry.attributes.position.needsUpdate = true;
        innerParticle.geometry.attributes.customOpacity.needsUpdate = true;
        innerParticle.geometry.attributes.customColor.needsUpdate = true;
        innerParticle.geometry.attributes.size.needsUpdate = true;
    };
    /*--------------------------------------------- innerParticle  end  ----------------------------------------------*/

    /*---------------------------------------------- bgParticle start-----------------------------------------------*/
    p.createBgParticle = function(id)
    {
        var particleNum = 2500;
        var positionAry = new Float32Array(particleNum*3);
        var vYAry = new Float32Array(particleNum);
        var colorAry = new Float32Array(particleNum*3);
        var opacityAry = new Float32Array( particleNum );
        var sizeAry = new Float32Array( particleNum );

        var color = new THREE.Color( 0x02d3fe );
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
            vYAry[i] = 6*Math.random()+5;
            opacityAry[i] = 0.2+0.5*Math.random();
            sizeAry[i] = 4*Math.random()+1;
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

    /*------------------------------------------------- bgLine start-------------------------------------------------*/
    p.createBgLine = function()
    {
        var texture = this.resourcesMap["bgLine"]["result"];
        var w = texture.image.width;
        var h = texture.image.height;
        var geometry = new THREE.PlaneGeometry( w, h, 5,5 );
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0/*,alphaMap:map*/, side: THREE.DoubleSide,transparent:true,depthTest:false } );
        this.bgLine = new THREE.Mesh( geometry, material );
        this.container.add( this.bgLine );
        this.bgLine.position.y = 180;
        this.bgLine.position.x = 10;
        this.bgLine.scale.set(0.95,0.95,1);
    };

    p.bgLineAppear = function()
    {
        TweenLite.to(this.bgLine.material, 2, { delay:1, opacity:1});
    };
    /*------------------------------------------------- bgLine end-------------------------------------------------*/

    p.createLight = function()
    {
        var texture = this.resourcesMap["lightMC"]["result"];
        var w = texture.image.width;
        var h = texture.image.height;
        var geometry = new THREE.PlaneGeometry( w, h, 5,5 );
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0/*,alphaMap:map*/, side: THREE.DoubleSide,transparent:true,depthTest:false } );
        this.lightMC = new THREE.Mesh( geometry, material );
        this.container.add( this.lightMC );
        this.lightMC.position.y = 0;
        this.lightMC.scale.set(0,0,1);
        //
        var cur = this;
        setInterval(function(){
            cur.lightRun()
        },5000);
       //this.lightRun();
    };

    p.lightRun = function()
    {
        this.lightMC.material.opacity = 0;
        this.lightMC.position.y = 0;
        this.lightMC.scale.set(0,0,1);
        TweenLite.to(this.lightMC.position, 2, { delay:0, y:320});
        TweenLite.to(this.lightMC.scale, 2, { delay:0, x:1.35,y:1.35});
        TweenLite.to(this.lightMC.material, 0.5, { delay:0, opacity:0.5});
        TweenLite.to(this.lightMC.material, 0.8, { delay:1.4, opacity:0,onCompleteScope:this, onComplete:function(){

        }});
    };

    /*--------------------------------------------------- sortNum start-----------------------------------------------*/
    p.createSortNum = function()
    {
        this.sortNumAry = [];
        for(var i=0;i<this.topNum;i++)
        {
            var sortNumItem = this.createSortNumItem(i);
            this.container.add(sortNumItem);
            this.sortNumAry.push(sortNumItem);
            var r;
            if (i == 0) {
                r = 400;
            }
            if (i == 1) {
                r = 250;
            }
            if (i == 2) {
                r = 100;
            }
            sortNumItem.position.set(r * Math.cos(this.startAngle) + 80, r * Math.sin(this.startAngle)-30, 0);
            if(i == 0)
            {
                sortNumItem.position.y += 10;
            }
            if(i == 1)
            {
                sortNumItem.position.x += 30;
                sortNumItem.position.y += 10;
            }
            if(i == 2)
            {

            }
            sortNumItem.userData["endY"] =-50;
            sortNumItem.scale.set(0.9,0.9,1);
        }
    };

    p.createSortNumItem = function(i)
    {
        var str = "sortNum_"+(i+1);
        console.log(str);
        var texture = this.resourcesMap[str]["result"];
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0, color:0xffffff,transparent:true, /*blending:THREE.AdditiveBlending,*/ depthTest:false} );
        var geometry = new THREE.PlaneGeometry( texture.image.width,texture.image.height );
        var sortNumItem = new THREE.Mesh(geometry,material);
        return sortNumItem;
    };

    p.sortNumAppear = function()
    {
        var ary = this.sortNumAry;
        for(var i = 0; i<ary.length; i++)
        {
            this.sortNumItemAppear(ary[i],i);
        }
    };

    p.sortNumItemAppear = function(sortNumItem,i)
    {
        var delayTime = 1+(this.topNum-i)*0.3;
        TweenLite.to(sortNumItem.material, 2, { delay:delayTime, opacity:1});
        //TweenLite.to(sortNumItem.position, 1, { delay:delayTime,y:sortNumItem.userData["endY"]});
    };
    /*--------------------------------------------------- sortNum end-----------------------------------------------*/

    /*-------------------------------------------------- logo start--------------------------------------------------*/
    p.createLogo = function()
    {
        this.logoGeometry = new THREE.PlaneGeometry( 100, 30, 5,5 );
        //
        this.logoContainerAry =[];
        for(var i=0;i<this.topNum;i++) {
            var logoContainer = new THREE.Object3D();
            this.container.add(logoContainer);
            var r;
            if (i == 0) {
                r = 400;
            }
            if (i == 1) {
                r = 250;
            }
            if (i == 2) {
                r = 100;
            }
            logoContainer.position.set(r * Math.cos(this.startAngle) + 80, r * Math.sin(this.startAngle), 0);
            if(i == 0)
            {
                logoContainer.position.y += 10;
            }
            if(i == 1)
            {
                logoContainer.position.x += 30;
                logoContainer.position.y += 10;
            }
            if(i == 2)
            {

            }
            logoContainer.userData["brandId"] = "_";
            logoContainer.userData["id"]=i;
            this.logoContainerAry.push(logoContainer);
        }
    };

    p.logoUpdate = function(ary)
    {
        for(var i=0; i< this.logoContainerAry.length; i++)
        {
            this.logoItemUpdate(this.logoContainerAry[i],ary[i]);
        }
    };

    p.logoItemUpdate = function(container,obj)
    {
        if(container.userData["brandId"] != obj["brand_id"])
        {
            container.userData["brandId"] = obj["brand_id"];
            this.removeLogoItem(container);
            this.addLogoItem(container,obj);
        }
    };

    p.addLogoItem = function(container,obj)
    {
        var texture = THREE.ImageUtils.loadTexture( obj["logo"] );
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0, color:0x02d3fe,transparent:true, blending:THREE.AdditiveBlending, depthTest:false} );
        var logo = new THREE.Mesh(this.logoGeometry,material);
        logo.rotation.y = 0.7*Math.PI;
        var delayTime =0;
        if(container.children.length == 0)
        {
            var i = container.userData["id"];
            delayTime= (this.topNum-i)*0.5+2;
            console.log(delayTime)
        }
        TweenLite.to(material, 1, { delay:delayTime, opacity:1});
        TweenLite.to(logo.rotation, 1.5, {delay:delayTime, y:0});
        container.add(logo);
    };

    p.removeLogoItem = function(container)
    {
        if(container.children.length>0)
        {
            var logo = container.children[0];
            TweenLite.to(logo.material, 1, { opacity:0});
            TweenLite.to(logo.rotation, 1.5, { y: -0.7*Math.PI,onCompleteScope:this, onComplete:function(){
                logo.visbile =false;
                container.remove(logo);
            }});
        }
    };
    /*-------------------------------------------------- logo end--------------------------------------------------*/


    //=================================================   threejs    end ==============================================//
    jd.Phone_3 = Phone_3;
})();