import React, { useContext, useRef, useLayoutEffect, useReducer } from 'react';
import ReactReduxContext from '../Context';
import { shallowEqual } from '../utils';
import Subscription from '../Subscription';

function storeStateUpdatesReducer(count) {
    return count + 1;
}

function connect(
    mapStateToProps = () => { },
    mapDispatchToProps = () => { }
) {
    function childPropsSelector(store, wrapperProps) {
        const state = store.getState();   // 拿到state
        // 执行mapStateToProps和mapDispatchToProps
        const stateProps = mapStateToProps(state);
        const dispatchProps = mapDispatchToProps(store.dispatch);

        return Object.assign({}, stateProps, dispatchProps, wrapperProps);
    }

    return function connectHOC(WrappedComponent) {
        function ConnectFunction(props) {
            const { ...wrapperProps } = props;


            const contextValue = useContext(ReactReduxContext);

            const { store, subscription: parentSub } = contextValue;  // 解构出store和parentSub
            const actualChildProps = childPropsSelector(store, wrapperProps);

            const lastChildProps = useRef();
            useLayoutEffect(() => {
                lastChildProps.current = actualChildProps;
            }, [actualChildProps]);

            const [
                ,
                forceComponentUpdateDispatch
            ] = useReducer(storeStateUpdatesReducer, 0)

            // 新建一个subscription实例
            const subscription = new Subscription(store, parentSub);

            // state回调抽出来成为一个方法
            const checkForUpdates = () => {
                const newChildProps = childPropsSelector(store, wrapperProps);
                // 如果参数变了，记录新的值到lastChildProps上
                // 并且强制更新当前组件
                if (!shallowEqual(newChildProps, lastChildProps.current)) {
                    lastChildProps.current = newChildProps;

                    // 需要一个API来强制更新当前组件
                    forceComponentUpdateDispatch();

                    // 然后通知子级更新
                    subscription.notifyNestedSubs();
                }
            };

            // 使用subscription注册回调是否需要更新组件
            subscription.onStateChange = checkForUpdates;
            subscription.trySubscribe();

            // 修改传给子级的context
            // 将subscription替换为自己的
            const overriddenContextValue = {
                ...contextValue,
                subscription
            }

            // 渲染WrappedComponent
            // 再次使用ReactReduxContext包裹，传入修改过的context
            return (
                <ReactReduxContext.Provider value={overriddenContextValue}>
                    <WrappedComponent {...actualChildProps} />
                </ReactReduxContext.Provider>
            )
        }

        return ConnectFunction;
    }
}

export default connect;
