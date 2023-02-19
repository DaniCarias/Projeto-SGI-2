let scene = new THREE.Scene()
scene.background = new THREE.Color(0xFFFFFF)
let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)

let meucanvas = document.getElementById('product-view-canvas');
let renderer = new THREE.WebGLRenderer( {canvas: meucanvas, antialias: true} )

let controls = new THREE.OrbitControls(camera, renderer.domElement)

let models = ['Pinho', 'Carvalho'] // os gltf tem de ser exportados com estes nomes
let curItem = null // este e o modelo atualmente selecionado, para o remover ao trocar

renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 4
renderer.setSize(700, 400)
renderer.shadowMap.enabled = true

camera.position.x = -20
camera.position.y = 0
camera.position.z = 150
camera.lookAt(0,0,0)

let animat = [];

func_load('models/desk_pinho.gltf') //chama a funcao de load do file do blender

function func_load(file){
    new THREE.GLTFLoader().load(file, function(gltf){
        scene.add(gltf.scene)

        animat = [] //array para guardar as animaçoes
        misturador._actions = [] //reseta as animacoes carregadas

        misturador = new THREE.AnimationMixer(scene);
        for(let i in gltf.animations){
            animat.push(misturador.clipAction(gltf.animations[i]))
            animat[i].clampWhenFinished = true
            animat[i].setLoop(THREE.LoopOnce)
        }

        scene.traverse(function(x){
            if(x.isMesh){
                x.castShadow = true
                x.receiveShadow = true			
            } 

            controls.target.set(0,0,0)
            controls.update()
            camera.zoom = 1
            camera.updateProjectionMatrix()

            document.getElementById('product-view-canvas').hidden = false
            document.getElementById('imagem').hidden = true

            if(models.includes(x.name)){ //escolher o Item corrente
                curItem = x;
            }
        })

        document.getElementById("anim_portas").innerHTML = "Abrir Porta";
        document.getElementById("anim_gavetas").innerHTML = "Abrir Gavetas";

        document.getElementById("movel_completo").src= "./models/" +curItem.name+ "/"+curItem.name+"_frente.PNG";
        document.getElementById("gaveta_sozinha").src= "./models/" +curItem.name+ "/"+curItem.name+"_gaveta.PNG";
        document.getElementById("imagem_estatica").src= "./models/" +curItem.name+ "/"+curItem.name+"_lado.PNG";
        
    })
}

var relogio = new THREE.Clock()
var misturador = new THREE.AnimationMixer(scene)

addLights()
animate()

var icon = 1 //1 -> 3D
document.getElementById('3d/2d').onclick = function(){

    if(icon == 1){
        document.getElementById('product-view-canvas').hidden = true
        document.getElementById('imagem').hidden = false
        document.getElementById("imagem").src= "./models/" +curItem.name+ "/"+curItem.name+"_lado.PNG";
        document.getElementById("3d/2d").src= "imagens/3d.png";
        icon = 0
    }else{
        document.getElementById('product-view-canvas').hidden = false
        document.getElementById('imagem').hidden = true
        document.getElementById("3d/2d").src= "imagens/non3d.png";
        icon = 1
    }
}

//VER FOTO MEIO
document.getElementById('imagem_estatica').onclick = function(){
    document.getElementById('product-view-canvas').hidden = true
    document.getElementById("imagem").src= "./models/" +curItem.name+ "/"+curItem.name+"_lado.PNG";
    document.getElementById('imagem').hidden = false
}

//VER MOVEL COMPLETO
document.getElementById('movel_completo').onclick = function(){

    document.getElementById('product-view-canvas').hidden = false
    document.getElementById('imagem').hidden = true
    
    if(gaveta == 1){
        div_anim.style.visibility = 'visible';
        div_interior_exterior.style.visibility = 'visible';
        controls.target.set(0,0,0)
        camera.zoom = 1
        camera.updateProjectionMatrix()
        controls.update()

        for(let x in curItem.children){
            if(curItem.children[x].name != "drawerUp"){
                curItem.children[x].visible = true
            }
        }

        gaveta = 0
    }
}

//VER GAVETA SOZINHA
var gaveta = 0 //so a gaveta
document.getElementById('gaveta_sozinha').onclick = function(){

    document.getElementById('product-view-canvas').hidden = false
    document.getElementById('imagem').hidden = true

    if(gaveta == 0){ //so a gaveta - quermos colocar tudo de novo
        
        div_anim.style.visibility = 'hidden';
        div_interior_exterior.style.visibility = 'hidden';
        controls.target.set(-35,3,1)
        camera.zoom = 2
        camera.updateProjectionMatrix()
        controls.update()

        for(let x in curItem.children){
            if(curItem.children[x].name != "deskMiddleDrawer"){
                curItem.children[x].visible = false
            }
        }

        gaveta = 1
    }
}

//MUDAR TEXTURA
document.getElementById('pinho').onclick = function(){ //botao Textura Pinho
    scene.remove(curItem)
    curItem = func_load('models/desk_pinho.gltf')
}
document.getElementById('carvalho').onclick = function(){ //botao Textura Carvalho
    scene.remove(curItem)
    curItem = func_load('models/desk_carvalho.gltf')
}

//Ver Interior
var interior = 1; //com portas e gavetas
document.getElementById('interior').onclick = function(){ //PORTAS
    if(interior == 1){ //para tirar as portas e gavetas
        visible_parte("deskDoor", false) //nao mostrar porta
        visible_parte("deskMiddleDrawer", false) //nao mostrar gaveta do meio
        visible_parte("deskTopDrawer", false) //nao mostrar gaveta de cima
        interior = 0
        document.getElementById("interior").innerHTML = "Ver Exterior";
    }else{
        visible_parte("deskDoor", true) //mostrar porta
        visible_parte("deskMiddleDrawer", true) //mostrar gaveta do meio
        visible_parte("deskTopDrawer", true) //mostrar gaveta de cima
        interior = 1
        document.getElementById("interior").innerHTML = "Ver Interior";
    }
}

//ANIMACOES
var anim_portas = 1
document.getElementById('anim_portas').onclick = function(){ //Animacao das portas
        animacao("deskDoorAction",anim_portas)

        if(anim_portas == 1){ //vai passar a ser possivel fechar 
            anim_portas = -1
            document.getElementById("anim_portas").innerHTML = "Fechar Porta";
        }else{
            anim_portas = 1
            document.getElementById("anim_portas").innerHTML = "Abrir Porta";
        }
}
var anim_gavetas = 1
document.getElementById('anim_gavetas').onclick = function(){ //Animacao das gavetas
        animacao("deskMiddleDrawerAction",anim_gavetas)
        animacao("deskTopDrawerAction",anim_gavetas)

        if(anim_gavetas == 1){ //vai passar a ser possivel fechar 
            anim_gavetas = -1
            document.getElementById("anim_gavetas").innerHTML = "Fechar Gavetas";
        }else{
            anim_gavetas = 1
            document.getElementById("anim_gavetas").innerHTML = "Abrir Gavetas";
        }
}

//BACKGROUND COLOR
document.getElementById('beje').onclick = function(){ //BackGround Beje
    scene.background = new THREE.Color(0xE5E5DA)
}
document.getElementById('azul').onclick = function(){ //BackGround Azul
    scene.background = new THREE.Color(0xE2FFFF)
}
document.getElementById('branco').onclick = function(){ //BackGround Branco
    scene.background = new THREE.Color(0xFFFFFF)
}
document.getElementById('cinza').onclick = function(){ //BackGround Cinza
    scene.background = new THREE.Color(0xC0C0C0)
}



//FUNCOES AUXILIARES
function animacao(nome_clip, abrir_fechar){ //Animacoes das portas e das gavetas do movel
    for(let i in animat){
        if(animat[i]._clip.name == nome_clip){
            animat[i].timeScale = abrir_fechar
            animat[i].enabled = true
            animat[i].paused = false
            animat[i].play()
        }
    }
}

function visible_parte(parte, visible){ //colocar visible (true or false) em partes do movel
    for(let n in scene.children){
        if(scene.children[n] == curItem){
            for (let i in scene.children[n].children){
                if(scene.children[n].children[i].name == parte){
                    scene.children[n].children[i].visible = visible
                }
            }
        }
    }
}

function animate() {
    misturador.update(relogio.getDelta()) //qnt tempo passou
    requestAnimationFrame( animate )
    renderer.render( scene, camera )
}

function addLights(){
    const lightAmb = new THREE.AmbientLight( 0xffffff, 0.5); 
    scene.add( lightAmb );

    const lightDir = new THREE.DirectionalLight( 0xE5E5DA, 1 );
    lightDir.position.set(2,8,10)
    scene.add( lightDir );
}

