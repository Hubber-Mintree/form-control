# Form-control

An extension for htmx to give more control over data submitted from forms.
 
Feature Summary:
- Supports both URL and JSON encoding
- Preserves type information via declarative typing; as encoding allows
- Exclusion of specific fields

## Activation

Add attribute hx-ext="form-control" to the element triggering the request.

Examples
```HTML
<!-- Add ```hx-ext="form-control" to the element the hx-* event is on -->
<form id="my_form" hx-ext="form-control" hx-post="/my/api" hx-swap="outerHTML" hx-target="body">
    <button type="submit">
</form>

<!-- Works on out-of-form submission triggers as long as the form attribute is set -->
<form id="my_form">
</form>
<button form="my_form" hx-ext="form-control" hx-post="/my/api" hx-swap="outerHTML" hx-target="body" type="submit">
```

## Encoding

Form-control supports JSON and URL encodings

By default, forms are url encoded via URLSearchParams. In this format, not all type information can be preserved.

Add attribute fc-enc to the element triggering the request in order to specify the encoding type.

Values from the form's descendant elements are encoded before those of elements external to the form.

Supported values for ```fc-enc``` are as follows:

- 'json'

- 'url'

```HTML
<form id="my_form">
</form>
<button form="my_form" hx-ext="form-control" fc-enc='json' hx-post="/my/api" hx-swap="outerHTML" hx-target="body" type="submit">
```

## Typing

Form-control relies solely on the attribute ```fc-type``` for typing values while encoding. Any element without this
attribute will be encoded as a string.

Supported values for ```fc-type``` are as follows:

- "number": integer and floating point values

- "boolean": boolean values, either literals or string representations

- "array": for initializing arrays

- "ignore": for not including values in encoded data

- any other element with a valid value property is encoded as a string

Examples
```HTML
<!-- Encodes as {"my_number": 5} -->
<input type="number" name="my_number" fc-type="number" value="5">

<!-- Encodes as {"my_string": "5"} -->
<input type="text" name="my_string" value="5">

<!-- Encodes as {"my_boolean": true} -->
<input type="checkbox" name="my_boolean" fc-type="boolean" checked>

<!-- Encodes as {"my_array": []} -->
<input type="hidden" name="my_array" fc-type="array">

<!-- Not encoded -->
<input type="hidden" name="my_data" fc-type="ignore">
```

## Arrays

Arrays are built from elements which have the same name attribute in the order they appear in the form. If an array 
initialization element is present, then it should be before any of the other elements for the same array (descendant 
elements to the form are always evaluated before external elements).

The array initialization element is required for arrays of length <= 1, but is optional for larger arrays. Any value on 
an array initialization element is ignored;

Examples
```HTML
<!-- Encodes as {"my_empty_array": []} -->
<input type="hidden" name="my_empty_array" fc-type="array">                     <!-- array initialization element -->

<!-- Encodes as {"my_short_array": [1]} -->
<input type="hidden" name="my_short_array" fc-type="array">                     <!-- array initialization element -->
<input type="number" name="my_short_array" fc-type="number" value="1">          <!-- array item element -->

<!-- Encodes as {"my_long_array": [1, 2]} -->
<input type="hidden" name="my_long_array" fc-type="array">                      <!-- array initialization element -->
<input type="number" name="my_long_array" fc-type="number" value="1">           <!-- array item element -->
<input type="number" name="my_long_array" fc-type="number" value="2">           <!-- array item element -->

<!-- Encodes as {"my_other_long_array": [1, 2]} -->
<input type="number" name="my_other_long_array" fc-type="number" value="1">     <!-- array item element -->
<input type="number" name="my_other_long_array" fc-type="number" value="2">     <!-- array item element -->
```