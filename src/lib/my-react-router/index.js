import React, { createContext, useState, useEffect } from "react"

const RouterContext = createContext()

function BrowserRouter(props) {

    const [path, setPath] = useState(() => {
        const { pathname } = window.location

        return pathname || '/'
    })
    const goPath = function (path) {
        window.history.pushState(null, '', path)
        setPath(path)
    }
    const route = {
        path,
        goPath
    }

    const handlePopState = () => {
        const { pathname } = window.location
        setPath(pathname || '/')
    }
    useEffect(() => {
        window.addEventListener('popstate', handlePopState)
        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])

    return (
        // 提供者
        <RouterContext.Provider value={route}>
            {props.children}
        </RouterContext.Provider>
    )
}

function Route(props) {
    const { path, component: Component } = props
    return (
        // 消费者
        <RouterContext.Consumer>
            {
                (router) => {
                    return path === router.path ? <Component /> : null
                }
            }
        </RouterContext.Consumer>
    )
}

export {
    BrowserRouter,
    Route,
    RouterContext
}