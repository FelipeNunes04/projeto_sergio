// Based on
// 1) EZPZ Hint v1.1.1; Copyright (c) 2009 Mike Enriquez, http://theezpzway.com
// 2) http://gist.github.com/379601
// Modified by Sam Woodard
// Released under the MIT License
(function($){
  $.supportPlaceHolder = function () {
    var retval = false;
    if(!!('placeholder' in document.createElement('input'))) {
      retval = true;
    }
    return retval;
  };

 $.fn.placeholder = function(options){
   if ($.supportPlaceHolder()) {
     return $(this);
   }

   options = options || {};
  var defaults = {
    placeholderClass: 'placeholder',
   hintClass: 'placeholder_el',
   hintName: 'placeholder_dummy_input'
  };
  var settings = $.extend(defaults, options);

  return this.each(function(i){
    if ($(this).attr('type') !== 'password') {
        $(this).focus(function() {
          var input = $(this);
          if (input.val() == input.attr('placeholder')) {
            input.val('');
            input.removeClass(settings.placeholderClass);
          }
        }).blur(function() {
          var input = $(this);
          if (input.val() == '') {
            input.addClass(settings.placeholderClass);
            input.val(input.attr('placeholder'));
          }
        }).blur().parents('form').submit(function() {
          $(this).find('[placeholder]').each(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
              input.val('');
            }
          });
        });
      } else {
        // Doesn't work with datepicker
        // Can probably fix with binding to event
        var id = settings.hintName + '_' + i;
        var hint;
        var dummyInput;

        // grab the input's title attribute
        var text = $(this).attr('placeholder');

        // create a dummy input and place it before the input
        $('<input type="text" id="' + id + '" value="" />').insertBefore($(this));

        // set the dummy input's attributes
        hint = $(this).prev('input:first');
        hint.attr('class', $(this).attr('class'));
        hint.attr('size', $(this).attr('size'));
        hint.attr('autocomplete', 'off');
        hint.attr('tabIndex', $(this).attr('tabIndex'));
        hint.addClass(settings.hintClass);
        hint.val(text);

        // hide the input
        $(this).hide();
        $(this).addClass(settings.placeholderClass);

        // don't allow autocomplete (sorry, no remember password)
        $(this).attr('autocomplete', 'off');

        // bind focus event on the dummy input to swap with the real input
        hint.focus(function(){
          dummyInput = $(this);
          $(this).next('input:first')
            .removeClass(settings.placeholderClass)
            .show()
            .focus()
            .unbind('blur')
            .blur(function(){
              if ($(this).val() == '') {
                $(this).hide();
                dummyInput.show();
              }
            });
          $(this).hide();
        });

        // swap if there is a default value
        if ($(this).val() !== ''){
          hint.focus();
        };

        $(this).parents('form').submit(function () {
          $(this).find('.' + settings.hintClass).remove();
        });
      }
  });
 };
})(jQuery);
