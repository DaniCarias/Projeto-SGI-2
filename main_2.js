let scene = new THREE.Scene()
scene.background = new THREE.Color(0xFFFFFF)
let camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 1000)
let meucanvas =  document.getElementById('product-view-canvas')
let renderer = new THREE.WebGLRenderer( {canvas: meucanvas, antialias: true} )
let controls = new THREE.OrbitControls(camera, renderer.domElement)
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 4
renderer.setSize(450, 300)
renderer.shadowMap.enabled = true

camera.position.x = -20
camera.position.y = 0
camera.position.z = 150
camera.lookAt(0,0,0)

let animat = [];

new THREE.GLTFLoader().load('models/desk_pinho.gltf', function(gltf){
    scene.add(gltf.scene)

    document.getElementById('product-view-canvas').hidden = true

    animat = [] //array para guardar as animaçoes
    misturador._actions = [] //reseta as animacoes carregadas
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
    })
    
});

var relogio = new THREE.Clock()
var misturador = new THREE.AnimationMixer(scene)

addLights()
animar()

document.getElementById('imagem').onmouseover = function(){ //qnd passa em cima comeca a animacao
    
    document.getElementById('imagem').hidden = true
    document.getElementById('product-view-canvas').hidden = false
    
    for(var a = 0; a<animat.length; a++){
        animat[a].play()
    }
}

document.getElementById('product-view-canvas').onmouseout = function(){ //qnd sai de cima pára a animacão
    
    document.getElementById('imagem').hidden = false
    document.getElementById('product-view-canvas').hidden = true

    for(var a = 0; a<animat.length; a++){
        animat[a].stop()
    }
}

//desenha a cena
function animar(){ 
    misturador.update(relogio.getDelta()) //qnt tempo passou
    requestAnimationFrame(animar) 
    renderer.render(scene,camera) 
}
//adicionar luz
function addLights(){
    const lightAmb = new THREE.AmbientLight( 0xffffff, 0.5); 
    scene.add( lightAmb );

    const lightDir = new THREE.DirectionalLight( 0xE5E5DA, 1 );
    lightDir.position.set(2,8,10)
    scene.add( lightDir );
}