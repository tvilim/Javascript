module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "parser": "babel-eslint",
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "eqeqeq": 1,
        "semi": ["error", "always"],
        "no-unused-vars": "warn",
        "react/prop-types": [ 0 ],
        "react/jsx-uses-react": 1,
        "react/jsx-uses-vars": 1,
        "no-unexpected-multiline": "warn",
        "no-console": "off",
    }
};