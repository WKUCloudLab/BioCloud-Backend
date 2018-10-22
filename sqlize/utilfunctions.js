
function objIsEmpty(obj){
    if(Object.keys(obj).length === 0 && obj.constructor === Object || !obj){
        return true;
    }
}
module.exports.objIsEmpty = objIsEmpty;
