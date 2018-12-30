// Masonry
function reloadMason() {
  var $grid = $('.grid').masonry({
    itemSelector: '.grid-item', // use a separate class for itemSelector, other than .col-
    columnWidth: '.grid-sizer',
    percentPosition: true,
    transitionDuration: '2.5s'
  });

  $grid.imagesLoaded().progress( function() {
    $grid.masonry();
  });
}

reloadMason();

// Lightbox
lightbox.option({
  'showImageNumberLabel': true,
  disableScrolling: true
});


// Filter
$(document).ready(function() {
  // fade each image when user hovers
  $(".grid-item").hover(
    function() {
      $(this).fadeTo("slow", 0.7);
    }, function() {
      $(this).fadeTo("slow", 1);
    }
  );

  //toggle content menu when button is clicked
  // $(".gallery-button").click(function(event) {
  //   event.preventDefault();
  //   $(".gallery-menu").slideToggle();
  // });

  var $events = $(".events");
  var $workshops = $(".workshops");
  var $swag = $(".swag");
  var $contents = $(".menu li a");

  // FILTER by CONTENT
  $contents.click(function(event) {
    event.preventDefault();
    $contents.css("color", "white");
    $(this).css("color", "steelblue");
    var $clickedContent = $(this).attr("id");
    var $clickedContentSpaced = $clickedContent.replace("-", " ");
    $("#current-content").text($clickedContentSpaced);
    switch($clickedContent) {
      case "all":
        $(".events, .workshops, .swag").fadeIn("slow");
          $(".grid-item a").attr("data-lightbox", "images");
        break;
      case "events":
      if ($events.css("display") === "none") {$events.fadeIn("slow");}
        $(".workshops, .swag").hide();
        $(".events a").attr("data-lightbox", $clickedContent);
        break;
      case "workshops":
      if ($workshops.css("display") === "none") {$workshops.fadeIn("slow");}
        $(".events, .swag").hide();
        $(".workshops a").attr("data-lightbox", $clickedContent);
        break;
      case "swag":
      if ($swag.css("display") === "none") {$swag.fadeIn("slow");}
        $(".events, .workshops").hide();
        $(".swag a").attr("data-lightbox", $clickedContent);
        break;
    }
    reloadMason();
  });

});
