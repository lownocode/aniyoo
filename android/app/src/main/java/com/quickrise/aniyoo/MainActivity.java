package com.quickrise.aniyoo;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import android.content.Intent;
import android.content.res.Configuration;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashTheme, true);
    super.onCreate(savedInstanceState);
  }

  @Override
    public void onConfigurationChanged(Configuration newConfig) {
      super.onConfigurationChanged(newConfig);
      Intent intent = new Intent("onConfigurationChanged");
      intent.putExtra("newConfig", newConfig);
      this.sendBroadcast(intent);
  }

  @Override
  protected String getMainComponentName() {
    return "aniyoo";
  }
}
