const postcssPlugin = 'postcss-discard-empty';

function discardAndReport(css, { result }) {
  function discardEmpty(node) {
    const { type, nodes: sub, params } = node;

    if (sub) {
      node.each(discardEmpty);
    }

    if (
      (type === 'decl' && !node.value) ||
      (type === 'rule' && !node.selector) ||
      (sub && !sub.length) ||
      (type === 'atrule' && ((!sub && !params) || (!params && !sub.length)))
    ) {
      node.remove();

      result.messages.push({
        type: 'removal',
        postcssPlugin,
        node,
      });
    }
  }

  css.each(discardEmpty);
}

export default () => {
  return {
    postcssPlugin,
    Root: discardAndReport,
  };
};

export const postcss = true;
