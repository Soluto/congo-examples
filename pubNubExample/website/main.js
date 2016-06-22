import {Observable} from "rx";
Observable.prototype.retryUntilResponse = function(timeout, retryCount) {
    return Observable.amb(this.materialize(), Observable.throw("").delaySubscription(timeout))
        .retry(retryCount)
        .dematerialize();
};
import {DOM} from "rx-dom";
import deviceService from './deviceService';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Clock
var startClockClicks = DOM.click(document.querySelector("#startTime"));
var stopClockClicks = DOM.click(document.querySelector("#stopTime"));
var timeView = document.querySelector("#timeView");

//const getTime = () => Observable.interval(1000).map(() => new Date());
const getTime = () => deviceService.getTime().retryUntilResponse(5000, 10);

startClockClicks
    .flatMap(() => getTime())
    .takeUntil(stopClockClicks)
    .map(time => timeView.innerText = time)
    .repeat()
    .subscribe();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Process Count
var processCountStartClicks = DOM.click(document.querySelector("#startProcessCount"));
var processCountStopClicks = DOM.click(document.querySelector("#stopProcessCount"));
var processCountView = document.querySelector("#processCount");

const getProcessCount = () => Observable.interval(1000).map(() => parseInt(Math.random()*100));
//const getProcessCount = () => deviceService.getRunningProcessesCount().retryUntilResponse(5000, 10);

processCountStartClicks
    .flatMap(() => getProcessCount())
    .distinctUntilChanged()
    .takeUntil(processCountStopClicks)
    .map(processCount => processCountView.innerHTML = processCount)
    .repeat()
    .subscribe();


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Logs
var logStartClicks = DOM.click(document.querySelector("#startLogs"));
var logStopClicks = DOM.click(document.querySelector("#stopLogs"));
var logView = document.querySelector("#logsView");

const getLogs = () => Observable.interval(1000).map((x) => `${x}.this is a log line`);
//const getLogs = () => deviceService.getLogs().retryUntilResponse(5000, 10);

const buildLogsHtml = (logs)=>logs.map(log=> `<li>${log}</li>`).join("");

var logs = logStartClicks
    .flatMap(getLogs)
    .distinct()
    .scan((acc, next)=> [next, ...acc], [])
    .takeUntil(logStopClicks)
    .repeat();

logs.map(logs=> buildLogsHtml(logs))
    .subscribe(html => logView.innerHTML = html);


/*
 var logFiltersChange = DOM.keyup(document.querySelector("#logsFilter"));

 var logsFilter = logFiltersChange
 .map(e=> e.target.value)
 .startWith("")
 .debounce(300).distinctUntilChanged();

 Observable
 .combineLatest(logs,logsFilter, (logs, logsFilter)=> logs.filter(log=> log.includes(logsFilter)))
 .map(logs=> buildLogsHtml(logs))
 .subscribe(html => logView.innerHTML = html);

 */
