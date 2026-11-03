import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import { build } from 'esbuild';
import ts from 'typescript';

const { outputFiles } = await build({
  entryPoints: ['src/lib/i18n.ts'],
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'browser',
});
function browser(languages, saved, blocked = false) {
  const events = {};
  const storage = new Map(saved ? [['resell-language', saved]] : []);
  const nodes = new Map();
  const document = {
    documentElement: {},
    title: '',
    querySelector(selector) {
      if (!nodes.has(selector))
        nodes.set(selector, {
          setAttribute(name, value) {
            this[name] = value;
          },
        });
      return nodes.get(selector);
    },
  };
  const navigator = { languages, language: languages[0] };
  const context = {
    exports: {},
    module: { exports: {} },
    document,
    navigator,
    window: {
      addEventListener(name, fn) {
        events[name] = fn;
      },
    },
    localStorage: {
      getItem(key) {
        if (blocked) throw Error('blocked');
        return storage.get(key);
      },
      setItem(key, value) {
        if (blocked) throw Error('blocked');
        storage.set(key, value);
      },
      removeItem(key) {
        if (blocked) throw Error('blocked');
        storage.delete(key);
      },
    },
  };
  vm.runInNewContext(outputFiles[0].text, context);
  return {
    api: context.module.exports,
    storage,
    events,
    document,
    navigator,
    nodes,
  };
}

test('detects regional language variants and falls back to Portuguese', () => {
  const { api } = browser(['es-AR']);
  for (const [languages, expected] of [
    [['en-GB'], 'en'],
    [['pt-PT'], 'pt-BR'],
    [['es-MX'], 'es'],
    [['de-DE', 'es-ES'], 'es'],
    [['ja-JP'], 'pt-BR'],
    [[], 'pt-BR'],
  ]) {
    assert.equal(api.detectLocale(languages), expected);
  }
});
test('manual selection persists, changes metadata, and automatic mode resets it', () => {
  const b = browser(['en-US'], 'es');
  assert.equal(b.api.getLocale(), 'es');
  assert.equal(b.document.documentElement.lang, 'es');
  let updates = 0;
  const unsubscribe = b.api.subscribeLanguage(() => updates++);
  b.api.setLanguagePreference('pt-BR');
  assert.equal(b.storage.get('resell-language'), 'pt-BR');
  assert.equal(b.api.t('Planos'), 'Planos');
  b.api.setLanguagePreference('auto');
  assert.equal(b.api.getLocale(), 'en');
  assert.equal(b.storage.has('resell-language'), false);
  assert.match(b.document.title, /Premium VPN Reselling/);
  assert.match(
    b.nodes.get('meta[name="description"]').content,
    /Become a VPN reseller/,
  );
  assert.equal(updates, 2);
  unsubscribe();
  b.navigator.languages = ['es-ES'];
  b.events.languagechange();
  assert.equal(b.api.getLocale(), 'es');
  assert.equal(updates, 2);
});
test('works without browser storage and ignores invalid saved locales', () => {
  const b = browser(['es'], null, true);
  b.api.setLanguagePreference('en');
  assert.equal(b.api.t('Senha'), 'Password');
  assert.equal(browser(['en'], 'invalid').api.getLocale(), 'en');
});
test('interpolates values and updates validation messages already in state', () => {
  const { api } = browser(['en']);
  assert.equal(api.t('{count} horas', { count: 2 }), '2 hours');
  const error = api.t('Informe um e-mail válido.');
  api.setLanguagePreference('es');
  assert.equal(api.t(error), 'Introduce un correo electrónico válido.');
  assert.equal(api.t('Unknown server message'), 'Unknown server message');
});
test('manual preference survives browser language changes and syncs across tabs', () => {
  const b = browser(['en'], 'pt-BR');
  b.navigator.languages = ['es'];
  b.events.languagechange();
  assert.equal(b.api.getLocale(), 'pt-BR');
  b.storage.set('resell-language', 'en');
  b.events.storage({ key: 'resell-language' });
  assert.equal(b.api.getLocale(), 'en');
  b.storage.clear();
  b.events.storage({ key: null });
  assert.equal(b.api.getLocale(), 'es');
});
test('every literal translation in source exists in both catalogues', () => {
  const en = JSON.parse(readFileSync('src/locales/en.json', 'utf8'));
  const es = JSON.parse(readFileSync('src/locales/es.json', 'utf8'));
  assert.deepEqual(Object.keys(en).sort(), Object.keys(es).sort());
  function inspect(folder) {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const path = `${folder}/${entry.name}`;
      if (entry.isDirectory()) inspect(path);
      else if (/\.tsx?$/.test(path)) {
        const ast = ts.createSourceFile(
          path,
          readFileSync(path, 'utf8'),
          99,
          true,
        );
        function visit(node) {
          if (
            ts.isCallExpression(node) &&
            node.expression.getText(ast) === 't' &&
            ts.isStringLiteral(node.arguments[0])
          ) {
            const key = node.arguments[0].text;
            assert.ok(en[key], `Missing English: ${key}`);
            assert.ok(es[key], `Missing Spanish: ${key}`);
            assert.deepEqual(en[key].match(/\{\w+\}/g), key.match(/\{\w+\}/g));
          }
          ts.forEachChild(node, visit);
        }
        visit(ast);
      }
    }
  }
  inspect('src');
});
