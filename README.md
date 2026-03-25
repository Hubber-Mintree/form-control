# Form-control

An extension for htmx intended to give more control over data submitted from forms.

Encodes data as JSON and allows for declarative typing of values.

### Activation

Add attribute hx-ext="form-control" to the element triggering the request.

Examples
```HTML

<!-- Works on out-of-form submission triggers as long as the form attribute is set -->
<form id="my_form">
</form>
<button form="my_form" hx-ext="form-control" hx-post="/my/api" hx-swap="outerHTML" hx-target="body" type="submit">
```

### Typing

Form-control relies solely on the attribute ```js-type``` for typing values while encoding. Any element without this
attribute will be encoded as a string.

Supported values for ```js-type``` are as follows:

- "number": for integer and floating point values

- "boolean": for boolean values (evaluates as ```value === "true"```)

- "array": for initializing arrays

- "ignore": for not including values in encoded data

Examples
```HTML
<!-- Encodes as {"my_number": 5} -->
<input type="number" name="my_number" js-type="number" value="5">

<!-- Encodes as {"my_string": "5"} -->
<input type="text" name="my_string" value="5">

<!-- Encodes as {"my_boolean": true} -->
<input type="checkbox" name="my_boolean" js-type="boolean" checked>

<!-- Encodes as {"my_array": []} -->
<input type="hidden" name="my_array" js-type="array">

<!-- Not encoded -->
<input type="hidden" name="my_data" js-type="ignore">
```

### Arrays

Arrays are built from elements which have the same name attribute in the order they appear in the form. If an array 
initialization element is present, then it should be before any of the other elements for the same array.

The array initialization element is required for arrays of length <= 1, but is optional for larger arrays. Any value on 
an array initialization element is ignored;

Examples
```HTML
<!-- Encodes as {"my_empty_array": []} -->
<input type="hidden" name="my_empty_array" js-type="array">                     <!-- array initialization element -->

<!-- Encodes as {"my_short_array": [1]} -->
<input type="hidden" name="my_short_array" js-type="array">                     <!-- array initialization element -->
<input type="number" name="my_short_array" js-type="number" value="1">          <!-- array item element -->

<!-- Encodes as {"my_long_array": [1, 2]} -->
<input type="hidden" name="my_long_array" js-type="array">                      <!-- array initialization element -->
<input type="number" name="my_long_array" js-type="number" value="1">           <!-- array item element -->
<input type="number" name="my_long_array" js-type="number" value="2">           <!-- array item element -->

<!-- Encodes as {"my_other_long_array": [1, 2]} -->
<input type="number" name="my_other_long_array" js-type="number" value="1">     <!-- array item element -->
<input type="number" name="my_other_long_array" js-type="number" value="2">     <!-- array item element -->
```