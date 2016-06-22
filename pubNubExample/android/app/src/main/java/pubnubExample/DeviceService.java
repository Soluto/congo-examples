package pubnubExample;


import android.util.Log;

import com.jaredrummler.android.processes.AndroidProcesses;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import rx.Observable;
import rx.Subscriber;

public class DeviceService {

    //region ...
    public Observable<String> getTime() {
        return Observable.interval(1000, TimeUnit.MILLISECONDS)
                .map(t -> new Date().toString())
                .doOnSubscribe(() -> Log.i("meetup", "getTime -> subscribe " + UUID.randomUUID()))
                .doOnUnsubscribe(() -> Log.i("meetup", "getTime -> unsubscribe " + UUID.randomUUID()));
    }
    //endregion

    //region ...
    public Observable<Integer> getRunningProcessesCount() {
        return Observable.interval(500, TimeUnit.MILLISECONDS)
                .flatMap(aLong -> Observable.just(AndroidProcesses.getRunningProcesses()))
                .map(List::size)
                .distinctUntilChanged()
                .doOnSubscribe(() -> Log.i("meetup", "getRunningProcessesCount -> subscribe " + UUID.randomUUID()))
                .doOnUnsubscribe(() -> Log.i("meetup", "getRunningProcessesCount -> unsubscribe " + UUID.randomUUID()));
    }
    //endregion

    //region ...
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