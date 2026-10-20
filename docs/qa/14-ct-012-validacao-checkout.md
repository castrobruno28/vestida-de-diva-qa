CT-012 — Validação do Checkout

ID: CT-012

Funcionalidade: Formulário de checkout demonstrativo

Objetivo: Verificar se o formulário de checkout identifica os campos obrigatórios quando a cliente tenta continuar sem preenchê-los.

Pré-condições:
- O site Vestida de Diva está disponível para teste.
- A sacola contém pelo menos um produto.
- O formulário de checkout está acessível.

Passos:
1. Abrir a sacola de compras.
2. Acessar o checkout.
3. Deixar os campos obrigatórios vazios.
4. Tentar continuar ou finalizar o pedido.
5. Observar a resposta apresentada pelo site.

Resultado esperado:
O formulário deve impedir o avanço quando existirem campos obrigatórios não preenchidos e informar quais dados precisam ser preenchidos.

Resultado obtido:
O formulário de checkout apresentou o comportamento esperado durante o teste de validação dos campos obrigatórios.

Status: Aprovado.

Evidência: `docs/qa/evidencias/CT-012.png`