
// Carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {

    const painel2D = document.querySelector('.main_conteudo-painelDesenho');
    const canvas = painel2D.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const largura = parseFloat(painel2D.offsetWidth).toFixed(5);
    const altura = parseFloat(painel2D.offsetHeight).toFixed(5);
    canvas.width = largura;
    canvas.height = altura;

    //Botões
    const btnLimparPixel = document.getElementById('btnLimparCanvasPixel');
    const btnDesenharPixel = document.getElementById('btnDesenharPixel');

    const btnLimparReta = document.getElementById('btnLimparReta');
    const btnDesenharReta = document.getElementById('btnDesenharReta');

    const btnLimparCircunferencia = document.getElementById('btnLimparCircunferencia');
    const btnDesenharCircunferencia = document.getElementById('btnDesenharCircunferencia');

    // Seleciona os elementos de input do PIXEL
    const inputXPixel = document.getElementById('inputXPixel');
    const inputYPixel = document.getElementById('inputYPixel');

    //Seleciona os elementos do input da Reta
    const inputXP1 = document.getElementById("inputXP1");
    const inputYP1 = document.getElementById("inputYP1");
    const inputXP2 = document.getElementById("inputXP2");
    const inputYP2 = document.getElementById("inputYP2");

    //Seleciona o elemento do input Do Raio
    const inputRaio = document.getElementById('inputRaio');

    const centroX = largura/2;
    const centroY = altura/2;

    // Seletor para todos os checkboxes dentro de .configPanel2D_opcoes_transformacoes
    const checkboxes = document.querySelectorAll('.configPanel2D_opcoes_transformacoes input[type="checkbox"]');

    // inputs de entradas das transformações
    //const xTranslacao = document.getElementById('xTranslacao').value;
    //const yTranslacao = document.getElementById('yTranslacao').value;
    const xEscala = document.getElementById('xEscala');
    const yEscala = document.getElementById('yEscala');
    const AnguloRotacao = document.getElementById('AnguloRotacao');
    const xCisalhamento = document.getElementById('xCisalhamento');
    const yCisalhamento = document.getElementById('yCisalhamento');

    //Botões das transformações
    const btnAplicaTransformacoes = document.getElementById('btnAplicaTransformacoes');
    const btnLimpaTransformacoes = document.getElementById('btnLimpaTransformacoes');

    const verticesIniciaisDoQuadrado = [
        [centroX, centroX + 50, centroX + 50, centroX],
        [centroY, centroY, centroY - 50, centroY - 50],
        [1, 1, 1, 1]
    ];

    const inputOpcoes = document.getElementById("opcoes");

    /* **********************************************************
        Sobre as coordenadas e posição do mouse no canvas 
    */

    // Função para obter as coordenadas do mouse no canvas
    function obterPosicaoDoMouse(event) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        return { x: x, y: y };
    }

    /* Função para atualizar as coordenadas*/
    function atualizarCoordenadas(event) {
        var coordenadas = obterPosicaoDoMouse(event);
        var Xmax = canvas.width;
        var Ymax = canvas.height;
        var ndh = canvas.width;
        var ndv = canvas.height;
        var ndcx = (2 * coordenadas.x / Xmax) - 1; ;
        var ndcy = 1 - (2 * coordenadas.y / Ymax); ;
        var dcx =  Math.round((ndcx + 1) * (ndh) / 2);
        var dcy =  Math.round((1 - ndcy) * (ndv) / 2);

        document.getElementById("coordMundo").querySelector("p").innerText = "X: " + Math.floor(coordenadas.x) + "\nY: " + Math.floor(coordenadas.y) ;
        document.getElementById("coordNorm").querySelector("p").innerText = "X: " + ndcx.toFixed(10) + "\n Y: " + ndcy.toFixed(10);
        document.getElementById("coordTela").querySelector("p").innerText = "X: " + dcx + "\nY: " + dcy ;
    }

    // Função para ativar um pixel
    function ativaPixel(X, Y) {
        var ctx = canvas.getContext('2d');    
        
        // Desenhar um pequeno ponto vermelho na posição passada por paramentro
        ctx.fillStyle = "red";
        ctx.fillRect((centroX + X) - 1, (centroY - Y) - 1, 1, 1); // Ativando 1 pixel de tamanho (1x1)
    }

    //Função DDA para qualquer oitante
    function DDA(X1, Y1, X2, Y2) {
        var deltaX = X2 - X1;
        var deltaY = Y2 - Y1;
    
        var length = Math.max(Math.abs(deltaX), Math.abs(deltaY));
    
        var Xinc = deltaX / length;
        var Yinc = deltaY / length;
    
        var X = X1;
        var Y = Y1;
    
        ativaPixel(Math.round(X), Math.round(Y));
    
        for (var i = 0; i < length; i++) {
            X += Xinc;
            Y += Yinc;
            ativaPixel(Math.round(X), Math.round(Y));
        }
    }

    // Reta Ponto Médio
    function retaPontoMedio(X1, Y1, X2, Y2) {
        // Verifica se X1 é maior que X2 e, se for, troca os pontos
        if (X1 > X2) {
            [X1, X2] = [X2, X1];
            [Y1, Y2] = [Y2, Y1];
        }

        var dx = Math.abs(X2 - X1);
        var dy = Math.abs(Y2 - Y1);
        var d = 2 * dy - dx;
        var incE = 2 * dy;
        var incNE = 2 * (dy - dx);
        var x = X1;
        var y = Y1;

        ativaPixel(x, y);
        console.log("X: " + x + "\tY: " + y);

        while (x < X2) {
            if (d <= 0) {
                d = d + incE;
                x = x + 1;
            } else {
                d = d + incNE;
                x = x + 1;
                y = y + 1;
            }
            ativaPixel(x, y);
            console.log("X: " + x + "\tY: " + y);
        }
    }

    // Função para desenhar uma circunferencia com o método Polinomial
    function circunferenciaPolinomial(raio) {
        // Inicialização das variáveis
        let x = 0;
        let i = 1;
        let xend = raio;

        // Loop para desenhar o círculo
        while (x <= xend) {
            // Cálculo da coordenada y usando a equação do círculo
            let y = Math.round(Math.sqrt(raio * raio - x * x));
            
            // Plotar os pontos determinados pela simetria
            ponto_Circulo(x, y);

            // Incrementar x
            x += i;
        }
    }

    // Função para desenhar uma circunferencia com o método trigonometrico
    function circunferenciaTrigonometrica(raio) {
        
        // Variável para armazenar o ângulo atual
        let theta = 0;
        
        // Variável para determinar se o círculo foi convertido
        let converted = false;
        
        // Passo para incrementar o ângulo
        const passo = 1;

        // Loop enquanto o círculo não for completamente desenhado
        while (!converted) {
            // Converter o ângulo de graus para radianos
            let radianos = (theta * Math.PI) / 180;
            
            // Calcular a coordenada x usando a fórmula do círculo
            let x = Math.round(raio * Math.cos(radianos));
           
            // Calcular a coordenada y usando a fórmula do círculo
            let y = Math.round(raio * Math.sin(radianos));

            // Plotar os pontos determinados pela simetria
            ponto_Circulo(x, y);

            // Incrementar o ângulo
            theta += passo;

            // Condição de parada: círculo completo quando o ângulo alcança 360 graus
            if (theta >= 360) {
                converted = true;
            }
        }
    }

    //Função da circunferencia PM
    function circunferenciaPontoMedio(raio){
        var x = 0;
        var y = raio;
        var d = (1-raio);

        ponto_Circulo(x, y);

        while( y > x){
            if(d < 0 ){
                d += 2.0*x + 3.0;
            }
            else{
                d += 2.0*(x-y)+5;
                y--;
            }
            x++;
            ponto_Circulo(x, y);
        }
    }

    //Função para realizar 
    function ponto_Circulo(x, y){
        ativaPixel(x, y); 
        ativaPixel(y, x);
        ativaPixel(y, -x);
        ativaPixel(x, -y);
        ativaPixel(-x, -y);
        ativaPixel(-y, -x);
        ativaPixel(-y, x);
        ativaPixel(-x, y);
    }

    //Função para limpar o canvas
    function limpaTela(){
        // Limpa o conteúdo do canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    /* ***************************TRANSFORMAÇÕES*************************** */

    // Função para desenhar os eixos X e Y para visualizar as transformações
    function desenharEixos() {
        // Desenhar eixo X
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        // Desenhar eixo Y
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
    } 

    
    function Translacao(matrizBase, tx, ty) {
        console.log('Translação aplicada: tx =', tx, 'ty =', ty);
    
        const matrizTranslacao = [
            [1, 0, tx],
            [0, 1, ty],
            [0, 0, 1]
        ];
    
        const matrizResultado = multiplicarMatrizes(matrizTranslacao, matrizBase);
    
        console.log('Matriz resultante após translação:');
        console.log(matrizResultado);
    
        return matrizResultado;
    }

    // Função para multiplicar duas matrizes
    function multiplicarMatrizes(matrizA, matrizB) {
        const linhasA = matrizA.length;
        const colunasA = matrizA[0].length;
        const colunasB = matrizB[0].length;
        const matrizResultado = [];

        for (let i = 0; i < linhasA; i++) {
            matrizResultado[i] = [];
            for (let j = 0; j < colunasB; j++) {
                let soma = 0;
                for (let k = 0; k < colunasA; k++) {
                    soma += matrizA[i][k] * matrizB[k][j];
                }
                matrizResultado[i][j] = soma;
            }
        }

        return matrizResultado;
    }

    //var matrizModificada = verticesIniciaisDoQuadrado;


    let matrizModificada = [
            [centroX, centroX + 50, centroX + 50, centroX],
            [centroY, centroY, centroY - 50, centroY - 50],
            [1, 1, 1, 1]
    ];

    function desenharQuadrado(vertices) {
        console.log('Coordenadas dos vértices do quadrado:');
        console.log(vertices);
    
        ctx.beginPath();
        ctx.moveTo(vertices[0][0], vertices[1][0]);
    
        for (var i = 1; i < vertices[0].length; i++) {
            ctx.lineTo(vertices[0][i], vertices[1][i]);
        }
    
        ctx.closePath();
        ctx.strokeStyle = 'red';
        ctx.stroke();
    }


    // Adiciona um ouvinte de evento para o movimento do mouse no canvas para atualização das coordenadas
    canvas.addEventListener("mousemove", atualizarCoordenadas);

    // Ouvinte de evento para o botão "LimparPixel"
    btnLimparPixel.addEventListener('click', () => {
        // Limpa o conteúdo do canvas
        limpaTela();
    });

    // Ouvinte de evento para o botão "LimparRetas"
    btnLimparReta.addEventListener('click', () => {
        // Limpa o conteúdo do canvas
        limpaTela();
    });

    btnLimparCircunferencia.addEventListener('click', () =>{
        // Limpa o conteúdo do canvas
        limpaTela();
    })

    // Ouvinte de evento para o botão "DesenharPixel"
    btnDesenharPixel.addEventListener('click', () => {

        // Obtém os valores dos inputs
        var valorX = parseInt(inputXPixel.value);
        var valorY = parseInt(inputYPixel.value);

        if(isNaN(valorX) || isNaN(valorY)){
            alert("Digite os valores do ponto.");
        }
        else{
            ativaPixel(valorX, valorY);
        }        
        
    });

    // Ouvinte de evento para o botão "DesenharRetas"
    btnDesenharReta.addEventListener('click', () => {

        // Obtém os valores dos inputs
        var valorXP1 = parseInt(inputXP1.value);
        var valorYP1 = parseInt(inputYP1.value);
        var valorXP2 = parseInt(inputXP2.value);
        var valorYP2 = parseInt(inputYP2.value);

        if(isNaN(valorXP1) || isNaN(valorYP1) || isNaN(valorXP2) || isNaN(valorYP2) ){
            alert("Digite os valores dos pontos.");
        }
        else{

            // Obtém a opção selecionada
            var opcaoSelecionada = document.getElementById('opcoes').value;

            switch(opcaoSelecionada){
                
                case "opcao2":
                    DDA(valorXP1, valorYP1, valorXP2, valorYP2);                    
                break;

                case "opcao3":
                    retaPontoMedio(valorXP1, valorYP1, valorXP2, valorYP2);
                break;

                default:
                    alert("Falha no sistema.");
                break;

            }
        }        
        
    });

    //Ouvinte de evento para o botão "Desenhar Circunferencia"
    btnDesenharCircunferencia.addEventListener('click', () => {
        //Obtem o raio
        var raio = parseInt(inputRaio.value);

        if(isNaN(raio)){
            alert('Digite o Raio.');
        }
        else{

            // Obtém a opção selecionada
            var opcaoSelecionada = document.getElementById('opcoes').value;

            switch(opcaoSelecionada){

                case "opcao4":
                    circunferenciaPolinomial(raio);
                break;

                case "opcao5":
                    circunferenciaTrigonometrica(raio);
                break;

                case "opcao6":
                    circunferenciaPontoMedio(raio);
                break;

            }

        }
    });

    //Ouvinte para verificar se a opção selecionada foi a de transformações
    inputOpcoes.addEventListener('change', () =>{

        var opcaoSelecionada = inputOpcoes.value;

        if(opcaoSelecionada === "opcao7"){

            limpaTela();
            desenharEixos();
            //var verticesQuadrado = verticesIniciaisDoQuadrado(centroX, centroY);
            desenharQuadrado(verticesIniciaisDoQuadrado);
        }
        

    });





// Função para adicionar ouvintes de eventos aos checkboxes
function adicionarOuvintesCheckbox() {
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            //console.log('Checkbox', checkbox.id, 'clicado');
            // Você pode adicionar mais lógica aqui se necessário
        });
    });
}

// Função para aplicar a transformação desejada
function aplicarTransformacao() {
    // Verifica se o checkbox de translação está marcado
    if (document.getElementById('checkTranslacao').checked) {
        // Verifica se os valores de translação são válidos
        const xTranslacao = parseFloat(document.getElementById('xTranslacao').value);
        const yTranslacao = parseFloat(document.getElementById('yTranslacao').value);
        
        if (!isNaN(xTranslacao) && !isNaN(yTranslacao)) {
            // Aplica a translação à matriz de vértices
            matrizModificada = Translacao(matrizModificada, xTranslacao, yTranslacao);
            
            // Limpa o canvas
            limpaTela();
            
            // Desenha os eixos
            desenharEixos();
            
            // Desenha o quadrado com as novas coordenadas após a translação
            desenharQuadrado(matrizModificada);
        } else {
            alert('Por favor, insira valores numéricos válidos para a translação.');
        }
    }
}

// Adiciona ouvintes de eventos aos checkboxes
adicionarOuvintesCheckbox();

// Aplica a transformação desejada quando o botão é clicado
btnAplicaTransformacoes.addEventListener('click', aplicarTransformacao);

});