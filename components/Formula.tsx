import type { ReactNode } from 'react';

/**
 * Renders a chemical formula with sub/superscripts.
 * Understands <sub>/<sup> tags; falls back to
 * auto-subscripting digits that follow a letter or a closing bracket.
 */
export default function Formula({ value, className = '' }: { value: string; className?: string }) {
  const hasTags = /<\/?(sub|sup)>/i.test(value);
  const nodes: ReactNode[] = [];

  if (hasTags) {
    const parts = value.split(/(<sub>.*?<\/sub>|<sup>.*?<\/sup>)/gi);
    parts.forEach((part, i) => {
      const sub = /^<sub>(.*?)<\/sub>$/i.exec(part);
      const sup = /^<sup>(.*?)<\/sup>$/i.exec(part);
      if (sub) nodes.push(<sub key={i}>{sub[1]}</sub>);
      else if (sup) nodes.push(<sup key={i}>{sup[1]}</sup>);
      else nodes.push(part.replace(/<[^>]+>/g, ''));
    });
  } else {
    const tokens = value.match(/[A-Za-z)\]]\d+(?![+\-−])|[^]/g);
    if (tokens) {
      let buffer = '';
      tokens.forEach((token, i) => {
        const m = /^([A-Za-z)\]])(\d+)$/.exec(token);
        if (m) {
          buffer += m[1];
          nodes.push(buffer);
          buffer = '';
          nodes.push(<sub key={`s${i}`}>{m[2]}</sub>);
        } else {
          buffer += token;
        }
      });
      if (buffer) nodes.push(buffer);
    } else {
      nodes.push(value);
    }
  }

  return <span className={className}>{nodes}</span>;
}
