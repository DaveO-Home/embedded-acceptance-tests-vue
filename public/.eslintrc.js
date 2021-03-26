module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jasmine": true, "jquery": true, "amd": true, "node": true
    },
    "extends": ["eslint:recommended",
        "plugin:vue/vue3-recommended"],
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "strict": 1,
        "semi": 1,
        "quotes": [2, "double", { "allowTemplateLiterals": true }],
        "no-console": [2, { allow: ["warn", "error"] }],
        "no-case-declarations": 1,
        "import/first": 0
    },
    "globals": {
        "cy": true,
        "System": true,
        "testit": true,
        "testOnly": true,
        "Stache": true,
        "steal": true,
        "rmain_container": true,
        "FuseBox": true,
        "__karma__": true,
        "spyOnEvent": true,
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    }
};