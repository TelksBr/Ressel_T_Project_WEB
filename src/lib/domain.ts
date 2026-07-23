/** Domínio raiz a partir do hostname (remove www. e prefixo painel.) */
export function rootDomain(hostname: string): string {
  const normalized = hostname.replace(/^www\./, '');
  return normalized.startsWith('painel.') ? normalized.slice('painel.'.length) : normalized;
}

/** Origem do painel Veltrix a partir do hostname atual */
export function panelOriginFromHostname(protocol: string, hostname: string): string {
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//painel.reselltproject.shop`;
  }
  return `${protocol}//painel.${rootDomain(hostname)}`;
}

/** Origem do painel no browser (ou fallback em build/SSR) */
export function resolvePanelOrigin(): string {
  if (typeof window !== 'undefined') {
    return panelOriginFromHostname(window.location.protocol, window.location.hostname);
  }
  return 'https://painel.reselltproject.shop';
}
