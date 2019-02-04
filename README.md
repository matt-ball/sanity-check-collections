# Sanity Check Collections

Check your Postman collections aren't exposing sensitive values in plain text where environment variables should have been used.

![Package screenshot](https://user-images.githubusercontent.com/8490181/52240994-67e0ea00-2887-11e9-9b98-9954509c5028.png)

## Overview

Handling secrets in Postman should be done through use of [environment variables](https://learning.getpostman.com/docs/postman/environments_and_globals/manage_environments/). This best practice way of working should be baked into your Postman ecosystem from the outset.

As your workspaces, collections and amount of requests blossom, you might like to double-check that you've been following this best practice throughout. It'd be tedious to manually run through every request and this is prone to human error.

Fortunately, the [Postman API](https://docs.api.getpostman.com/) is here to help with this kind of scenario. Nearly everything that can be done within the app can be done with the Postman API. However, because we have API access, we can change tedious manual tasks into simple automated ones. This package is intended as an experiment of how the API can be useful.

## Usage

1. Clone this repo

2. `node index.js`

3. You'll be prompted for your [Postman API key](https://go.postman.co/integrations/services/pm_pro_api).

4. You'll be prompted for fields to check. Here, enter the keys where you know secrets may exist, comma separated e.g. `x-api-key, api-secret, pw` or `credentials, secret_value` etc.

5. The script will retrieve all your collections (only yours, not those you might have access to), and evaluate every key in every request of your collections to see if it matches one of the comma separated values provided. If it does, it'll check to see if the value for that key looks like an environment variable e.g. `{{apiKey}}`. For every key that isn't using environment variables, a log be ouputted with the offending collection name, request and key.

6. Make fixes and rerun the script until you receive the message that all fields are using variables: `Field(s) "auth_token, key" are all using variables.`

## Note

This package only checks fields in Postman which allow you to enter key/value pairs, e.g. params, headers etc. It isn't intended to, and should not be used as any form of guarantee that a collection is not exposing secrets.
