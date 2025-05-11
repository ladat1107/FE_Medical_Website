export const generateUniqueKey = (length) => {
    return crypto.randomUUID().replace(/-/g, '').substring(0, length);
}