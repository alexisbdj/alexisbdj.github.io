function getLocalFileAsUint8Array(path) {
    return fetch(path).then((res) => {
        if (res.ok) {
            let reader = res.body.getReader();
            let result = new Uint8Array(0);
            return reader.read().then(function ok(res) {
                if (res.value != undefined) {
                    let t = new Uint8Array(result.length + res.value.length);
                    t.set(result);
                    t.set(res.value, result.length);
                    result = t;
                }
                if (!res.done) {
                    return reader.read().then(ok);
                }
                return result;
            });
        }
        else {
            throw new Error('getLocalFile err: ' + res.statusText);
        }
    });
}

function getLocalFileAsString(path) {
    return getLocalFileAsUint8Array(path).then((res) => {
        return new TextDecoder().decode(res);
    },
    (err) => {
        throw new Error('getLocalFileAsString err: ' + err.message);
    });
}

function getLocalJsonFile(path) {
    return getLocalFileAsString(path).then((res) => {
        return JSON.parse(res);
    },
    (err) => {
        throw new Error("getLocalJsonFile error: " + err.message);
    });
}
