# PRODUCT · Wedding OS 13.03

## Problema

Um casal criou, durante um date, uma lista absurda sobre como seria o casamento deles.
A lista é engraçada, mas morre num print de celular.

## Solução

Transformar a lista em uma aplicação web que se leva **absurdamente a sério**.
O humor não está no conteúdo — está na seriedade da interface tratando "2 anões tequileiros"
como um item de infraestrutura crítica com peso de risco e status de aprovação.

## Fatos canônicos

| Fato | Valor |
| --- | --- |
| Identidade | `13.03` |
| Noivo | Luiz |
| Noiva | Mel Pitica |
| Local | Aflora Secreta |
| Convidados | 150 |
| Deadline de pendências | 13/02/2027 |
| Data do casamento | 13/03/2027 |

Fonte de verdade destes valores: `js/data.js`. Não duplicar em HTML nem em CSS.

## Público

Uma pessoa. A experiência é entregue por link, aberta no notebook e explorada por ela.

## Jornada emocional pretendida

1. "Ele realmente fez isso."
2. "Isso está bonito."
3. "Ele colocou o que a gente falou."
4. Risada.
5. Curiosidade → interação → mais risada.
6. Surpresa com um detalhe escondido.
7. Fim genuinamente romântico, sem exagero.

## Modelo de decisões

Cada item da lista é uma **decisão** com dois votos independentes: Luiz e Mel Pitica.
Ela vota na coluna dela, ao vivo, ao lado dele. É aí que a aplicação vira jogo.

| Situação | Status |
| --- | --- |
| Ambos aprovam | Aprovação unânime |
| Ambos vetam | Veto unânime |
| Votos opostos | Negociação necessária |
| Só um votou | Em análise |
| Ninguém votou | Pendente |

**Progresso** = decisões com os dois votos preenchidos ÷ total.
**Compatibilidade** = concordância ponderada por `weight` (1 trivial → 3 crítico),
considerando apenas o que já foi decidido pelos dois.

O estado de fábrica é semeado para abrir em **37% organizado** e **87% de compatibilidade**.
A aplicação nunca abre vazia — abre parecendo que já existe há meses.

## Regras editoriais de segurança

O repositório é público. Todo conteúdo precisa permanecer inequivocamente ficcional.

- Nenhuma afirmação factual sobre pessoas públicas citadas. Status sempre no registro do delírio.
- Nenhuma alegação humorística sobre terceiros tratada como fato (crimes, agressões, condutas).
- Conteúdo adulto sugestivo e nunca explícito.
- O item de drogas da lista original entra como `[REDIGIDO PELO DEPARTAMENTO JURÍDICO]`.
  Sem menção, instrução, incentivo ou facilitação.
- Marcas apenas como texto estilizado, sem logotipos oficiais.
- Disclaimer de ficção visível no rodapé + `noindex` + `robots.txt`.

## Fora de escopo

Backend, banco, autenticação, IA, APIs externas, RSVP real, envio de convites,
integração com calendário, multiusuário sincronizado.
