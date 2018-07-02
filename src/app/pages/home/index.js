import React from 'react'
import Page from 'app/pages'
import css from './styles.scss'
import Link from 'dan/router/link'
import Localize from 'dan/i18n/localize'
import { i18n } from 'dan'

export default class HomePage extends Page {
    constructor(props) {
        super(props, {
            title: 'Home page',
            description: 'My custom page description !',
            // image: 'http://google.com/logo.png',
            // url: 'http://google.fr',
        })
    }

    render() {
        return (
            <div className={css.component}>
                <h1><Localize firstname="Dan" lastname="FW">hello</Localize></h1>
                <Link route="page404" url="page404"><Localize>404.link</Localize></Link>
            </div>
        )
    }
}
