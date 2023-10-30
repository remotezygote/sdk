# @whereby.com/browser-sdk

<a href="https://www.npmjs.com/package/@whereby.com/browser-sdk" alt="NPM Package">
    <img src="https://img.shields.io/npm/v/@whereby.com/browser-sdk" />
</a>

Clientside library defining a web component to allow embedding Whereby video
rooms in web applications. Only normal iframe under the hood, the web component
adds syntactic sugar to make it easier to customize the Whereby experience and
hook into powerful features such as listening to room events and sending
commands to the room from the host application.

## Usage

### React Hooks (Beta)

We're currently working on a library for use within React applications for a more customizable experience. Take a look at [the development branch](https://github.com/whereby/browser-sdk/tree/development) if you'd like to test it out.

Disclaimer: This is a beta release, and we recommend using it with caution in production environments. Your feedback and contributions are greatly appreciated.

### React + a bundler (webpack, rollup, parcel etc)

```js
import "@whereby.com/browser-sdk"

const MyComponent = ({ roomUrl }) => {
    return <whereby-embed room={roomUrl} />
}

export default MyComponent

```

### Directly using a script tag

```html
<html>
    <head>
        <script src="...."></script>
    </head>
    <body>
        <div class="container">
            <whereby-embed room="some-room" />
        </div>
    </body>
</html>
```

**Note**

Although we have just higlighted two combinations of how to load and use the
web component, it should be possible to use this library with all the major
frontend frameworks.

