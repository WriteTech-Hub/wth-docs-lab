// Copy of the Doks search script with one change: the search index is fetched from under the site's
// base path (relLangURL). The original used "/search-index.json", which is wrong on a sub-path
// deployment such as https://writetech-hub.github.io/wth-docs-lab/.
/*!
 * FlexSearch for Bootstrap based Thulite sites
 * Copyright 2021-2024 Thulite
 * Licensed under the MIT License
 * Based on https://github.com/frjo/hugo-theme-zen/blob/main/assets/js/search.js
 */

/* eslint-disable no-undef, guard-for-in */

/**
 * @file
 * A JavaScript file for flexsearch.
 */

import Index from 'flexsearch';

(function () {

  'use strict';

  const index = new Index.Document({
    tokenize: 'forward',
    document: {
      id: 'id',
      index: [
        {
          field: 'title'
        },
        {
          field: 'tags'
        },
        {
          field: {{ if site.Params.doks.indexSummary }}'summary'{{ else }}'content'{{ end }}
        },
        {
          field:  'date',
          tokenize: 'strict',
          encode: false
        }
      ],
      store: ['title','summary','date','permalink']
    }
  });

  function pagePath(path) {
    return path.replace(/index\.html$/, '');
  }

  function showResults(items) {
    const template = document.querySelector('template').content;
    const fragment = document.createDocumentFragment();

    const results = document.querySelector('.search-results');
    results.textContent = '';

    const itemsLength = Object.keys(items).length;

    if ((itemsLength === 0) && (query.value === '')) {
      document.querySelector('.search-no-results').classList.add('d-none');
      document.querySelector('.search-no-recent').classList.remove('d-none');
    } else if ((itemsLength === 0) && (query.value !== '')) {
      document.querySelector('.search-no-recent').classList.add('d-none');
      const queryNoResults = document.querySelector('.query-no-results');
      queryNoResults.innerText = query.value;
      document.querySelector('.search-no-results').classList.remove('d-none');
    } else {
      document.querySelector('.search-no-recent').classList.add('d-none');
      document.querySelector('.search-no-results').classList.add('d-none');
    }

    const here = pagePath(window.location.pathname);

    items.forEach(function (item) {
      const result = template.cloneNode(true);
      const a = result.querySelector('a');
      const time = result.querySelector('time');
      const content = result.querySelector('.content');
      const onThisPage = pagePath(item.permalink.split('#')[0]) === here;
      a.innerHTML = (onThisPage ? '<span class="search-here">On this page</span> ' : '') + item.title;
      a.href = item.permalink;
      if (item.date) {
        time.innerText = item.date;
      } else {
        time.classList.add('d-none');
      }
      content.innerHTML = item.summary;
      if (onThisPage) {
        a.addEventListener('click', function () {
          const close = document.querySelector('#searchModal [data-bs-dismiss="modal"]');
          if (close) close.click();
        });
      }
      fragment.appendChild(result);
    });

    results.appendChild(fragment);
  }

  function doSearch() {
    const query = document.querySelector('.search-text').value.trim();
    const limit = {{ .searchLimit }};
    const results = index.search({
      query: query,
      enrich: true,
      limit: limit,
    });
    const seen = {};
    const list = [];

    results.forEach(function (result) {
      result.result.forEach(function (r) {
        if (!seen[r.id]) {
          seen[r.id] = true;
          list.push(r.doc);
        }
      });
    });

    const here = pagePath(window.location.pathname);
    const local = list.filter(function (d) { return pagePath(d.permalink.split('#')[0]) === here; });
    const other = list.filter(function (d) { return pagePath(d.permalink.split('#')[0]) !== here; });

    showResults(local.concat(other));
  }

  function enableUI() {
    const searchform = document.querySelector('.search-form');
    searchform.addEventListener('submit', function (e) {
      e.preventDefault();
      doSearch();
    });
    searchform.addEventListener('input', function () {
      doSearch();
    });
    document.querySelector('.search-loading').classList.add('d-none');
    document.querySelector('.search-input').classList.remove('d-none');
    document.querySelector('.search-text').focus();
  }

  function buildIndex() {
    document.querySelector('.search-loading').classList.remove('d-none');
    fetch("{{ "search-index.json" | relLangURL }}")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        data.forEach(function (item) {
          index.add(item);
        });
      });
  }

  buildIndex();
  enableUI();
})();
