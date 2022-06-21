import axios from 'axios'

// 服务器IP
const IP = 'http://127.0.0.1:5000'
// 请求基本路径 
axios.defaults.baseURL = IP

//商品图片上传接口地址
export const ITEMS_IMG_UPLOAD = IP + '/goods/goods_img_upload'
//获取商品图片地址
export const GET_ITEMS_IMG = IP + '/upload/imgs/goods_img/'


// 登录api
// account账号
// password密码
// es5写法
// export function login(account,password) {
//     return axios.post('/users/checkLogin',{account,password})
// }


//上传店铺头像
export const UPLOAD_SHOP_IMG = IP + '/shop/upload'
//获取店铺图片地址
export const GET_SHOPS_IMG = IP + '/upload/shop/'



// es6
// 登录页面发送axios
export var login = (account, password) => axios.post('/users/checkLogin', { account, password })

//------------------------------------------账号管理-----------------------------------------------//

//添加账号
export var useradd = (account, password, userGroup) => axios.post('/users/add', { account, password, userGroup })

//账号列表
export var userlist = (currentPage, pageSize) => axios.get('/users/list', { params: { currentPage, pageSize } })

// 删除账号
export var userDelete = (id) => axios.get('/users/del', { params: { id } })

// 批量删除账号
export var userbatchDelete = (ids) => axios.get('/users/batchdel', { params: { ids } })

//修改账号
export var userEdit = (id, account, userGroup) => axios.post('/users/edit', { id, account, userGroup })

//获取账号的个人信息
export var accinfo = (id) => axios.get('/users/accountinfo', { params: { id } })


//------------------------------------订单管理------------------------------//

export var orderlist = (params) => axios.get('/order/list', { params })


//------------------------------------------商品管理API-----------------------------------------------//
// 获取商品分类
export var catelist = (currentPage, pageSize) => axios.get('/goods/catelist', { params: { currentPage, pageSize } })

// 编辑商品分类
export var editcate = (params) => axios.post('/goods/editcate', params)

//获取商品所有分类
export var categories = () => axios.get('/goods/categories')




//添加商品
export var additem = (params) => axios.post('/goods/add', params)

//获取商品列表
export var itemlist = (currentPage, pageSize) => axios.get('/goods/list', { params: { currentPage, pageSize } })

//删除商品
export var deleteitem = (id) => axios.get('/goods/del', { params: { id } })

// 修改商品
export var edititem = (params) => axios.post('/goods/edit', params)


// ------------------------------------echarts统计API---------------------------------//
// 首页
export var echarts_totaldata = () => axios.get('/order/totaldata')

//订单统计
export var echarts_orderdata = (date) => axios.get('/order/ordertotal', { params: { date } })


// ------------------------------------店铺管理---------------------------------//
// 获取店铺详情
export var shop_info = () => axios.get('/shop/info')

//修改店铺信息
export var shop_edit = (params) => axios.post('/shop/edit', params)

// token账号时效性验证 用户令牌
export var checktoken = (token) => axios.get('/users/checktoken', { params: { token } })


//export xxx //多次暴露， import {} from ''
//export default xxx //默认暴露，只能暴露一次  import xx from 'xx'