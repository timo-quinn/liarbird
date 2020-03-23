
## Installation

Just run:

`yarn`

## Development

To start the development website, run:

`yarn start`

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Deployment

To deploy all project components, run:

`yarn deploy`

You will need to define the key for the devices before the firebase functions can be deployed:

`firebase functions:config:set deviceAuthKey="<some value>"`

The deviceAuthKey should never be saved in the repo. It's just a safeguard to prevent configuration being changed without authorization for the managed devices in the field.
