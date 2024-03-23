// Carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Inicialização das variáveis globais

    //sobre o canvas
    const painel2D = document.querySelector('.painel2D');
    const canvas = painel2D.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const largura = parseFloat(painel2D.offsetWidth).toFixed(5);
    const altura = parseFloat(painel2D.offsetHeight).toFixed(5);
    canvas.width = largura;
    canvas.height = altura;

    //sobre os checkboxes das informações
    const opcao2DSelecionada = document.getElementById('2D');
    const opcao3DSelecionada = document.getElementById('3D');

    //sobre os checkboxes do canvas
    const opcaoDeEscolhadeDesenhos = document.querySelectorAll('.funcaoParaSerExecultada');
    const opcaoPixelSelecionado = document.getElementById('pixel');
    const opcaoRetaDDASelecionado = document.getElementById('retaDDA');
    const opcaoRetaPontoMedioSelecionado = document.getElementById('retaPontoMedio');
    const opcaoCircunferenciaPontoMedioSelecionado = document.getElementById('circunferenciaPontoMedio');

    // Labels dos checkboxes
    const labelPixel = document.getElementById('labelPixel');
    const labelRetaDDA = document.getElementById('labelRetaDDA');
    const labelRetaPontoMedio = document.getElementById('labelRetaPontoMedio');
    const labelCircunferenciaPMedio = document.getElementById('labelCircunferenciaPMedio');

    const saidaDeInformacoes = document.querySelector('.saidaDeInformacoes');
    const main_content = document.querySelector('.main_content');

    // armazenando posicoes dos pontos;
    let ponto1 = null;
    let ponto2 = null;

    desativarAtivaTodosCheckboxesDoCanvas(-1);

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

        document.getElementById("coordMundo").querySelector("p").innerText = "X: " + coordenadas.x + "\nY: " + coordenadas.y ;
        document.getElementById("coordNorm").querySelector("p").innerText = "X: " + ndcx.toFixed(10) + "\n Y: " + ndcy.toFixed(10);
        document.getElementById("coordTela").querySelector("p").innerText = "X: " + dcx + "\nY: " + dcy ;
    }

    // Função de desenhos 2d
    function desenhaNoCanvasODesenho2DEscolhido(posicaoX, posicaoY) {        
        
        if (opcaoPixelSelecionado.checked) {
            ativaPixel(posicaoX, posicaoY);
        }
        else if(opcaoRetaDDASelecionado.checked){

            if(ponto1 === null){
                ponto1 = {x: posicaoX, y: posicaoY};
            }
            else if(ponto2 === null){
                ponto2 = {x : posicaoX, y: posicaoY};
                DDA(ponto1.x, ponto1.y, ponto2.x, ponto2.y);
                ponto1 = null;
                ponto2 = null;
            }
        }
        else if(opcaoRetaPontoMedioSelecionado.checked){
            if(ponto1 === null){
                ponto1 = {x: posicaoX, y: posicaoY};
            }
            else if(ponto2 === null){
                ponto2 = {x : posicaoX, y: posicaoY};
                retaPontoMedio(ponto1.x, ponto1.y, ponto2.x, ponto2.y);
                ponto1 = null;
                ponto2 = null;
            }
        }
        else if(opcaoCircunferenciaPontoMedioSelecionado.checked){
            var raio = parseInt(prompt("Digite o raio: "));
            
            console.log(typeof raio);
            console.log(raio);

            if( raio > 0){

                circunferenciaPontoMedio(raio);
            }
            else{
                alert('Click novamente no canvas e digite um raio válido e inteiro...')
            }

            

        }
    }

    // Função para desenhar a circunferencia
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

    function ponto_Circulo(x, y){
        var centroX = largura / 2;
        var centroY = altura / 2;
        ativaPixel(centroX + x, centroY - y); 
        ativaPixel(centroX + y, centroY - x);
        ativaPixel(centroX + y, centroY + x);
        ativaPixel(centroX + x, centroY + y);
        ativaPixel(centroX - x, centroY + y);
        ativaPixel(centroX - y, centroY + x);
        ativaPixel(centroX - y, centroY - x);
        ativaPixel(centroX - x, centroY - y);
    }

    //Reta DDA
    function DDA( X1, Y1, X2, Y2){
        var tamanho, I, X, Y, Xinc, Yinc;
        tamanho = Math.abs(X2 - X1);

        if(Math.abs(Y2 - Y1) > tamanho){
            tamanho = Math.abs(Y2 - Y1);
        }

        Xinc = (X2 - X1) / tamanho;
        Yinc = (Y2 - Y1) / tamanho;

        X = X1;
        Y = Y1;

        ativaPixel(Math.round(X), Math.round(Y));
        console.log("X: " + Math.round(X) + "\tY: " + Math.round(Y));

        while (X <= X2){
            X = X + Xinc;
            Y = Y + Yinc;
            ativaPixel(Math.round(X), Math.round(Y));
            console.log("X: " + Math.round(X) + "\tY: " + Math.round(Y));
        }
    }

    //Reta Ponto Médio
    function retaPontoMedio(X1, Y1, X2, Y2){
    
        var dx = Math.abs(X2 - X1);
        var dy = Math.abs(Y2 - Y1);
        var d = 2 * dy - dx;
        var incE = 2 * dy;
        var incNE = 2 * (dy - dx);
        var x = X1;
        var y = Y1;
    
        ativaPixel(x, y);
        console.log("X: " + x + "\tY: " + y);
    
        while(x < X2){
            if(d <= 0){
                d = d + incE;
                x = x + 1;
            }
            else{
                d = d + incNE;
                x = x + 1;
                y = y + 1;
            }
            ativaPixel(x , y);
            console.log("X: " + x + "\tY: " + y);
        }
    }    

    // Função para ativar um pixel
    function ativaPixel(X, Y) {
        var ctx = canvas.getContext('2d');
    
        // Desenhar um pequeno ponto vermelho na posição do clique
        ctx.fillStyle = "red";
        ctx.fillRect(X - 1, Y - 1, 1, 1); // Ativando 1 pixel de tamanho (1x1)
    }

    // Função para desenhar as coordenadas
    function desenharEixosXY() {
        var centroX = largura / 2;
        var centroY = altura / 2;
        ctx.clearRect(0, 0, largura, altura); // Limpa o canvas
        ctx.beginPath();
        ctx.moveTo(0, centroY);
        ctx.lineTo(largura, centroY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centroX, 0);
        ctx.lineTo(centroX, altura);
        ctx.stroke();
    }

    // Função para ativar os desativar os checkboxes do painel canvas
    function desativarAtivaTodosCheckboxesDoCanvas( valor) {

        if(valor === -1){
            opcaoDeEscolhadeDesenhos.forEach(checkbox => {
                checkbox.disabled = true;
                checkbox.checked = false;
            });
        }
        else{
            opcaoDeEscolhadeDesenhos.forEach(checkbox => {
                checkbox.disabled = false;
                checkbox.checked = false;
            });
        }
        
    }    

    // Função para alternar checkboxes do painel de informações
    function desativaOutroCheckboxDoPainelInformacoes(checkboxClicado, outroCheckbox) {

        if (checkboxClicado.checked) {
            outroCheckbox.checked = false;
        }

        if (opcao3DSelecionada.checked) {
            // Se o checkbox 2D for marcado, limpa o canvas e desmarca o checkbox 3D
            desenharEixosXY();
            desativarAtivaTodosCheckboxesDoCanvas(1);
            opcao2DSelecionada.checked = false;
            alteraTextosDasLabelsDoCanvas(2);            
        } 
        else if (opcao2DSelecionada.checked) {
            // Se o checkbox 3D for marcado, desenha os eixos e desmarca o checkbox 2D       
            ctx.clearRect(0, 0, largura, altura);
            opcao3DSelecionada.checked = false;
            desativarAtivaTodosCheckboxesDoCanvas(1);
            alteraTextosDasLabelsDoCanvas(1);
        } 
        else {
            // Se nenhum checkbox estiver marcado, limpa o canvas
            ctx.clearRect(0, 0, largura, altura);
            desativarAtivaTodosCheckboxesDoCanvas(-1);
            alteraTextosDasLabelsDoCanvas(0);
        }
    }

    //função para alternar checkboxes do painel canvas
    function desativaOutroCheckboxDoPainelCanvas(checkboxClicado){
        opcaoDeEscolhadeDesenhos.forEach(checkbox => {
            if (checkbox !== checkboxClicado) {
                checkbox.checked = false;
            }
        });
    }

    //Modificando as labels do canvas quando o tipo de desenho for escolhido
    function alteraTextosDasLabelsDoCanvas( valor ){
        if (valor === 1) {
            // Altere os textos das labels conforme necessário
            labelPixel.textContent = "Pixel";
            labelRetaDDA.textContent = "DDA";
            labelRetaPontoMedio.textContent = "Reta Ponto Médio";
            labelCircunferenciaPMedio.textContent = "Circunferencia Ponto Médio";
    
            // Chame a função para desativar os checkboxes se necessário
            //desativarAtivaTodosCheckboxesDoCanvas(1);
        } else if (valor === 2) {
            // Altere os textos das labels conforme necessário
            labelPixel.textContent = "-----------";
            labelRetaDDA.textContent = "-----------";
            labelRetaPontoMedio.textContent = "-----------";
            labelCircunferenciaPMedio.textContent = "-----------";
    
            // Chame a função para desativar os checkboxes se necessário
            //desativarAtivaTodosCheckboxesDoCanvas(1);
        } else {
            // Altere os textos das labels conforme necessário
            labelPixel.textContent = ".................";
            labelRetaDDA.textContent = ".................";
            labelRetaPontoMedio.textContent = ".................";
            labelCircunferenciaPMedio.textContent = ".................";
    
            // Chame a função para desativar todos os checkboxes
            //desativarAtivaTodosCheckboxesDoCanvas(-1);
        }
    }

    // Script para os eventos de escolha 2D e 3D
    opcao2DSelecionada.addEventListener('click', function() {
        desativaOutroCheckboxDoPainelInformacoes(opcao2DSelecionada, opcao3DSelecionada);
    });
    opcao3DSelecionada.addEventListener('click', function() {
        desativaOutroCheckboxDoPainelInformacoes(opcao3DSelecionada, opcao2DSelecionada);
    });

    // Script para eventos de escolha de desenhos
    opcaoPixelSelecionado.addEventListener('click', function(){
        desativaOutroCheckboxDoPainelCanvas(opcaoPixelSelecionado);
    });
    opcaoRetaDDASelecionado.addEventListener('click', function(){
        desativaOutroCheckboxDoPainelCanvas(opcaoRetaDDASelecionado);
    });
    opcaoRetaPontoMedioSelecionado.addEventListener('click', function(){
        desativaOutroCheckboxDoPainelCanvas(opcaoRetaPontoMedioSelecionado);
    });
    opcaoCircunferenciaPontoMedioSelecionado.addEventListener('click', function(){
        desativaOutroCheckboxDoPainelCanvas(opcaoCircunferenciaPontoMedioSelecionado);
    });

    // Adiciona um ouvinte de evento para o movimento do mouse no canvas
    canvas.addEventListener("mousemove", atualizarCoordenadas);

    
    // Adiciona um ouvinte de eventos para o clique do mouse no canvas
    canvas.addEventListener('mousedown', function(event) {
        // Captura a posição do mouse no canvas
        const posicaoMouse = obterPosicaoDoMouse(event);

        // Verifica se alguma opção de desenho está selecionada
        if (!opcaoPixelSelecionado.checked && !opcaoRetaDDASelecionado.checked && !opcaoRetaPontoMedioSelecionado.checked && !opcaoCircunferenciaPontoMedioSelecionado.checked) {
            alert("Por favor, selecione uma opção de desenho.");
            return; // Encerra a execução da função se nenhuma opção estiver selecionada
        }
        else {
            // Se alguma opção de desenho não estiver selecionada, chama a função para desenhar
            desenhaNoCanvasODesenho2DEscolhido(posicaoMouse.x, posicaoMouse.y);
        }
    });

    function testeteste(){
        ponto_circulo();
    }
    
});
