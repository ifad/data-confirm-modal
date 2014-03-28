# Data-Confirm Modal

Uses [Bootstrap's modals](http://twitter.github.io/bootstrap/javascript.html#modals)
in place of the browser's builtin `confirm()` API for links generated through Rails'
helpers with the `:confirm` option.

Any link with the `data-confirm` attribute will trigger a Bootstrap modal.

HTML in the modal supported, and also the ability to have the user input a
certain value, for extra willingness confirmation (inspired by GitHub's
"delete repository" function).

## Installation

Add this line to your application's Gemfile:

    gem 'data-confirm-modal', github: 'ifad/data-confirm-modal'

if you are stuck on Bootstrap 2.3, use the `bootstrap2` branch:

    gem 'data-confirm-modal', github: 'ifad/data-confirm-modal', branch: 'bootstrap2'

Then execute:

    $ bundle

And then require the Javascript from your `application.js`:

    //= require data-confirm-modal

## Usage

By default, the overrides Rails' default behaviour for you, with no change
required to your code. The modal is applicable to `<a>`, `<button>` and `<input[submit]>` 
elements.

The modal's title will be get from the link's `title` attribute value. The
modal text will be taken from the `data-confirm` value. Multiple paragraphs
are created automatically from two newlines (`\n\n`).

The modal's 'confirm' button text can be customized using the `data-commit`
attribute.

If you want to add a verification input, use a `data-verify` attribute, whose
value is what you want your user to input.

You can set global setting using `dataConfirmModal.setDefaults`, for example:

    dataConfirmModal.setDefaults({
      title: 'Confirm your action',
      commit: 'Continue',
      cancel: 'Cancel'
    });

To restore default settings use `dataConfirmModal.restoreDefaults()`.

## Authors

* Marcello Barnaba ([@vjt](https://github.com/vjt))
* LLeir Borras Metje ([@lleirborras](https://github.com/lleirborras))

## Background

Spinned off a corporate [IFAD](http://github.com/ifad/) application in which
an user did too much damage because the confirm wasn't *THAT* explicit ... ;-).

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
