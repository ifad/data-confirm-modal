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
   *  * `data-verify`:  Adds a text input in which the user has to input
   *                    the text in this attribute value for the 'confirm'
   *                    button to be clickable. Optional.
   */
  var buildModal = function (element) {
    var id = 'confirm-modal-' + String(Math.random()).slice(2, -1);

    var modal = $(
      '<div id="'+id+'" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="'+id+'Label" aria-hidden="true">' +
        '<div class="modal-header">' +
          '<button class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
          '<h3 id="'+id+'Label"></h3> ' +
        '</div>' +
        '<div class="modal-body"></div>' +
        '<div class="modal-footer">' +
          '<button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>' +
          '<button class="btn btn-danger commit"></button>' +
        '</div>'+
      '</div>'
    );

    var title = element.attr('title') || element.data('original-title') || 'Are you ABSOLUTELY sure?';

    modal.find('.modal-header h3').text(title);

    var body = modal.find('.modal-body');

    $.each(element.data('confirm').split(/\n{2}/), function (i, piece) {
      body.append($('<p/>').html(piece));
    });

    var commit = modal.find('.commit');
    commit.text(element.data('commit') || 'Confirm');

    if(element.data('remote')){
      commit.attr('data-dismiss', 'modal');
    }

    var verify = element.data('verify');
    if (verify) {
      commit.prop('disabled', true);

      var verification = $('<input/>', {type: 'text'}).on('keyup', function () {
        commit.prop('disabled', $(this).val() !== verify);
      });

      modal.on('shown', function () {
        verification.focus();
      });

      modal.on('hide', function () {
        verification.val('').trigger('keyup');
      });

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
  }

  /**
   * Attaches to the Rails' UJS adapter 'confirm' event on links having a
   * `data-confirm` attribute. Temporarily overrides the `$.rails.confirm`
   * function with an anonymous one that returns the 'confirmed' status of
   * the modal.
   *
   * A modal is considered 'confirmed' when an user has successfully clicked
   * the 'confirm' button in it.
   */
  $(document).delegate('a[data-confirm]', 'confirm', function (e) {
    var element = $(this), modal = getModal(element);
    var confirmed = modal.data('confirmed');

    if (!confirmed && !modal.is(':visible')) {
      modal.modal('show');

      var confirm = $.rails.confirm;
      $.rails.confirm = function () { return modal.data('confirmed'); }
      modal.on('hide', function () { $.rails.confirm = confirm; });
    }

    return confirmed;
  });

})(jQuery);
