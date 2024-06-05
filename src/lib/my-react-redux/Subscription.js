// 保证了父->子这样的更新顺序。

export default class Subscription {
    constructor(store, parentSub) {
      this.store = store
      this.parentSub = parentSub
      this.listeners = [];        // 源码listeners是用链表实现的，我这里简单处理，直接数组了
  
      this.handleChangeWrapper = this.handleChangeWrapper.bind(this)
    }
  
    // 子组件注册回调到Subscription上
    addNestedSub(listener) {
      this.listeners.push(listener)
    }
  
    // 执行子组件的回调
    notifyNestedSubs() {
      const length = this.listeners.length;
      for(let i = 0; i < length; i++) {
        const callback = this.listeners[i];
        callback();
      }
    }
  
    // 回调函数的包装
    handleChangeWrapper() {
      if (this.onStateChange) {
        this.onStateChange()
      }
    }
  
    // 注册回调的函数
    // 如果parentSub有值，就将回调注册到parentSub上
    // 如果parentSub没值，那当前组件就是根组件，回调注册到redux store上
    // 判断是根组件还是子组件
    trySubscribe() {
        this.parentSub
          ? this.parentSub.addNestedSub(this.handleChangeWrapper) //子组件订阅
          : this.store.subscribe(this.handleChangeWrapper) // 根组件订阅
    }
  }
  