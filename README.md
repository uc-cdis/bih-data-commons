

This is the NextJS Application for BIH's data commons.


## Getting Started
Gen3 Data Commons using the Gen3 Frontend Framework is a matter of the following:

* create a clone of [Gen3 Data Commons Application](https://github.com/uc-cdis/commons-frontend-app/)  

* Configure the commons by editing the configuration files in the ```config```

* Add your pages and content

* Deploy via helm charts or Docker.

Changes to the Gen3 Data Commons Application can be pulled from the Common Frontend Repository. You need configure git to pull from the Common Frontend Repository.
```bash
git remote add upstream https://github.com/uc-cdis/commons-frontend-app.git
```
or
```bash
git remote add upstream git@github.com:uc-cdis/commons-frontend-app.git
```

changes to ```main``` can be pulled from the Common Frontend Repository by running:
```bash
git pull upstream main
```

Please see [Styling and Theming](https://github.com/uc-cdis/gen3-frontend-framework/blob/develop/docs/Local%20Development/Styling%20and%20Theming.md) and [Local Development with Helm Charts](https://github.com/uc-cdis/gen3-frontend-framework/blob/develop/docs/Local%20Development/Using%20Helm%20Charts/Local%20Development%20with%20Helm%20Charts.md)
for more information on setting up and configuring the Gen3 Data Commons Application.
This documentation is currently less complete than we would like, but we will be adding to it as development progresses.

## Installation for local testing

The minimum node version is set to v20.11.0 only from an LTS perspective.
Node can be downloaded from the official Node.js site. You may also consider using a [Node version manager](https://docs.npmjs.com/cli/v7/configuring-npm/install#using-a-node-version-manager-to-install-nodejs-and-npm).
Your version of Node may not ship with npm v10. To install it, run:

```bash
npm install npm@10.2.4 -g
```

Note: if you see this error:
```
npm ERR! code ENOWORKSPACES
npm ERR! This command does not support workspaces.
```
you can run ```npx next telemetry disable```

Alternatively, you can use `nvm` to install the correct version of npm:
```bash
nvm install 20.11.0
```

### Install Dependencies

From the root of the project, install dependencies by running:

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Docker

You build a Docker image by:

```bash
docker build .
```
## Updating a forked commons

To update a forked commons, the following steps usually apply.

Get the changes from the parent fork:
```bash
git remote add upstream git@github.com:uc-cdis/commons-frontend-app.git
git fetch upstream
```
Create a branch and merge changes from upstream:
```bash
git merge upstream/main
```
You will see merge conflicts. In general: **take the remote's version for everything except the config files**, as those are customized to the commons config. Resolve the remaining config issues and open a PR.
Test the new common by running it locally or in a staging environment.


## Staging and Production
The environment variable ```NEXT_PUBLIC_GEN3_API``` set in .env.production needs to be different for staging. There are two protected branches: main and staging. For staging, set the variable to:
```NEXT_PUBLIC_GEN3_API='https://bihstaging.data-commons.org'```
and ensure the ```"frontend-framework"``` value in ```manifest.json``` is set to:
```
"frontend-framework": "quay.io/cdis/bih-data-commons:staging",
```

Note this is temporary, and will be refined later, likely with a ```.env.staging``` file instead.
