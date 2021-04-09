"use strict";

exports.__esModule = true;

exports.default = {
  name: "collapse",
  functional: true,
  props: {
    duration: { type: String, default: "0.3" },
  },
  render: function render(h, _ref) {
    var children = _ref.children;
    var data = {
      on: {
        beforeEnter(el) {
          el.style["-webkit-transition"] =
            _ref.props.duration +
            "s height ease-in-out,.3s padding-top ease-in-out,.3s padding-bottom ease-in-out";
          el.style["transition"] =
            _ref.props.duration +
            "s height ease-in-out,.3s padding-top ease-in-out,.3s padding-bottom ease-in-out";
          if (!el.dataset) el.dataset = {};

          el.dataset.oldPaddingTop = el.style.paddingTop;
          el.dataset.oldPaddingBottom = el.style.paddingBottom;
          el.dataset.oldHeight = el.style.height;
          el.style.height = "0";
          el.style.paddingTop = 0;
          el.style.paddingBottom = 0;
        },
        enter(el) {
          el.dataset.oldOverflow = el.style.overflow;
          if (el.scrollHeight !== 0) {
            el.style.height = el.scrollHeight + "px";
            el.style.paddingTop = el.dataset.oldPaddingTop;
            el.style.paddingBottom = el.dataset.oldPaddingBottom;
          } else {
            el.style.height = el.dataset.oldHeight;
            el.style.paddingTop = el.dataset.oldPaddingTop;
            el.style.paddingBottom = el.dataset.oldPaddingBottom;
          }

          el.style.overflow = "hidden";
        },
        afterEnter(el) {
          // for safari: remove class then reset height is necessary
          el.style["-webkit-transition"] = "";
          el.style["transition"] = "";
          el.style.height = el.dataset.oldHeight;
          el.style.overflow = el.dataset.oldOverflow;
        },
        beforeLeave(el) {
          if (!el.dataset) el.dataset = {};
          el.dataset.oldPaddingTop = el.style.paddingTop;
          el.dataset.oldPaddingBottom = el.style.paddingBottom;
          el.dataset.oldOverflow = el.style.overflow;
          el.dataset.oldHeight = el.style.height;
          if (el.style.paddingTop)
            el.style.height =
              el.scrollHeight -
              el.style.paddingTop.substr(0, el.style.paddingTop.length - 2) +
              "px";
          else el.style.height = el.scrollHeight + "px";
          el.style.overflow = "hidden";
        },
        leave(el) {
          if (el.scrollHeight !== 0) {
            // for safari: add class after set height, or it will jump to zero height suddenly, weired
            el.style["-webkit-transition"] =
              _ref.props.duration +
              "s height ease-in-out,.3s padding-top ease-in-out,.3s padding-bottom ease-in-out";
            el.style["transition"] =
              _ref.props.duration +
              "s height ease-in-out,.3s padding-top ease-in-out,.3s padding-bottom ease-in-out";
            el.style.height = 0;
            el.style.paddingTop = 0;
            el.style.paddingBottom = 0;
          }
        },
        afterLeave(el) {
          el.style["-webkit-transition"] = "";
          el.style["transition"] = "";
          el.style.height = el.dataset.oldHeight;
          el.style.overflow = el.dataset.oldOverflow;
          el.style.paddingTop = el.dataset.oldPaddingTop;
          el.style.paddingBottom = el.dataset.oldPaddingBottom;
        },
      },
    };
    return h("transition", data, children);
  },
};
