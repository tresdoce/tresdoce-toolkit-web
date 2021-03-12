# TresDoce Toolkit [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

Este repositorio contiene un conjunto de librerías utilitarias y de funcionalidades comunes. Está organizado como un [monorepo](https://en.wikipedia.org/wiki/Monorepo).

## Paquetes

### `@tresdoce-toolkit/eslint-config` [- Documentación](packages/eslint-config/README.md)

#### Reglas de ESlint comunes a las SPA

### `@tresdoce-toolkit/babel-config`

#### Reglas de Babel

## Desarrollo

Para poder comenzar a desarrollar necesitás tener instalado el paquete `lerna` como una dependencia global:

```bash
npm i -g lerna
```

Luego se debe correr el siguiente comando:

```bash
npm run install
```

Esto va a permitir que se instalen las dependencias de todas las librerías que están dentro de la carpeta `packages`.

Para poder instalar las dependencias del proyecto a nivel global hay que correr el siguiente comando:

```bash
npm i
```

## Build

Para poder realizar un build de todos los paquetes se debe correr el siguiente comando:

```bash
npm run build
```

Los builds se hacen con una herramienta llamada `@pika/pack` que por debajo usa `rollup`, una vez que el build se haga en todos los packages vas a poder acceder al contenido generado entrando a:

```bash
cd ./packages/${packageName}/pkg
```

El folder `pkg` va a contener todo lo que necesitamos, desde los diferentes builds, hasta el `package.json` con las referencias a los modulos generados.

**Si querés correr un build individual podes hacerlo, entrás al paquete que queres builder y corres `npm run build`**

## Comandos Adicionales

El proyecto cuenta a nivel global con los siguientes comandos disponibles para ejecutar:

```bash
// Permite remover los datos generados por el build
npm run clean

// Permite generar un build por cada package dentro de packages
npm run build

// Permite instalar todas las dependencias por cada package dentro de packages
npm run install

// Permite publicar todos los packages buildeados a NPM
npm run publish
```
