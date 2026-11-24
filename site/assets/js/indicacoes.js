// Monta os cartões da página Indicações a partir de assets/js/indicacoes-dados.js.
// Usa textContent (e não innerHTML) para que nenhum texto seja interpretado como HTML.
(function () {
  const TYPE_LABELS = { livro: 'Livro', artigo: 'Artigo', filme: 'Filme ou documentário' };
  const FILTER_LABELS = { livro: 'Livros', artigo: 'Artigos', filme: 'Filmes e documentários' };

  const list = document.getElementById('reads');
  const filtersEl = document.getElementById('reads-filters');
  const items = Array.isArray(window.INDICACOES) ? window.INDICACOES : [];
  if (!list) return;

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const buildCard = (item) => {
    const li = el('li', 'read');
    li.dataset.type = item.tipo;

    const spine = el('div', 'read-spine', TYPE_LABELS[item.tipo] || 'Indicação');

    const body = el('div', 'read-body');
    if (item.tema) body.append(el('p', 'read-theme', item.tema));
    body.append(
      el('h3', '', item.titulo),
      el('p', 'read-author', item.autor),
      el('p', 'read-text', item.texto)
    );

    if (item.link) {
      const a = el('a', 'text-link', item.linkTexto || 'Saiba mais');
      a.href = item.link;
      a.target = '_blank';
      a.rel = 'noopener';
      body.append(a);
    }

    li.append(spine, body);
    return li;
  };

  const render = (filter) => {
    const visible = filter === 'all' ? items : items.filter((it) => it.tipo === filter);
    list.replaceChildren(...visible.map(buildCard));
  };

  // Só mostra os filtros dos tipos que existem na lista
  const types = [...new Set(items.map((it) => it.tipo))];
  if (filtersEl && types.length > 1) {
    const makeChip = (value, label, pressed) => {
      const chip = el('button', 'chip', label);
      chip.type = 'button';
      chip.dataset.filter = value;
      chip.setAttribute('aria-pressed', String(pressed));
      chip.addEventListener('click', () => {
        filtersEl.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        render(value);
      });
      return chip;
    };
    filtersEl.append(makeChip('all', 'Todas', true), ...types.map((t) => makeChip(t, FILTER_LABELS[t] || t, false)));
  } else if (filtersEl) {
    filtersEl.remove();
  }

  render('all');
})();
