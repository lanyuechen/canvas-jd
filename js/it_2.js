this.jd = this.jd||{};
(function(){
    var It_2 = function()
    {
        this.init();
    };

    var p = It_2.prototype;
    p.topNum = 8;
    p.showNum = 8;
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
            {id:"title", type:"texture", url:"images/it_2/title.png"},
            {id:"bgLine", type:"texture", url:"images/it_2/bgLine.png"},
            {id:"centerCir", type:"texture", url:"images/it_2/centerCir.png"},
            {id:"dotCir", type:"texture", url:"images/it_2/dotCir.png"},
            {id:"arrowCir", type:"texture", url:"images/it_2/arrowCir.png"},
            {id:"dateMC", type:"texture", url:"images/it_2/dateMC.png"},
            {id:"lightMC", type:"texture", url:"images/it_2/lightMC.png"},
            {id:"spark", type:"texture", url:"images/spark1.png"},
            {id:"sortNum_1", type:"texture", url:"images/num/num_1.png"},
            {id:"sortNum_2", type:"texture", url:"images/num/num_2.png"},
            {id:"sortNum_3", type:"texture", url:"images/num/num_3.png"},
            {id:"sortNum_4", type:"texture", url:"images/num/num_4.png"},
            {id:"sortNum_5", type:"texture", url:"images/num/num_5.png"},
            {id:"sortNum_6", type:"texture", url:"images/num/num_6.png"},
            {id:"sortNum_7", type:"texture", url:"images/num/num_7.png"},
            {id:"sortNum_8", type:"texture", url:"images/num/num_8.png"}
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
        var apiUrl = "http://data.jd.com/digitalBUData?type=api7_39d38582_77fe_4b21_8d37_eecff2b73e8a";
        this.dataTool = new jd.DataTool(apiUrl,true);
        this.dataTool.eventDispatcher.bind("updateData",function(e,ary,sum){
            //scope3["component3"].update(ary);
            cur.dataUpdate(ary,sum);
        });
    };

    p.dataUpdate = function(ary,sum)
    {
        //this.numItemUpdate(ary);
        this.logoUpdate(ary);
        this.titleSumUpdate(sum);
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
        this.camera = new THREE.PerspectiveCamera( 40, width / height, 1, 3000 );
        this.camera.position.set(0, 0, 1300);
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
        //this.createLineShaderMaterial();
        this.createBox();
        this.boxAppear();
        this.createInnerParticle();
        this.innerParticleAppear();
        this.createBgParticle();
        this.createBgLine();
        this.bgLineAppear();
        this.createBgCir();
        this.bgCirAppear();
        //this.createLightLine();
        //this.createNum();
       // this.numAppear();
        //this.createNumLine();
       // this.numLineAppear();
        this.createSortNum();
        this.sortNumAppear();
        this.createLogo();
        this.createTitleSum();
    };

    p.render = function()
    {
        if(this.renderer)
        {
            //this.container.rotation.y +=0.01;
            this.innerParticleRender();
            this.bgParticleRender();
            this.bgCirRender();
            this.lightRender();
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
        this.container.position.y = -100;
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
        this.title.position.y = 330;
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

    p.createLineShaderMaterial = function()
    {
        this.lineShaderMaterial = new THREE.ShaderMaterial( {
            uniforms: {
                color:    { type: "c", value: new THREE.Color( 0xffffff ) },
                opacity:  { type: "f", value: 1 }
            },
            vertexShader:   document.getElementById( 'lineVShader' ).textContent,
            fragmentShader: document.getElementById( 'lineFragmentShader' ).textContent,
            /*blending:       THREE.AdditiveBlending,*/
            depthTest:      false,
            transparent:    true
        });
    };
    /*-------------------------------------------------- title end--------------------------------------------------*/

    /*------------------------------------------------ box  start --------------------------------------------------*/
    p.createArc = function()
    {
        var vs =[];
        var totalAngle = 30*(Math.PI/180);
        var angleSegments = 30;
        var r = 220;
        var rSegments = 50;
        var d =1;
        var dSegments = 1;
        for(var i =0;i<angleSegments;i++)
        {
            var angle = (i/angleSegments)*totalAngle;
            for(var j=0;j<rSegments;j++)
            {
                for(k=0; k<dSegments; k++)
                {
                    var R = r*(j/rSegments);
                    if((i==0 || i ==angleSegments-1) || j==rSegments-1 )
                    {
                        var D = (k/dSegments)*d;
                        vs.push(new THREE.Vector3(R*Math.cos(angle),R*Math.sin(angle),D));
                    }
                }
            }
        }
        console.log(vs);
        return vs;
    };

    p.createBox = function()
    {
        this.boxAry = [];
        this.boxContainer = new THREE.Object3D();
        this.container.add(this.boxContainer);
        //this.boxContainer.rotation.x = 0.15;
        //
        for(var i =0; i<this.topNum; i++)
        {
            var box = this.createBoxItem(this.createArc());
            this.boxContainer.add(box);
            this.boxAry.push(box);
            //box.rotation.z = 110*(Math.PI/180);
            box.rotation.z =340*(Math.PI/180);
            var s = (1-i*0.05);
            box.scale.set(s,s,1);
            box.userData["endRotation"]=(110+i*30)*(Math.PI/180);
        }
    };

    p.createBoxItem = function(vs)
    {
        var pointNum = vs.length;
        var geometry = new THREE.BufferGeometry();
        //
        var positionAry = new Float32Array(pointNum*3);
        var colorAry = new Float32Array(pointNum*3);
        var opacityAry = new Float32Array( pointNum );
        var sizeAry = new Float32Array( pointNum );
        //
        var color = new THREE.Color( 0xde3ed4 );
        //
        var i = pointNum;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            positionAry[i3] = vs[i]["x"];
            positionAry[i3+1] = vs[i]["y"];
            positionAry[i3+2] = vs[i]["z"];
            //
            opacityAry[i] = 0.8;
            sizeAry[i] = 3;
            color.toArray( colorAry, i * 3 );
        }
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positionAry, 3 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colorAry, 3 ) );
        geometry.addAttribute( 'customOpacity', new THREE.BufferAttribute( opacityAry, 1 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizeAry, 1 ) );
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
        var delayTime = (this.topNum-i)*0;
        TweenLite.to(box.rotation, 1.6, { delay:delayTime, z:box.userData["endRotation"]});
        /*TweenLite.to(box.scale, 1.5, { delay:delayTime, y:box.userData["scaleY"],onCompleteScope:this, onComplete:function(){
            //this.innerParticleItemAry[i].visible = true;
            this.innerParticleItemAppear(this.innerParticleItemAry[i]);
        }});*/
    };
    /*-------------------------------------------------- box  end  --------------------------------------------------*/

    /*--------------------------------------------- innerParticle  start  ----------------------------------------------*/
    p.createInnerParticle = function()
    {
        this.innerParticleItemAry =[];
        for(var i =0; i<this.topNum; i++)
        {
            var innerParticle = this.createInnerParticleItem(220*(1-i*0.05));
            this.boxContainer.add(innerParticle);
            this.innerParticleItemAry.push(innerParticle);
            innerParticle.rotation.z = (110+i*30)*(Math.PI/180);
        }
        //this.boxPContainer.visible =false;
    };

    p.createInnerParticleItem = function(r)
    {
        var particleNum = 800;
        var positionAry = new Float32Array(particleNum*3);
        var colorAry = new Float32Array(particleNum*3);
        var rAry = new Float32Array( particleNum );
        var angleAry = new Float32Array( particleNum );
        var angleVAry = new Float32Array( particleNum );
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
            rAry[i] = 30+(r-30)*Math.random()-5;
            angleAry[i] = 30*(Math.PI/180);
            //angleVAry[i] = -0.5*(Math.random()*0.005+0.005);
            angleVAry[i] =0
            positionAry[i3] = rAry[i]*Math.cos(angleAry[i]);
            positionAry[i3+1] = rAry[i]*Math.sin(angleAry[i]);
            //opacityAry[i] = 0.5+0.5*Math.random();
            opacityAry[i] = 0;
            sizeAry[i] = Math.random()*2+1;
            color.toArray( colorAry, i * 3 );
        }
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positionAry, 3 ) );
        geometry.addAttribute( 'r', new THREE.BufferAttribute( rAry,1) );
        geometry.addAttribute( 'angle', new THREE.BufferAttribute( angleAry,1) );
        geometry.addAttribute( 'angleV', new THREE.BufferAttribute( angleVAry,1) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colorAry, 3 ) );
        geometry.addAttribute( 'customOpacity', new THREE.BufferAttribute( opacityAry, 1 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizeAry, 1 ) );
        //
        var particles = new THREE.Points( geometry, this.particleMaterial );
        geometry.attributes.position.needsUpdate = true;
        return particles;
    };

    p.innerParticleAppear = function()
    {
        var ary = this.innerParticleItemAry;
        for(i=0; i<ary.length;i++)
        {
            this.innerParticleItemAppear(ary[i])
        }
    };

    p.innerParticleItemAppear = function(innerParticle)
    {
        var angleVAry = innerParticle.geometry.attributes.angleV.array;
        //
        var i = angleVAry.length;
        while(i>0)
        {
            i--;
            angleVAry[i] = -0.5*(Math.random()*0.005+0.005);
        }
    };

    p.innerParticleRender = function()
    {
        var ary = this.innerParticleItemAry;
        for(i=0; i<ary.length;i++)
        {
            this.innerParticleItemRender(ary[i]);
        }
    };

    p.innerParticleItemRender = function(innerParticle)
    {
        var positionAry = innerParticle.geometry.attributes.position.array;
        var rAry = innerParticle.geometry.attributes.r.array;
        var angleAry = innerParticle.geometry.attributes.angle.array;
        var angleVAry = innerParticle.geometry.attributes.angleV.array;
        var opacityAry = innerParticle.geometry.attributes.customOpacity.array;
        //
        var i = rAry.length;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            if(angleAry[i] < 0)
            {
                angleAry[i] = 30*(Math.PI/180);
                opacityAry[i] = 0.5+0.5*Math.random();
            }
            angleAry[i] += angleVAry[i];
            positionAry[i3] = rAry[i]*Math.cos(angleAry[i]);
            positionAry[i3+1] = rAry[i]*Math.sin(angleAry[i]);
        }
        innerParticle.geometry.attributes.position.needsUpdate = true;
        innerParticle.geometry.attributes.customOpacity.needsUpdate = true;
    };
    /*--------------------------------------------- innerParticle  end  ----------------------------------------------*/

    /*---------------------------------------------- bgParticle start-----------------------------------------------*/
    p.createBgParticle = function(id)
    {
        var particleNum = 2000;
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
            positionAry[i3+2] = -4000*(Math.random());
            //
            vYAry[i] = 4*Math.random()+2;
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
                positionAry[i3+2] = -3000;
            }
        }
        this.bgParticle.geometry.attributes.position.needsUpdate = true;
        this.bgParticle.geometry.attributes.customOpacity.needsUpdate = true;
        this.bgParticle.geometry.attributes.customColor.needsUpdate = true;
        this.bgParticle.geometry.attributes.size.needsUpdate = true;
    };
    /*---------------------------------------------- bgParticle end-----------------------------------------------*/

    /*------------------------------------------------ bgCir start-----------------------------------------------*/
    p.createBgCir = function()
    {
        this.createCenterCir();
        this.createDotCir();
        this.createArrowCir();
        this.createDateMC();
        this.creteLightMC();
    };
    p.bgCirAppear = function()
    {
        TweenLite.to(this.centerCir.material, 2, { delay:1, opacity:1});
        TweenLite.to(this.dotCir.material, 2, { delay:1, opacity:1});
        //
        TweenLite.to(this.arrowCir.rotation, 1, { delay:1.5, z:0});
        TweenLite.to(this.arrowCir.material, 1, { delay:1, opacity:1});
        //
        TweenLite.to(this.dateMC.position, 1.5, { delay:1.5, x:180});
        TweenLite.to(this.dateMC.material, 1.5, { delay:1.5, opacity:1});
    };
    p.bgCirRender = function()
    {
        this.dotCir.rotation.z += -0.002;
    };
    p.createCenterCir = function()
    {
        var texture = this.resourcesMap["centerCir"]["result"];
        var w = texture.image.width;
        var h = texture.image.height;
        var geometry = new THREE.PlaneGeometry( w, h, 5,5 );
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0/*,alphaMap:map*/, side: THREE.DoubleSide,transparent:true,depthTest:false } );
        this.centerCir = new THREE.Mesh( geometry, material );
        this.container.add( this.centerCir );
        this.centerCir.position.z = 10;
    };

    p.createDotCir = function()
    {
        var texture = this.resourcesMap["dotCir"]["result"];
        var w = texture.image.width;
        var h = texture.image.height;
        var geometry = new THREE.PlaneGeometry( w, h, 5,5 );
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0/*,alphaMap:map*/, side: THREE.DoubleSide,transparent:true,depthTest:false } );
        this.dotCir = new THREE.Mesh( geometry, material );
        this.container.add( this.dotCir );
        this.dotCir.position.y = -0;
    };
    p.createArrowCir = function()
    {
        var texture = this.resourcesMap["arrowCir"]["result"];
        var w = texture.image.width;
        var h = texture.image.height;
        var geometry = new THREE.PlaneGeometry( w, h, 5,5 );
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0/*,alphaMap:map*/, side: THREE.DoubleSide,transparent:true,depthTest:false } );
        this.arrowCir = new THREE.Mesh( geometry, material );
        this.container.add( this.arrowCir );
        this.arrowCir.rotation.z = -1;
    };
    p.createDateMC = function()
    {
        var texture = this.resourcesMap["dateMC"]["result"];
        var w = texture.image.width;
        var h = texture.image.height;
        var geometry = new THREE.PlaneGeometry( w, h, 5,5 );
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0/*,alphaMap:map*/, side: THREE.DoubleSide,transparent:true,depthTest:false } );
        this.dateMC = new THREE.Mesh( geometry, material );
        this.container.add( this.dateMC );
        this.dateMC.position.x =100;
        this.dateMC.position.y =10;
    };

    p.creteLightMC = function()
    {
        var texture = this.resourcesMap["lightMC"]["result"];
        var w = texture.image.width;
        var h = texture.image.height;
        var geometry = new THREE.PlaneGeometry( w, h, 5,5 );
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0/*,alphaMap:map*/, side: THREE.DoubleSide,transparent:true,depthTest:false } );
        this.lightMC = new THREE.Mesh( geometry, material );
        this.container.add( this.lightMC );
        //
        this.lightAppear();
    };

    p.lightAppear = function()
    {
        TweenLite.to(this.lightMC.material, 1.5, { delay:4, opacity:0.8});
    };

    p.lightRender = function()
    {
        this.lightMC.rotation.z -=0.015;
    };
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
        this.bgLine.position.y = -0;
    };

    p.bgLineAppear = function()
    {
        TweenLite.to(this.bgLine.material, 2, { delay:1, opacity:1});
    };
    /*------------------------------------------------- bgLine end-------------------------------------------------*/

    /*---------------------------------------------- lightLine start-----------------------------------------------*/
    p.createLightLine = function()
    {
        var num = 100;
        this.lightLineAry =[];
        for(var i=0;i<num;i++)
        {
            var line = this.createLightLineItem(50+i*1.5);
            this.container.add(line);
            this.lightLineAry.push(line);
            line.userData["opacity"] = 0;
            var mid = num/2;
            if(i < mid) line.userData["endOpacity"] = i*0.005;
            if(i >= mid) line.userData["endOpacity"] = ((num-1)-i)*0.005;
            if(line.userData["endOpacity"] > 0.2) line.userData["endOpacity"] = 0.2;
        }
        var cur = this;
        setInterval(function(){
            cur.lightRun();
        },4500);
    };

    p.createLightLineItem = function(r)
    {
        var num = 50;
        var positionAry = new Float32Array(num*3);
        var colorAry = new Float32Array(num*3);
        var opacityAry = new Float32Array(num);
        var i =num;
        var i3 = positionAry.length;
        //var color = new THREE.Color( 0xde3ed4 );
        var color = new THREE.Color( 0xffffff );
        while(i3>0)
        {
            i--;
            i3 -=3;
            var angle = (i/num)*((1+1/num)*2*Math.PI);
            var posX =r*Math.cos(angle);
            var posZ = 0;
            var posY = r*Math.sin(angle);
            //
            positionAry[i3] = posX;
            positionAry[i3+1] = posY;
            positionAry[i3+2] = posZ;
            //
            opacityAry[i] = 0.2;
            color.toArray( colorAry, i * 3 );
        }
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positionAry, 3 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colorAry, 3 ) );
        geometry.addAttribute( 'customOpacity', new THREE.BufferAttribute( opacityAry, 1 ) );
        var line = new THREE.Line( geometry, this.lineShaderMaterial );
        return line;
    };
    p.lightRun = function()
    {
        var ary = this.lightLineAry;
        for(var i=0; i<ary.length; i++)
        {
            var line = ary[i]
            TweenLite.to(line.userData, 0.5, { delay:i*0.004, opacity:line.userData["endOpacity"]});
            TweenLite.to(line.userData, 0.5, { delay:i*0.004+0.5, opacity:0});
        }
    };

    p.lightLineRender = function()
    {
        var ary = this.lightLineAry;
        for(var i=0; i<ary.length; i++)
        {
            this.lightLineItemRender(ary[i]);
        }
    };

    p.lightLineItemRender = function(lightLine)
    {
        var positionAry = lightLine.geometry.attributes.position.array;
        var opacityAry = lightLine.geometry.attributes.customOpacity.array;
        var i = opacityAry.length;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            opacityAry[i] = lightLine.userData["opacity"];
        }
        lightLine.geometry.attributes.position.needsUpdate = true;
        lightLine.geometry.attributes.position.needsUpdate = true;
        lightLine.geometry.attributes.customOpacity.needsUpdate = true;
    };
    /*---------------------------------------------- lightLine end-----------------------------------------------*/

    /*------------------------------------------------- titleSum start------------------------------------------------*/
    p.createTitleSum = function()
    {
        var canvas = document.createElement( 'canvas' );
        canvas.width = 256;
        canvas.height =64;
        this.titleSumContext = canvas.getContext('2d');
        this.titleSumContext.textAlign ="center";
        this.titleSumContext.font = "Bold 55px Arial";
        /*this.titleSumContext.fillStyle = "rgba(255,0,0,0.5)";
         this.titleSumContext.fillRect(0,0,canvas.width,canvas.height);*/
        this.titleSumContext.fillStyle='#d3233b';
        this.titleSumContext.fillText("0", 128,45);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        var material = new THREE.SpriteMaterial( { map:texture } );
        //var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0, side: THREE.DoubleSide,transparent:true } );
        this.titleSum = new THREE.Sprite( material );
        this.titleScene.add(this.titleSum);
        this.titleSum.scale.set( canvas.width, canvas.height, 1 );
        this.titleSum.position.set(335,360,0);
    };

    p.titleSumUpdate = function(sum)
    {
        this.titleSumContext.clearRect(0,0,256,64);
        /*this.titleSumContext.fillStyle = "rgba(255,0,0,0.5)";
         this.titleSumContext.fillRect(0,0,256,64);*/
        this.titleSumContext.fillText(this.formatNum(sum["num"].toString()), 128,50);
        this.titleSum.material.map.needsUpdate = true;
    };
    /*------------------------------------------------- titleSum end------------------------------------------------*/

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

    /*p.numAppear = function()
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
    };*/
    /*---------------------------------------------------- num end--------------------------------------------------*/

    /*--------------------------------------------------- numLine start-----------------------------------------------*/
    /*p.createNumLine = function()
    {
        this.numLineAry =[];
        for(var i=0;i<this.showNum;i++)
        {
            var numLineItem = this.createNumLineItem();
            this.boxContainer.add(numLineItem);
            this.numLineAry.push(numLineItem);
            numLineItem.position.x = i*this.space;
            numLineItem.position.y = 290;
            numLineItem.userData["endY"] =330;
        }
    };

    p.createNumLineItem = function()
    {
        var texture = this.resourcesMap["numLine"]["result"];
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0, color:0xde3ed4,transparent:true, /!*blending:THREE.AdditiveBlending,*!/ depthTest:false} );
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
    };*/
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
            var angle = (110+i*30+15)*(Math.PI/180);
            sortNumItem.position.set(260*Math.cos(angle),260*Math.sin(angle)+30,0);
            //sortNumItem.userData["endY"] =-80;
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
        var delayTime = (this.topNum-i)*0.2;
        TweenLite.to(sortNumItem.material, 2, { delay:delayTime, opacity:1});
        //TweenLite.to(sortNumItem.position, 1, { delay:delayTime,y:sortNumItem.userData["endY"]});
    };
    /*--------------------------------------------------- sortNum end-----------------------------------------------*/

    /*-------------------------------------------------- logo start--------------------------------------------------*/
    p.createLogo = function()
    {
        this.logoGeometry = new THREE.PlaneGeometry( 110, 30, 5,5 );
        //
        this.logoContainerAry =[];
        for(var i=0;i<this.topNum;i++)
        {
            var logoContainer = new THREE.Object3D();
            this.boxContainer.add(logoContainer);
            var angle = (110+i*30+15)*(Math.PI/180);
            logoContainer.position.set(260*Math.cos(angle),260*Math.sin(angle),0);
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
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0, color:0xde3ed4,transparent:true, blending:THREE.AdditiveBlending, depthTest:false} );
        var logo = new THREE.Mesh(this.logoGeometry,material);
        logo.rotation.y = 0.7*Math.PI;
        var delayTime =0;
        if(container.children.length == 0)
        {
            var i = container.userData["id"];
            delayTime= (this.topNum-i)*0.2+2.5;
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
    jd.It_2 = It_2;
})();