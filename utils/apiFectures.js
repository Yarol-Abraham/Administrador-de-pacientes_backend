exports.paginate = (page = 1, limit = 20)=>{
    page = page * 1 || 1;
    limit = limit * 1 || 100;
    skip = (page - 1) * limit;
    return { skip, limit }
};