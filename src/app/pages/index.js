import React from 'react'
import metas from 'dan/metas'
import anime from 'animejs'

/** 
 * Page Abstract
 */
export default class Page extends React.Component {
    constructor(props, metas = {}) {
        super(props)

        this._metas = metas;
    }
    
    /**
     * Page will appear
     * @param {HTMLElement} el 
     * @return {Promise}
     */
    pageWillAppear(el) {
        return new Promise((resolve) => {
            el.style.display = 'none'
            el.style.opacity = 0
            resolve()
        })
    }

    /**
     * Page Appear
     * @param {HTMLElement} el 
     * @return {Promise}
     */
    pageAppear(el) {
        return new Promise((resolve) => {
            // Metas
            metas(this._metas)

            // Animation
            el.style.display = ''
            anime({
                targets: el,
                opacity: 1,
                duration: 250,
                easing: 'easeInCubic',
            }).finished.then(() => {
                el.style.opacity = ''
                resolve()
            })
        })
    }

    /**
     * Page will disappear
     * @param {HTMLElement} el 
     * @return {Promise}
     */
    pageWillDisappear(el) {
        return new Promise((resolve) => {
            resolve()
        })
    }

    /**
     * Page will disappear
     * @param {HTMLElement} el 
     * @return {Promise}
     */
    pageDisappear(el) {
        return new Promise((resolve) => {
            anime({
                targets: el,
                opacity: 0,
                duration: 250,
                easing: 'easeInCubic',
            }).finished.then(resolve)
        })
    }
}