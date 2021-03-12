# ESLint Config

Contiene reglas de ESlint comunes a las SPA.

## Instalación

1. Instalar dependencias

```bash
npm i --save-dev @tresdoce-toolkit/eslint-config eslint@6.x
```

2. Agregar configuración en `package.json`

```json
"eslintConfig": {
    "extends": "@tresdoce-toolkit"
}
```

3. Agregar script en `package.json`

```json
"script": {
    ...
    "lint": "eslint --fix --ext .ts,.tsx,.js lib containers pages components contexts"
}

```
