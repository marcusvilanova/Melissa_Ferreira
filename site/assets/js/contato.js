// Formulário de contato: monta a mensagem e abre o WhatsApp com ela pronta.
(function () {
  const WHATSAPP_NUMBER = '5511912396070';
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const name = form.elements.nome.value.trim();
    const subject = form.elements.assunto.value;
    const message = form.elements.mensagem.value.trim();

    const lines = [
      'Olá, Melissa! Encontrei seu site e gostaria de mais informações.',
      '',
      'Nome: ' + name,
      'Assunto: ' + subject,
    ];
    if (message) lines.push('', message);

    const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
  });
})();
