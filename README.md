Personal webpage of prof. Alexandre Bonatto.

## Teaching

The **Teaching** section of the home page and the top bar of every simulation are generated from
`teaching/catalog.js` (courses → topics → simulations).

```
teaching/
  catalog.js                      course / topic / simulation list (single source)
  assets/sim.css, assets/sim.js   shared full-screen shell and canvas helpers
  fisica-iv/interferencia-difracao/
    soma-de-ondas.html
    experimento-de-young.html
    fenda-dupla.html
  fisica-iv/redes-de-difracao/
    fendas-multiplas.html
    largura-dos-maximos.html
    dispersao-e-resolucao.html
```

To add a simulation, create `teaching/<course-id>/<topic-id>/<slug>.html` (copy an existing page as a
template and set `data-course`, `data-topic` and `data-sim` on `<body>`), then add
`{ slug, name, desc }` to the topic in `teaching/catalog.js`. To add a topic or give a course its first
topic, add it to `topics` in the same file.

To preview locally, run `python3 -m http.server` in the repository root and open `http://localhost:8000`.

Stylesheets and scripts are linked with a version suffix (`styles.css?v=202611111054`). Browsers cache these
files, so after editing `styles.css`, `teaching/catalog.js` or anything in `teaching/assets/`, change that
number in `index.html` and in the simulation pages; otherwise returning visitors keep the old file for a while.
