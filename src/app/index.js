import React from 'react'
import ReactDOM from 'react-dom'
import css from './styles.scss'

let appView = null
class AppView extends React.Component {
    constructor(props) {
        super(props)
        appView = this

        this.state = {
            ready: false,
            pages: []
        }
    }

    /**
     * Public setter ready status
     * @param {Boolean} ready
     */
    set ready(ready) {
        this.setState({
            ready
        })
    }

    /**
     * Update new page
     * @param {*} module 
     * @param {Object} params 
     */
    setPage(module, params = {}) {
        let el

        // Transition
        if(this._pages[0]) {
            el = ReactDOM.findDOMNode(this._pages[0])
            this._pages[0].pageWillDisappear(el)
                .then(() => this._pages[0].pageDisappear(el))
                .then(() => {
                    return new Promise((resolve) => {
                        // Create new page
                        this.setState({
                            pages: [
                                {
                                    module,
                                    params
                                }
                            ]
                        }, () => {
                            el = ReactDOM.findDOMNode(this._pages[0])
                            resolve()
                        })
                    })
                })
                .then(() => this._pages[0].pageWillAppear(el))
                .then(() => this._pages[0].pageAppear(el))
        }
        // First page
        else {
            this.setState({
                pages: [
                    {
                        module,
                        params
                    }
                ]
            }, () => {
                el = ReactDOM.findDOMNode(this._pages[0])
                this._pages[0].pageWillAppear(el)
                    .then(() => this._pages[0].pageAppear(el))
            })
        }
    }

    render() {
        this._pages = []
        return (
            <div className={css.component}>
                {
                    this.state.ready?[
                        this.state.pages.map(({ module: Module, params }) => <Module {...params} key={Module} ref={el => this._pages.push(el)} />), // Page
                    ]:(
                        <div>{/* Loading... */}</div>
                    )
                }
            </div>
        )
    }
}

// Generate Appview
const container = document.getElementById('app') || document.createElement('div')
container.setAttribute('id', 'app')
container.innerHTML = ''
document.body.appendChild(container)
ReactDOM.render(<AppView />, container)

export default appView