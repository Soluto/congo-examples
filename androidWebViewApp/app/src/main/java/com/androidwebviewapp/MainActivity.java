package com.androidwebviewapp;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

import rx.android.schedulers.AndroidSchedulers;
import rx.schedulers.Schedulers;
import soluto.congo.android.webview.AndroidWebViewRemoteCallListener;
import soluto.congo.android.webview.AndroidWebViewRemoteCallResponder;
import soluto.congo.core.ControllerHandler;
import soluto.congo.core.RemoteCallListener;
import soluto.congo.core.RemoteCallResponder;
import soluto.congo.core.Router;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        WebView webView = (WebView) findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();
        WebView.setWebContentsDebuggingEnabled(true);
        webSettings.setJavaScriptEnabled(true);

        RemoteCallListener listener = new AndroidWebViewRemoteCallListener(Schedulers.computation());
        RemoteCallResponder responder = new AndroidWebViewRemoteCallResponder(webView, AndroidSchedulers.mainThread());

        webView.addJavascriptInterface(listener, "bridge");
        Router router = new Router(listener, responder);
        router.use(new ControllerHandler("myService", new MyService()));
        router.listen();

        webView.loadUrl("file:///android_asset/webview/main.html");
    }
}