export const setsEqual = (setA, setB) => {
    if (setA === null && setB === null) return true;

    if (setA === null) return false;
    if (setB === null) return false;

    if (setA.size !== setB.size) return false;

    for (const a of setA) if (!setB.has(a)) {
        console.log('SetB does not have:', a, setA, setB);
        return false;
    }
    return true;
};

export const cloneObject = (item) => {
    let result = null;
    if (!item) return result;

    if (item instanceof Date) return new Date(item);
    if (item instanceof Map) return new Map(item);
    if (item instanceof Set) return new Set(item);
    
    if (Array.isArray(item)) {
        item.forEach(element => {
            result.push(cloneObject(element));
        });
    }
    else if (item instanceof Object && !(item instanceof Function)) {
        result = {};
        for (let key in item) {
            if (key) {
                result[key] = cloneObject(item[key]);
            }
        }
    }
    return result || item;
};