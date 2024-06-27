import * as THREE from "../tree/three.module.js"
import { isometrica } from "./projecoes.js";

export function Cubo(canvas, matrizBase, facesCubo) {
    // Cria a cena a ser renderizada
    const scene = new THREE.Scene();

    // Cria a perspectiva de visualização 3D
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(10,5, 15);
    camera.lookAt(scene.position);

    // Cria o renderizador
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setClearColor(0xFFFFFF, 1);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Cria a geometria básica do cubo usando BufferGeometry
    const boxGeometry = new THREE.BufferGeometry();

    // Converte a matriz de coordenadas para um formato adequado para BufferGeometry
    const vertices = [];
    matrizBase.forEach(coordenada => {
        vertices.push(coordenada[0], coordenada[1], coordenada[2]);
    });

    // Adiciona os vértices à geometria
    boxGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // Adiciona as faces do cubo
    const indices = [];
    facesCubo.forEach(face => {
        indices.push(face[0], face[1], face[2]);
        indices.push(face[0], face[2], face[3]);
    });

    // Define os índices das faces
    boxGeometry.setIndex(indices);

    // Cria o material e o cubo 3D
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true});
    const cube = new THREE.Mesh(boxGeometry, material);
    scene.add(cube);

    // Adiciona eixos cartesianos (opcional)
    let eixosCartezianos = new THREE.AxesHelper(25);
    scene.add(eixosCartezianos);

    // Renderiza a cena
    renderer.render(scene, camera);
}

// Função de desenho do cubo
export function CuboVisualizacao(canvas, matrizBase, facesCubo) {
    // Cena
    const scene = new THREE.Scene();

    // Configurar a câmera usando o tamanho do canvas
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(10, 5, 15);
    camera.lookAt(scene.position);

    // Renderizador
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setClearColor(0xFFFFFF, 1);
    renderer.setSize(width, height);

    // Aplicar a projeção isométrica
    const matrizBaseProj = isometrica(matrizBase, Math.PI / 4, Math.PI / 6);

    // Converte a matriz de coordenadas para um formato adequado para BufferGeometry
    const vertices = [];
    matrizBaseProj.forEach(coordenada => {
        vertices.push(coordenada[0], coordenada[1], coordenada[2]);
    });

    // Cria a geometria básica do cubo usando BufferGeometry
    const boxGeometry = new THREE.BufferGeometry();

    // Adiciona os vértices à geometria
    boxGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // Adiciona as faces do cubo
    const indices = [];
    facesCubo.forEach(face => {
        indices.push(face[0], face[1], face[2]);
        indices.push(face[0], face[2], face[3]);
    });

    // Define os índices das faces
    boxGeometry.setIndex(indices);

    // Cria o material e o cubo 3D
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    const cube = new THREE.Mesh(boxGeometry, material);
    scene.add(cube);

    // Adiciona eixos cartesianos (opcional)
    let eixosCartezianos = new THREE.AxesHelper(25);
    scene.add(eixosCartezianos);

    // Renderiza a cena
    renderer.render(scene, camera);
}


//função de desenho da casa
export function Casa(canvas) {
    // Cena
    const scene = new THREE.Scene();

    // Configurar a câmera usando o tamanho do canvas
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(scene.position); // Aponta a câmera para onde foi definida a cena 

    // Renderizador
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(width, height);

    // Corpo da casa (Cubo)
    const geometryHouse = new THREE.BoxGeometry(1, 1, 1);
    const materialHouse = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const house = new THREE.Mesh(geometryHouse, materialHouse);
    scene.add(house);

    // Telhado da casa (Prisma Triangular) usando BufferGeometry
    const roofVertices = new Float32Array([
        -0.5, 0.5, 0.5,  // 0: Bottom left front
         0.5, 0.5, 0.5,  // 1: Bottom right front
         0.0, 1.0, 0.5,  // 2: Top middle front
        -0.5, 0.5, -0.5, // 3: Bottom left back
         0.5, 0.5, -0.5, // 4: Bottom right back
         0.0, 1.0, -0.5  // 5: Top middle back
    ]);

    const roofIndices = [
        0, 1, 2, // Front face
        1, 4, 2, 4, 5, 2, // Right face
        3, 5, 4, // Back face
        0, 3, 5, 0, 5, 2 // Left face
    ];

    const roofGeometry = new THREE.BufferGeometry();
    roofGeometry.setAttribute('position', new THREE.BufferAttribute(roofVertices, 3));
    roofGeometry.setIndex(roofIndices);
    roofGeometry.computeVertexNormals();

    const roofMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 0;
    scene.add(roof);

    renderer.render(scene, camera);

}
