import React from 'react'
import i18n from 'dan/i18n'

export default class Localize extends React.Component {
    componentDidMount() {
        this._onChange = i18n.onChange.add(this.forceUpdate, this)
    }

    componentWillUnmount() {
        i18n.onChange.detach(this._onChange)
    }

    render() {
        return (
            i18n.localize(this.props.children, this.props, this.props.file, this.props.locale)
        )
    }
}