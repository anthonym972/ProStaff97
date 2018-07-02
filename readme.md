# ProStaff97

A description website with React.js

## Commands

#### Development

`yarn start` Start the webpack dev server and host your project at [http://localhost:9000](http://localhost:9000).

##### Options

- `--browser=` Run with a specific ES build (es5, es6-2016, es6-2017). Use `yarn start --browser=es5` if you wants to test es5 version.
- `--https` Enable https developement, url will be [https://localhost:9000](https://localhost:9000). Run `yarn start --https`.
- `--port` Change the local server port (9000 by default). Run `yarn start --port=9001` if you want to use the port 9001.

If you are using npm, prefix options with `--` (for example: `npm start -- --port=9001`).

#### Build

`yarn build` Make a build of your project in `./dist` folder.

##### Options

- `--path=` Will override the `public` parameter of webpack dev server. For example, il you need to host your project at `https://danparis.fr/myproject/`, run `yarn build --path=/myproject/`.
- `--assets=` Use this option if you want host statics assets (all except `index.html`) on a CDN. for example `yarn build --assets=https://aws3.amazon.com/myBucket/`.
- `--server` Run an express server at the end of the build, setup with the build options. For example `yarn build --path=/myProject/ --server` can be tested at [http://localhost:9000/myProject/](http://localhost:9000/myProject/).

## Folders

- `./src` Dynamic files (js, scss, html) compiled with webpack
- `./assets` Static files like images, videos
- `./locales/{locale}/` Localized folder where json and static images will be translated
- `./webpack` Webpack configuration
- `./dist` Build folder

## API

#### i18n

Add in `./locales/{locale}/main.json`:

```json
{
    "hello": "Hello {name} !"
}
```
Then get localized key with:
```js
// JS
import i18n from 'dan/i18n'

i18n.localize('hello', { name: 'Dan' }) // Hello Dan !

// JSX
import Localize from 'dan/i18n/localize'

render() {
    return <Localize name="Dan">hello</Localize> // Hello Dan !
}
```

### Router

#### Add a new Route

Add in `./assets/locales/{locale}/routes.json`:

```json
{
    "myRoute": "/myUrl",
    "myRouteWithArguments": "/anUrl/:withAnArgument"
}
```

And add in `./src/routes.js`:

```js
// Webpack module
export const myRoute = 'myPage' // "/myUrl" will open "./src/app/pages/myPage/index.js"

// Or with a funtion controller
export const myRouteWithArguments = params => {
    console.log(params.myRouteWithArguments)
}
```

#### Generate a link

```js
// JS
import router from 'dan/router'

router.getURL('myRoute') // /myUrl

// JSX
import Link from  'dan/router/link'

render() {
    return <Link route="myRoute">click here</Link> // <a href="/myUrl">click here</a>
}
```

### Assets

```js
import { newQueue } from 'dan/assets'

const q = newQueue()
q.add('data/test01.txt')
q.add('data/test02.png')
q.add('data/test02.json')
q.onComplete.once(() => {
    console.log('Queue completed:', q.assets)
})
```

### Request animation frame

```js
import { addRaf } from 'dan/raf'

addRaf((dt) => {
    console.log(`delta time: ${dt}ms`)
})
```

### Webfonts

Create a folder in `./assets/fonts/{myFontName}` and copy past your font files.

Supported formats:
- .ttf
- .woff
- .eot
- .svg

Then restart webpack, you can know use your font with:

```css
* {
    font-name: "myFontName"
}
```

If You need to download your fonts before launch your App. Edit `./src/index.js`:

```js
// Webfonts
use(webfonts.config({
    timeout: 10000,
    async: false, // Set async to false
    fonts
}))
```

## Tips

#### Switching Preact to React 

Comment lines in `./webpack/alias.js`:

```js
// 'react': 'preact-compat',
// 'react-dom': 'preact-compat',
```

#### Terminal errors

- `Error: listen EADDRINUSE 0.0.0.0:9000` 

    An instance of DANFw is allready running. You can find and kill the process with :
```
netstat -vanp tcp | grep 9000
kill -9 {pid}
```
