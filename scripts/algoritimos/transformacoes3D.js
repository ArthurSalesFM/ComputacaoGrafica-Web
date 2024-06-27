export function translacao3D(matrizBase, tx, ty, tz) {
    const matrizTranslacao = [
        [1, 0, 0, tx],
        [0, 1, 0, ty],
        [0, 0, 1, tz],
        [0, 0, 0, 1]
    ];
    return matrizBase.map(vertice => {
        const verticeTransformado = multiplicarMatrizes(matrizTranslacao, [[vertice[0]], [vertice[1]], [vertice[2]], [vertice[3]]]);
        return [verticeTransformado[0][0], verticeTransformado[1][0], verticeTransformado[2][0], verticeTransformado[3][0]];
    });
}

export function escala3D(matrizBase, sx, sy, sz) {
    const matrizEscala = [
        [sx, 0, 0, 0],
        [0, sy, 0, 0],
        [0, 0, sz, 0],
        [0, 0, 0, 1]
    ];

    const centro = calcularCentro(matrizBase);

    // Verifica se o objeto já está na origem
    if (centro[0] !== 0 || centro[1] !== 0 || centro[2] !== 0) {
        // Translada o objeto para a origem
        matrizBase = translacao3D(matrizBase, -centro[0] + 1, -centro[1] + 1, -centro[2] + 1);

        // Aplica a escala
        matrizBase = matrizBase.map(vertice => {
            const verticeTransformado = multiplicarMatrizes(matrizEscala, [[vertice[0]], [vertice[1]], [vertice[2]], [vertice[3]]]);
            return [verticeTransformado[0][0], verticeTransformado[1][0], verticeTransformado[2][0], verticeTransformado[3][0]];
        });

        // Translada o objeto de volta para a posição original, considerando o deslocamento inicial
        matrizBase = translacao3D(matrizBase, centro[0] - 1, centro[1] - 1, centro[2] - 1);
        return matrizBase;

    } else {
        //aplica escala
        return matrizBase.map(vertice => {
            const verticeTransformado = multiplicarMatrizes(matrizEscala, [[vertice[0]], [vertice[1]], [vertice[2]], [vertice[3]]]);
            return [verticeTransformado[0][0], verticeTransformado[1][0], verticeTransformado[2][0], verticeTransformado[3][0]];
        });
    }
    
}

export function rotacaoX3D(matrizBase, angulo) {
    const rad = angulo * (Math.PI / 180);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const matrizRotacao = [
        [1, 0, 0, 0],
        [0, cos, -sin, 0],
        [0, sin, cos, 0],
        [0, 0, 0, 1]
    ];

    //const matrizRotacao = [
    //    [cos, -sin, 0, 0],
    //    [sin, cos, 0, 0],
    //    [0, 0, 1, 0],
    //    [0, 0, 0, 1]
    //];

    const centro = calcularCentro(matrizBase);

    // Verifica se o objeto já está na origem
    if (centro[0] !== 0 || centro[1] !== 0 || centro[2] !== 0) {
        // Translada o objeto para a origem
        matrizBase = translacao3D(matrizBase, -centro[0] + 1, -centro[1] + 1, -centro[2] + 1);

        // Aplica a rotação
        matrizBase = matrizBase.map(vertice => {
            const verticeTransformado = multiplicarMatrizes(matrizRotacao, [[vertice[0]], [vertice[1]], [vertice[2]], [vertice[3]]]);
            return [verticeTransformado[0][0], verticeTransformado[1][0], verticeTransformado[2][0], verticeTransformado[3][0]];
        });

        // Translada o objeto de volta para a posição original, considerando o deslocamento inicial
        matrizBase = translacao3D(matrizBase, centro[0] - 1, centro[1] - 1, centro[2] - 1);
        return matrizBase;

    } else {
        return matrizBase.map(vertice => {
            const verticeTransformado = multiplicarMatrizes(matrizRotacao, [[vertice[0]], [vertice[1]], [vertice[2]], [vertice[3]]]);
            return [verticeTransformado[0][0], verticeTransformado[1][0], verticeTransformado[2][0], verticeTransformado[3][0]];
        });
    }
}

export function rotacaoY3D(matrizBase, angulo) {
    const rad = angulo * (Math.PI / 180);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const matrizRotacao = [
        [cos, 0, sin, 0],
        [0, 1, 0, 0],
        [-sin, 0, cos, 0],
        [0, 0, 0, 1]
    ];

    const centro = calcularCentro(matrizBase);

    // Verifica se o objeto já está na origem
    if (centro[0] !== 0 || centro[1] !== 0 || centro[2] !== 0) {
        // Translada o objeto para a origem
        matrizBase = translacao3D(matrizBase, -centro[0] + 1, -centro[1] + 1, -centro[2] + 1);

        // Aplica a rotação
        matrizBase = matrizBase.map(vertice => {
            const verticeTransformado = multiplicarMatrizes(matrizRotacao, [[vertice[0]], [vertice[1]], [vertice[2]], [vertice[3]]]);
            return [verticeTransformado[0][0], verticeTransformado[1][0], verticeTransformado[2][0], verticeTransformado[3][0]];
        });

        // Translada o objeto de volta para a posição original, considerando o deslocamento inicial
        matrizBase = translacao3D(matrizBase, centro[0] - 1, centro[1] - 1, centro[2] - 1);
        return matrizBase;

    } else {
        return matrizBase.map(vertice => {
            const verticeTransformado = multiplicarMatrizes(matrizRotacao, [[vertice[0]], [vertice[1]], [vertice[2]], [vertice[3]]]);
            return [verticeTransformado[0][0], verticeTransformado[1][0], verticeTransformado[2][0], verticeTransformado[3][0]];
        });
    }
}

export function rotacaoZ3D(matrizBase, angulo) {
    const rad = angulo * (Math.PI / 180);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const matrizRotacao = [
        [cos, -sin, 0, 0],
        [sin, cos, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    const centro = calcularCentro(matrizBase);

    // Verifica se o objeto já está na origem
    if (centro[0] !== 0 || centro[1] !== 0 || centro[2] !== 0) {
        // Translada o objeto para a origem
        matrizBase = translacao3D(matrizBase, -centro[0] + 1, -centro[1] + 1, -centro[2] + 1);

        // Aplica a rotação
        matrizBase = matrizBase.map(vertice => {
            const verticeTransformado = multiplicarMatrizes(matrizRotacao, [[vertice[0]], [vertice[1]], [vertice[2]], [vertice[3]]]);
            return [verticeTransformado[0][0], verticeTransformado[1][0], verticeTransformado[2][0], verticeTransformado[3][0]];
        });

        // Translada o objeto de volta para a posição original, considerando o deslocamento inicial
        matrizBase = translacao3D(matrizBase, centro[0] - 1, centro[1] - 1, centro[2] - 1);
        return matrizBase;

    } else {
        return matrizBase.map(vertice => {
            const verticeTransformado = multiplicarMatrizes(matrizRotacao, [[vertice[0]], [vertice[1]], [vertice[2]], [vertice[3]]]);
            return [verticeTransformado[0][0], verticeTransformado[1][0], verticeTransformado[2][0], verticeTransformado[3][0]];
        });
    }
}

export function cisalhamentoGeral3D(matrizBase, shxy, shxz, shyx, shyz, shzx, shzy) {
    const matrizCisalhamento = [
        [1, shxy, shxz, 0],
        [shyx, 1, shyz, 0],
        [shzx, shzy, 1, 0],
        [0, 0, 0, 1]
    ];

    const centro = calcularCentro(matrizBase);

    // Verifica se o objeto já está na origem
    if (centro[0] !== 0 || centro[1] !== 0 || centro[2] !== 0) {
        // Translada o objeto para a origem
        matrizBase = translacao3D(matrizBase, -centro[0] + 1, -centro[1] + 1, -centro[2] + 1);

        // Aplica a cisalhamento
        matrizBase = matrizBase.map(vertice => {
            const verticeTransformado = multiplicarMatrizes(matrizCisalhamento, [[vertice[0]], [vertice[1]], [vertice[2]], [vertice[3]]]);
            return [verticeTransformado[0][0], verticeTransformado[1][0], verticeTransformado[2][0], verticeTransformado[3][0]];
        });

        // Translada o objeto de volta para a posição original, considerando o deslocamento inicial
        matrizBase = translacao3D(matrizBase, centro[0] - 1, centro[1] - 1, centro[2] - 1);
        return matrizBase;

    } else {
        return matrizBase.map(vertice => {
            const verticeTransformado = multiplicarMatrizes(matrizCisalhamento, [[vertice[0]], [vertice[1]], [vertice[2]], [vertice[3]]]);
            return [verticeTransformado[0][0], verticeTransformado[1][0], verticeTransformado[2][0], verticeTransformado[3][0]];
        });
    }
}

// Função de reflexão em torno do plano XY
export function reflexaoXY3D(matrizBase) {
    const matrizReflexao = [    
        [ 1,  0,  0,  0],
        [ 0,  1,  0,  0],
        [ 0,  0, -1,  0],
        [ 0,  0,  0,  1]
    ];
    return aplicarTransformacao(matrizBase, matrizReflexao);
}

// Função de reflexão em torno do plano XZ
export function reflexaoXZ3D(matrizBase) {
    const matrizReflexao = [    
        [ 1,  0,  0,  0],
        [ 0, -1,  0,  0],
        [ 0,  0,  1,  0],
        [ 0,  0,  0,  1]
    ];
    return aplicarTransformacao(matrizBase, matrizReflexao);
}

// Função de reflexão em torno do plano YZ
export function reflexaoYZ3D(matrizBase) {
    const matrizReflexao = [    
        [-1,  0,  0,  0],
        [ 0,  1,  0,  0],
        [ 0,  0,  1,  0],
        [ 0,  0,  0,  1]
    ];
    return aplicarTransformacao(matrizBase, matrizReflexao);
}

// Função para aplicar uma transformação em uma matriz de vértices
function aplicarTransformacao(matrizBase, matrizTransformacao) {
    return matrizBase.map(vertice => {
        const verticeTransformado = multiplicarMatrizes(matrizTransformacao, [[vertice[0]], [vertice[1]], [vertice[2]], [1]]);
        return [verticeTransformado[0][0], verticeTransformado[1][0], verticeTransformado[2][0], verticeTransformado[3][0]];
    });
}


function multiplicarMatrizes(a, b) {
    const rowsA = a.length, colsA = a[0].length;
    const rowsB = b.length, colsB = b[0].length;

    if (colsA !== rowsB) {
        throw new Error("Número de colunas de A deve ser igual ao número de linhas de B");
    }

    const result = Array.from({ length: rowsA }, () => Array(colsB).fill(0));
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return result;
}

function calcularCentro(matriz) {
    const deslocamentoInicial = [1, 1, 1];
    const numVertices = matriz.length;
    let cx = 0, cy = 0, cz = 0;

    matriz.forEach(vertice => {
        cx += vertice[0] - deslocamentoInicial[0];
        cy += vertice[1] - deslocamentoInicial[1];
        cz += vertice[2] - deslocamentoInicial[2];
    });

    // Calcula a média das coordenadas dos vértices
    cx /= numVertices;
    cy /= numVertices;
    cz /= numVertices;

    // Adiciona o deslocamento inicial de volta ao centroide calculado
    cx += deslocamentoInicial[0];
    cy += deslocamentoInicial[1];
    cz += deslocamentoInicial[2];

    return [cx, cy, cz];
}