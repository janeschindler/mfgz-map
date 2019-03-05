<?php

/*
Plugin Name: mfgz map
Plugin URI:
Description: mfgz map
*/

function location_field() {
  global $post_type;
	global $post;
	$my_screen = get_current_screen();
  if($post_type == 'objekt' && $my_screen->base == 'post' || $post_type == 'ausstellungstexte' && $my_screen->base == 'post'){
		wp_enqueue_script('google-maps', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBjH_xjqK203t5C_MkDxQRgYkoSKXfFakk', array(), time());
    wp_enqueue_script('museum-indoor-map', plugins_url('museum-map.js', __FILE__), array('jquery','google-maps'), time());
		wp_enqueue_style('map-styles', plugins_url('map-styles.css', __FILE__), array(), time());
	}
}

add_action('admin_enqueue_scripts', 'location_field');

function location_field_frontend() {
		wp_register_script('google-maps', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBjH_xjqK203t5C_MkDxQRgYkoSKXfFakk', array(), time());
    wp_register_script('museum-indoor-map', plugins_url('museum-map.js', __FILE__), array('jquery','google-maps'), time());
		wp_register_style('map-styles', plugins_url('map-styles.css', __FILE__), array(), time());
  global $post_type;
  global $post;
	if(!empty($post) && $post->ID == 1316 || !empty($post) && $post->post_type == 'ausstellungstexte' || (get_bloginfo() == "Museum für Gestaltung Zürich" && ( isset($post) && $post->ID == 5323 ) OR $post_type == 'standort'  ) || (get_bloginfo() == "Museum für Gestaltung eGuide" && get_queried_object()->slug == "themenweg-landesmuseum-mfgz") || (get_bloginfo() == "Museum für Gestaltung eGuide" && get_queried_object()->slug == "themenweg-mfgz-landesmuseum") ){
		wp_enqueue_script('google-maps');
    wp_enqueue_script('museum-indoor-map');
		wp_enqueue_style('map-styles');
	}
}

add_action('wp_enqueue_scripts', 'location_field_frontend');

/*needed for repeater field from cmb2*/

/**
 * Get the bootstrap!
 */
if ( file_exists(  __DIR__ . '/cmb2/init.php' ) ) {
  require_once  __DIR__ . '/cmb2/init.php';
} elseif ( file_exists(  __DIR__ . '/CMB2/init.php' ) ) {
  require_once  __DIR__ . '/CMB2/init.php';
}

/**
 * Define the metabox and field configurations.
 */
function _location_field_metabox()  {

  // Start with an underscore to hide fields from custom fields list
  $prefix = '_objekt_';

  //objekt numer from mfgz
   $location_box = new_cmb2_box( array(
       'id'            => 'location-box',
       'title'         => __( 'Standort', 'cmb2' ),
       //'remove_box_wrap' => true,
       'object_types'  => array( 'objekt', 'ausstellungstexte' ), // Post type
       'context'       => 'normal',
       'priority'      => 'high',
       'show_names'    => true, // Show field names on the left
   ) );

    $location_box->add_field( array(
      'name'         => __( 'Standort Nummer', 'cmb2' ),
      'id'           => $prefix . 'standort-nummer',
      'type'         => 'text'
    ) );
       
    $location_box->add_field( array(
      'name'         => __( 'Standort', 'cmb2' ),
      'id'           => $prefix . 'location',
      'type'         => 'text',
			'render_row_cb' => 'text_with_map',
    ) );

}

if(get_bloginfo() == "Museum für Gestaltung eGuide"){
	add_action( 'cmb2_admin_init', '_location_field_metabox' );
}

function text_with_map( $field_args, $field ) {
	$id          = $field->args( 'id' );
	$label       = $field->args( 'name' );
	$name        = $field->args( '_name' );
	$value       = $field->escaped_value();
	$description = $field->args( 'description' );
	?>
	<div class="custom-field-row">
		<p><label for="<?php echo $id; ?>"><?php echo $label; ?></label></p>
		<p><input id="<?php echo $id; ?>" type="text" name="<?php echo $name; ?>" value="<?php echo $value; ?>"/></p>
		<p class="description"><?php echo $description; ?></p>
	</div>

	<?php map_with_controls(); ?>

</div>

<?php } 
	function map_with_controls(){
?>
  <div class="map-container <?php if(is_admin() == true){ print "de"; } ?>">
    <div id="map"></div>
    <div id="floor-control">
      <div class="floor-button"><div class="floorplan-ug"><?php 
				if(is_admin() == true){
					print qtranxf_use('de', '[:de]UG[:en]BF[:fr]SS[:]');
				}else{
					print __('[:de]UG[:en]BF[:fr]SS[:]'); 
				}
			?></div></div>
      <div class="floor-button active"><div class="floorplan-eg"><?php 
				if(is_admin() == true){
					print qtranxf_use('de', '[:de]EG[:en]GF[:fr]RC[:]');
				}else{
					print __('[:de]EG[:en]GF[:fr]RC[:]'); 
				}
			?></div></div>
      <div class="floor-button"><div class="floorplan-1">1</div></div>
      <div class="floor-button"><div class="floorplan-2">2</div></div>
    </div>
		<div id="locator-tool" class="">
			<div class="floor-button"><div class="geolocate mfgz-sym">2</div></div>
		</div>
  </div>

  <div class="info-windows">
  <div class="info-window info-ausstellungsstr" id="info-ausstellungsstr">
    <div class="info-window-title">Ausstellungsstrasse</div>
    <div class="map-address">Ausstellungsstrasse 60<br>8005 Zürich</div>
    <div class="see-floorplan"><?php 
				if(is_admin() == true){
					print qtranxf_use('de', '[:de]Museumsplan[:en]Museum map[:fr]Carte du musée[:]');
				}else{
					print __('[:de]Museumsplan[:en]Museum map[:fr]Carte du musée[:]'); 
				}
			?>
		</div>
  </div>
  <div class="info-window info-toni" id="info-toni">
    <div class="info-window-title">Toni-Areal</div>
    <div class="map-address">Pfingstweidstrasse 94<br>8005 Zürich</div>
  </div>
  <div class="info-window info-plc" id="info-plc">
    <div class="info-window-title">Pavillon Le Corbusier</div>
    <div class="map-address">Höschgasse 8<br>8008 Zürich</div>
    <div class="see-floorplan"><?php 
				if(is_admin() == true){
					print qtranxf_use('de', '[:de]Museumsplan[:en]Museum map[:fr]Carte du musée[:]');
				}else{
					print __('[:de]Museumsplan[:en]Museum map[:fr]Carte du musée[:]'); 
				}
			?>
		</div>
  </div>
  </div>

<?php	}
?>
