this.jd = this.jd||{};
(function(){
    var Phone_2 = function()
    {
        this.init();
    };

    var p = Phone_2.prototype;
    p.topNum = 10;
    p.showNum = 10;
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
            {id:"title", type:"texture", url:"images/phone_2/title.png"},
            {id:"bgLine", type:"texture", url:"images/phone_2/bgLine.png"},
            {id:"numLine", type:"texture", url:"images/it_1/numLine.png"},
            {id:"cuboid", type:"js", url:"model/cuboid.js"},
            {id:"spark", type:"texture", url:"images/spark1.png"},
            {id:"sortNum_1", type:"texture", url:"images/num/num_1.png"},
            {id:"sortNum_2", type:"texture", url:"images/num/num_2.png"},
            {id:"sortNum_3", type:"texture", url:"images/num/num_3.png"},
            {id:"sortNum_4", type:"texture", url:"images/num/num_4.png"},
            {id:"sortNum_5", type:"texture", url:"images/num/num_5.png"},
            {id:"sortNum_6", type:"texture", url:"images/num/num_6.png"},
            {id:"sortNum_7", type:"texture", url:"images/num/num_7.png"},
            {id:"sortNum_8", type:"texture", url:"images/num/num_8.png"},
            {id:"sortNum_9", type:"texture", url:"images/num/num_9.png"},
            {id:"sortNum_10", type:"texture", url:"images/num/num_10.png"}
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
        //var apiUrl =  ["data/phone_2.json", "data/phone_2_2.json"];
        var apiUrl = "http://data.jd.com/digitalBUData?type=api3_9fa85a38_3a1c_4c7b_a203_b66e9c421032";
        this.dataTool = new jd.DataTool(apiUrl);
        this.dataTool.eventDispatcher.bind("updateData",function(e,ary,sum){
            //scope3["component3"].update(ary);
            cur.dataUpdate(ary,sum);
        });
    };

    p.dataUpdate = function(ary,sum)
    {
        this.numItemUpdate(ary);
        this.logoUpdate(ary);
        //this.titleSumUpdate(sum);
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
        this.camera = new THREE.PerspectiveCamera( 10, width / height, 1, 6000 );
        this.camera.position.set(0, 20, 4800);
        //
        this.titleCamera = new THREE.PerspectiveCamera( 48, width / height, 1, 3000 );
        this.titleCamera.position.set(0, 0, 1000);
    };

    p.initScene = function()
    {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog( 0x000000, 0, 50000 );
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
        this.createBox();
        this.boxAppear();
        this.createInnerParticle();
        this.createBgParticle();
        this.createBgLine();
        this.bgLineAppear();
        this.createNum();
        this.numAppear();
        this.createNumLine();
        this.numLineAppear();
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
        this.container.rotation.x = 0.2;
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

    /*------------------------------------------------ box  start --------------------------------------------------*/
    //假设导入的长方体模型的底边长为boxD、长主体的高度为boxH
    p.boxD = 45;
    p.boxH = 300;
    p.createBox = function()
    {
        this.boxAry = [];
        this.boxContainer = new THREE.Object3D();
        this.container.add(this.boxContainer);
        this.boxContainer.position.set(-420,-200,0);
        //
        for(var i =0; i<this.topNum; i++)
        {
            var box = this.createBoxItem();
            this.boxContainer.add(box);
            this.boxAry.push(box);
            box.position.x = i*96.5;
            //box.rotation.y -=0.5;
            box.rotation.y = 8;
            box.scale.y = 0;
            box.userData["scaleY"]=1-i*0.03;
        }
    };

    p.createBoxItem = function()
    {
        var vs = this.resourcesMap["cuboid"]["result"].vertices;
        var pointNum = vs.length;
        var geometry = new THREE.BufferGeometry();
        //
        var positionAry = new Float32Array(pointNum*3);
        var colorAry = new Float32Array(pointNum*3);
        var opacityAry = new Float32Array( pointNum );
        var sizeAry = new Float32Array( pointNum );
        var endYAry  = new Float32Array(pointNum);
        //
        var color = new THREE.Color( 0x02d3fe );
        //
        var i = pointNum;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            positionAry[i3] = vs[i]["x"]*1.4;
            positionAry[i3+1] = vs[i]["y"]*2;
            positionAry[i3+2] = vs[i]["z"]*1.4;
            //
            opacityAry[i] = 0.8;
            sizeAry[i] = 3;
            color.toArray( colorAry, i * 3 );
            //
            endYAry[i] = vs[i]["y"]*6;
        }
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positionAry, 3 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colorAry, 3 ) );
        geometry.addAttribute( 'customOpacity', new THREE.BufferAttribute( opacityAry, 1 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizeAry, 1 ) );
        geometry.addAttribute( 'endY', new THREE.BufferAttribute( endYAry, 1 ) );
        //
        var particles = new THREE.Points( geometry, this.particleMaterial );
        geometry.attributes.position.needsUpdate = true;
        return particles;
    };

    p.boxAppear = function()
    {
        var ary = this.boxAry;
        for(var i = 0; i < ary.length; i++)
        {
            this.boxItemAppear(ary[i],i)
        }
    };

    p.boxItemAppear = function(box,i)
    {
        var delayTime = (this.topNum-i)*0.1;
        TweenLite.to(box.rotation, 1.6, { delay:delayTime, y:-0.5});
        TweenLite.to(box.scale, 1.5, { delay:delayTime, y:box.userData["scaleY"],onCompleteScope:this, onComplete:function(){
            //this.innerParticleItemAry[i].visible = true;
            this.innerParticleItemAppear(this.innerParticleItemAry[i]);
        }});
    };
    /*-------------------------------------------------- box  end  --------------------------------------------------*/

    /*--------------------------------------------- innerParticle  start  ----------------------------------------------*/
    p.createInnerParticle = function()
    {
        this.innerParticleItemAry =[];
        for(var i =0; i<this.topNum; i++)
        {
            var innerParticle = this.createInnerParticleItem();
            this.boxContainer.add(innerParticle);
            this.innerParticleItemAry.push(innerParticle);
            innerParticle.position.x = this.boxAry[i].position.x;
            innerParticle.rotation.y -=0.5;
            //innerParticle.scale.y = 0;
            //innerParticle.visible = false;
        }
        //this.boxPContainer.visible =false;
    };

    p.createInnerParticleItem = function()
    {
        var particleNum = 800;
        var positionAry = new Float32Array(particleNum*3);
        var colorAry = new Float32Array(particleNum*3);
        var vYAry = new Float32Array(particleNum);
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
            positionAry[i3] = this.boxD*(Math.random()-0.5);
            positionAry[i3+1] = 200*Math.random();
            positionAry[i3+2] = this.boxD*(Math.random()-0.5);
            vYAry[i] = Math.random()*3+1;
            vYAry[i] = 0;
            opacityAry[i] = 0;
            sizeAry[i] = Math.random()*2+2;
            color.toArray( colorAry, i * 3 );
        }
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positionAry, 3 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colorAry, 3 ) );
        geometry.addAttribute( 'vY', new THREE.BufferAttribute( vYAry, 1 ) );
        geometry.addAttribute( 'customOpacity', new THREE.BufferAttribute( opacityAry, 1 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizeAry, 1 ) );
        //
        var particles = new THREE.Points( geometry, this.particleMaterial );
        geometry.attributes.position.needsUpdate = true;
        return particles;
    };

   /* p.innerParticleAppear = function()
    {
        var ary = this.innerParticleItemAry;
        for(i=0; i<ary.length;i++)
        {

        }
    };*/

    p.innerParticleItemAppear = function(innerParticle)
    {
        var vY = innerParticle.geometry.attributes.vY.array;
        //
        var i = vY.length;
        while(i>0)
        {
            i--;
            vY[i] = vY[i] = Math.random()*1.5+0.5;
        }
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
        var vY = innerParticle.geometry.attributes.vY.array;
        var opacityAry = innerParticle.geometry.attributes.customOpacity.array;
        //
        var i = vY.length;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            //positionAry[i3] = d*(Math.random()-0.5);
            positionAry[i3+1] += vY[i];
            //最高点
            var tempH = this.boxH*(1-id*0.03)
            if(positionAry[i3+1]>tempH*0.6)
            {
                opacityAry[i] -=0.015;
            }
            if(positionAry[i3+1] >= tempH)
            {
                positionAry[i3+1] = 0;
                opacityAry[i] = Math.random()*0.5+0.5;
            }
            //positionAry[i3+2] = d*(Math.random()-0.5);
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
            positionAry[i3+2] = -6000*(Math.random());
            //
            vYAry[i] = 6*Math.random()+5;
            opacityAry[i] = 0.2+0.5*Math.random();
            sizeAry[i] = 5*Math.random()+2;
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
                positionAry[i3+2] = -6000;
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
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0/*,alphaMap:map*/, side: THREE.DoubleSide,transparent:true } );
        this.bgLine = new THREE.Mesh( geometry, material );
        this.container.add( this.bgLine );
        this.bgLine.position.y = -0;
    };

    p.bgLineAppear = function()
    {
        TweenLite.to(this.bgLine.material, 2, { delay:1, opacity:1});
    };
    /*------------------------------------------------- bgLine end-------------------------------------------------*/

    /*--------------------------------------------------- num start--------------------------------------------------*/
    p.createNum = function()
    {
        this.numItemAry =[];
        this.contextAry =[];
        for(var i=0;i<this.showNum;i++)
        {
            var obj = this.createTxtMaterialItem();
            var numItem = this.createNumItem(obj["material"]);
            this.boxContainer.add(numItem);
            this.numItemAry.push(numItem);
            numItem.position.x = this.boxAry[i].position.x;
            numItem.position.y =380*(1-i*0.03);
            //
            this.contextAry.push(obj["context"]);
            //console.log(obj["material"].map)
        }
    };

    p.createNumItem = function(material)
    {
        var numItem = new THREE.Mesh( new THREE.PlaneGeometry( 128,32 ), material );
        return numItem
    };

    p.createTxtMaterialItem = function()
    {
        var canvas = document.createElement( 'canvas' );
        canvas.width = 128;
        canvas.height =32;
        var context = canvas.getContext('2d');
        context.shadowBlur=12;
        context.shadowColor="rgba(255,0,0,0.8)";
        context.textAlign ="center";
        context.font = "Bold 20px Arial";
        /*context.fillStyle = "rgba(255,0,0,0.5)";
         context.fillRect(0,0,128,32);*/
        context.fillStyle='#FFFFFF';
        context.fillText("0", 64,20);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0, side: THREE.DoubleSide,transparent:true,depthTest:false } );
        var obj ={"material":material,"context":context};
        return obj;
    };

    p.numItemUpdate = function(ary)
    {
        for(var i=0; i<this.contextAry.length;i++)
        {
            this.contextAry[i].clearRect(0,0,128,32);
            this.contextAry[i].fillText(this.formatNum(ary[i]["num"].toString()), 64,20);
            this.numItemAry[i].material.map.needsUpdate = true;
            //console.log(this.numItemAry[i].material);
        }
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

    p.numAppear = function()
    {
        var ary = this.numItemAry;
        for(var i = 0; i < ary.length; i++)
        {
            this.numItemAppear(ary[i],i)
        }
    };
    p.numItemAppear = function(numItem,i)
    {
        var delayTime = 1+(this.topNum-i)*0.1;
        TweenLite.to(numItem.material, 1.5, { delay:delayTime, opacity:1,onCompleteScope:this, onComplete:function(){

        }});
    };
    /*---------------------------------------------------- num end--------------------------------------------------*/

    /*--------------------------------------------------- numLine start-----------------------------------------------*/
    p.createNumLine = function()
    {
        this.numLineAry =[];
        for(var i=0;i<this.showNum;i++)
        {
            var numLineItem = this.createNumLineItem();
            this.boxContainer.add(numLineItem);
            this.numLineAry.push(numLineItem);
            numLineItem.position.x = i*this.space;
            numLineItem.position.y = 200;
            numLineItem.userData["endY"] =330*(1-i*0.03);;
        }
    };

    p.createNumLineItem = function()
    {
        var texture = this.resourcesMap["numLine"]["result"];
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0, color:0xde3ed4,transparent:true, /*blending:THREE.AdditiveBlending,*/ depthTest:false} );
        var geometry = new THREE.PlaneGeometry( texture.image.width,texture.image.height );
        var numLine = new THREE.Mesh(geometry,material);
        return numLine;
    };

    p.numLineAppear = function()
    {
        var ary = this.numLineAry;
        for(var i = 0; i<ary.length; i++)
        {
            this.numLineItemAppear(ary[i],i);
        }
    };

    p.numLineItemAppear = function(numLineItem,i)
    {
        var delayTime = 0.5+(this.topNum-i)*0.1;
        TweenLite.to(numLineItem.material, 1, { delay:delayTime, opacity:1});
        TweenLite.to(numLineItem.position, 1, { delay:delayTime,y:numLineItem.userData["endY"]});
    };
    /*--------------------------------------------------- numLine end-----------------------------------------------*/

    /*--------------------------------------------------- sortNum start-----------------------------------------------*/
    p.createSortNum = function()
    {
        this.sortNumAry = [];
        for(var i=0;i<this.topNum;i++)
        {
            var sortNumItem = this.createSortNumItem(i);
            this.boxContainer.add(sortNumItem);
            this.sortNumAry.push(sortNumItem);
            sortNumItem.position.x = i*this.space;
            sortNumItem.position.y = -200;
            sortNumItem.userData["endY"] =-80;
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
        var delayTime = (this.topNum-i)*0.1;
        TweenLite.to(sortNumItem.material, 1, { delay:delayTime, opacity:1});
        TweenLite.to(sortNumItem.position, 1, { delay:delayTime,y:sortNumItem.userData["endY"]});
    };
    /*--------------------------------------------------- sortNum end-----------------------------------------------*/

    /*-------------------------------------------------- logo start--------------------------------------------------*/
    p.createLogo = function()
    {
        this.logoGeometry = new THREE.PlaneGeometry( 90, 25, 5,5 );
        //
        this.logoContainerAry =[];
        for(var i=0;i<this.topNum;i++)
        {
            var logoContainer = new THREE.Object3D();
            this.boxContainer.add(logoContainer);
            logoContainer.position.set(i*this.space,-40,0);
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
            delayTime= (this.topNum-i)*0.2+2;
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
    jd.Phone_2 = Phone_2;
})();