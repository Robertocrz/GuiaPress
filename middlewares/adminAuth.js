function adminAuth(req, res, next){                       //cria autorização de acesso
    if (req.session.user != undefined){
        next();
    }
    else{
        res.redirect("/login");
    }
}

module.exports = adminAuth