(function() {

    // Vars.
    var eventLog = document.getElementById('eventLog');
    var HTMLLog = document.getElementById('HTMLLog');
    var logCounter = 1;

    // Methods.
    function escapeHTML(html) {
        return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function paddingToLength(str, len) {
        const spaces = Math.max(0, len - str.length);
        return str + '&nbsp;'.repeat(spaces);
    }

    function inputEventToString(event) {
        const typeStr = `type:<span class="type type-${event.type}">${event.type}</span>`;
        const inputTypeStr = `inputType:<span class="inputtype">${event.inputType}</span>`;
        var dataStr;
        if (event.dataTransfer) {
            const items = event.dataTransfer.items;
            dataStr = 'dataTransfer:';
            for (var i = 0; i < items.length; ++i) {
                dataStr += `"${items[i].type}"="${escapeHTML(event.dataTransfer.getData(items[i].type))}" `;
            }
        } else {
            dataStr = `data:<span class="data">"${escapeHTML(event.data)}"</span>`;
        }
        const isComposingStr = `isComposing:<span class="is-composing">${event.isComposing}</span>`;
        // Ranges.
        const ranges = event.getRanges();
        var rangeStr = '';
        for (var i = 0; i < ranges.length; ++i) {
            const range = ranges[i];
            rangeStr += `("${range.startContainer.textContent}":${range.startOffset}, "${range.endContainer.textContent}":${range.endOffset}), `;
        }
        rangeStr = `getRanges():[${rangeStr}]`;

        const eventStr = `<span class="prefix prefix-inputevent">InputEvent</span> - ${typeStr} ${inputTypeStr} ${dataStr} ${isComposingStr} ${rangeStr}`;
        return eventStr;
    }

    function compositionEventToString(event) {
        const typeStr = `type:<span class="type type-${event.type}">${event.type}</span>`;
        const dataStr = `data:<span class="data">"${event.data}"</span>`;

        const eventStr = `<span class="prefix prefix-compositionevent">CompositionEvent</span> - ${typeStr} ${dataStr}`;
        return eventStr;
    }

    function appendLog(str) {
        eventLog.innerHTML = `<span class="log-counter">${logCounter}.</span> ${str}</br> ${eventLog.innerHTML}`;
        ++logCounter;
    }

    function refreshHTMLLog() {
        HTMLLog.innerHTML = escapeHTML(editor.innerHTML);
    }

    // Event listeners.
    document.addEventListener('beforeinput', event => {
        console.log(event);
        appendLog(inputEventToString(event));
    });

    document.addEventListener('input', event => {
        console.log(event);
        appendLog(inputEventToString(event));
        refreshHTMLLog();
    });

    ['compositionstart', 'compositionupdate', 'compositionend'].forEach( name => {
        document.addEventListener(name, event => {
            console.log(event);
            appendLog(compositionEventToString(event));
        });
    })

    document.getElementById('btn-clear-log').addEventListener('click', () => {
        eventLog.innerHTML = '';
        logCounter = 1;
    });

    // Start.
    refreshHTMLLog();
})();
