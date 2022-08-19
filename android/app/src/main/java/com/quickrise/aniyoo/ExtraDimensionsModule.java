package com.quickrise.aniyoo; 

import android.content.Context;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.lang.reflect.InvocationTargetException;
import java.util.Map;
import java.util.HashMap;

public class ExtraDimensionsModule extends ReactContextBaseJavaModule {
    private ReactContext mReactContext;

    ExtraDimensionsModule(ReactApplicationContext context) {
        super(context);

        mReactContext = context;
    }

    @Override
    public String getName() {
        return "ExtraDimensions";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants =  new HashMap<>();

        final Context ctx = getReactApplicationContext();
        final DisplayMetrics metrics = ctx.getResources().getDisplayMetrics();

        if (Build.VERSION.SDK_INT >= 17) {
            Display display = ((WindowManager) mReactContext.getSystemService(Context.WINDOW_SERVICE)).getDefaultDisplay();
            
            try {
                Display.class.getMethod("getRealMetrics", DisplayMetrics.class).invoke(display, metrics);
            } catch (InvocationTargetException e) {
            } catch (IllegalAccessException e) {
            } catch (NoSuchMethodException e) {
            }
        }

        constants.put("SOFT_BAR_MENU_HEIGHT", getSoftMenuBarHeight(metrics));

        return constants;
    }

    private boolean hasPermanentMenuKey() {
        final Context ctx = getReactApplicationContext();
        int id = ctx.getResources().getIdentifier("config_showNavigationBar", "bool", "android");

        return !(id > 0 && ctx.getResources().getBoolean(id));
    }

    private float getSoftMenuBarHeight(DisplayMetrics metrics) {
        if(hasPermanentMenuKey()) {
            return 0;
        }

        final Context ctx = getReactApplicationContext();
        final int heightResId = ctx.getResources().getIdentifier("navigation_bar_height", "dimen", "android");
        
        return heightResId > 0 ? ctx.getResources().getDimensionPixelSize(heightResId) / metrics.density : 0;
    }
}