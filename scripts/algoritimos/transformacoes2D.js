import { setarDadosParaSaidaDeDados, setarDadosParaSaidaDeDadosMatrizes } from '../utils/utils.js'
import { multiplicarMatrizes } from '../utils/produtoDeMatrizes.js'

// Função de Translação
export function Translacao(matrizBase, tx, ty) {    
    const matrizTranslacao = [
        [1, 0, tx],
        [0, 1, ty],
        [0, 0, 1]
    ];

    const matrizResultado = multiplicarMatrizes(matrizTranslacao, matrizBase);  
    
    setarDadosParaSaidaDeDados("\nTranslação.\n\n" + 
        "tx : " + tx + "\n" + 
        "ty : " + ty + "\n\n" +
        "Matriz Base: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizBase) + "\n\n" +
        "Matriz de Translação: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizTranslacao) + "\n\n" +
        "Matriz Resultado: "  + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizResultado)
    );
    
    return matrizResultado;
}

// Função de Escala
export function Escala(matrizBase, sx, sy) {
    let matrizResultado = [];

    const matrizEscala = [
        [sx, 0, 0],
        [0, sy, 0],
        [0, 0, 1]
    ];

    if(!estaNaOrigem(matrizBase)){
        //armazena onde os obj estava antes da translação para origem
        const tx = matrizBase[0][0];
        const ty = matrizBase[1][0];

        // translada para ortigem (ja mostra na saida de dados)
        matrizBase = Translacao(matrizBase, -tx, -ty);

        //aplica a escala e em seguida mostra as informações de escala na saida de dados
        matrizResultado = multiplicarMatrizes(matrizEscala, matrizBase);
        setarDadosParaSaidaDeDados("\Escala.\n\n" + 
            "sx : " + sx + "\n" + 
            "sy : " + sy + "\n\n" +
            "Matriz Base: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizBase) + "\n\n" +
            "Matriz de Escala: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizEscala) + "\n\n" +
            "Matriz Resultado: "  + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizResultado)
        );
        //aplica a translação para os coordenadas iniciais
        matrizResultado = Translacao(matrizResultado,tx, ty);

    }else {
        matrizResultado = multiplicarMatrizes(matrizEscala, matrizBase);
        setarDadosParaSaidaDeDados("\Escala.\n\n" + 
            "sx : " + sx + "\n" + 
            "sy : " + sy + "\n\n" +
            "Matriz Base: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizBase) + "\n\n" +
            "Matriz de Escala: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizEscala) + "\n\n" +
            "Matriz Resultado: "  + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizResultado)
        );
    }


    return matrizResultado;
}

// Função de Rotação
export function Rotacao(matrizBase, angulo) {
    let matrizResultado = [];
    // Converte o ângulo para radianos
    angulo = angulo * (Math.PI / 180);

    // Calcular seno e cosseno do ângulo
    const cos_theta = Math.cos(angulo);
    const sin_theta = Math.sin(angulo);

    const matrizRotacao = [
        [cos_theta, sin_theta, 0],
        [-sin_theta, cos_theta, 0],
        [0, 0, 1]
    ];

    if(!estaNaOrigem(matrizBase)){
        //armazena onde os obj estava antes da translação para origem
        const tx = matrizBase[0][0];
        const ty = matrizBase[1][0];

        // translada para ortigem (ja mostra na saida de dados)
        matrizBase = Translacao(matrizBase, -tx, -ty);

        //aplica a escala e em seguida mostra as informações de escala na saida de dados
        matrizResultado = multiplicarMatrizes(matrizRotacao, matrizBase);
        setarDadosParaSaidaDeDados("\Rotação.\n\n" + 
            "Angulo : " + angulo.toFixed(4) + "\n" +
            "Cos. Theta : " + cos_theta.toFixed(4) + "\n" +  
            "Sin. Theta : " + sin_theta.toFixed(4) + "\n\n" +
            "Matriz Base: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizBase) + "\n\n" +
            "Matriz de Rotação: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizRotacao) + "\n\n" +
            "Matriz Resultado: "  + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizResultado)
        );
        //aplica a translação para os coordenadas iniciais
        matrizResultado = Translacao(matrizResultado,tx, ty);

    }else {
        const matrizResultado = multiplicarMatrizes(matrizRotacao, matrizBase);
        setarDadosParaSaidaDeDados("\Rotação.\n\n" + 
            "Angulo : " + angulo.toFixed(4) + "\n" +
            "Cos. Theta : " + cos_theta.toFixed(4) + "\n" +  
            "Sin. Theta : " + sin_theta.toFixed(4) + "\n\n" +
            "Matriz Base: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizBase) + "\n\n" +
            "Matriz de Rotação: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizRotacao) + "\n\n" +
            "Matriz Resultado: "  + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizResultado)
        );
    }

    return matrizResultado;
}

// Função para aplicar a reflexão em X
export function ReflexaoX(matrizBase) {
    
    const matrizReflexaoX = [
        [1, 0, 0],
        [0, -1, 0],
        [0, 0, 1]
    ];
    // Aplicar a reflexão em X multiplicando a matriz do polígono pela matriz de reflexão
    const matrizResultado = multiplicarMatrizes(matrizReflexaoX, matrizBase);
    
    setarDadosParaSaidaDeDados("\nReflexão X.\n\n" + 
        "Matriz Base: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizBase) + "\n\n" +
        "Matriz de Reflexão X: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizReflexaoX) + "\n\n" +
        "Matriz Resultado: "  + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizResultado)
    );
    
    return matrizResultado;
}

// Função para aplicar a reflexão em Y
export function ReflexaoY(matrizBase) {
    
    const matrizReflexaoY = [
        [-1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];

    // Aplicar a reflexão em X multiplicando a matriz do polígono pela matriz de reflexão
    const matrizResultado = multiplicarMatrizes(matrizReflexaoY, matrizBase);

    setarDadosParaSaidaDeDados("\n\nReflexão Y.\n\n" + 
        "Matriz Base: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizBase) + "\n\n" +
        "Matriz de Reflexão Y: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizReflexaoY) + "\n\n" +
        "Matriz Resultado: "  + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizResultado)
    );
    return matrizResultado
}

// Função para aplicar cisalhamento em X
export function cisalhamentoX(matrizBase, shx){
    let matrizResultado = [];

    const matrizCisalhamentoX = [
        [1, shx, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];

    if(!estaNaOrigem(matrizBase)){
        //armazena as coordenadas iniciais
        const tx = matrizBase[0][0];
        const ty = matrizBase[1][0];

        //translada para origem
        matrizBase = Translacao(matrizBase, -tx, -ty);

        // aplica o cisalhamento e em seguida mostra as informações na saida de dados
        matrizResultado = multiplicarMatrizes(matrizCisalhamentoX, matrizBase);
        setarDadosParaSaidaDeDados("\nCisalhamento X.\n\n" + 
            "shx : " + shx.toFixed(1) + "\n" +
            "Matriz Base: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizBase) + "\n\n" +
            "Matriz de Cisalhamento X: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizCisalhamentoX) + "\n\n" +
            "Matriz Resultado: "  + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizResultado)
        );

        //translada para as coordenadas iniciais 
        matrizResultado = Translacao(matrizResultado, tx, ty);

    }else {
        //esta na origem, aplica o cisalhamento e exibe na saida de informações 
        matrizResultado = multiplicarMatrizes(matrizCisalhamentoX, matrizBase);
        setarDadosParaSaidaDeDados("\nCisalhamento X.\n\n" + 
            "shx : " + shx.toFixed(1) + "\n" +
            "Matriz Base: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizBase) + "\n\n" +
            "Matriz de Cisalhamento X: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizCisalhamentoX) + "\n\n" +
            "Matriz Resultado: "  + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizResultado)
        );
    }

    return matrizResultado;
}

// Função para aplicar cisalhamento em Y
export function cisalhamentoY(matrizBase, shy){
    let matrizResultado = [];

    const matrizCisalhamentoY = [
        [1, 0, 0],
        [shy, 1, 0],
        [0, 0, 1]
    ];

    if(!estaNaOrigem(matrizBase)){
        //armazena as coordenadas iniciais
        const tx = matrizBase[0][0];
        const ty = matrizBase[1][0];

        //translada para origem
        matrizBase = Translacao(matrizBase, -tx, -ty);

        //aplica o cisalhamento e em seguida exibe na saida de informações 
        matrizResultado = multiplicarMatrizes(matrizCisalhamentoY, matrizBase);
        setarDadosParaSaidaDeDados("\n\nCisalhamento Y.\n\n" + 
            "shy : " + shy.toFixed(1) + "\n" +
            "Matriz Base: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizBase) + "\n\n" +
            "Matriz de Cisalhamento Y: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizCisalhamentoY) + "\n\n" +
            "Matriz Resultado: "  + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizResultado)
        );

        //translada para posição inicial
        matrizResultado = Translacao(matrizResultado, tx, ty);

    }else {
        //esta na origem, aplica o cisalhamento e exibe na saida de informações 
        matrizResultado = multiplicarMatrizes(matrizCisalhamentoY, matrizBase);
        setarDadosParaSaidaDeDados("\n\nCisalhamento Y.\n\n" + 
            "shy : " + shy.toFixed(1) + "\n" +
            "Matriz Base: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizBase) + "\n\n" +
            "Matriz de Cisalhamento Y: " + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizCisalhamentoY) + "\n\n" +
            "Matriz Resultado: "  + "\n" + setarDadosParaSaidaDeDadosMatrizes(matrizResultado)
        );
    }

    return matrizResultado;
}

// Função para verificar se a matriz está na origem
function estaNaOrigem(matriz) {
    return matriz[0][0] === 0 && matriz[1][0] === 0;
}