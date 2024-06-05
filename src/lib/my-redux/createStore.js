export function createStore(reducer, enhancer) {
    let state = {
        count: 0
    };              // state记录所有状态
    let listeners = [];     // 保存所有注册的回调
    // 先处理enhancer
    // 如果enhancer存在并且是函数
    // 我们将createStore作为参数传给他
    // 他应该返回一个新的createStore给我
    // 我再拿这个新的createStore执行，应该得到一个store
    // 直接返回这个store就行
    if (enhancer && typeof enhancer === 'function') {
        const newCreateStore = enhancer(createStore);
        const newStore = newCreateStore(reducer);
        return newStore;
    }

    function subscribe(callback) {
        listeners.push(callback);       // subscribe就是将回调保存下来
    }

    // dispatch就是将所有的回调拿出来依次执行就行
    function dispatch(action) {
        // 更新state
        state = reducer(state, action);
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }
    }

    // getState直接返回state
    function getState() {
        return state;
    }

    // store包装一下前面的方法直接返回
    const store = {
        subscribe,
        dispatch,
        getState
    }

    return store;
}

// 合并reducer函数
export function combineReducers(reducerMap) {
    const reducerKeys = Object.keys(reducerMap);    // 先把参数里面所有的键值拿出来

    // 返回值是一个普通结构的reducer函数
    const reducer = (state = {}, action) => {
        const newState = {};

        for (let i = 0; i < reducerKeys.length; i++) {
            // reducerMap里面每个键的值都是一个reducer，我们把它拿出来运行下就可以得到对应键新的state值
            // 然后将所有reducer返回的state按照参数里面的key组装好
            // 最后再返回组装好的newState就行
            const key = reducerKeys[i];
            const currentReducer = reducerMap[key];
            const prevState = state[key];
            newState[key] = currentReducer(prevState, action);
        }

        return newState;
    };

    return reducer;
}

// 支持多个中间件
export function compose(...funcs) {
    return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

// 中间件
export function applyMiddleware(...middlewares) {
    // applyMiddleware的返回值应该是一个enhancer
    // 按照我们前面说的enhancer的参数是createStore
    function enhancer(createStore) {
        // enhancer应该返回一个新的createStore
        function newCreateStore(reducer) {
            // 我们先写个空的newCreateStore，直接返回createStore的结果
            const store = createStore(reducer);

            // 将middleware拿过来执行下，传入store
            // 获取多个中间件函数
            const chain = middlewares.map(middleware => middleware(store));

            // 用compose得到一个组合了所有newDispatch的函数
            const newDispatchGen = compose(...chain);
            // 解构出原始的dispatch
            const { dispatch } = store;

            // 将原始的dispatch函数传给newDispatchGen执行
            // 得到增强版的dispatch
            const newDispatch = newDispatchGen(dispatch);

            // 返回的时候用增强版的newDispatch替换原始的dispatch
            return { ...store, dispatch: newDispatch }

        }

        return newCreateStore;
    }

    return enhancer;
}

