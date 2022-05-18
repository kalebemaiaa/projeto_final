const images = {
    "peao1": "../img/peao_branco.png",
    "bispo1": "../img/bispo_branco.png",
    "torre1": "../img/torre_branca.png",
    "rei1": "../img/rei_branco.png",
    "rainha1": "../img/rainha_branca.png",
    "cavalo1": "../img/cavalo_branco.png",
    "peao0": "../img/peao_preto.png",
    "bispo0": "../img/bispo_preto.png",
    "torre0": "../img/torre_preta.png",
    "rei0": "../img/rei_preto.png",
    "rainha0": "../img/rainha_preta.png",
    "cavalo0": "../img/cavalo_preto.png"
}

let tabuleiro = [
    [{ type: "torre", time: 0 }, { type: "cavalo", time: 0 }, { type: "bispo", time: 0 }, { type: "rei", time: 0 }, { type: "rainha", time: 0 }, { type: "bispo", time: 0 }, { type: "cavalo", time: 0 }, { type: "torre", time: 0 }],
    [{ type: "peao", time: 0 }, { type: "peao", time: 0 }, { type: "peao", time: 0 }, { type: "peao", time: 0 }, { type: "peao", time: 0 }, { type: "peao", time: 0 }, { type: "peao", time: 0 }, { type: "peao", time: 0 }],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [{ type: "peao", time: 1 }, { type: "peao", time: 1 }, { type: "peao", time: 1 }, { type: "peao", time: 1 }, { type: "peao", time: 1 }, { type: "peao", time: 1 }, { type: "peao", time: 1 }, { type: "peao", time: 1 }],
    [{ type: "torre", time: 1 }, { type: "cavalo", time: 1 }, { type: "bispo", time: 1 }, { type: "rei", time: 1 }, { type: "rainha", time: 1 }, { type: "bispo", time: 1 }, { type: "cavalo", time: 1 }, { type: "torre", time: 1 }]
]

const quadrados = document.querySelectorAll(".quadrado");

let paintThis = [];
let pecaClickada = null;
let turno = 1;

function descobrindoPecas() {
    paintThis = [];
    for (let i = 0; i < tabuleiro.length; i++) {
        for (let k = 0; k < tabuleiro[i].length; k++) {
            if (tabuleiro[i][k] == null) {
                continue;
            }
            const coordenadasPecas = `${k}${i}`;
            paintThis.push({ coordenadas: coordenadasPecas, peca: tabuleiro[i][k] });
        }
    }
}

function trocaTurno() {
    if (turno == 0) {
        turno = 1;
        return;
    }
    turno = 0;
}

function desenhaPeca(type, lugar, time) {
    const imagem = document.createElement('img');

    imagem.setAttribute('src', images[`${type}${time}`]);
    imagem.setAttribute('ID', `help_exibition_uso_`);
    imagem.classList.add('peca');
    imagem.addEventListener('click', (event) => {
        const coordenada_x = parseInt(event.composedPath()[1].id.slice(1, 3)[1]);
        const coordenada_y = parseInt(event.composedPath()[1].id.slice(1, 3)[0]);

        if (tabuleiro[coordenada_x][coordenada_y].time != turno) return;

        for (const classe of event.composedPath()[1].classList) {
            if (classe == "highlightEnemy") {
                matarInimigo(event.composedPath()[1].id.slice(1, 3));
                moverPeca(pecaClickada, event.composedPath()[1].id.slice(1, 3));
            }
        }

        mostrarMovimentos(event.composedPath()[1].id.slice(1, 3));
    });

    document.querySelector(`#_${lugar}`).appendChild(imagem);
}

function removerPeca(lugar) {
    document.querySelector(`#_${lugar}`).removeChild(document.querySelector(`#_${lugar}`).lastChild);
}

function desenharTabuleiro() {
    descobrindoPecas();
    for (const elemento of paintThis) {
        desenhaPeca(elemento.peca.type, elemento.coordenadas, elemento.peca.time);
    }
}

function posiveisMovimentosPeao(posicao, time) {
    let positions = [];
    const posicao_x = parseInt(posicao[1]);
    const posicao_y = parseInt(posicao[0]);

    if (posicao_x == 0 || posicao_x == 7) {
        return positions;
    }

    if (time == 0) {
        if (tabuleiro[posicao_x + 1][posicao_y] == null) {
            if (posicao[1] == '1') {
                positions.push(`${posicao[0]}2`);
                if (tabuleiro[3][parseInt(posicao[0])] != null) {
                    return positions;
                }
                positions.push(`${posicao[0]}3`);
            }
            else {
                positions.push(`${posicao[0]}${posicao_x + 1}`);
            }
        }
        if (tabuleiro[posicao_x + 1][posicao_y + 1] != null) {
            positions.push(`${posicao_y + 1}${posicao_x + 1}`);
        }
        if (tabuleiro[posicao_x + 1][posicao_y - 1] != null) {
            positions.push(`${posicao_y - 1}${posicao_x + 1}`);
        }
    }

    else {
        if (tabuleiro[posicao_x - 1][posicao_y] == null) {
            if (posicao[1] == '6') {
                positions.push(`${posicao[0]}5`);
                if (tabuleiro[4][parseInt(posicao[0])] != null) {
                    return positions;
                }
                positions.push(`${posicao[0]}4`);
            }
            else {
                positions.push(`${posicao[0]}${posicao_x - 1}`);
            }
        }
        if (tabuleiro[posicao_x - 1][posicao_y - 1] != null) {
            positions.push(`${posicao_y - 1}${posicao_x - 1}`);
        }
        if (tabuleiro[posicao_x - 1][posicao_y + 1] != null) {
            positions.push(`${posicao_y + 1}${posicao_x - 1}`);
        }
    }

    return positions;
}

function possiveisMovimentosTorre(posicao) {
    const posicao_x = parseInt(posicao[1]);
    const posicao_y = parseInt(posicao[0]);
    let mais_x = posicao_x + 1;
    let menos_x = posicao_x - 1;
    let mais_y = posicao_y + 1;
    let menos_y = posicao_y - 1;

    let positions = [];

    while (mais_x < 8) {
        positions.push(`${posicao_y}${mais_x}`)
        if (tabuleiro[mais_x][posicao_y] != null) {
            break;
        }
        mais_x++;
    }
    while (menos_x > -1) {
        positions.push(`${posicao_y}${menos_x}`);
        if (tabuleiro[menos_x][posicao_y] != null) {
            break;
        }
        menos_x--;
    }
    while (mais_y < 8) {
        positions.push(`${mais_y}${posicao_x}`);
        if (tabuleiro[posicao_x][mais_y] != null) {
            break;
        }
        mais_y++;
    }
    while (menos_y > -1) {
        positions.push(`${menos_y}${posicao_x}`);
        if (tabuleiro[posicao_x][menos_y] != null) {
            break;
        }
        menos_y--;
    }

    return positions;
}

function possiveisMovimentosCavalo(posicao) {
    const posicao_x = parseInt(posicao[1]);
    const posicao_y = parseInt(posicao[0]);

    let positions = [
        [posicao_x - 1, posicao_y - 2], [posicao_x - 1, posicao_y + 2],
        [posicao_x + 1, posicao_y - 2], [posicao_x + 1, posicao_y + 2],
        [posicao_x - 2, posicao_y - 1], [posicao_x - 2, posicao_y + 1],
        [posicao_x + 2, posicao_y - 1], [posicao_x + 2, posicao_y + 1]
    ]

    for (let i = 0; i < positions.length; i++) {
        for (const numero of positions[i]) {
            if (numero > 7 || numero < 0) {
                positions[i] = null;
            }
        }
    }

    for (let i = 0; i < positions.length; i++) {
        if (positions[i] == null) {
            continue;
        }
        positions[i] = `${positions[i][1]}${positions[i][0]}`;
    }

    return positions;
}

function possiveisMovimentosBispo(posicao) {
    const posicao_x = parseInt(posicao[1]);
    const posicao_y = parseInt(posicao[0]);
    let positions = [];

    let mais_x = posicao_x + 1;
    let menos_x = posicao_x - 1;
    let mais_y = posicao_y + 1;
    let menos_y = posicao_y - 1;

    while (mais_y < 8 && mais_x < 8) {
        positions.push(`${mais_y}${mais_x}`);
        if (tabuleiro[mais_x][mais_y] != null) {
            break;
        }
        mais_y++;
        mais_x++;
    }

    mais_y = posicao_y + 1;
    while (mais_y < 8 && menos_x > -1) {
        positions.push(`${mais_y}${menos_x}`);
        if (tabuleiro[menos_x][mais_y] != null) {
            break;
        }
        mais_y++;
        menos_x--;
    }

    mais_x = posicao_x + 1;
    while (menos_y > -1 && mais_x < 8) {
        positions.push(`${menos_y}${mais_x}`);
        if (tabuleiro[mais_x][menos_y] != null) {
            break;
        }
        menos_y--;
        mais_x++;
    }

    menos_y = posicao_y - 1;
    menos_x = posicao_x - 1;
    while (menos_y > -1 && menos_x > -1) {
        positions.push(`${menos_y}${menos_x}`);
        if (tabuleiro[menos_x][menos_y] != null) {
            break;
        }
        menos_x--;
        menos_y--;
    }

    return positions;
}

function possiveisMovimentosRei(posicao) {
    const posicao_x = parseInt(posicao[1]);
    const posicao_y = parseInt(posicao[0]);
    let positions = [];

    for (let i = -1; i < 2; i++) {
        for (let k = -1; k < 2; k++) {
            if (posicao_x + i < 0 || posicao_y + k < 0 || posicao_x + i > 7 || posicao_y + k > 7) {
                continue;
            }

            positions.push(`${k + posicao_y}${i + posicao_x}`);
        }
    }
    return positions;
}

function possiveisMovimentosRainha(posicao) {
    let positions = [];
    listaRei = possiveisMovimentosRei(posicao);
    listaTorre = possiveisMovimentosTorre(posicao);
    listaBispo = possiveisMovimentosBispo(posicao);
    for (const elemento of listaRei) {
        positions.push(elemento);
    }
    for (const elemento of listaTorre) {
        positions.push(elemento);
    }
    for (const elemento of listaBispo) {
        positions.push(elemento);
    }

    return positions;
}

function iluminar(lista, time) {
    if (lista.length == 0) {
        return;
    }
    for (const elemento of lista) {
        if (elemento == null) {
            continue;
        }
        highlights(document.querySelector(`#_${elemento}`), time);
    }
}

function moverPeca(deOnde, paraOnde) {
    const x_antigo = parseInt(deOnde[0]);
    const x_novo = parseInt(paraOnde[0]);
    const y_antigo = parseInt(deOnde[1]);
    const y_novo = parseInt(paraOnde[1]);

    removerPeca(deOnde);
    desenhaPeca(tabuleiro[y_antigo][x_antigo].type, paraOnde, tabuleiro[y_antigo][x_antigo].time);

    tabuleiro[y_novo][x_novo] = tabuleiro[y_antigo][x_antigo];
    tabuleiro[y_antigo][x_antigo] = null;

    trocaTurno();
    limparHighlights();
}

function highlights(ondeIluminar, time) {
    const valor_x = parseInt(ondeIluminar.id[1]);
    const valor_y = parseInt(ondeIluminar.id[2]);

    if (ondeIluminar.children.length == 0) {
        ondeIluminar.classList.add('highlight');
        return true;
    }
    else {
        if (time != tabuleiro[valor_y][valor_x].time) {
            ondeIluminar.classList.add('highlightEnemy');
            return false;
        }
        else {
            return false;
        }
    }
}

function matarInimigo(posicaoInimigo) {
    const posicao_x = parseInt(posicaoInimigo[0]);
    const posicao_y = parseInt(posicaoInimigo[1]);

    tabuleiro[posicao_y][posicao_x] = null;
    document.querySelector(`#_${posicaoInimigo}`).removeChild(document.querySelector(`#_${posicaoInimigo}`).lastChild);
}

function limparHighlights() {
    for (const quadrado of quadrados) {
        quadrado.classList.remove('highlight');
        quadrado.classList.remove('highlightEnemy');
    }
    pecaClickada = null;
}

function mostrarMovimentos(coordenada) {
    const pecaPassada = tabuleiro[parseInt(coordenada[1])][parseInt(coordenada[0])];

    limparHighlights();

    pecaClickada = coordenada;

    let listaParaIluminar = []
    switch (pecaPassada.type) {
        case "peao":
            listaParaIluminar = posiveisMovimentosPeao(coordenada, pecaPassada.time);
            break;
        case "torre":
            listaParaIluminar = possiveisMovimentosTorre(coordenada);
            break;
        case "cavalo":
            listaParaIluminar = possiveisMovimentosCavalo(coordenada);
            break;
        case "bispo":
            listaParaIluminar = possiveisMovimentosBispo(coordenada);
            break;
        case "rei":
            listaParaIluminar = possiveisMovimentosRei(coordenada);
            break;
        case "rainha":
            listaParaIluminar = possiveisMovimentosRainha(coordenada);
            break;
        default:
            break;
    }
    iluminar(listaParaIluminar, pecaPassada.time);
}

quadrados.forEach((quadrado)=>{
    quadrado.addEventListener('click', () => {
        for (const classe of quadrado.classList) {
            if (classe == 'highlight') {
                moverPeca(pecaClickada, quadrado.id.slice(1, 3));
            }
            else if (classe == 'highlightEnemy') {
                matarInimigo(quadrado.id.slice(1, 3));
                moverPeca(pecaClickada, quadrado.id.slice(1, 3));
            }
        }
    })
})

desenharTabuleiro()