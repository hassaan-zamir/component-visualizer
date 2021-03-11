$(document).ready(function() {

    //GLOBAL
    let objects = {
        '12-24\'': null,
        '26-30\'': null,
        'HeavyDuty': null,
    };


    let currentModel = '12-24\'';
    let renderer, scene, camera, controls, dragging;
    let wainscotRemoved = false;
    let currentWallColor = null;

    let data = {
        "roof": {
            "meshes_12-24'": [
                "Verticle_Trim_Main",
                "Roof_Sheeting",
                "Roof_Sheeting003",
                "ridgecap",
            ],
            "meshes_26-30'": [
                "Verticle_Trim_Main",
                "Roof_Sheeting",
                "Roof_Sheeting003",
                "ridgecap",
            ],
            "meshes_HeavyDuty": [
                "Verticle_Trim_Main",
                "Roof_Sheeting001",
                "Roof_Sheeting004",
                "Roof_Sheeting003",
                "ridgecap",
            ],
        },
        "trim": {
            "meshes_12-24'": [
                "CornerTrim",
                "Lean-to_Frame",
                "Windows#1",
                "Walk_in_door#1",
                "L-Trim",
                "Lean-to_Frame001",
                "Verticle_Trim_Main001",
                "Verticle_Trim_Lean-to001",
            ],
            "meshes_26-30'": [
                "CornerTrim",
                "Lean-to_Frame#2",
                "Windows#1",
                "Windows#4",
                "Walk_in_door#1",
                "L-Trim",
                "Lean-to_Frame001",
                "Verticle_Trim_Main002",
                "Verticle_Trim_Lean-to001"

            ],
            "meshes_HeavyDuty": [
                "CornerTrim",
                "Lean-to_Frame#2",
                "Window_Frameout002#1",
                "Window_Frameout001#1",
                "Window_Frameout003#1",
                "Window_Frameout004#1",
                "Window_Frameout005#1",
                "Window_Frameout_006#1",
                "DoorFrame001#1",
                "DoorFrame002#1",
                "L-Trim",
                "Lean-to_Frame001",
                "Verticle_Trim_Main001",
                "Verticle_Trim_Lean-to001",
            ],
        },
        "wall": {
            "meshes_12-24'": [
                "Plane.006_0",
                "Plane.006_2",
                "Plane.003_0",
                "Plane.003_2",
                "Plane.028_0",
                "Plane.028_2",
                "Plane.034_0",
                "Plane.034_2",
                "Leansheeting",
                "Gable_1",
                "Gable_2",
                "Leansheeting#2",
                "Plane.006_1",
                "Plane.003_1", ,
                "Plane.028_1",
                "Plane.034_1",
            ],
            "meshes_26-30'": [
                "Sheeting_Leftsample002#1",
                "Sheeting_Leftsample001#1",
                "Sheeting_Left#1",
                "Sheeting_Right#1",
                "Lean_Sheeting",
                "Gable_1",
                "Gable_2",
                "Lean_Sheeting#2",
                "Sheeting_Leftsample002#2",
                "Sheeting_Leftsample001#2",
                "Sheeting_Left#2",
                "Sheeting_Right#2"
            ],
            "meshes_HeavyDuty": [
                "Wall_Sheeting_Back#1",
                "Wall_Sheeting_Front#1",
                "Wall_Sheeting_Front#2",
                "Wall_Sheeting_Left#1",
                "Wall_Sheeting_Left#2",
                "Wall_Sheeting_Right#1",
                "Wall_Sheeting_Right#2",
                "Lean-to_Sheeting",
                "Wall_Sheeting_Back#2",
                "Wall_Sheeting_Front#2",
                "Wall_Sheeting_Left#2",
                "Wall_Sheeting_Right#2"
            ],
        },
        "wainscot": {
            "meshes_12-24'": [
                "Leansheeting#2",
                "Plane.006_1",
                "Plane.003_1", ,
                "Plane.028_1",
                "Plane.034_1",
            ],
            "meshes_26-30'": [
                "Lean_Sheeting#2",
                "Sheeting_Leftsample002#2",
                "Sheeting_Leftsample001#2",
                "Sheeting_Left#2",
                "Sheeting_Right#2"
            ],
            "meshes_HeavyDuty": [
                "Wall_Sheeting_Back#2",
                "Wall_Sheeting_Front#2",
                "Wall_Sheeting_Left#2",
                "Wall_Sheeting_Right#2"
            ],
        },
        "wainscotTrim": {
            "meshes_12-24'": [
                "Plane.048_1",
                "Plane.052_1",
                "Plane.053_1",
                "Plane.054_1",
            ],
            "meshes_26-30'": [
                "Plane.048_1",
                "Plane.052_1",
                "Plane.053_1",
                "Plane.054_1",
            ],
            "meshes_HeavyDuty": [
                "Plane.048_1",
                "Plane.052_1",
                "Plane.053_1",
                "Plane.054_1",
            ],
        },
        // "door": {
        //     "meshes_12-24'": [
        //         "Circle.002_0",
        //         "Circle.003_0",
        //         "Walk_in_door#2",
        //     ],
        //     "meshes_26-30'": [
        //         "Circle.002_0",
        //         "Circle.006_0",
        //         "Walk_in_door#2",
        //     ],
        //     "meshes_HeavyDuty": [
        //         "Circle.011_0",
        //         "Circle.006_0",
        //         "Circle.007_0",
        //         "Door_1001",
        //         "Door_1",
        //     ],
        // }
    }



    function switchColor(mesh, materialClone, color) {

        
        let initial = new THREE.Color(mesh.material.color.getHex());
        var value = new THREE.Color(parseInt(color));

        TweenLite.to(initial, 0.5, {
            r: value.r,
            g: value.g,
            b: value.b,

            onUpdate: function() {

                materialClone.color.setHex(initial.getHex());
                mesh.material = materialClone;

            }
        });
    }   

    function LightenDarkenColor(col, amt) {
  
        var usePound = false;
      
        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }
     
        var num = parseInt(col,16);
     
        var r = (num >> 16) + amt;
     
        if (r > 255) r = 255;
        else if  (r < 0) r = 0;
     
        var b = ((num >> 8) & 0x00FF) + amt;
     
        if (b > 255) b = 255;
        else if  (b < 0) b = 0;
     
        var g = (num & 0x0000FF) + amt;
     
        if (g > 255) g = 255;
        else if (g < 0) g = 0;
     
        return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
      
    }

    function applyColor(key, colorCode) {

        colorCode = "0x"+LightenDarkenColor(colorCode,-20);
        
        if (data[key]) {
            if (data[key]["meshes_" + currentModel]) {
                var meshes = data[key]["meshes_" + currentModel];

                meshes.forEach(target => {

                    if (target.indexOf("#") > 0) {
                        target = target.split('#');
                        targetIndex = parseInt(target[1]);
                        target = target[0];
                    } else {
                        targetIndex = -1;
                    }

                    find = scene.getObjectByName(target);
                    if (find) {

                        if (find.isMesh) {

                            materialClone = find.material.clone();
                            switchColor(find, materialClone, colorCode);

                        } else {

                            first = true;
                            count = 0;
                            find.traverse(n => {

                                if (n.isMesh) {
                                    if (targetIndex == -1 || targetIndex == count) {
                                        materialClone = n.material.clone();
                                        switchColor(n, materialClone, colorCode);
                                    }
                                }

                                count++;
                            });
                        }
                    } else {
                        console.log('Error', 'Could not find mesh : ' + target);
                    }


                });
            } else {
                console.log('Error', 'Meshes not found');
            }
        } else {
            console.log('Error', 'Data not found');
        }
    }

    function displayModel(modelName){
        if (objects[currentModel]) {
            scene.remove(objects[currentModel]);
        }
        objects[modelName].name = modelName;
        objects[modelName].position.set(0, 0, 0);
        controls.target.set(0, 0, 0);
        console.log(modelName,objects[modelName]);
        scene.add(objects[modelName]);
        currentModel = modelName;

        if (camera == undefined || camera == null || objects[currentModel] == null || objects[currentModel] == undefined) {
            console.log('camera/object is undefined');
            return;
        }
        if (currentModel == "HeavyDuty") {
            objects[currentModel].rotation.set(0, 0, 0);
            objects[currentModel].position.set(13.713436288261196, -5.772002327240196, -3.8456083457414465);
            camera.position.set(30.667813091567428, 5.869568823509786, -40.19978930790952);
            camera.rotation.set(-2.9036414677106315, 0.8887972480614169, 2.9554796055560524);
            objects[currentModel].scale.set(0.57, 0.57, 0.57);
        } else {
            camera.position.set(-29.61546168932172, 12.734287260961437, 23.838957747097826);
            camera.rotation.set(-0.5628414762614354, -0.8306081398772137, -0.4359405568334018);
            objects[currentModel].position.set(0, -2, 2);
            objects[currentModel].rotation.set(0.008, 0, 0);
            objects[currentModel].scale.set(0.57, 0.57, 0.57);
        }

        dragging = new THREE.DragControls([objects[modelName]] , camera, renderer.domElement);
        dragging.enabled = false;
        controls.enabled = true;
        // dragging.addEventListener('drag', function(event) {
        //     console.log('dragging', event.object.position.x,event.object.position.y);
        // });
        
    }
    async function loadModel() {
        
        var loader = new THREE.GLTFLoader();
        loader.setCrossOrigin('anonymous');
        
        await loader.load("./assets/color-picker/12-24'.glb", function(data) {
            for (var i = 0; i < data.scene.children.length; i++) {
                model = data.scene.children[i];
                model.traverse(n => { 
                    if (n.isMesh) { n.castShadow = true;  n.receiveShadow = true;
                        if (n.material.map) {
                            n.material.map.anisotropy = 15;
                }}});
            }
            gltf = data;
            if (gltf.scene !== undefined) {
                objects["12-24'"] = gltf.scene; // default scene
            } else if (gltf.scenes.length > 0) {
                objects["12-24'"] = gltf.scenes[0]; // other scene
            }
        });

        await loader.load("./assets/color-picker/26-30'.glb", function(data) {
            for (var i = 0; i < data.scene.children.length; i++) {
                model = data.scene.children[i];
                model.traverse(n => { 
                    if (n.isMesh) { n.castShadow = true;  n.receiveShadow = true;
                        if (n.material.map) {
                            n.material.map.anisotropy = 15;
                }}});
            }
            gltf = data;
            if (gltf.scene !== undefined) {
                objects["26-30'"] = gltf.scene; // default scene
            } else if (gltf.scenes.length > 0) {
                objects["26-30'"] = gltf.scenes[0]; // other scene
            }
        });

        await loader.load("./assets/color-picker/HeavyDuty.glb", function(data) {
            for (var i = 0; i < data.scene.children.length; i++) {
                model = data.scene.children[i];
                model.traverse(n => { 
                    if (n.isMesh) { n.castShadow = true;  n.receiveShadow = true;
                        if (n.material.map) {
                            n.material.map.anisotropy = 15;
                }}});
            }
            gltf = data;
            if (gltf.scene !== undefined) {
                objects["HeavyDuty"] = gltf.scene; // default scene
            } else if (gltf.scenes.length > 0) {
                objects["HeavyDuty"] = gltf.scenes[0]; // other scene
            }

            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.userPan = false;
            controls.userPanSpeed = 0.0;
            controls.maxDistance = 100;
            controls.enabled = true;  
            displayModel('12-24\'');
            animate();
            $('#loader').remove();
            
        });

        
        

    }


    //main functions

    function init() {


        let containerWidth = $('#animationBox').innerWidth();
        let containerHeight = $('#animationBox').innerHeight();
        renderer = new THREE.WebGLRenderer({ antialias: true, autoSize: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.gammaOutput = true;
        renderer.gammaFactor = 1;
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.shadowMap.enabled = true;
        renderer.setSize(containerWidth, containerHeight);
        $('#animationBox').append(renderer.domElement);
        $('#animationBox canvas').addClass('canvasBg');

        $('#animationBox canvas').mouseup(function(event) {
            controls.enabled = true;
            dragging.enabled = false;
        });

        $('#animationBox canvas').on("contextmenu", (e) =>{
            e.preventDefault(); return false;
        });

        $('#animationBox canvas').mousedown(function(event) {
            switch(event.which){
                case 1:
                    dragging.enabled = false;
                    controls.enabled = true;
                    break;
                case 3:
                    dragging.enabled = true;
                    controls.enabled = false;
                    break;
                default:
                    console.log('invalid click');
            }
        });



        // scene
        scene = new THREE.Scene();


        // camera
        camera = new THREE.PerspectiveCamera(40, containerWidth / containerHeight, 1, 10000);


        scene.add(new THREE.AmbientLight(0xffffff , 0.7));
        hemilight = new THREE.HemisphereLight(0xffffff , 0xffffff , 0.5);
        scene.add(hemilight);

        spotlight = new THREE.SpotLight(0xF5F5DC , 0.4);
        spotlight.castShadow = true;
        spotlight.shadow.mapSize.width = 1024 * 4;
        spotlight.shadow.mapSize.height = 1024 * 4;
        spotlight.shadow.bias = -0.0001;
        scene.add(spotlight);
        
        light = new THREE.PointLight(0xF5F5DC , 1.5);
        light.position.set(0, 0, 0);
        scene.add(light);

        var manager = new THREE.LoadingManager();
        manager.onProgress = function(item, loaded, total) {
            console.log(item, loaded, total);
        };


        loadModel();

        
        
    }

    function animate() {



        requestAnimationFrame(animate);

        controls.update();

        renderer.render(scene, camera);
        light.position.set(camera.position.x, camera.position.y, camera.position.z);
        spotlight.position.set(
            camera.position.x + 10,
            camera.position.y + 10,
            camera.position.z + 10,
        )

    }




    /*
        Managing Events & Triggers
    */

    $('#getPosition').click(function() {
        console.log('camera position', camera.position.x + "," + camera.position.y + "," + camera.position.y);
        console.log('camera rotation', camera.rotation.x + "," + camera.rotation.y + "," + camera.rotation.y);
        console.log('object position', objects[currentModel].position.x + "," + objects[currentModel].position.y + "," + objects[currentModel].position.y);
        console.log('camera rotation', objects[currentModel].rotation.x + "," + objects[currentModel].rotation.y + "," + objects[currentModel].rotation.y);
    });
    //on model switch
    $('#switchModel').change(function() {
        $('.currentColor span').html('None');
        wainscotRemoved = false;
        currentWallColor = null;
        var value = $(this).val();
        if (value != "12-24'" && value != "26-30'" && value != "HeavyDuty") {
            console.log('model not found', value);
            return;
        } else {
            if (value == "HeavyDuty") {
                $('#wainscotTrimPanel').show();
            } else {
                $('#wainscotTrimPanel').hide();
            }
            console.log('loading model');
            displayModel(value);
            currentModel = value;


        }

    });

    //on wainscor remove
    $('.removeWainscot').click(function() {
        var parent = $(this).closest('.card-body');
        parent.find('.currentColor span').html('Wainscot Removed');
        wainscotRemoved = true;
        if (currentWallColor != null) {
            applyColor('wainscot', currentWallColor);
        }
    });
    //on color change
    $('.color').click(function() {
        var colorCode = $(this).attr('color');
        var colorName = $(this).attr('title');
        var parent = $(this).closest('.card-body');
        if (parent) {
            var key = parent.attr('key');
            if (key == "wainscot") {
                wainscotRemoved = false;
            } else if (key == "wall") {
                currentWallColor = colorCode;
                if (wainscotRemoved == true) {
                    applyColor("wainscot", colorCode);
                }
            }
            parent.find('.currentColor span').html(colorName);
            applyColor(key, colorCode);
        } else {
            console.log('Error', 'Color Switch Failed Because Could Not Find Parent');
        }
    });

    $('#reset').click(function() {
        var i = 0;
        $('.collapse').each(function() {
            if (i == 0) {
                $(this).addClass('show');
            } else {
                $(this).removeClass('show');
            }
            i++;
        });

        displayModel(currentModel);

        $('.currentColor span').html('None');
        wainscotRemoved = false;
        currentWallColor = null;
    });

    init();
    

});