import request from '../util/request'
export const getCode = function(data){
    return request.post('/get/code',data)
}
export const userAuthentication=function(data){
    return request.post('/user/authentication',data)
}
export const Login=function(data){
    return request.post('/login',data)
}
export const authAdmin=function(params){
    return request.get('/auth/admin',{params})
}
export const userGetmenu=function(){
    return request.get('/user/getmenu')
}
export const menuList=function(params){
    return request.get('/menu/list',{params})
}
export const userSetmenu=function(data){
    return request.post('/user/setmenu',data)
}
export const menuSelectlist=function(){
    return request.get('/menu/selectlist')
}
export const updateUser=function(data){
    return request.post('/update/user',data)
}
export const photoList=function(){
    return request.get('/photo/list')
}
export const Companion=function(data){
    return request.post('/companion',data)
}
export const companionList=function(params){
    return request.get('/companion/list',{params})
}
export const deleteCompanion=function(data){
    return request.post('/delete/companion',data)
}
export const adminOrder=function(params){
    return request.get('/admin/order',{params})
}
export const updateOrder=function(data){
    return request.post('/update/order',data)
}