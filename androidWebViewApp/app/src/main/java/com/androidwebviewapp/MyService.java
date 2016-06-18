package com.androidwebviewapp;

import java.util.concurrent.TimeUnit;

import rx.Observable;
import rx.functions.Func1;

public class MyService {

    public String someMethod() {
        return "Hello World";
    }

    public Observable<String> streamThatNeverEnds() {
        return Observable.interval(2, TimeUnit.SECONDS).map(new Func1<Long, String>() {
            @Override
            public String call(Long aLong) {
                return "STREAM_THAT_NEVER_ENDS " + aLong;
            }
        });
    }

    public Observable<String> streamThatEnds() {
        return Observable.interval(2, TimeUnit.SECONDS).map(new Func1<Long, String>() {
            @Override
            public String call(Long aLong) {
                return "STREAM_THAT_ENDS " + aLong;
            }
        }).take(5);
    }
}
