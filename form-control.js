(function (){
    let api

    htmx.defineExtension('form-control', {
        init: function (apiRef) {
            api = apiRef
        },

        onEvent: function (name, evt) {
            if (name === 'htmx:configRequest') {
                evt.detail.headers['Content-Type'] = 'application-json'
            }
        },

        encodeParameters: function (xhr, parameters, elt) {
            xhr.overrideMimeType('application/json')

            const object = {}

            const inputs = api.findAll(elt, 'input')
            inputs.forEach(function(input_elt) {
                let key = input_elt.getAttribute('name')
                let value = input_elt.getAttribute('value')
                if (key !== null && value !== null) {
                    switch(input_elt.getAttribute('js-type')) {
                        case 'number':
                            addValue(Number(value))
                            break
                        case 'boolean':
                            object[key] = addValue(value === 'true')
                            break
                        default:
                            object[key] = addValue(escapeHtml(value))
                            break
                        case null:
                            break
                    }
                }
            })
            return (JSON.stringify(object))
        }
    })

    var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
    };

    function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    })
    }

    function addValue(obj, key, val) {
        if (Object.hasOwn(obj, key)){
            if (!Array.isArray(obj[key])) {
                obj[key] = [obj[key]]
            }
            obj[key].push(val)
        } else {
            obj[key] = val
        }
    }
})()