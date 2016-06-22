package pubnubExample;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import com.pubnub.api.PNConfiguration;

import guy.testproject.R;
import soluto.congo.core.ControllerHandler;
import soluto.congo.core.RemoteCallListener;
import soluto.congo.core.RemoteCallResponder;
import soluto.congo.core.Router;
import soluto.congo.pubnub.PubNubRemoteCallListener;
import soluto.congo.pubnub.PubNubRemoteCallResponder;

public class MainActivity extends AppCompatActivity {

    Router router;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        PNConfiguration pnConfiguration = new PNConfiguration();
        pnConfiguration.setPublishKey("pub-c-4ccbfeff-cdb1-497a-a00c-2f01f367ff64");
        pnConfiguration.setSubscribeKey("sub-c-ba17d4ee-2f0d-11e6-9327-02ee2ddab7fe");

        RemoteCallListener listener = new PubNubRemoteCallListener(pnConfiguration, "request_b4d5b93c-9a0a-4386-b1b4-0e7d6be4e7d2");
        RemoteCallResponder responder = new PubNubRemoteCallResponder(pnConfiguration, "response_b4d5b93c-9a0a-4386-b1b4-0e7d6be4e7d2");

        router = new Router(listener, responder);
        router.use(new ControllerHandler("someService", new DeviceService()));
        router.listen();
    }

    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        router.shutdown();
    }
}
