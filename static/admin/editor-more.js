/* Decap editor component: one-click <!--more--> (read more split) insert.
 * Appears in the markdown editor toolbar. Preview shows a divider label.
 */
(function () {
  function register() {
    if (window.CMS && window.CMS.registerEditorComponent) {
      window.CMS.registerEditorComponent({
        id: "more",
        label: "続きを読む",
        fields: [],
        pattern: /<!--more-->/,
        fromBlock: function () {
          return {};
        },
        toBlock: function () {
          return "<!--more-->";
        },
        toPreview: function () {
          return "<hr><p>続きを読む：ここから下は一覧に出ません</p><hr>";
        },
      });
    } else {
      setTimeout(register, 100);
    }
  }
  register();
})();
