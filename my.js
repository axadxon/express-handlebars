const express = require('express');
const my = express();
const Joi = require('joi');
const exphbs = require("express-handlebars");
const port = 8080;

const hbs = exphbs.create({
    extname: ".hbs",
    layoutsDir: "views/tamplates/"
});

my.engine("hbs", hbs.engine);
my.set("view engine", "hbs");
my.set("views", "./views");

my.use(express.json());

const schemaCre = Joi.object({
    name: Joi.string().min(3).required(),
    number: Joi.number().min(100).max(999).required()
});
// const schemaUpd = Joi.object({
//     name: Joi.string().min(3),
//     number: Joi.number().min(100).max(999)
// });


let persons = [
    { name: "Tom", number: 546, id: 1 },
    { name: "Jek", number: 645, id: 2 },
    { name: "Ali", number: 456, id: 3 },
];

my.get("/table", (req, res) => {
    res.status(200).render("table.hbs", {
        title: "table",
        persons: persons
    })
});

my.get("/api/persons/getAll", (req, res) => {
    res.status(200).render("index.hbs", {
        title: "all person",

    })
});
my.get("/api/persons/getOll", (req, res) => {
    res.status(200).send(persons)
});


my.get("/api/persons/about", (req, res) => {
    res.status(200).render("about.hbs", {
        title: "about"
    })
});

my.get("/api/persons/:id", (req, res) => {
    const person = persons.filter((val) => {
        return val.id === +req.params.id;
    })[0];
    res.status(201).send(person);
});

my.post("/api/persons/cre", (req, res) => {
    const { name, number } = req.body
    const result = schemaCre.validate({ name, number });

    if (result.error) {
        res.status(403).send(result.error.message);
        return;
    }

    const person = {
        name,
        number,
        id: persons.length + 1,
    }
    persons.push(person);

    return res.status(200).json({ message: "Yaratildi!" });
});

// my.put("/api/persons/upd/:id", (req, res) => {

// });



my.listen(port, () => {
    console.log("Server working: " + port);
});