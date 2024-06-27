import { DDA, retaPontoMedio } from './algoritimos/reta.js';
import { circunferenciaPolinomial, circunferenciaTrigonometrica, circunferenciaPontoMedio } from './algoritimos/circunferencia.js';
import { elipsePontoMedio } from './algoritimos/elipse.js';
import { Translacao, Escala, Rotacao, ReflexaoX, ReflexaoY, cisalhamentoX, cisalhamentoY } from './algoritimos/transformacoes2D.js';
import {translacao3D, escala3D, rotacaoX3D, rotacaoY3D, rotacaoZ3D, reflexaoXY3D, reflexaoXZ3D, reflexaoYZ3D, cisalhamentoGeral3D}  from './algoritimos/transformacoes3D.js';
import { ativaPixel, limpaTela, limparSaidaDeDadosTextarea, setarDadosParaSaidaDeDados } from './utils/utils.js';
import { cohenSutherland } from './algoritimos/cohenShutherland.js';
import { processarListaViewport } from './viewPort/viewPort.js';
import * as desenhar from './algoritimos/desenho2D.js';
import * as desenhar3D from './algoritimos/desenho3D.js';
import { desenharECG, continuarExecucao } from './algoritimos/batimentosCoardiacos.js';

document.addEventListener('DOMContentLoaded', () => {
    
    /*Canvas onde o usuário realiza os desenhos 2D*/
    const painel2D = document.querySelector('.main_conteudo-painelDesenho');
    const canvas = painel2D.querySelector('canvas');    
    let ctx = canvas.getContext('2d');
    const largura = parseFloat(painel2D.offsetWidth).toFixed(5);
    const altura = parseFloat(painel2D.offsetHeight).toFixed(5);
    canvas.width = largura;
    canvas.height = altura;
    //Definindo o a origem no centro do canvas
    ctx.translate(largura/2, altura/2);
    
    /*Canvas desenho 3D*/
    const canvas3D = document.getElementById('canvas3D');

    /*Canvas da ViewPort*/
    const painelSaidaCanvasVP = document.querySelector('.delimitacaoViewPort');
    const canvasViewPort = painelSaidaCanvasVP.querySelector('#viewPortDoProjeto');
    let ctxViewPort = canvasViewPort.getContext('2d');
    const larguraVP = parseFloat(painelSaidaCanvasVP.offsetWidth).toFixed(5);
    const alturaVP = parseFloat(painelSaidaCanvasVP.offsetHeight).toFixed(5);
    canvasViewPort.width = larguraVP;
    canvasViewPort.height = alturaVP;
    ctxViewPort.translate(larguraVP/2, alturaVP/2);

    //Botões
    const btnLimparPixel = document.getElementById('btnLimparCanvasPixel');
    const btnDesenharPixel = document.getElementById('btnDesenharPixel');

    const btnLimparReta = document.getElementById('btnLimparReta');
    const btnDesenharReta = document.getElementById('btnDesenharReta');

    const btnLimparCircunferencia = document.getElementById('btnLimparCircunferencia');
    const btnDesenharCircunferencia = document.getElementById('btnDesenharCircunferencia');

    const btnLimparElipse = document.getElementById('btnLimparElipse');
    const btnDesenharElipse = document.getElementById('btnDesenharElipse');
    
    const btnAplicaTransformacoes = document.getElementById('btnAplicaTransformacoes');
    const btnLimpaTransformacoes = document.getElementById('btnLimpaTransformacoes');
    
    const btnDesenharRetaCohen = document.getElementById('btnDesenharRetaCohen');
    const btnLimparRetaCohen = document.getElementById('btnLimparRetaCohen');
    const btnAplicarCohen = document.getElementById('btnAplicarCohen');
    const inputRetas = document.getElementById('inputRetas');
    
    //botões transformação 3D
    const btnAplicaTransformacoes3D = document.getElementById('btnAplicaTransformacoes3D');
    const btnLimpaTransformacoes3D = document.getElementById('btnLimpaTransformacoes3D');
    
    //botão projeções
    //inputs de projeções 3D
    const projecaoPerspectiva = document.getElementById('projecaoPerspectiva');
    const projecaoParalelaIsometrica = document.getElementById('projecaoParalelaIsometrica');
    const projecaoParalelaOrtografica = document.getElementById('projecaoParalelaOrtografica');
    const btnAplicaProjecoes = document.getElementById('btnAplicaProjecoes');

    const btnLimparSaidaTextarea = document.getElementById('btnLimparSaidaTextarea');

    // botões da mini VP do 
    const btnTransferirParaViewPort = document.getElementById('btnTransferirParaViewPort');
    const btnLimparViewPort = document.getElementById('btnLimparViewPort');
    const btnVisualizar = document.getElementById("btnVisualizar");
    btnTransferirParaViewPort.disabled = true;
    btnLimparViewPort.disabled = true;
    btnVisualizar.disabled = true;

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

    //seleciona os elementos de input da Elipse
    const inputOrigemX = document.getElementById("inputElipseX");
    const inputOrigemY = document.getElementById("inputElipseY");
    const inputElipseRaioX = document.getElementById("inputElipseRaioX");
    const inputElipseRaioY = document.getElementById("inputElipseRaioY");

    //Seleciona o elemente do input do Batimento
    const inputIdade = document.getElementById('inputIdade');
    const inputSituacao = document.getElementById('inputSitucao');
    const btnAplicarBatimentos = document.getElementById('btnAplicarBatimentos');
    const btnLimparCanvasBatimentos = document.getElementById('btnLimparCanvasBatimentos');

    // Seletor para todos os checkboxes dentro de .configPanel2D_opcoes_transformacoes
    //const checkboxes = document.querySelectorAll('.configPanel2D_opcoes_transformacoes input[type="checkbox"]');
    const inputOpcoes2D = document.getElementById("opcoes2D");
    const inputOpcoes3D = document.getElementById('opcoes3D');
    const checkboxEscolhido2dE3d = document.querySelectorAll('.opcaoEscolhida'); //checkbox 2d e 3d
    
    //const canvas_container = document.querySelector('.canvas-container');
    
    // entrada de tamanho pelo usuário para VP
    const canvasModal = document.getElementById("canvasModal");
    const closeModal = canvasModal.querySelector(".close");
    const criarCanvasBtn = document.getElementById("criarCanvas");    
    const larguraInput = document.getElementById("larguraCanvas");
    const alturaInput = document.getElementById("alturaCanvas");    
    const otherSections = document.querySelectorAll("section:not(#canvasModal)");

    //CANVASVP
    const canvasContainer = document.querySelector(".canvas-container");
    const canvass = document.getElementById("canvass");
    let ctxVP = canvass.getContext('2d');    
    const fecharCanvas = document.getElementById("fecharCanvas");

    // Função para obter as coordenadas do mouse no canvas
    function obterPosicaoDoMouse(event) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        return { x: x, y: y };
    }

    // Função para atualizar as coordenadas
    function atualizarCoordenadas(event) {
        var coordenadas = obterPosicaoDoMouse(event);
        var Xmax = canvas.width;
        var Ymax = canvas.height;
        var ndh = canvas.width;
        var ndv = canvas.height;
        var ndcx = (2 * coordenadas.x / Xmax) - 1;
        var ndcy = 1 - (2 * coordenadas.y / Ymax);
        var dcx =  Math.round((ndcx + 1) * (ndh) / 2);
        var dcy =  Math.round((1 - ndcy) * (ndv) / 2);

        document.getElementById("coordMundo").querySelector("p").innerText = "X: " + Math.floor(coordenadas.x) + "\nY: " + Math.floor(coordenadas.y) ;
        document.getElementById("coordNorm").querySelector("p").innerText = "X: " + ndcx.toFixed(10) + "\n Y: " + ndcy.toFixed(10);
        document.getElementById("coordTela").querySelector("p").innerText = "X: " + dcx + "\nY: " + dcy ;
    }

    //desativa a atualização de coordenadas quando seleciona o checkbox 3D, (é mais complicado ter coordenadas x, y e z com o canvas no contexto Webgl)
    function desativarAtualizacaoCoordenadas() {
        document.getElementById("coordMundo").querySelector("p").innerText = "";
        document.getElementById("coordNorm").querySelector("p").innerText = "";
        document.getElementById("coordTela").querySelector("p").innerText = "";
    }

    /* **************************** Matrizes de Transformação ***************************************** */
    let matrizBaseGeral = [
        [0, 50, 50, 0],
        [0, 0, -50, -50],
        [1, 1, 1, 1]
    ];

    let matrizBaseGeral3D = [
        [0, 0, 0, 1],   // V
        [2, 0, 0, 1],   // V1
        [2, 2, 0, 1],   // V2
        [0, 2, 0, 1],   // V3
        [0, 0, 2, 1],   // V4
        [2, 0, 2, 1],   // V5
        [2, 2, 2, 1],   // V6
        [0, 2, 2, 1]    // V7
    ];
    
    let facesCubo = [
        [0, 1, 2, 3],  // Face frontal
        [4, 5, 6, 7],  // Face traseira
        [0, 1, 5, 4],  // Face lateral esquerda
        [2, 3, 7, 6],  // Face lateral direita
        [1, 2, 6, 5],  // Face superior
        [0, 3, 7, 4]   // Face inferior
    ];
    
    /* *************************** Area de Recorte COHEN-SUTHERLAND ********************************** */
    let matrizCoordRetas = [];
    const matrizAreaDeRecorte = desenhar.areaDeRecorteCohen(altura, largura); //a funcao areaDeRecorteCohen retorna uma matriz com as coordenadas exatas do quadrado central desenhado no canvas para ser desenhado como area de recorte
    
    /* ****************************** Lista para saida da viewPort *********************************** */
    var listaParaAViewPort = [];

    /* ***************************************** BOTOES ********************************************* */

    // Adiciona um ouvinte de evento para o movimento do mouse no canvas para atualização das coordenadas
    canvas.addEventListener("mousemove", atualizarCoordenadas);

    // Ouvinte de evento para o botão "LimparPixel"
    btnLimparPixel.addEventListener('click', () => {
        //desativa os botoes da viewPort apos limpar desenho
        btnTransferirParaViewPort.disabled = true;

        // Limpa o conteúdo do canvas
        limpaTela(ctx);
        limparSaidaDeDadosTextarea();
    });

    // Ouvinte de evento para o botão "LimparRetas"
    btnLimparReta.addEventListener('click', () => {
        //desativa os botoes da viewPort apos limpar desenho
        btnTransferirParaViewPort.disabled = true;

        // Limpa o conteúdo do canvas
        limpaTela(ctx);
        limparSaidaDeDadosTextarea();
    });

    // Ouvinte de evento para o botão "LimparCircunferencias"
    btnLimparCircunferencia.addEventListener('click', () =>{
        //desativa os botoes da viewPort apos limpar desenho
        btnTransferirParaViewPort.disabled = true;

        // Limpa o conteúdo do canvas
        limpaTela(ctx);
        limparSaidaDeDadosTextarea();
    });

    btnLimparElipse.addEventListener('click', () => {
        //desativa os botoes da viewPort apos limpar desenho
        btnTransferirParaViewPort.disabled = true;

        // Limpa o conteúdo do canvas
        limpaTela(ctx);
        limparSaidaDeDadosTextarea();
    });

    // Ouvinte de evento para o botão "LimparTransformações"
    btnLimpaTransformacoes.addEventListener('click', () => {
        //desativa os botoes da viewPort apos limpar desenho
        btnTransferirParaViewPort.disabled = true;

        matrizBaseGeral = [
            [0, 50, 50, 0],
            [0, 0, -50, -50],
            [1, 1, 1, 1]
        ];

        limpaTela(ctx);
        desenhar.Eixos2D(ctx, canvas);
        desenhar.Quadrado(matrizBaseGeral, ctx);
        limparSaidaDeDadosTextarea();
    });

    // Ouvinte de evento para o botão "LimparRetaCohen"
    btnLimparRetaCohen.addEventListener('click', () => {
        limpaTela(ctx);
        desenhar.CohenSutherland(ctx, altura,largura);
        desenhar.Quadrado(matrizAreaDeRecorte, ctx);
        limparSaidaDeDadosTextarea();
    });

    btnLimparCanvasBatimentos.addEventListener('click', () => {
        if(continuarExecucao){
            cancelAnimationFrame(continuarExecucao);
        }
        limpaTela(ctx);
        desenhar.batimentosCardiacos(ctx);
    });

    btnLimpaTransformacoes3D.addEventListener('click', () => {
        btnTransferirParaViewPort.disabled = true;
        //matrizBaseGeral3D = [
        //    [-1, -1, -1, 1],  // V0
        //    [1, -1, -1, 1],   // V1
        //    [1, 1, -1, 1],    // V2
        //    [-1, 1, -1, 1],   // V3
        //    [-1, -1, 1, 1],   // V4
        //    [1, -1, 1, 1],    // V5
        //    [1, 1, 1, 1],     // V6
        //    [-1, 1, 1, 1]     // V7
        //];
        matrizBaseGeral3D = [
            [0, 0, 0, 1],   // V
            [2, 0, 0, 1],   // V1
            [2, 2, 0, 1],   // V2
            [0, 2, 0, 1],   // V3
            [0, 0, 2, 1],   // V4
            [2, 0, 2, 1],   // V5
            [2, 2, 2, 1],   // V6
            [0, 2, 2, 1]    // V7
        ];
        
        facesCubo = [
            [0, 1, 2, 3],  // Face frontal
            [4, 5, 6, 7],  // Face traseira
            [0, 1, 5, 4],  // Face lateral esquerda
            [2, 3, 7, 6],  // Face lateral direita
            [1, 2, 6, 5],  // Face superior
            [0, 3, 7, 4]   // Face inferior
        ];
        desenhar3D.Cubo(canvas3D, matrizBaseGeral3D, facesCubo);
        limparSaidaDeDadosTextarea();
    });

    btnLimparViewPort.addEventListener('click', () => {
        //desativa botão de limpar apos click
        btnLimparViewPort.disabled = true;
        btnVisualizar.disabled = true;
        listaParaAViewPort = [];
        limpaTela(ctxViewPort);
    });

    //Ouvinte de evento para o botão limpar saida do textarea
    btnLimparSaidaTextarea.addEventListener('click', () => {
        limparSaidaDeDadosTextarea();
    });

    // Ouvinte de evento para o botão "DesenharPixel"
    btnDesenharPixel.addEventListener('click', () => {

        // Obtém os valores dos inputs
        let valorX = parseInt(inputXPixel.value);
        let valorY = parseInt(inputYPixel.value);

        if(isNaN(valorX) || isNaN(valorY)){
            alert("Digite os valores do ponto.");
        }
        else{
            ativaPixel(canvas.getContext('2d'), valorX, valorY);            
            setarDadosParaSaidaDeDados("\nFunção de Ativação de PIXEL.\n\n" + 
                "P( X: " + valorX.toFixed(0) + " , Y: " + valorY.toFixed(0) + " )\n"
            );
        }        
        
    });

    // Ouvinte de evento para o botão "DesenharRetas"
    btnDesenharReta.addEventListener('click', () => {
        //ativa o botão de transferir para viewPort
        btnTransferirParaViewPort.disabled = false;

        limparSaidaDeDadosTextarea();
        // Obtém os valores dos inputs
        let valorXP1 = parseInt(inputXP1.value);
        let valorYP1 = parseInt(inputYP1.value);
        let valorXP2 = parseInt(inputXP2.value);
        let valorYP2 = parseInt(inputYP2.value);

        if(isNaN(valorXP1) || isNaN(valorYP1) || isNaN(valorXP2) || isNaN(valorYP2) ){
            alert("Digite os valores dos pontos.");
        }
        else{
            listaParaAViewPort = [];
            listaParaAViewPort.push({
                tipo: "reta",
                pontos:[
                    {x: valorXP1, y: valorYP1},
                    {x: valorXP2, y: valorYP2}
                ]
            });
            // Obtém a opção selecionada
            let opcaoSelecionada = document.getElementById('opcoes2D').value;

            switch(opcaoSelecionada){                
                case "opcao2":
                    DDA(valorXP1, valorYP1, valorXP2, valorYP2, ctx);                    
                break;

                case "opcao3":
                    retaPontoMedio(valorXP1, valorYP1, valorXP2, valorYP2, ctx);
                break;

                default:
                    alert("Falha no sistema.");
                break;
            }
        }        
        
    });

    //Ouvinte de evento para o botão "Desenhar Circunferencia"
    btnDesenharCircunferencia.addEventListener('click', () => {
        //ativa o botão de transferir para viewPort
        btnTransferirParaViewPort.disabled = false;
        limparSaidaDeDadosTextarea();
        //Obtem o raio
        let raio = parseInt(inputRaio.value);

        if(isNaN(raio)){
            alert('Digite o Raio.');
        }
        else{
            listaParaAViewPort = [];
            listaParaAViewPort.push({
                tipo: "circunferencia",
                raio: raio
            });

            // Obtém a opção selecionada
            let opcaoSelecionada = document.getElementById('opcoes2D').value;

            switch(opcaoSelecionada){
                case "opcao4":
                    circunferenciaPolinomial(raio, ctx);
                break;

                case "opcao5":
                    circunferenciaTrigonometrica(raio, ctx);
                break;

                case "opcao6":
                    circunferenciaPontoMedio(raio, ctx);
                break;
            }
        }
    });

    //Ouvinte de evento para o botão "Desenhar Elipse"
    btnDesenharElipse.addEventListener('click', () => {
        btnTransferirParaViewPort.disabled = false;
        limparSaidaDeDadosTextarea();

        let OrigemX = parseInt(inputOrigemX.value);
        let OrigemY = parseInt(inputOrigemY.value);
        let inputRaioX = parseInt(inputElipseRaioX.value);
        let inputRaioY = parseInt(inputElipseRaioY.value);

        if(isNaN(inputRaioX) || isNaN(inputRaioY)){
            alert("Digite valores validos.");
        }else {
            //se deixar o input em branco abribui 0 as variaveis para ser desenhado com o centro na origem
            if(!OrigemX && !OrigemY){ 
                OrigemX = 0; 
                OrigemY = 0;
            }
            listaParaAViewPort.push({
                tipo: "elipse",
                origemX: OrigemX,
                origemY: OrigemY,
                raioX: inputRaioX,
                raioY: inputRaioY,
            });
            //chama o algoritmo de desenho da elipse
            elipsePontoMedio(OrigemX, OrigemY, inputRaioX, inputRaioY, ctx);
        }

    });

    // Função para aplicar a transformação desejada
    function aplicarTransformacao() {
    
        if (document.getElementById('checkTranslacao').checked) {            
            const xTranslacao = parseFloat(document.getElementById('xTranslacao').value);
            const yTranslacao = parseFloat(document.getElementById('yTranslacao').value);

            if (!isNaN(xTranslacao) && !isNaN(yTranslacao)) {
                matrizBaseGeral = Translacao(matrizBaseGeral, xTranslacao, -yTranslacao);    
                limpaTela(ctx);
                desenhar.Eixos2D(ctx, canvas);
                desenhar.Quadrado(matrizBaseGeral, ctx); 
                listaParaAViewPort = [];
                listaParaAViewPort = matrizBaseGeral; 
            } 
            else {
                alert('Por favor, insira valores numéricos válidos para a translação.');
            }
        }

        if(document.getElementById('checkEscala').checked){
            const xEscala = parseFloat(document.getElementById('xEscala').value);
            const yEscala = parseFloat(document.getElementById('yEscala').value);

            if(!isNaN(xEscala) && !isNaN(yEscala)){
                matrizBaseGeral = Escala(matrizBaseGeral, xEscala, yEscala);                
                limpaTela(ctx);                
                desenhar.Eixos2D(ctx, canvas);             
                desenhar.Quadrado(matrizBaseGeral, ctx);
                listaParaAViewPort = [];
                listaParaAViewPort = matrizBaseGeral;                
            }
            else {
                alert('Por favor, insira valores numéricos válidos para a Escala.');
            }
        }

        if(document.getElementById('checkRotacao').checked){            
            const AnguloRotacao = parseFloat(document.getElementById('AnguloRotacao').value);

            if(!isNaN(AnguloRotacao)){
                matrizBaseGeral = Rotacao(matrizBaseGeral, AnguloRotacao);                
                limpaTela(ctx);                
                desenhar.Eixos2D(ctx, canvas);
                desenhar.Quadrado(matrizBaseGeral, ctx);
                listaParaAViewPort = [];
                listaParaAViewPort = matrizBaseGeral;
            }
            else {
                alert('Por favor, insira valores numéricos válidos para a Rotação.');
            }
        }

        if(document.getElementById('checkCisalhamento').checked){
            const valorCisalhamentoX = parseFloat(document.getElementById('xCisalhamento').value);
            const valorCisalhamentoY = parseFloat(document.getElementById('yCisalhamento').value);
            
            if(valorCisalhamentoX === 0){
                matrizBaseGeral = cisalhamentoY(matrizBaseGeral, -valorCisalhamentoY);
                limpaTela(ctx);
                desenhar.Eixos2D(ctx, canvas);
                desenhar.Quadrado(matrizBaseGeral, ctx);
                listaParaAViewPort = [];
                listaParaAViewPort = matrizBaseGeral;
            }
            else if(valorCisalhamentoY === 0){
                matrizBaseGeral = cisalhamentoX(matrizBaseGeral, -valorCisalhamentoX);
                limpaTela(ctx);
                desenhar.Eixos2D(ctx, canvas);
                desenhar.Quadrado(matrizBaseGeral, ctx);
                listaParaAViewPort = [];
                listaParaAViewPort = matrizBaseGeral;
            }
            else if(!isNaN(valorCisalhamentoX) && !isNaN(valorCisalhamentoY)){
                matrizBaseGeral = cisalhamentoX(matrizBaseGeral, -valorCisalhamentoX);
                matrizBaseGeral = cisalhamentoY(matrizBaseGeral, -valorCisalhamentoY);
                limpaTela(ctx);
                desenhar.Eixos2D(ctx, canvas);
                desenhar.Quadrado(matrizBaseGeral, ctx);
                listaParaAViewPort = [];
                listaParaAViewPort = matrizBaseGeral;
            } 
            else{
                alert("Digite os valores de cisalhamento.\nCaso NÃO deseje cisalhar em algum eixo, digite o valor 0.");
            }
        }
        
        if (document.getElementById('checkReflexao').checked) {            
            if (document.getElementById('xReflexao').checked && !document.getElementById('yReflexao').checked) {                
                matrizBaseGeral = ReflexaoX(matrizBaseGeral);                
                limpaTela(ctx);                
                desenhar.Eixos2D(ctx, canvas);               
                desenhar.Quadrado(matrizBaseGeral, ctx);
                listaParaAViewPort = [];
                listaParaAViewPort = matrizBaseGeral;
            }
            else if (document.getElementById('yReflexao').checked && !document.getElementById('xReflexao').checked) {                
                matrizBaseGeral = ReflexaoY(matrizBaseGeral);                
                limpaTela(ctx);                
                desenhar.Eixos2D(ctx, canvas);             
                desenhar.Quadrado(matrizBaseGeral, ctx);
                listaParaAViewPort = [];
                listaParaAViewPort = matrizBaseGeral;
            }
            else if(document.getElementById('xReflexao').checked && document.getElementById('yReflexao').checked){                
                matrizBaseGeral = ReflexaoX(matrizBaseGeral);
                matrizBaseGeral = ReflexaoY(matrizBaseGeral);
                limpaTela(ctx);                
                desenhar.Eixos2D(ctx, canvas);               
                desenhar.Quadrado(matrizBaseGeral, ctx);
                listaParaAViewPort = [];
                listaParaAViewPort = matrizBaseGeral;
            } 
            else{
                alert("Marque alguma opção de REFLEXÃO!!");
            }
        }
    }

       // chama a function aplicarTransformacao(), aplica a transformação desejada quando o botão é clicado
    btnAplicaTransformacoes.addEventListener('click', () => {
        //ativa o botão de transferir para viewPort
        btnTransferirParaViewPort.disabled = false;
        limparSaidaDeDadosTextarea();
        listaParaAViewPort = [];
        aplicarTransformacao();
    });

    btnDesenharRetaCohen.addEventListener('click', () => {
        let quantRetas = parseInt(inputRetas.value);

        if(isNaN(quantRetas) || quantRetas <= 0){
            alert("Digite os valores validos para os pontos.");
        }
        //limpa as coordenadas anteriores
        matrizCoordRetas = []

        //preenche a matriz com coordenadas aleatorias no intervalo de -700 e 700
        for(let i = 0; i < quantRetas; i++){
            const min = -700;
            const max = 700;
            
            let X1 = Math.random() * (max - min) + min;
            let Y1 = Math.random() * (max - min) + min;
            let X2 = Math.random() * (max - min) + min;
            let Y2 = Math.random() * (max - min) + min;

            matrizCoordRetas.push({ X1, Y1, X2, Y2 }); // Armazena as coordenadas no array
            DDA(X1, Y1, X2, Y2, ctx); //deseha a reta
        }

    });

    btnAplicarCohen.addEventListener('click', () => {
        //armazenando xmin ymin xmax ymax da area de recort
        const xmin = matrizAreaDeRecorte[0][3];
        const ymin = matrizAreaDeRecorte[1][0];
        const xmax = matrizAreaDeRecorte[0][1];
        const ymax = matrizAreaDeRecorte[1][2];

        //limpa a tela antes de redesenhar as retas
        limpaTela(ctx);
        desenhar.CohenSutherland(ctx, altura, largura);
        desenhar.Quadrado(matrizAreaDeRecorte, ctx);
        limparSaidaDeDadosTextarea();
        setarDadosParaSaidaDeDados("\nNovas Coordenadas das Retas: \n\n");
        
        //percorre a matriz de coordenadas e redesenha as retas que foram retornadas do alg de cohen
        for(const coord of matrizCoordRetas){
            let newCoords = cohenSutherland(coord.X1, coord.Y1, coord.X2, coord.Y2, xmin, ymin, xmax, ymax);

            if (newCoords) { //se o retorno de cohenSutherland n for null redesenha as retas recortadas
                const { x1, y1, x2, y2 } = newCoords;
                DDA(x1, y1, x2, y2, ctx, "lightseagreen"); 
            }

        }

    });

    btnAplicarBatimentos.addEventListener('click', () => {
        let idade = parseInt(inputIdade.value);
        let situacao = parseInt(inputSituacao.value);
        if(isNaN(idade) || isNaN(situacao)){
            alert("Digite os valores dos pontos.");
        }else{
            if(continuarExecucao){
                cancelAnimationFrame(continuarExecucao);
            }
            desenharECG(canvas,ctx, idade, situacao);
        }
    });

    function aplicarTransformacao3D(){
        let matrizTransformada = matrizBaseGeral3D.slice();
        //verifica se foi digitado algum valor, se n for, atribui 0 a variavel
        function parseInput(value) {
            const parsedValue = parseFloat(value);
            return isNaN(parsedValue) ? 0 : parsedValue;
        }

        if(document.getElementById('checkTranslacao3D').checked){
            const tx = parseInput(document.getElementById('xTranslacao3D').value);
            const ty = parseInput(document.getElementById('yTranslacao3D').value);
            const tz = parseInput(document.getElementById('zTranslacao3D').value);
            
            matrizTransformada = translacao3D(matrizTransformada, tx, ty, tz);
        }
        if(document.getElementById('checkEscala3D').checked){
            let sx = parseFloat(document.getElementById('xEscala3D').value || 1); // se n for digitado nada no input é atribuido 1 a variavel
            let sy = parseFloat(document.getElementById('yEscala3D').value || 1);
            let sz = parseFloat(document.getElementById('zEscala3D').value || 1);

            //verifica se é igual a zero
            if(sx === 0 || sy === 0 || sz === 0){
                alert("Digite um número Válido");
            }else{
                matrizTransformada = escala3D(matrizTransformada, sx, sy, sz);
            }
        }
        if (document.getElementById('checkRotacao3D').checked) {
            // Obtenha os valores dos campos de entrada
            const angulox = parseFloat(document.getElementById('AnguloRotacao3Dx').value);
            const anguloy = parseFloat(document.getElementById('AnguloRotacao3Dy').value);
            const anguloz = parseFloat(document.getElementById('AnguloRotacao3Dz').value);
        
            // Aplica a rotação em X, se o valor for um número válido
            if (!isNaN(angulox)) {
                matrizTransformada = rotacaoX3D(matrizTransformada, angulox);
            }
            // Aplica a rotação em Y, se o valor for um número válido
            if (!isNaN(anguloy)) {
                matrizTransformada = rotacaoY3D(matrizTransformada, anguloy);
            }
            // Aplica a rotação em Z, se o valor for um número válido
            if (!isNaN(anguloz)) {
                matrizTransformada = rotacaoZ3D(matrizTransformada, anguloz);
            }
        }
        if(document.getElementById('checkCisalhamento3D').checked){
            const shxy = parseInput(document.getElementById('xyCisalhamento3D').value || 0);
            const shxz = parseInput(document.getElementById('xzCisalhamento3D').value || 0);
            const shyx = parseInput(document.getElementById('yxCisalhamento3D').value || 0);
            const shyz = parseInput(document.getElementById('yzCisalhamento3D').value || 0);
            const shzx = parseInput(document.getElementById('zxCisalhamento3D').value || 0);
            const shzy = parseInput(document.getElementById('zyCisalhamento3D').value || 0);

            //console.log("XY"+shxy + " XZ"+shxz + " YX"+shyx + " YZ"+shyz + " ZX"+shzx + " ZY"+shzy);
            matrizTransformada = cisalhamentoGeral3D(matrizTransformada, shxy, shxz, shyx, shyz, shzx, shzy);      
        }
        if(document.getElementById('checkReflexao3D').checked){
            if(document.getElementById('xyReflexao3D').checked){
                //reflexão xy
                matrizTransformada = reflexaoXY3D(matrizTransformada);
            }
            else if(document.getElementById('xzReflexao3D').checked){
                //reflexão em xz
                matrizTransformada = reflexaoXZ3D(matrizTransformada);                
            }
            else if(document.getElementById('yzReflexao3D').checked){
                //reflexão em yz
                matrizTransformada = reflexaoYZ3D(matrizTransformada);
            }
            else {
                alert('marque uma reflexão!');
            }
            
        }

        desenhar3D.Cubo(canvas3D, matrizTransformada, facesCubo);   
    }

    btnAplicaTransformacoes3D.addEventListener('click', () => {
        aplicarTransformacao3D();
    });

    btnAplicaProjecoes.addEventListener('click', () => {
        let projecao;
        if(projecaoPerspectiva.checked){
            projecao = 'perspectiva';
        }else if(projecaoParalelaIsometrica.checked){
            projecao = 'isometrica';
        }else if (projecaoParalelaOrtografica.checked){
            projecao = 'ortografica';
        }
        matrizBaseGeral3D = [
            [-1, -1, -1, 1],  // V0
            [1, -1, -1, 1],   // V1
            [1, 1, -1, 1],    // V2
            [-1, 1, -1, 1],   // V3
            [-1, -1, 1, 1],   // V4
            [1, -1, 1, 1],    // V5
            [1, 1, 1, 1],     // V6
            [-1, 1, 1, 1]     // V7
        ];
        desenhar3D.CuboVisualizacao(canvas3D, matrizBaseGeral3D, facesCubo, projecao);
    });

    //Ouvinte para verificar se a opção selecionada foi a de transformações ou Cohen e desenhar no canvas
    inputOpcoes2D.addEventListener('change', () => {
        var opcaoSelecionada = inputOpcoes2D.value;
        if(opcaoSelecionada === "opcao8"){
            limpaTela(ctx);
            limparSaidaDeDadosTextarea();
            desenhar.Eixos2D(ctx, canvas);
            desenhar.Quadrado(matrizBaseGeral, ctx);
        }
        else if(opcaoSelecionada === "opcao9"){
            limpaTela(ctx);
            limparSaidaDeDadosTextarea();
            desenhar.Eixos2D(ctx, canvas);
            desenhar.Quadrado(matrizBaseGeral, ctx);
        }
        else if(opcaoSelecionada === "opcao10"){
            limpaTela(ctx);
            limparSaidaDeDadosTextarea();
            desenhar.CohenSutherland(ctx, altura,largura);
            desenhar.Quadrado(matrizAreaDeRecorte, ctx);
        }
        else if(opcaoSelecionada === "opcao11"){
            limpaTela(ctx);
            desenhar.batimentosCardiacos(ctx);
        }
        else{
            limpaTela(ctx);
            limparSaidaDeDadosTextarea();
        }        
    });

    inputOpcoes3D.addEventListener('change', () => {
        let opcao = inputOpcoes3D.value;

        if(opcao === "opcao1"){
            limparSaidaDeDadosTextarea();
            desenhar3D.Cubo(canvas3D, matrizBaseGeral3D, facesCubo);
            /* CRIAR FUNÇÃO DE DESENHAR CUBO */
        }else if(opcao === "opcao2"){
            limparSaidaDeDadosTextarea();
        }else {
            // nengum selecionado
            limpaTela(ctx);
            
        }
    });

    // limpa a tela se mudar de 2d para 3d ou vice versa, alem de mudar o canvas de 2d pra 3d
    checkboxEscolhido2dE3d.forEach(function(checkbox) {
        checkbox.addEventListener('click', function() {
            if (this.id === '2D') {
                if (this.checked) {
                    document.getElementById('3D').checked = false;
                    canvas3D.style.display = 'none';
                    canvas.style.display = 'block'; 
                    limpaTela(ctx);
                    
                }
            } else if (this.id === '3D') {
                if (this.checked) {
                    document.getElementById('2D').checked = false;
                    canvas.style.display = 'none';
                    canvas3D.style.display = 'block';
                    desativarAtualizacaoCoordenadas();
                    desenhar3D.Cubo(canvas3D, matrizBaseGeral3D, facesCubo);
                    limpaTela(ctx);

                }
            }
        });
    });

    //*********************************************OUVINTES DA ENTRADA DA VP E DO CANVASVP************************************************* */
        // Ouvinte para o botão transferir para ViewPort
    btnTransferirParaViewPort.addEventListener('click', () => {
        //ativa o botão de limpar viewPort
        btnLimparViewPort.disabled = false;
        btnVisualizar.disabled = false;

        // Define valores iniciais de Xmin, Xmax, Ymin e Ymax
        let Xmin = 0;
        let Xmax = canvas.width;
        let Ymin = 0;
        let Ymax = canvas.height;

        // Processa a lista de dados para ViewPort
        listaParaAViewPort.forEach(entrada => {
            if (entrada.tipo === 'reta') {
                // Processa reta
                entrada.pontos.forEach(ponto => {
                    Xmin = Math.min(Xmin, ponto.x);
                    Xmax = Math.max(Xmax, ponto.x);
                    Ymin = Math.min(Ymin, ponto.y);
                    Ymax = Math.max(Ymax, ponto.y);
                });
            } 
            else if (entrada.tipo === 'circunferencia') {
                // Processa circunferência
                const raio = entrada.raio;
                Xmin = Math.min(Xmin, -raio);
                Xmax = Math.max(Xmax, raio);
                Ymin = Math.min(Ymin, -raio);
                Ymax = Math.max(Ymax, raio);
            }
            else if(entrada.tipo === 'elipse'){
                // Processa elipse
                const { origemX, origemY, raioX, raioY } = entrada;
                Xmin = Math.min(Xmin, origemX - raioX);
                Xmax = Math.max(Xmax, origemX + raioX);
                Ymin = Math.min(Ymin, origemY - raioY);
                Ymax = Math.max(Ymax, origemY + raioY);
            }
            else {
                const [xArray, yArray, wArray] = entrada;
                // Percorra os arrays xArray e yArray para calcular os valores mínimos e máximos
                for (let i = 0; i < xArray.length; i++) {
                    const x = xArray[i];
                    const y = yArray[i];

                    // Atualize Xmin e Xmax com base nos valores de x
                    Xmin = Math.min(Xmin, x);
                    Xmax = Math.max(Xmax, x);

                    // Atualize Ymin e Ymax com base nos valores de y
                    Ymin = Math.min(Ymin, y);
                    Ymax = Math.max(Ymax, y);
                }
            }
        });

        // Define valores de Umin, Umax, Vmin e Vmax
        let Umin = 0;
        let Umax = larguraVP;
        let Vmin = 0;
        let Vmax = alturaVP;

        // Chama a função processarListaViewport com os valores calculados
        processarListaViewport(listaParaAViewPort, Xmin, Xmax, Ymin, Ymax, Umin, Umax, Vmin, Vmax, ctxViewPort);
    });

    // Mostrar o canvasModal ao clicar no botão
    btnVisualizar.addEventListener("click", function() {
        canvasModal.style.display = "block";
        disableOtherSections(); // Desativa as outras seções e seus elementos
    });

    // Fechar o canvasModal ao clicar no botão de fechar
    closeModal.addEventListener("click", function() {
        canvasModal.style.display = "none";
        enableOtherSections(); // Ativa as outras seções e seus elementos
    });

    // Criar um novo canvas ao clicar no botão de criar canvas
    criarCanvasBtn.addEventListener("click", function() {
        disableOtherSections(); // Desativa as outras seções e seus elementos
        canvasContainer.style.display = "block"; // Mostra o canvasContainer
        canvasModal.style.display = "none"; // Esconde o canvasModal        
    
        let mensagem = "";
        // Verificar se a largura ou a altura ultrapassam as dimensões da janela
        if (larguraInput.value > window.innerWidth || alturaInput.value > window.innerHeight) {
            mensagem = `Para poder visualizar algo...\nA largura máxima permitida é ${window.innerWidth}px.\nA altura máxima permitida é ${window.innerHeight}px.`;
            alert(mensagem);
            disableOtherSections(); // Desativa as outras seções e seus elementos
            canvasContainer.style.display = "none"; // Mostra o canvasContainer
            canvasModal.style.display = "block"; // Esconde o canvasModal
            return;
        }
        else if(larguraInput.value < 50 || alturaInput.value < 50){
            mensagem = `Para poder visualizar algo....\nA largura mínima permitida é ${50}px. \nA altura mínina permitida é ${50}px.`;
            alert(mensagem);
            disableOtherSections(); // Ativa as outras seções e seus elementos
            canvasContainer.style.display = "none"; // Mostra o canvasContainer
            canvasModal.style.display = "block"; // Esconde o canvasModal
            return;
        }
        else {
            // Aplicar o tamanho definido pelo usuário ao canvas
            disableOtherSections(); // Ativa as outras seções e seus elementos
            canvass.width = larguraInput.value;
            canvass.height = alturaInput.value;
            canvasModal.style.display = "none"; // Esconde o canvasModal            
            canvasContainer.style.display = "block"; // Mostra o canvasContainer
            fecharCanvas.style.pointerEvents = "auto";            
        }
        
        ctxVP.translate(larguraInput.value/2, alturaInput.value/2);

        // Define valores iniciais de Xmin, Xmax, Ymin e Ymax
        let Xmin = 0;
        let Xmax = canvas.width;
        let Ymin = 0;
        let Ymax = canvas.height;

        // Processa a lista de dados para ViewPort
        listaParaAViewPort.forEach(entrada => {
            if (entrada.tipo === 'reta') {
                // Processa reta
                entrada.pontos.forEach(ponto => {
                    Xmin = Math.min(Xmin, ponto.x);
                    Xmax = Math.max(Xmax, ponto.x);
                    Ymin = Math.min(Ymin, ponto.y);
                    Ymax = Math.max(Ymax, ponto.y);
                });
            } 
            else if (entrada.tipo === 'circunferencia') {
                // Processa circunferência
                const raio = entrada.raio;
                Xmin = Math.min(Xmin, -raio);
                Xmax = Math.max(Xmax, raio);
                Ymin = Math.min(Ymin, -raio);
                Ymax = Math.max(Ymax, raio);
            }
            else if(entrada.tipo === 'elipse'){
                // Processa elipse
                const { origemX, origemY, raioX, raioY } = entrada;
                Xmin = Math.min(Xmin, origemX - raioX);
                Xmax = Math.max(Xmax, origemX + raioX);
                Ymin = Math.min(Ymin, origemY - raioY);
                Ymax = Math.max(Ymax, origemY + raioY);
            }
            else {
                const [xArray, yArray, wArray] = entrada;
                // Percorra os arrays xArray e yArray para calcular os valores mínimos e máximos
                for (let i = 0; i < xArray.length; i++) {
                    const x = xArray[i];
                    const y = yArray[i];

                    // Atualize Xmin e Xmax com base nos valores de x
                    Xmin = Math.min(Xmin, x);
                    Xmax = Math.max(Xmax, x);

                    // Atualize Ymin e Ymax com base nos valores de y
                    Ymin = Math.min(Ymin, y);
                    Ymax = Math.max(Ymax, y);
                }
            }
        });

        // Define valores de Umin, Umax, Vmin e Vmax
        let Umin = 0;
        let Umax = larguraInput.value;
        let Vmin = 0;
        let Vmax = alturaInput.value;
        processarListaViewport(listaParaAViewPort, Xmin, Xmax, Ymin, Ymax, Umin, Umax, Vmin, Vmax, ctxVP);        
    });

    // Adicione o evento de clique ao botão "fecharCanvas"
    fecharCanvas.addEventListener('click', function() {
        enableOtherSections(); // Ativa as outras seções e seus elementos
        canvasContainer.style.display = "none"; // desativa o canvasVP
    });

    // Função para desativar as outras seções e seus elementos
    function disableOtherSections() {
        otherSections.forEach(section => {
            section.style.pointerEvents = "none"; // Desabilita a interação com as outras seções
            Array.from(section.querySelectorAll("*")).forEach(element => {
                element.style.pointerEvents = "none"; // Desabilita a interação com os elementos dentro da seção
            });
        });
    }

    // Função para ativar as outras seções e seus elementos
    function enableOtherSections() {
        otherSections.forEach(section => {
            section.style.pointerEvents = "auto"; // Habilita a interação com as outras seções
            Array.from(section.querySelectorAll("*")).forEach(element => {
                element.style.pointerEvents = "auto"; // Habilita a interação com os elementos dentro da seção
            });
        });
    }


});