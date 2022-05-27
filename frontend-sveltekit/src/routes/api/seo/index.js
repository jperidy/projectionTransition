import Seo from 'src/database/models/seoModel';
import { apiHandler } from 'src/services/api/apiHandler';

/** @type {import('./__types/[id]').RequestHandler} */
async function get() {
    Seo.findOne({name: "seo"})
        .then((seo) => {
            if (seo) {
                return { 
                    status: 200,
                    body: {message: 'get seo', value: seo}
                }
            } else {
                return {
                    status: 404,
                    body: { message: `seo not found`, value: {} }
                }
            }
        })
        .catch((error) => ({
            status: 500,
            body: {message: `Error fetching seo: ${error}`, value: {}}
        }))
}

/** @type {import('./__types/[id]').RequestHandler} */
async function put({ RequestHandler: req}) {
    const updatedSeo = req.body;
    Seo.findOne({name: "seo"})
        .then((seo) => {
            if (!seo) {
                // create the seo
                Seo.create(updatedSeo).then((seoCreated) => {
                    if (seoCreated) {
                        return {
                            status: 200,
                            body: { message: 'seoCreated', value: seoCreated}
                        }
                    } else {
                        return {
                            status: 500,
                            body: { message: `Error: seo not created`, value:[] }
                        }
                    }
                })
                .catch((error) => ({
                    status: 500,
                    body: {message: `Error creating seo in database: ${error}`, value:[]}
                }))
            } else {
                for (let key in updatedSeo) {
                    seo[key] = updatedSeo[key]
                }
                seo.save()
                    .then((seoUpdated) => {
                        if (seoUpdated) {
                            return {
                                status: 200,
                                body: { message: 'seoUpdated', value: seoUpdated }
                            }
                        } else {
                            return {
                                status: 500,
                                body: { message: `Error: seo not updated`, value:[] }
                            }
                        }
                    })
                    .catch((error) => ({
                        status: 500,
                        body: {message: `Error saving content in database: ${error}`, value:[]}
                    }))
            }
        })
}

export default apiHandler({
    get: { fn: get },
    put: {
      fn: put,
      authenticated: true,
    },
});