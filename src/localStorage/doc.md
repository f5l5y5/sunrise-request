# 注意点:

- `localstorage` 和 `sessionstorage` 容量为 5mb,超出容量时要处理(默认不存储)
- 默认有效时间单位`小时`,可在配置文件里配置
- 目前只支持`TBaseRes`数据结构的接口才可配置缓存
- 添加`localforage`插件支持缓存`indexedDB`或`Web SQL`,解决`localstorage`容量不够的情况,当设置存储方式为`local`时会优先使用 indexedDB 和 Web SQL 存储
- 新增支持接口入参条件判断缓存机制, 可在`cache`配置中传入 `(e:TCacheMethodReq) => boolean` 方法, 可针对具体接口设置缓存条件, 如列表接口查询数量大于 999 时缓存等

# 方案思路

- 确认三种缓存方式: `localStorage, sessionStorage, memory`
- 区分接口数据存储类型, local 和 session 类型也会在 memory 里再存一次以优先从 memory 里取,提升效率
- 缓存的 key 通过`api + headers + params`区分,保证唯一性
- 封装 `ExpriesCache` 的类, 处理 `set,get,isOut,clear` 相关逻辑
- 在 `request` 层做请求前拦截, 避免改动 api 的 function
- 通过 `enum` 配置项增加所需缓存接口和缓存配置, 后续添加新的接口或者修改缓存接口配置只需改动此文件即可, 后续也可把此配置项通过管理后台动态配置维护
- 当登录失效或者退出登录时清除本地缓存避免缓存空间溢出
