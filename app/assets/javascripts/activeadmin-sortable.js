(function($) {
  function sortableInitializer() {
    $('.handle').closest('tbody').activeAdminSortable();
  }

  $(sortableInitializer);
  $(document).on('turbolinks:load', sortableInitializer);

  function sortHelper(e, tr)
  {
    var $originals = tr.children();
    var $helper = tr.clone();
    $helper.children().each(function(index)
    {
      // Set helper cell sizes to match the original sizes
      $(this).outerWidth($originals.eq(index).outerWidth());
    });
    return $helper;
  }

  $.fn.activeAdminSortable = function() {
    this.sortable({
      helper: sortHelper,
      update: function(event, ui) {
        var elem = ui.item.find('[data-sort-url]'),
          url = elem.data('sort-url'),
          fromPos = elem.data('position'),
          order = elem.data('order') || 'asc',
          toPos;

        // Find the new position of the moved element through the new position of the kicked out element.
        toPos = ui.item.next().find('[data-position]').data('position');
        if (toPos === undefined || (order == 'asc' && toPos > fromPos) || (order == 'desc' && toPos < fromPos)) {
          toPos = ui.item.prev().find('[data-position]').data('position');
        }

        $.ajax({
          url: url,
          type: 'post',
          data: { position: toPos },
          success: function() { window.location.reload() }
        });
      }
    });

    this.disableSelection();
  }
})(jQuery);
