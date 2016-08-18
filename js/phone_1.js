this.jd = this.jd||{};
(function(){
    var Phone_1 = function()
    {
        this.init();
    };

    var p = Phone_1.prototype;

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
            {id:"title", type:"texture", url:"images/phone_1/title.png"},
            {id:"dotCir", type:"texture", url:"images/phone_1/dotCir.png"},
            {id:"arrowCir", type:"texture", url:"images/phone_1/arrowCir.png"},
            {id:"dateMC", type:"texture", url:"images/phone_1/dateMC.png"},
            {id:"spark", type:"texture", url:"images/spark1.png"}
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
        var apiUrl = "http://data.jd.com/digitalBUData?type=api2_bbcb7456_8612_4a08_b929_39144be56a6f";
        this.dataTool = new jd.DataTool_sum(apiUrl);
        this.dataTool.eventDispatcher.bind("updateData",function(e,sum){
            //scope3["component3"].update(ary);
            cur.dataUpdate(sum);
        });
    };

    p.dataUpdate = function(sum)
    {
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
        this.camera = new THREE.PerspectiveCamera( 30, width / height, 1, 5000 );
        this.camera.position.set(0, 0, 1600);
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
        this.createHillParticle();
        this.createBgParticle();
        this.createCir();
        this.createTitleSum();
    };

    p.render = function()
    {
        if(this.renderer)
        {
            this.container.rotation.y +=0.003;
            this.hillParticleRender();
            this.bgParticleRender();
            this.cirRender();
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
        //this.container.position.x = -100;
        this.container.position.y = -400;
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


    /*--------------------------------------------- hillParticle   start  ----------------------------------------------*/
    p.createHillParticle = function()
    {
        this.createHillInfo();
        //
        var particleNum = this.itemAry.length;
        var positionAry = new Float32Array(particleNum*3);
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
            positionAry[i3] = this.itemVAry[i].x;
            positionAry[i3+1] = this.itemVAry[i].y;
            positionAry[i3+2] = this.itemVAry[i].z;
            //
            opacityAry[i] = 0.2+0.5*Math.random();
            sizeAry[i] = 4*Math.random()+1;
            color.toArray( colorAry, i * 3 );
        }
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positionAry, 3 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colorAry, 3 ) );
        geometry.addAttribute( 'customOpacity', new THREE.BufferAttribute( opacityAry, 1 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizeAry, 1 ) );
        //
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.customOpacity.needsUpdate = true;
        //
        this.hillParticle = new THREE.Points( geometry, this.particleMaterial );
        this.container.add(this.hillParticle);
        this.hillParticle.scale.set(15,15,15);

    };

    p.createHillInfo = function()
    {
        var numParticlesPerGroup = 150;
        var numGroups = 60;
        var deltaAngle = DP / numParticlesPerGroup;

        this.itemVAry =[];
        this.itemAry =[];
        for (var i = 0; i < numGroups; i++) {
            for (var j = 0; j < numParticlesPerGroup; j++) {
                var v = new THREE.Vector3(0,0,0);
                var item = new WS.WavedMountainAnimator(v);
                item.t = - Math.random() * 3;
                item.a = j * deltaAngle;
                this.itemAry.push(item);
                this.itemVAry.push(v);
            }
        }
    };

    p.hillParticleRender = function()
    {
        this.hillInfoRender();
        var positionAry = this.hillParticle.geometry.attributes.position.array;
        var opacityAry = this.hillParticle.geometry.attributes.customOpacity.array;
        //
        var i = opacityAry.length;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            positionAry[i3] = this.itemVAry[i].x;
            positionAry[i3+1] = this.itemVAry[i].y;
            positionAry[i3+2] = this.itemVAry[i].z;
        }
        this.hillParticle.geometry.attributes.position.needsUpdate = true;
        this.hillParticle.geometry.attributes.customOpacity.needsUpdate = true;
        this.hillParticle.geometry.attributes.customColor.needsUpdate = true;
        this.hillParticle.geometry.attributes.size.needsUpdate = true;
    };

    p.hillInfoRender = function()
    {
        for (var i = 0; i < this.itemAry.length; i++)
        {
            this.itemAry[i].animate();
        }
    };

    /*------------------------------------------------ cir start-----------------------------------------------*/
    p.createCir = function()
    {
        this.cirContainer = new THREE.Object3D();
        this.scene.add(this.cirContainer);
        this.cirContainer.position.y = 50;
        //
        this.createDotCir();
        this.createArrowCir();
        this.createDateMC();
        //
        this.cirAppear();
    };
    p.cirAppear = function()
    {
        TweenLite.to(this.dotCir.material, 1, { delay:2, opacity:1});
        //
        TweenLite.to(this.arrowCir.rotation, 1, { delay:2.5, z:0});
        TweenLite.to(this.arrowCir.material, 1, { delay:2, opacity:1});
        //
        TweenLite.to(this.dateMC.position, 1.5, { delay:3.5, x:-200});
        TweenLite.to(this.dateMC.material, 1.5, { delay:3.5, opacity:1});
    };
    p.cirRender = function()
    {
        this.dotCir.rotation.z += -0.002;
    };

    p.createDotCir = function()
    {
        var texture = this.resourcesMap["dotCir"]["result"];
        var w = texture.image.width;
        var h = texture.image.height;
        var geometry = new THREE.PlaneGeometry( w, h, 5,5 );
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0/*,alphaMap:map*/, side: THREE.DoubleSide,transparent:true,depthTest:false } );
        this.dotCir = new THREE.Mesh( geometry, material );
        this.cirContainer.add( this.dotCir );
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
        this.cirContainer.add( this.arrowCir );
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
        this.cirContainer.add( this.dateMC );
        this.dateMC.position.x =0;
        this.dateMC.position.y =5;
    };
    /*------------------------------------------------- cir end   ------------------------------------------------*/

    /*------------------------------------------------- titleSum start------------------------------------------------*/
    p.createTitleSum = function()
    {
        var canvas = document.createElement( 'canvas' );
        canvas.width = 512;
        canvas.height =64;
        this.titleSumContext = canvas.getContext('2d');

        this.titleSumContext.shadowBlur=12;
        this.titleSumContext.shadowColor="rgba(255,0,0,0.8)";
        this.titleSumContext.textAlign ="left";
        this.titleSumContext.font = "Bold 70px Arial";
        this.titleSumContext.fillStyle='#FFFFFF';
        this.titleSumContext.fillText("0", 10,55);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        var material = new THREE.SpriteMaterial( { map:texture,opacity:0 } );
        this.titleSum = new THREE.Sprite( material );
        this.cirContainer.add(this.titleSum);
        this.titleSum.scale.set( canvas.width, canvas.height, 1 );
        this.titleSum.position.set(50,0,0);
        //
        this.titleSumAppear();
    };

    p.titleSumAppear = function()
    {
        TweenLite.to(this.titleSum.position, 1, { delay:4, x:100});
        TweenLite.to(this.titleSum.material, 1, { delay:4, opacity:1});
    };

    p.titleSumUpdate = function(sum)
    {
        this.titleSumContext.clearRect(0,0,512,64);
        /*this.titleSumContext.fillStyle = "rgba(255,0,0,0.5)";
        this.titleSumContext.fillRect(0,0,512,64);*/
        this.titleSumContext.fillText(this.formatNum(sum["num"].toString()), 128,55);
        this.titleSum.material.map.needsUpdate = true;
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
    /*------------------------------------------------- titleSum end------------------------------------------------*/
    
    /*--------------------------------------------- hillParticle  end  ----------------------------------------------*/

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
            positionAry[i3] = 3000*(Math.random()-0.5);
            positionAry[i3+1] = 2000*(Math.random()-0.5);
            positionAry[i3+2] = -5000*(Math.random());
            //
            vYAry[i] = 6*Math.random()+3;
            opacityAry[i] = 0.2+0.5*Math.random();
            sizeAry[i] = 3*Math.random()+2;
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


    //=================================================   threejs    end ==============================================//
    jd.Phone_1 = Phone_1;
})();