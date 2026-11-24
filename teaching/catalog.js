/* Catálogo único do material de ensino.
   Para acrescentar uma simulação: crie teaching/<disciplina>/<tópico>/<slug>.html
   e adicione uma entrada em "sims" abaixo. A home e a barra das simulações leem daqui. */
window.TEACHING = {
  courses: [
    {
      id: 'fisica-iv',
      name: 'Física IV',
      topics: [
        {
          id: 'interferencia-difracao',
          name: 'Interferência e Difração',
          sims: [
            { slug: 'soma-de-ondas',        name: 'Soma de ondas senoidais',
              desc: 'Duas ondas de mesma frequência e a diferença de fase: interferência construtiva e destrutiva.' },
            { slug: 'experimento-de-young', name: 'Experimento de Young',
              desc: 'Diferença de caminho ΔL = d·senθ e a posição das franjas claras e escuras.' },
            { slug: 'fenda-dupla',          name: 'Fenda dupla: interferência e difração',
              desc: 'Padrão de Fraunhofer de duas fendas de largura a separadas por d, com mapa de intensidade.' }
          ]
        },
        {
          id: 'redes-de-difracao',
          name: 'Redes de Difração',
          sims: [
            { slug: 'fendas-multiplas',     name: 'Fendas múltiplas: intensidade e fasores',
              desc: 'Como o número N de fendas estreita os máximos principais, com a soma dos N fasores para cada ângulo θ.' },
            { slug: 'largura-dos-maximos',  name: 'Largura dos máximos principais',
              desc: 'Os ângulos δθ₀ e δθ entre um máximo e o primeiro mínimo, e como eles diminuem com a largura N·d da rede.' },
            { slug: 'dispersao-e-resolucao', name: 'Dispersão e poder de resolução',
              desc: 'Duas linhas espectrais próximas: a dispersão D = m/(d cos θ) as afasta e R = N·m decide se são resolvidas.' },
            { slug: 'lei-de-bragg',         name: 'Difração de raios X: lei de Bragg',
              desc: 'Famílias de planos em uma rede cristalina e a condição 2d·senθ = mλ para haver feixe difratado.' }
          ]
        },
        {
          id: 'relatividade',
          name: 'Relatividade',
          sims: [
            { slug: 'relogio-de-luz',       name: 'Relógio de luz em dois referenciais',
              desc: 'Um pulso de luz vai ao espelho e volta, visto do vagão e da plataforma: dilatação do tempo e contração do comprimento.' }
          ]
        }
      ]
    },
    { id: 'laboratorio-iv',   name: 'Laboratório IV',   topics: [] },
    { id: 'eletromagnetismo', name: 'Eletromagnetismo', topics: [] }
  ]
};
