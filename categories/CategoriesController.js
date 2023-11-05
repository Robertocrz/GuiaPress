const express = require("express");
const Category = require("./Category");
const router = express.Router();     // usada para criar rotas
const slugify = require("slugify");


router.get("/admin/categories/new", (req, res) => {
    res.render("admin/categories/new");
});

router.post("/categories/save", (req, res) => {    // formulario usar post
    var title = req.body.title;  
    if (title != undefined){

        Category.create({
            title: title,
            slug:slugify(title)
        }).then(() =>{
            res.redirect("/admin/categories");
        })
    }
    else{
        res.redirect("/admin/categories/new");
    }
})

router.get("/admin/categories", (req,res) =>{       //qndo entrar em categories cai no index
    Category.findAll().then(categories => {
        res.render("admin/categories/index", {categories: categories});
});

    });

router.post("/categories/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            });
        }
        else{                                          //nao for numero
            res.redirect("/admin/categories");
        }
    }
    else{                                          //null
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id;
    if(isNaN(id)){                           //verifica se é numero
        res.redirect("/admin/categories");
    }
    Category.findByPk(id).then(category => {          //findByPk pesquisa pelo id
        if (category != undefined){
            res.render("admin/categories/edit", {category: category});
        }
        else{
            res.redirect("/admin/categories");
        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    })
});

router.post("/categories/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update({title: title, slug: slugify(title) },{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories");
    })
});
    
module.exports = router;