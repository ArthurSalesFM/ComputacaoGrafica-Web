export function perspectiva(matrizBase) {
    const d = 1; // distância do ponto de fuga
    const matrizPerspectiva = [
        [d, 0, 0, 0],
        [0, d, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 1, d]
    ];

    return matrizBase.map(vertice => {
        const verticeTransformado = multiplicarMatrizes(matrizPerspectiva, [[vertice[0]], [vertice[1]], [vertice[2]], [1]]);
        return [verticeTransformado[0][0] / verticeTransformado[3][0], verticeTransformado[1][0] / verticeTransformado[3][0], verticeTransformado[2][0] / verticeTransformado[3][0], 1];
    });
}


export function isometrica(matrizBase) {
    // Ângulos em graus
    const thetaXGraus = -35.264; // Ângulo em graus invertido para isometria (tan^-1(1/2))
    const thetaYGraus = 45; // Ângulo em graus para rotação

    // Converte ângulos de graus para radianos
    const thetaX = thetaXGraus * (Math.PI / 180);
    const thetaY = thetaYGraus * (Math.PI / 180);

    // Matriz de projeção isométrica ajustada para visualização de cima para baixo
    const matrizIsometrica = [
        [Math.cos(thetaY), 0, -Math.sin(thetaY), 0],
        [Math.sin(thetaX) * Math.sin(thetaY), Math.cos(thetaX), Math.sin(thetaX) * Math.cos(thetaY), 0],
        [Math.cos(thetaX) * Math.sin(thetaY), -Math.sin(thetaX), Math.cos(thetaX) * Math.cos(thetaY), 0],
        [0, 0, 0, 1]
    ];

    // Aplica a transformação isométrica aos vértices da matriz base
    return matrizBase.map(vertice => {
        const verticeTransformado = multiplicarMatrizes(matrizIsometrica, [[vertice[0]], [vertice[1]], [vertice[2]], [1]]);
        return [verticeTransformado[0][0], verticeTransformado[1][0], verticeTransformado[2][0], 1];
    });
}

export function ortografica(matrizBase) {
    const matrizOrtografica = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 1]
    ];

    return matrizBase.map(vertice => {
        const verticeTransformado = multiplicarMatrizes(matrizOrtografica, [[vertice[0]], [vertice[1]], [vertice[2]], [1]]);
        return [verticeTransformado[0][0], verticeTransformado[1][0], verticeTransformado[2][0], 1];
    });
}


function multiplicarMatrizes(a, b) {
    const aNumRows = a.length, aNumCols = a[0].length,
          bNumCols = b[0].length;
    let m = new Array(aNumRows);  // initialize array of rows
    for (let r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols); // initialize the current row
        for (let c = 0; c < bNumCols; ++c) {
            m[r][c] = 0;             // initialize the current cell
            for (let i = 0; i < aNumCols; ++i) {
                m[r][c] += a[r][i] * b[i][c];
            }
        }
    }
    return m;
}
