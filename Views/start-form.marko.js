// Compiled using marko@4.23.17 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/accenture-bot$1.0.0-alpha.57/Views/start-form.marko",
    marko_renderer = require("marko/src/runtime/components/renderer"),
    helpers_escape_xml = require("marko/src/runtime/html/helpers/escape-xml"),
    marko_escapeXml = helpers_escape_xml.x,
    marko_forOf = require("marko/src/runtime/helpers/for-of"),
    marko_mergeAttrs = require("marko/src/runtime/html/helpers/merge-attrs"),
    marko_attr = require("marko/src/runtime/html/helpers/attr"),
    marko_dataMarko = require("marko/src/runtime/html/helpers/data-marko"),
    marko_escapeScript = require("marko/src/runtime/html/helpers/escape-script-placeholder"),
    marko_loadTag = require("marko/src/runtime/helpers/load-tag"),
    init_components_tag = marko_loadTag(require("marko/src/core-tags/components/init-components-tag")),
    await_reorderer_tag = marko_loadTag(require("marko/src/core-tags/core/await/reorderer-renderer")),
    _preferred_script_location_tag = marko_loadTag(require("marko/src/core-tags/components/preferred-script-location-tag"));

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<!DOCTYPE html><html lang=en><head><meta http-equiv=Content-Type content=\"text/html; charset=utf-8\"><meta name=viewport content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\"><title>" +
    marko_escapeXml(data.name) +
    "</title><link rel=stylesheet href=/public/css/style.css><link rel=stylesheet href=/public/css/responsive.css><link href=https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap rel=stylesheet></head><body><div id=preloader><div class=lds-ripple><div></div><div></div></div></div><div class=wrapper><header class=header><div class=container><div class=logo><a href=index.html><img src=/public/images/tech-logo.png alt=Techforce></a></div></div></header><div class=content><div class=container><h4>" +
    marko_escapeXml(data.name) +
    "</h4><div class=declaration-form><form" +
    marko_attr("id", data.taskId) +
    ">");

  marko_forOf(data.formFields, function(formField) {
    var $keyValue$0 = "@" + formField.id,
        $keyScope$0 = "[" + ($keyValue$0 + "]");

    out.w("<div" +
      marko_dataMarko(out, __component, 0, $keyValue$0) +
      " class=form-group>");

    if (formField.type != "boolean") {
      out.w("<label>" +
        marko_escapeXml(formField.label) +
        "</label>");
    }

    out.w(" <div class=form-control>");

    if (formField.type == "string") {
      if (eval(formField.constraints.maxlength) >= 255) {
        out.w("<textarea" +
          marko_mergeAttrs({
            name: formField.id
          }, formField.constraints) +
          "></textarea>");
      } else {
        out.w("<input" +
          marko_mergeAttrs({
            type: "text",
            name: formField.id
          }, formField.constraints) +
          ">");
      }

      out.w(" ");
    } else if (formField.type == "long") {
      out.w("<input" +
        marko_mergeAttrs({
          type: "number",
          name: formField.id
        }, formField.constraints) +
        ">");
    } else if (formField.type == "date") {
      out.w("<input" +
        marko_mergeAttrs({
          type: "date",
          name: formField.id
        }, formField.constraints) +
        ">");
    } else if (formField.type == "boolean") {
      out.w("<label class=\"custom-checkbox customCheckbox\">" +
        marko_escapeXml(formField.label) +
        "<input type=checkbox checked=checked" +
        marko_attr("name", formField.id) +
        " value=true><span class=checkmark></span></label>");
    } else if (formField.type == "enum") {
      out.w("<div class=form-control>");

      marko_forOf(formField.options, function(option, index) {
        var $keyValue$1 = "@" + option.id,
            $keyScope$1 = "[" + ($keyValue$1 + "]");

        out.w("<label" +
          marko_dataMarko(out, __component, 0, $keyValue$1) +
          " class=custom-checkbox>" +
          marko_escapeXml(option.name));

        if (index == 0) {
          out.w("<input type=radio checked=checked" +
            marko_attr("name", formField.id) +
            marko_attr("value", option.id) +
            ">");
        } else {
          out.w("<input type=radio" +
            marko_attr("name", formField.id) +
            marko_attr("value", option.id) +
            ">");
        }

        out.w("<span class=checkmark></span></label>");
      });

      out.w("</div>");
    } else if (formField.type == "file") {
      out.w("<input" +
        marko_attr("id", formField.id + "-holder") +
        " class=f-input><div class=\"fileUpload btn btn--browse\"><span>Choose File</span><input" +
        marko_mergeAttrs({
          id: formField.id,
          type: "file",
          class: "upload",
          accept: "image/png, application/pdf",
          name: formField.id
        }, formField.constraints) +
        "></div>");
    }

    out.w("</div></div>");
  });

  out.w("<div class=\"form-group text-right submit\"><input type=submit class=submitBtn value=Submit" +
    marko_attr("id", data.processId) +
    "></div></form></div></div></div></div><script type=text/javascript>" +
    marko_escapeScript(("\n        window.formData = " + JSON.stringify(data)) + "\n    ") +
    "</script><script src=/public/js/jquery-latest.min.js></script><script src=/public/js/custom.js></script>");

  init_components_tag({}, out);

  await_reorderer_tag({}, out, __component, "43");

  _preferred_script_location_tag({}, out);

  out.w("</body></html>");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.meta = {
    id: "/accenture-bot$1.0.0-alpha.57/Views/start-form.marko",
    tags: [
      "marko/src/core-tags/components/init-components-tag",
      "marko/src/core-tags/core/await/reorderer-renderer",
      "marko/src/core-tags/components/preferred-script-location-tag"
    ]
  };
