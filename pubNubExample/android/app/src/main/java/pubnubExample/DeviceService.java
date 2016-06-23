//region ...
package pubnubExample;


import android.util.Log;

import com.jaredrummler.android.processes.AndroidProcesses;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import rx.Observable;
import rx.Subscriber;
import rx.functions.Action1;
//endregion

public class DeviceService {

    //region _
    public DeviceService() {
        Observable.interval(1500, TimeUnit.MILLISECONDS)
                .subscribe(aLong -> {
                    Log.i("example", "something important happened " + UUID.randomUUID());
                    Log.w("example", "I warn you! " + UUID.randomUUID());
                    Log.e("example", "Unexpected error... " + UUID.randomUUID());
                });
    }
    //endregion

    //region Time
    public Observable<String> getTime() {
        return Observable.interval(1000, TimeUnit.MILLISECONDS)
                .map(t -> new Date().toString());
    }
    //endregion

    //region Process Count
    public Observable<Integer> getRunningProcessesCount() {
        return Observable.interval(500, TimeUnit.MILLISECONDS)
                .flatMap(aLong -> Observable.just(AndroidProcesses.getRunningProcesses()))
                .map(List::size)
                .distinctUntilChanged();
    }
    //endregion

    //region Logs
    LogHandler logHandler;
    public Observable<String> getLogs() {
        return Observable.create(new Observable.OnSubscribe<String>() {
            @Override
            public void call(final Subscriber<? super String> subscriber) {
                logHandler = new LogHandler() {
                    @Override
                    public void onLineAdd(String line) {
                        subscriber.onNext(line);
                    }
                };
            }
        })
        .doOnUnsubscribe(() -> logHandler.stop());
    }
    //endregion
}