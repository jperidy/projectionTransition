export let homeContent = {
    name: 'homeContent',
    content: [
        {section: 'Carousel', type: 'carousel', values: [
            {url: '/images/500x250/img1.jpeg', title: 'titre1', subTitle: 'sous-titre1' },
            {url: '/images/500x250/img2.jpeg', title: 'titre2', subTitle: 'sous-titre2' },
            {url: '/images/500x250/img3.jpeg', title: 'titre3', subTitle: 'sous-titre3' },
        ]},
        {section: 'Titre_1', type: 'text', value: '# Premier titre'},
        {section: 'Introduction', type: 'text', value: `Bienvenu sur le site Projection Transition ! <br>Le festival est bientôt de retour, ci-dessous les films bientôt projetés.`},
        {section: 'article', type: 'card', values: [
            {
                title: 'Mon premier article',
                subTitle: 'Sous titre [option]',
                url: '',
                text: `Résumé de l'article`,
                footer: `Lien vers l'article`
            },{
                title: 'Mon deuxième article',
                subTitle: 'Sous titre [option]',
                url: '',
                text: `Résumé de l'article`,
                footer: `Lien vers l'article`
            },{
                title: 'Mon troisième article',
                subTitle: 'Sous titre [option]',
                url: '',
                text: `Résumé de l'article`,
                footer: `Lien vers l'article`
            },
        ]},
    ]
};