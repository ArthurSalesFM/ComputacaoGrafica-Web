import { limpaTela } from "../utils/utils.js";

// Variável de controle do loop de execução para parar quando clicar no botão de limpar
export let continuarExecucao;
let velocidadeDesenho = 0.5; // Controla a velocidade do desenho

export function desenharECG(canvas, ctx, idade, situacao) {
    class Ponto {
        constructor(x, y) {
          this.x = x;
          this.y = y;
        }
    }

    var posicaoInicial,
        batimento_maximo = 100,
        batimento_minimo = 30,
        distancia_batimentos = 20,
        distancia_batimento = 10;

    var frequencias = {
        20: { min: 100, max: 170 },
        25: { min: 100, max: 170 },
        30: { min: 95, max: 162 },
        35: { min: 93, max: 157 },
        40: { min: 90, max: 153 },
        45: { min: 88, max: 149 },
        50: { min: 85, max: 145 },
        55: { min: 83, max: 140 },
        60: { min: 80, max: 136 },
        65: { min: 78, max: 132 },
        70: { min: 75, max: 128 },
    };

    var situacoes = {
        0: 90,
        1: 70,
        2: 30,
        3: 20,
        4: 10,
    };

    class ECG {
        constructor() {
            this.pontos = [];
            this.indicePontoAtual = 0;
        }

        criarPontos() {
            this.pontos.push(posicaoInicial);

            for (var i = 1; i < Math.floor(canvas.width / distancia_batimento); i++) {
                var ponto_anterior = Object.assign({}, this.pontos[i - 1]);

                if (i % distancia_batimentos === 0) {
                    var random_pontoInferior = Math.floor(
                        Math.random() * (ponto_anterior.y - batimento_maximo - (ponto_anterior.y - batimento_minimo)) + (ponto_anterior.y - batimento_maximo)
                    );
                    var random_pontoSuperior = Math.floor(
                        Math.random() * (ponto_anterior.y + batimento_maximo - (ponto_anterior.y + batimento_minimo)) + (ponto_anterior.y + batimento_minimo)
                    );

                    var pontoInferior = new Ponto(
                        ponto_anterior.x + distancia_batimento,
                        random_pontoInferior
                    );
                    this.pontos.push(pontoInferior);

                    var pontoSuperior = new Ponto(
                        pontoInferior.x + distancia_batimento,
                        random_pontoSuperior
                    );
                    this.pontos.push(pontoSuperior);
                    i++;
                } else {
                    var point = new Ponto(
                        ponto_anterior.x + distancia_batimento,
                        posicaoInicial.y
                    );
                    this.pontos.push(point);
                }
            }
        }

        reset() {
            this.pontos = [];
            this.criarPontos();
            this.indicePontoAtual = 0;
        }

        mostrarPontos() {
            // Pintar o fundo de preto
            ctx.fillStyle = 'black';
            ctx.fillRect(-canvas.width / 2, ((-canvas.height / 2)-5), canvas.width, canvas.height);
        
            ctx.strokeStyle = 'lime';
            ctx.lineWidth = 1;
            
            for (let i = 1; i < this.indicePontoAtual; i++) {
                let x0 = this.pontos[i - 1].x;
                let y0 = this.pontos[i - 1].y;
                let x1 = this.pontos[i].x;
                let y1 = this.pontos[i].y;
                
                this.desenharLinha(x0, y0, x1, y1);
            }
        
            this.indicePontoAtual += velocidadeDesenho;
        
            if (this.indicePontoAtual >= this.pontos.length) {
                this.reset();
            }
        }
        
        desenharLinha(x0, y0, x1, y1) {
            // Inverte os pontos se x0 for maior que x1
            if (x0 > x1) {
                [x0, x1] = [x1, x0];
                [y0, y1] = [y1, y0];
            }
        
            // Calcula dx e dy
            let dx = Math.abs(x1 - x0);
            let dy = Math.abs(y1 - y0);
        
            // Define a direção de incremento para x e y
            let sx = (x0 < x1) ? 1 : -1;
            let sy = (y0 < y1) ? 1 : -1;
        
            // Inicializa as variáveis para o algoritmo de Ponto Médio
            let err = dx - dy;
        
            while (true) {
                // Pinta o pixel atual
                ctx.fillStyle = 'lime'; // Definir a cor verde aqui
                ctx.fillRect(x0, y0, 1, 1);
        
                // Verifica se atingiu o ponto final
                if (x0 === x1 && y0 === y1) break;
        
                let e2 = err * 2;
        
                // Atualiza a posição (x0, y0) de acordo com o algoritmo de Ponto Médio
                if (e2 > -dy) {
                    err -= dy;
                    x0 += sx;
                }
                if (e2 < dx) {
                    err += dx;
                    y0 += sy;
                }
            }
        }
    }

    function aplicarValores() {
        batimento_minimo = frequencias[idade]["min"];
        batimento_maximo = frequencias[idade]["max"];
        distancia_batimentos = situacoes[situacao];
        ecg.reset();
    }

    var ecg;
    function setup() {
        posicaoInicial = new Ponto(-canvas.width / 2, 0);
        ecg = new ECG();
        ecg.criarPontos();
        aplicarValores();
    }

    function draw() {
        limpaTela(ctx);
        ecg.mostrarPontos();

        continuarExecucao = requestAnimationFrame(draw);
    }

    setup();
    draw();
}
