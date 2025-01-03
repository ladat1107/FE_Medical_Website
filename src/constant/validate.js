

export const REGEX = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    phoneNumber: /^((\+84)|0)([3|5|7|8|9][0-9]){8}$/
}

export const MESSAGE = {
    required: "please enter your information",
    email: "please enter your email with fomart abc@def.com",
    phoneNumber: "Please enter a valid phone number in the format +84xxxxxxxxx or 0xxxxxxxxx",
    policy: "Please agree with our policy",
    confirm: "Your confirm password is not correct",
    password: "Password must contain at least 8 characters, including uppercase, lowercase letters, numbers and special characters",
    
}