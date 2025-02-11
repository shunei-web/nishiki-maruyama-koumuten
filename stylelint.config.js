/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard-scss", "stylelint-config-recess-order"],
  overrides: [
    {
      files: ["*.astro", "**/*.astro"],
      customSyntax: "postcss-html",
    },
  ],
  rules: {
    "selector-class-pattern": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global"],
      },
    ],
    "custom-property-pattern": "^-?-?(_?[a-z][a-z0-9]*)(-[a-z0-9]+)*$",
  },
};
