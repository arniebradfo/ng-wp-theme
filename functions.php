<?php

	function wpajax_theme_setup() {

		// load_theme_textdomain( 'wpajax', get_template_directory() . '/languages' );

		// add_theme_support( 'html5', array( 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption' ) );
		// add_theme_support( 'automatic-feed-links' );
		// add_theme_support( 'title-tag' );
		add_theme_support( 'post-formats', array( 'link', 'video', 'aside', 'audio', 'chat', 'gallery', 'image', 'quote', 'status' ) );
		add_post_type_support( 'post', 'post-formats' );
		add_post_type_support( 'page', 'post-formats' );

		// Nav Menus
		register_nav_menus( array(
			'primary'   => __( 'Navigation Menu', 'wpajax' ),
			'secondary' => __( 'Footer Menu', 'wpajax' ),
		) );

		// featured images aka thumbnails
		add_theme_support( 'post-thumbnails' );
 		set_post_thumbnail_size( 150, 150, true ); // default Post Thumbnail dimensions: 150px width x 150px height (cropped)
		update_option( 'thumbnail_size_w', 150 ); // don't depend on these 
		update_option( 'thumbnail_size_h', 150 ); // the size of these can be edited by the user

		// add image and manage image sizes
		add_image_size( 'small', 100 );
		update_option( 'medium_size_w', 300 ); // don't depend on these 
		update_option( 'medium_size_h', 300 ); // the size of these can be edited by the user
		update_option( 'medium_large_size_w', 768 );
		update_option( 'medium_large_size_h', 768 );	
		update_option( 'large_size_w', 1024 ); // don't depend on these 
		update_option( 'large_size_h', 1024 ); // the size of these can be edited by the user
		add_image_size( 'extralarge', 1600 );
		// more image sizes is good for page speed now that srcset is in wp core:
		// make.wordpress.org/core/2015/11/10/responsive-images-in-wordpress-4-4/

		// change option defaults - https://codex.wordpress.org/Option_Reference
		update_option('image_default_link_type', 'none');
		update_option('image_default_align', 'none');
		update_option('uploads_use_yearmonth_folders', 0); // keep all uploaded images in the same folder
		update_option('use_smilies', 0); // becasue fuck smiling >:( 

	}
	add_action( 'after_setup_theme', 'wpajax_theme_setup' );

	// Widgets
	// function wpajax_widget_setup() {
	// 	register_sidebar( array(
	// 		'name'          => __( 'Sidebar Widgets', 'wpajax' ),
	// 		'id'            => 'sidebar-primary',
	// 		'before_widget' => '<div id="%1$s" class="widget %2$s">',
	// 		'after_widget'  => '</div>',
	// 		'before_title'  => '<h3 class="widget-title">',
	// 		'after_title'   => '</h3>',
	// 	) );
	// }
	// add_action( 'widgets_init', 'wpajax_widget_setup' );

	// add custom css to style inside the tinyMCE editor
	function add_editor_styles() {
		add_editor_style(); // path defaults to editor-style.css
	}
	add_action( 'admin_init', 'add_editor_styles' );

    function shortcode_func( $atts, $content=null, $tag='' ) {
        $output = '<div data-component="'.$tag.'"';   // opening tag
        foreach($atts as $att => $val)
            $output .= $att.'="'.$val.'" ';           // echo all attributes from the shorcode
        $output .= '>';                               // close the opening tag
        $output .= do_shortcode($content);            // content
        $output .= '</div>';                          // closing tag
        return $output;
    }
    add_shortcode( 'ngwp-example', 'shortcode_func' );
    // add_shortcode( 'any-tag-name-you-want', 'shortcode_func' );

	remove_filter('the_content', 'wpautop');
	remove_filter('the_excerpt', 'wpautop');

	// register route to get page or post by slug
	// TODO: could be expanded to include 'parent-page/sub-page' slugs?
	register_rest_route( 'slug', '/(?P<slug>[a-zA-Z0-9_-]+)', array(
		array(
			'methods'  => WP_REST_Server::READABLE,
			'callback' => 'my_theme_get_content_by_slug',
		)
	) );

	function my_theme_get_content_by_slug( WP_REST_Request $request ) {

		$params = $request->get_params();
		$slug = $params['slug'];

		// if the slug is a post
		$post_or_page = 'post';
		$id = get_page_by_path( $slug, ARRAY_A, $post_or_page)['ID'];
		
		if ( ! $id ) {
			// if its not a post it might be a page
			$post_or_page = 'page';
			$id = get_page_by_path( $slug, ARRAY_A, $post_or_page)['ID'];
		}

		if ( ! $id ) {
			// still returned nothing
			$id = 99999;
		}

		$request['id'] = $id;
		$rest_controller = new WP_REST_Posts_Controller( $post_or_page );
		
		$response = $rest_controller->get_item( $request );

		return $response;
	
	}

?>
