export function login_validate(values) {
    const errors = {}
    if (!values.email) {
        errors.email = "Required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "invalid email address"
    }

    if (!values.password) {
        errors.password = "Required"
    } else if (values.password.length < 8 || values.password.length > 20) {
        errors.password = "Must be greater then 8 and less then 20 characters long"
    } else if (values.password.includes(" ")) {
        errors.password = "password should not contain whitespaces"
    }
    return errors
}

export  function signup_validate(values) {
    const errors = {}

    if (!values.username) {
        errors.username = "username Required"
    } else if (values.username.includes(" ")) {
        errors.username = "username should not contain whitespaces"
    }

    if (!values.email) {
        errors.email = "Required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "invalid email address"
    }

    if (!values.password) {
        errors.password = "Required"
    } else if (values.password.length < 8 || values.password.length > 20) {
        errors.password = "Must be greater then 8 and less then 20 characters long"
    } else if (values.password.includes(" ")) {
        errors.password = "password should not contain whitespaces"
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = "Required"
    } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "password does not match"
    } 

    return errors
}



export  function post_validate(values) {
    const errors = {}

    if (!values.title) {
        errors.title = "Title Required"
    } 
    if (!values.category) {
        errors.category = "category Required"
    } 
    if (!values.imgurl) {
        errors.imgurl = "Required"
    }

    if (!values.content) {
        errors.content = "Required"
    } else if (values.content.length < 100 || values.content.length > 500) {
        errors.content = "Must be greater then 100 and less then 500 characters long"
    }
    return errors
}
