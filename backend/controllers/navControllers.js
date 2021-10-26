const asyncHandler = require('express-async-handler');
const Nav = require('../models/navModels');
//const config = require('../../config/config.json');

// @desc    get navbar elements
// @route   GET /api/nav
// @access  Public
const getNavBar = asyncHandler(async(req,res) => {
    // TODO
    Nav.findOne({name: "nav"})
        .then((navBar) => {
            if (navBar) {
                res.status(200).json({message: 'get navbar', value: navBar});
            } else {
                res.status(404).json({
                    message: `NavBar not found`,
                    value: {}
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error fetching navbar: ${error}`, value: {}}));
});

// @desc    update navbar 
// @route   PUT /api/nav
// @access  Private
const updateNavBar = asyncHandler(async(req,res) => {
    // TODO

    const updatedNavBar = req.body;
    Nav.findOne({name: "nav"})
        .then((navBar) => {
            if (!navBar) {
                // create the navBar
                Nav.create(updatedNavBar).then((navBarCreated) => {
                    if (navBarCreated) {
                        res.status(200).json({ message: 'navBarCreated', value: navBarCreated});
                    } else {
                        res.status(500).json({ message: `Error: navBar not created`, value:[] })
                    }
                })
                .catch((error) => res.status(500).json({message: `Error creating content in database: ${error}`, value:[]}))
            } else {
                // update the navBar
                for (let key in updatedNavBar) {
                    navBar[key] = updatedNavBar[key]
                }
                navBar.save()
                    .then((navBarUpdated) => {
                        if (navBarUpdated) {
                            res.status(200).json({ message: 'navBarUpdated', value: navBarUpdated });
                        } else {
                            res.status(500).json({ message: `Error: navbar not updated`, value:[] })
                        }
                    })
                    .catch((error) => res.status(500).json({message: `Error saving content in database: ${error}`, value:[]}))
            }
        })

});

module.exports = { getNavBar, updateNavBar }

// "NAV_BAR": {
//     "TITLE": [
//         {"name": "LE FESTIVAL", "url": "/edito", "SUBTITLE": []},
//         {"name": "NOS PARTENAIRES", "url": "/partenaires", "SUBTITLE": []},
//         {"name": "L'ÉQUIPE", "url": "/equipe", "SUBTITLE": []},
//         {"name": "PROGRAMMATION 2021", "url": "/programmation2021", "SUBTITLE": []},
//         {"name": "INFORMATIONS PRATIQUES", "url": "/informationsPratiques", "SUBTITLE": []},
//         {"name": "BILLETTERIE", "url": "/billetterie", "SUBTITLE": []}
//     ],
//     "BRAND": {
//         "LOGO": {
//             "path": "/images/Logo_Principal.jpg", 
//             "alt": "Logo de projection transition", 
//             "style": "max-width: 20vh; height:auto;"
//         },
//         "NAME": ""
//     },
//     "SOCIAL_NETWORKS": [
//         {"name": "email", "icon": "/icones/MAIL.004.png", "alt": "icone pour envoyer un email", "redirect": "/informationsPratiques#contact", "target": ""},
//         {"name": "facebook", "icon": "/icones/FB.004.png", "alt": "icone pour consulter la page Facebook", "redirect": "https://www.facebook.com/FestivalProjectionTransition/", "target": "_blank"},
//         {"name": "instagram", "icon": "/icones/INSTA.004.png", "alt": "icone pour consulter la page Instagram", "redirect": "https://www.instagram.com/projectiontransition/", "target": "_blank"},
//         {"name": "youtube", "icon": "/icones/YT.004.png", "alt": "icone pour consulter la page Youtube", "redirect": "https://www.youtube.com/channel/UCgSSefHpeDC42nXZcOy97aA", "target": "_blank"}
//     ],
//     "STYLE": {
//         "expand": "xl",
//         "color": "white",
//         "theme": "light",
//         "TITLE": { "bootstrapClass": "text-dark mx-2", "style": "font-family: omotenashi_2regular;font-size: 1.3rem;" },
//         "SOCIAL_NETWORKS": { "bootstrapClass": "", "style": "max-width: 6vh;height: auto;"}
//     }
// },