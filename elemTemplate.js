function isCharAlpha(char) {
    return ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'z'));
}

function getTemplateVarSize(template, index) {
    for (let i = index + 1; i < template.length; i++) {
        if (!isCharAlpha(template[i])) {
            return i - index;
        }
    }
    return 0;
}

function TemplateValueArrayToList(value) {
    let newValue = "";
    for (let i = 0; i < value.length; i++) {
        newValue += `<li>${value[i]}</li>`;
    }
    return newValue;
}

function setTemplateValues(template, object) {
    let result = template.slice();

    while (true) {
        let index = result.indexOf('%');
        if (index == -1) {
            return result;
        }
        let varSize = getTemplateVarSize(result, index);
        let symbolName = result.substr(index + 1, varSize - 1);
        let fullVarName = result.substr(index, varSize);
        let value = object[symbolName];
        if (typeof value == 'object') {
            value = TemplateValueArrayToList(value);
        }
        result = result.replace(fullVarName, value);
    }
}

function strToHtml(str) {
    let template = document.createElement('template');
    str = str.trim();
    template.innerHTML = str;
    return template.content.firstChild;
}

function addObjectToElemUsingTemplate(object, template, elem) {
    elem.appendChild(strToHtml(setTemplateValues(template, object)));
}