/* Decap editor components: one-click inserts for theme idioms.
 * - more: <!--more--> read-more split (list truncation + jump anchor)
 * - hr: --- horizontal rule
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
      window.CMS.registerEditorComponent({
        id: "hr",
        label: "水平線",
        fields: [],
        pattern: /^---$/m,
        fromBlock: function () {
          return {};
        },
        toBlock: function () {
          return "---";
        },
        toPreview: function () {
          return "<hr>";
        },
      });
    } else {
      setTimeout(register, 100);
    }
  }
  register();
})();
