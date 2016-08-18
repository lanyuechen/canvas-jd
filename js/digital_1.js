this.jd = this.jd||{};
(function(){
    var Digital_1 = function()
    {
        this.init();
    };

    var p = Digital_1.prototype;
    p.topNum = 5;
    p.showNum = 5;
    p.space = 65;

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
            {id:"title", type:"texture", url:"images/digital_1/title.png"},
            {id:"bgLine", type:"texture", url:"images/it_1/bgLine.png"},
            {id:"numLine", type:"texture", url:"images/it_1/numLine.png"},
            {id:"cuboid", type:"js", url:"model/jinzita.js"},
            {id:"dateMC", type:"texture", url:"images/digital_1/dateMC.png"},
            {id:"spark", type:"texture", url:"images/spark1.png"},
            {id:"sortNum_1", type:"texture", url:"images/num/num_1.png"},
            {id:"sortNum_2", type:"texture", url:"images/num/num_2.png"},
            {id:"sortNum_3", type:"texture", url:"images/num/num_3.png"},
            {id:"sortNum_4", type:"texture", url:"images/num/num_4.png"},
            {id:"sortNum_5", type:"texture", url:"images/num/num_5.png"}
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
        var apiUrl = "http://data.jd.com/digitalBUData?type=api8_eb83b8ec_450d_411a_ab63_05e0193cc01e";
        this.dataTool = new jd.DataTool(apiUrl,true);
        this.dataTool.eventDispatcher.bind("updateData",function(e,ary,sum){
            //scope3["component3"].update(ary);
            cur.dataUpdate(ary,sum);
        });
    };

    p.dataUpdate = function(ary,sum)
    {
        this.numItemUpdate(ary);
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
        this.camera = new THREE.PerspectiveCamera( 20, width / height, 1, 5000 );
        this.camera.position.set(0, 230, 2500);
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
        this.createLineShaderMaterial();
        this.createPyramid();
        this.pyramidAppear();
        this.createInnerParticle();
        this.createBgParticle();
        this.createItem();
        this.itemAppear();
        this.createRecLine();
        this.recLineAppear();
        //this.createBgLine();
        //this.bgLineAppear();
        this.createNum();
        this.numAppear();
        //this.createNumLine();
        //this.numLineAppear();
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
            this.pyramidRender();
            this.recLineRender();
            this.lightLineRender();
            this.bgParticleRender();
            //this.pyramid.rotation.x+=0.01;
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
    //
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

    /*------------------------------------------------ 金字塔pyramid  start --------------------------------------------------*/
    //假设导入的金字塔模型的底边长为boxD、长主体的高度为boxH
    p.boxD = 380;
    p.boxH = 400;
    p.createPyramid = function()
    {
        //金字塔的最高点
        this.topV = new THREE.Vector3(0,this.boxH,0);
        //
        var vs = this.resourcesMap["cuboid"]["result"].vertices;
        var pointNum = vs.length;
        var geometry = new THREE.BufferGeometry();
        //
        var positionAry = new Float32Array(pointNum*3);
        var colorAry = new Float32Array(pointNum*3);
        var opacityAry = new Float32Array( pointNum );
        var sizeAry = new Float32Array( pointNum );
        //
        var color = new THREE.Color( 0xd01a27 );
        //
        var i = pointNum;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            positionAry[i3] = vs[i]["x"]*2.5;
            positionAry[i3+1] = vs[i]["y"]*2;
            positionAry[i3+2] = vs[i]["z"]*2.5;
            //
            opacityAry[i] = 0.5;
            sizeAry[i] = 3;
            color.toArray( colorAry, i * 3 );
        }
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positionAry, 3 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colorAry, 3 ) );
        geometry.addAttribute( 'customOpacity', new THREE.BufferAttribute( opacityAry, 1 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizeAry, 1 ) );
        //
        geometry.attributes.position.needsUpdate = true;
        this.pyramid = new THREE.Points( geometry, this.particleMaterial );
        this.container.add(this.pyramid);
        this.pyramid.userData["opacity"] = 0;
        this.container.rotation.y = 180*(Math.PI/180);
    };

    p.pyramidAppear = function()
    {
        TweenLite.to(this.pyramid.scale, 2, { delay:0, y:1});
        TweenLite.to(this.container.rotation, 2, { delay:0.5, y:45*(Math.PI/180)});
        TweenLite.to(this.pyramid.userData, 2, { delay:0.5, opacity:0.8});
    };

    p.pyramidRender = function()
    {
        var positionAry = this.pyramid.geometry.attributes.position.array;
        var opacityAry = this.pyramid.geometry.attributes.customOpacity.array;
        //
        var i = opacityAry.length;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            opacityAry[i] = this.pyramid.userData["opacity"];
        }
        this.pyramid.geometry.attributes.position.needsUpdate = true;
        this.pyramid.geometry.attributes.customOpacity.needsUpdate = true;
        this.pyramid.geometry.attributes.customColor.needsUpdate = true;
        this.pyramid.geometry.attributes.size.needsUpdate = true;
    };

    /*-------------------------------------------------- 金字塔pyramid  end  --------------------------------------------------*/

    /*--------------------------------------------- innerParticle  start  ----------------------------------------------*/
    p.createInnerParticle = function()
    {
        var particleNum = 4000;
        var positionAry = new Float32Array(particleNum*3);
        var startPosAry = new Float32Array(particleNum*3);
        var colorAry = new Float32Array(particleNum*3);
        var vAry = new Float32Array(particleNum*3);
        var opacityAry = new Float32Array( particleNum );
        var sizeAry = new Float32Array( particleNum );

        var color = new THREE.Color( 0xd01a27 );
        //var topV = new THREE(0,this)
        //
        var i = particleNum;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            positionAry[i3] = this.boxD*(Math.random()-0.5);
            positionAry[i3+1] = 0*this.boxH*Math.random();
            positionAry[i3+2] = this.boxD*(Math.random()-0.5);
            //
            startPosAry[i3] = positionAry[i3];
            startPosAry[i3+1] = positionAry[i3+1];
            startPosAry[i3+2] = positionAry[i3+2];
            //
            var vector3 = new THREE.Vector3(positionAry[i3],positionAry[i3+1]-this.boxH, positionAry[i3+2]);
            var n = vector3.normalize();
            var random = 2*Math.random()+1;
            //加快出现的时间
            vAry[i3] = -n.x*random;
            vAry[i3+1] = -n.y*random;
            vAry[i3+2] = -n.z*random;
            //vYAry[i] = 0;
            opacityAry[i] = 0;
            sizeAry[i] = Math.random()*3+1;
            color.toArray( colorAry, i * 3 );
        }
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positionAry, 3 ) );
        geometry.addAttribute( 'startPos', new THREE.BufferAttribute( startPosAry, 3 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colorAry, 3 ) );
        geometry.addAttribute( 'v', new THREE.BufferAttribute( vAry, 3 ) );
        geometry.addAttribute( 'customOpacity', new THREE.BufferAttribute( opacityAry, 1 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizeAry, 1 ) );
        //
        //geometry.attributes.position.needsUpdate = true;
        //
        this.innerParticle = new THREE.Points( geometry, this.particleMaterial );
        this.container.add(this.innerParticle);
    };

    p.innerParticleRender = function()
    {
        var positionAry = this.innerParticle.geometry.attributes.position.array;
        var startPosAry = this.innerParticle.geometry.attributes.startPos.array;
        var vAry = this.innerParticle.geometry.attributes.v.array;
        var opacityAry = this.innerParticle.geometry.attributes.customOpacity.array;
        //
        var i = opacityAry.length;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            //positionAry[i3] = d*(Math.random()-0.5);
            positionAry[i3] += vAry[i3];
            positionAry[i3+1] += vAry[i3+1];
            positionAry[i3+2] += vAry[i3+2];
            //最高点
            if(positionAry[i3+1]>this.boxH*0.75)
            //var vector3 = new THREE.Vector3(positionAry[i3],positionAry[i3+1],positionAry[i3+2]);
           // if(vector3.distanceTo(this.topV)<30)
            {
                opacityAry[i] -=0.02;
            }
            if(positionAry[i3+1] >= this.boxH)
            //if(vector3.distanceTo(this.topV) <= 10)
            {
                positionAry[i3] = startPosAry[i3];
                positionAry[i3+1] = startPosAry[i3+1];
                positionAry[i3+2] = startPosAry[i3+2];
                opacityAry[i] = Math.random()*0.5+0.5;
            }
            //positionAry[i3+2] = d*(Math.random()-0.5);
        }
        this.innerParticle.geometry.attributes.position.needsUpdate = true;
        this.innerParticle.geometry.attributes.customOpacity.needsUpdate = true;
        this.innerParticle.geometry.attributes.customColor.needsUpdate = true;
        this.innerParticle.geometry.attributes.size.needsUpdate = true;
    };
    /*--------------------------------------------- innerParticle  end  ----------------------------------------------*/

    /*---------------------------------------------- bgParticle start-----------------------------------------------*/
    p.createBgParticle = function(id)
    {
        var particleNum = 1500;
        var positionAry = new Float32Array(particleNum*3);
        var vYAry = new Float32Array(particleNum);
        var colorAry = new Float32Array(particleNum*3);
        var opacityAry = new Float32Array( particleNum );
        var sizeAry = new Float32Array( particleNum );

        var color = new THREE.Color( 0xd01a27 );
        //
        var i = particleNum;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            //
            positionAry[i3] = 2000*(Math.random()-0.5);
            positionAry[i3+1] = 1500*(Math.random()-0.5);
            positionAry[i3+2] = -5000*(Math.random());
            //
            vYAry[i] = 5*Math.random()+4;
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

    /*------------------------------------------------- item start-------------------------------------------------*/
    p.createItem = function()
    {
        this.itemContainer = new THREE.Object3D();
        this.scene.add(this.itemContainer);
        this.itemContainer.rotation.y = (180-45)*(Math.PI/180);
        //
        this.itemAry =[];
        for(var i=0;i<this.topNum;i++)
        {
            var item = new THREE.Object3D();
            this.itemContainer.add(item);
            this.itemAry.push(item);
            item.position.y = 0;
            item.userData["endY"] = this.boxH-100-i*this.space;
        }
    };

    p.itemAppear = function()
    {
        TweenLite.to(this.itemContainer.rotation, 2, { delay:0.5, y:0});
        //
        var ary =this.itemAry;
        for(var i=0;i<ary.length;i++)
        {
            var delayTime = (1-i*0.02);
            var item = ary[i]
            TweenLite.to(item.position, 2, { delay:delayTime, y:item.userData["endY"]});
        }
    };

    /*------------------------------------------------- item end-------------------------------------------------*/

    /*------------------------------------------------- bgLine start-------------------------------------------------*/
    p.createRecLine = function()
    {
        this.recLineAry =[];
        for(var i=0;i<this.topNum;i++)
        {
            var line = this.createRecLineItem(150+i*60);
            this.container.add(line);
            line.position.y = 0;
            line.userData["opacity"] = 0;
            line.userData["endY"] = this.boxH-100-i*this.space;
            this.recLineAry.push(line);
        }
        this.createBottomRec();
        this.createLightLine();
    };

    p.recLineAppear = function()
    {
        var ary = this.recLineAry;
        for(var i=0; i<ary.length; i++)
        {
            this.recLineItemAppear(ary[i],i);
        }
    };

    p.recLineItemAppear = function(recLine,i)
    {
        var delayTime = (1-i*0.02);
        TweenLite.to(recLine.userData, 2, { delay:delayTime, opacity:0.1});
        TweenLite.to(recLine.position, 2, { delay:delayTime, y:recLine.userData["endY"]});
    };

    p.createRecLineItem = function(d)
    {
        var num = 5;
        var positionAry = new Float32Array(num*3);
        var colorAry = new Float32Array(num*3);
        var opacityAry = new Float32Array(num*1);
        //
        var color = new THREE.Color( 0xffffff );
        //
        var i =num;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            if(i==0)
            {
                positionAry[i3] = d/2;
                positionAry[i3+1] = 0;
                positionAry[i3+2] = d/2;
            }
            if(i==1)
            {
                positionAry[i3] = d/2;
                positionAry[i3+1] = 0;
                positionAry[i3+2] = -d/2;
            }
            if(i==2)
            {
                positionAry[i3] = -d/2;
                positionAry[i3+1] = 0;
                positionAry[i3+2] = -d/2;
            }
            if(i==3)
            {
                positionAry[i3] = -d/2;
                positionAry[i3+1] = 0;
                positionAry[i3+2] = d/2;
            }
            if(i==4)
            {
                positionAry[i3] = d/2;
                positionAry[i3+1] = 0;
                positionAry[i3+2] = d/2;
            }
            opacityAry[i] = 0.1;
            color.toArray( colorAry, i * 3 );
        }
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positionAry, 3 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colorAry, 3 ) );
        geometry.addAttribute( 'customOpacity', new THREE.BufferAttribute( opacityAry, 1 ) );
        var line = new THREE.Line( geometry, this.lineShaderMaterial );
        return line;
    };

    p.recLineRender = function()
    {
        var ary = this.recLineAry;
        for(var i=0; i<ary.length; i++)
        {
            this.recLineItemRender(ary[i])
        }
    };

    p.recLineItemRender = function(recLine)
    {
        var positionAry = recLine.geometry.attributes.position.array;
        var opacityAry = recLine.geometry.attributes.customOpacity.array;
        var i = opacityAry.length;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            opacityAry[i] = recLine.userData["opacity"];
        }
        recLine.geometry.attributes.position.needsUpdate = true;
        recLine.geometry.attributes.customOpacity.needsUpdate = true;
    };

    p.createBottomRec = function()
    {
        this.bottomLine1 = this.createRecLineItem(420);
        this.container.add(this.bottomLine1);
        //this.bottomLine1.position.y=-10;
        //
        this.bottomLine2 = this.createRecLineItem(550);
        this.container.add(this.bottomLine2);
        //this.bottomLine2.position.y=-10;
        //
        var texture = this.resourcesMap["dateMC"]["result"];
        var w = texture.image.width;
        var h = texture.image.height;
        var geometry = new THREE.PlaneGeometry( w, h, 5,5 );
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:1/*,alphaMap:map*/, side: THREE.DoubleSide,transparent:true,depthTest:false } );
        this.dateMC = new THREE.Mesh( geometry, material );
        this.container.add( this.dateMC );
        this.dateMC.position.set(-250,0,140);
        //this.dateMC.rotation.set(-90*(Math.PI/180),0*(Math.PI/180),-90*(Math.PI/180));
        this.dateMC.rotation.set(0*(Math.PI/180),-90*(Math.PI/180),0*(Math.PI/180));

        //this.dateMC.position.x =100;
        //this.dateMC.position.y =10;
    };
    /*------------------------------------------------- bgLine end-------------------------------------------------*/

    /*------------------------------------------------- lightLine start-------------------------------------------------*/
    p.createLightLine = function()
    {
        var num = 200;
        this.lightLineAry =[];
        for(var i=0;i<num;i++)
        {
            var line = this.createRecLineItem(380-i*1.89);
            this.container.add(line);
            this.lightLineAry.push(line);
            line.position.y =2*i;
            line.userData["opacity"] = 0;
        }
        //
        //this.lightLineRun();
        var cur = this;
        setInterval(function(){
            cur.lightLineRun();
        },5000);
    };

    p.lightLineRun = function()
    {
        var ary = this.lightLineAry;
        for(var i=0; i<ary.length; i++)
        {
            var line = ary[i]
            TweenLite.to(line.userData, 0.3, { delay:i*0.015, opacity:0.5});
            TweenLite.to(line.userData, 0.3, { delay:i*0.015+0.5, opacity:0});
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
        var colorAry = lightLine.geometry.attributes.customColor.array;
        var i = opacityAry.length;
        var i3 = positionAry.length;
        var color = new THREE.Color(0xd01a27);
        while(i3>0)
        {
            i--;
            i3 -=3;
            opacityAry[i] = lightLine.userData["opacity"];
            color.toArray( colorAry, i * 3 );
        }
        lightLine.geometry.attributes.position.needsUpdate = true;
        lightLine.geometry.attributes.customOpacity.needsUpdate = true;
        lightLine.geometry.attributes.customColor.needsUpdate = true;
    };

    /*------------------------------------------------- lightLine start-------------------------------------------------*/

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
        this.titleSum.position.set(310,355,0);
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

    /*--------------------------------------------------- num start--------------------------------------------------*/
    p.createNum = function()
    {
        this.numItemAry =[];
        this.contextAry =[];
        for(var i=0;i<this.showNum;i++)
        {
            var obj = this.createTxtMaterialItem();
            var numItem = this.createNumItem(obj["material"]);
            this.itemAry[i].add(numItem);
            this.numItemAry.push(numItem);
            numItem.position.x = 150+i*45;
            //numItem.position.y = -(20*i+20);
            //numItem.rotation.y = -45*(Math.PI/180)
            //;
            this.contextAry.push(obj["context"]);
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
        context.fillText("56465654", 64,20);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0, side: THREE.DoubleSide,transparent:true } );
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
        var delayTime = 2+(this.topNum-i)*0.1;
        TweenLite.to(numItem.material, 1.5, { delay:delayTime, opacity:1,onCompleteScope:this, onComplete:function(){

        }});
    };
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
            this.itemAry[i].add(sortNumItem);
            this.sortNumAry.push(sortNumItem);
            sortNumItem.position.x = -(220+i*45)-110;
            sortNumItem.userData["endX"] =-(230+i*45);
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
        TweenLite.to(sortNumItem.position, 1, { delay:delayTime,x:sortNumItem.userData["endX"]});
    };

    /*-------------------------------------------------- logo start--------------------------------------------------*/
    p.createLogo = function()
    {
        this.logoGeometry = new THREE.PlaneGeometry( 110, 30, 5,5 );
        //
        this.logoContainerAry =[];
        for(var i=0;i<this.topNum;i++)
        {
            var logoContainer = new THREE.Object3D();
            this.itemAry[i].add(logoContainer);
            logoContainer.position.set(-(160+i*45),0,0);
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
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0, color:0xd01a27,transparent:true, blending:THREE.AdditiveBlending, depthTest:false} );
        var logo = new THREE.Mesh(this.logoGeometry,material);
        logo.rotation.y = 0.7*Math.PI;
        var delayTime =0;
        if(container.children.length == 0)
        {
            var i = container.userData["id"];
            delayTime= (this.topNum-i)*0.2+3;
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
    jd.Digital_1 = Digital_1;
})();