<h1 align="center">
    ig.news - Next.js
</h1>
<p align="center">Newsletter subscription application</p>

<p align="center">
 <a href="#About">About</a> •
 <a href="#technologies">Technologies</a> •
 <a href="#running">Running</a>
</p>

## About

The ignews is an $9.90/month subscription app to read about React. It was developed using the NextJS framework, Stripe for subscription payments, NextAuth for authentication with Github, FaunaDB to store data and Prismic CMS for adding and managing post content.

---

## Technologies

- [ReactJS](https://reactjs.org/)
- [NextJS](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [SASS](https://sass-lang.com/)
- [Next-Auth](https://next-auth.js.org/)
- [Stripe](https://stripe.com/)
- [FaunaDB](https://fauna.com/)
- [Prismic CMS](https://prismic.io/)

---

## Running

Install:

- [Git](https://git-scm.com/)
- [Yarn](https://classic.yarnpkg.com)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

Configure the services and in the project root create a .env.local file for the keys you'll get:

- [Stripe](https://stripe.com/)
- [FaunaDB](https://fauna.com/)
- [Prismic CMS](https://prismic.io/)
- [Github Auth](https://github.com/settings/developers)

### **Clone the projeto**

```bash
$ git clone https://github.com/nelsonsantosaraujo/ignews.git
$ cd ignews
```

### **Start the project**

```bash
$ yarn
$ stripe listen --forward-to localhost:3000/api/webhooks 
$ yarn dev
```

---
