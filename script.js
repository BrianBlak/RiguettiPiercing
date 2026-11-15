/* ==========================================================================
   Riguetti Piercing — mapa interativo, WhatsApp, menu e movimento (GSAP)
   ========================================================================== */

(function () {
  'use strict';

  var ZAP = '5562985206461';
  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var temMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------------------------------------------------- dados ----- */

  // posicao: coordenadas no viewBox 0 0 380 560 da orelha
  var PONTOS = [
    { id: 'Transversal', nome: 'Transversal', x: 228, y: 82,
      cic: '9 a 12 meses', joia: 'Barbell reto de titânio',
      nota: 'Dois furos ligados por uma única barra. Depende muito do formato da sua orelha — eu confiro a anatomia antes de marcar.' },

    { id: 'helix', nome: 'Hélix', x: 300, y: 202,
      cic: '6 a 9 meses', joia: 'Labret reto de titânio',
      nota: 'Na borda de cima. É cartilagem, então pede paciência e cuidado para não dormir em cima nos primeiros meses.' },
    
    { id: 'Mid helix', nome: 'Mid Hélix', x: 290, y: 310,
      cic: '6 a 9 meses', joia: 'Labret reto de titânio',
      nota: 'Na borda de baixo. É cartilagem, então pede paciência e cuidado para não dormir em cima nos primeiros meses.' },

    { id: 'flat', nome: 'Flat', x: 260, y: 176,
      cic: '6 a 9 meses', joia: 'Labret de titânio',
      nota: 'Na parte plana do alto da orelha. Aceita joias maiores e desenhadas depois de cicatrizado.' },

    { id: 'rook', nome: 'Rook', x: 200, y: 170,
      cic: '9 a 12 meses', joia: 'Curva de titânio',
      nota: 'Na dobra interna de cima. Só dá certo se você tiver essa dobra bem definida — dá pra ver numa foto.' },

    { id: 'Forward Helix', nome: 'Forward Helix', x: 170, y: 118,
      cic: '6 a 9 meses', joia: 'Labret de titânio',
      nota: 'Os pontinhos alinhados na frente da orelha. Pode ser um, dois ou três, dependendo do espaço.' },

    { id: 'daith', nome: 'Daith', x: 202, y: 282,
      cic: '6 a 9 meses', joia: 'Argola clicker de titânio',
      nota: 'Abraça a dobra interna. É um dos mais pedidos pela estética e some bem no cabelo solto.' },

    { id: 'conch', nome: 'Conch', x: 242, y: 310,
      cic: '6 a 12 meses', joia: 'Labret de titânio',
      nota: 'No meio da concha. Fica ótimo com argola depois, mas começa com labret pra não enroscar.' },

    { id: 'tragus', nome: 'Tragus', x: 164, y: 322,
      cic: '6 a 9 meses', joia: 'Labret de titânio',
      nota: 'Na abinha que cobre o canal do ouvido. Incomoda pouco na hora e muda bastante o rosto.' },

    { id: 'lobulo', nome: 'Lóbulo', x: 182, y: 440,
      cic: '6 a 8 semanas', joia: 'Labret ou argola de titânio',
      nota: 'O primeiro de quase todo mundo. Cicatriza rápido e depois aceita praticamente qualquer joia.' }
  ];

  var FORA = [
    { id: 'septo', nome: 'Septo',
      cic: '2 a 3 meses', joia: 'Argola clicker de titânio',
      nota: 'Fica no tecido fino entre as narinas, não na cartilagem. Dá pra esconder virando a joia pra dentro.' },

    { id: 'nostril', nome: 'Nostril',
      cic: '4 a 6 meses', joia: 'Labret de titânio',
      nota: 'A asa do nariz. Começa com labret reto e troca pra argola quando estiver fechado.' },

    { id: 'Medusa', nome: 'Medusa',
      cic: '2 a 3 meses', joia: 'Labret de titânio',
      nota: 'No sulco acima do lábio, bem no centro. Inchaço nos primeiros dias é normal.' },

    { id: 'labret', nome: 'Labret',
      cic: '2 a 3 meses', joia: 'Labret de titânio',
      nota: 'Abaixo do lábio inferior, no centro ou na lateral. Medimos a haste pra joia não bater no dente.' },

    { id: 'labret-vertical', nome: 'Labret vertical',
      cic: '2 a 3 meses', joia: 'Curva de titânio',
      nota: 'Entra e sai pelo lábio, sem encostar na gengiva. Visual marcante e cicatrização tranquila.' },

    { id: 'sobrancelha', nome: 'Sobrancelha',
      cic: '3 a 4 meses', joia: 'Curva de titânio',
      nota: 'Superficial, então a joia certa importa muito pra não migrar.' },

    { id: 'lingua', nome: 'Língua',
      cic: '4 a 8 semanas', joia: 'Barbela reta de titânio',
      nota: 'Cicatriza rápido, mas os primeiros dias pedem comida fria e leve. Troco a haste por uma menor quando o inchaço baixa.' },

    { id: 'umbigo', nome: 'Umbigo',
      cic: '6 a 12 meses', joia: 'Curva de titânio',
      nota: 'Roupa justa, academia e praia atrapalham. Vale escolher uma época mais calma do ano.' },

    { id: 'mamilo', nome: 'Mamilo',
      cic: '9 a 12 meses', joia: 'Barbela reta de titânio',
      nota: 'Cicatrização longa e exige paciência com a troca de joia. Atendo com total privacidade.' },

    { id: 'microdermal', nome: 'Microdermal',
      cic: '3 a 6 meses', joia: 'Microdermal de titânio',
      nota: 'Tem só um furo, sem saída. Dá pra aplicar em quase qualquer área plana do corpo.' }
  ];

  var TODOS = {};
  PONTOS.concat(FORA).forEach(function (p) { TODOS[p.id] = p; });

  /* ------------------------------------------------------- whatsapp ----- */

  function linkZap(texto) {
    return 'https://api.whatsapp.com/send?phone=' + ZAP + '&text=' + encodeURIComponent(texto);
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-zap]'), function (el) {
    el.setAttribute('href', linkZap(el.getAttribute('data-zap')));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  /* --------------------------------------------------- menu de celular -- */

  var btnMenu = document.getElementById('abrir-menu');
  var menu = document.getElementById('menu-movel');

  function alternarMenu(abrir) {
    menu.hidden = !abrir;
    btnMenu.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    btnMenu.setAttribute('aria-label', abrir ? 'Fechar o menu' : 'Abrir o menu');
    // trava o fundo para o menu não rolar junto
    document.body.style.overflow = abrir ? 'hidden' : '';

    if (!abrir) { return; }

    if (!semMovimento && window.gsap) {
      gsap.from(menu.querySelectorAll('nav a, .btn'), {
        y: 14, opacity: 0, duration: .34, stagger: .035, ease: 'power2.out'
      });
    }
    var primeiro = menu.querySelector('a');
    if (primeiro) { primeiro.focus(); }
  }

  btnMenu.addEventListener('click', function () {
    alternarMenu(menu.hidden);
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) { alternarMenu(false); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) {
      alternarMenu(false);
      btnMenu.focus();
    }
  });

  // voltando pro desktop, o menu não pode ficar preso aberto
  window.matchMedia('(min-width: 901px)').addEventListener('change', function (ev) {
    if (ev.matches && !menu.hidden) { alternarMenu(false); }
  });

  /* ------------------------------------------------- monta a orelha ----- */

  var NS = 'http://www.w3.org/2000/svg';
  var grupoPontos = document.getElementById('pontos');

  PONTOS.forEach(function (p) {
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'pt');
    g.setAttribute('data-id', p.id);
    g.setAttribute('transform', 'translate(' + p.x + ',' + p.y + ')');
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', p.nome);

    var alvo = document.createElementNS(NS, 'circle');
    alvo.setAttribute('class', 'pt-alvo');
    alvo.setAttribute('r', '20');

    // anel só do foco: as setas do teclado também selecionam o ponto, então
    // foco e seleção se sobrepõem — sem um anel próprio, um apaga o outro
    var foco = document.createElementNS(NS, 'circle');
    foco.setAttribute('class', 'pt-foco');
    foco.setAttribute('r', '18');

    var halo = document.createElementNS(NS, 'circle');
    halo.setAttribute('class', 'pt-halo');
    halo.setAttribute('r', '13');

    var dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('class', 'pt-dot');
    dot.setAttribute('r', '5');

    g.appendChild(alvo);
    g.appendChild(foco);
    g.appendChild(halo);
    g.appendChild(dot);
    grupoPontos.appendChild(g);
  });

  // num mapa de onze pontos, "toque" só vale no celular
  if (temMouse) {
    var dica = document.getElementById('orelha-dica');
    if (dica) { dica.textContent = 'Clique nos pontos, ou use as setas do teclado'; }
  }

  /* --------------------------------------------------- monta chips ----- */

  var listaChips = document.getElementById('chips');

  FORA.forEach(function (p) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = p.nome;
    b.setAttribute('data-id', p.id);
    b.setAttribute('aria-pressed', 'false');
    listaChips.appendChild(b);
  });

  /* ---------------------------------------------------------- ficha ---- */

  var ficha = document.getElementById('ficha');

  function escapar(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function mostrar(id) {
    var p = TODOS[id];
    if (!p) { return; }

    ficha.innerHTML =
      '<h2 class="ficha-nome">' + escapar(p.nome) + '</h2>' +
      '<p class="ficha-nota">' + escapar(p.nota) + '</p>' +
      '<dl class="ficha-dados">' +
        '<div><dt>Cicatrização média</dt><dd>' + escapar(p.cic) + '</dd></div>' +
        '<div><dt>Joia inicial</dt><dd>' + escapar(p.joia) + '</dd></div>' +
      '</dl>' +
      '<a class="btn btn-zap" target="_blank" rel="noopener" href="' +
        linkZap('Oi Bia! Vim pelo site e quero fazer um piercing: ' + p.nome + '. Consegue me passar valor e horário?') +
      '">Quero esse</a>';

    Array.prototype.forEach.call(document.querySelectorAll('.pt'), function (g) {
      g.classList.toggle('ativo', g.getAttribute('data-id') === id);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.chip'), function (c) {
      c.setAttribute('aria-pressed', c.getAttribute('data-id') === id ? 'true' : 'false');
    });

    if (!semMovimento && window.gsap) {
      gsap.fromTo(ficha.children,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: .32, stagger: .045, ease: 'power2.out', overwrite: true });
    }
  }

  document.addEventListener('click', function (e) {
    var alvo = e.target.closest ? e.target.closest('.pt, .chip') : null;
    if (alvo) { mostrar(alvo.getAttribute('data-id')); }
  });

  grupoPontos.addEventListener('keydown', function (e) {
    var g = e.target.closest ? e.target.closest('.pt') : null;
    if (!g) { return; }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      mostrar(g.getAttribute('data-id'));
      return;
    }

    // as setas andam pela orelha na ordem em que os pontos foram desenhados
    var passo = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { passo = 1; }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { passo = -1; }
    if (!passo) { return; }

    e.preventDefault();
    var todos = Array.prototype.slice.call(grupoPontos.querySelectorAll('.pt'));
    var i = todos.indexOf(g);
    var proximo = todos[(i + passo + todos.length) % todos.length];
    proximo.focus();
    mostrar(proximo.getAttribute('data-id'));
  });

  /* ---------------------------------------------------- laço contínuo --- */
  /* Duas faixas da página usam o mesmo mecanismo: as fotos dos trabalhos e os
     depoimentos. Uma cópia do conjunto inteiro vai para o fim; quando o trilho
     anda exatamente a largura de um conjunto (xPercent -50), a cópia está no
     lugar onde o original começou e o salto de volta é invisível.

     A velocidade é dada em pixels por segundo, e não em duração, para não
     depender de quantos itens existem: publicar mais fotos não acelera nada. */
  function montarLaco(trilho, pxPorSegundo) {
    if (!trilho) { return null; }

    var itens = trilho.children;
    // com um item só não há o que percorrer
    if (itens.length < 2) { return null; }
    if (semMovimento || !window.gsap) { return null; }

    var copia = document.createDocumentFragment();
    Array.prototype.forEach.call(itens, function (item) {
      var clone = item.cloneNode(true);
      // a cópia é só visual: leitor de tela já leu o original
      clone.setAttribute('aria-hidden', 'true');
      var img = clone.querySelector('img');
      if (img) { img.alt = ''; }
      copia.appendChild(clone);
    });
    trilho.appendChild(copia);
    trilho.classList.add('em-laco');

    // A largura do trilho muda quando o celular gira, quando a barra do
    // navegador recolhe ou quando as fontes chegam depois do primeiro
    // cálculo. A medida fica numa função para poder ser refeita.
    function medir() {
      return (trilho.scrollWidth || trilho.offsetWidth) / 2;
    }

    var laco = gsap.to(trilho, {
      xPercent: -50,
      ease: 'none',
      duration: Math.max(medir(), 1) / pxPorSegundo,
      repeat: -1
    });

    // Mudou a largura, a duração é refeita mantendo o ponto atual do
    // percurso — recomeçar do zero daria um salto no meio da volta.
    var larguraAnterior = trilho.scrollWidth;
    function remedir() {
      var agora = trilho.scrollWidth;
      if (!agora || agora === larguraAnterior) { return; }
      larguraAnterior = agora;
      var ponto = laco.progress();
      laco.duration(Math.max(agora / 2, 1) / pxPorSegundo);
      laco.progress(ponto);
    }
    window.addEventListener('resize', remedir);
    window.addEventListener('orientationchange', remedir);

    /* Conteúdo que se move sozinho precisa parar quando alguém quer olhar —
       mas no celular era justamente isso que travava o laço de vez. Um toque
       dispara 'pointerenter', e o 'pointerleave' correspondente muitas vezes
       nunca chega (o hover fica grudado no elemento); e quando o gesto vira
       rolagem da página, o navegador encerra em 'touchcancel', sem disparar
       'touchend'. Nos dois casos o pause ficava sem o play de volta: a faixa
       andava até onde estava e parava ali, sem nunca dar a volta.

       Agora cada motivo de parada é um estado nomeado, e não um par
       pause/play solto. O laço só fica parado enquanto algum motivo for
       verdadeiro, então um evento de fim perdido não trava mais nada. */
    var razoes = { mouse: false, toque: false, foco: false };
    var soltarToque = null;

    function aplicar() {
      if (razoes.mouse || razoes.toque || razoes.foco) { laco.pause(); }
      else { laco.play(); }
    }

    function marcar(nome, valor) { razoes[nome] = valor; aplicar(); }

    function largarToque() {
      clearTimeout(soltarToque);
      soltarToque = null;
      marcar('toque', false);
    }

    function segurarToque() {
      clearTimeout(soltarToque);
      marcar('toque', true);
      // rede de segurança: mesmo que nenhum evento de fim chegue, o laço
      // volta a andar sozinho
      soltarToque = setTimeout(largarToque, 1600);
    }

    // hover só onde existe mouse de verdade: no celular ele é o hover
    // grudado que não solta
    if (temMouse) {
      trilho.addEventListener('pointerenter', function () { marcar('mouse', true); });
      trilho.addEventListener('pointerleave', function () { marcar('mouse', false); });
    }

    trilho.addEventListener('touchstart', segurarToque, { passive: true });
    trilho.addEventListener('touchmove', segurarToque, { passive: true });
    trilho.addEventListener('touchend', largarToque, { passive: true });
    trilho.addEventListener('touchcancel', largarToque, { passive: true });
    trilho.addEventListener('pointercancel', largarToque);

    trilho.addEventListener('focusin', function () { marcar('foco', true); });
    trilho.addEventListener('focusout', function () { marcar('foco', false); });

    // Voltando de outra aba ou da tela bloqueada, nenhum toque antigo
    // continua segurando a faixa.
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') { return; }
      razoes.toque = false;
      if (!temMouse) { razoes.mouse = false; }
      aplicar();
    });

    return laco;
  }

  /* --------------------------------------------------------- galeria --- */

  // Procura IMG/galeria/01.jpg (depois .jpeg, .png e .webp). Achou, vira foto;
  // não achou, a moldura continua com o ladrilho de joias da marca.
  var EXTENSOES = ['jpg', 'jpeg', 'png', 'webp'];

  function procurarFoto(el, pasta, aoAchar, aoTerminar) {
    var nome = el.getAttribute('data-foto');
    var i = 0;

    var img = document.createElement('img');
    img.alt = el.getAttribute('data-alt') || '';
    // 'eager' de propósito. Com lazy, o navegador não tenta carregar o que
    // está fora da tela à direita do trilho — e a descoberta da extensão
    // certa depende justamente do evento de erro, que nunca viria.
    // Quem segura o download até a hora certa é o IntersectionObserver abaixo.
    img.loading = 'eager';
    img.decoding = 'async';

    img.addEventListener('load', function () {
      aoAchar(el, img);
      if (aoTerminar) { aoTerminar(true); }
    });

    img.addEventListener('error', function () {
      i += 1;
      if (i < EXTENSOES.length) {
        img.src = 'IMG/' + pasta + '/' + nome + '.' + EXTENSOES[i];
      } else {
        img.remove();
        if (aoTerminar) { aoTerminar(false); }
      }
    });

    el.appendChild(img);
    img.src = 'IMG/' + pasta + '/' + nome + '.' + EXTENSOES[0];
  }

  var galeria = document.getElementById('galeria');
  var molduras = document.querySelectorAll('.moldura[data-foto]');
  var buscasPendentes = molduras.length;

  function buscarFotos() {
    Array.prototype.forEach.call(molduras, function (fig) {
      procurarFoto(fig, 'galeria', function (el) {
        el.classList.add('tem-foto');
        // a partir da primeira foto, as molduras ainda vazias sabem se esconder
        el.parentNode.classList.add('com-fotos');
      }, function () {
        buscasPendentes -= 1;
        if (buscasPendentes === 0) { montarCarrossel(); }
      });
    });
  }

  // As fotos são pesadas, então só começam a baixar quando a seção se
  // aproxima — com folga de 600px, para estarem prontas antes de aparecer.
  if (galeria && window.IntersectionObserver) {
    var vigiaGaleria = new IntersectionObserver(function (entradas, obs) {
      if (!entradas[0].isIntersecting) { return; }
      obs.disconnect();
      buscarFotos();
    }, { rootMargin: '600px 0px' });
    vigiaGaleria.observe(galeria);
  } else {
    buscarFotos();
  }

  // ---- o carrossel em laço contínuo -----------------------------------
  // Só pode ser montado depois que todas as buscas terminaram: antes disso
  // não dá para saber quantas fotos existem nem medir a largura do trilho.
  function montarCarrossel() {
    if (!galeria) { return; }
    var fotos = galeria.querySelectorAll('.moldura.tem-foto');
    if (fotos.length < 2) { return; }

    // as molduras sem foto saem do trilho de vez: escondidas por CSS elas
    // continuariam contando na largura do laço
    Array.prototype.forEach.call(galeria.querySelectorAll('.moldura:not(.tem-foto)'),
      function (vazia) { vazia.remove(); });

    montarLaco(galeria, 46);
  }

  // Vitrine de joias: a foto do produto entra no lugar do desenho da peça.
  Array.prototype.forEach.call(document.querySelectorAll('.joia[data-foto]'), function (li) {
    procurarFoto(li, 'joias', function (el, img) {
      var desenho = el.querySelector('svg');
      if (desenho) { desenho.remove(); }
      el.insertBefore(img, el.firstChild);
      el.classList.add('tem-foto');
    });
  });

  /* ----------------------------------------------- capa de catálogo --- */
  // O catálogo de ouro ainda não tem capa exportada do Canva. Em vez de um
  // ícone de imagem quebrada, a moldura assume uma capa provisória com o
  // padrão da marca. Some sozinho no dia em que o arquivo for salvo.
  Array.prototype.forEach.call(document.querySelectorAll('[data-capa-opcional]'),
    function (img) {
      img.addEventListener('error', function () {
        var moldura = img.closest('.catalogo-moldura');
        if (moldura) { moldura.classList.add('sem-capa'); }
        img.remove();
      });
    });

  /* ------------------------------------------------------- feedbacks --- */

  var trilho = document.getElementById('fb-trilho');
  var secaoFb = document.querySelector('.feedbacks');

  if (trilho && secaoFb) {
    // apagou todos os depoimentos do HTML? a seção vira só a promessa e a nota
    if (!trilho.querySelector('.fb-item')) {
      secaoFb.classList.add('fb-sem-itens');
    }

    // o texto da dica muda quando a cena presa entra em cena (mais abaixo);
    // o padrão vale para celular e para quando o GSAP não carregou
    var dicaFb = document.getElementById('fb-arraste');
  }

  /* ------------------------------------------------------------ faq ---- */

  Array.prototype.forEach.call(document.querySelectorAll('.faq details'), function (det) {
    var corpo = det.querySelector('div');
    var resumo = det.querySelector('summary');

    resumo.addEventListener('click', function (e) {
      if (semMovimento || !window.gsap) { return; }
      e.preventDefault();

      if (det.open) {
        gsap.to(corpo, {
          height: 0, duration: .28, ease: 'power2.inOut',
          onComplete: function () { det.open = false; gsap.set(corpo, { clearProps: 'height' }); }
        });
      } else {
        det.open = true;
        gsap.from(corpo, { height: 0, duration: .32, ease: 'power2.out' });
      }
    });
  });

  /* -------------------------------------------------------- movimento -- */

  if (semMovimento || !window.gsap) {
    mostrar('lobulo');
    return;
  }

  gsap.registerPlugin(window.ScrollTrigger);

  // A ficha já nasce preenchida: se a abertura falhar, o conteúdo continua lá.
  mostrar('lobulo');

  // Um único momento orquestrado na página: a orelha se desenha e acende.
  var tracos = document.querySelectorAll('.orelha .traco path');
  Array.prototype.forEach.call(tracos, function (path) {
    var len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
  });

  var abertura = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: .15 });

  abertura
    .from('.topo', { y: -20, opacity: 0, duration: .5 })
    .from('.chamada span', { y: '0.9em', opacity: 0, duration: .7, stagger: .07 }, '-=.25')
    .from('.chamada-sub', { opacity: 0, duration: .5 }, '-=.35')
    .from('.selo', { opacity: 0, y: 10, duration: .45 }, '-=.3')
    .to(tracos, { strokeDashoffset: 0, duration: 1.3, stagger: .07, ease: 'power1.inOut' }, '-=1.1')
    .from('.pt .pt-dot', {
      scale: 0, transformOrigin: 'center', duration: .4, stagger: { each: .05, from: 'end' },
      ease: 'back.out(2.2)'
    }, '-=.45')
    .from('.orelha-dica', { opacity: 0, duration: .4 }, '-=.2')
    .from('.mapa-ficha', { opacity: 0, y: 12, duration: .55 }, '-=.5');

  // Rede de segurança: a abertura esconde o herói para depois revelá-lo. Se o
  // navegador parar de animar no meio (aba em segundo plano, rAF estrangulado),
  // a pessoa ficaria olhando para uma tela vazia. Passados 4s, vai pro fim.
  setTimeout(function () {
    if (abertura.progress() < 1) { abertura.progress(1); }
  }, 4000);

  // A luz do estúdio responde ao scroll — ela não se mexe sozinha.
  // Velocidades diferentes dão profundidade à sala.
  var percurso = {
    trigger: document.documentElement,
    start: 'top top',
    end: 'bottom bottom',
    scrub: .8
  };
  gsap.to('.luz-a', { yPercent: 22,  ease: 'none', scrollTrigger: percurso });
  gsap.to('.luz-b', { yPercent: -26, ease: 'none', scrollTrigger: percurso });
  gsap.to('.luz-c', { yPercent: -14, ease: 'none', scrollTrigger: percurso });

  // A barra de cada passo preenche conforme a sequência entra na tela.
  Array.prototype.forEach.call(document.querySelectorAll('.passos li'), function (li, i) {
    gsap.to(li, {
      '--preenche': 1,
      duration: .6,
      ease: 'power2.out',
      delay: i * .08,
      scrollTrigger: { trigger: '.passos', start: 'top 78%', once: true }
    });
  });

  // Cada título de seção sobe por trás de uma máscara. Um dispositivo só,
  // repetido na página inteira, em vez de um efeito diferente por seção.
  gsap.utils.toArray('.titulo-secao').forEach(function (titulo) {
    var interno = document.createElement('span');
    interno.className = 'revela';
    while (titulo.firstChild) { interno.appendChild(titulo.firstChild); }
    titulo.appendChild(interno);

    gsap.from(interno, {
      yPercent: 118,
      duration: .9,
      ease: 'power3.out',
      scrollTrigger: { trigger: titulo, start: 'top 90%', once: true }
    });
  });

  // A virada de assunto para as perfurações íntimas: o bloco de cor entra
  // varrendo da esquerda. É o único corte de cena da página.
  gsap.from('.intimas', {
    clipPath: 'inset(0 100% 0 0)',
    duration: 1.05,
    ease: 'power3.inOut',
    scrollTrigger: { trigger: '.intimas', start: 'top 82%', once: true },
    onComplete: function () { gsap.set('.intimas', { clearProps: 'clipPath' }); }
  });

  // Os depoimentos correm no mesmo laço contínuo das fotos. Mais devagar:
  // foto a gente só olha, depoimento a gente lê.
  var lacoFb = montarLaco(trilho, 30);

  // com o laço rodando não há rolagem nativa para arrastar: o que a pessoa
  // precisa saber é que dá pra parar — e no celular isso é um toque
  if (lacoFb && dicaFb) {
    dicaFb.textContent = temMouse
      ? 'Passe o mouse para parar e ler'
      : 'Toque para parar e ler';
  }

  // As fontes chegam depois do primeiro cálculo e mudam a altura de tudo;
  // sem isto a cena prende no lugar errado.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
}());
