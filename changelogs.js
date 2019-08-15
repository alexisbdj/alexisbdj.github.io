async function displayChangeLogs() {
    let data;
    try {
        data = await getLocalJsonFile('./changelogs.json');
    }
    catch (err) {
        console.error(err);
        return;
    }
    let changelogDiv = document.getElementById('changelogs');
    data = data.changelogs;
    if (data == undefined) {
        console.error('wrong changelogs.json');
        return;
    }
    let template = await getLocalFileAsString('template.html');
    for (let i = data.length - 1; i >= 0; i--) {
        addObjectToElemUsingTemplate(data[i], template, changelogDiv);
    }
}