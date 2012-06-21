


    <!-- soundManager.useFlashBlock: related CSS -->
    <link rel="stylesheet" type="text/css" href="soundmanager/demo/flashblock/flashblock.css" />

    <!-- required -->
    <link rel="stylesheet" type="text/css" href="soundmanager/demo/360-player/360player.css" />
    <link rel="stylesheet" type="text/css" href="soundmanager/demo/360-player/360player-visualization.css" />

    <!-- special IE-only canvas fix -->
    <!--[if IE]><script type="text/javascript" src="script/excanvas.js"></script><![endif]-->

    <!-- Apache-licensed animation library -->
    <script type="text/javascript" src="soundmanager/demo/360-player/script/berniecode-animator.js"></script>

    <!-- the core stuff -->
    <!-- // <script type="text/javascript" src="soundmanager/script/soundmanager2.js"></script> -->
    <!-- // <script type="text/javascript" src="soundmanager/demo/360-player/script/360player.js"></script> -->


<script type="text/javascript">

/*
 * Firstly, define SM2_DEFER and set it to true *before* we load soundmanager2.js.
 * This prevents the SoundManager() constructor from being called immediately.
 * SM2_DEFER should be assigned within the global scope.
*/

window.SM2_DEFER = true;

</script>

<!-- Now, load soundmanager2.js as we normally would. -->
<script type="text/javascript" src="soundmanager/script/soundmanager2.js"></script>
    <!-- Basic button -->
    <link rel="stylesheet" type="text/css" href="soundmanager/demo/mp3-player-button/css/mp3-player-button.css" />
    <script type="text/javascript" src="soundmanager/demo/mp3-player-button/script/mp3-player-button.js"></script>

<!-- "Some time later", window.onload() may have fired and you now want to start SM2, etc... -->
<script type="text/javascript">

// for example purposes, we'll wait until window.onload before starting things.
window.onload = function() {

  /*
   * Now that the SM2 constructor is defined, you can call the constructor,
   * set the options and "kick-start" SM2's init process, and it should work as normal.
   * WARNING: Do not call beginDelayedInit() before "DOM ready", or things will fail.
  */

  // construct the instance (must be named soundManager, and scoped globally)
  window.soundManager = new SoundManager();

  // assign flash url, flashVersion and other SM2 options as usual
  soundManager.url = 'soundmanager/swf/';
  soundManager.flashVersion = 9;
  // etc...

  // finally, kick-start the init process.
  // (old IE etc. may miss domloaded/ready/window.load if they've already fired.)
  soundManager.beginDelayedInit();

}

</script>