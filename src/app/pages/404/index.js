import React from 'react'
import Page from 'app/pages'
import Link from 'dan/router/link'
import Localize from 'dan/i18n/localize'
import css from './styles.scss'

export default class Page404 extends Page {
    constructor(props) {
        super(props, {
            title: 'Page not found',
            description: ''
        })
    }
    
    render() {
        return (
            <div className={css.component}>
                <h1>404</h1>
                <h2><Localize>404.title</Localize></h2>
                <Link route="home"><Localize>404.back</Localize></Link>
            </div>
        )
    }
}