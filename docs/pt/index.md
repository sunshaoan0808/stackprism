---
layout: home
---

## O que é isto

StackPrism é uma extensão Chromium MV3. Ela não "vê" o interior do servidor — apenas organiza as pistas que o navegador consegue ver: recursos de script e estilo, marcadores no DOM, variáveis globais, cabeçalhos de resposta, recursos carregados dinamicamente, folhas de estilo de temas WordPress, etc.

Cada resultado é anotado com **confiança**, **evidências** e **origem**. Se um resultado parecer incorreto, confira as evidências primeiro e depois clique na origem para expandir o JSON bruto correspondente.

## Por onde começar

- Primeira instalação: veja [Instalação e ativação](/pt/guide/install.md)
- Não entende os resultados: veja [Interpretando resultados](/pt/guide/results.md)
- Quer filtrar ruído ou adicionar regras: veja o [Guia de configuração](/pt/config/)
- Quer alterar regras integradas: veja [Formato de arquivo de regras](/pt/dev/rule-format.md) e [Contribuindo com regras](/pt/dev/contribute-rules.md)

## Limites de precisão

Os resultados de detecção não são um relatório de auditoria. Se um site ocultar cabeçalhos de resposta, fizer hash de todos os nomes de recursos ou remover rastros de framework após SSR, o plugin pode retornar muito poucos resultados ou nenhum.

A decisão de design deste projeto é expor o raciocínio da detecção para que o usuário possa entender "por que foi detectado assim". As regras são continuamente aprimoradas, mas suposições de baixa qualidade nunca são apresentadas como conclusões definitivas.
