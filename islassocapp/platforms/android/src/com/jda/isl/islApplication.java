package com.jda.isl;

import com.jda.mobility.HybridApplication;
import com.jda.mobility.MobileToolsApplication;
import com.jda.mobility.application.MainApplication;

public class islApplication extends HybridApplication {
    @Override
    public void onCreate() {
        super.onCreate();

        MobileToolsApplication.launch(this, getString(R.string.app_name));
        MobileToolsApplication.setUseLocalTabsJson(true);
        MobileToolsApplication.setUseEmbeddedAppCode(true);
        MainApplication._userAccount.setAutoDetect(true);
    }
}
