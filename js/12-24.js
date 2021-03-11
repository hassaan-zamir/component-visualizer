$(document).ready(function() {

    //global variables
    let group,object,groundMesh;
    let loading = true;
    let allowHighlight = true;
    let lastHighlightedKey = 'key';
    let originalMaterials = [];
    let clickedOn = "n/a";
    let hoverComponents = {

        "Door_Handle002": "door",
        "Door_Handle003": "door",
        "Door_1001": "door",


        "Window_1005": "window",
        "Window_glass_1005": "window",

        "InsulationBack": "insulation",
        "Insulation-Strip": "insulation",
        "Insulation_strip_Bottom": "insulation",

        "Base_railBack": "baseRail",
        "Base_railFront": "baseRail",
        "Base_railLeft": "baseRail",
        "Base_railRight": "baseRail",

        "Lean-to_Bows": "bow",
        "Bows": "bow",

        "Lean-to_Braces": "brace",
        "BracesLeft": "brace",
        "BracesRight": "brace",
        "Bow_Braces": "brace",

        "LegsBack": "frame",
        "LegsFront": "frame",
        "Frame1": "frame",

        "Legs-Lean-to": "legs",
        "LegsRight": "legs",
        "LegsLeft": "legs",

        "Lean-to_Hat_Channel": "hatChannel",
        "Hat_Channel002": "hatChannel",

        "Window_1005": "jTrim",
        "DoorFrame002": "jTrim",

        "L-trim002": "lTrim",
        "L-trim004": "lTrim",
        "L-trim005": "lTrim",
        "L-trim006": "lTrim",
        "L-trim007": "lTrim",

        "ridgecap": "ridgeCap",

        "Plane.048_0": "cornerTrim",
        "Plane.048_1": "cornerTrim",
        "Plane.052_0": "cornerTrim",
        "Plane.052_1": "cornerTrim",
        "Plane.053_0": "cornerTrim",
        "Plane.053_1": "cornerTrim",
        "Plane.054_0": "cornerTrim",
        "Plane.054_1": "cornerTrim",
        "Lean-to_Frame": "cornerTrim",

        "Circle.002_0": "garageDoor",
        "Circle.003_0": "garageDoor",

        "Roof_Sheeting001": "roof",
        "Roof_Sheeting002": "roof",
        "Roof_Sheeting003": "roof",

        "Verticle_Trim_Main001": "roofTrim",
        "Verticle_Trim_Lean-to001": "roofTrim",

        "Plane.006_1": "wainscot",
        "Plane.028_1": "wainscot",
        "Plane.003_1": "wainscot",
        "Plane.034_1": "wainscot",
        "Plane.008_1": "wainscot",

        "Plane.006_0": "sidePanel",
        "Plane.006_2": "sidePanel",
        "Plane.003_0": "sidePanel",
        "Plane.003_2": "sidePanel",
        "Frameright": "sidePanel",
        "Framefront": "sidePanel",

        "Plane.044_0": "gableEnd",
        "Plane.044_1": "gableEnd",
        "Plane.045_0": "gableEnd",
        "Plane.045_1": "gableEnd",
    };

    let descriptions = {
        "wainscot": [
            "Wainscot",
            "3' high wall sheeting installed on the bottom that is a different color than the sheeting on above it.",
        ],
        "cornerTrim": [
            "Corner Trim",
            "Metal trim used to finish the outside corners of the building.",
        ],
        "garageDoor": [
            "Garage Door",
            "Garage door that opens into a cylinder shape above the opening.",
        ],
        "lTrim": [
            "L Trim",
            "Steel Trim used to add a finished look to panels and around garage doors.",
        ],
        "ridgeCap": [
            "Ridge Cap",
            "Steel used on vertical roofs to close the gap between the two roof sides.",
        ],
        "roof": [
            "Roof",
            "Steel sheeting used to enclose the building to provide shelter from the elements. ",
        ],
        "roofTrim": [
            "Roof Trim",
            "Steel framing used to finish the edges of the roof sheeting.",
        ],
        "sidePanel": [
            "Side Panels",
            "Steel sheeting used to enclose the sides and ends of a building.",
        ],
        "door": [
            "Walk In Door",
            "Typically a 36' wide x 80' high door used for pedestrian access to enter and exit the building.",
        ],
        "window": [
            "Window",
            "Steel single hung window to allow light and fresh air into the building.",
        ],
        "insulation": [
            "Insulation",
            "Vapor barrier insulation used to help in reducing condensation build up inside the building.",
        ],
        "gabel": [
            "Gabel Ends",
            "Half triangle shaped sheeting installed on an open end wall to give it a more finished look.",
        ],
        "baseRail": [
            "Base Rail",
            "Steel tube on which the building legs are installed. Runs around the perimeter of the base of the building.",
        ],
        "bow": [
            "Bows",
            "Steel framing on top of the building that creates the roof system. Used on buildings up to 24' wide. Standard pitch is 3:12.",
        ],
        "brace": [
            "Braces",
            "Connects the building legs to the bows/trusses to provide additional support, and used to provide additional support for the roof.",
        ],
        "frame": [
            "Frame",
            "Used to support wall sheeting",
        ],
        "legs": [
            "Legs",
            "Galvanized steel tubing (14 gauge or 12 gauge) which connects the roof truss to the base rail.",
        ],
        "hatChannel": [
            "Hat Channel",
            "Steel tubing installed on the roof and walls to support vertical sheeting.",
        ],
        "jTrim": [
            "J Trim",
            "Steel trim used to finish around openings and at surface connections.",
        ],
        "gableEnd": [
            "Gable End",
            "Half triangle shaped sheeting installed on an open end wall to give it a more finished look.",
        ]
    };
    let currentView = 'topViewComponents';
    let highlightHistory = [];

    let renderer, scene, camera, controls, dragging;
    //global variables end

    //helper functions



    function switchColor(mesh, materialClone, color) {

        let initial = new THREE.Color(mesh.material.color.getHex());
        var value = new THREE.Color(parseInt(color));

        highlightHistory.push({
            objectName: mesh.name,
        });

        TweenLite.to(initial, 0.5, {
            r: value.r,
            g: value.g,
            b: value.b,

            onUpdate: function() {
                if (notCleared(mesh.name) && allowHighlight) {
                    materialClone.color.setHex(initial.getHex());
                    mesh.material = materialClone;
                }
            }
        });
    }

    function notCleared(name) {
        for (var i = 0; i < highlightHistory.length; i++) {
            if (highlightHistory[i].objectName == name) {
                return true;
            }
        }
        return false;
    }

    function clearHighlight() {

        for (var i = 0; i < highlightHistory.length; i++) {
            var his = highlightHistory[i];
            let find = scene.getObjectByName(his.objectName);
            find.material = originalMaterials[his.objectName].clone();
        }
        highlightHistory = [];

    }

    function backtoVisible() {
        scene.children[6].traverse(n => {
            if (!n.visible) {
                n.visible = true;
            }
        });
    }

    //helper functions end

    //main three js logic
    function animate() {

        requestAnimationFrame(animate);


        controls.update();

        renderer.render(scene, camera);
        light.position.set(camera.position.x, camera.position.y, camera.position.z);
        spotlight.position.set(
            camera.position.x + 10,
            camera.position.y + 10,
            camera.position.z + 10,
        );

    }

    function init() {

        let containerWidth = $('#container').innerWidth();
        let containerHeight = $('#container').innerHeight();
        renderer = new THREE.WebGLRenderer({ antialias: true, autoSize: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.gammaOutput = true;
        renderer.gammaFactor = 1;
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.shadowMap.enabled = true;
        renderer.setSize(containerWidth, containerHeight);
        $('#container').append(renderer.domElement);


        $('#container canvas').mouseup(function(event) {
            allowHighlight = true;
            controls.enabled = true;
            dragging.enabled = false;
        });

        $('#container canvas').on("contextmenu" , (e) => {
            e.preventDefault(); return false;
        });

        $('#container canvas').mousedown(function(event) {

            allowHighlight = false;
            switch(event.which){
                case 1:
                    if(clickedOn === "selected"){
                        clickedOn = "n/a";
                    }
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
            $('#componentDetails').hide();
            clearHighlight();
        });

        // scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xcce0ff);
        scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);
        // camera initial position
        camera = new THREE.PerspectiveCamera(40, containerWidth / containerHeight, 1, 10000);
        camera.rotation.set(-0.4361141777497734, -0.9223495266578665, -0.35565137561042276);
        camera.position.set(-1500.688735787021, 383.793738428656, 1005.506190055299);








        //floor
        const textureLoader = new THREE.TextureLoader();
        const groundTexture = textureLoader.load('assets/grass.jpg');
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(25, 25);
        groundTexture.anisotropy = 16;
        groundTexture.encoding = THREE.sRGBEncoding;

        const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });

        groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(20000, 20000), groundMaterial);
        groundMesh.position.y = -250;
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.receiveShadow = true;
        // scene.add(groundMesh);

        //lighting
        scene.add(new THREE.AmbientLight(0xADD8E6, 0.05));
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        hemilight = new THREE.HemisphereLight(0xffffed, 0xffffed, 1);
        scene.add(hemilight);

        spotlight = new THREE.SpotLight(0xffffff, 0.4);
        spotlight.castShadow = true;
        spotlight.shadow.mapSize.width = 1024 * 4;
        spotlight.shadow.mapSize.height = 1024 * 4;
        spotlight.shadow.bias = -0.0001;
        scene.add(spotlight);

        light = new THREE.PointLight(0xffffff, 4);
        light.position.set(camera.position.x, camera.position.y, camera.position.z);
        scene.add(light);

        var manager = new THREE.LoadingManager();
        manager.onProgress = function(item, loaded, total) {
            console.log(item, loaded, total);
        };

        var loader = new THREE.GLTFLoader();
        loader.setCrossOrigin('anonymous');

        var scale = 25;
        var url = "./assets/component-visualizer/12-24'.glb";

        let domEvents = new THREEx.DomEvents(camera, renderer.domElement);
        loader.load(url, function(data) {


            for (var i = 0; i < data.scene.children.length; i++) {
                model = data.scene.children[i];

                model.traverse(n => {

                    if (n.isMesh) {
                        originalMaterials[n.name] = n.material.clone();
                        n.castShadow = true;
                        n.receiveShadow = true;
                        if (n.material.map) {
                            n.material.map.anisotropy = 15;
                        }
                        if (hoverComponents[n.name] != undefined) {

                            domEvents.addEventListener(n, 'mousedown', function(event) {
                                clickedOn = n.name;
                            });

                            domEvents.addEventListener(n, 'mouseup', function(event) {

                                if (clickedOn == n.name) {
                                    setTimeout(function() {
                                        $('#' + currentView + ' button[key="' + hoverComponents[n.name] + '"]').click();
                                    }, 300);
                                    clickedOn = "selected";
                                } else {
                                    clickedOn = "n/a";
                                }

                            });

                            domEvents.addEventListener(n, 'mouseover', function(event) {
                                if (allowHighlight && clickedOn != "selected") {
                                    setTimeout(function() {
                                        $('#' + currentView + ' button[key="' + hoverComponents[n.name] + '"]').click();
                                    }, 300);
                                }
                            });

                            domEvents.addEventListener(n, 'mouseout', function(event) {
                                if (clickedOn != "selected" && allowHighlight) {
                                    clearHighlight();
                                    $('#componentDetails').hide();
                                }
                            });

                        }
                    }


                });
            }


            gltf = data;


            if (gltf.scene !== undefined) {
                object = gltf.scene; // default scene
            } else if (gltf.scenes.length > 0) {
                object = gltf.scenes[0]; // other scene
            }

            object.scale.set(scale, scale, scale);
            object.position.set(0, -320.8410257854748, 0);

            object.name = "Model";
            console.log("object", object);

            group = new THREE.Group(); //create a container
            group.add(object); //add a mesh with geometry to it
            group.add(groundMesh);
            scene.add(group); 
            // scene.add(object);

            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.userPan = false;
            controls.userPanSpeed = 0.0;
            // controls.maxPolarAngle = Math.PI * 0.48;
            controls.maxDistance = 2200;
            controls.enabled = true;

            dragging = new THREE.DragControls([group], camera, renderer.domElement);
            dragging.enabled = false;
            dragging.addEventListener('drag', function(event){
                if(event.object.position.y < -315){
                    event.object.position.y = -315;
                }else if(event.object.position.y > 215){
                    event.object.position.y = 215;
                }
                if(event.object.position.x < -735){
                    event.object.position.x = -735;
                }else if(event.oject.position.y > 680){
                    event.object.position.x = 680;
                }
            });

            animate();
            loading = false;
            $('#loader').remove();
        });




    }
    //main logic end



    //Manage Events

    $('.topView').click(function() {

        if(loading) return false;
        object.position.set(0, -320.8410257854748, 0);
        camera.rotation.set(-0.4361141777497734, -0.9223495266578665, -0.35565137561042276);
        camera.position.set(-1500.688735787021, 383.793738428656, 1005.506190055299);

        currentView = 'topViewComponents';
        clearHighlight();
        $('.components').hide();
        $('#topViewComponents').show();
        backtoVisible();


    });

    $('.frontView').click(function() {

        if(loading) return false;
        object.position.set(0, -320.8410257854748, 0);
        camera.rotation.set(-2.991915339877779, 1.1361645832114986, 3.005652183789453);
        camera.position.set(1122.556595604761, 77.71108711697838, -515.3078203981711);
        currentView = 'frontViewComponents';
        clearHighlight();
        $('.components').hide();
        $('#frontViewComponents').show();
        backtoVisible();

        selectedObject = scene.getObjectByName("Sheeting_Back");
        selectedObject.traverse(n => {
            n.visible = false;
        });
        selectedObject.visible = false;
        selectedObject = scene.getObjectByName("InsulationBack");
        selectedObject.traverse(n => {
            n.visible = false;
        });
        selectedObject.visible = false;
        selectedObject = scene.getObjectByName("LegsBack");
        selectedObject.traverse(n => {
            n.visible = false;
        });
        selectedObject.visible = false;


    });

    $('.sideView').click(function() {

        if(loading) return false;
        object.position.set(220, -320.8410257854748, 0);
        camera.rotation.set(3.071009796703626, -0.026331453506230996, 3.139731229088313);
        camera.position.set(-56.356904476980404, -108.63000703135208, -1405.077198225507);
        currentView = 'sideViewComponents';
        clearHighlight();
        $('.components').hide();
        $('#sideViewComponents').show();
        backtoVisible();

        selectedObject = scene.getObjectByName("Sheeting_Left");
        selectedObject.traverse(n => {
            n.visible = false;
        });
        selectedObject.visible = false;

        selectedObject = scene.getObjectByName("LegsLeft");
        selectedObject.traverse(n => {
            n.visible = false;
        });
        selectedObject.visible = false;
        selectedObject = scene.getObjectByName("BracesLeft");
        selectedObject.traverse(n => {
            n.visible = false;
        });
        selectedObject.visible = false;

    });

    $('#getPosition').click(function() {

        let string;
        string = "camera.rotation.set(" + camera.rotation.x + "," + camera.rotation.y + "," + camera.rotation.z + ");<br/>";
        string += "camera.position.set(" + camera.position.x + "," + camera.position.y + "," + camera.position.z + ");";
        $('#positionBox').html(string);
    });


    $('.highlight').click(function() {

        if(loading) return false;
        var key = $(this).attr('key');

        if (lastHighlightedKey != key) {
            clearHighlight();
        }
        lastHighlightedKey = key;


        if (descriptions[key] != undefined) {
            $('#componentDetails').fadeIn(500);
            $('#heading').text(descriptions[key][0]);
            $('#description').text(descriptions[key][1]);
        }
        var targets = $(this).attr('target').split(',');
        var color = $(this).attr('color');

        $.each(targets, function(i, target) {

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
                    switchColor(find, materialClone, color);

                } else {
                    first = true;
                    count = 0;
                    find.traverse(n => {
                        if (n.isMesh) {
                            if (targetIndex == -1 || targetIndex == count) {
                                materialClone = n.material.clone();
                                switchColor(n, materialClone, color);
                            }
                        }
                        count++;
                    });
                }
            } else {
                alert('could not find ' + target);
            }


        });
    });
    //Manage Events ENd

    //Initializing
    $('#topViewComponents').show();
    init();


});