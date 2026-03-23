(function (){
    let api

    htmx.defineExtension('form-control', {
        init: function (apiRef) {
            api = apiRef
        },

        onEvent: function (name, evt) {
            if (name === 'htmx:configRequest') {
                evt.detail.headers['Content-Type'] = 'application/json'
            }
        },

        encodeParameters: function (xhr, parameters, elt) {
            xhr.overrideMimeType('application/json')

            const object = {}

            let form_name = elt.getAttribute('form')
            if (form_name) {
                form_elt = htmx.find('#'.concat(form_name))
            } else {
                form_elt = htmx.find('form')
            }

            inputs = htmx.findAll(form_elt, 'input, textarea')
            inputs.forEach(function(input_elt) {
                let key = input_elt.name
                let value = input_elt.value
                if (key !== null) {
                    if (value !== null) {
                        switch(input_elt.getAttribute('js-type')) {
                            case 'number':
                                addValue(object, key, Number(value))
                                break
                            case 'boolean':
                                addValue(object, key, value === 'true')
                                break
                            default:
                                addValue(object, key, escapeHtml(value))
                                break
                        }
                    } else if (key === 'empty') {
                        if (!Object.hasOwn(object, key)) {
                            object[key] = new Array()
                        }
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