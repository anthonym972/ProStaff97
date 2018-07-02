import React from 'react'
import router from 'dan/router'

const PROTERTIE_REGEX = /^(on[A-Z]|data-|className)/

export default class Link extends React.Component {
    componentDidMount() {
        this._onChange = router.onChange.add(this.forceUpdate, this)
    }

    componentWillUnmount() {
        router.onChange.detach(this._onChange)
    }

    /**
     * Move
     */
    _goto(e) {
        e.preventDefault()
        router.goto(router.getURL(this.props.route, this.props))
        this.props.onClick && this.props.onClick(e)
    }

    render() {
        const href = this.props.href || router.getURL(this.props.route, this.props)
        
        // Filter props
        const props = {}
        for(let id in this.props) {
            if(id.search(PROTERTIE_REGEX) !== -1) {
                props[id] = this.props[id]
            }
        }

        return (
            <a href={href} {...props} onClick={this._goto.bind(this)}>{this.props.children}</a>
        )
    }
}