# remoraj-trace-ui
Visualize remoraj traces, stack traces.

RemoraJ monitors java apps by tracking IPC calls, and if the option "sendStackTrace" is enabled, it will collect the stackTraces for your application.

This is overhead cost-effective way to visualise your application behavior. Instead of instrumenting all methods, remoraJ will do only IPC calls such as: HTTP, WebServices, JMS, JDBC, Sockets, WebSockets, Kafka, I/O Streams and more.
This is usually called by methods you may want to inspect further. 

The graph visualise multiple method call stack traces. By default it fetches 50 event. All methods are displayed as nodes, and the interaction between is displayed as edge. As node represents single method from particular class, the enge represents call from that method to another method, the more edges exist, mean s more call's fallowed particular path.


# Prerequisites 

To run this add-on you need node-js.

# Running 

    * Step 1:  Obtain your account with [Nastel XRay](https://xray.nastel.com/xray/Nastel/login.jsp). Make sure to get your streaming access token.
    * Step 2:  Collect traces using [remoraJ[(https://github.com/Nastel/remoraj)
    * Step 3:  run `ng serve --open`; this will build, deploy and open browser;
    * Step 4:  open menu on the right of your screen (...) and fill in the XRay Token you'd collected on step 1  
 
# Selecting the displayed methods

First input box from the top is to select the events's you're interested. It's standard XRay JKL query language, except common part removed from the query:

so you type `eventName='executeQuery'` the application converts it to `get events where eventName='executeQuery.`

# Selecting the interested methods/classes/packages

On the second input box you can query displayed graph for quickly selecting interested methods/classes/packages.
Just type in the part you know and it will mark red the matching nodes. Hit clear if you done.

I.e. in the displayed method call tree you want to find all mysql calls, type "mysql" in mark input box and click "mark", the application will mark all nodes containing "mysql". In case that's event too broad hit a node and click on the package/or class you want to select. So if you want to filter all from "com.mysql.jdbc.ConnectionImpl", click on word "ConnectionImpl" and the app will fill in mark input box for your convenience as "com.mysql.jdbc.ConnectionImpl". If you click on "jdbc" the mark field will be filled as "com.mysql.jdbc" accordingly.
 


    
