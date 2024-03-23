# ecommerce-cms

This is a [Next.js](https://nextjs.org/) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Prerequisites

1. Git
2. Node: Any version in the 20.x range, starting with v20.0.0 or higher.
3. A fork of the repository (for any contributions).
4. A clone of the ecommerce-cms repository on your local machine using
   `git clone https://github.com/udohjeremiah/ecommerce-cms.git`.

### Installation

1. `cd ecommerce-cms` to navigate to the project's root directory.
2. `pnpm install` to install the website's npm dependencies.

### Running locally

1. `npm run dev` to start the development server (powered by Next.js)
2. Open `http://localhost:3000` in your favorite browser to access the site.

## Contributing

### Create a branch

1. `git checkout main` from any folder in your local `ecommerce-cms` repository.
2. `git pull origin main` to ensure you have the latest code from the `main` branch.
3. `git checkout -b the-name-of-my-branch` (replace `the-name-of-my-branch` with a suitable name) to create a new
   branch.

### Make the change

1. Follow the ["Running locally"](#running-locally) instructions.
2. Save the files and check them in the browser.
3. Changes to React components in the `src` directory will hot-reload.

### Test the change

1. Run `npm run format`. This command uses Prettier to validate code formatting, ensuring it adheres to Prettier's
   style. To correct any code format issues, use `npm run format:fix`.
2. Run `npm run lint`. This command runs ESLint to catch any linting errors. Be sure to fix any warnings and errors that
   may appear.
3. If possible, test any visual changes in the latest versions of common browsers, both on desktop and mobile.

### Push it

1. `git add -A && git commit -m "My message"` (replacing `My message` with a commit message, such as `Fix navigation on
mobile screen`) to stage and commit your changes.
2. `git push my-fork-name the-name-of-my-branch` (substitute `my-fork-name` with the actual name of the fork of the
   `ecommerce-cms` repository you have in your GitHub account and `the-name-of-my-branch` with the actual name of the
   branch you created in the previous step when creating a branch).
3. Go to the `ecommerce-cms` repo (i.e. the one you forked) and you should see recently pushed branches.
4. Follow GitHub's instructions to open a pull request.
5. A Next.js build (`next build`) is triggered after your changes are pushed to GitHub.
