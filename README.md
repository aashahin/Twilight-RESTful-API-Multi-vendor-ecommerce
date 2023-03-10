# **Twilight - RESTful API Multi-Vendor ecommerce**

## Tech Stack

**Server:** Node, Express, MongoDB, Mongoose, JWT

**Modules:** nodemailer, bcryptjs,express-validator,multer,sharp,helmet,hpp,compression,hpp,toobusy-js,xss-clean

# API FEATURES

- Authentication & Authorization
- Post CRUD operations
- Categories, SubCategories, Brands, Products, Users, Logged Users
- Coupons, Addresses, Cart, Order
- Reviews functionality
- Search (fields,price,sort,reviews,keyword,filtering)
- Multi Vendors
- Orders for each seller are shown separately
- Local Storage
- improve images
- Log out if the password is changed
- Permissions (Admin,vendor,user)
- Wishlist && vendor profile
- Deactive User
- Verify Rest Code on email
- Forget Password
- Coupons work on the products of its owner
- More to explore!

## Run Locally

Clone the project

```bash
  git clone https://github.com/aashahin/Twilight-Nodejs-Multi-vendor-ecommerce-cms.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run server
```

## Environment Variables

To run this project, you will need to add the following environment variables to your config.env file

# Server Settings
```
PORT=5000

NODE_ENV=development

BASE_URL=https://example.com
```
# Database
```
MONGO_URL=mongodb://localhost:0000/ecommerces
```
# JWT
```
SECRET_KEY='as#ewronh$%@65*-'
EXPIRESIN=90d
```
# Email
## -Settings
```
HOST_MAIL="smtp.example.com"
PORT_MAIL=465
SECURE_MAIL=true
USER_MAIL="support@example.com"
PASSWORD_MAIL="password"
```
## -Message
```
 FROM_MAIL="Shaheen Team <abdelrahman@shaheen.com>"
```
# API Authentication

Some endpoints may require authentication for example. To create a create/delete/update product, you need to register your API client and obtain an access token.

The endpoints that require authentication expect a bearer token sent in the `Authorization header`.

**Example**:

`Authorization: Bearer YOUR TOKEN`

## Register a new API client

```http
POST /api/v1/auth/signup
```

The request body needs to be in JSON format.

# **Examples**

## **User Login**

```http
POST /api/v1/auth/login
```

| Parameter        | Type     | Description   | Required |
| :--------------- | :------- | :------------ | :------- |
| `authentication` | `string` | Your token    | no       |
| `email`          | `string` | Your email    | yes      |
| `password`       | `string` | Your password | yes      |


## **get my info**

```http
GET /api/v1/users/get-me
```

| Parameter        | Type     | Description | Required |
| :--------------- | :------- | :---------- | :------- |
| `authentication` | `string` | Your token  | yes      |

## **Get all users**

```http
GET /api/v1/users/
```

| Parameter        | Type     | Description | Required |
| :--------------- | :------- | :---------- | :------- |
| `authentication` | `string` | Your token  | yes       |

## **[View on Postman](https://www.postman.com/orbital-module-geologist-396425/workspace/twilight-multi-vendor-ecommerce)**

[![Logo](https://pub-ebc3292441104a07b54e254192a1b246.r2.dev/icons8-postman-is-the-only-complete-api-development-environment-96.png)](https://www.postman.com/orbital-module-geologist-396425/workspace/twilight-multi-vendor-ecommerce)
