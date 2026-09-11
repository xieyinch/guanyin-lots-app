package space.glass.divination

import android.app.WallpaperColors
import android.app.WallpaperManager
import android.os.Build
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Exposes the device wallpaper's derived accent colors (Material You) to JS.
 * Only meaningful on Android 12+ (API 31+). On older devices or when the
 * wallpaper has no colors set, it falls back to zeros, letting JS pick a
 * baked-in palette.
 */
class WallpaperColorModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "GlassDynamicColors"

    @ReactMethod
    fun getColors(promise: Promise) {
        try {
            val map = Arguments.createMap()
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val wm = WallpaperManager.getInstance(reactApplicationContext)
                val colors = wm.getWallpaperColors(WallpaperManager.FLAG_SYSTEM)
                map.putInt(
                    "primary",
                    colors?.primaryColor?.toArgb() ?: 0
                )
                map.putInt(
                    "secondary",
                    colors?.secondaryColor?.toArgb() ?: 0
                )
                map.putInt(
                    "tertiary",
                    colors?.tertiaryColor?.toArgb() ?: 0
                )
            } else {
                map.putInt("primary", 0)
                map.putInt("secondary", 0)
                map.putInt("tertiary", 0)
            }
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("WALLPAPER_ERROR", e)
        }
    }
}