// Supported metas
const METAS = {
    title: ['og:title'],
    description: ['description', 'og:description'],
    url: ['og:url'],
    image: ['og:image']
}

/**
 * Update a meta tag content
 * @param {String} name - Meta tag name
 * @param {String} content - Meta tag content propertie
 */
function updateMetaTag(name, content) {
    const element = document.querySelector('meta[name="'+name+'"]') || document.querySelector('meta[property="'+name+'"]')
    element.setAttribute('content', content)
}

/**
 * Update meta tags
 * @param {Object} metas
 */
export default function updateMetaTags(metas = {}) {
    // Title
    if(metas.title) {
        document.title = metas.title
    }

    // Metas
    for(let id in metas) {
        if(METAS[id]) {
            METAS[id].forEach((name) => {
                updateMetaTag(name, metas[id])
            });
        }
    }
}