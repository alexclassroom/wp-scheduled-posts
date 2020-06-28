<?php
include WPSCP_INCLUDES_DIR_PATH . 'integration/socialmedia/vendor/autoload.php';

use myPHPNotes\LinkedIn;
use DirkGroenen\Pinterest\Pinterest;

if (!class_exists('WpScp_Integration')) {
    class WpScp_Integration
    {
        public function __construct()
        {
            $this->define_constants();
            $this->load_dependancy();
            $this->load_third_party_integration();
            $this->instant_social_share();
        }
        /**
         * Define WC Constants.
         */
        private function define_constants()
        {
            // facebook
            $this->define('WPSCP_FACEBOOK_APP_ID', '2550061111706782');
            $this->define('WPSCP_FACEBOOK_APP_SECRET', '8bfa7101ac90a6cafd37d260a54c195b');
            $this->define('WPSCP_FACEBOOK_OPTION_NAME', 'wpscp_facebook_account');
            $this->define('WPSCP_FACEBOOK_SCOPE', 'publish_pages,manage_pages,publish_to_groups');
            // twitter
            $this->define('WPSCP_TWITTER_API_KEY', 'mN2t8LSxPAbp989EyeEL8GGdP');
            $this->define('WPSCP_TWITTER_API_SECRET_KEY', 'vbpvkuYbSOkueDLiaho047vMs4TY6V3j6qS1Qfwbi5skooMNp1');
            $this->define('WPSCP_TWITTER_OPTION_NAME', 'wpscp_twitter_account');
            // linkedin
            $this->define('WPSCP_LINKEDIN_CLIENT_ID', '78iadscla7c407');
            $this->define('WPSCP_LINKEDIN_CLIENT_SECRET', 'fwYuo1rXKQdahIL7');
            $this->define('WPSCP_LINKEDIN_SCOPE', 'r_emailaddress r_liteprofile w_member_social');
            $this->define('WPSCP_LINKEDIN_OPTION_NAME', 'wpscp_linkedin_account');
            // pinterest
            $this->define('WPSCP_PINTEREST_APP_ID', '5078354275936023710');
            $this->define('WPSCP_PINTEREST_APP_SECRET', '88ced81e088c6c2e4c0ba60701bec5bf892a7f3f22f2a6fa1e1f5ed6c7ed1f93');
            $this->define('WPSCP_PINTEREST_OPTION_NAME', 'wpscp_pinterest_account');
            // Midleware
            $this->define('WPSCP_SOCIAL_OAUTH2_TOKEN_MIDDLEWARE', 'https://api.schedulepress.com/callback.php');
        }
        /**
         * Define constant if not already set.
         *
         * @param string      $name  Constant name.
         * @param string|bool $value Constant value.
         */
        private function define($name, $value)
        {
            if (!defined($name)) {
                define($name, $value);
            }
        }
        public function load_dependancy()
        {
            include WPSCP_INCLUDES_DIR_PATH . 'integration/class-wpscp-social-multi-profile.php';
        }
        public function load_third_party_integration()
        {
            if (get_option('wpsp_twitter_integration_status') == 'on') {
                $this->twitter();
            }
            if (get_option('wpsp_facebook_integration_status') == 'on') {
                $this->facebook();
            }
            if (get_option('wpsp_linkedin_integration_status') == 'on') {
                $this->linkedin();
            }

            if (get_option('wpsp_pinterest_integration_status') == 'on') {
                $this->pinterest();
            }
        }



        public function facebook()
        {
            include WPSCP_INCLUDES_DIR_PATH . 'integration/class-wpscp-facebook.php';
        }
        public function twitter()
        {
            include WPSCP_INCLUDES_DIR_PATH . 'integration/class-wpscp-twitter.php';
        }
        public function linkedin()
        {
            include WPSCP_INCLUDES_DIR_PATH . 'integration/class-wpscp-linkedin.php';
        }
        public function instagram()
        {
            include WPSCP_INCLUDES_DIR_PATH . 'integration/class-wpscp-instagram.php';
        }
        public function pinterest()
        {
            include WPSCP_INCLUDES_DIR_PATH . 'integration/class-wpscp-pinterest.php';
        }
        public function instant_social_share()
        {
            include WPSCP_INCLUDES_DIR_PATH . 'integration/instantshare/class-wpscp-instantshare.php';
        }
    }
    new WpScp_Integration();
}