# My Restaurants (我的餐廳清單)
## Features
1. Restaurant list are **sorted descendingly** based on their ratings by default, or users could sort restaurant list by their preference
2. Click on a restaurant tile will bring users to another page displaying details of that restaurant
3. Users could use keyword to search restaurants' **Mandarin** name, **English** name, and **category**
4. **Alert message** is displayed when users try to search **spaces**, **empty string**, or there is **no match** from database
5. Users could add a new restaurant to the list, or edit existing one
<br><br><br>

## Technology
Runtime: `node@16.13.0` <br>
Framework: `express@4.18.1` <br>
Database: `mongoose@6.3.3` <br>
View Engine: `express-handlebars@6.0.5` <br>
Packages: `nodemon@2.0.16` & `bootstrap@5.1.3` & `fontawesome@6.1.1` & `dotenv@16.0.1` & `method-override@3.0.0` <br>
<br><br><br>

## Application Routing
```
GET     /                         read a page rendering all restaurants
POST    /restaurants              create new restaurant in MongoDB
GET     /restaurants/new          read a page rendering a form to create a restaurant data
GET     /restaurants/:id          read a page rendering a specific restaurant
GET     /restaurants/:id/edit     read a page rendering a form to edit an existing restaurant data
PUT     /restaurants/:id          modify an existing restaurant data based on form input
DELETE  /restaurants/:id          remove a specific restaurant from MongoDB
GET     /search                   read a page rendering search result from MongoDB using users' keyword
```
<br><br><br>

## Instructions
#### step1: Clone a local copy by
`git clone https://github.com/yumingchang1991/alpha-camp-restaurants`
<br><br>

#### step2: Change Directory to the copy
`cd alpha-camp-restaurants`
<br><br>

#### step3: Install dependencies
Type in command line below to automatically install dependencies listed in package.json <br>
`npm i` <br>

**NOTE**
- Bootstrap are linked with offline files that come with this repo. no action from you, YAY!
- Font awesome is linked through CDN. no actions from you, too, YAY-YAY!
<br><br>

#### step4: add environment variable to connect to your MongoDB
- Create `.env` file to the same file level as `app.js`
- Add a variable name `MONGODB_URI` in `.env` and assign your URI to it
<br><br>

#### step5: **Seed Your Database** by `npm run seed`, this will add 8 dummy data to database
<br><br>

#### step6: **Run Application** by `npm run dev`, this will open localhost for you automatically
<br><br>

## Improvements Directions
- [x] Seperate Express routing from app.js
- [x] Seperate Model, View & Utility from app.js
- [x] Enable user to choose how the list is sorted, by what property, and in ascending or descending order
- [] Enable friendly alert when there is error modifying restaurant data (it now redirects user to homepage only)
- [] Enable user to choose what target to search, is it name or category
<br><br><br>

## How To Participate
You could interact with this project by making a pull request, with a file containing information:
1. How you think I could improve this project
2. How you think I could improve as a software developer
3. Open to anything on your mind

Or send messages on [LinkedIn](https://www.linkedin.com/in/yumingchang1991/) <br>
Or in email [yumingchang1991@gmail.com](mailto:yumingchang1991@gmail.com)
<br><br><br>
