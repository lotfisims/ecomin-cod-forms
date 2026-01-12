module.exports = {
  extends: ["@remix-run/eslint-config"],
  rules: {
    "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    "prefer-const": "error",
    "no-var": "error"
  }
};
