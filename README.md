# braze-dev-framework

A small development environment to make it easier and more convinient to create and test content blocks or full templates that use [Liquid](https://shopify.github.io/liquid/basics/introduction/) and should be used within [Braze](https://www.braze.com). In order to achieve this, there's two stages of testing.

1. Rendering the Liquid code locally using [Brazejs](https://github.com/yq314/brazejs).
2. Then sending it to Braze rendering API to get the most accurate outcome.

## Usage

1. Clone this repo to your machine
2. Navigate into the repo directory and run `npm install`
3. Run `npm link` to make it globally available on your local machine