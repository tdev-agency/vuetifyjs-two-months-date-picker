module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false,
    },
    extends: ['plugin:vue/recommended', 'eslint:recommended', 'prettier'],
    plugins: [],
    // add your custom rules here
    rules: {
        'vue/multi-word-component-names': 0,
        "vue/html-closing-bracket-newline": ["error", {
            "singleline": "never",
            "multiline": "always"
        }],
        "vue/component-name-in-template-casing": [
            "error",
            "PascalCase",
            {
                registeredComponentsOnly: false,
                ignores: [],
            },
        ],
        "vue/html-indent": ["error", 4, {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        }],
        'vue/valid-v-slot': [
            'error',
            {
                allowModifiers: true,
            },
        ],
        "vue/max-attributes-per-line": ["error", {
            "singleline": {
                "max": 1
            },
            "multiline": {
                "max": 1
            }
        }],
        'vue/no-unused-components': ['off'],
        'vue/require-v-for-key': 0,
        'vue/valid-v-for': 0,
        'vue/no-v-text-v-html-on-component': 0,
        'vue/no-v-html': 0,
        "vue/max-len": ["error", {
            "code": 120,
            "template": 200,
            "tabWidth": 4,
            "comments": 120,
            ignorePattern: 'd="([\\s\\S]*?)"',
            "ignoreComments": true,
            "ignoreTrailingComments": true,
            "ignoreUrls": true,
            "ignoreStrings": true,
            "ignoreTemplateLiterals": true,
            "ignoreRegExpLiterals": true,
            "ignoreHTMLAttributeValues": true,
            "ignoreHTMLTextContents": false,
        }],
        "prefer-arrow-callback": 2,
    },
};
