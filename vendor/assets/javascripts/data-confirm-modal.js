/*
 * Implements a user-facing modal confirmation when link has a
 * "data-confirm" attribute using bootstrap's modals. MIT license.
 *
 *   - vjt@openssl.it  Tue Jul  2 18:45:15 CEST 2013
 */
(function ($) {

  /**
   * Builds the markup for a [Bootstrap modal](http://twitter.github.io/bootstrap/javascript.html#modals)
   * for the given `element`. Uses the following `data-` parameters to
   * customize it:
   *
   *  * `data-confirm`: Contains the modal body text. HTML is allowed.
   *                    Separate multiple paragraphs using \n\n.
   *  * `data-commit`:  The 'confirm' button text. "Confirm" by default.
   *  * `data-cancel`:  The 'cancel' button text. "Cancel" by default.
   *  * `data-verify`:  Adds a text input in which the user has to input
   *                    the text in this attribute value for the 'confirm'
   *                    button to be clickable. Optional.
   *  * `data-verify-text`:  Adds a label for the data-verify input. Optional
   *  * `data-focus`:   Define focused input. Supported values are
   *                    'cancel' or 'commit', 'cancel' is default for
   *                    data-method DELETE, 'commit' for all others.
   *
   * You can set global setting using `dataConfirmModal.setDefaults`, for example:
   *
   *    dataConfirmModal.setDefaults({
   *      title: 'Confirm your action',
   *      commit: 'Continue',
   *      cancel: 'Cancel',
   *      fade:   false,
   *      verifyClass: 'form-control',
   *    });
   *
   */

  var defaults = {
    title: 'Are you sure?',
    commit: 'Confirm',
    commitClass: 'btn-danger',
    cancel: 'Cancel',
    cancelClass: 'btn-default',
    fade: true,
    verifyClass: '',
    elements: ['a[data-confirm]', 'button[data-confirm]', 'input[type=submit][data-confirm]'],
    focus: 'commit'
  };

  var settings;

  window.dataConfirmModal = {
    setDefaults: function (newSettings) {
      settings = $.extend(settings, newSettings);
    },

    restoreDefaults: function () {
      settings = $.extend({}, defaults);
    }
  };

  dataConfirmModal.restoreDefaults();

  var buildModal = function (element) {
    var id = 'confirm-modal-' + String(Math.random()).slice(2, -1);
    var fade = settings.fade ? 'fade' : '';

    var modal = $(
      '<div id="'+id+'" class="modal '+fade+'" tabindex="-1" role="dialog" aria-labelledby="'+id+'Label" aria-hidden="true">' +
        '<div class="modal-dialog">' +
          '<div class="modal-content">' +
            '<div class="modal-header">' +
              '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
              '<h4 id="'+id+'Label" class="modal-title"></h4> ' +
            '</div>' +
            '<div class="modal-body"></div>' +
            '<div class="modal-footer">' +
              '<button class="btn cancel" data-dismiss="modal" aria-hidden="true"></button>' +
              '<button class="btn commit"></button>' +
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'
    );

    var title = element.attr('title') || element.data('original-title') || settings.title;

    modal.find('.modal-title').text(title);

    var body = modal.find('.modal-body');

    $.each(element.data('confirm').split(/\n{2}/), function (i, piece) {
      body.append($('<p/>').html(piece));
    });

    var commit = modal.find('.commit');
    commit.text(element.data('commit') || settings.commit);
    commit.addClass(element.data('commit-class') || settings.commitClass);

    var cancel = modal.find('.cancel');
    cancel.text(element.data('cancel') || settings.cancel);
    cancel.addClass(element.data('cancel-class') || settings.cancelClass);

    if(element.data('remote')){
      commit.attr('data-dismiss', 'modal');
    }

    var verify_label = element.data('verify-text');
    var verify = element.data('verify');
    var regexp = element.data('verify-regexp');

    if (verify || regexp) {
      commit.prop('disabled', true);

      var isMatch;
      if (regexp) {
        var caseInsensitive = element.data('verify-regexp-caseinsensitive');
        var re = new RegExp(regexp, caseInsensitive ? 'i' : '');

        isMatch = function (input) { return input.match(re) };
      } else {
        isMatch = function (input) { return verify == input };
      }

      var verify_label_text = $('<p>', {text: verify_label});

      var verification = $('<input/>', {"type": 'text', "class": settings.verifyClass}).on('keyup', function () {
        commit.prop('disabled', !isMatch($(this).val()));
      });

      modal.on('shown', function () {
        verification.focus();
      });

      modal.on('hide', function () {
        verification.val('').trigger('keyup');
      });
      body.append(verify_label_text)
      body.append(verification);
    }

    modal.data('confirmed', false);
    commit.on('click', function () {
      modal.data('confirmed', true);
      element.trigger('click');
      modal.modal('hide');
    });

    $('body').append(modal);

    return modal;
  };


  /**
   * Returns a modal already built for the given element or builds a new one,
   * caching it into the element's `confirm-modal` data attribute.
   */
  var getModal = function (element) {
    var modal = element.data('confirm-modal') || buildModal(element);

    if (modal && !element.data('confirm-modal'))
      element.data('confirm-modal', modal);

    return modal;
  };

  if ($.rails) {
    /**
     * Attaches to the Rails' UJS adapter 'confirm' event on links having a
     * `data-confirm` attribute. Temporarily overrides the `$.rails.confirm`
     * function with an anonymous one that returns the 'confirmed' status of
     * the modal.
     *
     * A modal is considered 'confirmed' when an user has successfully clicked
     * the 'confirm' button in it.
     */
    $(document).delegate(settings.elements.join(', '), 'confirm', function() {
      var element = $(this), modal = getModal(element);
      var confirmed = modal.data('confirmed');

      if (!confirmed && !modal.is(':visible')) {
        modal.modal('show');

        var confirm = $.rails.confirm;
        $.rails.confirm = function () { return modal.data('confirmed'); }
        var focus_element;
        if (element.data('focus')) {
          focus_element = element.data('focus');
        } else if (element.data('method')=='delete') {
          focus_element = 'cancel'
        } else {
          focus_element = settings.focus;
        }
        modal.on('shown.bs.modal', function () { modal.find('.' + focus_element).focus(); });
        modal.on('hide', function () { $.rails.confirm = confirm; });
      }

      return confirmed;
    });
  }

})(jQuery);
