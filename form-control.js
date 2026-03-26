(function (){
    let api
    let encoding = 'url'

    htmx.defineExtension('form-control', {
        init: function (apiRef) {
            api = apiRef
        },

        onEvent: function (name, evt) {
            if (name === 'htmx:configRequest') {
                if (evt.target.getAttribute('fc-enc') === 'json') {
                    encoding = 'json'
                    evt.detail.headers['Content-Type'] = 'application/json'
                }
            }
        },

        encodeParameters: function (xhr, parameters, elt) {
            let form
            if (elt.nodeName === 'FORM') {
                form = elt
            } else if (elt.hasOwn('form')) {
                form = elt.form
            } else {
                throw new Error('Form element could not be found, check that hx-ext is set on an appropriate element')
            }

            const object = {}

            // Collect values from elements inside form and those outside the form associated via the form attribute
            objectify(object, form.querySelectorAll('*'))
            if (form.hasAttribute('id')) {
                const outer_nodes = htmx.findAll('[form=${form.id}]:not(#${form.id} *)')
                if (outer_nodes.length > 0) {
                    objectify(object, outer_nodes)
                }
            }

            if (encoding === 'json') {
                xhr.overrideMimeType('application/json')
                return (JSON.stringify(object))
            } else {
                const params = new URLSearchParams(Object.entries(object))
                return params.toString()
            }
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

    function objectify(obj, nodes) {
        for (const node of nodes) {
            const key = node.name
            let value = node.value
            const type = node.type

            if (key != null) {
                switch(type) {
                    case 'checkbox':
                        value = node.checked
                        break
                    case 'radio':
                        // null value to skip unchecked radio
                        if (!node.checked) {
                            value = null
                        }
                        break
                    default:
                        break
                }

                if (value != null) {
                    switch(node.getAttribute('fc-type')) {
                        case 'array':
                            addValue(object, key, new Array())
                            break
                        case 'number':
                            addValue(object, key, Number(value))
                            break
                        case 'boolean':
                            addValue(object, key, value || value === 'true')
                            break
                        case 'ignore':
                            break
                        default:
                            addValue(object, key, escapeHtml(value))
                            break
                    }
                }
            }
        }
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