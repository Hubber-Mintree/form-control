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

            let form_id = elt.getAttribute('form')
            if (form_id) {
                form_elt = htmx.find('#'.concat(form_id))
            } else {
                form_elt = htmx.find('form')
            }

            inputs = htmx.findAll(form_elt, 'input, textarea, select')
            inputs.forEach(function(input_elt) {
                let key = input_elt.name
                let value = input_elt.value
                if (key !== null) {
                    switch(input_elt.type) {
                        case 'checkbox':
                            value = input_elt.checked
                            break
                        default:
                            break
                    }
                    if (value !== null) {
                        switch(input_elt.getAttribute('js-type')) {
                            case 'array':
                                addValue(object, key, new Array())
                                break
                            case 'number':
                                addValue(object, key, Number(value))
                                break
                            case 'boolean':
                                addValue(object, key, value === 'true')
                                break
                            case 'ignore':
                                break
                            default:
                                addValue(object, key, escapeHtml(value))
                                break
                        }
                    }
                }
            })
            return (JSON.stringify(object))
        }
    })

    // Copied from mustache.js under MIT license
    // https://github.com/janl/mustache.js/
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
    // END COPIED CODE

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