export type TCacheMethodReq = {
  api: string
  headers: Indexable
  params: Indexable
}

type TCacheApi = {
  cache: boolean | ((e: TCacheMethodReq) => boolean) // 是否缓存(可接收当前api入参判断)
  time: number // 缓存时间(单位小时)
  cacheType: 'local' | 'session' | 'memory' // 缓存类型(memory缓存在内存里,刷新后清除)
}

/** 缓存接口枚举 */
export const CACHE_APIS: ReadonlyRecordable<TCacheApi> = {
  /** 查询证件类型或国家 */
  '/api/dictionary_web/v1/item/type': {
    cache: true,
    time: 24,
    cacheType: 'local',
  },
  /** 查询民族 */
  '/api/dictionary_web/v1/item/refresh': {
    cache: true,
    time: 24,
    cacheType: 'local',
  },
  /** 查询商祺会会员等级 */
  '/api/agreement_web/fitBase/queryMembershipLevel': {
    cache: true,
    time: 24,
    cacheType: 'local',
  },
  /** 查询百达星会员等级 */
  '/api/agreement_web/fitBase/queryStarMembershipLevel': {
    cache: true,
    time: 24,
    cacheType: 'local',
  },
  /** 根据酒店code或者酒店id查询id或者code */
  '/api/merchant_web/v1/hotel/code_to_id': {
    cache: true,
    time: 1,
    cacheType: 'session',
  },
  /** 获取支付类型（该值和预订类型联动） */
  '/api/system_config/v1/book_type/get_pay_type_list': {
    cache: true,
    time: 1,
    cacheType: 'session',
  },
  /** 获取担保额度数据（该值和预订类型联动） */
  '/api/system_config/v1/book_type/get_guarantee_amount_list_all': {
    cache: true,
    time: 1,
    cacheType: 'session',
  },
  /** 费用码   */
  '/api/system_config/v1/accounting_code_fee/query_list_by_hotel': {
    cache: true,
    time: 1,
    cacheType: 'session',
  },
  /** 付款码   */
  '/api/system_config/v1/accounting_code_pay/query_list_by_hotel': {
    cache: true,
    time: 1,
    cacheType: 'session',
  },
  /** 查询房态相关枚举 */
  '/api/state_web/room/sta/getEnum': {
    cache: true,
    time: 1,
    cacheType: 'local',
  },
  /** 获取事业部   */
  '/api/merchant_web/v1/dict/get_dict_list': {
    cache: true,
    time: 1,
    cacheType: 'session',
  },
  /** 获取品牌列表   */
  '/api/merchant_web/v1/merchant/brand/query_list': {
    cache: true,
    time: 2,
    cacheType: 'session',
  },
  /** 获取携程酒店   */
  '/api/setting-center/setting/ctripHotel/mergeHotelMatch': {
    cache: true,
    time: 2,
    cacheType: 'session',
  },
  /** 根据通用组别类型查询通用组别码列表 */
  '/api/system_config/v1/parent_code/query_list': {
    cache: true,
    time: 1,
    cacheType: 'session',
  },
  /** 根据通用码类型查询通用码列表 */
  '/api/system_config/v1/common_code/query_by_type': {
    cache: true,
    time: 1,
    cacheType: 'session',
  },
  /** 获取计费周期列表 */
  '/api/system_config/v1/package_price/get_billing_cycle_list': {
    cache: true,
    time: 1,
    cacheType: 'session',
  },
  /** 获取包价码类型列表 */
  '/api/system_config/v1/package_price/get_package_type_list': {
    cache: true,
    time: 1,
    cacheType: 'session',
  },
  /** 获取订单日志枚举列表 */
  '/api/order_center/v1/operator_log/getEnum': {
    cache: true,
    time: 24,
    cacheType: 'local',
  },
  /** 获取酒店列表 */
  '/api/merchant_web/v1/hotel/query_basic_list': {
    cache: (e) => !e.params.pmsType, // 查询类型为全部时缓存
    time: 1,
    cacheType: 'session',
  },
  /** 房价码列表 */
  '/api/room_price/pr/priceplanhotel/page': {
    cache: (e) => e.params.pageSize >= 999, // 查询全部时缓存
    time: 1,
    cacheType: 'memory',
  },
}
