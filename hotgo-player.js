/*
 Require:
    mobile-detect: <script src="//cdnjs.cloudflare.com/ajax/libs/mobile-detect/1.3.2/mobile-detect.min.js"></script>
    jwplayer: 	   <script type="text/javascript" src="http://content.jwplatform.com/libraries/8cRCwCjK.js"></script>
*/

/*
    config = {
		title:,
		video: {
			    primary: {url: , type:},
			    low_quality:  {url: , type:, label: },
			    medium_quality: {url: , type:, label: },
			    high_quality: {url: , type:, label: },	
		       },
		image:,
		width:,
		aspectratio:
		tracks: [
		    { file: '',
		      label: '',
		      kind: '',
		    },
		]
		captions: {},
	      }
 */

var player_version = 'HotGo Player v0.1 @2016';

var jw_player_configure = function(config) {

    var player_config;    

    player_config = {
	abouttext: player_version,
	aboutlink: 'www.hotgo.tv',
	primary: 'html5',
    }
    if ('title' in config) {
	player_config['title'] = config.title;
    }
    if ('image' in config) {
	player_config['image'] = config.image;
    }
    if ('aspectratio' in config) {
	player_config['aspectratio'] = config.aspectratio;
    }
    if ('width' in config) {
	player_config['width'] = config.width;
    }
    if ('tracks' in config) {
	player_config['tracks'] = config.tracks;
    }
    if ('captions' in config) {
	player_config['captions'] = config.captions;
    }
    if ('skin' in config) {
	player_config['skin'] = config.skin;
    }
	
    return player_config;
}

var primary = function(config) {

    var player_config;    

    player_config = jw_player_configure(config);

    player_config['sources'] = [{file: config.video.primary.url,
	    			 type: config.video.primary.type,
	    		         'default': 'true' }];

    return player_config;
}



var low_quality_first = function(config) {

    var player_config;

    player_config = jw_player_configure(config);
    player_config['sources'] = [{file: config.video.low_quality.url,
	    		        type: config.video.low_quality.type,
				label: config.video.low_quality.label,
	                        'default': 'true' },
				{file: config.video.medium_quality.url,
	    		        type: config.video.medium_quality.type,
				label: config.video.medium_quality.label,
	                        'default': 'false' },
		               {file: config.video.high_quality.url,
	    			type: config.video.high_quality.type,
				label: config.video.high_quality.label,
	    			'default': 'false' }
	    		      ];
    return player_config;
}

var high_quality_first = function(config) {
    var player_config;

    player_config = jw_player_configure(config);
    player_config['sources'] = [{file: config.video.low_quality.url,
	    		        type: config.video.low_quality.type,
				label: config.video.low_quality.label,
	                        'default': 'false' },
				{file: config.video.medium_quality.url,
	    		        type: config.video.medium_quality.type,
				label: config.video.medium_quality.label,
	                        'default': 'false' },
		               {file: config.video.high_quality.url,
	    			type: config.video.high_quality.type,
				label: config.video.high_quality.label,
	    			'default': 'true' }
	    		      ];
    return player_config;

}


var HotgoPlayer   = function(element, config)
{
    var md     = new MobileDetect(window.navigator.userAgent);
    jw_player  = jwplayer(element);
    var mobile;
    

    if (md.mobile() || md.phone() || md.tablet())
    {
	mobile = true;
    }
    else
    {
	mobile = false;
    }

    
    this.player_config = primary(config);
    
    this.start = function() {
	this.player_instance = jw_player;
	/*
	 * Load the Jw Player Setup
	 */
	jw_player.setup(this.player_config);
	
	jw_player.once('setupError', function(error) {
	    console.log(error);
	    if (mobile) {
		console.log(config);
		jw_player.setup(low_quality_first(config));
	    }
	    else {
		console.log(config);
		jw_player.setup(high_quality_first(config));
	    }
	});

	jw_player.once('error', function(error) {
	    console.log(error);
	    if (mobile) {
		jw_player.load(low_quality_first(config));    
	    }
	    else {
		console.log(config);
		jw_player.load(high_quality_first(config));
	    }
	    jw_player.play();
	});
    }
}