const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session");


const categoriesController = require("./categories/CategoriesController");  // importa rotas do categoryController
const articleController = require("./articles/ArticlesController");      // importa rotas do articleController
const usersController = require("./users/UsersController");   //importa rotas userController

const Article = require("./articles/Article");      // importa conexao Article
const Category = require("./categories/Category");  // importa conexao Category
const User = require ("./users/User");


app.set('view engine', 'ejs');  //view engine

app.use(session({       //habilita as sessões
    secret: "qualquercoisa", cookie: {maxAge: 30000}   //maxAge é o tempo que vai durar a sessão
}));

app.use(express.static('public')); // static

app.use(bodyParser.urlencoded({extended: false}));   //body-parser
app.use(bodyParser.json());

connection    //conexao bd
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso!");
    }).catch((error) => {
        console.log(error);
    })

app.use("/", categoriesController);     // diz pra usar categories controller
app.use("/", articleController);
app.use("/", usersController);

app.get("/", (req, res) =>{
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then( categories => {
            res.render("index", {articles: articles, categories: categories});
        });
     });
})

app.get("/:slug", (req, res) => {        // sistema de busca por slug
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories})
            })
        }
        else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    });
})

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index",{articles: category.articles, categories: categories});
            });
        }
        else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
})
   

app.listen(8080, () =>{
    console.log("O servidor esta rodando")
})