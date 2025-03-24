const validationSignUp = (req) =>{
    const { firstName, LastName, password,about} = req.body
    // if(!firstName && !LastName){
    //     throw new Error("User Name is not Valids")
    // }
 if(about.length <20){
        throw new Error("About can not wwrite more than 20word")
    }
}

const validationProfileEdit = (req) =>{
    const allowedEditFiled = ["firstName", "LastName", "gender", "age", "about", "skills", "photoURL"];
    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFiled.includes(field))
    return isEditAllowed
}


module.exports = {
    validationSignUp,
    validationProfileEdit
}